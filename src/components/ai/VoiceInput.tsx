"use client"

import { useState, useEffect } from 'react'
import { Mic, MicOff, Volume2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface VoiceInputProps {
  onTranscript: (text: string) => void
  onNumberDetected?: (numbers: { field: string; value: number }[]) => void
  language?: string
}

export function VoiceInput({ 
  onTranscript, 
  onNumberDetected,
  language = 'en-IN' 
}: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [recognition, setRecognition] = useState<any>(null)

  useEffect(() => {
    // Check browser support
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      
      if (SpeechRecognition) {
        setIsSupported(true)
        
        const recognitionInstance = new SpeechRecognition()
        recognitionInstance.continuous = true
        recognitionInstance.interimResults = true
        recognitionInstance.lang = language
        
        recognitionInstance.onresult = (event: any) => {
          let interimTranscript = ''
          let finalTranscript = ''
          
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript
            if (event.results[i].isFinal) {
              finalTranscript += transcript + ' '
            } else {
              interimTranscript += transcript
            }
          }
          
          const fullTranscript = finalTranscript || interimTranscript
          setTranscript(fullTranscript)
          onTranscript(fullTranscript)
          
          // Extract numbers from transcript
          if (finalTranscript && onNumberDetected) {
            extractNumbers(finalTranscript)
          }
        }
        
        recognitionInstance.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error)
          setIsListening(false)
        }
        
        recognitionInstance.onend = () => {
          setIsListening(false)
        }
        
        setRecognition(recognitionInstance)
      }
    }
  }, [language])

  const extractNumbers = (text: string) => {
    const patterns = [
      // Loan amount patterns
      { regex: /(?:loan|principal|amount|lena|rashi).*?(\d+(?:,\d+)*(?:\.\d+)?)\s*(?:lakh|lac|hundred|thousand|crore|rupees|rupee)?/i, field: 'principal' },
      { regex: /(\d+(?:,\d+)*(?:\.\d+)?)\s*(?:lakh|lac|hundred|thousand|crore)?\s*(?:ka\s+)?(?:loan|principal|amount)/i, field: 'principal' },
      
      // Interest rate patterns
      { regex: /(?:interest|rate|byaj|dar).*?(\d+(?:\.\d+)?)\s*(?:percent|%|pratishat)?/i, field: 'interestRate' },
      { regex: /(\d+(?:\.\d+)?)\s*(?:percent|%|pratishat)?\s*(?:interest|rate|byaj)/i, field: 'interestRate' },
      
      // Tenure patterns
      { regex: /(?:tenure|period|duration|samay|avadhi).*?(\d+)\s*(?:years?|months?|sal|mahina)/i, field: 'tenure' },
      { regex: /(\d+)\s*(?:years?|months?|sal|mahina)\s*(?:ka\s+)?(?:tenure|period|loan)/i, field: 'tenure' },
      
      // SIP patterns
      { regex: /(?:monthly|mahina|har).*?(\d+(?:,\d+)*)\s*(?:rupees?|ka\s+)?(?:sip|investment)/i, field: 'monthlyInvestment' },
      { regex: /sip.*?(\d+(?:,\d+)*)/i, field: 'monthlyInvestment' },
      
      // BMI patterns
      { regex: /(?:weight|vajan).*?(\d+(?:\.\d+)?)\s*(?:kg|kilo|kilogram)?/i, field: 'weight' },
      { regex: /(?:height|lambai|unchai).*?(\d+(?:\.\d+)?)\s*(?:cm|meter|feet|foot)?/i, field: 'height' },
      
      // Salary patterns
      { regex: /(?:salary|income|vetan|amdani).*?(\d+(?:,\d+)*)\s*(?:rupees?|per|month)?/i, field: 'salary' },
    ]
    
    const detected: { field: string; value: number }[] = []
    
    patterns.forEach(pattern => {
      const match = text.match(pattern.regex)
      if (match) {
        let value = parseFloat(match[1].replace(/,/g, ''))
        
        // Convert units
        if (text.includes('lakh') || text.includes('lac')) value *= 100000
        if (text.includes('crore')) value *= 10000000
        if (text.includes('thousand')) value *= 1000
        if (text.includes('hundred')) value *= 100
        
        detected.push({ field: pattern.field, value })
      }
    })
    
    if (detected.length > 0 && onNumberDetected) {
      onNumberDetected(detected)
    }
  }

  const toggleListening = () => {
    if (!recognition) return
    
    if (isListening) {
      recognition.stop()
      setIsListening(false)
    } else {
      ;(async () => {
        if (typeof window !== 'undefined' && !window.isSecureContext) {
          console.error('Voice input needs HTTPS (or localhost).')
          return
        }

        if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
          console.error('Microphone permission request is not available in this browser.')
          return
        }

        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
          stream.getTracks().forEach((t) => t.stop())
        } catch (err) {
          console.error('Could not get microphone permission:', err)
          return
        }

        recognition.start()
        setIsListening(true)
        setTranscript('')

        // Speak prompt
        speakPrompt()
      })()
    }
  }

  const speakPrompt = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(
        language === 'hi-IN' 
          ? 'अपनी जानकारी बोलें' 
          : 'Please speak your calculation details'
      )
      utterance.lang = language
      window.speechSynthesis.speak(utterance)
    }
  }

  if (!isSupported) {
    return null
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant={isListening ? "destructive" : "outline"}
          size="sm"
          onClick={toggleListening}
          className="relative overflow-hidden"
        >
          {isListening ? (
            <>
              <MicOff className="h-4 w-4 mr-2" />
              Stop Listening
              <span className="absolute inset-0 bg-red-500 opacity-20 animate-pulse" />
            </>
          ) : (
            <>
              <Mic className="h-4 w-4 mr-2" />
              Voice Input
            </>
          )}
        </Button>
        
        {isListening && (
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Volume2 className="h-4 w-4 animate-pulse" />
            <span>Listening...</span>
          </div>
        )}
      </div>
      
      {transcript && (
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
            {transcript}
          </p>
        </div>
      )}
      
      {isListening && (
        <div className="text-xs text-gray-500 dark:text-gray-400">
          <p>💡 Try saying: &quot;10 lakh loan at 8.5 percent for 20 years&quot;</p>
          <p className="mt-1">💡 या कहें: &quot;10 लाख का लोन 8.5 प्रतिशत ब्याज पर 20 साल के लिए&quot;</p>
        </div>
      )}
    </div>
  )
}
