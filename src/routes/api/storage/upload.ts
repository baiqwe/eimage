import { createFileRoute } from '@tanstack/react-router';
import { getRequestHeaders } from '@tanstack/react-start/server';
import { authApiMiddleware } from '@/middleware/auth-middleware';
import { auth } from '@/auth/auth';
import { websiteConfig } from '@/config/website';
import { uploadFile } from '@/storage';
import { StorageError, UploadError } from '@/storage/types';

export const Route = createFileRoute('/api/storage/upload')({
  server: {
    middleware: [authApiMiddleware],
    handlers: {
      POST: async ({ request }) => {
        if (!websiteConfig.storage?.enable) {
          return Response.json(
            { error: 'Storage is not enabled' },
            { status: 503 }
          );
        }

        try {
          const headers = getRequestHeaders();
          const session = await auth.api.getSession({ headers });
          const userId = session?.user?.id;

          const formData = await request.formData();
          const file = formData.get('file') as File | null;
          const folder = (formData.get('folder') as string | null) ?? undefined;

          if (!file) {
            return Response.json(
              { error: 'No file provided' },
              { status: 400 }
            );
          }

          const buffer = Buffer.from(await file.arrayBuffer());
          const origin = new URL(request.url).origin;
          const result = await uploadFile(buffer, file.name, file.type, {
            folder: folder || undefined,
            userId,
            requestOrigin: origin,
          });

          return Response.json({ ...result, url: result.url });
        } catch (error) {
          if (error instanceof UploadError || error instanceof StorageError) {
            return Response.json({ error: error.message }, { status: 400 });
          }
          return Response.json(
            { error: 'Something went wrong while uploading the file' },
            { status: 500 }
          );
        }
      },
    },
  },
});
