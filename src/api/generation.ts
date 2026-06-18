import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import {
  buildOutputAltText,
  createGenerationBatchPlan,
  estimateTaskCreditCost,
} from '@/lib/product-generation';

const taskSchema = z.object({
  id: z.string().min(1),
  kind: z.enum(['main', 'detail']),
  style: z.string().min(2).max(120),
  aspectRatio: z.string().min(3).max(12),
  resolution: z.string().min(7).max(20),
  prompt: z.string().min(10).max(2200),
  referenceName: z.string().max(255).optional(),
});

const createBatchSchema = z.object({
  projectId: z.string().min(1).default('local-project'),
  userId: z.string().min(1).default('local-user'),
  locale: z.enum(['zh', 'en', 'ja', 'ko', 'es']).default('zh'),
  productDescription: z.string().min(4).max(800),
  availableCredits: z.number().int().nonnegative(),
  tasks: z.array(taskSchema).min(1).max(12),
});

/**
 * Creates a batch plan made of independent single-image tasks.
 * The real API integration should persist this plan, debit or reserve credits,
 * submit each task to the image provider concurrently, then reconcile via
 * polling/SSE/webhooks.
 */
export const createGenerationBatch = createServerFn({ method: 'POST' })
  .inputValidator(createBatchSchema)
  .handler(async ({ data }) => {
    const plan = createGenerationBatchPlan({
      userId: data.userId,
      projectId: data.projectId,
      tasks: data.tasks,
    });

    if (plan.totalCreditCost > data.availableCredits) {
      return {
        ok: false as const,
        reason: 'INSUFFICIENT_CREDITS',
        requiredCredits: plan.totalCreditCost,
        availableCredits: data.availableCredits,
      };
    }

    return {
      ok: true as const,
      ...plan,
      tasks: plan.tasks.map((task) => ({
        ...task,
        altText: buildOutputAltText({
          locale: data.locale,
          productDescription: data.productDescription,
          kind: task.kind,
          style: task.style,
          aspectRatio: task.aspectRatio,
        }),
      })),
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
