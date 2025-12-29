"use client"

import React from "react"
import { FinancialCalculatorTemplate } from "../FinancialCalculatorTemplate"

export type ScientificCalculatorTemplateProps = React.ComponentProps<typeof FinancialCalculatorTemplate>

export function ScientificCalculatorTemplate(props: ScientificCalculatorTemplateProps) {
  return <FinancialCalculatorTemplate {...props} category={props.category ?? "Scientific"} />
}
