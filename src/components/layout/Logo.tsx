import Image from "next/image"
import Link from "next/link"

const PREFERRED_LOGO_SRC = "/logo.svg"
const FALLBACK_LOGO_SRC = "/logo.svg"

export function Logo({ mobile = false }: { mobile?: boolean }) {
  if (mobile) {
    return (
      <Link href="/" className="flex min-w-0 items-center gap-2">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-[#00D4FF] to-[#8B5CF6] rounded-lg blur-sm opacity-75"></div>
          <div className="relative bg-gradient-to-br from-[#00D4FF] to-[#8B5CF6] p-1.5 rounded-lg">
            <Image
              src={PREFERRED_LOGO_SRC}
              alt="Calculator Loop"
              width={16}
              height={16}
              onError={(e) => {
                const img = e.currentTarget as unknown as HTMLImageElement
                img.src = FALLBACK_LOGO_SRC
              }}
            />
          </div>
        </div>
        <span className="min-w-0 truncate font-manrope text-base font-extrabold bg-gradient-to-r from-[#00D4FF] to-[#8B5CF6] bg-clip-text text-transparent sm:text-lg">
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
        <div className="w-8 h-8 rounded-lg overflow-hidden">
          <Image
            src={PREFERRED_LOGO_SRC}
            alt="Calculator Loop"
            width={32}
            height={32}
            priority
            onError={(e) => {
              const img = e.currentTarget as unknown as HTMLImageElement
              img.src = FALLBACK_LOGO_SRC
            }}
          />
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
          Free Online Tools
        </span>
      </div>
    </Link>
  )
}
