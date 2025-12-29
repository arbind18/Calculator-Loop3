"use client"

import React from "react"
import { FinancialCalculatorTemplate } from "../FinancialCalculatorTemplate"

export type BusinessCalculatorTemplateProps = React.ComponentProps<typeof FinancialCalculatorTemplate>

export function BusinessCalculatorTemplate(props: BusinessCalculatorTemplateProps) {
  return <FinancialCalculatorTemplate {...props} category={props.category ?? "Business"} />
}
