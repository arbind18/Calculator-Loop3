"use client"

import React from "react"
import { ComprehensiveHealthTemplate } from "../ComprehensiveHealthTemplate"

export type HealthCalculatorTemplateProps = React.ComponentProps<typeof ComprehensiveHealthTemplate>

export function HealthCalculatorTemplate(props: HealthCalculatorTemplateProps) {
  return <ComprehensiveHealthTemplate {...props} categoryName={props.categoryName ?? "Health"} />
}
