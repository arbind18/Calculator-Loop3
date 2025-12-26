import { NextResponse } from 'next/server'
import { implementedCalculatorList } from '@/lib/implementedCalculators'

interface CalculatorUsage {
  type: string
  timestamp: number
  inputs: Record<string, any>
  result?: any
}

// In production, this would use a real database and ML model
// For now, we'll use a simple collaborative filtering approach
export async function POST(request: Request) {
  try {
    const { calculatorType, userHistory, currentInputs } = await request.json()
    
    if (!calculatorType) {
      return NextResponse.json(
        { error: 'Calculator type is required' },
        { status: 400 }
      )
    }
    
    const recommendations = generateRecommendations(
      normalizeCalculatorId(calculatorType),
      userHistory || [],
      currentInputs || {}
    )
    
    return NextResponse.json({
      success: true,
      recommendations
    })
    
  } catch (error) {
    console.error('Recommendations API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function generateRecommendations(
  currentType: string,
  history: CalculatorUsage[],
  inputs: Record<string, any>
) {
  const recommendations: Array<{ id: string; score: number; reason: string }> = []

  const pushIfImplemented = (id: string, score: number, reason: string) => {
    const normalizedId = normalizeCalculatorId(id)
    if (!implementedCalculatorList.includes(normalizedId)) return
    recommendations.push({ id: normalizedId, score, reason })
  }
  
  // Build recommendation graph (which calculators are used together)
  const relationshipMap: Record<string, string[]> = {
    'personal-loan-emi': ['home-loan-emi', 'stamp-duty', 'income-tax-calculator', 'sip-calculator'],
    'home-loan-emi': ['personal-loan-emi', 'stamp-duty', 'rental-yield'],
    'sip-calculator': ['fd-calculator', 'income-tax-calculator', 'retirement-corpus', 'goal-planner'],
    'fd-calculator': ['sip-calculator', 'income-tax-calculator', 'nps-calculator'],
    'income-tax-calculator': ['hra-calculator', 'sip-calculator', 'nps-calculator', 'ppf-calculator'],
    'bmi-calculator': ['calorie-calculator', 'ideal-weight', 'body-fat', 'tdee-calculator'],
    'retirement-corpus': ['sip-calculator', 'ppf-calculator', 'nps-calculator', 'income-tax-calculator'],
    'car-loan-emi': ['personal-loan-emi', 'fuel-cost-calculator'],
    'gst-calculator': ['income-tax-calculator', 'profit-margin', 'business-loan-emi'],
  }
  
  // Get related calculators
  const related = relationshipMap[currentType] || []
  
  // Score based on relationship strength
  related.forEach((calcType, index) => {
    let score = 100 - (index * 10) // Higher score for closer relationships
    
    // Boost score if user has used this calculator before
    const usageCount = history.filter(h => h.type === calcType).length
    score += usageCount * 15
    
    // Contextual boosts based on inputs
    if (currentType === 'home-loan-emi' && inputs.principal > 2000000) {
      if (calcType === 'stamp-duty') score += 30
      if (calcType === 'rental-yield') score += 20
    }
    
    if (currentType === 'sip-calculator' && inputs.monthlyInvestment > 10000) {
      if (calcType === 'income-tax-calculator') score += 25
      if (calcType === 'retirement-corpus') score += 20
    }
    
    if (currentType === 'income-tax-calculator' && inputs.annualIncome > 1000000) {
      if (calcType === 'sip-calculator') score += 30
      if (calcType === 'nps-calculator') score += 25
    }

    pushIfImplemented(calcType, score, getRecommendationReason(currentType, calcType, inputs))
  })
  
  // Add trending/popular calculators with lower scores
  const popular = ['personal-loan-emi', 'sip-calculator', 'income-tax-calculator', 'bmi-calculator']
  popular.forEach(calcType => {
    if (calcType !== currentType && !recommendations.find(r => r.id === calcType)) {
      pushIfImplemented(calcType, 40, 'Popular calculator')
    }
  })
  
  // Sort by score and return top 5
  return recommendations
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
}

function getRecommendationReason(
  fromType: string,
  toType: string,
  inputs: Record<string, any>
): string {
  const reasonMap: Record<string, Record<string, string>> = {
    'personal-loan-emi': {
      'home-loan-emi': 'Calculate home loan with detailed breakdown',
      'stamp-duty': 'Estimate property registration costs',
      'income-tax-calculator': 'Plan tax savings on home loan',
    },
    'home-loan-emi': {
      'stamp-duty': 'Essential for property purchase',
      'rental-yield': 'Evaluate property investment returns',
      'property-tax': 'Calculate annual property taxes',
    },
    'sip-calculator': {
      'fd-calculator': 'Compare with fixed deposit returns',
      'income-tax-calculator': 'Maximize tax savings under 80C',
      'retirement-corpus': 'Plan long-term retirement corpus',
    },
    'income-tax-calculator': {
      'hra-calculator': 'Maximize HRA exemption',
      'sip-calculator': 'Invest tax savings under 80C',
      'nps-calculator': 'Additional ₹50K deduction under 80CCD',
    },
    'bmi-calculator': {
      'calorie-calculator': 'Plan your diet requirements',
      'ideal-weight': 'Set realistic weight goals',
      'body-fat': 'Detailed body composition analysis',
    },
  }
  
  return reasonMap[fromType]?.[toType] || 'Related calculator'
}

function normalizeCalculatorId(id: string): string {
  const map: Record<string, string> = {
    'emi-calculator': 'personal-loan-emi',
    'personal-loan': 'personal-loan-emi',
    'income-tax': 'income-tax-calculator',
    'fuel-cost': 'fuel-cost-calculator',
    'ideal-weight': 'ideal-weight-calculator',
    'body-fat': 'body-fat-calculator',
    'retirement-calculator': 'retirement-corpus',
  }
  return map[id] || id
}
