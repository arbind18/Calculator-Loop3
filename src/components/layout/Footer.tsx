"use client"

import Link from "next/link"
import { Calculator, Github, Twitter, Mail, Heart } from "lucide-react"
import { useSettings } from "@/components/providers/SettingsProvider"
import { getMergedTranslations } from "@/lib/translations"
import NewsletterSignup from "@/components/email/NewsletterSignup"

export function Footer() {
  const { language } = useSettings()
  const t = getMergedTranslations(language)
  const currentYear = new Date().getFullYear()

  const prefix = language === 'en' ? '' : `/${language}`
  const withLocale = (path: string) => `${prefix}${path}`

  const footerLinks = {
    calculators: [
      { label: t.nav.financial, href: withLocale("/category/financial") },
      { label: t.nav.health, href: withLocale("/category/health") },
      { label: t.nav.math, href: withLocale("/category/math") },
      { label: t.nav.datetime, href: withLocale("/category/datetime") },
    ],
    resources: [
      { label: t.hero.popularTools, href: withLocale("/popular") },
      { label: t.nav.blog, href: withLocale("/blog") },
      { label: t.nav.history, href: withLocale("/history") },
      { label: t.nav.favorites, href: withLocale("/favorites") },
    ],
    company: [
      { label: t.footer.aboutUs, href: withLocale("/about") },
      { label: t.footer.contact, href: withLocale("/contact") },
      { label: t.footer.privacyPolicy, href: withLocale("/privacy") },
      { label: t.footer.termsOfService, href: withLocale("/terms") },
    ],
  }

  return (
    <footer className="w-full border-t border-border/40 bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="space-y-4 lg:col-span-2">
            <Link href={withLocale("/")} className="flex items-center gap-2 font-bold text-xl text-primary">
              <Calculator className="h-6 w-6" />
              <span>Calculator Hub</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              {t.footer.tagline}
            </p>
            <div className="flex gap-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="h-9 w-9 rounded-lg bg-secondary hover:bg-secondary/80 flex items-center justify-center transition-colors"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="h-9 w-9 rounded-lg bg-secondary hover:bg-secondary/80 flex items-center justify-center transition-colors"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href="mailto:contact@calculatorhub.com"
                className="h-9 w-9 rounded-lg bg-secondary hover:bg-secondary/80 flex items-center justify-center transition-colors"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
            
            {/* Newsletter Signup */}
            <div className="pt-2">
              <NewsletterSignup variant="footer" />
            </div>
          </div>

          {/* Calculators */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">{t.footer.calculators}</h3>
            <ul className="space-y-2">
              {footerLinks.calculators.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">{t.footer.resources}</h3>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">{t.footer.company}</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border/40 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground text-center sm:text-left">
            © {currentYear} Calculator Hub. {t.footer.rights}
          </p>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            Made with <Heart className="h-4 w-4 text-red-500 fill-red-500" /> by Your Team
          </p>
        </div>
      </div>
    </footer>
  )
}
