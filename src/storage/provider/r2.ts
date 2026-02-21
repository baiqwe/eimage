import { env } from 'cloudflare:workers';
import {
  type FileMetadata,
  type R2BucketInterface,
  type StorageConfig,
  type UploadFileParams,
  type UploadFileResult,
  type ValidationResult,
  ConfigurationError,
  DEFAULT_USER_FILES_FOLDER,
  R2_ERROR_CODES,
  StorageError,
  UploadError,
} from '../types';

/**
 * Get R2 bucket binding (env.BUCKET)
 */
function getFilesBucket(): R2BucketInterface {
  const bucket = env.BUCKET;
  if (!bucket) {
    throw new ConfigurationError('R2 bucket binding BUCKET is not configured.');
  }
  return bucket;
}

const success = <T>(data: T): ValidationResult<T> => ({ success: true, data });
const fail = (error: string, code?: string): ValidationResult<never> => ({
  success: false,
  error,
  code,
});

/**
 * Sanitize filename to prevent path traversal and keep storage key safe
 */
function sanitizeFilename(filename: string): string {
  return filename.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 255);
}

/**
 * Create file validator from config (size + allowed types by extension)
 */
function createFileValidator(config: StorageConfig) {
  const { maxFileSize, allowedTypes } = config;

  return {
    validateFile(
      file: File | Blob,
      originalName: string
    ): ValidationResult<true> {
      const size = file.size;
      if (size > maxFileSize) {
        const maxMB = Math.round(maxFileSize / (1024 * 1024));
        return fail(
          `${R2_ERROR_CODES.FILE_TOO_LARGE} (max ${maxMB}MB)`,
          'FILE_TOO_LARGE'
        );
      }

      if (allowedTypes.length > 0 && originalName) {
        const ext =
          originalName.lastIndexOf('.') === -1
            ? ''
            : originalName
                .slice(originalName.lastIndexOf('.') + 1)
                .toLowerCase();
        const normalized = allowedTypes.map((t) =>
          t.startsWith('.') ? t.slice(1).toLowerCase() : t.toLowerCase()
        );
        if (!ext || !normalized.includes(ext)) {
          const formatted = allowedTypes
            .map((t) => (t.startsWith('.') ? t : `.${t}`))
            .join(', ');
          return fail(
            `${R2_ERROR_CODES.INVALID_FILE_TYPE}. Supported: ${formatted}`,
            'INVALID_FILE_TYPE'
          );
        }
      }

      return success(true);
    },
  };
}

function generateId(): string {
  return typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

/**
 * Cloudflare R2 storage provider
 */
export class R2Provider {
  private readonly bucket: R2BucketInterface;
  private readonly userFilesFolder: string;
  private validator: ReturnType<typeof createFileValidator>;

  constructor(config: StorageConfig) {
    this.bucket = getFilesBucket();
    this.userFilesFolder = config.userFilesFolder ?? DEFAULT_USER_FILES_FOLDER;
    this.validator = createFileValidator(config);
  }

  getProviderName(): string {
    return 'r2';
  }

  private getBucket(): R2BucketInterface {
    return this.bucket;
  }

  /** Build same-origin proxy URL for a key. */
  getPublicUrl(key: string, requestOrigin?: string): string {
    if (requestOrigin) {
      return `${requestOrigin}/api/storage/file?key=${encodeURIComponent(key)}`;
    }
    return key;
  }

  async uploadFile(params: UploadFileParams): Promise<UploadFileResult> {
    const { file, filename, contentType, folder, userId, requestOrigin } =
      params;
    const bucket = this.getBucket();

    const fileForValidation =
      file instanceof File
        ? file
        : new File(
            [file instanceof Blob ? file : new Uint8Array(file as Buffer)],
            filename,
            { type: contentType }
          );
    const validation = this.validator.validateFile(fileForValidation, filename);
    if (!validation.success) {
      throw new UploadError(validation.error);
    }

    const fileId = generateId();
    const sanitized = sanitizeFilename(filename);
    const storedFilename = `${fileId}-${sanitized}`;

    let r2Key: string;
    if (userId !== undefined) {
      if (folder) {
        r2Key = `${folder}/${userId}/${storedFilename}`;
      } else {
        r2Key = `${this.userFilesFolder}/${userId}/${storedFilename}`;
      }
    } else {
      r2Key = folder ? `${folder}/${storedFilename}` : storedFilename;
    }

    const body = file instanceof Blob ? file : new Uint8Array(file as Buffer);
    await bucket.put(r2Key, body, {
      httpMetadata: { contentType },
    });

    const url = this.getPublicUrl(r2Key, requestOrigin);

    const result: UploadFileResult = { url, key: r2Key };

    if (userId !== undefined) {
      const size = file instanceof Blob ? file.size : (file as Buffer).length;
      result.metadata = {
        id: fileId,
        userId,
        filename: storedFilename,
        originalName: filename,
        contentType,
        size,
        r2Key,
        uploadedAt: new Date(),
      };
    }

    return result;
  }

  async deleteFile(key: string): Promise<void> {
    try {
      const bucket = this.getBucket();
      await bucket.delete(key);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Unknown error during file deletion';
      throw new StorageError(message);
    }
  }

  async downloadFile(
    keyOrMetadata: string | FileMetadata
  ): Promise<ReadableStream | null> {
    const key =
      typeof keyOrMetadata === 'string' ? keyOrMetadata : keyOrMetadata.r2Key;
    const bucket = this.getBucket();
    const object = await bucket.get(key);
    return object?.body ?? null;
  }

  async getFileInfo(
    key: string
  ): Promise<{ size?: number; contentType?: string } | null> {
    const bucket = this.getBucket();
    const head = await bucket.head(key);
    if (!head) return null;
    return {
      size: head.size,
      contentType: head.httpMetadata?.contentType,
    };
  }

  async getFile(
    key: string
  ): Promise<{ body: ReadableStream; contentType: string } | null> {
    const bucket = this.getBucket();
    const object = await bucket.get(key);
    if (!object?.body) return null;
    const contentType =
      object.httpMetadata?.contentType ?? 'application/octet-stream';
    return { body: object.body, contentType };
  }

  async listUserFiles(
    userId: string,
    options?: { limit?: number; cursor?: string }
  ): Promise<{
    objects: { key: string; size: number; uploaded: Date }[];
    nextCursor?: string;
    hasMore: boolean;
  }> {
    const bucket = this.getBucket();
    const prefix = `${this.userFilesFolder}/${userId}/`;
    const limit = Math.min(options?.limit ?? 50, 100);
    const listResult = await bucket.list({
      prefix,
      limit: limit + 1,
      cursor: options?.cursor,
    });

    const objects = listResult.objects ?? [];
    const hasMore = listResult.truncated ?? false;
    const nextCursor = listResult.cursor;
    const slice = hasMore ? objects.slice(0, limit) : objects;

    return {
      objects: slice.map((o) => ({
        key: o.key,
        size: o.size ?? 0,
        uploaded: o.uploaded ?? new Date(0),
      })),
      nextCursor: hasMore ? nextCursor : undefined,
      hasMore,
    };
  }
}
