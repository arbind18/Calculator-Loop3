export type DateTimeFieldType =
  | 'date'
  | 'time'
  | 'datetime'
  | 'number'
  | 'text'
  | 'select'
  | 'duration'
  | 'timezone'
  | 'latitude'
  | 'longitude'

export type DateTimeInputValue = string | number | boolean | null | undefined

export interface DateTimeInputField {
  name: string
  label: string
  type: DateTimeFieldType
  placeholder?: string
  unit?: string
  options?: Array<{ value: string; label: string }>
  showSeconds?: boolean
  min?: number
  max?: number
  step?: number
}

export interface DateTimeResultItem {
  label: string
  value: string | number
  unit?: string
}

export interface DateTimeToolResult {
  results: DateTimeResultItem[]
  breakdown?: DateTimeResultItem[]
  faqs?: Array<{ question: string; answer: string }>
  live?: {
    isLive: boolean
    refreshEveryMs?: number
  }
}

export interface DateTimeToolContext {
  now: Date
  toolId: string
}

export interface DateTimeToolDefinition {
  id: string
  title: string
  description: string
  inputs: DateTimeInputField[]
  defaultAutoCalculate?: boolean
  calculate: (values: Record<string, DateTimeInputValue>, ctx: DateTimeToolContext) => DateTimeToolResult
}
