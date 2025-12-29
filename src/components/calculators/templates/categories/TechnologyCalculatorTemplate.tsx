"use client"

import React from "react"
import { FinancialCalculatorTemplate } from "../FinancialCalculatorTemplate"

export type TechnologyCalculatorTemplateProps = React.ComponentProps<typeof FinancialCalculatorTemplate>

export function TechnologyCalculatorTemplate(props: TechnologyCalculatorTemplateProps) {
  return <FinancialCalculatorTemplate {...props} category={props.category ?? "Technology"} />
}
