export interface KnowledgeItem {
  id: string;
  patterns: string[]; // Keywords or phrases to match
  answer: {
    en: string;
    hi: string; // Hindi or Hinglish
  };
  suggestedTools?: string[]; // IDs of tools to recommend
}

export const customKnowledge: KnowledgeItem[] = [
  {
    id: 'greeting',
    patterns: ['hello', 'hi', 'hey', 'namaste', 'kaise ho', 'how are you'],
    answer: {
      en: "Hello! I’m your AI assistant for Calculator Loop. Ask me about any category—finance, health, math, education, construction, technology, and more.",
      hi: "Namaste! Main Calculator Loop ka AI assistant hoon. Aap kisi bhi category (finance, health, math, education, construction, technology, etc.) ke calculator ya formula ke baare mein pooch sakte hain."
    }
  },
  {
    id: 'who_are_you',
    patterns: ['who are you', 'tum kaun ho', 'kya karte ho', 'what do you do'],
    answer: {
      en: "I’m the AI assistant for Calculator Loop. I help you find the right calculator, explain formulas, and calculate results when you share the values.",
      hi: "Main Calculator Loop ka AI assistant hoon. Main aapko sahi calculator dhoondhne, formulas samjhane, aur values dene par calculation karke result batane mein madad karta hoon."
    }
  },
  {
    id: 'sip_definition',
    patterns: ['what is sip', 'sip kya hai', 'sip meaning'],
    answer: {
      en: "SIP (Systematic Investment Plan) allows you to invest small amounts regularly in mutual funds. It helps in rupee cost averaging and compounding.",
      hi: "SIP (Systematic Investment Plan) aapko mutual funds mein niyamit roop se choti rakam nivesh karne ki suvidha deta hai. Ye lambe samay mein wealth create karne mein madad karta hai."
    },
    suggestedTools: ['sip-calculator', 'advanced-sip-calculator']
  },
  {
    id: 'loan_process',
    patterns: ['how to get loan', 'loan kaise le', 'loan process'],
    answer: {
      en: "To get a loan, you typically need a good credit score, income proof, and KYC documents. Check your eligibility first.",
      hi: "Loan lene ke liye aapka credit score accha hona chahiye aur income proof documents zaroori hain. Pehle apni eligibility check karein."
    },
    suggestedTools: ['personal-loan-eligibility', 'home-loan-eligibility']
  },
  {
    id: 'math_tutor_class_12',
    patterns: ['12th math', '12th maths', 'class 12 math', 'class 12 maths', 'board math', 'ganit 12', 'math formula bata', 'maths formula bata'],
    answer: {
      en: "Yes — I can help with Class 9–12 level math: formulas, step-by-step solutions, derivatives, integrals (numeric), equations, AP/GP, binomial theorem, permutations/combination, coordinate geometry, vectors, matrices basics, and more.\n\nBest way to ask:\n1) Write the exact question OR\n2) Write: \"solve: ...\" / \"simplify: ...\" / \"derivative of ...\" / \"integrate ... from a to b\" OR\n3) Ask: \"<topic> formula\" (example: \"quadratic formula\", \"AP sum formula\", \"nCr formula\").\n\nIf you share your steps, I can also verify them.",
      hi: "Haan — main Class 9–12 level maths me help kar sakta hoon: formulas, step-by-step solution, equations solve, derivative, integral (numeric), AP/GP, binomial theorem, permutation/combination, coordinate geometry, vectors, matrices basics, etc.\n\nBest tareeqa:\n1) Exact question likho OR\n2) Aise likho: \"solve: ...\" / \"simplify: ...\" / \"derivative of ...\" / \"integrate ... from a to b\" OR\n3) Aise poochho: \"<topic> formula\" (jaise: \"quadratic formula\", \"AP sum formula\", \"nCr formula\").\n\nAap apne steps bhej doge to main verify bhi kar dunga."
    }
  }
];
