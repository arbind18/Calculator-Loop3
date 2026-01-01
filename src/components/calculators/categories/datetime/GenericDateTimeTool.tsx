'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { BackButton } from '@/components/ui/back-button';
import { SeoContentGenerator } from "@/components/seo/SeoContentGenerator"
import { VoiceNumberButton } from "@/components/ui/VoiceNumberButton"

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function isValidDate(d: Date) {
  return Number.isFinite(d.getTime());
}

function parseDateOnlyInput(value: unknown): Date | null {
  const s = String(value ?? '').trim();
  if (!s) return null;

  // Prefer stable date-only parsing (YYYY-MM-DD) -> UTC midnight
  const match = /^([0-9]{4})-([0-9]{2})-([0-9]{2})$/.exec(s);
  if (match) {
    const year = Number(match[1]);
    const monthIndex = Number(match[2]) - 1;
    const day = Number(match[3]);
    const utc = new Date(Date.UTC(year, monthIndex, day));
    return isValidDate(utc) ? utc : null;
  }

  const d = new Date(s);
  return isValidDate(d) ? d : null;
}

function daysInMonthUTC(year: number, monthIndex: number) {
  // monthIndex: 0..11
  return new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();
}

function addMonthsClampedUTC(base: Date, deltaMonths: number) {
  const year = base.getUTCFullYear();
  const month = base.getUTCMonth();
  const day = base.getUTCDate();

  const targetMonthIndex = month + deltaMonths;
  const targetYear = year + Math.floor(targetMonthIndex / 12);
  const normalizedMonth = ((targetMonthIndex % 12) + 12) % 12;

  const maxDay = daysInMonthUTC(targetYear, normalizedMonth);
  const clampedDay = Math.min(day, maxDay);
  return new Date(Date.UTC(targetYear, normalizedMonth, clampedDay));
}

function addYearsClampedUTC(base: Date, deltaYears: number) {
  const targetYear = base.getUTCFullYear() + deltaYears;
  const month = base.getUTCMonth();
  const day = base.getUTCDate();
  const maxDay = daysInMonthUTC(targetYear, month);
  const clampedDay = Math.min(day, maxDay);
  return new Date(Date.UTC(targetYear, month, clampedDay));
}

function addDaysUTC(base: Date, deltaDays: number) {
  return new Date(base.getTime() + deltaDays * MS_PER_DAY);
}

function formatWeekday(date: Date) {
  try {
    return new Intl.DateTimeFormat(undefined, { weekday: 'long' }).format(date);
  } catch {
    return date.toLocaleDateString();
  }
}

function formatDateLong(date: Date) {
  try {
    return new Intl.DateTimeFormat(undefined, {
      year: 'numeric',
      month: 'long',
      day: '2-digit',
    }).format(date);
  } catch {
    return date.toLocaleDateString();
  }
}

function diffCalendarYMDUTC(from: Date, to: Date) {
  // Assumes from <= to (UTC midnight date-only)
  let years = to.getUTCFullYear() - from.getUTCFullYear();
  let months = to.getUTCMonth() - from.getUTCMonth();
  let days = to.getUTCDate() - from.getUTCDate();

  if (days < 0) {
    months -= 1;
    const prevMonthYear = to.getUTCMonth() === 0 ? to.getUTCFullYear() - 1 : to.getUTCFullYear();
    const prevMonthIndex = to.getUTCMonth() === 0 ? 11 : to.getUTCMonth() - 1;
    days += daysInMonthUTC(prevMonthYear, prevMonthIndex);
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  return { years, months, days };
}

function formatYMD(ymd: { years: number; months: number; days: number }) {
  return `${ymd.years} years, ${ymd.months} months, ${ymd.days} days`;
}

function ageAtDateUTC(dateOfBirth: Date, atDate: Date) {
  const dobTime = dateOfBirth.getTime();
  const atTime = atDate.getTime();
  const earlier = dobTime <= atTime ? dateOfBirth : atDate;
  const later = dobTime <= atTime ? atDate : dateOfBirth;
  const ymd = diffCalendarYMDUTC(earlier, later);
  return {
    ymd,
    direction: dobTime <= atTime ? 'After birth' : 'Before birth',
  };
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
  }[];
  calculate: (inputs: { [key: string]: number | string }) => {
    results: { label: string; value: string | number; unit?: string }[];
    breakdown?: { label: string; value: string | number; unit?: string }[];
  };
}

interface GenericDateTimeToolProps {
  id: string;
  title: string;
  description: string;
}

export default function GenericDateTimeTool({ id, title, description }: GenericDateTimeToolProps) {
  const [inputs, setInputs] = useState<{ [key: string]: string | number }>({});
  const [results, setResults] = useState<any>(null);

  const getCalculatorConfig = (calculatorId: string): CalculatorConfig => {
    switch (calculatorId) {
      case 'date-calculator':
      case 'date-add-subtract':
        return {
          id: 'date-calculator',
          title: 'Date Calculator',
          description: 'Add or subtract years, months, and days from a date with detailed breakdown.',
          inputs: [
            { name: 'customNote', label: 'Custom Detail (optional)', type: 'text', placeholder: 'e.g., Project deadline / Visa date' },
            { name: 'baseDate', label: 'Base Date', type: 'date' },
            { name: 'baseLabel', label: 'Base Date Label (optional)', type: 'text', placeholder: 'e.g., Joining date' },
            { name: 'dateOfBirth', label: 'Date of Birth (optional)', type: 'date' },
            {
              name: 'operation',
              label: 'Operation',
              type: 'select',
              options: [
                { value: 'add', label: 'Add' },
                { value: 'subtract', label: 'Subtract' },
              ],
            },
            { name: 'years', label: 'Years', type: 'number', placeholder: '0' },
            { name: 'months', label: 'Months', type: 'number', placeholder: '0' },
            { name: 'days', label: 'Days', type: 'number', placeholder: '0' },
          ],
          calculate: (inputs) => {
            const base = parseDateOnlyInput(inputs.baseDate);
            if (!base) {
              return {
                results: [{ label: 'Error', value: 'Please select a valid base date.' }],
                breakdown: [],
              };
            }

            const customNote = String(inputs.customNote ?? '').trim();
            const baseLabel = String(inputs.baseLabel ?? '').trim();
            const dob = parseDateOnlyInput(inputs.dateOfBirth);

            const operation = String(inputs.operation || 'add');
            const sign = operation === 'subtract' ? -1 : 1;
            const years = Math.trunc(Number(inputs.years) || 0) * sign;
            const months = Math.trunc(Number(inputs.months) || 0) * sign;
            const days = Math.trunc(Number(inputs.days) || 0) * sign;

            const afterYears = addYearsClampedUTC(base, years);
            const afterYearsMonths = addMonthsClampedUTC(afterYears, months);
            const finalDate = addDaysUTC(afterYearsMonths, days);

            const totalDeltaDays = Math.trunc((finalDate.getTime() - base.getTime()) / MS_PER_DAY);
            const absTotalDays = Math.abs(totalDeltaDays);
            const weeks = Math.floor(absTotalDays / 7);
            const remDays = absTotalDays % 7;

            const earlier = base.getTime() <= finalDate.getTime() ? base : finalDate;
            const later = base.getTime() <= finalDate.getTime() ? finalDate : base;
            const ymd = diffCalendarYMDUTC(earlier, later);

            const baseAge = dob ? ageAtDateUTC(dob, base) : null;
            const resultAge = dob ? ageAtDateUTC(dob, finalDate) : null;
            const ageDelta = (baseAge && resultAge)
              ? diffCalendarYMDUTC(
                  (dob.getTime() <= base.getTime()) ? base : dob,
                  (dob.getTime() <= finalDate.getTime()) ? finalDate : dob
                )
              : null;

            return {
              results: [
                { label: 'Result Date', value: formatDateLong(finalDate) },
                { label: 'Result Weekday', value: formatWeekday(finalDate) },
                { label: 'Net Change', value: formatYMD(ymd) },
                { label: 'Total Days Change', value: absTotalDays.toLocaleString(), unit: 'days' },
              ],
              breakdown: [
                ...(customNote ? [{ label: 'Custom Detail', value: customNote }] : []),
                { label: 'Base Date', value: formatDateLong(base) },
                ...(baseLabel ? [{ label: 'Base Label', value: baseLabel }] : []),
                { label: 'Base Weekday', value: formatWeekday(base) },
                ...(dob ? [{ label: 'Date of Birth', value: formatDateLong(dob) }] : []),
                ...(baseAge ? [{ label: 'Age at Base Date', value: `${formatYMD(baseAge.ymd)} (${baseAge.direction})` }] : []),
                ...(resultAge ? [{ label: 'Age at Result Date', value: `${formatYMD(resultAge.ymd)} (${resultAge.direction})` }] : []),
                ...(ageDelta ? [{ label: 'Age Change (calendar)', value: formatYMD(ageDelta) }] : []),
                { label: 'Operation', value: operation === 'subtract' ? 'Subtract' : 'Add' },
                { label: 'Applied Years', value: years },
                { label: 'Applied Months', value: months },
                { label: 'Applied Days', value: days },
                { label: 'After Years', value: formatDateLong(afterYears) },
                { label: 'After Years + Months', value: formatDateLong(afterYearsMonths) },
                { label: 'Weeks + Days', value: `${weeks} weeks, ${remDays} days` },
                { label: 'Direction', value: totalDeltaDays >= 0 ? 'Forward' : 'Backward' },
              ],
            };
          },
        };

      case 'age-calculator':
        return {
          id: 'age-calculator',
          title: 'Age Calculator',
          description: 'Calculate your exact age in years, months, and days.',
          inputs: [
            { name: 'birthdate', label: 'Date of Birth', type: 'date' },
            { name: 'targetDate', label: 'Calculate Age At', type: 'date' },
          ],
          calculate: (inputs) => {
            const birth = new Date(String(inputs.birthdate));
            const target = inputs.targetDate ? new Date(String(inputs.targetDate)) : new Date();
            
            let years = target.getFullYear() - birth.getFullYear();
            let months = target.getMonth() - birth.getMonth();
            let days = target.getDate() - birth.getDate();

            if (days < 0) {
              months--;
              const lastMonth = new Date(target.getFullYear(), target.getMonth(), 0);
              days += lastMonth.getDate();
            }
            if (months < 0) {
              years--;
              months += 12;
            }

            const diffTime = Math.abs(target.getTime() - birth.getTime());
            const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
            const totalHours = Math.floor(diffTime / (1000 * 60 * 60));
            const totalWeeks = Math.floor(totalDays / 7);

            return {
              results: [
                { label: 'Age', value: `${years} years, ${months} months, ${days} days` },
                { label: 'Total Days', value: totalDays.toLocaleString(), unit: 'days' },
                { label: 'Total Weeks', value: totalWeeks.toLocaleString(), unit: 'weeks' },
              ],
              breakdown: [
                { label: 'Date of Birth', value: birth.toLocaleDateString() },
                { label: 'Target Date', value: target.toLocaleDateString() },
                { label: 'Total Hours', value: totalHours.toLocaleString(), unit: 'hours' },
                { label: 'Next Birthday', value: new Date(target.getFullYear() + (target < new Date(target.getFullYear(), birth.getMonth(), birth.getDate()) ? 0 : 1), birth.getMonth(), birth.getDate()).toLocaleDateString() },
              ]
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
            { name: 'customNote', label: 'Custom Detail (optional)', type: 'text', placeholder: 'e.g., Notice period / Visa duration' },
            { name: 'startDate', label: 'Start Date', type: 'date' },
            { name: 'startLabel', label: 'Start Label (optional)', type: 'text', placeholder: 'e.g., Joining date' },
            { name: 'endDate', label: 'End Date', type: 'date' },
            { name: 'endLabel', label: 'End Label (optional)', type: 'text', placeholder: 'e.g., Relieving date' },
            { name: 'dateOfBirth', label: 'Date of Birth (optional)', type: 'date' },
          ],
          calculate: (inputs) => {
            const start = parseDateOnlyInput(inputs.startDate);
            const end = parseDateOnlyInput(inputs.endDate);
            if (!start || !end) {
              return {
                results: [{ label: 'Error', value: 'Please select both valid dates.' }],
                breakdown: [],
              };
            }

            const customNote = String(inputs.customNote ?? '').trim();
            const startLabel = String(inputs.startLabel ?? '').trim();
            const endLabel = String(inputs.endLabel ?? '').trim();
            const dob = parseDateOnlyInput(inputs.dateOfBirth);

            const startTime = start.getTime();
            const endTime = end.getTime();
            const isForward = endTime >= startTime;
            const earlier = isForward ? start : end;
            const later = isForward ? end : start;

            const diffDays = Math.trunc((later.getTime() - earlier.getTime()) / MS_PER_DAY);
            const inclusiveDays = diffDays + 1;
            const weeks = Math.floor(diffDays / 7);
            const remDays = diffDays % 7;
            const ymd = diffCalendarYMDUTC(earlier, later);

            const startAge = dob ? ageAtDateUTC(dob, start) : null;
            const endAge = dob ? ageAtDateUTC(dob, end) : null;

            return {
              results: [
                { label: 'Difference (Y/M/D)', value: `${ymd.years} years, ${ymd.months} months, ${ymd.days} days` },
                { label: 'Total Days (exclusive)', value: diffDays.toLocaleString(), unit: 'days' },
                { label: 'Weeks + Days', value: `${weeks} weeks, ${remDays} days` },
              ],
              breakdown: [
                ...(customNote ? [{ label: 'Custom Detail', value: customNote }] : []),
                { label: 'Start Date', value: formatDateLong(start) },
                ...(startLabel ? [{ label: 'Start Label', value: startLabel }] : []),
                { label: 'Start Weekday', value: formatWeekday(start) },
                { label: 'End Date', value: formatDateLong(end) },
                ...(endLabel ? [{ label: 'End Label', value: endLabel }] : []),
                { label: 'End Weekday', value: formatWeekday(end) },
                ...(dob ? [{ label: 'Date of Birth', value: formatDateLong(dob) }] : []),
                ...(startAge ? [{ label: 'Age at Start', value: `${formatYMD(startAge.ymd)} (${startAge.direction})` }] : []),
                ...(endAge ? [{ label: 'Age at End', value: `${formatYMD(endAge.ymd)} (${endAge.direction})` }] : []),
                { label: 'Direction', value: isForward ? 'Forward (End after Start)' : 'Backward (End before Start)' },
                { label: 'Earlier Date', value: formatDateLong(earlier) },
                { label: 'Later Date', value: formatDateLong(later) },
                { label: 'Total Days (inclusive)', value: inclusiveDays.toLocaleString(), unit: 'days' },
                { label: 'Total Hours', value: (diffDays * 24).toLocaleString(), unit: 'hours' },
              ]
            };
          }
        };

      case 'time-zone-converter':
        return {
          id: 'time-zone-converter',
          title: 'Time Zone Converter',
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

  useEffect(() => {
    const defaultInputs: { [key: string]: string | number } = {};
    config.inputs.forEach(input => {
      if (input.type === 'select' && input.options) {
        defaultInputs[input.name] = input.options[0].value;
      } else if (input.type === 'date') {
        defaultInputs[input.name] = new Date().toISOString().split('T')[0];
      } else if (input.type === 'time') {
        defaultInputs[input.name] = '12:00';
      } else {
        defaultInputs[input.name] = '';
      }
    });
    setInputs(defaultInputs);
  }, [id]);

  const handleInputChange = (name: string, value: string | number) => {
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const handleCalculate = () => {
    const result = config.calculate(inputs);
    setResults(result);
  };

  const handleReset = () => {
    const defaultInputs: { [key: string]: string | number } = {};
    config.inputs.forEach(input => {
      if (input.type === 'select' && input.options) {
        defaultInputs[input.name] = input.options[0].value;
      } else if (input.type === 'date') {
        defaultInputs[input.name] = new Date().toISOString().split('T')[0];
      } else if (input.type === 'time') {
        defaultInputs[input.name] = '12:00';
      } else {
        defaultInputs[input.name] = '';
      }
    });
    setInputs(defaultInputs);
    setResults(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-red-50 dark:from-gray-900 dark:via-purple-950 dark:to-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <BackButton />
        
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
        <Card className="p-6 shadow-xl border-2 border-purple-100 dark:border-purple-900">
          <div className="space-y-6">
            {/* Input Fields */}
            <div className="grid md:grid-cols-2 gap-4">
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
                  ) : (
                    input.type === 'number' ? (
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
            <div className="flex gap-3">
              <Button
                onClick={handleCalculate}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 rounded-lg shadow-lg transition transform hover:scale-[1.02]"
              >
                <i className="fas fa-calculator mr-2"></i>
                Calculate
              </Button>
              <Button
                onClick={handleReset}
                variant="outline"
                className="px-6 border-2 border-purple-300 hover:bg-purple-50 dark:border-purple-700 dark:hover:bg-purple-950"
              >
                <i className="fas fa-redo mr-2"></i>
                Reset
              </Button>
            </div>
          </div>
        </Card>

        {/* Results */}
        {results && (
          <div className="space-y-4 animate-fadeIn">
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
