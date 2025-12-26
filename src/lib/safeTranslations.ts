import { translations, LanguageCode } from './translations'

// Safe translation getter that never fails
export function getSafeTranslations(language: string | LanguageCode = 'en') {
  try {
    const langCode = (language || 'en') as LanguageCode
    return translations[langCode] || translations.en
  } catch (error) {
    console.warn('Translation fallback to English', error)
    return translations.en
  }
}

// Default English fallback structure
export const defaultTranslations = {
  nav: {
    home: "Home",
    popular: "Popular",
    categories: "Categories",
    allCalculators: "All Calculators",
    financial: "Financial",
    health: "Health",
    math: "Math",
    datetime: "Date & Time",
    education: "Education",
    technology: "Technology",
    science: "Science",
    construction: "Construction",
    business: "Business",
    everyday: "Everyday",
    favorites: "Favorites",
    history: "History",
    about: "About",
    contact: "Contact",
    blog: "Blog",
    login: "Login"
  },
  hero: {
    title: "Calculator Loop - Free Online Calculators",
    subtitle: "Fast, accurate & mobile-friendly calculators. No signup required.",
    popularTools: "Explore Calculators"
  }
}
