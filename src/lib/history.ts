import { Session } from "next-auth"

export interface CalculationData {
  calculatorType: string
  calculatorName: string
  category: string
  inputs: any
  result: any
}

export async function saveCalculation(
  data: CalculationData,
  session: Session | null
) {
  try {
    // Prepare payload with stringified JSON for SQLite compatibility
    // The API expects raw objects, but the API route handles stringifying/parsing?
    // Wait, my API route expects raw JSON in the body, and IT handles the database interaction.
    // The API route I modified earlier:
    // const { calculatorType, calculatorName, category, inputs, result } = await request.json()
    // const calculation = await prisma.calculation.create({ data: { ..., inputs, result } })
    // And I changed the schema to String for inputs/result.
    // So the API route needs to stringify them before saving to Prisma if Prisma expects String.
    
    // Let's check the API route again.
    
    if (session?.user) {
      // Save to API
      const response = await fetch('/api/user/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          // Ensure inputs and result are objects here, the API route will handle storage format
          // Wait, if I changed schema to String, I need to make sure the API route handles it.
          // I'll check the API route in a moment.
        })
      })
      
      if (!response.ok) {
        console.error('Failed to save history to API')
      }
    } else {
      // Save to localStorage
      const history = JSON.parse(localStorage.getItem('calculationHistory') || '[]')
      const newEntry = {
        id: Date.now().toString(),
        ...data,
        timestamp: new Date().toISOString()
      }
      
      // Add to beginning
      history.unshift(newEntry)
      
      // Limit to 50 items
      if (history.length > 50) {
        history.pop()
      }
      
      localStorage.setItem('calculationHistory', JSON.stringify(history))
      
      // Dispatch event so UI can update if needed
      window.dispatchEvent(new Event('history-updated'))
    }
  } catch (error) {
    console.error('Error saving calculation history:', error)
  }
}
