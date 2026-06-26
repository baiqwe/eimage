import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {
  deleteUserFile,
  listUserFiles,
  uploadUserFile,
} from '@/api/user-files';
import { authClient } from '@/auth/client';
import { DEFAULT_AVATARS_FOLDER } from '@/storage/constants';

export const userFilesKeys = {
  all: (userId: string) => ['user-files', userId] as const,
  lists: (userId: string) => [...userFilesKeys.all(userId), 'lists'] as const,
  list: (userId: string, params: { pageIndex: number; pageSize: number }) =>
    [...userFilesKeys.lists(userId), params] as const,
};

/**
 * Fetches a list of user files
 */
export function useUserFiles(pageIndex: number, pageSize: number) {
  const { data: session } = authClient.useSession();
  const userId = session?.user.id ?? '';

  return useQuery({
    queryKey: userFilesKeys.list(userId, { pageIndex, pageSize }),
    queryFn: () => listUserFiles({ data: { pageIndex, pageSize } }),
    enabled: Boolean(userId),
    placeholderData: keepPreviousData,
  });
}

/**
 * Deletes a user file
 */
export function useDeleteUserFile() {
  const queryClient = useQueryClient();
  const { data: session } = authClient.useSession();
  const userId = session?.user.id ?? '';

  return useMutation({
    mutationFn: (id: string) => deleteUserFile({ data: { id } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userFilesKeys.all(userId) });
    },
  });
}

/**
 * Uploads a user file
 */
export function useUploadUserFile() {
  const queryClient = useQueryClient();
  const { data: session } = authClient.useSession();
  const userId = session?.user.id ?? '';

  return useMutation({
    mutationFn: async (params: {
      file: File;
      isPublic?: boolean;
      description?: string;
    }) => {
      const form = new FormData();
      form.append('file', params.file);
      if (params.isPublic !== undefined) {
        form.append('isPublic', params.isPublic ? 'true' : 'false');
      }
      if (params.description != null && params.description !== '') {
        form.append('description', params.description);
      }
      return uploadUserFile({ data: form });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userFilesKeys.all(userId) });
    },
  });
}

/**
 * Uploads a file to the avatars folder
 */
export function useUploadUserAvatar() {
  return useMutation({
    mutationFn: async (file: File) => {
      const form = new FormData();
      form.append('file', file);
      form.append('isPublic', 'true');
      form.append('folder', DEFAULT_AVATARS_FOLDER);
      return uploadUserFile({ data: form });
    },
  });
}
