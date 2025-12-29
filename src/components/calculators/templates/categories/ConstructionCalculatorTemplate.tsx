"use client"

import React from "react"
import { FinancialCalculatorTemplate } from "../FinancialCalculatorTemplate"

export type ConstructionCalculatorTemplateProps = React.ComponentProps<typeof FinancialCalculatorTemplate>

export function ConstructionCalculatorTemplate(props: ConstructionCalculatorTemplateProps) {
  return <FinancialCalculatorTemplate {...props} category={props.category ?? "Construction"} />
}
