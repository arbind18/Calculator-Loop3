"use client"

import { Globe, Check, Sun, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu"
import { useSettings } from "@/components/providers/SettingsProvider"
import { useTheme } from "next-themes"

export function SettingsSelector() {
  const { 
    currency, 
    setCurrency, 
    availableCurrencies, 
    language, 
    setLanguage, 
    availableLanguages 
  } = useSettings()

  const { setTheme, resolvedTheme } = useTheme()

  const currentTheme = resolvedTheme === 'dark' ? 'dark' : 'light'
  const currentLanguage = availableLanguages.find((l) => l.code === language)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative h-10 w-10 rounded-lg transition-all duration-200 hover:bg-primary/10 hover:text-primary"
        >
          <Globe className="h-5 w-5" />
          <span className="sr-only">Settings</span>
          <div className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center text-[9px] font-semibold bg-primary text-primary-foreground rounded-full shadow-sm">
            {currency.symbol}
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Settings</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => setTheme(currentTheme === 'dark' ? 'light' : 'dark')}>
          {currentTheme === 'dark' ? (
            <Sun className="mr-2 h-4 w-4" />
          ) : (
            <Moon className="mr-2 h-4 w-4" />
          )}
          <span>Theme: {currentTheme === 'dark' ? 'Dark' : 'Light'}</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuLabel>Regional</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <span className="mr-2">Currency</span>
            <span className="ml-auto text-xs text-muted-foreground">{currency.code} ({currency.symbol})</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            {availableCurrencies.map((curr) => (
              <DropdownMenuItem 
                key={curr.code} 
                onClick={() => setCurrency(curr.code)}
                className="justify-between"
              >
                <span>{curr.name} ({curr.symbol})</span>
                {currency.code === curr.code && <Check className="h-4 w-4" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <span className="mr-2">Language</span>
            <span className="ml-auto text-xs text-muted-foreground">{currentLanguage?.nativeName || language.toUpperCase()}</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            {availableLanguages.map((lang) => (
              <DropdownMenuItem 
                key={lang.code} 
                onClick={() => setLanguage(lang.code)}
                className="justify-between"
              >
                <span>{lang.nativeName}</span>
                {language === lang.code && <Check className="h-4 w-4" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
