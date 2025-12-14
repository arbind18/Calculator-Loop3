import Link from "next/link"
import { Calculator } from "lucide-react"

export function Logo({ mobile = false }: { mobile?: boolean }) {
  if (mobile) {
    return (
      <Link href="/" className="flex items-center gap-2">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-[#00D4FF] to-[#8B5CF6] rounded-lg blur-sm opacity-75"></div>
          <div className="relative bg-gradient-to-br from-[#00D4FF] to-[#8B5CF6] p-1.5 rounded-lg">
            <Calculator className="h-4 w-4 text-white" strokeWidth={2.5} />
          </div>
        </div>
        <span className="font-manrope text-lg font-extrabold bg-gradient-to-r from-[#00D4FF] to-[#8B5CF6] bg-clip-text text-transparent">
          Calculator Loop
        </span>
      </Link>
    )
  }

  return (
    <Link href="/" className="flex items-center gap-3 group">
      {/* Logo Icon with Glow Effect */}
      <div className="relative">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#00D4FF] to-[#8B5CF6] rounded-xl blur-md opacity-60 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Main icon container */}
        <div className="relative bg-gradient-to-br from-[#00D4FF] via-[#5B9FFF] to-[#8B5CF6] p-2.5 rounded-xl shadow-lg group-hover:scale-105 transition-transform duration-300">
          <Calculator className="h-6 w-6 text-white" strokeWidth={2.5} />
        </div>
        
        {/* Corner accent */}
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full animate-pulse"></div>
      </div>

      {/* Text */}
      <div className="flex flex-col">
        <span className="font-manrope text-2xl font-extrabold bg-gradient-to-r from-[#00D4FF] via-[#5B9FFF] to-[#8B5CF6] bg-clip-text text-transparent group-hover:from-[#8B5CF6] group-hover:to-[#00D4FF] transition-all duration-500">
          Calculator Loop
        </span>
        <span className="text-[10px] font-medium text-muted-foreground group-hover:text-[#00D4FF] transition-colors duration-300">
          300+ Free Online Tools
        </span>
      </div>
    </Link>
  )
}
