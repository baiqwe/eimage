import {
  ErrorComponent,
  Link,
  rootRouteId,
  useMatch,
  useRouter,
} from '@tanstack/react-router';
import type { ErrorComponentProps } from '@tanstack/react-router';
import { messages } from '@/config/messages';

const m = messages.catchBoundary;

/**
 * Default catch boundary component for TanStack Router
 * https://github.com/TanStack/router/blob/main/examples/react/start-basic-cloudflare/src/components/DefaultCatchBoundary.tsx
 */
export function DefaultCatchBoundary({ error }: ErrorComponentProps) {
  const router = useRouter();
  const isRoot = useMatch({
    strict: false,
    select: (state) => state.id === rootRouteId,
  });

  console.error('DefaultCatchBoundary Error:', error);

  return (
    <div className="min-w-0 flex-1 p-4 flex flex-col items-center justify-center gap-6">
      <ErrorComponent error={error} />
      <div className="flex gap-2 items-center flex-wrap">
        <button
          onClick={() => {
            router.invalidate();
          }}
          className={`px-2 py-1 bg-gray-600 dark:bg-gray-700 rounded-sm text-white uppercase font-extrabold`}
        >
          {m.tryAgain}
        </button>
        {isRoot ? (
          <Link
            to="/"
            className={`px-2 py-1 bg-gray-600 dark:bg-gray-700 rounded-sm text-white uppercase font-extrabold`}
          >
            {m.backToHome}
          </Link>
        ) : (
          <Link
            to="/"
            className={`px-2 py-1 bg-gray-600 dark:bg-gray-700 rounded-sm text-white uppercase font-extrabold`}
            onClick={(e) => {
              e.preventDefault();
              window.history.back();
            }}
          >
            {m.goBack}
          </Link>
        )}
      </div>
    </div>
  );
}
