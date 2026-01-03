"use client"

import { useEffect, useState, useRef } from "react"
import { Clock, Mic, MicOff } from "lucide-react"
import toast from "react-hot-toast"
import { Button } from "@/components/ui/button"
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

function parseTimeParts(timeStr: string) {
  const t = (timeStr ?? '').trim()
  const tm = /^([0-9]{2}):([0-9]{2})(?::([0-9]{2}))?$/.exec(t)
  if (!tm) return { hh: '00', mm: '00', ss: '00' }
  return {
    hh: tm[1] ?? '00',
    mm: tm[2] ?? '00',
    ss: tm[3] ?? '00',
  }
}

function setTimePart(timeStr: string, part: 'hh' | 'mm' | 'ss', value: string) {
  const { hh, mm, ss } = parseTimeParts(timeStr)
  const next = { hh, mm, ss, [part]: value }
  if (next.ss === '00') return `${next.hh}:${next.mm}`
  return `${next.hh}:${next.mm}:${next.ss}`
}

function setTimePartWithMode(
  timeStr: string,
  part: 'hh' | 'mm' | 'ss',
  value: string,
  forceSeconds: boolean
) {
  const { hh, mm, ss } = parseTimeParts(timeStr)
  const next = { hh, mm, ss, [part]: value }
  if (forceSeconds) return `${next.hh}:${next.mm}:${next.ss}`
  if (next.ss === '00') return `${next.hh}:${next.mm}`
  return `${next.hh}:${next.mm}:${next.ss}`
}

function parseVoiceTime(rawText: string): string | null {
  const cleaned = rawText.toLowerCase().replace(/[.,]/g, " ").replace(/\s+/g, " ").trim()
  
  // Try to find patterns like "10 30 pm", "10:30", "5 o clock"
  
  // 1. HH:MM (24hr or 12hr)
  const colonMatch = cleaned.match(/\b(\d{1,2}):(\d{2})\b/)
  if (colonMatch) {
    let h = Number(colonMatch[1])
    const m = Number(colonMatch[2])
    
    if (cleaned.includes("pm") && h < 12) h += 12
    if (cleaned.includes("am") && h === 12) h = 0
    
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
  }

  // 2. "10 30" (space separated)
  const spaceMatch = cleaned.match(/\b(\d{1,2})\s+(\d{2})\b/)
  if (spaceMatch) {
    let h = Number(spaceMatch[1])
    const m = Number(spaceMatch[2])
    
    if (cleaned.includes("pm") && h < 12) h += 12
    if (cleaned.includes("am") && h === 12) h = 0
    
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
  }

  // 3. "5 o clock" or just "5 pm"
  const hourMatch = cleaned.match(/\b(\d{1,2})\s*(?:o'?\s*clock|am|pm)?\b/)
  if (hourMatch) {
    let h = Number(hourMatch[1])
    const m = 0
    
    if (cleaned.includes("pm") && h < 12) h += 12
    if (cleaned.includes("am") && h === 12) h = 0
    
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
  }

  return null
}

interface VoiceTimeInputProps {
  value: string
  onChange: (val: string) => void
  disabled?: boolean
  showSeconds?: boolean
}

export function VoiceTimeInput({ value, onChange, disabled, showSeconds = false }: VoiceTimeInputProps) {
  const [isListening, setIsListening] = useState(false)
  const recognitionRef = useRef<SpeechRecognitionType | null>(null)

  const startListening = () => {
    const Ctor = getSpeechRecognitionCtor()
    if (!Ctor) {
      toast.error("Voice recognition not supported in this browser.")
      return
    }

    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }

    const recognition = new Ctor()
    recognition.lang = "en-US"
    recognition.continuous = false
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      const parsed = parseVoiceTime(transcript)
      if (parsed) {
        onChange(parsed)
        toast.success(`Set time to ${parsed}`)
      } else {
        toast.error(`Could not understand time: "${transcript}"`)
      }
      setIsListening(false)
    }

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error)
      setIsListening(false)
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    try {
      recognition.start()
      setIsListening(true)
      recognitionRef.current = recognition
    } catch (err) {
      console.error(err)
      setIsListening(false)
    }
  }

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      recognitionRef.current = null
    }
    setIsListening(false)
  }

  const parts = parseTimeParts(value)
  const selectClass = "h-10 px-2 rounded-lg bg-transparent border border-transparent focus:outline-none font-semibold text-base disabled:opacity-60 appearance-none text-center"

  return (
    <div
      className={cn(
        "relative w-full h-14 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800",
        "flex items-center gap-2 px-3",
        "focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-transparent",
        disabled && "opacity-60"
      )}
    >
      <Clock className="h-5 w-5 text-muted-foreground shrink-0" />

      <div className="flex items-center gap-2 flex-1">
        <select
          aria-label="Hour"
          value={parts.hh}
          disabled={disabled}
          onChange={(e) => onChange(setTimePartWithMode(value, 'hh', e.target.value, showSeconds))}
          className={cn(selectClass, "w-14")}
        >
          {Array.from({ length: 24 }, (_, h) => String(h).padStart(2, '0')).map((h) => (
            <option key={h} value={h}>
              {h}
            </option>
          ))}
        </select>

        <span className="text-muted-foreground font-semibold">:</span>

        <select
          aria-label="Minute"
          value={parts.mm}
          disabled={disabled}
          onChange={(e) => onChange(setTimePartWithMode(value, 'mm', e.target.value, showSeconds))}
          className={cn(selectClass, "w-14")}
        >
          {Array.from({ length: 60 }, (_, m) => String(m).padStart(2, '0')).map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>

        {showSeconds && (
          <>
            <span className="text-muted-foreground font-semibold">:</span>
            <select
              aria-label="Second"
              value={parts.ss}
              disabled={disabled}
              onChange={(e) => onChange(setTimePartWithMode(value, 'ss', e.target.value, true))}
              className={cn(selectClass, "w-14")}
            >
              {Array.from({ length: 60 }, (_, s) => String(s).padStart(2, '0')).map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </>
        )}
      </div>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={isListening ? stopListening : startListening}
        disabled={disabled}
        className={cn(
          "h-10 w-10 rounded-lg shrink-0",
          isListening && "bg-red-500/10 text-red-600 animate-pulse"
        )}
        title="Speak time (e.g. '10:30 PM')"
      >
        {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
      </Button>
    </div>
  )
}
