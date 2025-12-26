import { NextRequest } from 'next/server';
import {
  authenticateApiKey,
  checkRateLimit,
  logApiUsage,
  validateRequestBody,
  createApiResponse,
} from '@/lib/apiAuth';

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    // Authenticate API key
    const authResult = await authenticateApiKey(request);
    if (!authResult.valid) {
      return createApiResponse({ message: authResult.error }, 401);
    }

    const { apiKey } = authResult;

    // Check rate limit
    const rateLimitResult = await checkRateLimit(apiKey.id, apiKey.tier);
    if (!rateLimitResult.allowed) {
      const resetTime = new Date(rateLimitResult.resetTime).toISOString();
      return createApiResponse(
        { message: 'Rate limit exceeded', resetTime },
        429,
        {
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': resetTime,
        }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validation = validateRequestBody<{
      principal: number;
      interestRate: number;
      tenure: number;
    }>(body, ['principal', 'interestRate', 'tenure']);

    if (!validation.valid) {
      await logApiUsage(apiKey.id, '/api/v1/calculators/emi', 'POST', 400, request);
      return createApiResponse({ message: 'Validation failed', errors: validation.errors }, 400);
    }

    const { principal, interestRate, tenure } = validation.data!;

    // Validate numeric ranges
    if (principal <= 0 || principal > 100000000) {
      await logApiUsage(apiKey.id, '/api/v1/calculators/emi', 'POST', 400, request);
      return createApiResponse(
        { message: 'Principal must be between 1 and 100,000,000' },
        400
      );
    }

    if (interestRate <= 0 || interestRate > 50) {
      await logApiUsage(apiKey.id, '/api/v1/calculators/emi', 'POST', 400, request);
      return createApiResponse({ message: 'Interest rate must be between 0 and 50' }, 400);
    }

    if (tenure <= 0 || tenure > 30) {
      await logApiUsage(apiKey.id, '/api/v1/calculators/emi', 'POST', 400, request);
      return createApiResponse({ message: 'Tenure must be between 1 and 30 years' }, 400);
    }

    // Calculate EMI
    const P = principal;
    const r = interestRate / 12 / 100;
    const n = tenure * 12;

    const emi = Math.round((P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
    const totalAmount = emi * n;
    const totalInterest = totalAmount - P;

    // Prepare response
    const result = {
      inputs: {
        principal: P,
        interestRate,
        tenure,
      },
      results: {
        monthlyEMI: emi,
        totalAmount,
        totalInterest,
        totalPayable: totalAmount,
      },
      metadata: {
        calculatedAt: new Date().toISOString(),
        processingTime: `${Date.now() - startTime}ms`,
        apiVersion: 'v1',
      },
    };

    // Log successful usage
    await logApiUsage(apiKey.id, '/api/v1/calculators/emi', 'POST', 200, request);

    return createApiResponse(result, 200, {
      'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
      'X-RateLimit-Reset': new Date(rateLimitResult.resetTime).toISOString(),
    });
  } catch (error: any) {
    console.error('EMI API error:', error);
    return createApiResponse({ message: 'Internal server error' }, 500);
  }
}

export async function GET(request: NextRequest) {
  // Documentation endpoint
  const docs = {
    endpoint: '/api/v1/calculators/emi',
    method: 'POST',
    description: 'Calculate EMI (Equated Monthly Installment) for loans',
    authentication: 'Bearer token in Authorization header or api_key query parameter',
    requestBody: {
      principal: {
        type: 'number',
        required: true,
        description: 'Loan amount (1 to 100,000,000)',
        example: 1000000,
      },
      interestRate: {
        type: 'number',
        required: true,
        description: 'Annual interest rate percentage (0 to 50)',
        example: 8.5,
      },
      tenure: {
        type: 'number',
        required: true,
        description: 'Loan tenure in years (1 to 30)',
        example: 20,
      },
    },
    response: {
      success: true,
      data: {
        inputs: { principal: 1000000, interestRate: 8.5, tenure: 20 },
        results: {
          monthlyEMI: 8678,
          totalAmount: 2082720,
          totalInterest: 1082720,
        },
      },
    },
    rateLimit: {
      FREE: '100 requests/hour',
      BASIC: '500 requests/hour',
      PRO: '1000 requests/hour',
      ENTERPRISE: '10000 requests/hour',
    },
  };

  return createApiResponse(docs);
}
