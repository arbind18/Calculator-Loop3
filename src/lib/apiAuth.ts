// API Authentication and Rate Limiting

import { prisma } from './prisma';
import { NextRequest } from 'next/server';
import crypto from 'crypto';

// Rate limit configuration
const RATE_LIMITS = {
  FREE: { requests: 100, window: 3600 }, // 100 requests per hour
  BASIC: { requests: 500, window: 3600 }, // 500 requests per hour
  PRO: { requests: 1000, window: 3600 }, // 1000 requests per hour
  ENTERPRISE: { requests: 10000, window: 3600 }, // 10000 requests per hour
};

// In-memory rate limit store (production mein Redis use karein)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

/**
 * Generate a new API key
 */
export function generateApiKey(): string {
  const prefix = 'ck_'; // calculator key
  const randomBytes = crypto.randomBytes(32).toString('hex');
  return `${prefix}${randomBytes}`;
}

function normalizeTier(tier: string | undefined): 'FREE' | 'BASIC' | 'PRO' | 'ENTERPRISE' {
  const upper = (tier ?? 'FREE').toString().trim().toUpperCase();
  if (upper === 'FREE' || upper === 'BASIC' || upper === 'PRO' || upper === 'ENTERPRISE') {
    return upper;
  }
  return 'FREE';
}

export async function createApiKey(
  userId: string,
  name: string,
  tier?: string,
  expiresInDays?: number
) {
  const expiresAt =
    typeof expiresInDays === 'number' && Number.isFinite(expiresInDays) && expiresInDays > 0
      ? new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000)
      : null;

  return prisma.apiKey.create({
    data: {
      userId,
      name: name.trim(),
      key: generateApiKey(),
      tier: normalizeTier(tier),
      expiresAt,
    },
  });
}

export async function revokeApiKey(apiKeyId: string, userId: string) {
  const result = await prisma.apiKey.updateMany({
    where: {
      id: apiKeyId,
      userId,
      isActive: true,
    },
    data: {
      isActive: false,
    },
  });

  if (result.count === 0) {
    throw new Error('API key not found');
  }
}

/**
 * Validate API key format
 */
export function isValidApiKeyFormat(key: string): boolean {
  return /^ck_[a-f0-9]{64}$/.test(key);
}

/**
 * Authenticate API request
 */
export async function authenticateApiKey(
  request: NextRequest
): Promise<{ valid: boolean; apiKey?: any; error?: string }> {
  const authHeader = request.headers.get('authorization');
  const apiKeyFromHeader = authHeader?.replace('Bearer ', '');

  // Check for API key in query params as fallback
  const url = new URL(request.url);
  const apiKeyFromQuery = url.searchParams.get('api_key');

  const apiKeyValue = apiKeyFromHeader || apiKeyFromQuery;

  if (!apiKeyValue) {
    return { valid: false, error: 'API key is required' };
  }

  if (!isValidApiKeyFormat(apiKeyValue)) {
    return { valid: false, error: 'Invalid API key format' };
  }

  try {
    const apiKey = await prisma.apiKey.findUnique({
      where: { key: apiKeyValue },
      include: { user: true },
    });

    if (!apiKey) {
      return { valid: false, error: 'Invalid API key' };
    }

    if (!apiKey.isActive) {
      return { valid: false, error: 'API key is inactive' };
    }

    if (apiKey.expiresAt && new Date() > apiKey.expiresAt) {
      return { valid: false, error: 'API key has expired' };
    }

    return { valid: true, apiKey };
  } catch (error) {
    console.error('API authentication error:', error);
    return { valid: false, error: 'Authentication failed' };
  }
}

/**
 * Check rate limit for API key
 */
export async function checkRateLimit(
  apiKeyId: string,
  tier: 'FREE' | 'BASIC' | 'PRO' | 'ENTERPRISE'
): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
  const limit = RATE_LIMITS[tier];
  const now = Date.now();
  const key = `ratelimit:${apiKeyId}`;

  let data = rateLimitStore.get(key);

  // Initialize or reset if window expired
  if (!data || now > data.resetTime) {
    data = {
      count: 0,
      resetTime: now + limit.window * 1000,
    };
    rateLimitStore.set(key, data);
  }

  // Increment count
  data.count++;

  const allowed = data.count <= limit.requests;
  const remaining = Math.max(0, limit.requests - data.count);

  return {
    allowed,
    remaining,
    resetTime: data.resetTime,
  };
}

/**
 * Log API usage
 */
export async function logApiUsage(
  apiKeyId: string,
  endpoint: string,
  method: string,
  statusCode: number,
  request: NextRequest
) {
  try {
    // Update last used timestamp
    await prisma.apiKey.update({
      where: { id: apiKeyId },
      data: { lastUsedAt: new Date() },
    });

    // Log usage
    await prisma.apiUsage.create({
      data: {
        apiKeyId,
        endpoint,
        method,
        statusCode,
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
        userAgent: request.headers.get('user-agent'),
      },
    });
  } catch (error) {
    console.error('Failed to log API usage:', error);
  }
}

/**
 * Get API usage statistics
 */
export async function getApiUsageStats(apiKeyId: string, days: number = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const usage = await prisma.apiUsage.findMany({
    where: {
      apiKeyId,
      timestamp: {
        gte: startDate,
      },
    },
    orderBy: {
      timestamp: 'desc',
    },
  });

  // Calculate statistics
  const totalRequests = usage.length;
  const successfulRequests = usage.filter((u) => u.statusCode >= 200 && u.statusCode < 300).length;
  const failedRequests = totalRequests - successfulRequests;

  // Group by endpoint
  const endpointStats = usage.reduce((acc, u) => {
    acc[u.endpoint] = (acc[u.endpoint] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Group by day
  const dailyStats = usage.reduce((acc, u) => {
    const day = u.timestamp.toISOString().split('T')[0];
    acc[day] = (acc[day] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return {
    totalRequests,
    successfulRequests,
    failedRequests,
    successRate: totalRequests > 0 ? (successfulRequests / totalRequests) * 100 : 0,
    endpointStats,
    dailyStats,
    recentUsage: usage.slice(0, 100),
  };
}

/**
 * Validate request body against schema
 */
export function validateRequestBody<T>(
  body: any,
  requiredFields: string[]
): { valid: boolean; data?: T; errors?: string[] } {
  const errors: string[] = [];

  for (const field of requiredFields) {
    if (!(field in body)) {
      errors.push(`Missing required field: ${field}`);
    }
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return { valid: true, data: body as T };
}

/**
 * Create API response with standard format
 */
export function createApiResponse(
  data: any,
  statusCode: number = 200,
  headers?: Record<string, string>
) {
  const response = {
    success: statusCode >= 200 && statusCode < 300,
    data: statusCode >= 200 && statusCode < 300 ? data : undefined,
    error: statusCode >= 400 ? data : undefined,
    timestamp: new Date().toISOString(),
  };

  return new Response(JSON.stringify(response), {
    status: statusCode,
    headers: {
      'Content-Type': 'application/json',
      'X-RateLimit-Limit': '100',
      ...headers,
    },
  });
}
