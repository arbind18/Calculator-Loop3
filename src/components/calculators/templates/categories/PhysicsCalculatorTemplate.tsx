"use client"

import React from "react"
import { FinancialCalculatorTemplate } from "../FinancialCalculatorTemplate"

export type PhysicsCalculatorTemplateProps = React.ComponentProps<typeof FinancialCalculatorTemplate>

export function PhysicsCalculatorTemplate(props: PhysicsCalculatorTemplateProps) {
  return <FinancialCalculatorTemplate {...props} category={props.category ?? "Physics"} />
}
