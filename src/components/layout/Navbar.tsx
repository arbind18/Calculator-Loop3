"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import dynamic from "next/dynamic"
import { useTheme } from "next-themes"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Logo } from "./Logo"
import { 
  Calculator, 
  Moon, 
  Sun, 
  Menu, 
  Search,
  TrendingUp,
  Heart,
  History,
  User,
  Info,
  Phone,
  PenSquare,
  Grid3x3,
  DollarSign,
  Binary,
  Calendar,
  Wrench,
  Briefcase,
  Home,
  GraduationCap,
  FlaskConical,
  Laptop,
  LogOut
} from "lucide-react"

const MobileMenu = dynamic(() => import('./MobileMenu').then(mod => mod.MobileMenu), {
  ssr: false
})

export function Navbar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [expandedSubcategory, setExpandedSubcategory] = useState<string | null>(null)
  const { theme, setTheme } = useTheme()

  const isCalculatorPage = pathname?.startsWith('/calculator/')

  const navLinks = [
    { href: "/", label: "Home", icon: Calculator },
    { href: "/popular", label: "Popular", icon: TrendingUp },
    { href: "/favorites", label: "Favorites", icon: Heart },
    { href: "/history", label: "History", icon: History },
    { href: "/about", label: "About", icon: Info },
    { href: "/contact", label: "Contact", icon: Phone },
    { href: "/blog", label: "Blog", icon: PenSquare },
  ]

  const categories = [
    { 
      name: "All Calculators", 
      count: "300+", 
      href: "#categories",
      icon: Grid3x3,
      color: "bg-gradient-to-r from-purple-500 to-indigo-600",
      key: "all"
    },
    { 
      name: "Financial", 
      count: 45, 
      href: "#financial",
      icon: DollarSign,
      color: "bg-gradient-to-r from-pink-500 to-rose-500",
      key: "financial"
    },
    { 
      name: "Health & Fitness", 
      count: 38, 
      href: "#health",
      icon: Heart,
      color: "bg-gradient-to-r from-blue-500 to-cyan-500",
      key: "health"
    },
    { 
      name: "Math & Numbers", 
      count: 52, 
      href: "#math",
      icon: Binary,
      color: "bg-gradient-to-r from-teal-400 to-pink-300",
      key: "math"
    },
    { 
      name: "Date & Time", 
      count: 28, 
      href: "#datetime",
      icon: Calendar,
      color: "bg-gradient-to-r from-amber-400 to-orange-400",
      key: "datetime"
    },
    { 
      name: "Construction", 
      count: 25, 
      href: "#construction",
      icon: Wrench,
      color: "bg-gradient-to-r from-orange-500 to-red-500",
      key: "construction"
    },
    { 
      name: "Business & Marketing", 
      count: 42, 
      href: "#business",
      icon: Briefcase,
      color: "bg-gradient-to-r from-yellow-400 to-amber-500",
      key: "business"
    },
    { 
      name: "Everyday Life", 
      count: 31, 
      href: "#everyday",
      icon: Home,
      color: "bg-gradient-to-r from-lime-400 to-cyan-400",
      key: "everyday"
    },
    { 
      name: "Education", 
      count: 39, 
      href: "#education",
      icon: GraduationCap,
      color: "bg-gradient-to-r from-sky-400 to-blue-400",
      key: "education"
    },
    { 
      name: "Technology", 
      count: 35, 
      href: "#technology",
      icon: Laptop,
      color: "bg-gradient-to-r from-amber-300 to-orange-300",
      key: "technology"
    },
    { 
      name: "Science", 
      count: 48, 
      href: "#science",
      icon: FlaskConical,
      color: "bg-gradient-to-r from-indigo-400 to-purple-400",
      key: "scientific"
    },
  ]

  const handleCategoryClick = (key: string) => {
    if (key === 'all') {
      setIsMenuOpen(false)
      // Navigate to all categories section if needed
      return
    }
    setActiveCategory(key)
    setExpandedSubcategory(null) // Reset expanded state
  }

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b border-[rgba(255,255,255,0.2)] bg-[rgba(255,255,255,0.1)] backdrop-blur-[20px] transition-all duration-300">
        <div className="w-full px-4 md:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Logo */}
            <div className="hidden md:block">
              <Logo />
            </div>

            {/* Mobile Header Nav */}
            <div className="flex md:hidden items-center gap-4">
              {isCalculatorPage ? (
                <Logo />
              ) : (
                <>
                  <Link href="/" className="flex flex-col items-center gap-0.5 text-foreground hover:text-[#00D4FF] transition-colors">
                    <Home className="h-4 w-4" />
                    <span className="text-[9px] font-medium">Home</span>
                  </Link>
                  <button onClick={() => setIsMenuOpen(true)} className="flex flex-col items-center gap-0.5 text-muted-foreground hover:text-[#00D4FF] transition-colors">
                    <Grid3x3 className="h-4 w-4" />
                    <span className="text-[9px] font-medium">Categories</span>
                  </button>
                  <button className="flex flex-col items-center gap-0.5 text-muted-foreground hover:text-[#00D4FF] transition-colors">
                    <Search className="h-4 w-4" />
                    <span className="text-[9px] font-medium">Search</span>
                  </button>
                  <Link href={session?.user ? "/profile" : "/login"} className="flex flex-col items-center gap-0.5 text-muted-foreground hover:text-[#00D4FF] transition-colors">
                    <User className="h-4 w-4" />
                    <span className="text-[9px] font-medium">{session?.user ? "Profile" : "Login"}</span>
                  </Link>
                </>
              )}
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className="text-sm font-medium text-muted-foreground hover:text-[#00D4FF] transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="hidden sm:flex hover:text-[#00D4FF]">
                <Search className="h-5 w-5" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="hover:text-[#00D4FF]"
              >
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>

              {session?.user ? (
                <div className="hidden md:flex items-center gap-4">
                  <Link href="/profile" className="text-sm font-medium text-muted-foreground hover:text-[#00D4FF] transition-colors">
                    {session.user.name}
                  </Link>
                  <Button 
                    onClick={() => signOut()}
                    variant="ghost" 
                    size="icon"
                    className="hover:text-red-500"
                  >
                    <LogOut className="h-5 w-5" />
                  </Button>
                </div>
              ) : (
                <Link href="/login">
                  <Button className="hidden md:inline-flex bg-gradient-to-r from-[#00D4FF] to-[#8B5CF6] text-white border-none hover:opacity-90">
                    Login
                  </Button>
                </Link>
              )}

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setIsMenuOpen(true)}
              >
                <Menu className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Side Drawer */}
      {isMenuOpen && (
        <MobileMenu
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          expandedSubcategory={expandedSubcategory}
          setExpandedSubcategory={setExpandedSubcategory}
          categories={categories}
        />
      )}
    </>
  )
}
