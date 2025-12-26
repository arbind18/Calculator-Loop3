// Natural Language Query Parser for Calculator Inputs

export interface ParsedQuery {
  calculatorType: string
  confidence: number
  inputs: Record<string, any>
  originalQuery: string
}

export function parseNaturalLanguageQuery(query: string): ParsedQuery | null {
  const lowerQuery = query.toLowerCase()
  
  // EMI/Loan Calculator Detection
  const emiPatterns = [
    /(?:calculate|find|what is|show|tell)\s+(?:my\s+)?(?:emi|monthly payment|installment)/i,
    /(?:loan|borrow|lena).*?(?:emi|monthly|payment)/i,
    /(\d+(?:,\d+)*(?:\.\d+)?)\s*(?:lakh|lac|thousand|crore)?\s*(?:ka\s+)?(?:loan|rupees?)/i,
  ]
  
  if (emiPatterns.some(p => p.test(query))) {
    return {
      calculatorType: 'emi-calculator',
      confidence: 0.85,
      inputs: extractLoanInputs(query),
      originalQuery: query
    }
  }
  
  // SIP Calculator Detection
  const sipPatterns = [
    /(?:sip|systematic investment|mutual fund|monthly investment)/i,
    /(?:invest|investing).*?(?:monthly|every month|har mahina)/i,
    /(\d+(?:,\d+)*)\s*(?:rupees?)?\s*(?:sip|per month|monthly)/i,
  ]
  
  if (sipPatterns.some(p => p.test(query))) {
    return {
      calculatorType: 'sip-calculator',
      confidence: 0.80,
      inputs: extractSIPInputs(query),
      originalQuery: query
    }
  }
  
  // BMI Calculator Detection
  const bmiPatterns = [
    /(?:bmi|body mass index|weight|height)/i,
    /(?:am i|check if).*?(?:overweight|underweight|healthy|obese)/i,
    /(\d+(?:\.\d+)?)\s*(?:kg|kilo).*?(\d+(?:\.\d+)?)\s*(?:cm|meter|feet)/i,
  ]
  
  if (bmiPatterns.some(p => p.test(query))) {
    return {
      calculatorType: 'bmi-calculator',
      confidence: 0.90,
      inputs: extractBMIInputs(query),
      originalQuery: query
    }
  }
  
  // Income Tax Calculator Detection
  const taxPatterns = [
    /(?:income tax|tax|deduction|80c|hra)/i,
    /(?:salary|income).*?(?:tax|calculate tax)/i,
    /(?:how much tax|tax saving|tax calculation)/i,
  ]
  
  if (taxPatterns.some(p => p.test(query))) {
    return {
      calculatorType: 'income-tax',
      confidence: 0.75,
      inputs: extractTaxInputs(query),
      originalQuery: query
    }
  }
  
  // FD Calculator Detection
  const fdPatterns = [
    /(?:fixed deposit|fd|bank deposit)/i,
    /(?:deposit|invest).*?(?:bank|fd)/i,
  ]
  
  if (fdPatterns.some(p => p.test(query))) {
    return {
      calculatorType: 'fd-calculator',
      confidence: 0.80,
      inputs: extractFDInputs(query),
      originalQuery: query
    }
  }
  
  return null
}

function extractLoanInputs(query: string): Record<string, any> {
  const inputs: Record<string, any> = {}
  
  // Extract loan amount
  const amountPatterns = [
    /(\d+(?:,\d+)*(?:\.\d+)?)\s*(lakh|lac)/i,
    /(\d+(?:,\d+)*(?:\.\d+)?)\s*(crore)/i,
    /(\d+(?:,\d+)*(?:\.\d+)?)\s*(thousand)/i,
    /(?:loan|principal|amount).*?(\d+(?:,\d+)*)/i,
  ]
  
  for (const pattern of amountPatterns) {
    const match = query.match(pattern)
    if (match) {
      let amount = parseFloat(match[1].replace(/,/g, ''))
      const unit = match[2]?.toLowerCase()
      
      if (unit === 'lakh' || unit === 'lac') amount *= 100000
      else if (unit === 'crore') amount *= 10000000
      else if (unit === 'thousand') amount *= 1000
      
      inputs.principal = amount
      break
    }
  }
  
  // Extract interest rate
  const ratePatterns = [
    /(\d+(?:\.\d+)?)\s*(?:percent|%|pratishat)(?:\s+(?:interest|rate|byaj))?/i,
    /(?:interest|rate|byaj).*?(\d+(?:\.\d+)?)/i,
  ]
  
  for (const pattern of ratePatterns) {
    const match = query.match(pattern)
    if (match) {
      inputs.interestRate = parseFloat(match[1])
      break
    }
  }
  
  // Extract tenure
  const tenurePatterns = [
    /(\d+)\s*(years?|sal)/i,
    /(\d+)\s*(months?|mahina)/i,
    /(?:tenure|period|duration).*?(\d+)/i,
  ]
  
  for (const pattern of tenurePatterns) {
    const match = query.match(pattern)
    if (match) {
      let tenure = parseInt(match[1])
      const unit = match[2]?.toLowerCase()
      
      if (unit?.includes('month') || unit?.includes('mahina')) {
        tenure = tenure / 12 // Convert to years
      }
      
      inputs.tenure = Math.round(tenure)
      break
    }
  }
  
  return inputs
}

function extractSIPInputs(query: string): Record<string, any> {
  const inputs: Record<string, any> = {}
  
  // Monthly investment
  const amountPatterns = [
    /(\d+(?:,\d+)*)\s*(?:rupees?|rs\.?)?\s*(?:per month|monthly|sip)/i,
    /(?:invest|investing).*?(\d+(?:,\d+)*)/i,
  ]
  
  for (const pattern of amountPatterns) {
    const match = query.match(pattern)
    if (match) {
      inputs.monthlyInvestment = parseFloat(match[1].replace(/,/g, ''))
      break
    }
  }
  
  // Expected return
  const returnPatterns = [
    /(\d+(?:\.\d+)?)\s*(?:percent|%).*?(?:return|growth)/i,
    /(?:return|growth).*?(\d+(?:\.\d+)?)\s*(?:percent|%)/i,
  ]
  
  for (const pattern of returnPatterns) {
    const match = query.match(pattern)
    if (match) {
      inputs.expectedReturn = parseFloat(match[1])
      break
    }
  }
  
  // Duration
  const durationPatterns = [
    /(\d+)\s*years?/i,
    /(?:for|duration|period).*?(\d+)/i,
  ]
  
  for (const pattern of durationPatterns) {
    const match = query.match(pattern)
    if (match) {
      inputs.duration = parseInt(match[1])
      break
    }
  }
  
  return inputs
}

function extractBMIInputs(query: string): Record<string, any> {
  const inputs: Record<string, any> = {}
  
  // Weight
  const weightPatterns = [
    /(\d+(?:\.\d+)?)\s*(?:kg|kilo|kilogram)/i,
    /(?:weight|vajan).*?(\d+(?:\.\d+)?)/i,
  ]
  
  for (const pattern of weightPatterns) {
    const match = query.match(pattern)
    if (match) {
      inputs.weight = parseFloat(match[1])
      break
    }
  }
  
  // Height
  const heightPatterns = [
    /(\d+(?:\.\d+)?)\s*(?:cm|centimeter)/i,
    /(\d+)\s*feet?\s*(\d+)?\s*inch/i,
    /(?:height|lambai).*?(\d+(?:\.\d+)?)/i,
  ]
  
  for (const pattern of heightPatterns) {
    const match = query.match(pattern)
    if (match) {
      if (pattern.source.includes('feet')) {
        // Convert feet/inches to cm
        const feet = parseInt(match[1])
        const inches = match[2] ? parseInt(match[2]) : 0
        inputs.height = Math.round((feet * 30.48) + (inches * 2.54))
      } else {
        inputs.height = parseFloat(match[1])
      }
      break
    }
  }
  
  return inputs
}

function extractTaxInputs(query: string): Record<string, any> {
  const inputs: Record<string, any> = {}
  
  // Annual income/salary
  const incomePatterns = [
    /(\d+(?:,\d+)*)\s*(?:lakh|lac)/i,
    /(?:salary|income).*?(\d+(?:,\d+)*)/i,
  ]
  
  for (const pattern of incomePatterns) {
    const match = query.match(pattern)
    if (match) {
      let income = parseFloat(match[1].replace(/,/g, ''))
      if (query.match(/lakh|lac/i)) income *= 100000
      inputs.annualIncome = income
      break
    }
  }
  
  // Tax regime
  if (query.match(/new\s+(?:regime|tax)/i)) {
    inputs.regime = 'new'
  } else if (query.match(/old\s+(?:regime|tax)/i)) {
    inputs.regime = 'old'
  }
  
  return inputs
}

function extractFDInputs(query: string): Record<string, any> {
  const inputs: Record<string, any> = {}
  
  // Deposit amount
  const amountPatterns = [
    /(\d+(?:,\d+)*)\s*(?:lakh|lac)/i,
    /(?:deposit|invest).*?(\d+(?:,\d+)*)/i,
  ]
  
  for (const pattern of amountPatterns) {
    const match = query.match(pattern)
    if (match) {
      let amount = parseFloat(match[1].replace(/,/g, ''))
      if (query.match(/lakh|lac/i)) amount *= 100000
      inputs.principal = amount
      break
    }
  }
  
  // Interest rate
  const rateMatch = query.match(/(\d+(?:\.\d+)?)\s*(?:percent|%)/i)
  if (rateMatch) {
    inputs.interestRate = parseFloat(rateMatch[1])
  }
  
  // Duration
  const durationMatch = query.match(/(\d+)\s*(?:years?|months?)/i)
  if (durationMatch) {
    inputs.duration = parseInt(durationMatch[1])
  }
  
  return inputs
}

// Helper function to get calculator URL from parsed query
export function getCalculatorUrl(parsed: ParsedQuery): string {
  const baseUrl = '/calculator/'
  const params = new URLSearchParams()
  
  Object.entries(parsed.inputs).forEach(([key, value]) => {
    params.append(key, value.toString())
  })
  
  return `${baseUrl}${parsed.calculatorType}${params.toString() ? '?' + params.toString() : ''}`
}

// Example usage:
// parseNaturalLanguageQuery("I want to take a loan of 30 lakh at 8.5% interest for 20 years")
// parseNaturalLanguageQuery("Calculate SIP for 5000 monthly for 10 years")
// parseNaturalLanguageQuery("My weight is 75kg and height is 175cm")
