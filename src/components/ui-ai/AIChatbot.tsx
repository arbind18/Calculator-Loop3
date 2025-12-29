"use client"

import { useState, useRef, useEffect } from 'react'
import { MessageCircle, Send, X, Bot, User, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface AIChatbotProps {
  calculatorType?: string
  context?: Record<string, any>
}

export function AIChatbot({ calculatorType, context = {} }: AIChatbotProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Welcome message
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `Hi! 👋 I'm your AI calculator assistant. I can help you with:\n\n• Understanding calculator results\n• Explaining financial terms\n• Suggesting optimal values\n• Answering calculation questions\n\nHow can I help you today?`,
        timestamp: new Date()
      }
      setMessages([welcomeMessage])
    }
  }, [isOpen])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const generateResponse = async (userMessage: string): Promise<string> => {
    // Simulate AI response with context awareness
    const lowerMessage = userMessage.toLowerCase()
    
    // EMI related queries
    if (lowerMessage.includes('emi') || lowerMessage.includes('loan')) {
      if (lowerMessage.includes('reduce') || lowerMessage.includes('lower')) {
        return `To reduce your EMI, you can:\n\n1. **Increase loan tenure** - This spreads payments over more months, reducing monthly burden\n2. **Make prepayments** - Reduces principal amount, lowering future EMIs\n3. **Negotiate interest rate** - Even 0.5% reduction can save thousands\n4. **Increase down payment** - Reduces loan amount needed\n\n${context.emi ? `Your current EMI is ₹${context.emi.toLocaleString('en-IN')}. Would you like me to calculate with different values?` : ''}`
      }
      
      if (lowerMessage.includes('tenure') || lowerMessage.includes('duration')) {
        return `Loan tenure affects your finances in two ways:\n\n**Shorter Tenure (10-15 years):**\n✅ Less total interest paid\n✅ Become debt-free faster\n❌ Higher monthly EMI\n\n**Longer Tenure (20-30 years):**\n✅ Lower monthly EMI\n✅ Better cash flow management\n❌ More total interest paid\n\nRecommendation: Balance between affordable EMI and total interest. Most people choose 15-20 years for home loans.`
      }
    }
    
    // SIP related queries
    if (lowerMessage.includes('sip') || lowerMessage.includes('investment') || lowerMessage.includes('mutual fund')) {
      if (lowerMessage.includes('how much') || lowerMessage.includes('amount')) {
        return `Ideal SIP amount depends on:\n\n1. **Income** - Invest 20-30% of monthly income\n2. **Financial Goals** - Retirement, house, education\n3. **Current Age** - Younger = can invest more aggressively\n4. **Risk Appetite** - Higher risk = higher potential returns\n\n**Quick Rule:** Start with ₹5,000-10,000/month if you're a beginner. Increase by 10% annually.\n\nNeed help calculating for a specific goal?`
      }
      
      if (lowerMessage.includes('return') || lowerMessage.includes('growth')) {
        return `SIP returns vary by fund type:\n\n📊 **Equity Funds**: 12-15% annually (long-term)\n📊 **Debt Funds**: 7-9% annually\n📊 **Hybrid Funds**: 9-12% annually\n\n**Important:** Past performance doesn't guarantee future returns. Market fluctuations are normal.\n\n**Pro Tip:** Longer investment period (10+ years) averages out market volatility and maximizes returns through compounding.`
      }
    }
    
    // Tax related queries
    if (lowerMessage.includes('tax') || lowerMessage.includes('deduction')) {
      if (lowerMessage.includes('save') || lowerMessage.includes('reduce')) {
        return `Top tax-saving strategies:\n\n💰 **Section 80C** (up to ₹1.5L):\n• PPF, EPF\n• ELSS mutual funds\n• Life insurance\n• Home loan principal\n\n💰 **Section 80D** (up to ₹50K):\n• Health insurance premiums\n\n💰 **HRA exemption**:\n• If you're paying rent\n\n💰 **New Tax Regime**:\n• Lower rates but no deductions\n• Better if deductions < ₹2.5L\n\nWant me to calculate your tax savings?`
      }
    }
    
    // BMI related queries
    if (lowerMessage.includes('bmi') || lowerMessage.includes('weight') || lowerMessage.includes('health')) {
      if (lowerMessage.includes('lose') || lowerMessage.includes('reduce')) {
        return `Healthy weight loss tips:\n\n🏃 **Exercise**: 30 min daily cardio\n🥗 **Diet**: 500 calorie deficit/day\n💧 **Hydration**: 8-10 glasses water\n😴 **Sleep**: 7-8 hours\n\n**Safe rate**: 0.5-1 kg per week\n\n**Important**: Consult a doctor before starting any weight loss program, especially if you have health conditions.`
      }
    }
    
    // General calculation help
    if (lowerMessage.includes('how') || lowerMessage.includes('what') || lowerMessage.includes('why')) {
      return `I'd be happy to help! Could you be more specific about:\n\n• Which calculator you're using?\n• What values you want to understand?\n• What you're trying to achieve?\n\nFor example: "Why is my EMI so high?" or "How does SIP work?" or "What deductions can I claim?"`
    }
    
    // Default helpful response
    return `I understand you're asking about ${calculatorType ? calculatorType.replace('-', ' ') : 'calculations'}. \n\nCould you please rephrase your question? I can help with:\n\n• Explaining how calculations work\n• Understanding your results\n• Financial term definitions\n• Tax planning strategies\n• Investment advice\n• Loan optimization\n\nTry asking something like: "How can I reduce my EMI?" or "What's a good SIP amount?"`
  }

  const handleSend = async () => {
    if (!input.trim()) return
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsTyping(true)
    
    // Simulate AI thinking delay
    setTimeout(async () => {
      const response = await generateResponse(input)
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, assistantMessage])
      setIsTyping(false)
    }, 1000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      {/* Chat Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all hover:scale-110 group"
        >
          <MessageCircle className="h-6 w-6" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
            AI
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96 h-[600px] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Bot className="h-6 w-6" />
                <span className="absolute -top-1 -right-1 bg-green-400 rounded-full h-3 w-3 border-2 border-white" />
              </div>
              <div>
                <h3 className="font-semibold">AI Assistant</h3>
                <p className="text-xs opacity-90">Always here to help</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/20 rounded-full p-1 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`flex-shrink-0 ${message.role === 'user' ? 'bg-purple-100 dark:bg-purple-900' : 'bg-gray-100 dark:bg-gray-800'} rounded-full p-2`}>
                  {message.role === 'user' ? (
                    <User className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  ) : (
                    <Bot className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  )}
                </div>
                <div className={`flex-1 ${message.role === 'user' ? 'text-right' : ''}`}>
                  <div
                    className={`inline-block max-w-[85%] p-3 rounded-2xl ${
                      message.role === 'user'
                        ? 'bg-purple-600 text-white rounded-tr-none'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-tl-none'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 px-1">
                    {message.timestamp.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex gap-3">
                <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-2">
                  <Bot className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                </div>
                <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-2xl rounded-tl-none">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything..."
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim()}
                className="rounded-full bg-purple-600 hover:bg-purple-700"
                size="sm"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
              Press Enter to send
            </p>
          </div>
        </div>
      )}
    </>
  )
}
