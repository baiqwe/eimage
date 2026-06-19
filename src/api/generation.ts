import { getDb } from '@/db';
import {
  generationBatches,
  generationTasks,
  productProjects,
} from '@/db/app.schema';
import {
  buildOutputAltText,
  createGenerationBatchPlan,
  estimateTaskCreditCost,
} from '@/lib/product-generation';
import {
  debitCredits,
  getCreditBalance,
  grantSignupCredits,
  refundCredits,
} from '@/lib/credits';
import {
  createKieImageTask,
  getKieModel,
  getKieTaskRecord,
  normalizeKieRecord,
  uploadBase64ToKie,
} from '@/lib/kie';
import { KIE_MODELS, type KieModelId } from '@/lib/kie-models';
import { authApiMiddleware } from '@/middlewares/auth-middleware';
import { createServerFn } from '@tanstack/react-start';
import { and, eq, inArray } from 'drizzle-orm';
import { z } from 'zod';

const taskSchema = z.object({
  id: z.string().min(1),
  kind: z.enum(['main', 'detail']),
  style: z.string().min(2).max(120),
  aspectRatio: z.string().min(3).max(12),
  resolution: z.string().min(7).max(20),
  prompt: z.string().min(10).max(20_000),
  model: z.string().min(2).max(120).optional(),
  referenceImageDataUrl: z.string().optional(),
  referenceName: z.string().max(255).optional(),
});

const createBatchSchema = z.object({
  locale: z.enum(['zh', 'en', 'ja', 'ko', 'es']).default('zh'),
  productDescription: z.string().min(4).max(800),
  sourceImageDataUrl: z.string().min(40),
  sourceName: z.string().max(255).default('source-product.png'),
  tasks: z.array(taskSchema).min(1).max(12),
});

const statusSchema = z.object({
  taskIds: z.array(z.string().min(1)).min(1).max(12),
});

function createId(prefix: string) {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return `${prefix}_${crypto.randomUUID()}`;
  }
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

export const listKieModels = createServerFn({ method: 'GET' }).handler(
  async () => ({
    models: KIE_MODELS,
  })
);

export const getGenerationCredits = createServerFn({ method: 'GET' })
  .middleware([authApiMiddleware])
  .handler(async ({ context }) => {
    await grantSignupCredits(context.userId);
    return {
      balance: await getCreditBalance(context.userId),
      signupBonus: 45,
    };
  });

export const createGenerationBatch = createServerFn({ method: 'POST' })
  .inputValidator(createBatchSchema)
  .middleware([authApiMiddleware])
  .handler(async ({ data, context }) => {
    const userId = context.userId;
    await grantSignupCredits(userId);

    const projectId = createId('project');
    const plan = createGenerationBatchPlan({
      userId,
      projectId,
      tasks: data.tasks.map((task) => ({
        id: task.id,
        kind: task.kind,
        style: task.style,
        aspectRatio: task.aspectRatio,
        resolution: task.resolution,
        prompt: task.prompt,
        referenceName: task.referenceName,
      })),
    });

    const availableCredits = await getCreditBalance(userId);
    if (plan.totalCreditCost > availableCredits) {
      return {
        ok: false as const,
        reason: 'INSUFFICIENT_CREDITS',
        requiredCredits: plan.totalCreditCost,
        availableCredits,
      };
    }

    const db = getDb();
    const now = new Date();
    await db.insert(productProjects).values({
      id: projectId,
      userId,
      name: data.sourceName || 'Product image project',
      locale: data.locale,
      baseDescription: data.productDescription,
      sourceFileId: null,
      sourceR2Key: null,
      status: 'active',
      createdAt: now,
      updatedAt: now,
    });

    await db.insert(generationBatches).values({
      id: plan.batchId,
      userId,
      projectId,
      status: 'running',
      locale: data.locale,
      taskCount: plan.tasks.length,
      completedTaskCount: 0,
      failedTaskCount: 0,
      reservedCredits: plan.totalCreditCost,
      spentCredits: plan.totalCreditCost,
      provider: 'kie',
      idempotencyKey: `batch:${plan.batchId}`,
      createdAt: now,
      updatedAt: now,
    });

    try {
      await debitCredits({
        userId,
        amount: plan.totalCreditCost,
        reason: 'Product image generation batch',
        idempotencyKey: `generation_batch:${plan.batchId}`,
        batchId: plan.batchId,
      });

      const sourceImageUrl = await uploadBase64ToKie({
        dataUrl: data.sourceImageDataUrl,
        fileName: data.sourceName || `${projectId}.png`,
      });

      const submittedTasks = await Promise.all(
        plan.tasks.map(async (task) => {
          const inputTask = data.tasks.find((item) => item.id === task.id);
          const model = getKieModel(inputTask?.model ?? '').id as KieModelId;
          const startedAt = new Date();
          try {
            const taskImageUrl = inputTask?.referenceImageDataUrl
              ? await uploadBase64ToKie({
                  dataUrl: inputTask.referenceImageDataUrl,
                  fileName: inputTask.referenceName || `${task.id}.png`,
                })
              : sourceImageUrl;
            const provider = await createKieImageTask({
              model,
              prompt: task.prompt,
              imageUrl: taskImageUrl,
              aspectRatio: task.aspectRatio,
              resolution: task.resolution,
            });
            await db.insert(generationTasks).values({
              id: task.providerTaskId,
              userId,
              projectId,
              batchId: plan.batchId,
              kind: task.kind,
              status: 'running',
              style: task.style,
              aspectRatio: task.aspectRatio,
              resolution: task.resolution,
              prompt: task.prompt,
              negativePrompt: null,
              reasoning: null,
              referenceFileId: null,
              providerTaskId: provider.taskId,
              providerPayload: JSON.stringify({
                provider: 'kie',
                model,
                sourceImageUrl: taskImageUrl,
                createResponse: provider.raw,
              }),
              creditCost: task.creditCost,
              errorMessage: null,
              startedAt,
              completedAt: null,
              createdAt: startedAt,
              updatedAt: startedAt,
            });

            return {
              ...task,
              id: inputTask?.id ?? task.id,
              taskId: task.providerTaskId,
              providerTaskId: provider.taskId,
              model,
              status: 'running' as const,
              altText: buildOutputAltText({
                locale: data.locale,
                productDescription: data.productDescription,
                kind: task.kind,
                style: task.style,
                aspectRatio: task.aspectRatio,
              }),
            };
          } catch (error) {
            const errorMessage =
              error instanceof Error
                ? error.message
                : 'Kie task creation failed.';
            await db.insert(generationTasks).values({
              id: task.providerTaskId,
              userId,
              projectId,
              batchId: plan.batchId,
              kind: task.kind,
              status: 'failed',
              style: task.style,
              aspectRatio: task.aspectRatio,
              resolution: task.resolution,
              prompt: task.prompt,
              negativePrompt: null,
              reasoning: null,
              referenceFileId: null,
              providerTaskId: null,
              providerPayload: JSON.stringify({ provider: 'kie', model }),
              creditCost: task.creditCost,
              errorMessage,
              startedAt,
              completedAt: startedAt,
              createdAt: startedAt,
              updatedAt: startedAt,
            });
            await refundCredits({
              userId,
              amount: task.creditCost,
              reason: `Kie task creation failed: ${errorMessage}`,
              idempotencyKey: `generation_task_create_refund:${task.providerTaskId}`,
              batchId: plan.batchId,
              taskId: task.providerTaskId,
            });

            return {
              ...task,
              id: inputTask?.id ?? task.id,
              taskId: task.providerTaskId,
              providerTaskId: null,
              model,
              status: 'failed' as const,
              errorMessage,
              altText: buildOutputAltText({
                locale: data.locale,
                productDescription: data.productDescription,
                kind: task.kind,
                style: task.style,
                aspectRatio: task.aspectRatio,
              }),
            };
          }
        })
      );
      await reconcileBatch(plan.batchId);

      return {
        ok: true as const,
        batchId: plan.batchId,
        projectId,
        totalCreditCost: plan.totalCreditCost,
        balance: await getCreditBalance(userId),
        tasks: submittedTasks,
      };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Generation batch failed.';
      await db
        .update(generationBatches)
        .set({
          status: 'failed',
          failedTaskCount: plan.tasks.length,
          updatedAt: new Date(),
        })
        .where(eq(generationBatches.id, plan.batchId));
      await refundCredits({
        userId,
        amount: plan.totalCreditCost,
        reason: `Generation batch failed: ${message}`,
        idempotencyKey: `generation_batch_refund:${plan.batchId}`,
        batchId: plan.batchId,
      });
      throw new Error(message);
    }
  });

export const getGenerationTaskStatuses = createServerFn({ method: 'POST' })
  .inputValidator(statusSchema)
  .middleware([authApiMiddleware])
  .handler(async ({ data, context }) => {
    const userId = context.userId;
    const db = getDb();
    const rows = await db
      .select()
      .from(generationTasks)
      .where(
        and(
          eq(generationTasks.userId, userId),
          inArray(generationTasks.id, data.taskIds)
        )
      );

    const statuses = await Promise.all(
      rows.map(async (task) => {
        if (task.status === 'completed' || task.status === 'failed') {
          return taskStatusPayload(task);
        }
        if (!task.providerTaskId) return taskStatusPayload(task);

        try {
          const record = await getKieTaskRecord(task.providerTaskId);
          const normalized = normalizeKieRecord(record);
          if (normalized.state === 'success' && normalized.imageUrl) {
            const completedAt = new Date();
            await db
              .update(generationTasks)
              .set({
                status: 'completed',
                providerPayload: JSON.stringify({
                  ...(safeJson(task.providerPayload) ?? {}),
                  record: normalized.raw,
                  imageUrl: normalized.imageUrl,
                }),
                completedAt,
                updatedAt: completedAt,
              })
              .where(eq(generationTasks.id, task.id));
            await reconcileBatch(task.batchId);
            return {
              ...taskStatusPayload(task),
              status: 'completed' as const,
              imageUrl: normalized.imageUrl,
            };
          }

          if (normalized.state === 'fail') {
            const completedAt = new Date();
            await db
              .update(generationTasks)
              .set({
                status: 'failed',
                errorMessage: 'Kie generation failed.',
                providerPayload: JSON.stringify({
                  ...(safeJson(task.providerPayload) ?? {}),
                  record: normalized.raw,
                }),
                completedAt,
                updatedAt: completedAt,
              })
              .where(eq(generationTasks.id, task.id));
            await refundCredits({
              userId,
              amount: task.creditCost,
              reason: 'Kie generation task failed',
              idempotencyKey: `generation_task_refund:${task.id}`,
              batchId: task.batchId,
              taskId: task.id,
            });
            await reconcileBatch(task.batchId);
            return {
              ...taskStatusPayload(task),
              status: 'failed' as const,
              errorMessage: 'Kie generation failed.',
            };
          }
        } catch (error) {
          return {
            ...taskStatusPayload(task),
            errorMessage:
              error instanceof Error ? error.message : 'Task polling failed.',
          };
        }

        return taskStatusPayload(task);
      })
    );

    return {
      statuses,
      balance: await getCreditBalance(userId),
    };
  });

export const estimateGenerationCredits = createServerFn({ method: 'POST' })
  .inputValidator(z.object({ tasks: z.array(taskSchema).min(1).max(12) }))
  .handler(async ({ data }) => ({
    totalCreditCost: data.tasks.reduce(
      (sum, task) => sum + estimateTaskCreditCost(task),
      0
    ),
  }));

function taskStatusPayload(task: typeof generationTasks.$inferSelect) {
  const payload = safeJson(task.providerPayload);
  return {
    id: task.id,
    providerTaskId: task.providerTaskId,
    status: task.status,
    imageUrl: payload?.imageUrl as string | undefined,
    errorMessage: task.errorMessage ?? undefined,
  };
}

async function reconcileBatch(batchId: string) {
  const db = getDb();
  const tasks = await db
    .select()
    .from(generationTasks)
    .where(eq(generationTasks.batchId, batchId));
  const completedTaskCount = tasks.filter(
    (task) => task.status === 'completed'
  ).length;
  const failedTaskCount = tasks.filter(
    (task) => task.status === 'failed'
  ).length;
  const terminalCount = completedTaskCount + failedTaskCount;
  const status =
    terminalCount === tasks.length
      ? failedTaskCount === tasks.length
        ? 'failed'
        : 'completed'
      : 'running';

  await db
    .update(generationBatches)
    .set({
      status,
      completedTaskCount,
      failedTaskCount,
      updatedAt: new Date(),
    })
    .where(eq(generationBatches.id, batchId));
}

function safeJson(value: string | null) {
  if (!value) return undefined;
  try {
    return JSON.parse(value) as Record<string, unknown>;
  } catch {
    return undefined;
  }
}
