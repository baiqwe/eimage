import { createFileRoute } from '@tanstack/react-router';
import { getDb } from '@/db';
import { user } from '@/db/auth.schema';
import { requireSession, unauthorizedResponse } from '@/lib/session';
import {
  and,
  asc,
  count as countFn,
  desc,
  eq,
  isNull,
  or,
  sql,
} from 'drizzle-orm';

const SORT_FIELD_MAP: Record<
  string,
  | typeof user.name
  | typeof user.email
  | typeof user.createdAt
  | typeof user.role
  | typeof user.banned
> = {
  name: user.name,
  email: user.email,
  createdAt: user.createdAt,
  created_at: user.createdAt,
  createdat: user.createdAt,
  role: user.role,
  status: user.banned,
  banned: user.banned,
};

function normalizeSortId(
  raw: string
): 'name' | 'email' | 'createdAt' | 'role' | 'status' {
  const s = (raw ?? 'createdAt').trim();
  if (s === 'created_at' || s === 'createdat' || s === 'createdAt')
    return 'createdAt';
  if (s.toLowerCase() === 'name') return 'name';
  if (s.toLowerCase() === 'email') return 'email';
  if (s.toLowerCase() === 'role') return 'role';
  if (s.toLowerCase() === 'status' || s.toLowerCase() === 'banned')
    return 'status';
  return 'createdAt';
}

async function listUsers(
  d1: D1Database,
  params: {
    pageIndex: number;
    pageSize: number;
    search: string;
    sortId: string;
    sortDesc: boolean;
    role?: string;
    status?: string;
  }
): Promise<{ items: Array<Record<string, unknown>>; total: number }> {
  const db = getDb(d1);
  const { pageIndex, pageSize, search, sortDesc, role, status } = params;
  const offset = pageIndex * pageSize;
  const sortId = normalizeSortId(params.sortId);

  const conditions = [];
  if (search) {
    const escaped = search
      .replace(/\\/g, '\\\\')
      .replace(/%/g, '\\%')
      .replace(/_/g, '\\_');
    const pattern = `%${escaped}%`;
    conditions.push(
      or(
        sql`lower(${user.name}) like lower(${pattern})`,
        sql`lower(${user.email}) like lower(${pattern})`
      )!
    );
  }
  if (role?.trim()) {
    conditions.push(eq(user.role, role.trim()));
  }
  if (status === 'active') {
    conditions.push(or(eq(user.banned, false), isNull(user.banned))!);
  } else if (status === 'inactive') {
    conditions.push(eq(user.banned, true));
  }
  const where = conditions.length > 0 ? and(...conditions) : undefined;
  const sortField = SORT_FIELD_MAP[sortId] ?? user.createdAt;
  const sortDirection = sortDesc ? desc : asc;

  const [items, [{ count }]] = await Promise.all([
    db
      .select()
      .from(user)
      .where(where)
      .orderBy(sortDirection(sortField))
      .limit(pageSize)
      .offset(offset),
    db.select({ count: countFn() }).from(user).where(where),
  ]);

  return {
    items: items.map((row) => ({
      id: row.id,
      name: row.name,
      email: row.email,
      emailVerified: row.emailVerified,
      image: row.image,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      role: row.role,
      banned: row.banned,
      banReason: row.banReason,
      banExpires: row.banExpires,
    })),
    total: Number(count),
  };
}

/**
 * GET /api/admin/users - list users with search, sort, pagination.
 * Logic is colocated in this route file.
 */
export const Route = createFileRoute('/api/admin/users')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const session = await requireSession(request);
        if (!session?.user) {
          return unauthorizedResponse();
        }
        const url = new URL(request.url);
        const pageIndex = Math.max(
          0,
          Number(url.searchParams.get('pageIndex')) || 0
        );
        const pageSize = Math.min(
          100,
          Math.max(1, Number(url.searchParams.get('pageSize')) || 10)
        );
        const search = (url.searchParams.get('search') ?? '').trim();
        const sortId = url.searchParams.get('sortId') ?? 'createdAt';
        const sortDesc = url.searchParams.get('sortDesc') !== 'false';
        const role = (url.searchParams.get('role') ?? '').trim();
        const status = url.searchParams.get('status') ?? '';

        try {
          const { env } = await import('cloudflare:workers');
          const result = await listUsers(env.DB, {
            pageIndex,
            pageSize,
            search,
            sortId,
            sortDesc,
            role: role || undefined,
            status: status === 'active' || status === 'inactive' ? status : undefined,
          });
          return Response.json({ success: true, data: result });
        } catch (error) {
          console.error('get users error:', error);
          return Response.json(
            {
              success: false,
              error:
                error instanceof Error
                  ? error.message
                  : 'Failed to fetch users',
            },
            { status: 500 }
          );
        }
      },
    },
  },
});
