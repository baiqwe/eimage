type GeneratorSessionMode = 'photo-set' | 'batch' | 'white-background';

export interface GeneratorSessionTask {
  clientId: string;
  serverTaskId: string;
  name: string;
}

export interface GeneratorSession {
  mode: GeneratorSessionMode;
  userId: string;
  batchId: string;
  tasks: GeneratorSessionTask[];
  createdAt: number;
}

const PREFIX = 'prodlist:generator-session';
const MAX_AGE_MS = 2 * 60 * 60 * 1000;

function getKey(mode: GeneratorSessionMode, userId: string) {
  return `${PREFIX}:${mode}:${userId}`;
}

export function saveGeneratorSession(session: GeneratorSession) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(
      getKey(session.mode, session.userId),
      JSON.stringify(session)
    );
  } catch {
    // Local storage may be unavailable in private browsing.
  }
}

export function loadGeneratorSession(
  mode: GeneratorSessionMode,
  userId: string
): GeneratorSession | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(getKey(mode, userId));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as GeneratorSession;
    if (
      parsed.mode !== mode ||
      parsed.userId !== userId ||
      Date.now() - parsed.createdAt > MAX_AGE_MS
    ) {
      clearGeneratorSession(mode, userId);
      return null;
    }
    return parsed;
  } catch {
    clearGeneratorSession(mode, userId);
    return null;
  }
}

export function clearGeneratorSession(
  mode: GeneratorSessionMode,
  userId: string
) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(getKey(mode, userId));
  } catch {
    // noop
  }
}
