"use client"

import React from "react"
import { FinancialCalculatorTemplate } from "../FinancialCalculatorTemplate"

export type EducationCalculatorTemplateProps = React.ComponentProps<typeof FinancialCalculatorTemplate>

export function EducationCalculatorTemplate(props: EducationCalculatorTemplateProps) {
  return <FinancialCalculatorTemplate {...props} category={props.category ?? "Education"} />
}
