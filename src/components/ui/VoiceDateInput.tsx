"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Mic, MicOff } from "lucide-react"
import toast from "react-hot-toast"
import { format, isValid } from "date-fns"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

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

function toDateInputValue(date: Date): string {
  return format(date, "yyyy-MM-dd")
}

function parseVoiceDate(rawText: string): string | null {
  const cleaned = rawText
    .toLowerCase()
    .replace(/(st|nd|rd|th)\b/g, "")
    .replace(/[.,]/g, " ")
    .replace(/\s+/g, " ")
    .trim()

  // yyyy-mm-dd or yyyy/mm/dd
  const isoLike = cleaned.match(/\b(\d{4})[/-](\d{1,2})[/-](\d{1,2})\b/)
  if (isoLike) {
    const year = Number(isoLike[1])
    const month = Number(isoLike[2])
    const day = Number(isoLike[3])
    const d = new Date(year, month - 1, day)
    if (isValid(d) && d.getFullYear() === year && d.getMonth() === month - 1 && d.getDate() === day) {
      return toDateInputValue(d)
    }
  }

  // dd-mm-yyyy or dd/mm/yyyy (India common)
  const dmy = cleaned.match(/\b(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})\b/)
  if (dmy) {
    const day = Number(dmy[1])
    const month = Number(dmy[2])
    let year = Number(dmy[3])
    if (year < 100) year = year >= 70 ? 1900 + year : 2000 + year

    const d = new Date(year, month - 1, day)
    if (isValid(d) && d.getFullYear() === year && d.getMonth() === month - 1 && d.getDate() === day) {
      return toDateInputValue(d)
    }
  }

  // "27 12 2025" or "27 12" (assume current year)
  const spaced = cleaned.match(/\b(\d{1,2})\s+(\d{1,2})(?:\s+(\d{4}))?\b/)
  if (spaced) {
    const day = Number(spaced[1])
    const month = Number(spaced[2])
    const year = spaced[3] ? Number(spaced[3]) : new Date().getFullYear()

    const d = new Date(year, month - 1, day)
    if (isValid(d) && d.getFullYear() === year && d.getMonth() === month - 1 && d.getDate() === day) {
      return toDateInputValue(d)
    }
  }

  // Month-name formats (best-effort)
  // Examples: "27 december 2025", "december 27 2025", "27 dec", "dec 27"
  const monthMap: Record<string, number> = {
    january: 1,
    jan: 1,
    february: 2,
    feb: 2,
    march: 3,
    mar: 3,
    april: 4,
    apr: 4,
    may: 5,
    june: 6,
    jun: 6,
    july: 7,
    jul: 7,
    august: 8,
    aug: 8,
    september: 9,
    sep: 9,
    sept: 9,
    october: 10,
    oct: 10,
    november: 11,
    nov: 11,
    december: 12,
    dec: 12,
  }

  // "27 december 2025" / "27 dec 2025"
  const dMonthY = cleaned.match(/\b(\d{1,2})\s+([a-z]{3,9})\s+(\d{4})\b/)
  if (dMonthY) {
    const day = Number(dMonthY[1])
    const month = monthMap[dMonthY[2]]
    const year = Number(dMonthY[3])
    if (month) {
      const d = new Date(year, month - 1, day)
      if (isValid(d) && d.getFullYear() === year && d.getMonth() === month - 1 && d.getDate() === day) {
        return toDateInputValue(d)
      }
    }
  }

  // "december 27 2025" / "dec 27 2025"
  const monthDY = cleaned.match(/\b([a-z]{3,9})\s+(\d{1,2})\s+(\d{4})\b/)
  if (monthDY) {
    const month = monthMap[monthDY[1]]
    const day = Number(monthDY[2])
    const year = Number(monthDY[3])
    if (month) {
      const d = new Date(year, month - 1, day)
      if (isValid(d) && d.getFullYear() === year && d.getMonth() === month - 1 && d.getDate() === day) {
        return toDateInputValue(d)
      }
    }
  }

  // "27 december" / "december 27" (assume current year)
  const dMonth = cleaned.match(/\b(\d{1,2})\s+([a-z]{3,9})\b/)
  if (dMonth) {
    const day = Number(dMonth[1])
    const month = monthMap[dMonth[2]]
    const year = new Date().getFullYear()
    if (month) {
      const d = new Date(year, month - 1, day)
      if (isValid(d) && d.getFullYear() === year && d.getMonth() === month - 1 && d.getDate() === day) {
        return toDateInputValue(d)
      }
    }
  }

  const monthD = cleaned.match(/\b([a-z]{3,9})\s+(\d{1,2})\b/)
  if (monthD) {
    const month = monthMap[monthD[1]]
    const day = Number(monthD[2])
    const year = new Date().getFullYear()
    if (month) {
      const d = new Date(year, month - 1, day)
      if (isValid(d) && d.getFullYear() === year && d.getMonth() === month - 1 && d.getDate() === day) {
        return toDateInputValue(d)
      }
    }
  }

  return null
}

export function VoiceDateInput({
  label,
  value,
  onChangeAction,
  inputClassName,
  lang = "en-IN",
}: {
  label: string
  value: string
  onChangeAction: (value: string) => void
  inputClassName?: string
  lang?: string
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

  const requestMicrophonePermission = async (): Promise<boolean> => {
    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      toast.error("Microphone permission request is not available (try Chrome/Edge)")
      return false
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      stream.getTracks().forEach((t) => t.stop())
      return true
    } catch (err: any) {
      const name: string | undefined = err?.name
      if (name === "NotAllowedError" || name === "SecurityError") {
        toast.error("Microphone permission denied. Allow mic access and try again.")
      } else if (name === "NotFoundError") {
        toast.error("No microphone device found")
      } else {
        toast.error("Could not get microphone permission")
      }
      return false
    }
  }

  const startListening = async () => {
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
      // Stop any previous session
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
      const parsed = transcript ? parseVoiceDate(transcript) : null

      if (!transcript) {
        toast.error("Could not hear a date")
        return
      }

      if (!parsed) {
        toast.error(`Could not understand date: "${transcript}"`)
        return
      }

      onChangeAction(parsed)
      toast.success("Date filled from voice")
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

  const stopListening = () => {
    try {
      recognitionRef.current?.stop()
    } catch {
      // ignore
    }
    setIsListening(false)
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      <div className="flex items-center gap-2">
        <Input
          type="date"
          value={value}
          onChange={(e) => onChangeAction(e.target.value)}
          className={cn("flex-1", inputClassName)}
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={isListening ? stopListening : startListening}
          aria-label={isListening ? `Stop voice input for ${label}` : `Start voice input for ${label}`}
          title={isListening ? "Stop voice" : "Speak date"}
        >
          {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
        </Button>
      </div>
      {!SpeechRecognitionCtor ? (
        <p className="text-xs text-muted-foreground">Voice input works in supported browsers (Chrome/Edge).</p>
      ) : null}
    </div>
  )
}
