import { UsersTable } from '@/components/admin/users-table';
import { getSortingStateParser } from '@/components/data-table/lib/parsers';
import type { UsersSortingState } from '@/hooks/use-users';
import { useUsers } from '@/hooks/use-users';
import type { ColumnFiltersState, SortingState } from '@tanstack/react-table';
import {
  parseAsIndex,
  parseAsInteger,
  parseAsString,
  useQueryStates,
} from 'nuqs';
import { useEffect, useMemo, useRef } from 'react';

const SORTABLE_IDS = ['name', 'email', 'createdAt'] as const;
const defaultSorting: SortingState = [{ id: 'createdAt', desc: true }];
const sortableColumnSet = new Set<string>(SORTABLE_IDS);

function normalizeSorting(value: SortingState): SortingState {
  const filtered = value.filter((item) => sortableColumnSet.has(item.id));
  return filtered.length > 0 ? filtered : defaultSorting;
}

/**
 * Admin users table with URL-synced search, sort, pagination and filters.
 */
export function AdminUsersContent() {
  const [{ page, size, search, sort, role, status }, setQueryStates] =
    useQueryStates({
      page: parseAsIndex.withDefault(0),
      size: parseAsInteger.withDefault(10),
      search: parseAsString.withDefault(''),
      sort: getSortingStateParser([...SORTABLE_IDS]).withDefault(
        defaultSorting as Parameters<
          ReturnType<typeof getSortingStateParser>['withDefault']
        >[0]
      ),
      role: parseAsString.withDefault(''),
      status: parseAsString.withDefault(''),
    });

  const safeSorting: UsersSortingState = normalizeSorting(sort as SortingState);

  // Build filters for both client UI and server API
  const filters = useMemo(() => {
    const clientFilters: ColumnFiltersState = [];
    const serverFilters: Array<{ id: string; value: string }> = [];

    if (role) {
      clientFilters.push({ id: 'role', value: [role] });
      serverFilters.push({ id: 'role', value: role });
    }
    if (status) {
      clientFilters.push({ id: 'status', value: [status] });
      serverFilters.push({ id: 'status', value: status });
    }

    return { clientFilters, serverFilters };
  }, [role, status]);

  // Reset page when filters change
  const filtersSignature = useMemo(
    () => JSON.stringify({ role, status }),
    [role, status]
  );
  const prevFiltersRef = useRef(filtersSignature);

  useEffect(() => {
    if (prevFiltersRef.current === filtersSignature) return;
    prevFiltersRef.current = filtersSignature;
    void setQueryStates(
      { page: 0 },
      { history: 'replace', shallow: true }
    );
  }, [filtersSignature, setQueryStates]);

  const { data, isLoading } = useUsers(
    page,
    size,
    search,
    safeSorting,
    filters.serverFilters
  );

  return (
    <UsersTable
      data={data?.items ?? []}
      total={data?.total ?? 0}
      pageIndex={page}
      pageSize={size}
      search={search}
      sorting={safeSorting}
      filters={filters.clientFilters}
      loading={isLoading}
      onSearch={(newSearch) => setQueryStates({ search: newSearch, page: 0 })}
      onPageChange={(newPage) => setQueryStates({ page: newPage })}
      onPageSizeChange={(newSize) => setQueryStates({ size: newSize, page: 0 })}
      onSortingChange={(newSorting) => {
        const next = normalizeSorting(newSorting);
        setQueryStates({ sort: next as typeof sort, page: 0 });
      }}
      onFiltersChange={(nextFilters) => {
        const roleFilter = nextFilters.find((f) => f.id === 'role');
        const statusFilter = nextFilters.find((f) => f.id === 'status');
        const nextRole =
          roleFilter && Array.isArray(roleFilter.value)
            ? ((roleFilter.value[0] as string) ?? '')
            : '';
        const nextStatus =
          statusFilter && Array.isArray(statusFilter.value)
            ? ((statusFilter.value[0] as string) ?? '')
            : '';
        setQueryStates(
          { role: nextRole, status: nextStatus, page: 0 },
          { history: 'replace', shallow: true }
        );
      }}
    />
  );
}
