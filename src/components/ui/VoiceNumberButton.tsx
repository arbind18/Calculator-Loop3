"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Mic, MicOff } from "lucide-react"
import toast from "react-hot-toast"

import { Button } from "@/components/ui/button"

type SpeechRecognitionType = {
  lang: string
  continuous: boolean
  interimResults: boolean
  maxAlternatives: number
  onresult: ((event: any) => void) | null
  onerror: ((event: any) => void) | null
  onend: (() => void) | null
  start: () => void
  stop: () => void
}

function getSpeechRecognitionCtor(): (new () => SpeechRecognitionType) | null {
  if (typeof window === "undefined") return null
  const anyWindow = window as any
  return (anyWindow.SpeechRecognition || anyWindow.webkitSpeechRecognition || null) as any
}

function parseVoiceNumber(rawText: string): number | null {
  const cleaned = rawText
    .toLowerCase()
    .replace(/[,₹$]/g, " ")
    .replace(/\b(rupees?|rs|inr|dollars?)\b/g, " ")
    .replace(/\s+/g, " ")
    .trim()

  // Convert common spoken decimal: "8 point 5" -> "8.5"
  const pointMatch = cleaned.match(/\b(\d+)\s+point\s+(\d+)\b/)
  const normalized = pointMatch ? cleaned.replace(pointMatch[0], `${pointMatch[1]}.${pointMatch[2]}`) : cleaned

  // Units (English + common Hindi tokens that may appear in transcript)
  // lakh/lac/लाख, crore/करोड़
  const unitMatch = normalized.match(/\b(\d+(?:\.\d+)?)\s*(lakh|lac|crore|thousand|million|billion|लाख|करोड़)\b/)
  if (unitMatch) {
    const base = Number(unitMatch[1])
    if (!Number.isFinite(base)) return null

    const unit = unitMatch[2]
    const mult =
      unit === "lakh" || unit === "lac" || unit === "लाख" ? 100000 :
      unit === "crore" || unit === "करोड़" ? 10000000 :
      unit === "thousand" ? 1000 :
      unit === "million" ? 1000000 :
      unit === "billion" ? 1000000000 :
      1

    return base * mult
  }

  const numMatch = normalized.match(/\b\d+(?:\.\d+)?\b/)
  if (!numMatch) return null

  const n = Number(numMatch[0])
  return Number.isFinite(n) ? n : null
}

export function VoiceNumberButton({
  label,
  onValueAction,
  min,
  max,
  disabled,
  lang = "en-IN",
  className,
}: {
  label: string
  onValueAction: (value: number) => void
  min?: number
  max?: number
  disabled?: boolean
  lang?: string
  className?: string
}) {
  const SpeechRecognitionCtor = useMemo(() => getSpeechRecognitionCtor(), [])
  const recognitionRef = useRef<SpeechRecognitionType | null>(null)
  const [isListening, setIsListening] = useState(false)

  useEffect(() => {
    return () => {
      try {
        recognitionRef.current?.stop()
      } catch {
        // ignore
      }
    }
  }, [])

  const stopListening = () => {
    try {
      recognitionRef.current?.stop()
    } catch {
      // ignore
    }
    setIsListening(false)
  }

  const requestMicrophonePermission = async (): Promise<boolean> => {
    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      toast.error("Microphone permission request is not available (try Chrome/Edge)")
      return false
    }

    const getPermissionState = async (): Promise<PermissionState | null> => {
      try {
        const anyNavigator = navigator as any
        if (!anyNavigator?.permissions?.query) return null
        const res = await anyNavigator.permissions.query({ name: "microphone" } as any)
        return (res?.state ?? null) as PermissionState | null
      } catch {
        return null
      }
    }

    const state = await getPermissionState()
    if (state === "denied") {
      toast.error("Mic is Blocked, so popup may not show. Set Microphone to Ask/Allow in site settings and retry.")
      return false
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      stream.getTracks().forEach((t) => t.stop())
      return true
    } catch (err: any) {
      const name: string | undefined = err?.name
      if (name === "NotAllowedError" || name === "SecurityError") {
        toast.error("Mic permission denied. Also check Android Settings → Apps → Chrome → Permissions → Microphone.")
      } else if (name === "NotFoundError") {
        toast.error("No microphone device found")
      } else {
        toast.error("Could not get microphone permission")
      }
      return false
    }
  }

  const startListening = async () => {
    if (disabled) return

    if (typeof window !== "undefined" && !window.isSecureContext) {
      toast.error("Voice input needs HTTPS (or localhost). Try https:// or run on localhost.")
      return
    }

    if (!SpeechRecognitionCtor) {
      toast.error("Voice input is not supported in this browser (try Chrome/Edge)")
      return
    }

    const allowed = await requestMicrophonePermission()
    if (!allowed) return

    try {
      recognitionRef.current?.stop()
    } catch {
      // ignore
    }

    const recognition = new SpeechRecognitionCtor()
    recognition.lang = lang
    recognition.continuous = false
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    recognition.onresult = (event: any) => {
      const transcript: string | undefined = event?.results?.[0]?.[0]?.transcript
      const parsed = transcript ? parseVoiceNumber(transcript) : null

      if (parsed == null) {
        toast.error(transcript ? `Could not understand number: "${transcript}"` : "Could not hear a value")
        return
      }

      let next = parsed
      if (typeof min === "number") next = Math.max(min, next)
      if (typeof max === "number") next = Math.min(max, next)

      onValueAction(next)
      toast.success("Value filled from voice")
    }

    recognition.onerror = () => {
      toast.error("Voice input failed")
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognitionRef.current = recognition
    setIsListening(true)

    try {
      recognition.start()
    } catch {
      setIsListening(false)
      toast.error("Could not start voice input")
    }
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={isListening ? stopListening : startListening}
      disabled={disabled}
      aria-label={isListening ? `Stop voice input for ${label}` : `Start voice input for ${label}`}
      title={!SpeechRecognitionCtor ? "Voice not supported (Chrome/Edge)" : isListening ? "Stop voice" : "Speak value"}
      className={className}
    >
      {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
    </Button>
  )
}
