export type Language = 'en' | 'hi';

export const detectLanguage = (text: string): Language => {
  const lowerText = text.toLowerCase();
  
  // Common Hindi/Hinglish words
  const hindiKeywords = [
    'kya', 'kaise', 'hai', 'ho', 'tha', 'thi', 'karna', 'chahiye', 
    'mera', 'meri', 'tum', 'aap', 'kaun', 'kidhar', 'kab', 'kyu',
    'namaste', 'dhanyavad', 'paiso', 'nivesh', 'byaj', 'udhar'
  ];

  // Check if any hindi keyword is present
  const hasHindiWord = hindiKeywords.some(word => lowerText.includes(` ${word} `) || lowerText.startsWith(`${word} `) || lowerText.endsWith(` ${word}`));
  
  // Also check for Devanagari script range
  const hasDevanagari = /[\u0900-\u097F]/.test(text);

  if (hasHindiWord || hasDevanagari) {
    return 'hi';
  }

  return 'en';
};

export const getResponseTemplate = (lang: Language) => {
  if (lang === 'hi') {
    return {
      toolsIntro: "### 🛠️ Ye tools aapki madad kar sakte hain:",
      blogIntro: "### 💡 Hamare guides se jawab:",
      nextStep: "### ✅ Aage kya karein:",
      fallback: "Maaf kijiye, mujhe iske baare mein abhi jaankari nahi hai. Kripya loan, tax ya investment ke baare mein poochein.",
      category: "Category"
    };
  }
  
  return {
    toolsIntro: "### 🛠️ Recommended Tools",
    blogIntro: "### 💡 Answer (from our guides)",
    nextStep: "### ✅ Best Next Step",
    fallback: "I'm sorry, I couldn't find specific information. Please ask about loans, taxes, or investments.",
    category: "Category"
  };
};
