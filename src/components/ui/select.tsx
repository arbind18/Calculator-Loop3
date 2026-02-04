"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

type SelectItemData = {
  value: string
  label: React.ReactNode
  disabled?: boolean
}

interface SelectProps {
  value?: string
  onValueChange?: (value: string) => void
  disabled?: boolean
  children?: React.ReactNode
  className?: string
}

type SelectTriggerProps = React.ComponentPropsWithoutRef<"button"> & {
  "aria-label"?: string
}

interface SelectContentProps {
  children?: React.ReactNode
}

interface SelectItemProps {
  value: string
  disabled?: boolean
  children?: React.ReactNode
}

interface SelectValueProps {
  placeholder?: string
}

const SelectTrigger = (_props: SelectTriggerProps) => null
SelectTrigger.displayName = "SelectTrigger"

const SelectContent = (_props: SelectContentProps) => null
SelectContent.displayName = "SelectContent"

const SelectItem = (_props: SelectItemProps) => null
SelectItem.displayName = "SelectItem"

const SelectValue = (_props: SelectValueProps) => null
SelectValue.displayName = "SelectValue"

const isComponentType = (child: React.ReactNode, name: string) => {
  return React.isValidElement(child) &&
    typeof child.type !== "string" &&
    (child.type as { displayName?: string }).displayName === name
}

const extractSelectValuePlaceholder = (node: React.ReactNode): string | undefined => {
  let placeholder: string | undefined

  React.Children.forEach(node, (child) => {
    if (placeholder) return

    if (isComponentType(child, "SelectValue")) {
      const props = (child as React.ReactElement<SelectValueProps>).props
      placeholder = props.placeholder
      return
    }

    if (React.isValidElement(child) && child.props?.children) {
      placeholder = extractSelectValuePlaceholder(child.props.children)
    }
  })

  return placeholder
}

const extractSelectItems = (node: React.ReactNode): SelectItemData[] => {
  const items: SelectItemData[] = []

  React.Children.forEach(node, (child) => {
    if (!React.isValidElement(child)) return

    if (isComponentType(child, "SelectItem")) {
      const props = (child as React.ReactElement<SelectItemProps>).props
      items.push({ value: props.value, label: props.children, disabled: props.disabled })
      return
    }

    if (child.props?.children) {
      items.push(...extractSelectItems(child.props.children))
    }
  })

  return items
}

const Select = ({ value, onValueChange, disabled, children, className }: SelectProps) => {
  let triggerProps: any = null
  let contentChildren: React.ReactNode | null = null

  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) return

    if (isComponentType(child, "SelectTrigger")) {
      triggerProps = (child as React.ReactElement<SelectTriggerProps>).props
      return
    }

    if (isComponentType(child, "SelectContent")) {
      contentChildren = (child as React.ReactElement<SelectContentProps>).props.children
    }
  })

  const placeholder = triggerProps
    ? extractSelectValuePlaceholder(triggerProps.children)
    : undefined

  const items = contentChildren ? extractSelectItems(contentChildren) : []

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onValueChange?.(event.target.value)
  }

  return (
    <div className="relative w-full">
      <select
        id={triggerProps?.id}
        value={value ?? ""}
        onChange={handleChange}
        disabled={disabled ?? triggerProps?.disabled}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          triggerProps?.className,
          className
        )}
        aria-label={triggerProps?.["aria-label"]}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {items.map((item) => (
          <option key={item.value} value={item.value} disabled={item.disabled}>
            {item.label}
          </option>
        ))}
      </select>
    </div>
  )
}

Select.displayName = "Select"

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem }
