"use client"

import React from "react"
import { FinancialCalculatorTemplate } from "../FinancialCalculatorTemplate"

export type DateTimeCalculatorTemplateProps = React.ComponentProps<typeof FinancialCalculatorTemplate>

export function DateTimeCalculatorTemplate(props: DateTimeCalculatorTemplateProps) {
  return <FinancialCalculatorTemplate {...props} category={props.category ?? "DateTime"} />
}
