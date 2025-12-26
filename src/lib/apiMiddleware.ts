import { NextRequest, NextResponse } from 'next/server';
import { authenticateApiKey, checkRateLimit, logApiUsage } from '@/lib/apiAuth';

export interface ApiRequest extends NextRequest {
  apiKey?: any;
  user?: any;
}

/**
 * API authentication middleware
 */
export async function withApiAuth(
  handler: (req: ApiRequest) => Promise<NextResponse>
) {
  return async (req: NextRequest) => {
    const startTime = Date.now();

    try {
      // Authenticate API key using the request object
      const auth = await authenticateApiKey(req);

      if (!auth.valid) {
        return NextResponse.json(
          {
            error: 'Authentication failed',
            message: auth.error,
          },
          { status: 401 }
        );
      }

      // Check rate limit
      const rateLimit = await checkRateLimit(auth.apiKey.id, auth.apiKey.tier);

      if (!rateLimit.allowed) {
        const resetDate = new Date(rateLimit.resetTime);
        const response = NextResponse.json(
          {
            error: 'Rate limit exceeded',
            message: `You have exceeded your ${auth.apiKey.tier} tier limit`,
            resetTime: resetDate.toISOString(),
          },
          { status: 429 }
        );

        // Add rate limit headers
        const limitValue = auth.apiKey.tier === 'FREE' ? '100' : auth.apiKey.tier === 'BASIC' ? '500' : auth.apiKey.tier === 'PRO' ? '1000' : '10000';
        response.headers.set('X-RateLimit-Limit', limitValue);
        response.headers.set('X-RateLimit-Remaining', '0');
        response.headers.set('X-RateLimit-Reset', resetDate.toISOString());

        return response;
      }

      // Attach API key and user to request
      const apiReq = req as ApiRequest;
      apiReq.apiKey = auth.apiKey;

      // Call handler
      const response = await handler(apiReq);

      // Add rate limit headers to response
      const resetDate = new Date(rateLimit.resetTime);
      const limitValue = auth.apiKey.tier === 'FREE' ? '100' : auth.apiKey.tier === 'BASIC' ? '500' : auth.apiKey.tier === 'PRO' ? '1000' : '10000';
      response.headers.set('X-RateLimit-Limit', limitValue);
      response.headers.set('X-RateLimit-Remaining', rateLimit.remaining.toString());
      response.headers.set('X-RateLimit-Reset', resetDate.toISOString());

      // Log API usage (fire and forget)
      const responseTime = Date.now() - startTime;
      logApiUsage(
        auth.apiKey.id,
        req.nextUrl.pathname,
        req.method,
        response.status,
        req
      ).catch((error) => console.error('Failed to log API usage:', error));

      return response;
    } catch (error) {
      console.error('API middleware error:', error);
      return NextResponse.json(
        {
          error: 'Internal server error',
          message: 'An error occurred while processing your request',
        },
        { status: 500 }
      );
    }
  };
}

/**
 * Create standard API response
 */
export function createApiResponse(data: any, status: number = 200) {
  return NextResponse.json(
    {
      success: status >= 200 && status < 300,
      data,
      timestamp: new Date().toISOString(),
    },
    { status }
  );
}

/**
 * Create standard API error response
 */
export function createApiError(message: string, code: string, status: number = 400) {
  return NextResponse.json(
    {
      success: false,
      error: {
        code,
        message,
      },
      timestamp: new Date().toISOString(),
    },
    { status }
  );
}
