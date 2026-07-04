type Attempt = { count: number; firstAttempt: number };

const attempts = new Map<string, Attempt>();

const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 5;

export function isRateLimited(key: string): boolean {
  const entry = attempts.get(key);
  if (!entry) return false;

  const now = Date.now();
  if (now - entry.firstAttempt > WINDOW_MS) {
    attempts.delete(key);
    return false;
  }

  return entry.count >= MAX_ATTEMPTS;
}

export function recordFailedAttempt(key: string): void {
  const now = Date.now();
  const entry = attempts.get(key);

  if (!entry || now - entry.firstAttempt > WINDOW_MS) {
    attempts.set(key, { count: 1, firstAttempt: now });
    return;
  }

  entry.count += 1;
}

export function clearAttempts(key: string): void {
  attempts.delete(key);
}