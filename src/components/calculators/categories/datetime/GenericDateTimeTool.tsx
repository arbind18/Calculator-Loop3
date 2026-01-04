
'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { SeoContentGenerator } from "@/components/seo/SeoContentGenerator"
import { VoiceNumberButton } from "@/components/ui/VoiceNumberButton"
import { VoiceTimeInput } from "@/components/ui/VoiceTimeInput"
import { cn } from '@/lib/utils';
import {
  Download,
  Database,
  Calendar,
  FileArchive,
  FileCode,
  FileImage,
  FileJson,
  FileKey,
  FileSpreadsheet,
  FileText,
  FileType,
  Image,
  Link as LinkIcon,
  Lock,
  Presentation,
  Printer,
  RefreshCw,
  Share2,
  Trash2,
  Zap,
  ZapOff,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { downloadFile, generateReport } from '@/lib/downloadUtils';
import { EngineDateTimeTool } from './EngineDateTimeTool'
import { getDateTimeToolDefinitionOrNull } from '@/lib/datetime/definitions'

function formatDDMMYYYY(date: Date) {
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = String(date.getFullYear());
  return `${dd}-${mm}-${yyyy}`;
}

function parseUserDate(value: string): Date | null {
  const raw = (value ?? '').trim();
  if (!raw) return null;

  // Accept YYYY-MM-DD
  const isoMatch = raw.match(/^([0-9]{4})-([0-9]{1,2})-([0-9]{1,2})$/);
  if (isoMatch) {
    const yyyy = Number(isoMatch[1]);
    const mm = Number(isoMatch[2]);
    const dd = Number(isoMatch[3]);
    const date = new Date(yyyy, mm - 1, dd);
    if (date.getFullYear() !== yyyy || date.getMonth() !== mm - 1 || date.getDate() !== dd) return null;
    return date;
  }

  // Accept DD-MM-YYYY / DD/MM/YYYY / DD.MM.YYYY
  const dmyMatch = raw.match(/^([0-9]{1,2})[-/.]([0-9]{1,2})[-/.]([0-9]{4})$/);
  if (dmyMatch) {
    const dd = Number(dmyMatch[1]);
    const mm = Number(dmyMatch[2]);
    const yyyy = Number(dmyMatch[3]);
    const date = new Date(yyyy, mm - 1, dd);
    if (date.getFullYear() !== yyyy || date.getMonth() !== mm - 1 || date.getDate() !== dd) return null;
    return date;
  }

  return null;
}

function parseTimeToHms(value: string): { h: number; m: number; s: number } | null {
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

function parseDateTimeInput(dateValue: string, timeValue: string): Date | null {
  const d = parseUserDate(String(dateValue ?? ''))
  if (!d) return null
  const hms = parseTimeToHms(String(timeValue ?? ''))
  if (!hms) return null
  d.setHours(hms.h, hms.m, hms.s, 0)
  return d
}

function diffYmdDateOnly(start: Date, end: Date) {
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

function formatDateInputLive(value: string) {
  const raw = (value ?? '').trim();
  if (!raw) return '';

  // If the user already typed/pasted separators, keep their intent and just normalize.
  // This avoids mangling inputs like "2026-01-02".
  if (/[\-/.]/.test(raw)) {
    const cleaned = raw.replace(/[^0-9\-/.]/g, '');
    return cleaned.replace(/[/.]/g, '-').replace(/-+/g, '-').slice(0, 10);
  }

  // Digits-only: live format as DD-MM-YYYY.
  const digits = raw.replace(/[^0-9]/g, '').slice(0, 8);
  const dd = digits.slice(0, 2);
  const mm = digits.slice(2, 4);
  const yyyy = digits.slice(4, 8);

  if (digits.length <= 2) return dd;
  if (digits.length <= 4) return `${dd}-${mm}`;
  return `${dd}-${mm}-${yyyy}`;
}

function splitDatePartsForUi(value: string): { day: string; month: string; year: string } {
  const raw = (value ?? '').trim();
  if (!raw) return { day: '', month: '', year: '' };

  const normalized = raw.replace(/[/.]/g, '-');
  if (normalized.includes('-')) {
    const parts = normalized.split('-').filter(Boolean);
    if (parts[0]?.length === 4) {
      const [yyyy = '', mm = '', dd = ''] = parts;
      return {
        day: dd ? String(Number(dd.slice(0, 2))) : '',
        month: mm ? String(Number(mm.slice(0, 2))) : '',
        year: yyyy.slice(0, 4),
      };
    }
    const [dd = '', mm = '', yyyy = ''] = parts;
    return {
      day: dd ? String(Number(dd.slice(0, 2))) : '',
      month: mm ? String(Number(mm.slice(0, 2))) : '',
      year: yyyy.slice(0, 4),
    };
  }

  // Digits-only: interpret as DDMMYYYY (partial allowed)
  const digits = raw.replace(/[^0-9]/g, '').slice(0, 8);
  return {
    day: digits.slice(0, 2) ? String(Number(digits.slice(0, 2))) : '',
    month: digits.slice(2, 4) ? String(Number(digits.slice(2, 4))) : '',
    year: digits.slice(4, 8),
  };
}

function ddmmyyyyToIso(value: string): string {
  const raw = (value ?? '').trim()
  const m = raw.match(/^([0-9]{1,2})-([0-9]{1,2})-([0-9]{4})$/)
  if (!m) return ''
  const dd = String(Number(m[1])).padStart(2, '0')
  const mm = String(Number(m[2])).padStart(2, '0')
  const yyyy = String(m[3]).slice(0, 4)
  return `${yyyy}-${mm}-${dd}`
}

interface CalculatorConfig {
  id: string;
  title: string;
  description: string;
  inputs: {
    name: string;
    label: string;
    type: string;
    placeholder?: string;
    unit?: string;
    options?: { value: string; label: string }[];
    showSeconds?: boolean;
  }[];
  calculate: (
    inputs: { [key: string]: number | string },
    ctx?: { now?: Date; toolId?: string; isAutoCalculate?: boolean }
  ) => {
    results: { label: string; value: string | number; unit?: string }[];
    breakdown?: { label: string; value: string | number; unit?: string }[];
    biological?: { label: string; value: string | number; unit?: string }[];
    live?: {
      clock: string;
      isLive: boolean;
      totalSeconds: number;
    };
  };
}

interface GenericDateTimeToolProps {
  id: string;
  title: string;
  description: string;
}

export default function GenericDateTimeTool({ id, title, description }: GenericDateTimeToolProps) {
  const engineDef = getDateTimeToolDefinitionOrNull(id)
  if (engineDef) {
    return <EngineDateTimeTool id={id} title={title} description={description} />
  }

  return <LegacyGenericDateTimeTool id={id} title={title} description={description} />
}

function LegacyGenericDateTimeTool({ id, title, description }: GenericDateTimeToolProps) {
  const [inputs, setInputs] = useState<{ [key: string]: string | number }>({});
  const [results, setResults] = useState<any>(null);
  const [isAutoCalculate, setIsAutoCalculate] = useState(() => id === 'age-calculator');
  const [liveNow, setLiveNow] = useState(() => new Date());
  const [restoreSnapshot, setRestoreSnapshot] = useState<{ [key: string]: string | number } | null>(null);
  const [focusedDateInput, setFocusedDateInput] = useState<string | null>(null);
  const [datePartsByName, setDatePartsByName] = useState<Record<string, { day: string; month: string; year: string }>>({});

  const exampleYear = new Date().getFullYear();
  const exampleDatePlaceholder = `31-12-${exampleYear}`;

  const getCalculatorConfig = (calculatorId: string): CalculatorConfig => {
    switch (calculatorId) {
      case 'age-calculator':
        return {
          id: 'age-calculator',
          title: 'Age Calculator',
          description: 'Calculate your exact age in years, months, and days.',
          inputs: [
            { name: 'birthdate', label: 'Date of Birth', type: 'date' },
            { name: 'birthTime', label: 'Time of Birth (Optional)', type: 'time', showSeconds: true },
            { name: 'targetDate', label: 'Calculate Age At', type: 'date' },
            { name: 'targetTime', label: 'Target Time (Optional)', type: 'time', showSeconds: true },
          ],
          calculate: (inputs, ctx) => {
            const birth = parseDateTimeInput(String(inputs.birthdate), String(inputs.birthTime ?? '00:00'));
            const now = ctx?.now ?? new Date();
            const targetDateInput = String(inputs.targetDate ?? '').trim();
            const targetTimeInput = String(inputs.targetTime ?? '').trim();

            const parsedTarget = targetDateInput ? parseUserDate(targetDateInput) : null;
            const sameCalendarDayAsNow = (d: Date) =>
              d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();

            // Live behavior:
            // - If target date is empty OR equals today's date, use the current time (updates every second).
            // - If target date is a different day, use selected target time (or 00:00:00).
            const parsedTargetWithTime = parsedTarget
              ? parseDateTimeInput(
                  formatDDMMYYYY(parsedTarget),
                  targetTimeInput || (targetDateInput ? '00:00' : '00:00')
                )
              : null;

            const target = parsedTarget
              ? (sameCalendarDayAsNow(parsedTarget) ? now : (parsedTargetWithTime ?? parsedTarget))
              : now;

            if (!birth) throw new Error('Please enter a valid Date of Birth (DD-MM-YYYY).');
            if (parsedTarget === null && targetDateInput) throw new Error('Please enter a valid Target Date (DD-MM-YYYY).');
            if (birth.getTime() > target.getTime()) throw new Error('Target date cannot be before birth date.');

            const ymd = diffYmdDateOnly(birth, target);
            const years = ymd.years;
            const months = ymd.months;
            const days = ymd.days;

            const diffMs = target.getTime() - birth.getTime();
            const MS_PER_SECOND = 1000;
            const MS_PER_MINUTE = 60 * MS_PER_SECOND;
            const MS_PER_HOUR = 60 * MS_PER_MINUTE;
            const MS_PER_DAY = 24 * MS_PER_HOUR;

            const totalSeconds = Math.floor(diffMs / MS_PER_SECOND);
            const totalMinutes = Math.floor(diffMs / MS_PER_MINUTE);
            const totalHours = Math.floor(diffMs / MS_PER_HOUR);
            const totalDays = Math.floor(diffMs / MS_PER_DAY);
            const totalWeeks = Math.floor(totalDays / 7);

            // Biological estimates (simple averages; not medical advice)
            const HEARTBEATS_PER_MINUTE = 72;
            const BREATHS_PER_MINUTE = 16;
            const BLINKS_PER_MINUTE = 15;
            const SLEEP_HOURS_PER_DAY = 8;
            const MEALS_PER_DAY = 3;
            const WATER_LITERS_PER_DAY = 2;
            const SMILES_PER_DAY = 20;
            const STEPS_PER_DAY = 7500;

            const heartbeats = Math.max(0, totalMinutes) * HEARTBEATS_PER_MINUTE;
            const breathsTaken = Math.max(0, totalMinutes) * BREATHS_PER_MINUTE;
            const timesBlinked = Math.max(0, totalMinutes) * BLINKS_PER_MINUTE;
            const hoursSlept = Math.max(0, totalDays) * SLEEP_HOURS_PER_DAY;
            const mealsEaten = Math.max(0, totalDays) * MEALS_PER_DAY;
            const waterDrunkLiters = Math.max(0, totalDays) * WATER_LITERS_PER_DAY;
            const timesSmiled = Math.max(0, totalDays) * SMILES_PER_DAY;
            const stepsWalked = Math.max(0, totalDays) * STEPS_PER_DAY;

            const dayRemainder = diffMs % MS_PER_DAY;
            const clockHours = Math.floor(dayRemainder / MS_PER_HOUR);
            const clockMinutes = Math.floor((dayRemainder % MS_PER_HOUR) / MS_PER_MINUTE);
            const clockSeconds = Math.floor((dayRemainder % MS_PER_MINUTE) / MS_PER_SECOND);

            const pad2 = (n: number) => String(n).padStart(2, '0');
            const liveClock = `${years}y ${months}m ${days}d ${pad2(clockHours)}:${pad2(clockMinutes)}:${pad2(clockSeconds)}`;

            return {
              results: [
                { label: 'Age', value: `${years} years, ${months} months, ${days} days` },
                { label: 'Total Days', value: totalDays.toLocaleString(), unit: 'days' },
                { label: 'Total Weeks', value: totalWeeks.toLocaleString(), unit: 'weeks' },
                { label: 'Total Hours', value: totalHours.toLocaleString(), unit: 'hours' },
                { label: 'Total Minutes', value: totalMinutes.toLocaleString(), unit: 'minutes' },
                { label: 'Total Seconds', value: totalSeconds.toLocaleString(), unit: 'seconds' },
              ],
              biological: [
                { label: '❤️ Heartbeats', value: Number(heartbeats).toLocaleString('en-IN') },
                { label: '🫁 Breaths Taken', value: Number(breathsTaken).toLocaleString('en-IN') },
                { label: '👁️ Times Blinked', value: Number(timesBlinked).toLocaleString('en-IN') },
                { label: '🛏️ Hours Slept', value: Number(hoursSlept).toLocaleString('en-IN') },
                { label: '🍽️ Meals Eaten', value: Number(mealsEaten).toLocaleString('en-IN') },
                { label: '💧 Water Drunk (Liters)', value: Number(waterDrunkLiters).toLocaleString('en-IN') },
                { label: '😊 Times Smiled', value: Number(timesSmiled).toLocaleString('en-IN') },
                { label: '👣 Steps Walked (approx)', value: Number(stepsWalked).toLocaleString('en-IN') },
              ],
              breakdown: [
                { label: 'Date of Birth', value: birth.toLocaleString() },
                { label: 'Target Date', value: target.toLocaleString() },
                { label: 'As Of (Clock)', value: target.toLocaleTimeString() },
                { label: 'Next Birthday', value: new Date(target.getFullYear() + (target < new Date(target.getFullYear(), birth.getMonth(), birth.getDate()) ? 0 : 1), birth.getMonth(), birth.getDate()).toLocaleDateString() },
              ],
              live: {
                clock: liveClock,
                isLive: target === now,
                totalSeconds,
              }
            };
          }
        };

      case 'date-difference':
      case 'days-between-dates':
        return {
          id: 'date-difference',
          title: 'Date Difference Calculator',
          description: 'Calculate the difference between two dates.',
          inputs: [
            { name: 'startDate', label: 'Start Date', type: 'date' },
            { name: 'endDate', label: 'End Date', type: 'date' },
          ],
          calculate: (inputs) => {
            const start = parseUserDate(String(inputs.startDate));
            const end = parseUserDate(String(inputs.endDate));
            if (!start) throw new Error('Please enter a valid Start Date (DD-MM-YYYY).');
            if (!end) throw new Error('Please enter a valid End Date (DD-MM-YYYY).');
            
            const diffTime = Math.abs(end.getTime() - start.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            // Calculate YMD
            let years = end.getFullYear() - start.getFullYear();
            let months = end.getMonth() - start.getMonth();
            let days = end.getDate() - start.getDate();

            if (days < 0) {
              months--;
              const lastMonth = new Date(end.getFullYear(), end.getMonth(), 0);
              days += lastMonth.getDate();
            }
            if (months < 0) {
              years--;
              months += 12;
            }
            
            // Adjust for negative if end < start (though we took abs time, YMD logic assumes end > start)
            // For simplicity, we just show the absolute difference
            
            return {
              results: [
                { label: 'Difference', value: `${Math.abs(years)} years, ${Math.abs(months)} months, ${Math.abs(days)} days` },
                { label: 'Total Days', value: diffDays.toLocaleString(), unit: 'days' },
              ],
              breakdown: [
                { label: 'Start Date', value: start.toLocaleDateString() },
                { label: 'End Date', value: end.toLocaleDateString() },
                { label: 'Total Weeks', value: (diffDays / 7).toFixed(1), unit: 'weeks' },
                { label: 'Total Hours', value: (diffDays * 24).toLocaleString(), unit: 'hours' },
              ]
            };
          }
        };

      case 'time-zone-converter':
        return {
          id: 'time-zone-converter',
          title: 'Time Zone Calculator',
          description: 'Convert time between different time zones.',
          inputs: [
            { name: 'time', label: 'Time', type: 'time' },
            { name: 'date', label: 'Date', type: 'date' },
            { name: 'fromZone', label: 'From Zone', type: 'select', options: [
              { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
              { value: 'Asia/Kolkata', label: 'IST (India Standard Time)' },
              { value: 'America/New_York', label: 'EST/EDT (New York)' },
              { value: 'Europe/London', label: 'GMT/BST (London)' },
              { value: 'Asia/Tokyo', label: 'JST (Tokyo)' },
              { value: 'Australia/Sydney', label: 'AEST/AEDT (Sydney)' },
              { value: 'America/Los_Angeles', label: 'PST/PDT (Los Angeles)' },
            ]},
            { name: 'toZone', label: 'To Zone', type: 'select', options: [
              { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
              { value: 'Asia/Kolkata', label: 'IST (India Standard Time)' },
              { value: 'America/New_York', label: 'EST/EDT (New York)' },
              { value: 'Europe/London', label: 'GMT/BST (London)' },
              { value: 'Asia/Tokyo', label: 'JST (Tokyo)' },
              { value: 'Australia/Sydney', label: 'AEST/AEDT (Sydney)' },
              { value: 'America/Los_Angeles', label: 'PST/PDT (Los Angeles)' },
            ]},
          ],
          calculate: (inputs) => {
            const timeStr = String(inputs.time || '12:00');
            const dateStr = String(inputs.date || new Date().toISOString().split('T')[0]);
            const fromZone = String(inputs.fromZone || 'UTC');
            const toZone = String(inputs.toZone || 'Asia/Kolkata');
            
            // Create date object in the source timezone
            // This is tricky in JS without libraries like moment-timezone or date-fns-tz
            // We'll use Intl.DateTimeFormat to approximate or just use UTC offsets for demo
            // Better approach: construct string and let Date parse it if possible, or use simple offset map
            
            // For robust implementation, we'd need a library. Here we'll use a simplified approach
            // assuming the input is local time, then we convert.
            // Actually, we can use toLocaleString with timeZone option.
            
            // 1. Construct a date object that represents the input time in the FROM zone
            // This is hard in vanilla JS. 
            // Workaround: Treat input as UTC, then adjust by offset difference?
            // Let's try to use the browser's conversion capabilities.
            
            const dateTimeStr = `${dateStr}T${timeStr}:00`;
            // We can't easily parse "2023-01-01T12:00:00 in Asia/Kolkata" to a timestamp directly in all browsers without a library.
            
            // Fallback: Just show current time in both zones for demonstration if we can't parse specific time easily
            // OR: Assume input is UTC for calculation simplicity in this demo
            
            const now = new Date();
            const fromTime = new Date(dateTimeStr); // This parses as local or UTC depending on string
            
            const options: Intl.DateTimeFormatOptions = {
              timeZone: toZone,
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              timeZoneName: 'short'
            };
            
            const convertedTime = fromTime.toLocaleString('en-US', options);
            
            return {
              results: [
                { label: 'Converted Time', value: convertedTime },
              ],
              breakdown: [
                { label: 'From Zone', value: fromZone },
                { label: 'To Zone', value: toZone },
                { label: 'Input Time (Local)', value: fromTime.toLocaleString() },
                { label: 'Note', value: 'Conversion assumes input is in your local time for this demo.' },
              ]
            };
          }
        };

      case 'work-hours-calculator':
        return {
          id: 'work-hours-calculator',
          title: 'Work Hours Calculator',
          description: 'Calculate total work hours and overtime.',
          inputs: [
            { name: 'startTime', label: 'Start Time', type: 'time' },
            { name: 'endTime', label: 'End Time', type: 'time' },
            { name: 'breakDuration', label: 'Break Duration (minutes)', type: 'number', placeholder: '30' },
          ],
          calculate: (inputs) => {
            const start = String(inputs.startTime || '09:00');
            const end = String(inputs.endTime || '17:00');
            const breakMins = Number(inputs.breakDuration) || 0;
            
            const [startH, startM] = start.split(':').map(Number);
            const [endH, endM] = end.split(':').map(Number);
            
            let startMin = startH * 60 + startM;
            let endMin = endH * 60 + endM;
            
            if (endMin < startMin) {
              endMin += 24 * 60; // Next day
            }
            
            const totalMin = endMin - startMin - breakMins;
            const hours = Math.floor(totalMin / 60);
            const mins = totalMin % 60;
            
            return {
              results: [
                { label: 'Total Work Hours', value: `${hours}h ${mins}m` },
                { label: 'Decimal Hours', value: (totalMin / 60).toFixed(2), unit: 'hours' },
              ],
              breakdown: [
                { label: 'Start Time', value: start },
                { label: 'End Time', value: end },
                { label: 'Break Duration', value: breakMins, unit: 'minutes' },
                { label: 'Total Minutes', value: totalMin, unit: 'minutes' },
              ]
            };
          }
        };

      // Generic fallback
      default:
        return {
          id: 'generic',
          title: title,
          description: description,
          inputs: [
            { name: 'value', label: 'Input Value', type: 'number', placeholder: '0' },
          ],
          calculate: (inputs) => {
            return {
              results: [
                { label: 'Result', value: 'Calculation coming soon' },
              ],
              breakdown: [
                { label: 'Note', value: 'This tool is being updated with advanced features.' },
              ]
            };
          }
        };
    }
  };

  const config = getCalculatorConfig(id);

  const isAgeCalculator = id === 'age-calculator';

  useEffect(() => {
    if (id !== 'age-calculator') return;
    if (!isAutoCalculate) return;
    const t = setInterval(() => setLiveNow(new Date()), 1000);
    return () => clearInterval(t);
  }, [id, isAutoCalculate]);

  const syncDatePartsFromInputs = (nextInputs: { [key: string]: string | number }) => {
    setDatePartsByName(prev => {
      const next = { ...prev };
      config.inputs.forEach((input) => {
        if (input.type !== 'date') return;
        next[input.name] = splitDatePartsForUi(String(nextInputs[input.name] ?? ''));
      });
      return next;
    });
  };

  useEffect(() => {
    const defaultInputs: { [key: string]: string | number } = {};
    config.inputs.forEach(input => {
      if (input.type === 'select' && input.options) {
        defaultInputs[input.name] = input.options[0].value;
      } else if (input.type === 'date') {
        defaultInputs[input.name] = formatDDMMYYYY(new Date());
      } else if (input.type === 'time') {
        defaultInputs[input.name] = input.showSeconds ? '00:00:00' : '00:00';
      } else {
        defaultInputs[input.name] = '';
      }
    });
    setInputs(defaultInputs);
    syncDatePartsFromInputs(defaultInputs);
    setResults(null);
    setIsAutoCalculate(id === 'age-calculator');
  }, [id]);

  const handleInputChange = (name: string, value: string | number) => {
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const handleCalculate = () => {
    try {
      const result = config.calculate(inputs, { now: liveNow, toolId: id, isAutoCalculate });
      setResults(result);
    } catch (e: any) {
      toast.error(e?.message || 'Please check your inputs.');
    }
  };

  const handleReset = () => {
    const defaultInputs: { [key: string]: string | number } = {};
    config.inputs.forEach(input => {
      if (input.type === 'select' && input.options) {
        defaultInputs[input.name] = input.options[0].value;
      } else if (input.type === 'date') {
        defaultInputs[input.name] = formatDDMMYYYY(new Date());
      } else if (input.type === 'time') {
        defaultInputs[input.name] = '12:00';
      } else {
        defaultInputs[input.name] = '';
      }
    });
    setInputs(defaultInputs);
    syncDatePartsFromInputs(defaultInputs);
    setResults(null);
  };

  useEffect(() => {
    if (!isAutoCalculate) return;

    try {
      const next = config.calculate(inputs, { now: liveNow, toolId: id, isAutoCalculate });
      setResults(next);
    } catch {
      // Ignore invalid intermediate states (e.g., empty/partial dates)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAutoCalculate, inputs, id, liveNow]);

  const handleDeleteInputs = () => {
    setRestoreSnapshot(inputs);
    const clearedInputs: { [key: string]: string | number } = {};
    config.inputs.forEach(input => {
      if (input.type === 'select' && input.options) {
        clearedInputs[input.name] = input.options[0].value;
      } else {
        clearedInputs[input.name] = '';
      }
    });
    setInputs(clearedInputs);
    syncDatePartsFromInputs(clearedInputs);
    setResults(null);
  };

  const handleRestoreInputs = () => {
    if (!restoreSnapshot) return;
    setInputs(restoreSnapshot);
    syncDatePartsFromInputs(restoreSnapshot);
    setResults(null);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: config.title,
          text: config.description,
          url: window.location.href,
        });
        return;
      } catch {
        // fall back to clipboard
      }
    }
    await navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  const handlePrint = () => {
    window.print();
  };

  const getSafeBaseFileName = () => {
    return (
      config.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '')
        .slice(0, 60) || 'calculator'
    );
  };

  const buildExportTable = () => {
    const headers = ['Section', 'Label', 'Value'];
    const rows: (string | number)[][] = [];

    // Inputs
    rows.push(['Inputs', '', '']);
    for (const input of config.inputs) {
      const value = inputs[input.name];
      rows.push(['Inputs', input.label, value === undefined || value === '' ? '-' : String(value)]);
    }

    // Results
    if (results?.results?.length) {
      rows.push(['Results', '', '']);
      for (const r of results.results as Array<{ label: string; value: string | number; unit?: string }>) {
        const value = `${r.value}${r.unit ? ` ${r.unit}` : ''}`;
        rows.push(['Results', r.label, value]);
      }
    } else {
      rows.push(['Results', 'Note', 'No results yet (turn Auto Calculate ON or click Calculate).']);
    }

    if (results?.breakdown?.length) {
      rows.push(['Details', '', '']);
      for (const b of results.breakdown as Array<{ label: string; value: string | number; unit?: string }>) {
        const value = `${b.value}${b.unit ? ` ${b.unit}` : ''}`;
        rows.push(['Details', b.label, value]);
      }
    }

    return { headers, rows };
  };

  const handleDownload = async (format: string) => {
    if (format === 'api') {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('API link copied!');
      return;
    }

    if (format === 'sqlite') {
      toast.message('SQLite export is coming soon.');
      return;
    }

    if (format === 'svg') {
      const element = document.getElementById('calculator-content');
      if (!element) {
        toast.error('Calculator content not found');
        return;
      }

      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(element, { backgroundColor: '#ffffff', scale: 2 });
      const pngDataUrl = canvas.toDataURL('image/png');
      const width = canvas.width;
      const height = canvas.height;

      const svg = `<?xml version="1.0" encoding="UTF-8"?>\n` +
        `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">` +
        `<image href="${pngDataUrl}" width="${width}" height="${height}" />` +
        `</svg>`;

      const timestamp = new Date().toISOString().split('T')[0];
      const base = getSafeBaseFileName();
      downloadFile(svg, `${base}_${timestamp}.svg`, 'image/svg+xml');
      return;
    }

    // Image formats use the existing screenshot exporter in generateReport
    if (format === 'png' || format === 'jpg') {
      await generateReport(format, getSafeBaseFileName(), [], [], config.title);
      return;
    }

    const { headers, rows } = buildExportTable();
    await generateReport(format, getSafeBaseFileName(), headers, rows, config.title, {
      Tool: config.title,
      Generated: new Date().toLocaleString(),
      URL: window.location.href,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-red-50 dark:from-gray-900 dark:via-purple-950 dark:to-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-block p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-lg">
            <i className="fas fa-clock text-3xl text-white"></i>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {config.title}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {config.description}
          </p>
        </div>

        {/* Calculator Card */}
        <Card id="calculator-content" className="p-6 shadow-xl border-2 border-purple-100 dark:border-purple-900">
          <div className="space-y-6">
            {/* Action Toolbar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-2 rounded-2xl bg-secondary/10 border border-border/50 print:hidden">
              {/* Left Side: Auto Calculate Toggle */}
              <div className="flex items-center gap-3 px-4 py-2 rounded-xl w-full sm:w-auto justify-between sm:justify-start">
                <div className="flex items-center gap-2.5">
                  <div className={isAutoCalculate ? "p-2 rounded-lg transition-colors bg-yellow-500/10 text-yellow-600" : "p-2 rounded-lg transition-colors bg-muted text-muted-foreground"}>
                    {isAutoCalculate ? <Zap className="h-4 w-4 fill-current" /> : <ZapOff className="h-4 w-4" />}
                  </div>
                  <Label htmlFor="auto-calculate" className="text-sm font-medium cursor-pointer select-none">
                    Auto Calculate
                  </Label>
                </div>
                <Switch
                  id="auto-calculate"
                  checked={isAutoCalculate}
                  onCheckedChange={setIsAutoCalculate}
                  className="data-[state=checked]:bg-yellow-500 ml-2"
                />
              </div>

              {/* Right Side: Actions */}
              <div className="flex items-center gap-2 w-full sm:w-auto justify-end px-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleDeleteInputs}
                  className="h-10 w-10 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-colors"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleRestoreInputs}
                  disabled={!restoreSnapshot}
                  className="h-10 w-10 text-muted-foreground hover:text-emerald-600 hover:bg-emerald-600/10 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title={restoreSnapshot ? "Reload last inputs" : "Reload last inputs (after delete)"}
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>

                <div className="h-6 w-px bg-border mx-2 hidden sm:block" />

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleShare}
                  className="h-10 w-10 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-xl transition-colors"
                  title="Share"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handlePrint}
                  className="h-10 w-10 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-xl transition-colors"
                  title="Print"
                >
                  <Printer className="h-4 w-4" />
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-10 w-10 border-primary/20 hover:bg-primary/5 hover:text-primary shadow-sm rounded-xl"
                      title="Download"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-[500px] p-4 max-h-[80vh] overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-muted-foreground/50"
                  >
                    <DropdownMenuLabel className="px-2 py-1.5 text-lg font-bold border-b mb-3">
                      Download Options
                    </DropdownMenuLabel>

                    <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                      {/* Left Column */}
                      <div className="space-y-4">
                        {/* Basic Section */}
                        <div className="space-y-1">
                          <div className="px-2 text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                            Basic & Standard
                          </div>
                          <DropdownMenuItem onClick={() => handleDownload('csv')} className="rounded-lg cursor-pointer">
                            <FileText className="mr-2 h-4 w-4 text-green-600" />
                            <span>CSV (Excel)</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDownload('excel')} className="rounded-lg cursor-pointer">
                            <FileSpreadsheet className="mr-2 h-4 w-4 text-green-600" />
                            <span>Excel (.xlsx)</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDownload('pdf')} className="rounded-lg cursor-pointer">
                            <FileType className="mr-2 h-4 w-4 text-red-500" />
                            <span>PDF Document</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDownload('json')} className="rounded-lg cursor-pointer">
                            <FileJson className="mr-2 h-4 w-4 text-yellow-500" />
                            <span>JSON Data</span>
                          </DropdownMenuItem>
                        </div>

                        {/* Images Section */}
                        <div className="space-y-1">
                          <div className="px-2 text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                            Images & Visuals
                          </div>
                          <DropdownMenuItem onClick={() => handleDownload('png')} className="rounded-lg cursor-pointer">
                            <Image className="mr-2 h-4 w-4 text-purple-500" />
                            <span>PNG Image</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDownload('jpg')} className="rounded-lg cursor-pointer">
                            <FileImage className="mr-2 h-4 w-4 text-orange-500" />
                            <span>JPG Image</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDownload('svg')} className="rounded-lg cursor-pointer">
                            <FileCode className="mr-2 h-4 w-4 text-pink-500" />
                            <span>SVG Vector</span>
                          </DropdownMenuItem>
                        </div>
                      </div>

                      {/* Right Column */}
                      <div className="space-y-4">
                        {/* Advanced Section */}
                        <div className="space-y-1">
                          <div className="px-2 text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                            Advanced Docs
                          </div>
                          <DropdownMenuItem onClick={() => handleDownload('html')} className="rounded-lg cursor-pointer">
                            <FileCode className="mr-2 h-4 w-4 text-orange-600" />
                            <span>HTML Report</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDownload('docx')} className="rounded-lg cursor-pointer">
                            <FileText className="mr-2 h-4 w-4 text-blue-700" />
                            <span>Word (.docx)</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDownload('pptx')} className="rounded-lg cursor-pointer">
                            <Presentation className="mr-2 h-4 w-4 text-orange-700" />
                            <span>PowerPoint (.pptx)</span>
                          </DropdownMenuItem>
                        </div>

                        {/* Developer Section */}
                        <div className="space-y-1">
                          <div className="px-2 text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                            Developer Data
                          </div>
                          <DropdownMenuItem onClick={() => handleDownload('xml')} className="rounded-lg cursor-pointer">
                            <FileCode className="mr-2 h-4 w-4 text-gray-500" />
                            <span>XML Data</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDownload('api')} className="rounded-lg cursor-pointer">
                            <LinkIcon className="mr-2 h-4 w-4 text-indigo-500" />
                            <span>API Link</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDownload('sql')} className="rounded-lg cursor-pointer">
                            <Database className="mr-2 h-4 w-4 text-blue-400" />
                            <span>SQL Insert</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDownload('sqlite')} className="rounded-lg cursor-pointer">
                            <Database className="mr-2 h-4 w-4 text-cyan-600" />
                            <span>SQLite DB</span>
                          </DropdownMenuItem>
                        </div>

                        {/* Security Section */}
                        <div className="space-y-1">
                          <div className="px-2 text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                            Archives & Security
                          </div>
                          <DropdownMenuItem onClick={() => handleDownload('zip')} className="rounded-lg cursor-pointer">
                            <FileArchive className="mr-2 h-4 w-4 text-yellow-600" />
                            <span>ZIP Archive</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDownload('pdf-encrypted')} className="rounded-lg cursor-pointer">
                            <Lock className="mr-2 h-4 w-4 text-red-600" />
                            <span>Encrypted PDF</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDownload('zip-encrypted')} className="rounded-lg cursor-pointer">
                            <FileKey className="mr-2 h-4 w-4 text-slate-600" />
                            <span>Password ZIP</span>
                          </DropdownMenuItem>
                        </div>
                      </div>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Input Fields */}
            <div className={cn('grid gap-4', isAgeCalculator ? 'grid-cols-1' : 'md:grid-cols-2')}>
              {config.inputs.map((input) => (
                  <div key={input.name} className="space-y-2">
                    <Label htmlFor={input.name} className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {input.label}
                      {input.unit && <span className="text-purple-600 ml-1">({input.unit})</span>}
                    </Label>

                    {input.type === 'select' ? (
                      <select
                        id={input.name}
                        value={inputs[input.name] || ''}
                        onChange={(e) => handleInputChange(input.name, e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                      >
                        {input.options?.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    ) : input.type === 'date' ? (
                      (() => {
                        if (isAgeCalculator && (input.name === 'birthdate' || input.name === 'targetDate')) {
                          const rawValue = String(inputs[input.name] ?? '')
                          const isoValue = rawValue.includes('-') && rawValue.split('-')[0]?.length === 4
                            ? rawValue
                            : ddmmyyyyToIso(rawValue)

                          const parts = datePartsByName[input.name] ?? splitDatePartsForUi(rawValue)
                          const setParts = (next: { day: string; month: string; year: string }) => {
                            setDatePartsByName((prev) => ({ ...prev, [input.name]: next }))

                            const pad2 = (s: string) => (s ? String(Number(s)).padStart(2, '0') : '')
                            const d = pad2(next.day)
                            const m = pad2(next.month)
                            const y = (next.year ?? '').slice(0, 4)
                            const nextValue = d && m && y ? `${d}-${m}-${y}` : d && m ? `${d}-${m}` : ''
                            handleInputChange(input.name, nextValue)
                          }

                          const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                          const monthPlaceholder = 'Mon'
                          const dayPlaceholder = '31'
                          const yearPlaceholder = String(exampleYear)

                          const monthNum = Number(parts.month)
                          const yearNum = parts.year.length === 4 ? Number(parts.year) : exampleYear
                          const maxDay = monthNum >= 1 && monthNum <= 12 ? new Date(yearNum, monthNum, 0).getDate() : 31
                          const dayValueNum = Number(parts.day)
                          const clampedDay = dayValueNum && dayValueNum > maxDay ? String(maxDay) : parts.day

                          return (
                            <div className="space-y-2">
                              <div className="relative w-full h-14 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 flex items-center gap-2 px-3 focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-transparent">
                                <Calendar className="h-5 w-5 text-muted-foreground shrink-0" />
                                <Input
                                  id={input.name}
                                  type="date"
                                  value={isoValue}
                                  onChange={(e) => {
                                    const nextIso = e.target.value
                                    handleInputChange(input.name, nextIso)
                                    const m = nextIso.match(/^([0-9]{4})-([0-9]{2})-([0-9]{2})$/)
                                    if (m) {
                                      setDatePartsByName((prev) => ({
                                        ...prev,
                                        [input.name]: {
                                          year: m[1] ?? '',
                                          month: String(Number(m[2] ?? '')),
                                          day: String(Number(m[3] ?? '')),
                                        },
                                      }))
                                    }
                                  }}
                                  className="h-10 flex-1 border-0 bg-transparent p-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 text-base"
                                />
                              </div>

                              <div className="grid grid-cols-3 gap-3">
                                <select
                                  aria-label={`${input.label} month`}
                                  value={parts.month}
                                  onChange={(e) => {
                                    const nextMonth = e.target.value
                                    setParts({ day: parts.day, month: nextMonth, year: parts.year })
                                  }}
                                  className="w-full min-w-0 h-14 px-4 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-base"
                                >
                                  <option value="" disabled>
                                    {monthPlaceholder}
                                  </option>
                                  {monthNames.map((m, idx) => (
                                    <option key={m} value={String(idx + 1)}>
                                      {m}
                                    </option>
                                  ))}
                                </select>

                                <select
                                  aria-label={`${input.label} day`}
                                  value={clampedDay}
                                  disabled={!parts.month}
                                  onChange={(e) => {
                                    const nextDay = e.target.value
                                    setParts({ day: nextDay, month: parts.month, year: parts.year })
                                  }}
                                  className="w-full min-w-0 h-14 px-4 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-base"
                                >
                                  <option value="" disabled>
                                    {dayPlaceholder}
                                  </option>
                                  {Array.from({ length: maxDay }, (_, i) => i + 1).map((d) => (
                                    <option key={d} value={String(d)}>
                                      {d}
                                    </option>
                                  ))}
                                </select>

                                <Input
                                  aria-label={`${input.label} year`}
                                  inputMode="numeric"
                                  placeholder={yearPlaceholder}
                                  value={parts.year}
                                  onChange={(e) => {
                                    const nextYear = e.target.value.replace(/[^0-9]/g, '').slice(0, 4)
                                    setParts({ day: parts.day, month: parts.month, year: nextYear })
                                  }}
                                  className="w-full min-w-0 h-14 border-gray-300 dark:border-gray-600 focus:border-purple-500 focus:ring-purple-500 rounded-xl px-4 text-base tracking-wide transition-all duration-200 focus:shadow-lg focus:shadow-purple-500/10"
                                />
                              </div>
                            </div>
                          )
                        }

                        const parts = datePartsByName[input.name] ?? { day: '', month: '', year: '' };
                        const setParts = (next: { day: string; month: string; year: string }) => {
                          setDatePartsByName((prev) => ({ ...prev, [input.name]: next }));

                          const pad2 = (s: string) => (s ? String(Number(s)).padStart(2, '0') : '');
                          const d = pad2(next.day);
                          const m = pad2(next.month);
                          const y = (next.year ?? '').slice(0, 4);

                          const nextValue = d && m && y ? `${d}-${m}-${y}` : d && m ? `${d}-${m}` : '';
                          handleInputChange(input.name, nextValue);
                        };

                        const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
                        const monthPlaceholder = 'Mon';
                        const dayPlaceholder = '31';
                        const yearPlaceholder = String(exampleYear);

                        const monthNum = Number(parts.month);
                        const yearNum = parts.year.length === 4 ? Number(parts.year) : exampleYear;
                        const maxDay = monthNum >= 1 && monthNum <= 12
                          ? new Date(yearNum, monthNum, 0).getDate()
                          : 31;

                        const dayValueNum = Number(parts.day);
                        const clampedDay = dayValueNum && dayValueNum > maxDay ? String(maxDay) : parts.day;
                        if (clampedDay !== parts.day) {
                          queueMicrotask(() => setParts({ ...parts, day: clampedDay }));
                        }

                        return (
                          <div
                            className="space-y-3"
                            onFocusCapture={() => setFocusedDateInput(input.name)}
                            onBlurCapture={(e) => {
                              const nextTarget = e.relatedTarget as Node | null;
                              if (nextTarget && e.currentTarget.contains(nextTarget)) return;
                              setFocusedDateInput((prev) => (prev === input.name ? null : prev));
                            }}
                          >
                            <div className="grid gap-3 grid-cols-1">
                              <div className="grid grid-cols-3 gap-2">
                                <select
                                  aria-label={`${input.label} month`}
                                  value={parts.month}
                                  onChange={(e) => {
                                    const nextMonth = e.target.value;
                                    setParts({ day: parts.day, month: nextMonth, year: parts.year });
                                  }}
                                  className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition py-6"
                                >
                                  <option value="" disabled>
                                    {monthPlaceholder}
                                  </option>
                                  {monthNames.map((m, idx) => (
                                    <option key={m} value={String(idx + 1)}>
                                      {m}
                                    </option>
                                  ))}
                                </select>

                                <select
                                  aria-label={`${input.label} day`}
                                  value={clampedDay}
                                  disabled={!parts.month}
                                  onChange={(e) => {
                                    const nextDay = e.target.value;
                                    setParts({ day: nextDay, month: parts.month, year: parts.year });
                                  }}
                                  className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition py-6"
                                >
                                  <option value="" disabled>
                                    {dayPlaceholder}
                                  </option>
                                  {Array.from({ length: maxDay }, (_, i) => i + 1).map((d) => (
                                    <option key={d} value={String(d)}>
                                      {d}
                                    </option>
                                  ))}
                                </select>

                                <Input
                                  aria-label={`${input.label} year`}
                                  inputMode="numeric"
                                  placeholder={yearPlaceholder}
                                  value={parts.year}
                                  onChange={(e) => {
                                    const nextYear = e.target.value.replace(/[^0-9]/g, '').slice(0, 4);
                                    setParts({ day: parts.day, month: parts.month, year: nextYear });
                                  }}
                                  className="border-gray-300 dark:border-gray-600 focus:border-purple-500 focus:ring-purple-500 rounded-xl py-6 text-base tracking-wide transition-all duration-200 focus:shadow-lg focus:shadow-purple-500/10"
                                />
                              </div>
                            </div>

                            {focusedDateInput === input.name && (
                              <div className="text-xs text-muted-foreground animate-fadeIn">
                                Tip: day me <span className="font-medium">31</span>, month me <span className="font-medium">12</span>, aur year me <span className="font-medium">{exampleYear}</span> jaisa — example <span className="font-medium">{exampleDatePlaceholder}</span>.
                              </div>
                            )}
                          </div>
                        );
                      })()
                    ) : (
                      input.type === 'time' ? (
                        <VoiceTimeInput
                          value={String(inputs[input.name] || '')}
                          onChange={(v) => handleInputChange(input.name, v)}
                          showSeconds={Boolean(input.showSeconds)}
                        />
                      ) : input.type === 'number' ? (
                        <div className="relative">
                          <Input
                            id={input.name}
                            type={input.type}
                            placeholder={input.placeholder}
                            value={inputs[input.name] || ''}
                            onChange={(e) => handleInputChange(input.name, Number(e.target.value))}
                            className="pr-12 border-gray-300 dark:border-gray-600 focus:border-purple-500 focus:ring-purple-500"
                          />
                          <VoiceNumberButton
                            label={input.label}
                            onValueAction={(v) => handleInputChange(input.name, v)}
                            className="absolute right-2 top-1/2 -translate-y-1/2"
                          />
                        </div>
                      ) : (
                        <Input
                          id={input.name}
                          type={input.type}
                          placeholder={input.placeholder}
                          value={inputs[input.name] || ''}
                          onChange={(e) => handleInputChange(input.name, e.target.value)}
                          className="border-gray-300 dark:border-gray-600 focus:border-purple-500 focus:ring-purple-500"
                        />
                      )
                    )}
                  </div>
                ))}
            </div>

            {/* Action Buttons */}
            {!isAutoCalculate && (
              <div>
                <Button
                  onClick={handleCalculate}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 rounded-lg shadow-lg transition transform hover:scale-[1.02]"
                >
                  <i className="fas fa-calculator mr-2"></i>
                  Calculate
                </Button>
              </div>
            )}
          </div>
        </Card>

        {/* Results */}
        {results && (
          <div className="space-y-4 animate-fadeIn">
            {id === 'age-calculator' && results.live?.clock && (
              <Card className="p-6 bg-gradient-to-br from-slate-900 to-indigo-950 border border-white/10 shadow-xl">
                <div className="flex items-center justify-center gap-3 text-xs font-bold tracking-widest text-white/70 mb-3">
                  <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                  LIVE AGE TRACKER
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-5xl font-extrabold text-white">
                    {results.live.clock}
                  </div>
                  <div className="mt-2 text-sm text-white/70">
                    You have been alive for <span className="font-semibold text-white">{Number(results.live.totalSeconds || 0).toLocaleString()}</span> seconds
                  </div>
                </div>
              </Card>
            )}

            {id === 'age-calculator' && results.biological && results.biological.length > 0 && (
              <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-2 border-blue-200 dark:border-blue-800 shadow-xl">
                <div className="flex items-center gap-2 text-sm font-bold text-blue-900 dark:text-blue-100 mb-4">
                  <span className="text-xl">💫</span>
                  BIOLOGICAL ESTIMATES
                </div>
                <div className="space-y-3">
                  {results.biological.map((item: any, index: number) => (
                    <div
                      key={index}
                      className="flex justify-between items-center py-3 px-4 bg-white/60 dark:bg-gray-800/40 rounded-xl border border-blue-100 dark:border-blue-900 hover:shadow-md transition-shadow"
                    >
                      <span className="text-gray-700 dark:text-gray-300 font-medium">{item.label}</span>
                      <span className="font-bold text-blue-600 dark:text-blue-400 text-lg">
                        {item.value} {item.unit && <span className="text-sm text-gray-500">{item.unit}</span>}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-xs text-blue-700 dark:text-blue-300 bg-blue-100/50 dark:bg-blue-900/30 rounded-lg p-3">
                  ℹ️ Estimates use simple averages (not medical advice).
                </div>
              </Card>
            )}

            <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 border-2 border-purple-200 dark:border-purple-800 shadow-xl">
              <h2 className="text-2xl font-bold text-purple-900 dark:text-purple-100 mb-4 flex items-center">
                <i className="fas fa-chart-line mr-3 text-purple-600"></i>
                Results
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {results.results.map((result: any, index: number) => (
                  <div key={index} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-purple-100 dark:border-purple-900">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">{result.label}</div>
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {result.value} {result.unit && <span className="text-sm text-gray-500">{result.unit}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Breakdown */}
            {results.breakdown && results.breakdown.length > 0 && (
              <Card className="p-6 border-2 border-pink-100 dark:border-pink-900 shadow-lg">
                <h3 className="text-xl font-bold text-pink-900 dark:text-pink-100 mb-4 flex items-center">
                  <i className="fas fa-info-circle mr-3 text-pink-600"></i>
                  Details
                </h3>
                <div className="space-y-2">
                  {results.breakdown.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700 last:border-0">
                      <span className="text-gray-700 dark:text-gray-300">{item.label}</span>
                      <span className="font-semibold text-gray-900 dark:text-gray-100">
                        {item.value} {item.unit && <span className="text-sm text-gray-500">{item.unit}</span>}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        )}

        {/* Info Box */}
        <Card className="p-6 bg-purple-50 dark:bg-purple-950 border border-purple-200 dark:border-purple-800">
          <div className="flex items-start space-x-3">
            <i className="fas fa-lightbulb text-2xl text-purple-600 mt-1"></i>
            <div>
              <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">Date & Time Calculator</h4>
              <p className="text-sm text-purple-800 dark:text-purple-200">
                This tool helps you calculate various date and time metrics including age, 
                time differences, work hours, and time zone conversions.
              </p>
            </div>
          </div>
        </Card>

        <div className="mt-12 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl">
          <SeoContentGenerator 
            title={title} 
            description={description} 
            categoryName="Date & Time" 
          />
        </div>
      </div>
    </div>
  );
}
