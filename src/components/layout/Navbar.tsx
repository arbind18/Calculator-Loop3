"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Logo } from "./Logo"
import { 
  Calculator, 
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
import { NotificationBell } from "./NotificationBell"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MobileMenu } from "./MobileMenu"

import { SettingsSelector } from "./SettingsSelector"
import { useSettings } from "@/components/providers/SettingsProvider"
import { getMergedTranslations } from "@/lib/translations"
import { SearchModal } from "./SearchModal"

export function Navbar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const { language } = useSettings()

  const t = getMergedTranslations(language)

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [expandedSubcategory, setExpandedSubcategory] = useState<string | null>(null)

  // Handle keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setIsSearchOpen(true)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const isCalculatorPage = pathname?.startsWith('/calculator/')


  const navLinks = [
    { href: "/", label: t.nav.home, icon: Calculator },
    { href: "/popular", label: t.nav.popular, icon: TrendingUp },
    { href: "/favorites", label: t.nav.favorites, icon: Heart },
    { href: "/history", label: t.nav.history, icon: History },
    { href: "/about", label: t.nav.about, icon: Info },
    { href: "/contact", label: t.nav.contact, icon: Phone },
    { href: "/blog", label: t.nav.blog, icon: PenSquare },
  ]

  const categories = [
    { 
      name: t.nav.allCalculators, 
      count: "All", 
      href: "#categories",
      icon: Grid3x3,
      color: "bg-gradient-to-r from-purple-500 to-indigo-600",
      key: "all"
    },
    { 
      name: t.nav.financial, 
      count: 45, 
      href: "/category/financial",
      icon: DollarSign,
      color: "bg-gradient-to-r from-pink-500 to-rose-500",
      key: "financial"
    },
    { 
      name: t.nav.health, 
      count: 38, 
      href: "/category/health",
      icon: Heart,
      color: "bg-gradient-to-r from-blue-500 to-cyan-500",
      key: "health"
    },
    { 
      name: t.nav.math, 
      count: 52, 
      href: "/category/math",
      icon: Binary,
      color: "bg-gradient-to-r from-teal-400 to-pink-300",
      key: "math"
    },
    { 
      name: t.nav.datetime, 
      count: 28, 
      href: "/category/datetime",
      icon: Calendar,
      color: "bg-gradient-to-r from-amber-400 to-orange-400",
      key: "datetime"
    },
    { 
      name: t.nav.education, 
      count: 39, 
      href: "/category/education",
      icon: GraduationCap,
      color: "bg-gradient-to-r from-sky-400 to-blue-400",
      key: "education"
    },
    { 
      name: t.nav.technology, 
      count: 35, 
      href: "/category/technology",
      icon: Laptop,
      color: "bg-gradient-to-r from-amber-300 to-orange-300",
      key: "technology"
    },
    { 
      name: t.nav.science, 
      count: 48, 
      href: "/category/scientific",
      icon: FlaskConical,
      color: "bg-gradient-to-r from-indigo-400 to-purple-400",
      key: "scientific"
    },    { 
      name: t.nav.construction, 
      count: 12, 
      href: "/category/construction",
      icon: Wrench,
      color: "bg-gradient-to-r from-orange-500 to-red-500",
      key: "construction"
    },
    { 
      name: t.nav.business, 
      count: 15, 
      href: "/category/business",
      icon: Briefcase,
      color: "bg-gradient-to-r from-yellow-400 to-amber-500",
      key: "business"
    },
    { 
      name: t.nav.everyday, 
      count: 10, 
      href: "/category/everyday",
      icon: Home,
      color: "bg-gradient-to-r from-lime-400 to-cyan-400",
      key: "everyday"
    },  ]

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
            <div className="flex md:hidden items-center gap-2">
              <Logo />
              
              {/* Only show Search button if NOT on Home page (to avoid duplication with Hero search) */}
              {!isCalculatorPage && pathname !== '/' && (
                <div className="flex items-center gap-3 ml-1">
                  <button 
                    onClick={() => setIsSearchOpen(true)}
                    className="flex flex-col items-center gap-0.5 text-muted-foreground hover:text-[#00D4FF] transition-colors group"
                  >
                    <Search className="h-4 w-4 group-hover:scale-110 transition-transform" />
                    <span className="text-[9px] font-medium">Search</span>
                  </button>
                </div>
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
            <div className="flex items-center gap-1">
              <NotificationBell />

              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsSearchOpen(true)}
                className="hidden sm:flex h-10 w-10 rounded-lg transition-all duration-200 hover:bg-primary/10 hover:text-primary"
              >
                <Search className="h-5 w-5" />
              </Button>

              <SettingsSelector />

              {session?.user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full transition-all duration-200 hover:bg-primary/10">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={session.user.image || ""} alt={session.user.name || ""} />
                        <AvatarFallback>{session.user.name?.charAt(0) || "U"}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{session.user.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {session.user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/profile#history">
                        <History className="mr-2 h-4 w-4" />
                        <span>History</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/profile#favorites">
                        <Heart className="mr-2 h-4 w-4" />
                        <span>Favorites</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => signOut()} className="text-red-600 focus:text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="hidden md:flex items-center gap-2">
                  <Link href="/login">
                    <Button variant="ghost" className="hover:text-[#00D4FF]">
                      {t.nav.login}
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button className="bg-gradient-to-r from-[#00D4FF] to-[#8B5CF6] text-white border-none hover:opacity-90">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden h-10 w-10 rounded-lg transition-all duration-200 hover:bg-primary/10 hover:text-primary"
                onClick={() => setIsMenuOpen(true)}
              >
                <Menu className="h-5 w-5" />
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
          onSearchClick={() => {
            setIsMenuOpen(false)
            setIsSearchOpen(true)
          }}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          expandedSubcategory={expandedSubcategory}
          setExpandedSubcategory={setExpandedSubcategory}
          categories={categories}
        />
      )}

      <SearchModal 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />
    </>
  )
}
