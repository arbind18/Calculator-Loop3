"use client"

import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface BackButtonProps {
  href?: string
  label?: string
  className?: string
}

export function BackButton({ href, label = "Back", className }: BackButtonProps) {
  const router = useRouter()

  if (href) {
    return (
      <Link href={href} className={cn("inline-block", className)}>
        <Button 
          variant="ghost" 
          className="group gap-2 pl-2 pr-4 rounded-full hover:bg-primary/10 hover:text-primary transition-all duration-300"
        >
          <div className="bg-primary/10 p-1 rounded-full group-hover:bg-primary/20 transition-colors">
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          </div>
          <span className="font-medium">{label}</span>
        </Button>
      </Link>
    )
  }

  return (
    <Button 
      variant="ghost" 
      onClick={() => router.back()}
      className={cn("group gap-2 pl-2 pr-4 rounded-full hover:bg-primary/10 hover:text-primary transition-all duration-300", className)}
    >
      <div className="bg-primary/10 p-1 rounded-full group-hover:bg-primary/20 transition-colors">
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
      </div>
      <span className="font-medium">{label}</span>
    </Button>
  )
}
