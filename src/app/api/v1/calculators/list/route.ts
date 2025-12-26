import { NextRequest } from 'next/server';
import { authenticateApiKey, createApiResponse } from '@/lib/apiAuth';

export async function GET(request: NextRequest) {
  try {
    // Authenticate API key
    const authResult = await authenticateApiKey(request);
    if (!authResult.valid) {
      return createApiResponse({ message: authResult.error }, 401);
    }

    const calculators = [
      {
        id: 'emi',
        name: 'EMI Calculator',
        description: 'Calculate Equated Monthly Installments for loans',
        category: 'Financial',
        endpoint: '/api/v1/calculators/emi',
        method: 'POST',
        requiredFields: ['principal', 'interestRate', 'tenure'],
      },
      {
        id: 'bmi',
        name: 'BMI Calculator',
        description: 'Calculate Body Mass Index and health category',
        category: 'Health',
        endpoint: '/api/v1/calculators/bmi',
        method: 'POST',
        requiredFields: ['weight', 'height'],
      },
      {
        id: 'sip',
        name: 'SIP Calculator',
        description: 'Calculate Systematic Investment Plan returns',
        category: 'Investment',
        endpoint: '/api/v1/calculators/sip',
        method: 'POST',
        requiredFields: ['monthlyInvestment', 'expectedReturn', 'timePeriod'],
        status: 'coming_soon',
      },
      {
        id: 'tax',
        name: 'Income Tax Calculator',
        description: 'Calculate income tax based on Indian tax slabs',
        category: 'Tax',
        endpoint: '/api/v1/calculators/tax',
        method: 'POST',
        requiredFields: ['income', 'regime'],
        status: 'coming_soon',
      },
    ];

    return createApiResponse({
      total: calculators.length,
      available: calculators.filter((c) => !c.status).length,
      calculators,
    });
  } catch (error) {
    console.error('List calculators error:', error);
    return createApiResponse({ message: 'Internal server error' }, 500);
  }
}
