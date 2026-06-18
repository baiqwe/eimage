/**
 * Application database schema (non-auth tables).
 * Add your app tables here; keep Better Auth tables in auth.schema.ts.
 */

import { relations } from 'drizzle-orm';
import { integer, sqliteTable, text, index } from 'drizzle-orm/sqlite-core';
import { user } from './auth.schema';
import type { PaymentScene, PaymentStatus, PaymentType, PlanInterval } from '@/payment/types';

/** 
 * Payment: subscription and one-time 
 */
export const payment = sqliteTable(
  'payment',
  {
    id: text('id').primaryKey(),
    priceId: text('price_id').notNull(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    customerId: text('customer_id').notNull(),
    subscriptionId: text('subscription_id'),
    sessionId: text('session_id'),
    invoiceId: text('invoice_id').unique(),
    type: text('type').notNull().$type<PaymentType>(), // 'subscription' | 'one_time'
    scene: text('scene').$type<PaymentScene>(), // 'subscription' | 'lifetime'
    interval: text('interval').$type<PlanInterval>(), // 'month' | 'year'
    status: text('status').notNull().$type<PaymentStatus>(),
    paid: integer('paid', { mode: 'boolean' }).notNull().default(false),
    periodStart: integer('period_start', { mode: 'timestamp_ms' }),
    periodEnd: integer('period_end', { mode: 'timestamp_ms' }),
    cancelAtPeriodEnd: integer('cancel_at_period_end', { mode: 'boolean' }),
    trialStart: integer('trial_start', { mode: 'timestamp_ms' }),
    trialEnd: integer('trial_end', { mode: 'timestamp_ms' }),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => [
    index('payment_user_id_idx').on(table.userId),
    index('payment_customer_id_idx').on(table.customerId),
    index('payment_subscription_id_idx').on(table.subscriptionId),
    index('payment_session_id_idx').on(table.sessionId),
    index('payment_invoice_id_idx').on(table.invoiceId),
    index('payment_paid_idx').on(table.paid),
    index('payment_user_paid_idx').on(table.userId, table.paid),
  ]
);

export const paymentRelations = relations(payment, ({ one }) => ({
  user: one(user, { fields: [payment.userId], references: [user.id] }),
}));

/**
 * User files
 * metadata for files uploaded to R2 (path userfiles/{userId}/xxx);
 * filename = stored name on R2 (e.g. uuid.ext);
 * originalName = user's file name.
 */
export const userFiles = sqliteTable(
  'user_files',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    filename: text('filename').notNull(),
    originalName: text('original_name').notNull(),
    contentType: text('content_type').notNull(),
    size: integer('size').notNull(),
    r2Key: text('r2_key').notNull(),
    isPublic: integer('is_public', { mode: 'boolean' }),
    description: text('description'),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => [
    index('user_files_user_id_idx').on(table.userId),
    index('user_files_r2_key_idx').on(table.r2Key),
  ]
);

export const userFilesRelations = relations(userFiles, ({ one }) => ({
  user: one(user, {
    fields: [userFiles.userId],
    references: [user.id],
  }),
}));

export type ProductProjectStatus = 'active' | 'archived';
export type GenerationBatchStatus =
  | 'draft'
  | 'queued'
  | 'running'
  | 'completed'
  | 'failed'
  | 'cancelled';
export type GenerationTaskStatus =
  | 'queued'
  | 'running'
  | 'completed'
  | 'failed'
  | 'cancelled';
export type GenerationTaskKind = 'main' | 'detail';
export type OutputStorageTier = 'original' | 'thumbnail' | 'preview';
export type CreditLedgerType =
  | 'grant'
  | 'purchase'
  | 'subscription'
  | 'debit'
  | 'refund'
  | 'adjustment';

/**
 * Product projects
 * A project is anchored by one uploaded product source image and can contain
 * multiple generation batches over time.
 */
export const productProjects = sqliteTable(
  'product_projects',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    locale: text('locale').notNull().default('zh'),
    baseDescription: text('base_description').notNull(),
    sourceFileId: text('source_file_id').references(() => userFiles.id, {
      onDelete: 'set null',
    }),
    sourceR2Key: text('source_r2_key'),
    status: text('status')
      .notNull()
      .default('active')
      .$type<ProductProjectStatus>(),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => [
    index('product_projects_user_id_idx').on(table.userId),
    index('product_projects_source_file_id_idx').on(table.sourceFileId),
    index('product_projects_user_status_idx').on(table.userId, table.status),
  ]
);

export const generationBatches = sqliteTable(
  'generation_batches',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    projectId: text('project_id')
      .notNull()
      .references(() => productProjects.id, { onDelete: 'cascade' }),
    status: text('status')
      .notNull()
      .default('queued')
      .$type<GenerationBatchStatus>(),
    locale: text('locale').notNull().default('zh'),
    taskCount: integer('task_count').notNull(),
    completedTaskCount: integer('completed_task_count').notNull().default(0),
    failedTaskCount: integer('failed_task_count').notNull().default(0),
    reservedCredits: integer('reserved_credits').notNull().default(0),
    spentCredits: integer('spent_credits').notNull().default(0),
    provider: text('provider'),
    idempotencyKey: text('idempotency_key').notNull(),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => [
    index('generation_batches_user_id_idx').on(table.userId),
    index('generation_batches_project_id_idx').on(table.projectId),
    index('generation_batches_status_idx').on(table.status),
    index('generation_batches_idempotency_idx').on(table.idempotencyKey),
  ]
);

export const generationTasks = sqliteTable(
  'generation_tasks',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    projectId: text('project_id')
      .notNull()
      .references(() => productProjects.id, { onDelete: 'cascade' }),
    batchId: text('batch_id')
      .notNull()
      .references(() => generationBatches.id, { onDelete: 'cascade' }),
    kind: text('kind').notNull().$type<GenerationTaskKind>(),
    status: text('status')
      .notNull()
      .default('queued')
      .$type<GenerationTaskStatus>(),
    style: text('style').notNull(),
    aspectRatio: text('aspect_ratio').notNull(),
    resolution: text('resolution').notNull(),
    prompt: text('prompt').notNull(),
    negativePrompt: text('negative_prompt'),
    reasoning: text('reasoning'),
    referenceFileId: text('reference_file_id').references(() => userFiles.id, {
      onDelete: 'set null',
    }),
    providerTaskId: text('provider_task_id'),
    providerPayload: text('provider_payload'),
    creditCost: integer('credit_cost').notNull(),
    errorMessage: text('error_message'),
    startedAt: integer('started_at', { mode: 'timestamp_ms' }),
    completedAt: integer('completed_at', { mode: 'timestamp_ms' }),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => [
    index('generation_tasks_user_id_idx').on(table.userId),
    index('generation_tasks_project_id_idx').on(table.projectId),
    index('generation_tasks_batch_id_idx').on(table.batchId),
    index('generation_tasks_status_idx').on(table.status),
    index('generation_tasks_provider_task_id_idx').on(table.providerTaskId),
  ]
);

export const generationOutputs = sqliteTable(
  'generation_outputs',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    projectId: text('project_id')
      .notNull()
      .references(() => productProjects.id, { onDelete: 'cascade' }),
    batchId: text('batch_id')
      .notNull()
      .references(() => generationBatches.id, { onDelete: 'cascade' }),
    taskId: text('task_id')
      .notNull()
      .references(() => generationTasks.id, { onDelete: 'cascade' }),
    storageTier: text('storage_tier')
      .notNull()
      .default('original')
      .$type<OutputStorageTier>(),
    r2Key: text('r2_key').notNull(),
    thumbnailR2Key: text('thumbnail_r2_key'),
    publicUrl: text('public_url'),
    width: integer('width').notNull(),
    height: integer('height').notNull(),
    contentType: text('content_type').notNull(),
    size: integer('size').notNull(),
    altText: text('alt_text').notNull(),
    expiresAt: integer('expires_at', { mode: 'timestamp_ms' }),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => [
    index('generation_outputs_user_id_idx').on(table.userId),
    index('generation_outputs_project_id_idx').on(table.projectId),
    index('generation_outputs_batch_id_idx').on(table.batchId),
    index('generation_outputs_task_id_idx').on(table.taskId),
    index('generation_outputs_expires_at_idx').on(table.expiresAt),
  ]
);

export const creditLedger = sqliteTable(
  'credit_ledger',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    type: text('type').notNull().$type<CreditLedgerType>(),
    amount: integer('amount').notNull(),
    balanceAfter: integer('balance_after').notNull(),
    batchId: text('batch_id').references(() => generationBatches.id, {
      onDelete: 'set null',
    }),
    taskId: text('task_id').references(() => generationTasks.id, {
      onDelete: 'set null',
    }),
    paymentId: text('payment_id').references(() => payment.id, {
      onDelete: 'set null',
    }),
    reason: text('reason'),
    idempotencyKey: text('idempotency_key').notNull(),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => [
    index('credit_ledger_user_id_idx').on(table.userId),
    index('credit_ledger_batch_id_idx').on(table.batchId),
    index('credit_ledger_task_id_idx').on(table.taskId),
    index('credit_ledger_idempotency_idx').on(table.idempotencyKey),
  ]
);

export const productProjectsRelations = relations(productProjects, ({ one, many }) => ({
  user: one(user, { fields: [productProjects.userId], references: [user.id] }),
  sourceFile: one(userFiles, {
    fields: [productProjects.sourceFileId],
    references: [userFiles.id],
  }),
  batches: many(generationBatches),
  tasks: many(generationTasks),
}));

export const generationBatchesRelations = relations(
  generationBatches,
  ({ one, many }) => ({
    user: one(user, {
      fields: [generationBatches.userId],
      references: [user.id],
    }),
    project: one(productProjects, {
      fields: [generationBatches.projectId],
      references: [productProjects.id],
    }),
    tasks: many(generationTasks),
    outputs: many(generationOutputs),
  })
);

export const generationTasksRelations = relations(
  generationTasks,
  ({ one, many }) => ({
    user: one(user, {
      fields: [generationTasks.userId],
      references: [user.id],
    }),
    project: one(productProjects, {
      fields: [generationTasks.projectId],
      references: [productProjects.id],
    }),
    batch: one(generationBatches, {
      fields: [generationTasks.batchId],
      references: [generationBatches.id],
    }),
    referenceFile: one(userFiles, {
      fields: [generationTasks.referenceFileId],
      references: [userFiles.id],
    }),
    outputs: many(generationOutputs),
  })
);

export const generationOutputsRelations = relations(
  generationOutputs,
  ({ one }) => ({
    user: one(user, {
      fields: [generationOutputs.userId],
      references: [user.id],
    }),
    project: one(productProjects, {
      fields: [generationOutputs.projectId],
      references: [productProjects.id],
    }),
    batch: one(generationBatches, {
      fields: [generationOutputs.batchId],
      references: [generationBatches.id],
    }),
    task: one(generationTasks, {
      fields: [generationOutputs.taskId],
      references: [generationTasks.id],
    }),
  })
);

export const creditLedgerRelations = relations(creditLedger, ({ one }) => ({
  user: one(user, { fields: [creditLedger.userId], references: [user.id] }),
  batch: one(generationBatches, {
    fields: [creditLedger.batchId],
    references: [generationBatches.id],
  }),
  task: one(generationTasks, {
    fields: [creditLedger.taskId],
    references: [generationTasks.id],
  }),
  payment: one(payment, {
    fields: [creditLedger.paymentId],
    references: [payment.id],
  }),
}));
