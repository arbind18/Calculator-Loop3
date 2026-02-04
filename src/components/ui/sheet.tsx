"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

type SheetProps = React.ComponentPropsWithoutRef<typeof Dialog>

type SheetContentProps = React.ComponentPropsWithoutRef<typeof DialogContent> & {
  side?: "top" | "bottom" | "left" | "right"
}

const Sheet = Dialog
const SheetTrigger = DialogTrigger

const SheetContent = React.forwardRef<
  React.ElementRef<typeof DialogContent>,
  SheetContentProps
>(({ className, side = "right", ...props }, ref) => (
  <DialogContent
    ref={ref}
    className={cn(
      "fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out",
      side === "right" &&
        "inset-y-0 right-0 h-full w-3/4 border-l data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right sm:max-w-sm",
      side === "left" &&
        "inset-y-0 left-0 h-full w-3/4 border-r data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:slide-in-from-left data-[state=closed]:slide-out-to-left sm:max-w-sm",
      side === "top" &&
        "inset-x-0 top-0 w-full border-b data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:slide-in-from-top data-[state=closed]:slide-out-to-top",
      side === "bottom" &&
        "inset-x-0 bottom-0 w-full border-t data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:slide-in-from-bottom data-[state=closed]:slide-out-to-bottom",
      className
    )}
    {...props}
  />
))
SheetContent.displayName = "SheetContent"

const SheetHeader = DialogHeader
const SheetTitle = DialogTitle

export { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle }
