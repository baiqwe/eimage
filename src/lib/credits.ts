import { getDb } from '@/db';
import { creditLedger } from '@/db/app.schema';
import { and, desc, eq } from 'drizzle-orm';

export const SIGNUP_BONUS_CREDITS = 45;

function createId(prefix: string) {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return `${prefix}_${crypto.randomUUID()}`;
  }
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

export async function getCreditBalance(userId: string) {
  const db = getDb();
  const [latest] = await db
    .select({ balanceAfter: creditLedger.balanceAfter })
    .from(creditLedger)
    .where(eq(creditLedger.userId, userId))
    .orderBy(desc(creditLedger.createdAt))
    .limit(1);

  return latest?.balanceAfter ?? 0;
}

export async function grantSignupCredits(userId: string) {
  return grantCredits({
    userId,
    amount: SIGNUP_BONUS_CREDITS,
    reason: 'Signup bonus credits',
    idempotencyKey: `signup_bonus:${userId}`,
  });
}

export async function grantCredits({
  userId,
  amount,
  reason,
  idempotencyKey,
}: {
  userId: string;
  amount: number;
  reason: string;
  idempotencyKey: string;
}) {
  const db = getDb();
  const [existing] = await db
    .select({ balanceAfter: creditLedger.balanceAfter })
    .from(creditLedger)
    .where(
      and(
        eq(creditLedger.userId, userId),
        eq(creditLedger.idempotencyKey, idempotencyKey)
      )
    )
    .limit(1);

  if (existing) return existing.balanceAfter;

  const balance = await getCreditBalance(userId);
  const nextBalance = balance + amount;
  await db.insert(creditLedger).values({
    id: createId('credit'),
    userId,
    type: 'grant',
    amount,
    balanceAfter: nextBalance,
    reason,
    idempotencyKey,
    createdAt: new Date(),
  });

  return nextBalance;
}

export async function debitCredits({
  userId,
  amount,
  reason,
  idempotencyKey,
  batchId,
  taskId,
}: {
  userId: string;
  amount: number;
  reason: string;
  idempotencyKey: string;
  batchId?: string;
  taskId?: string;
}) {
  const db = getDb();
  const [existing] = await db
    .select({ balanceAfter: creditLedger.balanceAfter })
    .from(creditLedger)
    .where(
      and(
        eq(creditLedger.userId, userId),
        eq(creditLedger.idempotencyKey, idempotencyKey)
      )
    )
    .limit(1);

  if (existing) return existing.balanceAfter;

  const balance = await getCreditBalance(userId);
  if (balance < amount) {
    throw new Error(`INSUFFICIENT_CREDITS:${amount}:${balance}`);
  }

  const nextBalance = balance - amount;
  await db.insert(creditLedger).values({
    id: createId('credit'),
    userId,
    type: 'debit',
    amount: -amount,
    balanceAfter: nextBalance,
    batchId: batchId ?? null,
    taskId: taskId ?? null,
    reason,
    idempotencyKey,
    createdAt: new Date(),
  });

  return nextBalance;
}

export async function refundCredits({
  userId,
  amount,
  reason,
  idempotencyKey,
  batchId,
  taskId,
}: {
  userId: string;
  amount: number;
  reason: string;
  idempotencyKey: string;
  batchId?: string;
  taskId?: string;
}) {
  const db = getDb();
  const [existing] = await db
    .select({ balanceAfter: creditLedger.balanceAfter })
    .from(creditLedger)
    .where(
      and(
        eq(creditLedger.userId, userId),
        eq(creditLedger.idempotencyKey, idempotencyKey)
      )
    )
    .limit(1);

  if (existing) return existing.balanceAfter;

  const balance = await getCreditBalance(userId);
  const nextBalance = balance + amount;
  await db.insert(creditLedger).values({
    id: createId('credit'),
    userId,
    type: 'refund',
    amount,
    balanceAfter: nextBalance,
    batchId: batchId ?? null,
    taskId: taskId ?? null,
    reason,
    idempotencyKey,
    createdAt: new Date(),
  });

  return nextBalance;
}
