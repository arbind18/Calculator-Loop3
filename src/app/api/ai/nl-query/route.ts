import { NextResponse } from 'next/server'
import { parseNaturalLanguageQuery, getCalculatorUrl } from '@/lib/ai/nlQueryParser'

export async function POST(request: Request) {
  try {
    const { query, userHistory } = await request.json()
    
    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      )
    }
    
    // Parse natural language query
    const parsed = parseNaturalLanguageQuery(query)
    
    if (!parsed) {
      return NextResponse.json({
        success: false,
        message: 'Could not understand the query. Try being more specific about the calculator and values.',
        suggestions: [
          'EMI calculator: "Calculate EMI for 30 lakh loan at 8.5% for 20 years"',
          'SIP calculator: "Monthly SIP of 5000 for 10 years at 12% return"',
          'BMI calculator: "My weight is 75kg and height 175cm"',
          'Tax calculator: "Calculate tax on 12 lakh annual salary"'
        ]
      })
    }
    
    // Get calculator URL with pre-filled inputs
    const calculatorUrl = getCalculatorUrl(parsed)
    
    return NextResponse.json({
      success: true,
      calculatorType: parsed.calculatorType,
      confidence: parsed.confidence,
      inputs: parsed.inputs,
      calculatorUrl,
      message: `I understood you want to use the ${parsed.calculatorType.replace('-', ' ')}. I've extracted the following values:`,
      extractedValues: Object.entries(parsed.inputs).map(([key, value]) => ({
        field: key,
        value: value
      }))
    })
    
  } catch (error) {
    console.error('NL Query API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
