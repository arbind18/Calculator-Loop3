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

// Advanced history functions
export function saveToHistory(data: {
  category: string;
  tool: string;
  inputs: any;
  result: any;
  timestamp: string;
}) {
  try {
    const key = `history_${data.category}_${data.tool}`;
    const stored = localStorage.getItem(key);
    const history = stored ? JSON.parse(stored) : [];
    
    const newEntry = {
      id: Date.now().toString(),
      ...data
    };
    
    history.unshift(newEntry);
    
    // Keep only last 20 entries per tool
    if (history.length > 20) {
      history.pop();
    }
    
    localStorage.setItem(key, JSON.stringify(history));
    
    // Also save last result for comparison
    const lastResultKey = `last_result_${data.category}_${data.tool}`;
    localStorage.setItem(lastResultKey, JSON.stringify(data.result));
  } catch (error) {
    console.error('Error saving to history:', error);
  }
}

export function getHistory(category: string, tool: string, limit: number = 10) {
  try {
    const key = `history_${category}_${tool}`;
    const stored = localStorage.getItem(key);
    if (!stored) return [];
    
    const history = JSON.parse(stored);
    return history.slice(0, limit);
  } catch (error) {
    console.error('Error loading history:', error);
    return [];
  }
}

export function clearHistory(category: string, tool: string) {
  try {
    const key = `history_${category}_${tool}`;
    localStorage.removeItem(key);
    const lastResultKey = `last_result_${category}_${tool}`;
    localStorage.removeItem(lastResultKey);
  } catch (error) {
    console.error('Error clearing history:', error);
  }
}
