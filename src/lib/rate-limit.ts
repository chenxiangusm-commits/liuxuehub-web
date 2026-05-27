const RATE_LIMIT_WINDOW_MS = 60000;
const RATE_LIMIT_MAX_REQUESTS = 20;

interface RateLimitInfo {
  count: number;
  resetTime: number;
}

const ipRequests = new Map<string, RateLimitInfo>();

function cleanupOldEntries() {
  const now = Date.now();
  for (const [ip, info] of ipRequests) {
    if (now > info.resetTime) {
      ipRequests.delete(ip);
    }
  }
}

setInterval(cleanupOldEntries, RATE_LIMIT_WINDOW_MS);

export function checkRateLimit(ip: string | null): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const clientIp = ip || 'unknown';

  let requestInfo = ipRequests.get(clientIp);

  if (!requestInfo || now > requestInfo.resetTime) {
    requestInfo = {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW_MS
    };
    ipRequests.set(clientIp, requestInfo);
    return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - 1, resetTime: requestInfo.resetTime };
  }

  if (requestInfo.count >= RATE_LIMIT_MAX_REQUESTS) {
    return { allowed: false, remaining: 0, resetTime: requestInfo.resetTime };
  }

  requestInfo.count++;
  return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - requestInfo.count, resetTime: requestInfo.resetTime };
}
