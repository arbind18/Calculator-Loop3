import type { DateTimeToolDefinition, DateTimeToolResult } from './types'
import {
  addToDate,
  assertDefined,
  calendarDayDiff,
  clampNumber,
  diffYmdDateOnly,
  formatCalendarWithIntl,
  formatHms,
  formatInTimeZone,
  formatReadableDateTime,
  formatDurationPartsFromSeconds,
  getDayOfYearNumber,
  getFiscalYearIndia,
  getIsoWeekNumber,
  getQuarter,
  isLeapYear,
  listIanaTimeZones,
  minutesDiff,
  parseDateTimeInput,
  parseTimeToHms,
  parseUserDate,
  safeNumber,
  secondsDiff,
  toHmsFromSeconds,
  getTimeZoneAbbreviation,
  getTimeZoneOffsetMinutes,
  zonedWallClockToUtcInstant,
} from './utils'

// Optional: astronomy tools. This import is ESM-friendly and works in the browser.
// Keep it lazy per-tool to reduce initial bundle cost.
async function loadAstronomy() {
  const mod = await import('astronomy-engine')
  return mod
}

function asDate(value: unknown, label: string) {
  const d = parseUserDate(String(value ?? ''))
  return assertDefined(d, `Please enter a valid ${label} (DD-MM-YYYY or YYYY-MM-DD).`)
}

function asTime(value: unknown, label: string) {
  const t = parseTimeToHms(String(value ?? ''))
  return assertDefined(t, `Please enter a valid ${label} (HH:MM or HH:MM:SS).`)
}

function asDateTime(dateValue: unknown, timeValue: unknown, dateLabel: string, timeLabel: string) {
  const dt = parseDateTimeInput(String(dateValue ?? ''), String(timeValue ?? '00:00'))
  return assertDefined(dt, `Please enter a valid ${dateLabel} and ${timeLabel}.`)
}

function formatNumber(n: number, fractionDigits = 2) {
  if (!Number.isFinite(n)) return '—'
  return n.toLocaleString(undefined, { maximumFractionDigits: fractionDigits })
}

function buildFaqs(title: string): Array<{ question: string; answer: string }> {
  return [
    {
      question: `How does the ${title} work?`,
      answer:
        'It uses standard calendar/time rules and shows both the main result and a breakdown so you can verify the calculation.',
    },
    {
      question: 'Is this calculator free to use?',
      answer: 'Yes, it is free and works on mobile and desktop.',
    },
  ]
}

function simpleTool(def: Omit<DateTimeToolDefinition, 'faqs'>): DateTimeToolDefinition {
  return {
    ...def,
    faqs: buildFaqs(def.title),
  } as any
}

function unitConversionTools(): Record<string, DateTimeToolDefinition> {
  return {
    'hours-to-minutes': simpleTool({
      id: 'hours-to-minutes',
      title: 'Hours to Minutes Converter',
      description: 'Convert hours into minutes, seconds, and days.',
      inputs: [{ name: 'hours', label: 'Hours', type: 'number', min: 0, step: 0.01 }],
      defaultAutoCalculate: true,
      calculate: (v) => {
        const hours = Math.max(0, safeNumber(v.hours, 0))
        const minutes = hours * 60
        const seconds = minutes * 60
        const days = hours / 24
        return {
          results: [
            { label: 'Minutes', value: formatNumber(minutes), unit: 'min' },
            { label: 'Seconds', value: formatNumber(seconds), unit: 'sec' },
            { label: 'Days', value: formatNumber(days, 6), unit: 'days' },
          ],
          breakdown: [{ label: 'Input', value: `${hours} hours` }],
        }
      },
    }),

    'minutes-to-hours': simpleTool({
      id: 'minutes-to-hours',
      title: 'Minutes to Hours Converter',
      description: 'Convert minutes into hours, days, and weeks.',
      inputs: [{ name: 'minutes', label: 'Minutes', type: 'number', min: 0, step: 1 }],
      defaultAutoCalculate: true,
      calculate: (v) => {
        const minutes = Math.max(0, safeNumber(v.minutes, 0))
        const hours = minutes / 60
        const days = hours / 24
        const weeks = days / 7
        return {
          results: [
            { label: 'Hours', value: formatNumber(hours, 6), unit: 'hours' },
            { label: 'Days', value: formatNumber(days, 6), unit: 'days' },
            { label: 'Weeks', value: formatNumber(weeks, 6), unit: 'weeks' },
          ],
          breakdown: [{ label: 'Input', value: `${minutes} minutes` }],
        }
      },
    }),

    'seconds-converter': simpleTool({
      id: 'seconds-converter',
      title: 'Seconds Converter',
      description: 'Convert seconds into minutes, hours, and days.',
      inputs: [{ name: 'seconds', label: 'Seconds', type: 'number', min: 0, step: 1 }],
      defaultAutoCalculate: true,
      calculate: (v) => {
        const seconds = Math.max(0, safeNumber(v.seconds, 0))
        const minutes = seconds / 60
        const hours = minutes / 60
        const days = hours / 24
        const hms = toHmsFromSeconds(seconds)
        return {
          results: [
            { label: 'Minutes', value: formatNumber(minutes, 6), unit: 'min' },
            { label: 'Hours', value: formatNumber(hours, 6), unit: 'hours' },
            { label: 'Days', value: formatNumber(days, 6), unit: 'days' },
            { label: 'HH:MM:SS', value: formatHms(hms.h, hms.m, hms.s) },
          ],
          breakdown: [{ label: 'Input', value: `${seconds} seconds` }],
        }
      },
    }),

    'weeks-to-days': simpleTool({
      id: 'weeks-to-days',
      title: 'Weeks to Days Converter',
      description: 'Convert weeks into days, hours, and minutes.',
      inputs: [{ name: 'weeks', label: 'Weeks', type: 'number', min: 0, step: 0.01 }],
      defaultAutoCalculate: true,
      calculate: (v) => {
        const weeks = Math.max(0, safeNumber(v.weeks, 0))
        const days = weeks * 7
        const hours = days * 24
        const minutes = hours * 60
        return {
          results: [
            { label: 'Days', value: formatNumber(days), unit: 'days' },
            { label: 'Hours', value: formatNumber(hours), unit: 'hours' },
            { label: 'Minutes', value: formatNumber(minutes), unit: 'min' },
          ],
          breakdown: [{ label: 'Input', value: `${weeks} weeks` }],
        }
      },
    }),

    'months-to-days': simpleTool({
      id: 'months-to-days',
      title: 'Months to Days Converter',
      description: 'Convert months into approximate days and weeks (average month length).',
      inputs: [{ name: 'months', label: 'Months', type: 'number', min: 0, step: 0.01 }],
      defaultAutoCalculate: true,
      calculate: (v) => {
        const months = Math.max(0, safeNumber(v.months, 0))
        const avgDaysPerMonth = 30.436875
        const days = months * avgDaysPerMonth
        const weeks = days / 7
        return {
          results: [
            { label: 'Approx Days', value: formatNumber(days, 2), unit: 'days' },
            { label: 'Approx Weeks', value: formatNumber(weeks, 4), unit: 'weeks' },
          ],
          breakdown: [{ label: 'Assumption', value: `1 month ≈ ${avgDaysPerMonth} days` }],
        }
      },
    }),
  }
}

function timeFormatTools(): Record<string, DateTimeToolDefinition> {
  return {
    'military-time-converter': simpleTool({
      id: 'military-time-converter',
      title: 'Military Time Converter',
      description: 'Convert between 12-hour and 24-hour (military) time.',
      inputs: [
        { name: 'time', label: 'Time', type: 'text', placeholder: 'e.g., 07:45 PM or 19:45', showSeconds: true },
      ],
      defaultAutoCalculate: true,
      calculate: (v) => {
        const raw = String(v.time ?? '').trim()
        if (!raw) throw new Error('Please enter a time.')

        // 24-hour input
        const hms24 = parseTimeToHms(raw)
        if (hms24) {
          const hour12 = ((hms24.h + 11) % 12) + 1
          const ampm = hms24.h >= 12 ? 'PM' : 'AM'
          return {
            results: [
              { label: '24-hour', value: formatHms(hms24.h, hms24.m, hms24.s) },
              { label: '12-hour', value: `${String(hour12).padStart(2, '0')}:${String(hms24.m).padStart(2, '0')}:${String(hms24.s).padStart(2, '0')} ${ampm}` },
            ],
          }
        }

        // 12-hour input like 7:45 PM
        const m12 = raw.match(/^([0-9]{1,2}):([0-9]{2})(?::([0-9]{2}))?\s*(AM|PM)$/i)
        if (!m12) throw new Error('Please enter a valid time like 07:45 PM or 19:45.')
        let h = Number(m12[1])
        const m = Number(m12[2])
        const s = Number(m12[3] ?? '0')
        const ampm = String(m12[4]).toUpperCase()
        if (h < 1 || h > 12 || m < 0 || m > 59 || s < 0 || s > 59) throw new Error('Invalid time value.')
        if (ampm === 'PM' && h !== 12) h += 12
        if (ampm === 'AM' && h === 12) h = 0

        const hms = { h, m, s }
        return {
          results: [
            { label: '24-hour', value: formatHms(hms.h, hms.m, hms.s) },
            { label: '12-hour', value: raw.toUpperCase() },
          ],
        }
      },
    }),

    'decimal-time-converter': simpleTool({
      id: 'decimal-time-converter',
      title: 'Decimal Time Converter',
      description: 'Convert HH:MM[:SS] into decimal hours (and back).',
      inputs: [
        { name: 'mode', label: 'Mode', type: 'select', options: [
          { value: 'to-decimal', label: 'Time → Decimal hours' },
          { value: 'from-decimal', label: 'Decimal hours → Time' },
        ] },
        { name: 'time', label: 'Time', type: 'time', showSeconds: true },
        { name: 'decimal', label: 'Decimal Hours', type: 'number', step: 0.01, min: 0 },
      ],
      defaultAutoCalculate: true,
      calculate: (v) => {
        const mode = String(v.mode ?? 'to-decimal')

        if (mode === 'from-decimal') {
          const dec = Math.max(0, safeNumber(v.decimal, 0))
          const totalSeconds = Math.round(dec * 3600)
          const hms = formatDurationPartsFromSeconds(totalSeconds)
          const time = formatHms(hms.hours, hms.minutes, hms.seconds)
          return {
            results: [
              { label: 'Time (HH:MM:SS)', value: time },
              { label: 'Total Seconds', value: totalSeconds.toLocaleString(), unit: 'sec' },
            ],
            breakdown: [{ label: 'Input', value: `${dec} hours (decimal)` }],
          }
        }

        const hms = asTime(v.time, 'Time')
        const decimal = hms.h + hms.m / 60 + hms.s / 3600
        return {
          results: [
            { label: 'Decimal Hours', value: formatNumber(decimal, 6), unit: 'hours' },
            { label: 'Total Minutes', value: Math.round(decimal * 60).toLocaleString(), unit: 'min' },
          ],
          breakdown: [{ label: 'Time', value: formatHms(hms.h, hms.m, hms.s) }],
        }
      },
    }),
  }
}

function dateDiffTools(): Record<string, DateTimeToolDefinition> {
  const commonInputs = [
    { name: 'startDate', label: 'Start Date', type: 'date' as const },
    { name: 'endDate', label: 'End Date', type: 'date' as const },
  ]

  const calc = (v: any, includeTime: boolean): DateTimeToolResult => {
    const start = asDate(v.startDate, 'Start Date')
    const end = asDate(v.endDate, 'End Date')

    if (includeTime) {
      const startTime = asTime(v.startTime, 'Start Time')
      const endTime = asTime(v.endTime, 'End Time')
      start.setHours(startTime.h, startTime.m, startTime.s, 0)
      end.setHours(endTime.h, endTime.m, endTime.s, 0)
    }

    if (end.getTime() < start.getTime()) throw new Error('End date must be on or after start date.')

    const days = calendarDayDiff(start, end)
    const ymd = diffYmdDateOnly(start, end)
    const totalSeconds = secondsDiff(start, end)
    const totalMinutes = minutesDiff(start, end)

    return {
      results: [
        { label: 'Total Days', value: days.toLocaleString(), unit: 'days' },
        { label: 'Years / Months / Days', value: `${ymd.years}y ${ymd.months}m ${ymd.days}d` },
        { label: 'Total Minutes', value: totalMinutes.toLocaleString(), unit: 'min' },
        { label: 'Total Seconds', value: totalSeconds.toLocaleString(), unit: 'sec' },
      ],
      breakdown: [
        { label: 'Start', value: formatReadableDateTime(start) },
        { label: 'End', value: formatReadableDateTime(end) },
      ],
    }
  }

  return {
    'days-between-dates': simpleTool({
      id: 'days-between-dates',
      title: 'Days Between Dates',
      description: 'Calculate the number of days between two dates.',
      inputs: commonInputs,
      defaultAutoCalculate: true,
      calculate: (v) => calc(v, false),
    }),

    'date-difference': simpleTool({
      id: 'date-difference',
      title: 'Date Difference Calculator',
      description: 'Calculate precise difference between two dates.',
      inputs: [...commonInputs, { name: 'startTime', label: 'Start Time (Optional)', type: 'time', showSeconds: true }, { name: 'endTime', label: 'End Time (Optional)', type: 'time', showSeconds: true }],
      defaultAutoCalculate: false,
      calculate: (v) => {
        const startHasTime = String(v.startTime ?? '').trim().length > 0
        const endHasTime = String(v.endTime ?? '').trim().length > 0
        return calc(v, startHasTime || endHasTime)
      },
    }),

    'weekday-calculator': simpleTool({
      id: 'weekday-calculator',
      title: 'Day of Week Calculator',
      description: 'Find which day of week any date falls on.',
      inputs: [{ name: 'date', label: 'Date', type: 'date' }],
      defaultAutoCalculate: true,
      calculate: (v) => {
        const date = asDate(v.date, 'Date')
        const weekday = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(date)
        return {
          results: [{ label: 'Day of Week', value: weekday }],
          breakdown: [{ label: 'Date', value: formatReadableDateTime(date) }],
        }
      },
    }),

    'nth-day-calculator': simpleTool({
      id: 'nth-day-calculator',
      title: 'Nth Day of Year Calculator',
      description: 'Calculate which day number of the year a date is.',
      inputs: [{ name: 'date', label: 'Date', type: 'date' }],
      defaultAutoCalculate: true,
      calculate: (v) => {
        const date = asDate(v.date, 'Date')
        return {
          results: [
            { label: 'Day of Year', value: getDayOfYearNumber(date).toLocaleString() },
            { label: 'ISO Week', value: getIsoWeekNumber(date).toLocaleString() },
          ],
          breakdown: [{ label: 'Date', value: formatReadableDateTime(date) }],
        }
      },
    }),

    'leap-year-calculator': simpleTool({
      id: 'leap-year-calculator',
      title: 'Leap Year Calculator',
      description: 'Check if a year is a leap year.',
      inputs: [{ name: 'year', label: 'Year', type: 'number', min: 1, step: 1 }],
      defaultAutoCalculate: true,
      calculate: (v) => {
        const year = clampNumber(Math.floor(safeNumber(v.year, new Date().getFullYear())), 1, 9999)
        const leap = isLeapYear(year)
        return {
          results: [{ label: 'Leap Year?', value: leap ? 'Yes' : 'No' }],
          breakdown: [
            { label: 'Rule', value: 'Leap if divisible by 4, except centuries not divisible by 400.' },
          ],
        }
      },
    }),

    'week-number-calculator': simpleTool({
      id: 'week-number-calculator',
      title: 'Week Number Calculator',
      description: 'Find ISO week number for any date.',
      inputs: [{ name: 'date', label: 'Date', type: 'date' }],
      defaultAutoCalculate: true,
      calculate: (v) => {
        const date = asDate(v.date, 'Date')
        return {
          results: [{ label: 'ISO Week Number', value: getIsoWeekNumber(date).toLocaleString() }],
          breakdown: [{ label: 'Date', value: formatReadableDateTime(date) }],
        }
      },
    }),

    'quarter-calculator': simpleTool({
      id: 'quarter-calculator',
      title: 'Quarter Calculator',
      description: 'Calculate quarter information for a date (calendar + fiscal year India).',
      inputs: [{ name: 'date', label: 'Date', type: 'date' }],
      defaultAutoCalculate: true,
      calculate: (v) => {
        const date = asDate(v.date, 'Date')
        const q = getQuarter(date)
        const fy = getFiscalYearIndia(date)
        return {
          results: [
            { label: 'Calendar Quarter', value: `Q${q}` },
            { label: 'Fiscal Year (India)', value: `FY ${fy.startYear}-${String(fy.endYear).slice(-2)}` },
          ],
          breakdown: [{ label: 'Date', value: formatReadableDateTime(date) }],
        }
      },
    }),
  }
}

function dateAddSubtractTools(): Record<string, DateTimeToolDefinition> {
  return {
    'date-calculator': simpleTool({
      id: 'date-calculator',
      title: 'Date Calculator',
      description: 'Add or subtract days, months, and years from a date.',
      inputs: [
        { name: 'baseDate', label: 'Base Date', type: 'date' },
        { name: 'years', label: 'Years', type: 'number', step: 1 },
        { name: 'months', label: 'Months', type: 'number', step: 1 },
        { name: 'days', label: 'Days', type: 'number', step: 1 },
      ],
      defaultAutoCalculate: false,
      calculate: (v) => {
        const base = asDate(v.baseDate, 'Base Date')
        const years = Math.trunc(safeNumber(v.years, 0))
        const months = Math.trunc(safeNumber(v.months, 0))
        const days = Math.trunc(safeNumber(v.days, 0))
        const out = addToDate(base, { years, months, days })
        return {
          results: [{ label: 'Result Date', value: formatReadableDateTime(out) }],
          breakdown: [
            { label: 'Base', value: formatReadableDateTime(base) },
            { label: 'Adjustment', value: `${years}y ${months}m ${days}d` },
          ],
        }
      },
    }),

    'date-add-subtract': simpleTool({
      id: 'date-add-subtract',
      title: 'Date Add/Subtract',
      description: 'Add or subtract a specific time period from a date.',
      inputs: [
        { name: 'baseDate', label: 'Base Date', type: 'date' },
        { name: 'operation', label: 'Operation', type: 'select', options: [
          { value: 'add', label: 'Add' },
          { value: 'subtract', label: 'Subtract' },
        ] },
        { name: 'years', label: 'Years', type: 'number', step: 1 },
        { name: 'months', label: 'Months', type: 'number', step: 1 },
        { name: 'days', label: 'Days', type: 'number', step: 1 },
      ],
      defaultAutoCalculate: false,
      calculate: (v) => {
        const base = asDate(v.baseDate, 'Base Date')
        const op = String(v.operation ?? 'add')
        const sign = op === 'subtract' ? -1 : 1
        const years = sign * Math.trunc(safeNumber(v.years, 0))
        const months = sign * Math.trunc(safeNumber(v.months, 0))
        const days = sign * Math.trunc(safeNumber(v.days, 0))
        const out = addToDate(base, { years, months, days })
        return {
          results: [{ label: 'Result Date', value: formatReadableDateTime(out) }],
          breakdown: [
            { label: 'Base', value: formatReadableDateTime(base) },
            { label: 'Operation', value: op },
            { label: 'Adjustment', value: `${years}y ${months}m ${days}d` },
          ],
        }
      },
    }),
  }
}

function ageTool(): DateTimeToolDefinition {
  return simpleTool({
    id: 'age-calculator',
    title: 'Age Calculator',
    description: 'Calculate exact age in years, months, days, and more.',
    inputs: [
      { name: 'birthdate', label: 'Date of Birth', type: 'date' },
      { name: 'birthTime', label: 'Time of Birth (Optional)', type: 'time', showSeconds: true },
      { name: 'targetDate', label: 'Calculate Age At (Optional)', type: 'date' },
      { name: 'targetTime', label: 'Target Time (Optional)', type: 'time', showSeconds: true },
    ],
    defaultAutoCalculate: true,
    calculate: (v, ctx) => {
      const birth = asDateTime(v.birthdate, v.birthTime ?? '00:00', 'Date of Birth', 'Time of Birth')

      const targetDateRaw = String(v.targetDate ?? '').trim()
      const now = ctx.now
      const targetDate = targetDateRaw ? parseUserDate(targetDateRaw) : null
      if (targetDateRaw && !targetDate) throw new Error('Please enter a valid target date.')

      const sameCalendarDayAsNow = (d: Date) =>
        d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate()

      const shouldLive = !targetDate || sameCalendarDayAsNow(targetDate)

      const target = targetDate
        ? (shouldLive
            ? now
            : asDateTime(targetDateRaw, v.targetTime ?? '00:00', 'Target Date', 'Target Time'))
        : now

      if (birth.getTime() > target.getTime()) throw new Error('Target date cannot be before birth date.')

      const ymd = diffYmdDateOnly(birth, target)
      const totalSeconds = secondsDiff(birth, target)
      const totalMinutes = minutesDiff(birth, target)
      const totalDays = calendarDayDiff(birth, target)
      const totalWeeks = Math.floor(totalDays / 7)
      const hms = formatDurationPartsFromSeconds(totalSeconds)

      return {
        results: [
          { label: 'Age (Y/M/D)', value: `${ymd.years} years, ${ymd.months} months, ${ymd.days} days` },
          { label: 'Total Days', value: totalDays.toLocaleString(), unit: 'days' },
          { label: 'Total Weeks', value: totalWeeks.toLocaleString(), unit: 'weeks' },
          { label: 'Total Minutes', value: totalMinutes.toLocaleString(), unit: 'min' },
          { label: 'Total Seconds', value: totalSeconds.toLocaleString(), unit: 'sec' },
          { label: 'Duration (D/H/M/S)', value: `${hms.days}d ${hms.hours}h ${hms.minutes}m ${hms.seconds}s` },
        ],
        breakdown: [
          { label: 'Date of Birth', value: formatReadableDateTime(birth) },
          { label: 'Target', value: formatReadableDateTime(target) },
          shouldLive ? { label: 'Live Update', value: 'Yes (updates automatically)' } : { label: 'Live Update', value: 'No' },
        ],
        live: shouldLive ? { isLive: true, refreshEveryMs: 1000 } : { isLive: false },
      }
    },
  })
}

function unixTimestampTool(): DateTimeToolDefinition {
  return simpleTool({
    id: 'unix-timestamp-converter',
    title: 'Unix Timestamp Converter',
    description: 'Convert Unix/Epoch timestamps to human-readable date and vice versa.',
    inputs: [
      { name: 'mode', label: 'Mode', type: 'select', options: [
        { value: 'to-date', label: 'Timestamp → Date' },
        { value: 'to-timestamp', label: 'Date → Timestamp' },
      ] },
      { name: 'timestamp', label: 'Timestamp (seconds)', type: 'number', step: 1 },
      { name: 'date', label: 'Date', type: 'date' },
      { name: 'time', label: 'Time', type: 'time', showSeconds: true },
    ],
    defaultAutoCalculate: true,
    calculate: (v, ctx) => {
      const mode = String(v.mode ?? 'to-date')
      if (mode === 'to-timestamp') {
        const dateRaw = String(v.date ?? '').trim()
        const timeRaw = String(v.time ?? '00:00')
        const dt = asDateTime(dateRaw, timeRaw, 'Date', 'Time')
        const seconds = Math.floor(dt.getTime() / 1000)
        return {
          results: [
            { label: 'Unix Timestamp', value: seconds.toLocaleString(), unit: 'sec' },
            { label: 'ISO', value: dt.toISOString() },
          ],
          breakdown: [{ label: 'Local DateTime', value: formatReadableDateTime(dt) }],
        }
      }

      const ts = safeNumber(v.timestamp, Math.floor(ctx.now.getTime() / 1000))
      const dt = new Date(ts * 1000)
      if (!Number.isFinite(dt.getTime())) throw new Error('Invalid timestamp.')
      return {
        results: [
          { label: 'Local DateTime', value: formatReadableDateTime(dt) },
          { label: 'ISO', value: dt.toISOString() },
        ],
        breakdown: [
          { label: 'Timestamp', value: `${Math.floor(ts)} seconds` },
        ],
      }
    },
  })
}

function timezoneTools(): Record<string, DateTimeToolDefinition> {
  const zoneOptions = listIanaTimeZones()

  return {
    'world-clock': simpleTool({
      id: 'world-clock',
      title: 'World Clock',
      description: 'See current time in multiple time zones.',
      inputs: [
        { name: 'zone1', label: 'Time Zone 1', type: 'timezone', options: zoneOptions },
        { name: 'zone2', label: 'Time Zone 2', type: 'timezone', options: zoneOptions },
        { name: 'zone3', label: 'Time Zone 3', type: 'timezone', options: zoneOptions },
      ],
      defaultAutoCalculate: true,
      calculate: (v, ctx) => {
        const z1 = String(v.zone1 ?? 'UTC')
        const z2 = String(v.zone2 ?? 'Asia/Kolkata')
        const z3 = String(v.zone3 ?? 'America/New_York')
        const now = ctx.now
        return {
          results: [
            { label: z1, value: formatInTimeZone(now, z1) },
            { label: z2, value: formatInTimeZone(now, z2) },
            { label: z3, value: formatInTimeZone(now, z3) },
          ],
          breakdown: [{ label: 'Local Now', value: formatReadableDateTime(now) }],
          live: { isLive: true, refreshEveryMs: 1000 },
        }
      },
    }),

    'time-zone-difference': simpleTool({
      id: 'time-zone-difference',
      title: 'Time Zone Difference',
      description: 'Compare the current time difference between two time zones.',
      inputs: [
        { name: 'fromZone', label: 'From Time Zone', type: 'timezone', options: zoneOptions },
        { name: 'toZone', label: 'To Time Zone', type: 'timezone', options: zoneOptions },
      ],
      defaultAutoCalculate: true,
      calculate: (v, ctx) => {
        const fromZone = String(v.fromZone ?? 'UTC')
        const toZone = String(v.toZone ?? 'Asia/Kolkata')
        const now = ctx.now

        // We approximate the offset delta using formatted parts.
        // This is suitable for a live comparison display.
        const parts = (zone: string) => {
          const dtf = new Intl.DateTimeFormat('en-US', {
            timeZone: zone,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
          })
          const [hh, mm, ss] = dtf.format(now).split(':').map((x) => Number(x))
          return hh * 3600 + mm * 60 + (ss || 0)
        }

        const a = parts(fromZone)
        const b = parts(toZone)
        let delta = b - a
        // wrap to [-12h, +12h] for readability
        const day = 24 * 3600
        if (delta > day / 2) delta -= day
        if (delta < -day / 2) delta += day

        const sign = delta >= 0 ? '+' : '-'
        const abs = Math.abs(delta)
        const hms = toHmsFromSeconds(abs)
        return {
          results: [
            { label: 'From', value: `${fromZone}: ${formatInTimeZone(now, fromZone)}` },
            { label: 'To', value: `${toZone}: ${formatInTimeZone(now, toZone)}` },
            { label: 'Difference', value: `${sign}${String(hms.h).padStart(2, '0')}:${String(hms.m).padStart(2, '0')}:${String(hms.s).padStart(2, '0')}` },
          ],
          live: { isLive: true, refreshEveryMs: 1000 },
        }
      },
    }),

    // Alias tools to the same behavior
    'ist-to-utc': simpleTool({
      id: 'ist-to-utc',
      title: 'IST to UTC Converter',
      description: 'Convert India time (IST) to UTC (format-based).',
      inputs: [
        { name: 'date', label: 'Date', type: 'date' },
        { name: 'time', label: 'Time (IST)', type: 'time', showSeconds: true },
      ],
      defaultAutoCalculate: false,
      calculate: (v) => {
        const dt = asDateTime(v.date, v.time ?? '00:00', 'Date', 'Time')
        return {
          results: [
            { label: 'IST (Input as local)', value: formatReadableDateTime(dt) },
            { label: 'UTC', value: dt.toISOString() },
          ],
          breakdown: [
            { label: 'Note', value: 'This tool formats the UTC output from the entered date/time. For true “IST as input timezone” conversions, a time-zone parsing library is required.' },
          ],
        }
      },
    }),

    'utc-to-local': simpleTool({
      id: 'utc-to-local',
      title: 'UTC to Local Time',
      description: 'Convert UTC time to your local time.',
      inputs: [
        { name: 'utcIso', label: 'UTC ISO DateTime', type: 'text', placeholder: '2026-01-03T12:00:00Z' },
      ],
      defaultAutoCalculate: true,
      calculate: (v) => {
        const raw = String(v.utcIso ?? '').trim()
        const dt = raw ? new Date(raw) : new Date()
        if (!Number.isFinite(dt.getTime())) throw new Error('Please enter a valid ISO datetime (e.g., 2026-01-03T12:00:00Z).')
        return {
          results: [
            { label: 'UTC', value: dt.toISOString() },
            { label: 'Local', value: formatReadableDateTime(dt) },
          ],
        }
      },
    }),

    'gmt-converter': simpleTool({
      id: 'gmt-converter',
      title: 'GMT Time Converter',
      description: 'View current time in GMT/UTC.',
      inputs: [],
      defaultAutoCalculate: true,
      calculate: (_v, ctx) => {
        const now = ctx.now
        return {
          results: [
            { label: 'UTC', value: now.toISOString() },
            { label: 'Local', value: formatReadableDateTime(now) },
          ],
          live: { isLive: true, refreshEveryMs: 1000 },
        }
      },
    }),

    'dst-calculator': simpleTool({
      id: 'dst-calculator',
      title: 'Daylight Saving Time Calculator',
      description: 'Show whether a selected time zone is currently observing DST (where applicable).',
      inputs: [
        { name: 'zone', label: 'Time Zone', type: 'timezone', options: zoneOptions },
      ],
      defaultAutoCalculate: true,
      calculate: (v, ctx) => {
        const zone = String(v.zone ?? 'Europe/London')
        const now = ctx.now
        const jan = new Date(now.getFullYear(), 0, 1)
        const jul = new Date(now.getFullYear(), 6, 1)

        const offset = (d: Date) => {
          const parts = new Intl.DateTimeFormat('en-US', {
            timeZone: zone,
            timeZoneName: 'shortOffset',
            hour: '2-digit',
          }).formatToParts(d)
          const tz = parts.find((p) => p.type === 'timeZoneName')?.value ?? ''
          return tz
        }

        const offJan = offset(jan)
        const offJul = offset(jul)
        const offNow = offset(now)
        const isDst = offJan !== offJul && offNow === offJul

        return {
          results: [
            { label: 'Time Zone', value: zone },
            { label: 'Now', value: formatInTimeZone(now, zone) },
            { label: 'DST Observed Now?', value: isDst ? 'Yes' : 'No / Unknown' },
          ],
          breakdown: [
            { label: 'Jan Offset', value: offJan || '—' },
            { label: 'Jul Offset', value: offJul || '—' },
            { label: 'Now Offset', value: offNow || '—' },
          ],
        }
      },
    }),
  }
}

function calendarIntlTools(): Record<string, DateTimeToolDefinition> {
  return {
    'hijri-calendar': simpleTool({
      id: 'hijri-calendar',
      title: 'Hijri Calendar Converter',
      description: 'Convert Gregorian dates into Islamic (Hijri) calendar format.',
      inputs: [{ name: 'date', label: 'Gregorian Date', type: 'date' }],
      defaultAutoCalculate: true,
      calculate: (v) => {
        const d = asDate(v.date, 'Date')
        return {
          results: [{ label: 'Hijri Date', value: formatCalendarWithIntl(d, 'islamic') }],
          breakdown: [{ label: 'Gregorian', value: formatReadableDateTime(d) }],
        }
      },
    }),

    'hebrew-calendar': simpleTool({
      id: 'hebrew-calendar',
      title: 'Hebrew Calendar Converter',
      description: 'Convert Gregorian dates into Hebrew calendar format.',
      inputs: [{ name: 'date', label: 'Gregorian Date', type: 'date' }],
      defaultAutoCalculate: true,
      calculate: (v) => {
        const d = asDate(v.date, 'Date')
        return {
          results: [{ label: 'Hebrew Date', value: formatCalendarWithIntl(d, 'hebrew') }],
          breakdown: [{ label: 'Gregorian', value: formatReadableDateTime(d) }],
        }
      },
    }),

    'chinese-calendar': simpleTool({
      id: 'chinese-calendar',
      title: 'Chinese Calendar Converter',
      description: 'Convert Gregorian dates into Chinese calendar format.',
      inputs: [{ name: 'date', label: 'Gregorian Date', type: 'date' }],
      defaultAutoCalculate: true,
      calculate: (v) => {
        const d = asDate(v.date, 'Date')
        return {
          results: [{ label: 'Chinese Calendar Date', value: formatCalendarWithIntl(d, 'chinese') }],
          breakdown: [{ label: 'Gregorian', value: formatReadableDateTime(d) }],
        }
      },
    }),

    'lunar-calendar': simpleTool({
      id: 'lunar-calendar',
      title: 'Lunar Calendar Converter',
      description: 'View the date in a lunar calendar format (Intl-based).',
      inputs: [{ name: 'date', label: 'Date', type: 'date' }],
      defaultAutoCalculate: true,
      calculate: (v) => {
        const d = asDate(v.date, 'Date')
        // Use Chinese calendar as a widely-supported lunar-based calendar representation.
        return {
          results: [{ label: 'Lunar (Chinese calendar)', value: formatCalendarWithIntl(d, 'chinese') }],
          breakdown: [{ label: 'Note', value: 'This uses the browser Intl calendar representation. Regional lunar calendars can vary.' }],
        }
      },
    }),
  }
}

function simpleCountdownTools(): Record<string, DateTimeToolDefinition> {
  const base: Record<string, { title: string; description: string }> = {
    'days-until-calculator': { title: 'Days Until Calculator', description: 'Count days until a future date.' },
    'days-since-calculator': { title: 'Days Since Calculator', description: 'Count days since a past date.' },
    'countdown-calculator': { title: 'Event Countdown Calculator', description: 'Count down to an event date/time.' },
    'wedding-countdown': { title: 'Wedding Countdown', description: 'Count down to your wedding date.' },
    'exam-countdown': { title: 'Exam Countdown Calculator', description: 'Count down to an exam date.' },
    'deadline-tracker': { title: 'Deadline Tracker', description: 'Track time remaining until a deadline.' },
    'remaining-time': { title: 'Remaining Time Calculator', description: 'Calculate time remaining until a deadline.' },
  }

  const make = (id: string) =>
    simpleTool({
      id,
      title: base[id]?.title ?? id,
      description: base[id]?.description ?? 'Countdown calculator',
      inputs: [
        { name: 'targetDate', label: 'Target Date', type: 'date' },
        { name: 'targetTime', label: 'Target Time (Optional)', type: 'time', showSeconds: true },
      ],
      defaultAutoCalculate: true,
      calculate: (v, ctx) => {
        const target = asDateTime(v.targetDate, v.targetTime ?? '00:00', 'Target Date', 'Target Time')
        const now = ctx.now
        const totalSeconds = secondsDiff(now, target)
        const isPast = totalSeconds < 0
        const parts = formatDurationPartsFromSeconds(Math.abs(totalSeconds))

        return {
          results: [
            { label: isPast ? 'Time Since' : 'Time Remaining', value: `${parts.days}d ${parts.hours}h ${parts.minutes}m ${parts.seconds}s` },
            { label: 'Target', value: formatReadableDateTime(target) },
          ],
          breakdown: [
            { label: 'Now', value: formatReadableDateTime(now) },
            { label: 'Total Seconds', value: Math.abs(totalSeconds).toLocaleString(), unit: 'sec' },
          ],
          live: { isLive: true, refreshEveryMs: 1000 },
        }
      },
    })

  return Object.fromEntries(Object.keys(base).map((id) => [id, make(id)]))
}

function specialDateStreakTools(): Record<string, DateTimeToolDefinition> {
  const defs: Record<string, { title: string; description: string; startLabel: string }> = {
    'days-of-life': { title: 'Days of Life Calculator', description: 'Calculate how many days you have lived.', startLabel: 'Birth Date' },
    'relationship-duration': { title: 'Relationship Duration', description: 'Calculate relationship duration since a start date.', startLabel: 'Start Date' },
    'job-tenure-calculator': { title: 'Job Tenure Calculator', description: 'Calculate work tenure since joining date.', startLabel: 'Joining Date' },
    'sobriety-calculator': { title: 'Sobriety Calculator', description: 'Track days since you stopped.', startLabel: 'Start Date' },
    'smoke-free-calculator': { title: 'Smoke Free Calculator', description: 'Track days since quitting smoking.', startLabel: 'Quit Date' },
    'fitness-streak': { title: 'Fitness Streak Calculator', description: 'Track days in your fitness streak.', startLabel: 'Streak Start Date' },
    'habit-tracker': { title: 'Habit Streak Tracker', description: 'Track days since starting a habit.', startLabel: 'Habit Start Date' },
    'memorial-date': { title: 'Memorial Date Calculator', description: 'Calculate time since a memorial date.', startLabel: 'Memorial Date' },
    'milestone-tracker': { title: 'Milestone Date Tracker', description: 'Calculate milestone dates from a start date.', startLabel: 'Start Date' },
    'anniversary-reminder': { title: 'Anniversary Reminder', description: 'Calculate the next anniversary date.', startLabel: 'Anniversary Date' },
  }

  const make = (id: string) =>
    simpleTool({
      id,
      title: defs[id]?.title ?? id,
      description: defs[id]?.description ?? 'Date tracker',
      inputs: [
        { name: 'startDate', label: defs[id]?.startLabel ?? 'Start Date', type: 'date' },
      ],
      defaultAutoCalculate: true,
      calculate: (v, ctx) => {
        const start = asDate(v.startDate, 'Start Date')
        const now = ctx.now
        if (now.getTime() < start.getTime()) throw new Error('Start date cannot be in the future.')

        const days = calendarDayDiff(start, now)
        const ymd = diffYmdDateOnly(start, now)

        if (id === 'anniversary-reminder') {
          const thisYear = new Date(now.getFullYear(), start.getMonth(), start.getDate())
          const next = thisYear.getTime() >= now.getTime() ? thisYear : new Date(now.getFullYear() + 1, start.getMonth(), start.getDate())
          const remaining = calendarDayDiff(now, next)
          return {
            results: [
              { label: 'Next Anniversary', value: formatReadableDateTime(next) },
              { label: 'Days Remaining', value: remaining.toLocaleString(), unit: 'days' },
            ],
            breakdown: [{ label: 'Original Date', value: formatReadableDateTime(start) }],
          }
        }

        if (id === 'milestone-tracker') {
          const milestones = [100, 365, 500, 1000, 5000, 10000]
          const nextMilestone = milestones.find((m) => m > days) ?? null
          const nextDate = nextMilestone ? addToDate(start, { days: nextMilestone }) : null
          return {
            results: [
              { label: 'Duration (Y/M/D)', value: `${ymd.years}y ${ymd.months}m ${ymd.days}d` },
              { label: 'Total Days', value: days.toLocaleString(), unit: 'days' },
              ...(nextMilestone && nextDate
                ? [{ label: 'Next Milestone', value: `${nextMilestone} days on ${formatReadableDateTime(nextDate)}` }]
                : [{ label: 'Next Milestone', value: '—' }]),
            ],
            breakdown: [{ label: 'Start Date', value: formatReadableDateTime(start) }],
          }
        }

        return {
          results: [
            { label: 'Duration (Y/M/D)', value: `${ymd.years}y ${ymd.months}m ${ymd.days}d` },
            { label: 'Total Days', value: days.toLocaleString(), unit: 'days' },
          ],
          breakdown: [{ label: 'Start Date', value: formatReadableDateTime(start) }],
        }
      },
    })

  return Object.fromEntries(Object.keys(defs).map((id) => [id, make(id)]))
}

function historicalSimpleTools(): Record<string, DateTimeToolDefinition> {
  return {
    'century-calculator': simpleTool({
      id: 'century-calculator',
      title: 'Century Calculator',
      description: 'Determine which century a year belongs to.',
      inputs: [{ name: 'year', label: 'Year', type: 'number', step: 1 }],
      defaultAutoCalculate: true,
      calculate: (v) => {
        const year = Math.trunc(safeNumber(v.year, new Date().getFullYear()))
        if (!Number.isFinite(year) || year === 0) throw new Error('Enter a valid year (no year 0 in AD/BC).')
        const absYear = Math.abs(year)
        const century = Math.floor((absYear - 1) / 100) + 1
        const suffix = year < 0 ? 'BC' : 'AD'
        return {
          results: [{ label: 'Century', value: `${century} ${suffix}` }],
        }
      },
    }),

    'decade-calculator': simpleTool({
      id: 'decade-calculator',
      title: 'Decade Calculator',
      description: 'Find the decade for a year.',
      inputs: [{ name: 'year', label: 'Year', type: 'number', step: 1 }],
      defaultAutoCalculate: true,
      calculate: (v) => {
        const year = Math.trunc(safeNumber(v.year, new Date().getFullYear()))
        if (!Number.isFinite(year) || year === 0) throw new Error('Enter a valid year (no year 0).')
        const base = Math.floor(year / 10) * 10
        return {
          results: [{ label: 'Decade', value: `${base}s` }],
        }
      },
    }),

    'era-converter': simpleTool({
      id: 'era-converter',
      title: 'Era Converter (BC/AD)',
      description: 'Convert a year between BC and AD representation.',
      inputs: [
        { name: 'mode', label: 'Mode', type: 'select', options: [
          { value: 'ad-to-bc', label: 'AD → BC (display)' },
          { value: 'bc-to-ad', label: 'BC → AD (display)' },
        ] },
        { name: 'year', label: 'Year', type: 'number', step: 1 },
      ],
      defaultAutoCalculate: true,
      calculate: (v) => {
        const mode = String(v.mode ?? 'ad-to-bc')
        const year = Math.trunc(safeNumber(v.year, new Date().getFullYear()))
        if (!Number.isFinite(year) || year <= 0) throw new Error('Enter a positive year number.')

        if (mode === 'bc-to-ad') {
          return { results: [{ label: 'Result', value: `${year} AD` }] }
        }
        return { results: [{ label: 'Result', value: `${year} BC` }] }
      },
    }),

    'zodiac-sign-calculator': simpleTool({
      id: 'zodiac-sign-calculator',
      title: 'Zodiac Sign Calculator',
      description: 'Find your western zodiac sign from your birth date.',
      inputs: [{ name: 'date', label: 'Birth Date', type: 'date' }],
      defaultAutoCalculate: true,
      calculate: (v) => {
        const d = asDate(v.date, 'Birth Date')
        const m = d.getMonth() + 1
        const day = d.getDate()

        const sign = (() => {
          // Tropical zodiac date ranges
          if ((m === 3 && day >= 21) || (m === 4 && day <= 19)) return 'Aries'
          if ((m === 4 && day >= 20) || (m === 5 && day <= 20)) return 'Taurus'
          if ((m === 5 && day >= 21) || (m === 6 && day <= 20)) return 'Gemini'
          if ((m === 6 && day >= 21) || (m === 7 && day <= 22)) return 'Cancer'
          if ((m === 7 && day >= 23) || (m === 8 && day <= 22)) return 'Leo'
          if ((m === 8 && day >= 23) || (m === 9 && day <= 22)) return 'Virgo'
          if ((m === 9 && day >= 23) || (m === 10 && day <= 22)) return 'Libra'
          if ((m === 10 && day >= 23) || (m === 11 && day <= 21)) return 'Scorpio'
          if ((m === 11 && day >= 22) || (m === 12 && day <= 21)) return 'Sagittarius'
          if ((m === 12 && day >= 22) || (m === 1 && day <= 19)) return 'Capricorn'
          if ((m === 1 && day >= 20) || (m === 2 && day <= 18)) return 'Aquarius'
          return 'Pisces'
        })()

        return {
          results: [{ label: 'Zodiac Sign', value: sign }],
          breakdown: [{ label: 'Birth Date', value: formatReadableDateTime(d) }],
        }
      },
    }),

    'chinese-zodiac': simpleTool({
      id: 'chinese-zodiac',
      title: 'Chinese Zodiac Calculator',
      description: 'Find your Chinese zodiac animal by birth year.',
      inputs: [{ name: 'year', label: 'Birth Year', type: 'number', step: 1 }],
      defaultAutoCalculate: true,
      calculate: (v) => {
        const year = Math.trunc(safeNumber(v.year, new Date().getFullYear()))
        if (year <= 0) throw new Error('Enter a valid year.')
        const animals = ['Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake', 'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig']
        const idx = (year - 1900) % 12
        const animal = animals[(idx + 12) % 12]
        return {
          results: [{ label: 'Chinese Zodiac', value: animal }],
          breakdown: [{ label: 'Year', value: year.toString() }],
        }
      },
    }),

    'historical-event-age': simpleTool({
      id: 'historical-event-age',
      title: 'Historical Event Age',
      description: 'Calculate years since a historical date.',
      inputs: [{ name: 'eventDate', label: 'Event Date', type: 'date' }],
      defaultAutoCalculate: true,
      calculate: (v, ctx) => {
        const start = asDate(v.eventDate, 'Event Date')
        const now = ctx.now
        const days = calendarDayDiff(start, now)
        const ymd = diffYmdDateOnly(start, now)
        return {
          results: [
            { label: 'Years / Months / Days', value: `${ymd.years}y ${ymd.months}m ${ymd.days}d` },
            { label: 'Total Days', value: days.toLocaleString(), unit: 'days' },
          ],
          breakdown: [
            { label: 'Event Date', value: formatReadableDateTime(start) },
            { label: 'As Of', value: formatReadableDateTime(now) },
          ],
        }
      },
    }),
  }
}

function astronomyTools(): Record<string, DateTimeToolDefinition> {
  return {
    'moon-phase-calculator': simpleTool({
      id: 'moon-phase-calculator',
      title: 'Moon Phase Calculator',
      description: 'Calculate moon phase for a date (astronomy-engine).',
      inputs: [{ name: 'date', label: 'Date', type: 'date' }],
      defaultAutoCalculate: true,
      calculate: (v) => {
        const date = asDate(v.date, 'Date')
        // Placeholder for sync signature; astronomy loaded lazily inside UI wrapper.
        // We return a hint; UI will re-run once astronomy is available.
        return {
          results: [{ label: 'Moon Phase', value: 'Loading astronomy…' }],
          breakdown: [{ label: 'Date', value: formatReadableDateTime(date) }],
        }
      },
    }),

    'equinox-solstice': simpleTool({
      id: 'equinox-solstice',
      title: 'Equinox & Solstice Calculator',
      description: 'Calculate equinoxes and solstices for a year (astronomy-engine).',
      inputs: [{ name: 'year', label: 'Year', type: 'number', step: 1 }],
      defaultAutoCalculate: true,
      calculate: (v) => {
        const year = Math.trunc(safeNumber(v.year, new Date().getFullYear()))
        return {
          results: [{ label: 'Seasons', value: 'Loading astronomy…' }],
          breakdown: [{ label: 'Year', value: String(year) }],
        }
      },
    }),

    'sidereal-time': simpleTool({
      id: 'sidereal-time',
      title: 'Sidereal Time Calculator',
      description: 'Calculate sidereal time for a given date/time and longitude (astronomy-engine).',
      inputs: [
        { name: 'date', label: 'Date', type: 'date' },
        { name: 'time', label: 'Time', type: 'time', showSeconds: true },
        { name: 'longitude', label: 'Longitude', type: 'longitude', min: -180, max: 180, step: 0.0001, unit: '°' },
      ],
      defaultAutoCalculate: false,
      calculate: (v) => {
        const dt = asDateTime(v.date, v.time ?? '00:00', 'Date', 'Time')
        const lon = clampNumber(safeNumber(v.longitude, 0), -180, 180)
        return {
          results: [{ label: 'Sidereal Time', value: 'Loading astronomy…' }],
          breakdown: [
            { label: 'DateTime', value: formatReadableDateTime(dt) },
            { label: 'Longitude', value: `${lon}°` },
          ],
        }
      },
    }),

    'planet-position': simpleTool({
      id: 'planet-position',
      title: 'Planet Position Calculator',
      description: 'Calculate approximate planet position for a date/time (astronomy-engine).',
      inputs: [
        { name: 'planet', label: 'Planet', type: 'select', options: [
          { value: 'Mercury', label: 'Mercury' },
          { value: 'Venus', label: 'Venus' },
          { value: 'Mars', label: 'Mars' },
          { value: 'Jupiter', label: 'Jupiter' },
          { value: 'Saturn', label: 'Saturn' },
          { value: 'Uranus', label: 'Uranus' },
          { value: 'Neptune', label: 'Neptune' },
        ] },
        { name: 'date', label: 'Date', type: 'date' },
        { name: 'time', label: 'Time', type: 'time', showSeconds: true },
      ],
      defaultAutoCalculate: false,
      calculate: (v) => {
        const planet = String(v.planet ?? 'Mars')
        const dt = asDateTime(v.date, v.time ?? '00:00', 'Date', 'Time')
        return {
          results: [{ label: 'Planet Position', value: 'Loading astronomy…' }],
          breakdown: [
            { label: 'Planet', value: planet },
            { label: 'DateTime', value: formatReadableDateTime(dt) },
          ],
        }
      },
    }),

    'solar-eclipse-calculator': simpleTool({
      id: 'solar-eclipse-calculator',
      title: 'Solar Eclipse Calculator',
      description: 'Find the next solar eclipse after a given date (astronomy-engine).',
      inputs: [{ name: 'date', label: 'From Date', type: 'date' }],
      defaultAutoCalculate: true,
      calculate: (v) => {
        const d = asDate(v.date, 'From Date')
        return {
          results: [{ label: 'Next Eclipse', value: 'Loading astronomy…' }],
          breakdown: [{ label: 'From Date', value: formatReadableDateTime(d) }],
        }
      },
    }),

    'sunrise-sunset': simpleTool({
      id: 'sunrise-sunset',
      title: 'Sunrise Sunset Calculator',
      description: 'Calculate sunrise and sunset times for a location (astronomy-engine).',
      inputs: [
        { name: 'date', label: 'Date', type: 'date' },
        { name: 'latitude', label: 'Latitude', type: 'latitude', min: -90, max: 90, step: 0.0001, unit: '°' },
        { name: 'longitude', label: 'Longitude', type: 'longitude', min: -180, max: 180, step: 0.0001, unit: '°' },
      ],
      defaultAutoCalculate: false,
      calculate: (v) => {
        const date = asDate(v.date, 'Date')
        const lat = clampNumber(safeNumber(v.latitude, 0), -90, 90)
        const lon = clampNumber(safeNumber(v.longitude, 0), -180, 180)
        return {
          results: [{ label: 'Sunrise / Sunset', value: 'Loading astronomy…' }],
          breakdown: [
            { label: 'Date', value: formatReadableDateTime(date) },
            { label: 'Location', value: `${lat}°, ${lon}°` },
          ],
        }
      },
    }),

    'golden-hour-calculator': simpleTool({
      id: 'golden-hour-calculator',
      title: 'Golden Hour Calculator',
      description: 'Estimate golden hour times for photography (astronomy-engine).',
      inputs: [
        { name: 'date', label: 'Date', type: 'date' },
        { name: 'latitude', label: 'Latitude', type: 'latitude', min: -90, max: 90, step: 0.0001, unit: '°' },
        { name: 'longitude', label: 'Longitude', type: 'longitude', min: -180, max: 180, step: 0.0001, unit: '°' },
      ],
      defaultAutoCalculate: false,
      calculate: (v) => {
        const date = asDate(v.date, 'Date')
        const lat = clampNumber(safeNumber(v.latitude, 0), -90, 90)
        const lon = clampNumber(safeNumber(v.longitude, 0), -180, 180)
        return {
          results: [{ label: 'Golden Hour', value: 'Loading astronomy…' }],
          breakdown: [
            { label: 'Date', value: formatReadableDateTime(date) },
            { label: 'Location', value: `${lat}°, ${lon}°` },
          ],
        }
      },
    }),

    'vedic-panchang': simpleTool({
      id: 'vedic-panchang',
      title: 'Vedic Panchang Calculator',
      description: 'Basic Panchang view (limited; depends on browser Intl and location).',
      inputs: [{ name: 'date', label: 'Date', type: 'date' }],
      defaultAutoCalculate: true,
      calculate: (v) => {
        const d = asDate(v.date, 'Date')
        return {
          results: [{ label: 'Date', value: formatReadableDateTime(d) }],
          breakdown: [{ label: 'Note', value: 'A full Panchang requires location + detailed ephemeris rules. This will be expanded using astronomy data.' }],
        }
      },
    }),
  }
}

function placeholdersForRemainingIds(ids: string[]): Record<string, DateTimeToolDefinition> {
  const map: Record<string, DateTimeToolDefinition> = {}
  for (const id of ids) {
    map[id] = simpleTool({
      id,
      title: id
        .split('-')
        .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
        .join(' '),
      description: 'Advanced calculator in progress.',
      inputs: [],
      defaultAutoCalculate: true,
      calculate: () => ({
        results: [{ label: 'Status', value: 'This tool is being upgraded to the advanced DateTime engine.' }],
      }),
    })
  }
  return map
}

function countBusinessDays(startDate: Date, endDate: Date) {
  const start = new Date(startDate)
  const end = new Date(endDate)
  start.setHours(0, 0, 0, 0)
  end.setHours(0, 0, 0, 0)

  const dir = start <= end ? 1 : -1
  let d = start
  let count = 0
  while ((dir === 1 && d <= end) || (dir === -1 && d >= end)) {
    const day = d.getDay() // 0=Sun..6=Sat
    if (day !== 0 && day !== 6) count++
    d = addToDate(d, { days: dir })
  }
  return count
}

function parseDurationToSeconds(input: string) {
  const raw = (input ?? '').trim()
  if (!raw) return 0

  // HH:MM:SS or HH:MM
  const hms = parseTimeToHms(raw)
  if (hms) return hms.h * 3600 + hms.m * 60 + hms.s

  // MM:SS
  const ms = raw.match(/^([0-9]{1,3}):([0-9]{2})$/)
  if (ms) return Number(ms[1]) * 60 + Number(ms[2])

  // 1h 20m 30s
  const m = raw.match(/^(?:(\d+(?:\.\d+)?)\s*h)?\s*(?:(\d+(?:\.\d+)?)\s*m)?\s*(?:(\d+(?:\.\d+)?)\s*s)?$/i)
  if (m && (m[1] || m[2] || m[3])) {
    const h = safeNumber(m[1], 0)
    const mi = safeNumber(m[2], 0)
    const s = safeNumber(m[3], 0)
    return Math.round(h * 3600 + mi * 60 + s)
  }

  // plain seconds/minutes/hours
  const n = Number(raw)
  if (Number.isFinite(n)) return Math.max(0, Math.round(n))

  return 0
}

function planningAndProductivityTools(): Record<string, DateTimeToolDefinition> {
  return {
    'academic-year-planner': simpleTool({
      id: 'academic-year-planner',
      title: 'Academic Year Planner',
      description: 'Plan an academic year duration and estimate total study weeks and class days.',
      inputs: [
        { name: 'startDate', label: 'Academic Year Start Date', type: 'date' },
        { name: 'months', label: 'Duration (Months)', type: 'number', min: 1, step: 1 },
        { name: 'classDaysPerWeek', label: 'Class Days per Week', type: 'number', min: 1, max: 7, step: 1 },
        { name: 'holidays', label: 'Planned Holidays (Days)', type: 'number', min: 0, step: 1 },
      ],
      defaultAutoCalculate: true,
      calculate: (v) => {
        const start = asDate(v.startDate, 'Start Date')
        const months = clampNumber(safeNumber(v.months, 10), 1, 60)
        const classDaysPerWeek = clampNumber(safeNumber(v.classDaysPerWeek, 5), 1, 7)
        const holidays = Math.max(0, Math.floor(safeNumber(v.holidays, 0)))

        const end = addToDate(start, { months })
        const totalDays = Math.abs(calendarDayDiff(start, end))
        const weeks = totalDays / 7
        const classDays = Math.max(0, Math.floor(weeks * classDaysPerWeek) - holidays)

        return {
          results: [
            { label: 'End Date (Approx)', value: formatReadableDateTime(end) },
            { label: 'Total Duration', value: `${formatNumber(weeks, 2)} weeks` },
            { label: 'Estimated Class Days', value: classDays.toLocaleString(), unit: 'days' },
          ],
          breakdown: [
            { label: 'Start', value: formatReadableDateTime(start) },
            { label: 'Duration', value: `${months} months` },
            { label: 'Holidays', value: holidays.toLocaleString(), unit: 'days' },
          ],
        }
      },
    }),

    'vacation-planner': simpleTool({
      id: 'vacation-planner',
      title: 'Vacation Planner',
      description: 'Estimate total days, weekends, and business days for a vacation period.',
      inputs: [
        { name: 'startDate', label: 'Start Date', type: 'date' },
        { name: 'endDate', label: 'End Date', type: 'date' },
      ],
      defaultAutoCalculate: true,
      calculate: (v) => {
        const start = asDate(v.startDate, 'Start Date')
        const end = asDate(v.endDate, 'End Date')
        const totalDays = Math.abs(calendarDayDiff(start, end)) + 1
        const biz = countBusinessDays(start, end)
        const weekends = totalDays - biz
        const returnToWork = addToDate(end, { days: 1 })
        return {
          results: [
            { label: 'Total Days (Inclusive)', value: totalDays.toLocaleString(), unit: 'days' },
            { label: 'Business Days', value: biz.toLocaleString(), unit: 'days' },
            { label: 'Weekend Days', value: weekends.toLocaleString(), unit: 'days' },
            { label: 'Return to Work (Next Day)', value: formatReadableDateTime(returnToWork) },
          ],
          breakdown: [
            { label: 'Start', value: formatReadableDateTime(start) },
            { label: 'End', value: formatReadableDateTime(end) },
            { label: 'Weekend Rule', value: 'Saturday/Sunday excluded from business days.' },
          ],
        }
      },
    }),

    'weekly-time-planner': simpleTool({
      id: 'weekly-time-planner',
      title: 'Weekly Time Planner',
      description: 'Split weekly available hours across days and estimate daily time budget.',
      inputs: [
        { name: 'weeklyHours', label: 'Weekly Available Hours', type: 'number', min: 0, step: 0.25 },
        { name: 'daysPerWeek', label: 'Days per Week', type: 'number', min: 1, max: 7, step: 1 },
      ],
      defaultAutoCalculate: true,
      calculate: (v) => {
        const weeklyHours = Math.max(0, safeNumber(v.weeklyHours, 10))
        const daysPerWeek = clampNumber(safeNumber(v.daysPerWeek, 5), 1, 7)
        const dailyHours = weeklyHours / daysPerWeek
        const totalSeconds = Math.round(dailyHours * 3600)
        const parts = formatDurationPartsFromSeconds(totalSeconds)
        return {
          results: [
            { label: 'Daily Budget', value: `${parts.hours}h ${parts.minutes}m ${parts.seconds}s` },
            { label: 'Daily Hours (Decimal)', value: formatNumber(dailyHours, 2), unit: 'hours' },
          ],
          breakdown: [
            { label: 'Weekly Hours', value: formatNumber(weeklyHours, 2) },
            { label: 'Days per Week', value: String(daysPerWeek) },
          ],
        }
      },
    }),

    'daily-time-budget': simpleTool({
      id: 'daily-time-budget',
      title: 'Daily Time Budget',
      description: 'Estimate remaining time in a day after planned activities.',
      inputs: [
        { name: 'availableHours', label: 'Available Hours Today', type: 'number', min: 0, max: 24, step: 0.25 },
        { name: 'plannedMinutes', label: 'Planned Minutes (Total)', type: 'number', min: 0, step: 1 },
      ],
      defaultAutoCalculate: true,
      calculate: (v) => {
        const availableHours = clampNumber(safeNumber(v.availableHours, 16), 0, 24)
        const plannedMinutes = Math.max(0, Math.floor(safeNumber(v.plannedMinutes, 0)))
        const availableMinutes = Math.round(availableHours * 60)
        const remaining = Math.max(0, availableMinutes - plannedMinutes)
        const parts = formatDurationPartsFromSeconds(remaining * 60)
        return {
          results: [
            { label: 'Remaining Time', value: `${parts.hours}h ${parts.minutes}m ${parts.seconds}s` },
            { label: 'Remaining Minutes', value: remaining.toLocaleString(), unit: 'min' },
          ],
          breakdown: [
            { label: 'Available', value: `${availableMinutes} minutes` },
            { label: 'Planned', value: `${plannedMinutes} minutes` },
          ],
        }
      },
    }),
  }
}

function timeAnalysisTools(): Record<string, DateTimeToolDefinition> {
  const durationInput = { name: 'durations', label: 'Durations (one per line)', type: 'text', placeholder: 'Examples:\n01:20:15\n15:30\n45m\n3600' } as const

  return {
    'average-time-calculator': simpleTool({
      id: 'average-time-calculator',
      title: 'Average Time Calculator',
      description: 'Compute average duration from total time and count, or from multiple durations.',
      inputs: [
        { name: 'mode', label: 'Mode', type: 'select', options: [
          { value: 'from-list', label: 'Average from list' },
          { value: 'total-and-count', label: 'Average from total + count' },
        ] },
        durationInput,
        { name: 'totalSeconds', label: 'Total Seconds', type: 'number', min: 0, step: 1 },
        { name: 'count', label: 'Count', type: 'number', min: 1, step: 1 },
      ],
      defaultAutoCalculate: true,
      calculate: (v) => {
        const mode = String(v.mode ?? 'from-list')
        if (mode === 'total-and-count') {
          const totalSeconds = Math.max(0, Math.floor(safeNumber(v.totalSeconds, 0)))
          const count = Math.max(1, Math.floor(safeNumber(v.count, 1)))
          const avg = Math.round(totalSeconds / count)
          const parts = formatDurationPartsFromSeconds(avg)
          return {
            results: [
              { label: 'Average (HH:MM:SS)', value: formatHms(parts.hours + parts.days * 24, parts.minutes, parts.seconds) },
              { label: 'Average Seconds', value: avg.toLocaleString(), unit: 'sec' },
            ],
            breakdown: [
              { label: 'Total Seconds', value: totalSeconds.toLocaleString() },
              { label: 'Count', value: count.toLocaleString() },
            ],
          }
        }

        const lines = String(v.durations ?? '')
          .split(/\r?\n/)
          .map((s) => s.trim())
          .filter(Boolean)
        if (!lines.length) throw new Error('Enter at least one duration line (e.g., 01:20:15 or 45m).')

        const seconds = lines.map(parseDurationToSeconds).filter((n) => Number.isFinite(n) && n > 0)
        if (!seconds.length) throw new Error('Could not parse durations. Try HH:MM:SS, MM:SS, 45m, or 3600.')
        const total = seconds.reduce((a, b) => a + b, 0)
        const avg = Math.round(total / seconds.length)
        const parts = formatDurationPartsFromSeconds(avg)
        return {
          results: [
            { label: 'Average (HH:MM:SS)', value: formatHms(parts.hours + parts.days * 24, parts.minutes, parts.seconds) },
            { label: 'Average Seconds', value: avg.toLocaleString(), unit: 'sec' },
          ],
          breakdown: [
            { label: 'Entries', value: seconds.length.toLocaleString() },
            { label: 'Total Seconds', value: total.toLocaleString(), unit: 'sec' },
          ],
        }
      },
    }),

    'cumulative-time': simpleTool({
      id: 'cumulative-time',
      title: 'Cumulative Time Calculator',
      description: 'Sum multiple durations to get total time.',
      inputs: [durationInput],
      defaultAutoCalculate: true,
      calculate: (v) => {
        const lines = String(v.durations ?? '')
          .split(/\r?\n/)
          .map((s) => s.trim())
          .filter(Boolean)
        if (!lines.length) throw new Error('Enter durations (one per line).')
        const totalSeconds = lines.map(parseDurationToSeconds).reduce((a, b) => a + b, 0)
        const parts = formatDurationPartsFromSeconds(totalSeconds)
        return {
          results: [
            { label: 'Total', value: `${parts.days}d ${parts.hours}h ${parts.minutes}m ${parts.seconds}s` },
            { label: 'Total Seconds', value: totalSeconds.toLocaleString(), unit: 'sec' },
          ],
          breakdown: [{ label: 'Entries', value: lines.length.toLocaleString() }],
        }
      },
    }),

    'time-percentage': simpleTool({
      id: 'time-percentage',
      title: 'Time Percentage Calculator',
      description: 'Calculate what percentage a duration is of another duration.',
      inputs: [
        { name: 'part', label: 'Part Duration', type: 'text', placeholder: 'e.g., 45m or 01:30:00' },
        { name: 'whole', label: 'Whole Duration', type: 'text', placeholder: 'e.g., 8h or 08:00:00' },
      ],
      defaultAutoCalculate: true,
      calculate: (v) => {
        const partSec = parseDurationToSeconds(String(v.part ?? ''))
        const wholeSec = parseDurationToSeconds(String(v.whole ?? ''))
        if (wholeSec <= 0) throw new Error('Whole duration must be greater than 0.')
        const pct = (partSec / wholeSec) * 100
        return {
          results: [{ label: 'Percentage', value: `${formatNumber(pct, 2)}%` }],
          breakdown: [
            { label: 'Part', value: `${partSec.toLocaleString()} sec` },
            { label: 'Whole', value: `${wholeSec.toLocaleString()} sec` },
          ],
        }
      },
    }),

    'time-estimation': simpleTool({
      id: 'time-estimation',
      title: 'Time Estimation Calculator',
      description: 'Estimate total time from number of tasks and average duration.',
      inputs: [
        { name: 'tasks', label: 'Number of Tasks', type: 'number', min: 1, step: 1 },
        { name: 'avgMinutes', label: 'Average Minutes per Task', type: 'number', min: 0, step: 1 },
      ],
      defaultAutoCalculate: true,
      calculate: (v) => {
        const tasks = Math.max(1, Math.floor(safeNumber(v.tasks, 1)))
        const avgMinutes = Math.max(0, safeNumber(v.avgMinutes, 30))
        const totalMinutes = tasks * avgMinutes
        const totalSeconds = Math.round(totalMinutes * 60)
        const parts = formatDurationPartsFromSeconds(totalSeconds)
        return {
          results: [
            { label: 'Total Time', value: `${parts.days}d ${parts.hours}h ${parts.minutes}m ${parts.seconds}s` },
            { label: 'Total Minutes', value: formatNumber(totalMinutes, 2), unit: 'min' },
          ],
          breakdown: [
            { label: 'Tasks', value: tasks.toLocaleString() },
            { label: 'Avg Minutes', value: formatNumber(avgMinutes, 2) },
          ],
        }
      },
    }),

    'time-log-analyzer': simpleTool({
      id: 'time-log-analyzer',
      title: 'Time Log Analyzer',
      description: 'Analyze a simple time log (durations per line) to compute totals and averages.',
      inputs: [durationInput],
      defaultAutoCalculate: true,
      calculate: (v) => {
        const lines = String(v.durations ?? '')
          .split(/\r?\n/)
          .map((s) => s.trim())
          .filter(Boolean)
        if (!lines.length) throw new Error('Enter durations (one per line).')
        const secs = lines.map(parseDurationToSeconds).filter((n) => Number.isFinite(n) && n > 0)
        if (!secs.length) throw new Error('Could not parse any durations.')
        const total = secs.reduce((a, b) => a + b, 0)
        const avg = Math.round(total / secs.length)
        const min = Math.min(...secs)
        const max = Math.max(...secs)
        const fmt = (s: number) => {
          const p = formatDurationPartsFromSeconds(s)
          return `${p.days}d ${p.hours}h ${p.minutes}m ${p.seconds}s`
        }
        return {
          results: [
            { label: 'Total', value: fmt(total) },
            { label: 'Average', value: fmt(avg) },
            { label: 'Min', value: fmt(min) },
            { label: 'Max', value: fmt(max) },
          ],
          breakdown: [{ label: 'Entries', value: secs.length.toLocaleString() }],
        }
      },
    }),
  }
}

function dateMetaTools(): Record<string, DateTimeToolDefinition> {
  return {
    'fiscal-year-calculator': simpleTool({
      id: 'fiscal-year-calculator',
      title: 'Fiscal Year Calculator',
      description: 'Get fiscal year (India FY), quarter, ISO week, and day-of-year for a date.',
      inputs: [{ name: 'date', label: 'Date', type: 'date' }],
      defaultAutoCalculate: true,
      calculate: (v) => {
        const d = asDate(v.date, 'Date')
        const fy = getFiscalYearIndia(d)
        const q = getQuarter(d)
        const week = getIsoWeekNumber(d)
        const doy = getDayOfYearNumber(d)
        return {
          results: [
            { label: 'India Fiscal Year', value: `FY ${fy.startYear}-${String(fy.endYear).slice(-2)}` },
            { label: 'Quarter (Calendar)', value: `Q${q}` },
            { label: 'ISO Week', value: week.toLocaleString() },
            { label: 'Day of Year', value: doy.toLocaleString() },
          ],
          breakdown: [{ label: 'Date', value: formatReadableDateTime(d) }],
        }
      },
    }),

    'julian-date': simpleTool({
      id: 'julian-date',
      title: 'Julian Date Converter',
      description: 'Convert date/time to Julian Date (JD) and Modified Julian Date (MJD).',
      inputs: [
        { name: 'date', label: 'Date', type: 'date' },
        { name: 'time', label: 'Time', type: 'time', showSeconds: true },
      ],
      defaultAutoCalculate: true,
      calculate: (v) => {
        const dt = asDateTime(v.date, v.time ?? '00:00', 'Date', 'Time')
        const jd = dt.getTime() / 86400000 + 2440587.5
        const mjd = jd - 2400000.5
        return {
          results: [
            { label: 'Julian Date (JD)', value: formatNumber(jd, 6) },
            { label: 'Modified Julian Date (MJD)', value: formatNumber(mjd, 6) },
          ],
          breakdown: [
            { label: 'UTC ISO', value: dt.toISOString() },
            { label: 'Note', value: 'JD is based on UTC instant. Calendars before 1582 have historical nuances.' },
          ],
        }
      },
    }),

    'calendar-generator': simpleTool({
      id: 'calendar-generator',
      title: 'Calendar Generator',
      description: 'Generate a simple month calendar for any year and month.',
      inputs: [
        { name: 'year', label: 'Year', type: 'number', min: 1, step: 1 },
        { name: 'month', label: 'Month (1-12)', type: 'number', min: 1, max: 12, step: 1 },
        { name: 'weekStart', label: 'Week Starts On', type: 'select', options: [
          { value: 'sun', label: 'Sunday' },
          { value: 'mon', label: 'Monday' },
        ] },
      ],
      defaultAutoCalculate: true,
      calculate: (v) => {
        const year = Math.floor(clampNumber(safeNumber(v.year, new Date().getFullYear()), 1, 9999))
        const month = Math.floor(clampNumber(safeNumber(v.month, new Date().getMonth() + 1), 1, 12))
        const weekStart = String(v.weekStart ?? 'sun')

        const first = new Date(year, month - 1, 1)
        const last = new Date(year, month, 0)
        const daysInMonth = last.getDate()
        const startDay = first.getDay() // 0=Sun..6=Sat
        const offset = weekStart === 'mon' ? (startDay === 0 ? 6 : startDay - 1) : startDay
        const labels = weekStart === 'mon'
          ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
          : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

        const cells: string[] = []
        for (let i = 0; i < offset; i++) cells.push('  ')
        for (let d = 1; d <= daysInMonth; d++) cells.push(String(d).padStart(2, ' '))
        while (cells.length % 7 !== 0) cells.push('  ')

        const weeks: string[] = []
        for (let i = 0; i < cells.length; i += 7) {
          weeks.push(cells.slice(i, i + 7).join(' '))
        }
        const text = `${labels.join(' ')}\n${weeks.join('\n')}`

        return {
          results: [
            { label: 'Month', value: `${year}-${String(month).padStart(2, '0')}` },
            { label: 'Days in Month', value: daysInMonth.toLocaleString(), unit: 'days' },
            { label: 'Calendar', value: text },
          ],
          breakdown: [{ label: 'Week Start', value: weekStart === 'mon' ? 'Monday' : 'Sunday' }],
        }
      },
    }),
  }
}

const popularCities = [
  { city: 'New York, USA', zone: 'America/New_York', country: 'USA', abbr: 'EST/EDT' },
  { city: 'Los Angeles, USA', zone: 'America/Los_Angeles', country: 'USA', abbr: 'PST/PDT' },
  { city: 'Chicago, USA', zone: 'America/Chicago', country: 'USA', abbr: 'CST/CDT' },
  { city: 'London, UK', zone: 'Europe/London', country: 'UK', abbr: 'GMT/BST' },
  { city: 'Paris, France', zone: 'Europe/Paris', country: 'France', abbr: 'CET/CEST' },
  { city: 'Berlin, Germany', zone: 'Europe/Berlin', country: 'Germany', abbr: 'CET/CEST' },
  { city: 'Dubai, UAE', zone: 'Asia/Dubai', country: 'UAE', abbr: 'GST' },
  { city: 'Mumbai, India', zone: 'Asia/Kolkata', country: 'India', abbr: 'IST' },
  { city: 'Delhi, India', zone: 'Asia/Kolkata', country: 'India', abbr: 'IST' },
  { city: 'Tokyo, Japan', zone: 'Asia/Tokyo', country: 'Japan', abbr: 'JST' },
  { city: 'Singapore', zone: 'Asia/Singapore', country: 'Singapore', abbr: 'SGT' },
  { city: 'Hong Kong', zone: 'Asia/Hong_Kong', country: 'Hong Kong', abbr: 'HKT' },
  { city: 'Sydney, Australia', zone: 'Australia/Sydney', country: 'Australia', abbr: 'AEST/AEDT' },
  { city: 'Melbourne, Australia', zone: 'Australia/Melbourne', country: 'Australia', abbr: 'AEST/AEDT' },
  { city: 'Auckland, New Zealand', zone: 'Pacific/Auckland', country: 'New Zealand', abbr: 'NZST/NZDT' },
  { city: 'Toronto, Canada', zone: 'America/Toronto', country: 'Canada', abbr: 'EST/EDT' },
  { city: 'Vancouver, Canada', zone: 'America/Vancouver', country: 'Canada', abbr: 'PST/PDT' },
  { city: 'Beijing, China', zone: 'Asia/Shanghai', country: 'China', abbr: 'CST' },
  { city: 'Shanghai, China', zone: 'Asia/Shanghai', country: 'China', abbr: 'CST' },
  { city: 'Seoul, South Korea', zone: 'Asia/Seoul', country: 'South Korea', abbr: 'KST' },
  { city: 'Bangkok, Thailand', zone: 'Asia/Bangkok', country: 'Thailand', abbr: 'ICT' },
  { city: 'Kuala Lumpur, Malaysia', zone: 'Asia/Kuala_Lumpur', country: 'Malaysia', abbr: 'MYT' },
  { city: 'Jakarta, Indonesia', zone: 'Asia/Jakarta', country: 'Indonesia', abbr: 'WIB' },
  { city: 'Moscow, Russia', zone: 'Europe/Moscow', country: 'Russia', abbr: 'MSK' },
  { city: 'Istanbul, Turkey', zone: 'Europe/Istanbul', country: 'Turkey', abbr: 'TRT' },
  { city: 'Riyadh, Saudi Arabia', zone: 'Asia/Riyadh', country: 'Saudi Arabia', abbr: 'AST' },
  { city: 'Karachi, Pakistan', zone: 'Asia/Karachi', country: 'Pakistan', abbr: 'PKT' },
  { city: 'Cairo, Egypt', zone: 'Africa/Cairo', country: 'Egypt', abbr: 'EET' },
  { city: 'Johannesburg, South Africa', zone: 'Africa/Johannesburg', country: 'South Africa', abbr: 'SAST' },
  { city: 'São Paulo, Brazil', zone: 'America/Sao_Paulo', country: 'Brazil', abbr: 'BRT' },
  { city: 'Mexico City, Mexico', zone: 'America/Mexico_City', country: 'Mexico', abbr: 'CST/CDT' },
  { city: 'Buenos Aires, Argentina', zone: 'America/Argentina/Buenos_Aires', country: 'Argentina', abbr: 'ART' },
]

function timeZoneExtras(): Record<string, DateTimeToolDefinition> {
  const zones = listIanaTimeZones()
  // Ensure unique option values (React keys + select values must be unique).
  // Multiple cities can share a zone (e.g., Mumbai/Delhi -> Asia/Kolkata), so keep the first.
  const cityOptions = Array.from(
    new Map(popularCities.map((c) => [c.zone, { value: c.zone, label: `${c.city} (${c.abbr})` }])).values()
  )
  
  return {
    'time-zone-converter': simpleTool({
      id: 'time-zone-converter',
      title: 'Time Zone Calculator',
      description: 'Convert time between cities/countries worldwide. Compare multiple time zones, check DST, and find best meeting times.',
      inputs: [
        { name: 'inputMode', label: 'Input Mode', type: 'select', options: [
          { value: 'date-time', label: '📅 Use Date + Time' },
          { value: 'ymdhms', label: '🔢 Use Year/Month/Day + Hour/Minute/Second' },
          { value: 'current', label: '🕐 Use Current Time' },
        ] },
        { name: 'timeFormat', label: 'Time Format', type: 'select', options: [
          { value: '24h', label: '24-Hour Format' },
          { value: '12h', label: '12-Hour (AM/PM)' },
        ] },
        { name: 'date', label: 'Date', type: 'date' },
        { name: 'time', label: 'Time', type: 'time', showSeconds: true },
        { name: 'year', label: 'Year', type: 'number', min: 1, max: 9999, step: 1 },
        { name: 'month', label: 'Month', type: 'number', min: 1, max: 12, step: 1 },
        { name: 'day', label: 'Day', type: 'number', min: 1, max: 31, step: 1 },
        { name: 'hour', label: 'Hour', type: 'number', min: 0, max: 23, step: 1 },
        { name: 'minute', label: 'Minute', type: 'number', min: 0, max: 59, step: 1 },
        { name: 'second', label: 'Second', type: 'number', min: 0, max: 59, step: 1 },
        { name: 'fromCity', label: 'From City/Country', type: 'select', options: cityOptions },
        { name: 'fromZone', label: 'Or Enter Time Zone', type: 'timezone', options: zones, placeholder: 'Search or select...' },
        { name: 'toCity', label: 'To City/Country', type: 'select', options: cityOptions },
        { name: 'toZone', label: 'Or Enter Time Zone', type: 'timezone', options: zones, placeholder: 'Search or select...' },
        { name: 'compareCity1', label: '🔄 Compare City 1 (Optional)', type: 'select', options: [{ value: '', label: 'None' }, ...cityOptions] },
        { name: 'compareCity2', label: '🔄 Compare City 2 (Optional)', type: 'select', options: [{ value: '', label: 'None' }, ...cityOptions] },
      ],
      defaultAutoCalculate: true,
      calculate: (v, ctx) => {
        const mode = String(v.inputMode ?? 'date-time')
        const timeFormat = String(v.timeFormat ?? '24h')
        const is12h = timeFormat === '12h'
        
        const normalizeZone = (value: unknown, fallback: string) => {
          const s = String(value ?? '').trim()
          return s ? s : fallback
        }
        
        const fromCityZone = String(v.fromCity ?? '').trim()
        const toCityZone = String(v.toCity ?? '').trim()
        const fromZone = normalizeZone(fromCityZone || v.fromZone, 'UTC')
        const toZone = normalizeZone(toCityZone || v.toZone, 'Asia/Kolkata')
        
        const fromCityName = popularCities.find(c => c.zone === fromZone)?.city || fromZone
        const toCityName = popularCities.find(c => c.zone === toZone)?.city || toZone

        const clampInt = (value: unknown, fallback: number, min: number, max: number) =>
          Math.min(max, Math.max(min, Math.floor(safeNumber(value, fallback))))

        let y: number
        let mo: number
        let d: number
        let hh: number
        let mm: number
        let ss: number

        if (mode === 'current') {
          const now = ctx?.now ?? new Date()
          y = now.getFullYear()
          mo = now.getMonth() + 1
          d = now.getDate()
          hh = now.getHours()
          mm = now.getMinutes()
          ss = now.getSeconds()
        } else if (mode === 'ymdhms') {
          y = clampInt(v.year, new Date().getFullYear(), 1, 9999)
          mo = clampInt(v.month, new Date().getMonth() + 1, 1, 12)
          d = clampInt(v.day, new Date().getDate(), 1, 31)
          hh = clampInt(v.hour, 0, 0, 23)
          mm = clampInt(v.minute, 0, 0, 59)
          ss = clampInt(v.second, 0, 0, 59)

          // Validate actual date (e.g., 31 Feb)
          const check = new Date(y, mo - 1, d, hh, mm, ss, 0)
          if (check.getFullYear() !== y || check.getMonth() !== mo - 1 || check.getDate() !== d) {
            throw new Error('Please enter a valid Year/Month/Day combination.')
          }
        } else {
          const date = asDate(v.date, 'Date')
          const t = asTime(v.time ?? '00:00', 'Time')
          y = date.getFullYear()
          mo = date.getMonth() + 1
          d = date.getDate()
          hh = t.h
          mm = t.m
          ss = t.s
        }

        // Interpret the wall-clock date/time in the *source* time zone.
        const utcInstant = zonedWallClockToUtcInstant({
          year: y,
          month: mo,
          day: d,
          hour: hh,
          minute: mm,
          second: ss,
          timeZone: fromZone,
        })

        const fromOffset = getTimeZoneOffsetMinutes(utcInstant, fromZone)
        const toOffset = getTimeZoneOffsetMinutes(utcInstant, toZone)
        const fromAbbr = getTimeZoneAbbreviation(utcInstant, fromZone)
        const toAbbr = getTimeZoneAbbreviation(utcInstant, toZone)

        const fromText = formatInTimeZone(utcInstant, fromZone)
        const toText = formatInTimeZone(utcInstant, toZone)
        const diffMin = fromOffset != null && toOffset != null ? toOffset - fromOffset : null

        const splitParts = (instant: Date, zone: string) => {
          try {
            const parts = new Intl.DateTimeFormat('en-US', {
              timeZone: zone,
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: false,
            }).formatToParts(instant)
            const get = (type: string) => parts.find((p) => p.type === type)?.value ?? ''
            return {
              year: get('year'),
              month: get('month'),
              day: get('day'),
              hour: get('hour'),
              minute: get('minute'),
              second: get('second'),
            }
          } catch {
            return { year: '', month: '', day: '', hour: '', minute: '', second: '' }
          }
        }

        const fromSplit = splitParts(utcInstant, fromZone)
        const toSplit = splitParts(utcInstant, toZone)

        // DST detection (best-effort): compare Jan vs Jul offsets for the same zone.
        const isDst = (zone: string) => {
          try {
            const y = utcInstant.getUTCFullYear()
            const jan = new Date(Date.UTC(y, 0, 1, 12, 0, 0))
            const jul = new Date(Date.UTC(y, 6, 1, 12, 0, 0))
            const offJan = getTimeZoneOffsetMinutes(jan, zone)
            const offJul = getTimeZoneOffsetMinutes(jul, zone)
            const offNow = getTimeZoneOffsetMinutes(utcInstant, zone)
            if (offJan == null || offJul == null || offNow == null) return 'Unknown'
            if (offJan === offJul) return 'No'
            return offNow === Math.max(offJan, offJul) ? 'Yes' : 'No'
          } catch {
            return 'Unknown'
          }
        }
        
        const formatTime12h = (h: string, m: string, s: string) => {
          let hour = parseInt(h, 10)
          const ampm = hour >= 12 ? 'PM' : 'AM'
          if (hour === 0) hour = 12
          else if (hour > 12) hour -= 12
          return `${hour}:${m}:${s} ${ampm}`
        }
        
        const dayChange = (fromD: string, toD: string) => {
          const fd = parseInt(fromD, 10)
          const td = parseInt(toD, 10)
          if (td > fd) return '+1 Day'
          if (td < fd) return '-1 Day'
          return 'Same Day'
        }

        const fromTimeFormatted = is12h 
          ? formatTime12h(fromSplit.hour, fromSplit.minute, fromSplit.second)
          : `${fromSplit.hour}:${fromSplit.minute}:${fromSplit.second}`
        
        const toTimeFormatted = is12h
          ? formatTime12h(toSplit.hour, toSplit.minute, toSplit.second)
          : `${toSplit.hour}:${toSplit.minute}:${toSplit.second}`
        
        const dayIndicator = dayChange(fromSplit.day, toSplit.day)
        
        const results: any[] = [
          { label: `🌍 ${fromCityName}`, value: `${fromSplit.year}-${fromSplit.month}-${fromSplit.day} ${fromTimeFormatted}${fromAbbr ? ` (${fromAbbr})` : ''}` },
          { label: `🌍 ${toCityName}`, value: `${toSplit.year}-${toSplit.month}-${toSplit.day} ${toTimeFormatted}${toAbbr ? ` (${toAbbr})` : ''}` },
          { label: '📅 Day Change', value: dayIndicator },
          ...(diffMin == null ? [] : [
            { label: '⏱️ Time Difference', value: `${diffMin >= 0 ? '+' : ''}${formatNumber(diffMin / 60, 2)} hours` },
          ]),
        ]
        
        // Add comparison cities if selected
        const comp1Zone = String(v.compareCity1 ?? '').trim()
        const comp2Zone = String(v.compareCity2 ?? '').trim()
        
        if (comp1Zone) {
          const comp1Split = splitParts(utcInstant, comp1Zone)
          const comp1City = popularCities.find(c => c.zone === comp1Zone)?.city || comp1Zone
          const comp1Abbr = getTimeZoneAbbreviation(utcInstant, comp1Zone)
          const comp1Time = is12h
            ? formatTime12h(comp1Split.hour, comp1Split.minute, comp1Split.second)
            : `${comp1Split.hour}:${comp1Split.minute}:${comp1Split.second}`
          results.push({ label: `🔄 ${comp1City}`, value: `${comp1Split.year}-${comp1Split.month}-${comp1Split.day} ${comp1Time}${comp1Abbr ? ` (${comp1Abbr})` : ''}` })
        }
        
        if (comp2Zone) {
          const comp2Split = splitParts(utcInstant, comp2Zone)
          const comp2City = popularCities.find(c => c.zone === comp2Zone)?.city || comp2Zone
          const comp2Abbr = getTimeZoneAbbreviation(utcInstant, comp2Zone)
          const comp2Time = is12h
            ? formatTime12h(comp2Split.hour, comp2Split.minute, comp2Split.second)
            : `${comp2Split.hour}:${comp2Split.minute}:${comp2Split.second}`
          results.push({ label: `🔄 ${comp2City}`, value: `${comp2Split.year}-${comp2Split.month}-${comp2Split.day} ${comp2Time}${comp2Abbr ? ` (${comp2Abbr})` : ''}` })
        }
        
        return {
          results,
          live: mode === 'current' ? { isLive: true, refreshEveryMs: 1000 } : undefined,
          breakdown: [
            { label: '📍 From Zone', value: `${fromZone}${fromAbbr ? ` (${fromAbbr})` : ''}` },
            { label: '📍 To Zone', value: `${toZone}${toAbbr ? ` (${toAbbr})` : ''}` },
            { label: '🕐 From UTC Offset', value: fromOffset == null ? '—' : `UTC ${fromOffset >= 0 ? '+' : ''}${formatNumber(fromOffset / 60, 2)}` },
            { label: '🕐 To UTC Offset', value: toOffset == null ? '—' : `UTC ${toOffset >= 0 ? '+' : ''}${formatNumber(toOffset / 60, 2)}` },
            { label: '☀️ From DST Active?', value: isDst(fromZone) },
            { label: '☀️ To DST Active?', value: isDst(toZone) },
            { label: '🔢 Format', value: is12h ? '12-Hour (AM/PM)' : '24-Hour' },
            { label: '⏰ UTC Instant', value: utcInstant.toISOString() },
            { label: '📝 Input', value: mode === 'current' ? 'Current Time' : mode === 'ymdhms' ? 'Manual Y/M/D + H/M/S' : 'Date + Time' },
            { label: '💡 Meeting Tip', value: diffMin && Math.abs(diffMin / 60) > 6 ? 'Large time difference - consider async communication' : 'Good for live meetings' },
          ],
        }
      },
    }),

    'time-zone-map': simpleTool({
      id: 'time-zone-map',
      title: 'Time Zone Map (List)',
      description: 'Browse a curated list of IANA time zones supported by this tool set.',
      inputs: [],
      defaultAutoCalculate: true,
      calculate: () => {
        const list = zones.map((z) => z.value).join('\n')
        return {
          results: [
            { label: 'Time Zones (Curated)', value: list },
            { label: 'Count', value: zones.length.toLocaleString() },
          ],
          breakdown: [{ label: 'Note', value: 'This is a lightweight curated list to keep the app fast. More zones can be added if needed.' }],
        }
      },
    }),
  }
}

function dateEventTools(): Record<string, DateTimeToolDefinition> {
  return {
    'anniversary-calculator': simpleTool({
      id: 'anniversary-calculator',
      title: 'Anniversary Calculator',
      description: 'Calculate years since an anniversary date and the next anniversary.',
      inputs: [{ name: 'date', label: 'Anniversary Date', type: 'date' }],
      defaultAutoCalculate: true,
      calculate: (v, ctx) => {
        const d = asDate(v.date, 'Anniversary Date')
        const now = ctx.now
        const ymd = diffYmdDateOnly(d, now)
        const thisYear = new Date(now.getFullYear(), d.getMonth(), d.getDate())
        const next = thisYear >= now ? thisYear : new Date(now.getFullYear() + 1, d.getMonth(), d.getDate())
        const daysUntil = calendarDayDiff(now, next)
        return {
          results: [
            { label: 'Time Since', value: `${Math.max(0, ymd.years)}y ${Math.max(0, ymd.months)}m ${Math.max(0, ymd.days)}d` },
            { label: 'Next Anniversary', value: formatReadableDateTime(next) },
            { label: 'Days Until Next', value: Math.max(0, daysUntil).toLocaleString(), unit: 'days' },
          ],
          breakdown: [{ label: 'Original Date', value: formatReadableDateTime(d) }],
        }
      },
    }),

    'birthday-calculator': simpleTool({
      id: 'birthday-calculator',
      title: 'Birthday Calculator',
      description: 'Find your next birthday and days remaining.',
      inputs: [{ name: 'birthDate', label: 'Birth Date', type: 'date' }],
      defaultAutoCalculate: true,
      calculate: (v, ctx) => {
        const birth = asDate(v.birthDate, 'Birth Date')
        const now = ctx.now
        const thisYearBirthday = new Date(now.getFullYear(), birth.getMonth(), birth.getDate())
        const nextBirthday = thisYearBirthday >= now ? thisYearBirthday : new Date(now.getFullYear() + 1, birth.getMonth(), birth.getDate())
        const daysUntil = calendarDayDiff(now, nextBirthday)
        const years = now.getFullYear() - birth.getFullYear() - (thisYearBirthday > now ? 1 : 0)
        return {
          results: [
            { label: 'Current Age (Years)', value: Math.max(0, years).toLocaleString(), unit: 'years' },
            { label: 'Next Birthday', value: formatReadableDateTime(nextBirthday) },
            { label: 'Days Until Next', value: Math.max(0, daysUntil).toLocaleString(), unit: 'days' },
          ],
          breakdown: [{ label: 'Birth Date', value: formatReadableDateTime(birth) }],
        }
      },
    }),

    'retirement-date': simpleTool({
      id: 'retirement-date',
      title: 'Retirement Date Calculator',
      description: 'Estimate retirement date based on birth date and retirement age.',
      inputs: [
        { name: 'birthDate', label: 'Birth Date', type: 'date' },
        { name: 'retireAge', label: 'Retirement Age (Years)', type: 'number', min: 40, max: 100, step: 1 },
      ],
      defaultAutoCalculate: true,
      calculate: (v) => {
        const birth = asDate(v.birthDate, 'Birth Date')
        const retireAge = clampNumber(safeNumber(v.retireAge, 60), 40, 100)
        const retireDate = addToDate(birth, { years: retireAge })
        return {
          results: [
            { label: 'Retirement Date', value: formatReadableDateTime(retireDate) },
            { label: 'Retirement Age', value: `${retireAge} years` },
          ],
          breakdown: [{ label: 'Birth Date', value: formatReadableDateTime(birth) }],
        }
      },
    }),
  }
}

function durationBetweenTools(): Record<string, DateTimeToolDefinition> {
  const makeBetween = (id: string, title: string, description: string) =>
    simpleTool({
      id,
      title,
      description,
      inputs: [
        { name: 'startDate', label: 'Start Date', type: 'date' },
        { name: 'startTime', label: 'Start Time', type: 'time', showSeconds: true },
        { name: 'endDate', label: 'End Date', type: 'date' },
        { name: 'endTime', label: 'End Time', type: 'time', showSeconds: true },
      ],
      defaultAutoCalculate: true,
      calculate: (v) => {
        const start = asDateTime(v.startDate, v.startTime ?? '00:00', 'Start Date', 'Start Time')
        const end = asDateTime(v.endDate, v.endTime ?? '00:00', 'End Date', 'End Time')
        const sec = secondsDiff(start, end)
        const abs = Math.abs(sec)
        const parts = formatDurationPartsFromSeconds(abs)
        return {
          results: [
            { label: 'Duration', value: `${parts.days}d ${parts.hours}h ${parts.minutes}m ${parts.seconds}s` },
            { label: 'Total Seconds', value: abs.toLocaleString(), unit: 'sec' },
            { label: 'Direction', value: sec >= 0 ? 'End is after start' : 'End is before start' },
          ],
          breakdown: [
            { label: 'Start', value: formatReadableDateTime(start) },
            { label: 'End', value: formatReadableDateTime(end) },
          ],
        }
      },
    })

  return {
    'time-duration-calculator': makeBetween('time-duration-calculator', 'Time Duration Calculator', 'Calculate the duration between two date/time values.'),
    'elapsed-time': makeBetween('elapsed-time', 'Elapsed Time Calculator', 'Measure elapsed time between a start and end datetime.'),
    'time-spent-calculator': makeBetween('time-spent-calculator', 'Time Spent Calculator', 'Calculate time spent between start and end.'),
  }
}

function businessDayTools(): Record<string, DateTimeToolDefinition> {
  const make = (id: string, title: string, description: string) =>
    simpleTool({
      id,
      title,
      description,
      inputs: [
        { name: 'startDate', label: 'Start Date', type: 'date' },
        { name: 'endDate', label: 'End Date', type: 'date' },
      ],
      defaultAutoCalculate: true,
      calculate: (v) => {
        const start = asDate(v.startDate, 'Start Date')
        const end = asDate(v.endDate, 'End Date')
        const totalDays = Math.abs(calendarDayDiff(start, end)) + 1
        const businessDays = countBusinessDays(start, end)
        return {
          results: [
            { label: 'Business Days (Mon–Fri)', value: businessDays.toLocaleString(), unit: 'days' },
            { label: 'Total Days (Inclusive)', value: totalDays.toLocaleString(), unit: 'days' },
          ],
          breakdown: [
            { label: 'Weekend Rule', value: 'Saturday/Sunday excluded.' },
            { label: 'Start', value: formatReadableDateTime(start) },
            { label: 'End', value: formatReadableDateTime(end) },
          ],
        }
      },
    })

  return {
    'business-days-calculator': make('business-days-calculator', 'Business Days Calculator', 'Count business days between two dates.'),
    'working-days-counter': make('working-days-counter', 'Working Days Counter', 'Count working days between two dates.'),
  }
}

function meetingTools(): Record<string, DateTimeToolDefinition> {
  const zones = listIanaTimeZones()
  return {
    'meeting-scheduler': simpleTool({
      id: 'meeting-scheduler',
      title: 'Meeting Scheduler',
      description: 'Schedule a meeting and view it in multiple time zones (formatting view).',
      inputs: [
        { name: 'date', label: 'Meeting Date', type: 'date' },
        { name: 'time', label: 'Meeting Time', type: 'time', showSeconds: true },
        { name: 'baseZone', label: 'Base Time Zone', type: 'timezone', options: zones },
        { name: 'otherZones', label: 'Other Time Zones (comma-separated)', type: 'text', placeholder: 'e.g., Europe/London, America/New_York' },
        { name: 'durationMinutes', label: 'Duration (Minutes)', type: 'number', min: 0, step: 1 },
      ],
      defaultAutoCalculate: true,
      calculate: (v) => {
        const dt = asDateTime(v.date, v.time ?? '00:00', 'Date', 'Time')
        const baseZone = String(v.baseZone ?? 'UTC')
        const otherZones = String(v.otherZones ?? '')
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
        const durationMinutes = Math.max(0, Math.floor(safeNumber(v.durationMinutes, 30)))
        const end = addToDate(dt, { days: 0 })
        end.setSeconds(end.getSeconds() + durationMinutes * 60)

        const results = [
          { label: `Start (${baseZone})`, value: formatInTimeZone(dt, baseZone) },
          { label: `End (${baseZone})`, value: formatInTimeZone(end, baseZone) },
        ]
        for (const z of otherZones) {
          results.push({ label: `Start (${z})`, value: formatInTimeZone(dt, z) })
        }

        return {
          results,
          breakdown: [
            { label: 'Duration', value: `${durationMinutes} minutes` },
            { label: 'Note', value: 'This shows the same instant formatted across zones. Interpreting the input as baseZone requires timezone parsing.' },
          ],
        }
      },
    }),

    'international-meeting-time': simpleTool({
      id: 'international-meeting-time',
      title: 'International Meeting Time',
      description: 'View the same meeting time across multiple time zones.',
      inputs: [
        { name: 'date', label: 'Date', type: 'date' },
        { name: 'time', label: 'Time', type: 'time', showSeconds: true },
        { name: 'zones', label: 'Time Zones (comma-separated)', type: 'text', placeholder: 'UTC, Asia/Kolkata, Europe/London' },
      ],
      defaultAutoCalculate: true,
      calculate: (v) => {
        const dt = asDateTime(v.date, v.time ?? '00:00', 'Date', 'Time')
        const zonesRaw = String(v.zones ?? 'UTC, Asia/Kolkata, Europe/London')
        const zonesList = zonesRaw.split(',').map((s) => s.trim()).filter(Boolean)
        const results = zonesList.map((z) => ({ label: z, value: formatInTimeZone(dt, z) }))
        return {
          results,
          breakdown: [{ label: 'Instant', value: dt.toISOString() }],
        }
      },
    }),
  }
}

const ALL_DATETIME_TOOL_IDS = [
  'academic-year-planner',
  'age-calculator',
  'anniversary-calculator',
  'anniversary-reminder',
  'average-time-calculator',
  'birthday-calculator',
  'business-days-calculator',
  'calendar-generator',
  'century-calculator',
  'chinese-calendar',
  'chinese-zodiac',
  'countdown-calculator',
  'cumulative-time',
  'daily-time-budget',
  'date-add-subtract',
  'date-calculator',
  'date-difference',
  'days-between-dates',
  'days-of-life',
  'days-since-calculator',
  'days-until-calculator',
  'deadline-tracker',
  'decade-calculator',
  'decimal-time-converter',
  'dst-calculator',
  'elapsed-time',
  'equinox-solstice',
  'era-converter',
  'exam-countdown',
  'fiscal-year-calculator',
  'fitness-streak',
  'gmt-converter',
  'golden-hour-calculator',
  'habit-tracker',
  'hebrew-calendar',
  'hijri-calendar',
  'historical-event-age',
  'hours-to-minutes',
  'international-meeting-time',
  'ist-to-utc',
  'job-tenure-calculator',
  'julian-date',
  'leap-year-calculator',
  'lunar-calendar',
  'meeting-scheduler',
  'memorial-date',
  'milestone-tracker',
  'military-time-converter',
  'minutes-to-hours',
  'months-to-days',
  'moon-phase-calculator',
  'nth-day-calculator',
  'planet-position',
  'quarter-calculator',
  'relationship-duration',
  'remaining-time',
  'retirement-date',
  'seconds-converter',
  'sidereal-time',
  'smoke-free-calculator',
  'sobriety-calculator',
  'solar-eclipse-calculator',
  'sunrise-sunset',
  'time-duration-calculator',
  'time-estimation',
  'time-log-analyzer',
  'time-percentage',
  'time-spent-calculator',
  'time-zone-converter',
  'time-zone-difference',
  'time-zone-map',
  'unix-timestamp-converter',
  'utc-to-local',
  'vacation-planner',
  'vedic-panchang',
  'wedding-countdown',
  'week-number-calculator',
  'weekday-calculator',
  'weekly-time-planner',
  'weeks-to-days',
  'working-days-counter',
  'world-clock',
  'zodiac-sign-calculator',
]

const core: Record<string, DateTimeToolDefinition> = {
  ...unitConversionTools(),
  ...timeFormatTools(),
  ...dateDiffTools(),
  ...dateAddSubtractTools(),
  'age-calculator': ageTool(),
  'unix-timestamp-converter': unixTimestampTool(),
  ...timezoneTools(),
  ...timeZoneExtras(),
  ...calendarIntlTools(),
  ...dateMetaTools(),
  ...simpleCountdownTools(),
  ...specialDateStreakTools(),
  ...planningAndProductivityTools(),
  ...timeAnalysisTools(),
  ...durationBetweenTools(),
  ...businessDayTools(),
  ...meetingTools(),
  ...dateEventTools(),
  ...historicalSimpleTools(),
  ...astronomyTools(),
}

const coreWithPlaceholders: Record<string, DateTimeToolDefinition> = {
  ...core,
  ...placeholdersForRemainingIds(ALL_DATETIME_TOOL_IDS.filter((id) => !core[id])),
}

export const datetimeToolDefinitions: Record<string, DateTimeToolDefinition> = coreWithPlaceholders

export function getDateTimeToolDefinitionOrNull(id: string): DateTimeToolDefinition | null {
  return datetimeToolDefinitions[id] ?? null
}

// Expose helper for astronomy-driven tools (used by UI to enhance results when astronomy is available)
export { loadAstronomy }
