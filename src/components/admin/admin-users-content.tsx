import { UsersTable } from '@/components/admin/users-table';
import { getSortingStateParser } from '@/components/data-table/lib/parsers';
import type { UsersSortingState } from '@/hooks/use-users';
import { useUsers } from '@/hooks/use-users';
import type { SortingState } from '@tanstack/react-table';
import {
  parseAsIndex,
  parseAsInteger,
  parseAsString,
  useQueryStates,
} from 'nuqs';

const SORTABLE_IDS = ['name', 'email', 'createdAt'] as const;
const defaultSorting: SortingState = [{ id: 'createdAt', desc: true }];
const sortableColumnSet = new Set<string>(SORTABLE_IDS);

function normalizeSorting(value: SortingState): SortingState {
  const filtered = value.filter((item) => sortableColumnSet.has(item.id));
  return filtered.length > 0 ? filtered : defaultSorting;
}

/**
 * Admin users table with URL-synced search, sort, pagination.
 * Aligned with mksaas: nuqs + TanStack Query + normalizeSorting.
 */
export function AdminUsersContent() {
  const [{ page, size, search, sort }, setQueryStates] = useQueryStates({
    page: parseAsIndex.withDefault(0),
    size: parseAsInteger.withDefault(10),
    search: parseAsString.withDefault(''),
    sort: getSortingStateParser([...SORTABLE_IDS]).withDefault(
      defaultSorting as Parameters<
        ReturnType<typeof getSortingStateParser>['withDefault']
      >[0]
    ),
  });

  const safeSorting: UsersSortingState = normalizeSorting(sort as SortingState);
  const { data, isLoading } = useUsers(page, size, search, safeSorting, []);

  return (
    <UsersTable
      data={data?.items ?? []}
      total={data?.total ?? 0}
      pageIndex={page}
      pageSize={size}
      search={search}
      sorting={safeSorting}
      loading={isLoading}
      onSearch={(newSearch) => setQueryStates({ search: newSearch, page: 0 })}
      onPageChange={(newPage) => setQueryStates({ page: newPage })}
      onPageSizeChange={(newSize) => setQueryStates({ size: newSize, page: 0 })}
      onSortingChange={(newSorting) => {
        const next = normalizeSorting(newSorting);
        setQueryStates({ sort: next as typeof sort, page: 0 });
      }}
    />
  );
}
