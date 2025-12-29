"use client"

import * as React from "react"
import { Mic } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import toast from "react-hot-toast"

interface VoiceInputProps {
  onInput: (text: string) => void
  className?: string
  lang?: string
}

export function VoiceInput({ onInput, className, lang = "en-US" }: VoiceInputProps) {
  const [isListening, setIsListening] = React.useState(false)
  const recognitionRef = React.useRef<any>(null)

  const startListening = async () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      toast.error("Voice input is not supported in this browser.")
      return
    }

    // If already listening, stop it
    if (isListening) {
      recognitionRef.current?.stop()
      return
    }

    try {
      // Explicitly request microphone permission first using getUserMedia
      // This ensures the "Ask for permission" part happens before we try to start recognition
      // although start() would do it too, getUserMedia gives us a clear promise to handle
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      
      // If we get here, permission is granted
      // Stop the stream immediately as we only needed it for permission
      stream.getTracks().forEach(track => track.stop())

      // Now start speech recognition
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
      const recognition = new SpeechRecognition()
      recognitionRef.current = recognition
      
      recognition.continuous = false
      recognition.interimResults = true
      recognition.lang = lang

      recognition.onstart = () => {
        setIsListening(true)
      }

      recognition.onend = () => {
        setIsListening(false)
      }

      recognition.onresult = (event: any) => {
        let finalTranscript = ''
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript
          }
        }
        if (finalTranscript) {
          onInput(finalTranscript)
        }
      }

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error", event.error)
        setIsListening(false)
        if (event.error === 'not-allowed') {
            toast.error("Microphone permission denied. Please allow access to use voice input.")
        }
      }

      recognition.start()

    } catch (err) {
      console.error("Permission denied or error", err)
      toast.error("Please grant microphone permission to use voice input.")
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn("relative", className)}
      onClick={startListening}
      title="Voice Input"
      type="button"
    >
      {isListening ? (
        <div className="relative flex items-center justify-center">
            <Mic className="h-4 w-4 text-red-500 animate-pulse" />
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
        </div>
      ) : (
        <Mic className="h-4 w-4" />
      )}
    </Button>
  )
}
