import { serverEnv } from '@/env/server';
import { KIE_MODELS, type KieModelId } from '@/lib/kie-models';

type KieCreateTaskInput = {
  model: KieModelId;
  prompt: string;
  imageUrl: string;
  aspectRatio: string;
  resolution: string;
};

type KieCreateTaskResponse = {
  code?: number;
  msg?: string;
  data?: {
    taskId?: string;
  };
};

type KieUploadResponse = {
  code?: number;
  msg?: string;
  data?: {
    fileUrl?: string;
    downloadUrl?: string;
  };
};

type KieRecordInfoResponse = {
  code?: number;
  msg?: string;
  data?: Record<string, unknown>;
};

const KIE_API_BASE_URL = 'https://api.kie.ai';
const KIE_UPLOAD_BASE_URL = 'https://kieai.redpandaai.co';

export function getKieModel(model: string) {
  return (
    KIE_MODELS.find((item) => item.id === model) ??
    KIE_MODELS.find((item) => item.id === serverEnv.KIE_DEFAULT_MODEL) ??
    KIE_MODELS[0]
  );
}

export async function uploadBase64ToKie({
  dataUrl,
  fileName,
}: {
  dataUrl: string;
  fileName: string;
}) {
  const apiKey = requireKieApiKey();
  const response = await fetch(
    `${KIE_UPLOAD_BASE_URL}/api/file-base64-upload`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        base64Data: dataUrl,
        uploadPath: 'prodlist/product-sources',
        fileName,
      }),
    }
  );

  const result = (await response.json().catch(() => ({}))) as KieUploadResponse;
  const uploadedUrl = result.data?.fileUrl ?? result.data?.downloadUrl;
  if (!response.ok || !uploadedUrl) {
    throw new Error(result.msg || 'Kie file upload failed.');
  }

  return uploadedUrl;
}

export async function createKieImageTask(input: KieCreateTaskInput) {
  const apiKey = requireKieApiKey();
  const model = getKieModel(input.model);
  const response = await fetch(`${KIE_API_BASE_URL}/api/v1/jobs/createTask`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: model.id,
      input: createModelInput(input),
    }),
  });

  const result = (await response
    .json()
    .catch(() => ({}))) as KieCreateTaskResponse;
  if (!response.ok || !result.data?.taskId) {
    throw new Error(result.msg || 'Kie image task creation failed.');
  }

  return {
    taskId: result.data.taskId,
    raw: result,
  };
}

export async function getKieTaskRecord(taskId: string) {
  const apiKey = requireKieApiKey();
  const response = await fetch(
    `${KIE_API_BASE_URL}/api/v1/jobs/recordInfo?taskId=${encodeURIComponent(taskId)}`,
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    }
  );
  const result = (await response
    .json()
    .catch(() => ({}))) as KieRecordInfoResponse;
  if (!response.ok) {
    throw new Error(result.msg || 'Kie task query failed.');
  }
  return result;
}

export function normalizeKieRecord(record: KieRecordInfoResponse) {
  const data = record.data ?? {};
  const state = String(
    data.state ?? data.status ?? data.taskStatus ?? data.generateStatus ?? ''
  ).toLowerCase();
  const imageUrl = findImageUrl(data);

  return {
    state,
    imageUrl,
    raw: record,
  };
}

function createModelInput(input: KieCreateTaskInput) {
  const model = getKieModel(input.model);
  const [width, height] = input.resolution.split('x').map(Number);
  const imageResolution = width >= 1536 || height >= 1536 ? '2K' : '1K';

  if (model.adapter === 'seedream') {
    return {
      prompt: input.prompt,
      image_urls: [input.imageUrl],
      image_size: aspectRatioToSeedreamSize(input.aspectRatio),
      image_resolution: imageResolution,
      max_images: 1,
      nsfw_checker: true,
    };
  }

  return {
    prompt: input.prompt,
    input_urls: [input.imageUrl],
    aspect_ratio: input.aspectRatio || 'auto',
    resolution: imageResolution,
  };
}

function aspectRatioToSeedreamSize(aspectRatio: string) {
  return (
    {
      '1:1': 'square_hd',
      '4:5': 'portrait_4_5',
      '3:4': 'portrait_4_3',
      '16:9': 'landscape_16_9',
      '9:16': 'portrait_16_9',
    }[aspectRatio] ?? 'square_hd'
  );
}

function findImageUrl(value: unknown): string | undefined {
  if (!value) return undefined;
  if (typeof value === 'string') {
    if (/^https?:\/\/.+\.(png|jpe?g|webp|gif)(\?.*)?$/i.test(value)) {
      return value;
    }
    try {
      return findImageUrl(JSON.parse(value));
    } catch {
      return undefined;
    }
  }
  if (Array.isArray(value)) {
    for (const item of value) {
      const found = findImageUrl(item);
      if (found) return found;
    }
  }
  if (typeof value === 'object') {
    const record = value as Record<string, unknown>;
    for (const key of [
      'imageUrl',
      'image_url',
      'url',
      'fileUrl',
      'resultUrl',
      'downloadUrl',
      'originUrl',
    ]) {
      const found = findImageUrl(record[key]);
      if (found) return found;
    }
    for (const item of Object.values(record)) {
      const found = findImageUrl(item);
      if (found) return found;
    }
  }
  return undefined;
}

function requireKieApiKey() {
  if (!serverEnv.KIE_API_KEY) {
    throw new Error('KIE_API_KEY is not configured.');
  }
  return serverEnv.KIE_API_KEY;
}
