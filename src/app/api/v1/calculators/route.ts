import { NextRequest } from 'next/server';
import { createApiResponse } from '@/lib/apiMiddleware';

export async function GET(req: NextRequest) {
  const calculators = [
    {
      id: 'emi',
      name: 'EMI Calculator',
      description: 'Calculate Equated Monthly Installment for loans',
      category: 'Financial',
      endpoint: '/api/v1/calculators/emi',
      methods: ['GET', 'POST'],
      parameters: {
        GET: [
          {
            name: 'principal',
            type: 'number',
            required: true,
            description: 'Loan amount in INR',
          },
          {
            name: 'interestRate',
            type: 'number',
            required: true,
            description: 'Annual interest rate in percentage',
          },
          {
            name: 'tenure',
            type: 'number',
            required: true,
            description: 'Loan tenure in years',
          },
        ],
        POST: [
          {
            name: 'principal',
            type: 'number',
            required: true,
            description: 'Loan amount in INR',
          },
          {
            name: 'interestRate',
            type: 'number',
            required: true,
            description: 'Annual interest rate in percentage',
          },
          {
            name: 'tenure',
            type: 'number',
            required: true,
            description: 'Loan tenure in years',
          },
          {
            name: 'includeSchedule',
            type: 'boolean',
            required: false,
            description: 'Include full amortization schedule',
          },
        ],
      },
      exampleRequest: {
        GET: '/api/v1/calculators/emi?principal=1000000&interestRate=8.5&tenure=20',
        POST: {
          principal: 1000000,
          interestRate: 8.5,
          tenure: 20,
          includeSchedule: true,
        },
      },
    },
    {
      id: 'bmi',
      name: 'BMI Calculator',
      description: 'Calculate Body Mass Index and health metrics',
      category: 'Health',
      endpoint: '/api/v1/calculators/bmi',
      methods: ['GET', 'POST'],
      parameters: {
        GET: [
          {
            name: 'weight',
            type: 'number',
            required: true,
            description: 'Weight in kg (metric) or lbs (imperial)',
          },
          {
            name: 'height',
            type: 'number',
            required: true,
            description: 'Height in cm (metric) or inches (imperial)',
          },
          {
            name: 'unit',
            type: 'string',
            required: false,
            description: 'Unit system: "metric" or "imperial" (default: metric)',
          },
        ],
        POST: [
          {
            name: 'weight',
            type: 'number',
            required: true,
            description: 'Weight in kg (metric) or lbs (imperial)',
          },
          {
            name: 'height',
            type: 'number',
            required: true,
            description: 'Height in cm (metric) or inches (imperial)',
          },
          {
            name: 'unit',
            type: 'string',
            required: false,
            description: 'Unit system: "metric" or "imperial"',
          },
          {
            name: 'age',
            type: 'number',
            required: false,
            description: 'Age in years (for calorie calculation)',
          },
          {
            name: 'gender',
            type: 'string',
            required: false,
            description: 'Gender: "male" or "female" (for calorie calculation)',
          },
        ],
      },
      exampleRequest: {
        GET: '/api/v1/calculators/bmi?weight=70&height=170&unit=metric',
        POST: {
          weight: 70,
          height: 170,
          unit: 'metric',
          age: 30,
          gender: 'male',
        },
      },
    },
  ];

  return createApiResponse({
    calculators,
    total: calculators.length,
    version: 'v1',
  });
}
