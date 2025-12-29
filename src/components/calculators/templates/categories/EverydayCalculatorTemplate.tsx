"use client"

import React from "react"
import { FinancialCalculatorTemplate } from "../FinancialCalculatorTemplate"

export type EverydayCalculatorTemplateProps = React.ComponentProps<typeof FinancialCalculatorTemplate>

export function EverydayCalculatorTemplate(props: EverydayCalculatorTemplateProps) {
  return <FinancialCalculatorTemplate {...props} category={props.category ?? "Everyday"} />
}
