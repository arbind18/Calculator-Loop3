import {
  addDays,
  addMonths,
  addYears,
  differenceInCalendarDays,
  differenceInMinutes,
  differenceInSeconds,
  format,
  getISOWeek,
  getDayOfYear,
  isValid,
  parse,
} from 'date-fns'

export function clampNumber(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

export function safeNumber(value: unknown, fallback = 0) {
  const n = typeof value === 'number' ? value : Number(String(value ?? ''))
  return Number.isFinite(n) ? n : fallback
}

export function formatIsoDate(date: Date) {
  return format(date, 'yyyy-MM-dd')
}

export function formatReadableDateTime(date: Date) {
  return format(date, 'PPpp')
}

export function parseUserDate(value: string): Date | null {
  const raw = (value ?? '').trim()
  if (!raw) return null

  // Accept YYYY-MM-DD
  const isoMatch = raw.match(/^([0-9]{4})-([0-9]{1,2})-([0-9]{1,2})$/)
  if (isoMatch) {
    const yyyy = Number(isoMatch[1])
    const mm = Number(isoMatch[2])
    const dd = Number(isoMatch[3])
    const d = new Date(yyyy, mm - 1, dd)
    if (d.getFullYear() !== yyyy || d.getMonth() !== mm - 1 || d.getDate() !== dd) return null
    return d
  }

  // Accept DD-MM-YYYY / DD/MM/YYYY / DD.MM.YYYY
  const dmyMatch = raw.match(/^([0-9]{1,2})[-/.]([0-9]{1,2})[-/.]([0-9]{4})$/)
  if (dmyMatch) {
    const dd = Number(dmyMatch[1])
    const mm = Number(dmyMatch[2])
    const yyyy = Number(dmyMatch[3])
    const d = new Date(yyyy, mm - 1, dd)
    if (d.getFullYear() !== yyyy || d.getMonth() !== mm - 1 || d.getDate() !== dd) return null
    return d
  }

  // Try date-fns parse fallback for common inputs
  const parsed = parse(raw, 'P', new Date())
  if (isValid(parsed)) return parsed

  return null
}

export function parseTimeToHms(value: string): { h: number; m: number; s: number } | null {
  const raw = (value ?? '').trim()
  if (!raw) return { h: 0, m: 0, s: 0 }

  const tm = raw.match(/^([0-9]{1,2}):([0-9]{2})(?::([0-9]{2}))?$/)
  if (!tm) return null

  const h = Number(tm[1])
  const m = Number(tm[2])
  const s = Number(tm[3] ?? '0')

  if (!Number.isFinite(h) || !Number.isFinite(m) || !Number.isFinite(s)) return null
  if (h < 0 || h > 23 || m < 0 || m > 59 || s < 0 || s > 59) return null
  return { h, m, s }
}

export function parseDateTimeInput(dateValue: string, timeValue: string): Date | null {
  const d = parseUserDate(String(dateValue ?? ''))
  if (!d) return null
  const hms = parseTimeToHms(String(timeValue ?? ''))
  if (!hms) return null
  d.setHours(hms.h, hms.m, hms.s, 0)
  return d
}

export function diffYmdDateOnly(start: Date, end: Date) {
  let years = end.getFullYear() - start.getFullYear()
  let months = end.getMonth() - start.getMonth()
  let days = end.getDate() - start.getDate()

  if (days < 0) {
    months--
    const prevMonth = new Date(end.getFullYear(), end.getMonth(), 0)
    days += prevMonth.getDate()
  }

  if (months < 0) {
    years--
    months += 12
  }

  return { years, months, days }
}

export function addToDate(base: Date, { years, months, days }: { years?: number; months?: number; days?: number }) {
  let d = new Date(base)
  if (years) d = addYears(d, years)
  if (months) d = addMonths(d, months)
  if (days) d = addDays(d, days)
  return d
}

export function calendarDayDiff(start: Date, end: Date) {
  return differenceInCalendarDays(end, start)
}

export function secondsDiff(start: Date, end: Date) {
  return differenceInSeconds(end, start)
}

export function minutesDiff(start: Date, end: Date) {
  return differenceInMinutes(end, start)
}

export function toHmsFromSeconds(totalSeconds: number) {
  const s = Math.max(0, Math.floor(totalSeconds))
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  return { h, m, s: sec }
}

export function formatHms(h: number, m: number, s: number) {
  const pad2 = (n: number) => String(Math.floor(n)).padStart(2, '0')
  return `${pad2(h)}:${pad2(m)}:${pad2(s)}`
}

export function getIsoWeekNumber(date: Date) {
  return getISOWeek(date)
}

export function getDayOfYearNumber(date: Date) {
  return getDayOfYear(date)
}

export function isLeapYear(year: number) {
  if (!Number.isFinite(year)) return false
  if (year % 4 !== 0) return false
  if (year % 100 !== 0) return true
  return year % 400 === 0
}

export function getQuarter(date: Date) {
  return Math.floor(date.getMonth() / 3) + 1
}

export function getFiscalYearIndia(date: Date) {
  // FY runs Apr 1 -> Mar 31
  const y = date.getFullYear()
  const m = date.getMonth() // 0-based
  if (m >= 3) return { startYear: y, endYear: y + 1 }
  return { startYear: y - 1, endYear: y }
}

export function formatDurationPartsFromMinutes(totalMinutes: number) {
  const minutes = Math.max(0, Math.floor(totalMinutes))
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return { hours, minutes: mins }
}

export function formatDurationPartsFromSeconds(totalSeconds: number) {
  const seconds = Math.max(0, Math.floor(totalSeconds))
  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  return { days, hours, minutes, seconds: secs }
}

export function listIanaTimeZones(): Array<{ value: string; label: string }> {
  // Lightweight curated list to avoid shipping huge time zone DB.
  // Add more later if needed.
  const zones = [
    'UTC',
    'Asia/Kolkata',
    'Asia/Dubai',
    'Asia/Singapore',
    'Asia/Tokyo',
    'Europe/London',
    'Europe/Paris',
    'Europe/Berlin',
    'America/New_York',
    'America/Chicago',
    'America/Denver',
    'America/Los_Angeles',
    'Australia/Sydney',
  ]

  return zones.map((z) => ({ value: z, label: z }))
}

export function formatInTimeZone(date: Date, timeZone: string, locale = 'en-US') {
  // Use Intl for formatting in a target IANA zone.
  // NOTE: This formats correctly, but converting an *input* time in a non-local zone to an instant
  // needs a time-zone library; for now we treat the input as a local instant.
  try {
    return new Intl.DateTimeFormat(locale, {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).format(date)
  } catch {
    return date.toISOString()
  }
}

export function formatCalendarWithIntl(date: Date, calendar: string, locale = 'en') {
  // calendar examples: 'islamic', 'hebrew', 'chinese'
  try {
    const fmt = new Intl.DateTimeFormat(`${locale}-u-ca-${calendar}`, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    })
    return fmt.format(date)
  } catch {
    return format(date, 'PPPP')
  }
}

function parseGmtOffsetToMinutes(value: string): number | null {
  // Examples: "GMT", "UTC", "GMT+5", "GMT+05", "GMT+05:30", "UTC-04:00"
  const v = (value ?? '').trim().toUpperCase()
  if (!v) return null
  if (v === 'GMT' || v === 'UTC') return 0
  const m = v.match(/^(?:GMT|UTC)([+-])(\d{1,2})(?::?(\d{2}))?$/)
  if (!m) return null
  const sign = m[1] === '-' ? -1 : 1
  const hh = Number(m[2])
  const mm = Number(m[3] ?? '0')
  if (!Number.isFinite(hh) || !Number.isFinite(mm)) return null
  if (hh < 0 || hh > 23 || mm < 0 || mm > 59) return null
  return sign * (hh * 60 + mm)
}

export function getTimeZoneOffsetMinutes(instant: Date, timeZone: string): number | null {
  // Uses Intl "shortOffset" (supported on modern browsers / Node).
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone,
      timeZoneName: 'shortOffset',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).formatToParts(instant)
    const tz = parts.find((p) => p.type === 'timeZoneName')?.value ?? ''
    return parseGmtOffsetToMinutes(tz)
  } catch {
    return null
  }
}

export function getTimeZoneAbbreviation(instant: Date, timeZone: string): string {
  // Best-effort abbreviation like IST, EDT, GMT+5:30, etc.
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone,
      timeZoneName: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).formatToParts(instant)
    return parts.find((p) => p.type === 'timeZoneName')?.value ?? ''
  } catch {
    return ''
  }
}

export function zonedWallClockToUtcInstant(args: {
  year: number
  month: number
  day: number
  hour: number
  minute: number
  second: number
  timeZone: string
}): Date {
  // Convert a wall-clock date/time in a target IANA zone into a UTC instant.
  // We do a small fixed-point iteration to handle DST transitions.
  const { year, month, day, hour, minute, second, timeZone } = args
  const localMs = Date.UTC(year, month - 1, day, hour, minute, second, 0)

  // Initial guess: treat the wall-clock as UTC.
  let guess = new Date(localMs)

  for (let i = 0; i < 3; i++) {
    const offsetMin = getTimeZoneOffsetMinutes(guess, timeZone)
    if (offsetMin == null) break
    const correctedMs = localMs - offsetMin * 60_000
    const corrected = new Date(correctedMs)
    if (Math.abs(corrected.getTime() - guess.getTime()) < 1000) {
      guess = corrected
      break
    }
    guess = corrected
  }

  return guess
}

export function assertDefined<T>(value: T | null | undefined, message: string): T {
  if (value === null || value === undefined) throw new Error(message)
  return value
}
