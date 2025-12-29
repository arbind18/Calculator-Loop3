"use client"

import React from "react"
import { FinancialCalculatorTemplate } from "../FinancialCalculatorTemplate"

export type MathCalculatorTemplateProps = React.ComponentProps<typeof FinancialCalculatorTemplate>

export function MathCalculatorTemplate(props: MathCalculatorTemplateProps) {
  return <FinancialCalculatorTemplate {...props} category={props.category ?? "Math"} />
}
