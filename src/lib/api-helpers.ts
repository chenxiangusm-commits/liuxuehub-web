import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from './rate-limit';
import { SECURITY_HEADERS } from './security-headers';

export function applySecurityHeaders(response: NextResponse): NextResponse {
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  return response;
}

export function getClientIp(request: NextRequest): string | null {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  const xRealIp = request.headers.get('x-real-ip');
  if (xRealIp) {
    return xRealIp.trim();
  }
  return 'unknown';
}

export async function withApiProtection(
  request: NextRequest,
  handler: () => Promise<NextResponse>
): Promise<NextResponse> {
  const clientIp = getClientIp(request);
  const rateLimit = checkRateLimit(clientIp);

  if (!rateLimit.allowed) {
    const resetSeconds = Math.ceil((rateLimit.resetTime - Date.now()) / 1000);
    const response = NextResponse.json(
      {
        success: false,
        error: '请求过于频繁，请稍后再试',
        retryAfter: resetSeconds
      },
      { status: 429 }
    );
    response.headers.set('Retry-After', resetSeconds.toString());
    return applySecurityHeaders(response);
  }

  try {
    const response = await handler();
    response.headers.set('X-RateLimit-Limit', '20');
    response.headers.set('X-RateLimit-Remaining', rateLimit.remaining.toString());
    response.headers.set('X-RateLimit-Reset', rateLimit.resetTime.toString());
    return applySecurityHeaders(response);
  } catch (error) {
    console.error('API error:', error);
    const response = NextResponse.json(
      {
        success: false,
        error: '请求失败，请稍后重试'
      },
      { status: 500 }
    );
    return applySecurityHeaders(response);
  }
}
