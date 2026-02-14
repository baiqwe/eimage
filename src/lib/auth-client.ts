import { createAuthClient } from 'better-auth/react';
import { getBaseUrl } from './urls';

export const authClient = createAuthClient({
  baseURL: getBaseUrl(),
});
