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
      weight: number;
      height: number;
      unit?: 'metric' | 'imperial';
    }>(body, ['weight', 'height']);

    if (!validation.valid) {
      await logApiUsage(apiKey.id, '/api/v1/calculators/bmi', 'POST', 400, request);
      return createApiResponse({ message: 'Validation failed', errors: validation.errors }, 400);
    }

    let { weight, height, unit = 'metric' } = validation.data!;

    // Convert imperial to metric if needed
    if (unit === 'imperial') {
      weight = weight * 0.453592; // pounds to kg
      height = height * 2.54; // inches to cm
    }

    // Validate ranges
    if (weight <= 0 || weight > 500) {
      await logApiUsage(apiKey.id, '/api/v1/calculators/bmi', 'POST', 400, request);
      return createApiResponse({ message: 'Weight must be between 0 and 500 kg' }, 400);
    }

    if (height <= 0 || height > 300) {
      await logApiUsage(apiKey.id, '/api/v1/calculators/bmi', 'POST', 400, request);
      return createApiResponse({ message: 'Height must be between 0 and 300 cm' }, 400);
    }

    // Calculate BMI
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);

    // Determine category
    let category = '';
    let healthStatus = '';
    if (bmi < 18.5) {
      category = 'Underweight';
      healthStatus = 'Below normal weight';
    } else if (bmi < 25) {
      category = 'Normal';
      healthStatus = 'Healthy weight';
    } else if (bmi < 30) {
      category = 'Overweight';
      healthStatus = 'Above normal weight';
    } else {
      category = 'Obese';
      healthStatus = 'Significantly above normal weight';
    }

    // Prepare response
    const result = {
      inputs: {
        weight,
        height,
        unit,
      },
      results: {
        bmi: parseFloat(bmi.toFixed(2)),
        category,
        healthStatus,
        idealWeightRange: {
          min: parseFloat((18.5 * heightInMeters * heightInMeters).toFixed(2)),
          max: parseFloat((24.9 * heightInMeters * heightInMeters).toFixed(2)),
        },
      },
      metadata: {
        calculatedAt: new Date().toISOString(),
        processingTime: `${Date.now() - startTime}ms`,
        apiVersion: 'v1',
      },
    };

    // Log successful usage
    await logApiUsage(apiKey.id, '/api/v1/calculators/bmi', 'POST', 200, request);

    return createApiResponse(result, 200, {
      'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
      'X-RateLimit-Reset': new Date(rateLimitResult.resetTime).toISOString(),
    });
  } catch (error: any) {
    console.error('BMI API error:', error);
    return createApiResponse({ message: 'Internal server error' }, 500);
  }
}

export async function GET(request: NextRequest) {
  // Documentation endpoint
  const docs = {
    endpoint: '/api/v1/calculators/bmi',
    method: 'POST',
    description: 'Calculate BMI (Body Mass Index) and health category',
    authentication: 'Bearer token in Authorization header or api_key query parameter',
    requestBody: {
      weight: {
        type: 'number',
        required: true,
        description: 'Weight in kg (metric) or pounds (imperial)',
        example: 70,
      },
      height: {
        type: 'number',
        required: true,
        description: 'Height in cm (metric) or inches (imperial)',
        example: 175,
      },
      unit: {
        type: 'string',
        required: false,
        description: 'Unit system: "metric" or "imperial"',
        default: 'metric',
        example: 'metric',
      },
    },
    response: {
      success: true,
      data: {
        inputs: { weight: 70, height: 175, unit: 'metric' },
        results: {
          bmi: 22.86,
          category: 'Normal',
          healthStatus: 'Healthy weight',
          idealWeightRange: { min: 56.66, max: 76.22 },
        },
      },
    },
  };

  return createApiResponse(docs);
}
