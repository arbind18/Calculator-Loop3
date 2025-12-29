"use client"

import React, { useState, useEffect, useMemo } from 'react';
import { Calculator, Activity, Sparkles, TrendingUp, Coffee, DollarSign, Utensils, ShoppingCart, Zap, Copy, Check, BarChart3, Lightbulb, Sliders, BookmarkPlus, Download, RefreshCw } from 'lucide-react';
import { FinancialCalculatorTemplate } from '@/components/calculators/templates/FinancialCalculatorTemplate';
import { SeoContentGenerator } from "@/components/seo/SeoContentGenerator"
import { VoiceNumberButton } from "@/components/ui/VoiceNumberButton"

interface EverydayInput {
  name: string;
  label: string;
  type: 'number' | 'text' | 'select' | 'date' | 'slider';
  options?: string[];
  defaultValue?: number | string;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  icon?: string;
  unit?: string;
  helpText?: string;
  presets?: Array<{ label: string; value: number | string }>;
}

interface CalculationResult {
  result: string | number;
  explanation?: string;
  steps?: string[];
  insights?: string[];
  tips?: string[];
  comparison?: { label: string; value: number; status: 'good' | 'average' | 'poor' };
  chartData?: Array<{ label: string; value: number; color?: string }>;
}

interface EverydayToolConfig {
  title: string;
  description: string;
  inputs: EverydayInput[];
  calculate: (inputs: Record<string, any>) => CalculationResult;
  category?: 'food' | 'conversion' | 'shopping' | 'time' | 'travel' | 'home' | 'budget';
  emoji?: string;
  presetScenarios?: Array<{ name: string; icon?: string; values: Record<string, any> }>;
}

const safeFloat = (val: any) => {
  const n = parseFloat(val);
  return isNaN(n) ? 0 : n;
};

const getToolConfig = (id: string | undefined): EverydayToolConfig => {
  if (!id) return {
    title: 'Calculator Not Found',
    description: 'This calculator configuration is missing.',
    inputs: [],
    calculate: () => ({ result: 'Error' })
  };
  
  // ==================== TIME & PRODUCTIVITY ====================
  
  // POMODORO TIMER CALCULATOR
  if (id.includes('pomodoro')) {
    return {
      title: 'Pomodoro Timer Calculator',
      description: 'Calculate work sessions and breaks for productivity.',
      inputs: [
        { name: 'sessions', label: 'Number of Sessions', type: 'number', defaultValue: 4, min: 1, max: 10 },
        { name: 'workTime', label: 'Work Time (minutes)', type: 'number', defaultValue: 25, min: 5, max: 60 },
        { name: 'shortBreak', label: 'Short Break (minutes)', type: 'number', defaultValue: 5, min: 1, max: 15 },
        { name: 'longBreak', label: 'Long Break (minutes)', type: 'number', defaultValue: 15, min: 5, max: 30 },
      ],
      calculate: (inputs) => {
        const sessions = safeFloat(inputs.sessions);
        const work = safeFloat(inputs.workTime);
        const shortB = safeFloat(inputs.shortBreak);
        const longB = safeFloat(inputs.longBreak);
        
        const totalWork = sessions * work;
        const totalShortBreaks = (sessions - 1) * shortB;
        const totalTime = totalWork + totalShortBreaks + longB;
        
        const hours = Math.floor(totalTime / 60);
        const mins = totalTime % 60;
        
        return {
          result: `${hours}h ${mins}m`,
          explanation: `Total time for ${sessions} Pomodoro sessions`,
          steps: [
            `Work time: ${sessions} × ${work}min = ${totalWork}min`,
            `Short breaks: ${sessions - 1} × ${shortB}min = ${totalShortBreaks}min`,
            `Long break: ${longB}min`,
            `Total: ${totalTime}min = ${hours}h ${mins}m`
          ]
        };
      }
    };
  }

  // TIME ZONE CONVERTER
  if (id.includes('time-zone') || id.includes('timezone')) {
    return {
      title: 'Time Zone Converter',
      description: 'Convert time between different time zones.',
      inputs: [
        { name: 'hour', label: 'Hour (24h format)', type: 'number', defaultValue: 14, min: 0, max: 23 },
        { name: 'fromZone', label: 'From Time Zone', type: 'select', options: ['IST (UTC+5:30)', 'EST (UTC-5)', 'PST (UTC-8)', 'GMT (UTC+0)', 'JST (UTC+9)', 'AEST (UTC+10)'], defaultValue: 'IST (UTC+5:30)' },
        { name: 'toZone', label: 'To Time Zone', type: 'select', options: ['IST (UTC+5:30)', 'EST (UTC-5)', 'PST (UTC-8)', 'GMT (UTC+0)', 'JST (UTC+9)', 'AEST (UTC+10)'], defaultValue: 'EST (UTC-5)' },
      ],
      calculate: (inputs) => {
        const hour = safeFloat(inputs.hour);
        const fromZone = inputs.fromZone;
        const toZone = inputs.toZone;
        
        const zones: Record<string, number> = {
          'IST (UTC+5:30)': 5.5,
          'EST (UTC-5)': -5,
          'PST (UTC-8)': -8,
          'GMT (UTC+0)': 0,
          'JST (UTC+9)': 9,
          'AEST (UTC+10)': 10
        };
        
        const fromOffset = zones[fromZone] || 0;
        const toOffset = zones[toZone] || 0;
        
        const utcHour = hour - fromOffset;
        let convertedHour = utcHour + toOffset;
        
        let dayChange = '';
        if (convertedHour < 0) {
          convertedHour += 24;
          dayChange = ' (Previous Day)';
        } else if (convertedHour >= 24) {
          convertedHour -= 24;
          dayChange = ' (Next Day)';
        }
        
        const h = Math.floor(convertedHour);
        const m = Math.round((convertedHour - h) * 60);
        
        return {
          result: `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}${dayChange}`,
          explanation: `Converted time`,
          steps: [
            `From: ${hour}:00 ${fromZone}`,
            `To: ${h}:${m.toString().padStart(2, '0')} ${toZone}${dayChange}`
          ]
        };
      }
    };
  }

  // WORK HOURS CALCULATOR
  if (id.includes('work-hours')) {
    return {
      title: 'Work Hours Calculator',
      description: 'Calculate total work hours and overtime.',
      inputs: [
        { name: 'startHour', label: 'Start Time (24h)', type: 'number', defaultValue: 9, min: 0, max: 23 },
        { name: 'endHour', label: 'End Time (24h)', type: 'number', defaultValue: 18, min: 0, max: 23 },
        { name: 'breakMins', label: 'Break Time (minutes)', type: 'number', defaultValue: 60, min: 0, max: 180 },
        { name: 'days', label: 'Number of Days', type: 'number', defaultValue: 5, min: 1, max: 7 },
      ],
      calculate: (inputs) => {
        const start = safeFloat(inputs.startHour);
        const end = safeFloat(inputs.endHour);
        const breakMins = safeFloat(inputs.breakMins);
        const days = safeFloat(inputs.days);
        
        let workHours = end - start;
        if (workHours < 0) workHours += 24;
        
        const workMins = (workHours * 60) - breakMins;
        const dailyHours = workMins / 60;
        const weeklyHours = dailyHours * days;
        
        const regularHours = Math.min(weeklyHours, 40);
        const overtimeHours = Math.max(0, weeklyHours - 40);
        
        return {
          result: `${weeklyHours.toFixed(1)} hours/week`,
          explanation: `Total work hours`,
          steps: [
            `Daily: ${start}:00 to ${end}:00 = ${workHours} hours`,
            `Less break: ${breakMins} mins`,
            `Net daily: ${dailyHours.toFixed(2)} hours`,
            `Weekly (${days} days): ${weeklyHours.toFixed(1)} hours`,
            `Regular: ${regularHours.toFixed(1)}h, Overtime: ${overtimeHours.toFixed(1)}h`
          ]
        };
      }
    };
  }

  // OVERTIME CALCULATOR
  if (id.includes('overtime')) {
    return {
      title: 'Overtime Calculator',
      description: 'Calculate overtime pay and earnings.',
      inputs: [
        { name: 'hourlyRate', label: 'Hourly Rate (₹)', type: 'number', defaultValue: 500 },
        { name: 'regularHours', label: 'Regular Hours', type: 'number', defaultValue: 40 },
        { name: 'overtimeHours', label: 'Overtime Hours', type: 'number', defaultValue: 10 },
        { name: 'overtimeMultiplier', label: 'Overtime Rate', type: 'select', options: ['1.5x', '2x', '2.5x'], defaultValue: '1.5x' },
      ],
      calculate: (inputs) => {
        const rate = safeFloat(inputs.hourlyRate);
        const regular = safeFloat(inputs.regularHours);
        const overtime = safeFloat(inputs.overtimeHours);
        const multiplierStr = inputs.overtimeMultiplier;
        const multiplier = parseFloat(multiplierStr);
        
        const regularPay = regular * rate;
        const overtimePay = overtime * rate * multiplier;
        const totalPay = regularPay + overtimePay;
        
        return {
          result: `₹${totalPay.toLocaleString('en-IN')}`,
          explanation: `Total earnings with overtime`,
          steps: [
            `Regular pay: ${regular}h × ₹${rate} = ₹${regularPay.toLocaleString('en-IN')}`,
            `Overtime pay: ${overtime}h × ₹${rate} × ${multiplierStr} = ₹${overtimePay.toLocaleString('en-IN')}`,
            `Total: ₹${totalPay.toLocaleString('en-IN')}`
          ]
        };
      }
    };
  }

  // AGE CALCULATOR
  if (id.includes('age-calculator')) {
    return {
      title: 'Age Calculator',
      description: 'Calculate age or date difference.',
      inputs: [
        { name: 'years', label: 'Years', type: 'number', defaultValue: 25, min: 0, max: 120 },
        { name: 'months', label: 'Months', type: 'number', defaultValue: 6, min: 0, max: 11 },
        { name: 'days', label: 'Days', type: 'number', defaultValue: 15, min: 0, max: 30 },
      ],
      calculate: (inputs) => {
        const years = safeFloat(inputs.years);
        const months = safeFloat(inputs.months);
        const days = safeFloat(inputs.days);
        
        const totalDays = (years * 365.25) + (months * 30.44) + days;
        const totalWeeks = totalDays / 7;
        const totalMonths = (years * 12) + months;
        const totalHours = totalDays * 24;
        
        return {
          result: `${years}y ${months}m ${days}d`,
          explanation: `Age breakdown`,
          steps: [
            `Total: ${totalDays.toFixed(0)} days`,
            `Or: ${totalWeeks.toFixed(0)} weeks`,
            `Or: ${totalMonths} months`,
            `Or: ${totalHours.toFixed(0)} hours`
          ]
        };
      }
    };
  }

  // DAY COUNTER
  if (id.includes('day-counter')) {
    return {
      title: 'Day Counter',
      description: 'Count days between dates or days until event.',
      inputs: [
        { name: 'days', label: 'Number of Days', type: 'number', defaultValue: 100, min: 1 },
      ],
      calculate: (inputs) => {
        const days = safeFloat(inputs.days);
        const weeks = days / 7;
        const months = days / 30.44;
        const years = days / 365.25;
        
        return {
          result: `${days} days`,
          explanation: `Time duration`,
          steps: [
            `${days} days`,
            `= ${weeks.toFixed(1)} weeks`,
            `= ${months.toFixed(1)} months`,
            `= ${years.toFixed(2)} years`
          ]
        };
      }
    };
  }

  // ==================== TRAVEL & TRANSPORTATION ====================

  // FUEL COST CALCULATOR
  if (id.includes('fuel-cost')) {
    return {
      title: 'Fuel Cost Calculator',
      description: 'Calculate fuel expenses for your trip.',
      inputs: [
        { name: 'distance', label: 'Distance (km)', type: 'number', defaultValue: 100 },
        { name: 'mileage', label: 'Mileage (km/L)', type: 'number', defaultValue: 15 },
        { name: 'fuelPrice', label: 'Fuel Price (₹/L)', type: 'number', defaultValue: 105 },
      ],
      calculate: (inputs) => {
        const dist = safeFloat(inputs.distance);
        const mileage = safeFloat(inputs.mileage);
        const price = safeFloat(inputs.fuelPrice);
        
        if (mileage === 0) return { result: 'Error', explanation: 'Mileage cannot be zero' };
        
        const litersNeeded = dist / mileage;
        const totalCost = litersNeeded * price;
        const costPerKm = totalCost / dist;
        
        return {
          result: `₹${totalCost.toFixed(2)}`,
          explanation: `Total fuel cost for ${dist}km`,
          steps: [
            `Fuel needed: ${dist}km ÷ ${mileage}km/L = ${litersNeeded.toFixed(2)}L`,
            `Cost: ${litersNeeded.toFixed(2)}L × ₹${price}/L = ₹${totalCost.toFixed(2)}`,
            `Cost per km: ₹${costPerKm.toFixed(2)}/km`
          ]
        };
      }
    };
  }

  // TRIP COST CALCULATOR
  if (id.includes('trip-cost')) {
    return {
      title: 'Trip Cost Calculator',
      description: 'Calculate total trip expenses.',
      inputs: [
        { name: 'fuel', label: 'Fuel Cost (₹)', type: 'number', defaultValue: 2000 },
        { name: 'food', label: 'Food Cost (₹)', type: 'number', defaultValue: 1500 },
        { name: 'accommodation', label: 'Hotel/Stay (₹)', type: 'number', defaultValue: 3000 },
        { name: 'other', label: 'Other Expenses (₹)', type: 'number', defaultValue: 1000 },
        { name: 'people', label: 'Number of People', type: 'number', defaultValue: 2, min: 1 },
      ],
      calculate: (inputs) => {
        const fuel = safeFloat(inputs.fuel);
        const food = safeFloat(inputs.food);
        const hotel = safeFloat(inputs.accommodation);
        const other = safeFloat(inputs.other);
        const people = safeFloat(inputs.people);
        
        const total = fuel + food + hotel + other;
        const perPerson = total / people;
        
        return {
          result: `₹${total.toLocaleString('en-IN')}`,
          explanation: `Total trip cost`,
          steps: [
            `Fuel: ₹${fuel.toLocaleString('en-IN')}`,
            `Food: ₹${food.toLocaleString('en-IN')}`,
            `Accommodation: ₹${hotel.toLocaleString('en-IN')}`,
            `Other: ₹${other.toLocaleString('en-IN')}`,
            `Total: ₹${total.toLocaleString('en-IN')}`,
            `Per person (${people}): ₹${perPerson.toLocaleString('en-IN')}`
          ]
        };
      }
    };
  }

  // MILEAGE TRACKER
  if (id.includes('mileage-tracker')) {
    return {
      title: 'Mileage Tracker',
      description: 'Calculate vehicle fuel efficiency.',
      inputs: [
        { name: 'distance', label: 'Distance Travelled (km)', type: 'number', defaultValue: 300 },
        { name: 'fuelUsed', label: 'Fuel Used (liters)', type: 'number', defaultValue: 20 },
      ],
      calculate: (inputs) => {
        const dist = safeFloat(inputs.distance);
        const fuel = safeFloat(inputs.fuelUsed);
        
        if (fuel === 0) return { result: 'Error', explanation: 'Fuel cannot be zero' };
        
        const mileage = dist / fuel;
        const kmPerLiter = mileage;
        
        return {
          result: `${mileage.toFixed(2)} km/L`,
          explanation: `Vehicle mileage`,
          steps: [
            `Distance: ${dist} km`,
            `Fuel: ${fuel} liters`,
            `Mileage = ${dist} ÷ ${fuel} = ${mileage.toFixed(2)} km/L`
          ]
        };
      }
    };
  }

  // CAR MAINTENANCE COST
  if (id.includes('car-maintenance') || id.includes('maintenance-cost')) {
    return {
      title: 'Car Maintenance Cost Estimator',
      description: 'Estimate yearly car maintenance expenses.',
      inputs: [
        { name: 'service', label: 'Service Cost/year (₹)', type: 'number', defaultValue: 15000 },
        { name: 'insurance', label: 'Insurance/year (₹)', type: 'number', defaultValue: 25000 },
        { name: 'fuel', label: 'Fuel Cost/month (₹)', type: 'number', defaultValue: 5000 },
        { name: 'parking', label: 'Parking/month (₹)', type: 'number', defaultValue: 2000 },
      ],
      calculate: (inputs) => {
        const service = safeFloat(inputs.service);
        const insurance = safeFloat(inputs.insurance);
        const fuel = safeFloat(inputs.fuel) * 12;
        const parking = safeFloat(inputs.parking) * 12;
        
        const total = service + insurance + fuel + parking;
        const monthly = total / 12;
        
        return {
          result: `₹${total.toLocaleString('en-IN')}/year`,
          explanation: `Annual car maintenance cost`,
          steps: [
            `Service: ₹${service.toLocaleString('en-IN')}`,
            `Insurance: ₹${insurance.toLocaleString('en-IN')}`,
            `Fuel: ₹${fuel.toLocaleString('en-IN')}`,
            `Parking: ₹${parking.toLocaleString('en-IN')}`,
            `Total/year: ₹${total.toLocaleString('en-IN')}`,
            `Monthly average: ₹${monthly.toLocaleString('en-IN')}`
          ]
        };
      }
    };
  }

  // TOLL CALCULATOR
  if (id.includes('toll')) {
    return {
      title: 'Toll Calculator',
      description: 'Calculate toll charges for your route.',
      inputs: [
        { name: 'tolls', label: 'Number of Toll Booths', type: 'number', defaultValue: 3, min: 0, max: 20 },
        { name: 'avgCost', label: 'Average Toll Cost (₹)', type: 'number', defaultValue: 150 },
        { name: 'trips', label: 'Trips per Month', type: 'number', defaultValue: 4, min: 1 },
      ],
      calculate: (inputs) => {
        const tolls = safeFloat(inputs.tolls);
        const avg = safeFloat(inputs.avgCost);
        const trips = safeFloat(inputs.trips);
        
        const perTrip = tolls * avg;
        const monthly = perTrip * trips;
        const yearly = monthly * 12;
        
        return {
          result: `₹${monthly.toLocaleString('en-IN')}/month`,
          explanation: `Monthly toll expenses`,
          steps: [
            `Per trip: ${tolls} tolls × ₹${avg} = ₹${perTrip}`,
            `Monthly: ₹${perTrip} × ${trips} trips = ₹${monthly.toLocaleString('en-IN')}`,
            `Yearly: ₹${yearly.toLocaleString('en-IN')}`
          ]
        };
      }
    };
  }

  // DISTANCE CALCULATOR
  if (id.includes('distance-calculator')) {
    return {
      title: 'Distance Calculator',
      description: 'Calculate distance and travel time.',
      inputs: [
        { name: 'distance', label: 'Distance (km)', type: 'number', defaultValue: 250 },
        { name: 'speed', label: 'Average Speed (km/h)', type: 'number', defaultValue: 60 },
      ],
      calculate: (inputs) => {
        const dist = safeFloat(inputs.distance);
        const speed = safeFloat(inputs.speed);
        
        if (speed === 0) return { result: 'Error', explanation: 'Speed cannot be zero' };
        
        const timeHours = dist / speed;
        const hours = Math.floor(timeHours);
        const minutes = Math.round((timeHours - hours) * 60);
        
        return {
          result: `${hours}h ${minutes}m`,
          explanation: `Travel time for ${dist}km`,
          steps: [
            `Time = Distance ÷ Speed`,
            `Time = ${dist}km ÷ ${speed}km/h`,
            `Time = ${timeHours.toFixed(2)} hours = ${hours}h ${minutes}m`
          ]
        };
      }
    };
  }

  // CAB FARE ESTIMATOR
  if (id.includes('cab-fare') || id.includes('ola') || id.includes('uber')) {
    return {
      title: 'Cab Fare Estimator',
      description: 'Estimate Ola/Uber cab fare.',
      inputs: [
        { name: 'distance', label: 'Distance (km)', type: 'number', defaultValue: 10 },
        { name: 'basefare', label: 'Base Fare (₹)', type: 'number', defaultValue: 50 },
        { name: 'perKm', label: 'Rate per km (₹)', type: 'number', defaultValue: 12 },
        { name: 'waitTime', label: 'Wait Time (mins)', type: 'number', defaultValue: 5, min: 0 },
      ],
      calculate: (inputs) => {
        const dist = safeFloat(inputs.distance);
        const base = safeFloat(inputs.basefare);
        const perKm = safeFloat(inputs.perKm);
        const wait = safeFloat(inputs.waitTime);
        
        const distanceFare = dist * perKm;
        const waitCharge = wait * 1.5;
        const total = base + distanceFare + waitCharge;
        
        return {
          result: `₹${Math.round(total)}`,
          explanation: `Estimated cab fare`,
          steps: [
            `Base fare: ₹${base}`,
            `Distance: ${dist}km × ₹${perKm} = ₹${distanceFare}`,
            `Wait time: ${wait}min × ₹1.5 = ₹${waitCharge.toFixed(0)}`,
            `Total: ₹${Math.round(total)}`
          ]
        };
      }
    };
  }

  // ==================== HOME & LIVING ====================

  // RENT VS BUY CALCULATOR
  if (id.includes('rent-vs-buy') || id.includes('rent-buy')) {
    return {
      title: 'Rent vs Buy Calculator',
      description: 'Compare renting vs buying a home.',
      inputs: [
        { name: 'homePrice', label: 'Home Price (₹)', type: 'number', defaultValue: 5000000 },
        { name: 'monthlyRent', label: 'Monthly Rent (₹)', type: 'number', defaultValue: 25000 },
        { name: 'years', label: 'Years to Compare', type: 'number', defaultValue: 10, min: 1, max: 30 },
        { name: 'downPayment', label: 'Down Payment %', type: 'number', defaultValue: 20, min: 0, max: 100 },
      ],
      calculate: (inputs) => {
        const price = safeFloat(inputs.homePrice);
        const rent = safeFloat(inputs.monthlyRent);
        const years = safeFloat(inputs.years);
        const downPct = safeFloat(inputs.downPayment) / 100;
        
        const totalRent = rent * 12 * years;
        const downPaymentAmt = price * downPct;
        const loanAmount = price - downPaymentAmt;
        const emiRate = 8.5 / 1200;
        const months = years * 12;
        const emi = loanAmount * emiRate * Math.pow(1 + emiRate, months) / (Math.pow(1 + emiRate, months) - 1);
        const totalEmi = emi * months;
        const buyingCost = downPaymentAmt + totalEmi;
        
        const savings = buyingCost - totalRent;
        const better = savings > 0 ? 'Renting' : 'Buying';
        
        return {
          result: `${better} is better by ₹${Math.abs(savings).toLocaleString('en-IN', {maximumFractionDigits: 0})}`,
          explanation: `${years}-year comparison`,
          steps: [
            `Total Rent: ₹${totalRent.toLocaleString('en-IN', {maximumFractionDigits: 0})}`,
            `Buying: Down ₹${downPaymentAmt.toLocaleString('en-IN', {maximumFractionDigits: 0})} + EMI ₹${totalEmi.toLocaleString('en-IN', {maximumFractionDigits: 0})}`,
            `Total Buy: ₹${buyingCost.toLocaleString('en-IN', {maximumFractionDigits: 0})}`,
            `Difference: ₹${Math.abs(savings).toLocaleString('en-IN', {maximumFractionDigits: 0})}`
          ]
        };
      }
    };
  }

  // ROOM SIZE CALCULATOR
  if (id.includes('room-size')) {
    return {
      title: 'Room Size Calculator',
      description: 'Convert room dimensions between units.',
      inputs: [
        { name: 'length', label: 'Length (feet)', type: 'number', defaultValue: 12 },
        { name: 'width', label: 'Width (feet)', type: 'number', defaultValue: 10 },
      ],
      calculate: (inputs) => {
        const length = safeFloat(inputs.length);
        const width = safeFloat(inputs.width);
        
        const sqft = length * width;
        const sqm = sqft * 0.092903;
        
        return {
          result: `${sqft} sq ft (${sqm.toFixed(2)} sq m)`,
          explanation: `Room area`,
          steps: [
            `Area = ${length}ft × ${width}ft`,
            `= ${sqft} sq ft`,
            `= ${sqm.toFixed(2)} sq meters`
          ]
        };
      }
    };
  }

  // PAINT CALCULATOR
  if (id.includes('paint-calculator')) {
    return {
      title: 'Paint Calculator',
      description: 'Calculate paint needed for walls.',
      inputs: [
        { name: 'length', label: 'Wall Length (feet)', type: 'number', defaultValue: 12 },
        { name: 'height', label: 'Wall Height (feet)', type: 'number', defaultValue: 10 },
        { name: 'coats', label: 'Number of Coats', type: 'number', defaultValue: 2, min: 1, max: 3 },
        { name: 'coverage', label: 'Coverage (sq ft/L)', type: 'number', defaultValue: 120 },
      ],
      calculate: (inputs) => {
        const length = safeFloat(inputs.length);
        const height = safeFloat(inputs.height);
        const coats = safeFloat(inputs.coats);
        const coverage = safeFloat(inputs.coverage);
        
        const area = length * height;
        const totalArea = area * coats;
        const litersNeeded = totalArea / coverage;
        const cans = Math.ceil(litersNeeded);
        
        return {
          result: `${litersNeeded.toFixed(1)}L (${cans} cans)`,
          explanation: `Paint required`,
          steps: [
            `Wall area: ${length}ft × ${height}ft = ${area} sq ft`,
            `Total with ${coats} coats: ${totalArea} sq ft`,
            `Paint needed: ${totalArea} ÷ ${coverage} = ${litersNeeded.toFixed(1)}L`,
            `Buy ${cans} cans (1L each)`
          ]
        };
      }
    };
  }

  // TILE CALCULATOR
  if (id.includes('tile-calculator')) {
    return {
      title: 'Tile Calculator',
      description: 'Calculate tiles needed for flooring.',
      inputs: [
        { name: 'roomLength', label: 'Room Length (feet)', type: 'number', defaultValue: 15 },
        { name: 'roomWidth', label: 'Room Width (feet)', type: 'number', defaultValue: 12 },
        { name: 'tileSize', label: 'Tile Size (inches)', type: 'number', defaultValue: 24 },
        { name: 'wastage', label: 'Wastage %', type: 'number', defaultValue: 10, min: 0, max: 30 },
      ],
      calculate: (inputs) => {
        const length = safeFloat(inputs.roomLength);
        const width = safeFloat(inputs.roomWidth);
        const tileSize = safeFloat(inputs.tileSize);
        const wastage = safeFloat(inputs.wastage) / 100;
        
        const roomArea = length * width;
        const tileSqFt = (tileSize / 12) * (tileSize / 12);
        const tilesNeeded = Math.ceil(roomArea / tileSqFt);
        const withWastage = Math.ceil(tilesNeeded * (1 + wastage));
        const boxes = Math.ceil(withWastage / 4);
        
        return {
          result: `${withWastage} tiles (${boxes} boxes)`,
          explanation: `Tiles required with ${wastage * 100}% wastage`,
          steps: [
            `Room area: ${length} × ${width} = ${roomArea} sq ft`,
            `Tile size: ${tileSize}" = ${tileSqFt.toFixed(2)} sq ft`,
            `Tiles needed: ${tilesNeeded}`,
            `With wastage: ${withWastage} tiles`,
            `Boxes (4 tiles/box): ${boxes}`
          ]
        };
      }
    };
  }

  // ELECTRICITY BILL CALCULATOR
  if (id.includes('electricity-bill')) {
    return {
      title: 'Electricity Bill Calculator',
      description: 'Calculate your electricity bill.',
      inputs: [
        { name: 'units', label: 'Units Consumed (kWh)', type: 'number', defaultValue: 250 },
        { name: 'ratePerUnit', label: 'Rate per Unit (₹)', type: 'number', defaultValue: 7 },
        { name: 'fixedCharge', label: 'Fixed Charge (₹)', type: 'number', defaultValue: 50 },
      ],
      calculate: (inputs) => {
        const units = safeFloat(inputs.units);
        const rate = safeFloat(inputs.ratePerUnit);
        const fixed = safeFloat(inputs.fixedCharge);
        
        const energyCharge = units * rate;
        const total = energyCharge + fixed;
        
        return {
          result: `₹${total.toFixed(2)}`,
          explanation: `Total electricity bill`,
          steps: [
            `Energy charge: ${units} units × ₹${rate} = ₹${energyCharge.toFixed(2)}`,
            `Fixed charge: ₹${fixed}`,
            `Total bill: ₹${total.toFixed(2)}`
          ]
        };
      }
    };
  }

  // AC POWER CONSUMPTION
  if (id.includes('ac-power') || id.includes('ac-consumption')) {
    return {
      title: 'AC Power Consumption Calculator',
      description: 'Calculate AC electricity cost.',
      inputs: [
        { name: 'tonnage', label: 'AC Tonnage', type: 'select', options: ['1 Ton', '1.5 Ton', '2 Ton'], defaultValue: '1.5 Ton' },
        { name: 'hoursPerDay', label: 'Hours/Day', type: 'number', defaultValue: 8, min: 1, max: 24 },
        { name: 'daysPerMonth', label: 'Days/Month', type: 'number', defaultValue: 30, min: 1, max: 31 },
        { name: 'ratePerUnit', label: 'Rate per Unit (₹/kWh)', type: 'number', defaultValue: 7 },
      ],
      calculate: (inputs) => {
        const tonnage = inputs.tonnage;
        const hours = safeFloat(inputs.hoursPerDay);
        const days = safeFloat(inputs.daysPerMonth);
        const rate = safeFloat(inputs.ratePerUnit);
        
        const watts: Record<string, number> = {
          '1 Ton': 1200,
          '1.5 Ton': 1800,
          '2 Ton': 2400
        };
        
        const power = watts[tonnage] || 1800;
        const dailyUnits = (power * hours) / 1000;
        const monthlyUnits = dailyUnits * days;
        const monthlyCost = monthlyUnits * rate;
        
        return {
          result: `₹${monthlyCost.toFixed(2)}/month`,
          explanation: `${tonnage} AC electricity cost`,
          steps: [
            `Power: ${power}W`,
            `Daily: ${power}W × ${hours}h = ${dailyUnits.toFixed(2)} kWh`,
            `Monthly: ${dailyUnits.toFixed(2)} × ${days} days = ${monthlyUnits.toFixed(2)} kWh`,
            `Cost: ${monthlyUnits.toFixed(2)} × ₹${rate} = ₹${monthlyCost.toFixed(2)}`
          ]
        };
      }
    };
  }

  // CARPET AREA CALCULATOR
  if (id.includes('carpet-area')) {
    return {
      title: 'Carpet Area Calculator',
      description: 'Calculate usable carpet area from built-up area.',
      inputs: [
        { name: 'builtupArea', label: 'Built-up Area (sq ft)', type: 'number', defaultValue: 1000 },
        { name: 'loadingPercent', label: 'Loading %', type: 'number', defaultValue: 25, min: 20, max: 40 },
      ],
      calculate: (inputs) => {
        const builtup = safeFloat(inputs.builtupArea);
        const loading = safeFloat(inputs.loadingPercent) / 100;
        
        const carpetArea = builtup / (1 + loading);
        const difference = builtup - carpetArea;
        
        return {
          result: `${carpetArea.toFixed(0)} sq ft`,
          explanation: `Carpet area (usable space)`,
          steps: [
            `Built-up area: ${builtup} sq ft`,
            `Loading factor: ${loading * 100}%`,
            `Carpet area: ${builtup} ÷ ${(1 + loading).toFixed(2)} = ${carpetArea.toFixed(0)} sq ft`,
            `Common area: ${difference.toFixed(0)} sq ft`
          ]
        };
      }
    };
  }

  // ==================== MOBILE & COMMUNICATION ====================

  // DATA PLAN CALCULATOR
  if (id.includes('data-plan')) {
    return {
      title: 'Data Plan Calculator',
      description: 'Calculate mobile data plan cost.',
      inputs: [
        { name: 'dailyData', label: 'Daily Data Usage (GB)', type: 'number', defaultValue: 2 },
        { name: 'planType', label: 'Plan Type', type: 'select', options: ['Daily (1.5GB/day)', 'Weekly (10GB)', 'Monthly (2GB/day)', 'Unlimited'], defaultValue: 'Monthly (2GB/day)' },
      ],
      calculate: (inputs) => {
        const daily = safeFloat(inputs.dailyData);
        const plan = inputs.planType;
        
        const prices: Record<string, number> = {
          'Daily (1.5GB/day)': 19,
          'Weekly (10GB)': 129,
          'Monthly (2GB/day)': 299,
          'Unlimited': 699
        };
        
        const cost = prices[plan] || 299;
        const monthlyCost = plan.includes('Daily') ? cost * 30 : plan.includes('Weekly') ? cost * 4 : cost;
        const perGB = plan === 'Unlimited' ? 0 : monthlyCost / (daily * 30);
        
        return {
          result: `₹${monthlyCost}/month`,
          explanation: `${plan} data plan cost`,
          steps: [
            `Plan: ${plan}`,
            `Cost: ₹${cost}`,
            `Monthly: ₹${monthlyCost}`,
            perGB > 0 ? `Per GB: ₹${perGB.toFixed(2)}` : 'Unlimited data'
          ]
        };
      }
    };
  }

  // PHONE BILL ESTIMATOR
  if (id.includes('phone-bill')) {
    return {
      title: 'Phone Bill Estimator',
      description: 'Estimate monthly phone bill.',
      inputs: [
        { name: 'dataPlan', label: 'Data Plan (₹)', type: 'number', defaultValue: 299 },
        { name: 'calls', label: 'Call Charges (₹)', type: 'number', defaultValue: 50 },
        { name: 'sms', label: 'SMS Charges (₹)', type: 'number', defaultValue: 20 },
        { name: 'vas', label: 'VAS Services (₹)', type: 'number', defaultValue: 30 },
      ],
      calculate: (inputs) => {
        const data = safeFloat(inputs.dataPlan);
        const calls = safeFloat(inputs.calls);
        const sms = safeFloat(inputs.sms);
        const vas = safeFloat(inputs.vas);
        
        const total = data + calls + sms + vas;
        const yearly = total * 12;
        
        return {
          result: `₹${total}/month`,
          explanation: `Total phone bill`,
          steps: [
            `Data plan: ₹${data}`,
            `Calls: ₹${calls}`,
            `SMS: ₹${sms}`,
            `VAS: ₹${vas}`,
            `Monthly: ₹${total}`,
            `Yearly: ₹${yearly.toLocaleString('en-IN')}`
          ]
        };
      }
    };
  }

  // WIFI COVERAGE CALCULATOR
  if (id.includes('wifi-coverage')) {
    return {
      title: 'WiFi Coverage Calculator',
      description: 'Calculate WiFi router coverage area.',
      inputs: [
        { name: 'routerType', label: 'Router Type', type: 'select', options: ['Standard (2.4GHz)', 'Dual Band (5GHz)', 'Mesh System'], defaultValue: 'Dual Band (5GHz)' },
        { name: 'floors', label: 'Number of Floors', type: 'number', defaultValue: 2, min: 1, max: 5 },
      ],
      calculate: (inputs) => {
        const type = inputs.routerType;
        const floors = safeFloat(inputs.floors);
        
        const coverage: Record<string, number> = {
          'Standard (2.4GHz)': 1500,
          'Dual Band (5GHz)': 2000,
          'Mesh System': 5000
        };
        
        const area = coverage[type] || 2000;
        const perFloor = area / floors;
        const rooms = Math.floor(perFloor / 150);
        
        return {
          result: `${area} sq ft`,
          explanation: `${type} coverage`,
          steps: [
            `Router: ${type}`,
            `Total coverage: ${area} sq ft`,
            `Per floor (${floors}): ${perFloor.toFixed(0)} sq ft`,
            `Approx rooms per floor: ${rooms}`
          ]
        };
      }
    };
  }

  // PREPAID VS POSTPAID
  if (id.includes('prepaid-vs-postpaid') || id.includes('prepaid-postpaid')) {
    return {
      title: 'Prepaid vs Postpaid Comparison',
      description: 'Compare prepaid and postpaid plans.',
      inputs: [
        { name: 'monthlyUsage', label: 'Monthly Usage (₹)', type: 'number', defaultValue: 300 },
        { name: 'postpaidRental', label: 'Postpaid Rental (₹)', type: 'number', defaultValue: 199 },
      ],
      calculate: (inputs) => {
        const usage = safeFloat(inputs.monthlyUsage);
        const rental = safeFloat(inputs.postpaidRental);
        
        const prepaidCost = usage;
        const postpaidCost = rental + (usage * 0.8);
        const savings = prepaidCost - postpaidCost;
        const better = savings > 0 ? 'Postpaid' : 'Prepaid';
        
        return {
          result: `${better} saves ₹${Math.abs(savings).toFixed(0)}/month`,
          explanation: `Best plan for you`,
          steps: [
            `Prepaid: ₹${prepaidCost}/month`,
            `Postpaid: ₹${rental} rental + ₹${(usage * 0.8).toFixed(0)} usage = ₹${postpaidCost.toFixed(0)}`,
            `Savings: ₹${Math.abs(savings).toFixed(0)} with ${better}`
          ]
        };
      }
    };
  }

  // ==================== WEDDING & EVENTS ====================

  // WEDDING BUDGET CALCULATOR
  if (id.includes('wedding-budget')) {
    return {
      title: 'Wedding Budget Calculator',
      description: 'Plan your wedding expenses.',
      inputs: [
        { name: 'guests', label: 'Number of Guests', type: 'number', defaultValue: 200 },
        { name: 'perPlate', label: 'Cost per Plate (₹)', type: 'number', defaultValue: 800 },
        { name: 'venue', label: 'Venue Cost (₹)', type: 'number', defaultValue: 100000 },
        { name: 'decoration', label: 'Decoration (₹)', type: 'number', defaultValue: 50000 },
        { name: 'photography', label: 'Photography (₹)', type: 'number', defaultValue: 80000 },
        { name: 'other', label: 'Other Expenses (₹)', type: 'number', defaultValue: 100000 },
      ],
      calculate: (inputs) => {
        const guests = safeFloat(inputs.guests);
        const perPlate = safeFloat(inputs.perPlate);
        const venue = safeFloat(inputs.venue);
        const decoration = safeFloat(inputs.decoration);
        const photography = safeFloat(inputs.photography);
        const other = safeFloat(inputs.other);
        
        const catering = guests * perPlate;
        const total = catering + venue + decoration + photography + other;
        const perGuest = total / guests;
        
        return {
          result: `₹${total.toLocaleString('en-IN')}`,
          explanation: `Total wedding budget`,
          steps: [
            `Catering: ${guests} guests × ₹${perPlate} = ₹${catering.toLocaleString('en-IN')}`,
            `Venue: ₹${venue.toLocaleString('en-IN')}`,
            `Decoration: ₹${decoration.toLocaleString('en-IN')}`,
            `Photography: ₹${photography.toLocaleString('en-IN')}`,
            `Other: ₹${other.toLocaleString('en-IN')}`,
            `Total: ₹${total.toLocaleString('en-IN')}`,
            `Per guest: ₹${perGuest.toLocaleString('en-IN')}`
          ]
        };
      }
    };
  }

  // GUEST LIST CALCULATOR
  if (id.includes('guest-list')) {
    return {
      title: 'Guest List Calculator',
      description: 'Calculate venue capacity needed.',
      inputs: [
        { name: 'familyMembers', label: 'Family Members', type: 'number', defaultValue: 50 },
        { name: 'friends', label: 'Friends', type: 'number', defaultValue: 80 },
        { name: 'colleagues', label: 'Colleagues', type: 'number', defaultValue: 40 },
        { name: 'others', label: 'Others', type: 'number', defaultValue: 30 },
        { name: 'attendanceRate', label: 'Expected Attendance %', type: 'number', defaultValue: 85, min: 50, max: 100 },
      ],
      calculate: (inputs) => {
        const family = safeFloat(inputs.familyMembers);
        const friends = safeFloat(inputs.friends);
        const colleagues = safeFloat(inputs.colleagues);
        const others = safeFloat(inputs.others);
        const rate = safeFloat(inputs.attendanceRate) / 100;
        
        const totalInvited = family + friends + colleagues + others;
        const expectedAttendees = Math.round(totalInvited * rate);
        const venueCapacity = Math.ceil(expectedAttendees * 1.1);
        
        return {
          result: `${expectedAttendees} attendees`,
          explanation: `Expected guests`,
          steps: [
            `Total invited: ${totalInvited}`,
            `Family: ${family}, Friends: ${friends}`,
            `Colleagues: ${colleagues}, Others: ${others}`,
            `Expected (${rate * 100}%): ${expectedAttendees}`,
            `Venue capacity needed: ${venueCapacity} (with buffer)`
          ]
        };
      }
    };
  }

  // VENUE COST CALCULATOR
  if (id.includes('venue-cost')) {
    return {
      title: 'Venue Cost Calculator',
      description: 'Calculate venue rental cost.',
      inputs: [
        { name: 'capacity', label: 'Venue Capacity', type: 'number', defaultValue: 300 },
        { name: 'hours', label: 'Rental Hours', type: 'number', defaultValue: 6 },
        { name: 'perHour', label: 'Cost per Hour (₹)', type: 'number', defaultValue: 15000 },
        { name: 'deposit', label: 'Security Deposit (₹)', type: 'number', defaultValue: 50000 },
      ],
      calculate: (inputs) => {
        const capacity = safeFloat(inputs.capacity);
        const hours = safeFloat(inputs.hours);
        const perHour = safeFloat(inputs.perHour);
        const deposit = safeFloat(inputs.deposit);
        
        const rental = hours * perHour;
        const total = rental + deposit;
        const perGuest = rental / capacity;
        
        return {
          result: `₹${rental.toLocaleString('en-IN')}`,
          explanation: `Venue rental cost`,
          steps: [
            `Rental: ${hours}h × ₹${perHour.toLocaleString('en-IN')} = ₹${rental.toLocaleString('en-IN')}`,
            `Security deposit: ₹${deposit.toLocaleString('en-IN')}`,
            `Total (with deposit): ₹${total.toLocaleString('en-IN')}`,
            `Per guest: ₹${perGuest.toFixed(0)}`
          ]
        };
      }
    };
  }

  // CATERING COST CALCULATOR
  if (id.includes('catering-cost')) {
    return {
      title: 'Catering Cost Calculator',
      description: 'Calculate food and beverage cost.',
      inputs: [
        { name: 'guests', label: 'Number of Guests', type: 'number', defaultValue: 250 },
        { name: 'mealType', label: 'Meal Type', type: 'select', options: ['Veg (₹600)', 'Non-Veg (₹900)', 'Premium (₹1500)'], defaultValue: 'Non-Veg (₹900)' },
        { name: 'beverages', label: 'Beverages per Guest (₹)', type: 'number', defaultValue: 100 },
      ],
      calculate: (inputs) => {
        const guests = safeFloat(inputs.guests);
        const meal = inputs.mealType;
        const beverages = safeFloat(inputs.beverages);
        
        const rates: Record<string, number> = {
          'Veg (₹600)': 600,
          'Non-Veg (₹900)': 900,
          'Premium (₹1500)': 1500
        };
        
        const mealCost = rates[meal] || 900;
        const totalMeal = guests * mealCost;
        const totalBeverages = guests * beverages;
        const total = totalMeal + totalBeverages;
        
        return {
          result: `₹${total.toLocaleString('en-IN')}`,
          explanation: `Total catering cost`,
          steps: [
            `Meal: ${guests} × ₹${mealCost} = ₹${totalMeal.toLocaleString('en-IN')}`,
            `Beverages: ${guests} × ₹${beverages} = ₹${totalBeverages.toLocaleString('en-IN')}`,
            `Total: ₹${total.toLocaleString('en-IN')}`,
            `Per guest: ₹${(total / guests).toFixed(0)}`
          ]
        };
      }
    };
  }

  // DECORATION BUDGET
  if (id.includes('decoration-budget')) {
    return {
      title: 'Decoration Budget Calculator',
      description: 'Calculate event decoration cost.',
      inputs: [
        { name: 'venueArea', label: 'Venue Area (sq ft)', type: 'number', defaultValue: 5000 },
        { name: 'decorType', label: 'Decoration Type', type: 'select', options: ['Simple (₹50/sqft)', 'Elegant (₹100/sqft)', 'Grand (₹200/sqft)'], defaultValue: 'Elegant (₹100/sqft)' },
        { name: 'flowers', label: 'Flower Cost (₹)', type: 'number', defaultValue: 25000 },
        { name: 'lighting', label: 'Lighting (₹)', type: 'number', defaultValue: 15000 },
      ],
      calculate: (inputs) => {
        const area = safeFloat(inputs.venueArea);
        const type = inputs.decorType;
        const flowers = safeFloat(inputs.flowers);
        const lighting = safeFloat(inputs.lighting);
        
        const rates: Record<string, number> = {
          'Simple (₹50/sqft)': 50,
          'Elegant (₹100/sqft)': 100,
          'Grand (₹200/sqft)': 200
        };
        
        const rate = rates[type] || 100;
        const decorCost = area * rate;
        const total = decorCost + flowers + lighting;
        
        return {
          result: `₹${total.toLocaleString('en-IN')}`,
          explanation: `Total decoration cost`,
          steps: [
            `Decoration: ${area} sqft × ₹${rate} = ₹${decorCost.toLocaleString('en-IN')}`,
            `Flowers: ₹${flowers.toLocaleString('en-IN')}`,
            `Lighting: ₹${lighting.toLocaleString('en-IN')}`,
            `Total: ₹${total.toLocaleString('en-IN')}`
          ]
        };
      }
    };
  }

  // HONEYMOON BUDGET
  if (id.includes('honeymoon-budget')) {
    return {
      title: 'Honeymoon Budget Calculator',
      description: 'Plan honeymoon expenses.',
      inputs: [
        { name: 'days', label: 'Number of Days', type: 'number', defaultValue: 7 },
        { name: 'destination', label: 'Destination', type: 'select', options: ['Domestic (₹15k/day)', 'International (₹30k/day)', 'Luxury (₹50k/day)'], defaultValue: 'International (₹30k/day)' },
        { name: 'flights', label: 'Flight Cost (₹)', type: 'number', defaultValue: 80000 },
      ],
      calculate: (inputs) => {
        const days = safeFloat(inputs.days);
        const dest = inputs.destination;
        const flights = safeFloat(inputs.flights);
        
        const rates: Record<string, number> = {
          'Domestic (₹15k/day)': 15000,
          'International (₹30k/day)': 30000,
          'Luxury (₹50k/day)': 50000
        };
        
        const perDay = rates[dest] || 30000;
        const stayFood = days * perDay;
        const total = stayFood + flights;
        
        return {
          result: `₹${total.toLocaleString('en-IN')}`,
          explanation: `Total honeymoon budget`,
          steps: [
            `Destination: ${dest}`,
            `Stay + Food: ${days} days × ₹${perDay.toLocaleString('en-IN')} = ₹${stayFood.toLocaleString('en-IN')}`,
            `Flights: ₹${flights.toLocaleString('en-IN')}`,
            `Total: ₹${total.toLocaleString('en-IN')}`
          ]
        };
      }
    };
  }

  // ==================== PARENTING & BABY ====================

  // BABY DUE DATE CALCULATOR
  if (id.includes('baby-due-date') || id.includes('due-date')) {
    return {
      title: 'Baby Due Date Calculator',
      description: 'Calculate expected delivery date.',
      inputs: [
        { name: 'weeksPregnant', label: 'Weeks Pregnant', type: 'number', defaultValue: 12, min: 1, max: 42 },
      ],
      calculate: (inputs) => {
        const weeks = safeFloat(inputs.weeksPregnant);
        const weeksRemaining = 40 - weeks;
        const daysRemaining = weeksRemaining * 7;
        const trimester = weeks <= 13 ? '1st' : weeks <= 27 ? '2nd' : '3rd';
        
        return {
          result: `${weeksRemaining} weeks remaining`,
          explanation: `Until due date`,
          steps: [
            `Current: Week ${weeks}`,
            `Trimester: ${trimester}`,
            `Weeks left: ${weeksRemaining}`,
            `Days left: ${daysRemaining}`,
            `Due date: ~${Math.ceil(daysRemaining / 30)} months`
          ]
        };
      }
    };
  }

  // DIAPER COST CALCULATOR
  if (id.includes('diaper-cost')) {
    return {
      title: 'Diaper Cost Calculator',
      description: 'Calculate monthly diaper expenses.',
      inputs: [
        { name: 'age', label: 'Baby Age (months)', type: 'number', defaultValue: 6, min: 0, max: 36 },
        { name: 'perDiaper', label: 'Cost per Diaper (₹)', type: 'number', defaultValue: 15 },
      ],
      calculate: (inputs) => {
        const age = safeFloat(inputs.age);
        const cost = safeFloat(inputs.perDiaper);
        
        const perDay = age <= 3 ? 8 : age <= 12 ? 6 : age <= 24 ? 5 : 3;
        const monthly = perDay * 30;
        const monthlyCost = monthly * cost;
        const yearly = monthlyCost * 12;
        
        return {
          result: `₹${monthlyCost.toLocaleString('en-IN')}/month`,
          explanation: `Diaper expenses`,
          steps: [
            `Baby age: ${age} months`,
            `Diapers per day: ${perDay}`,
            `Monthly: ${monthly} diapers`,
            `Cost: ${monthly} × ₹${cost} = ₹${monthlyCost.toLocaleString('en-IN')}`,
            `Yearly: ₹${yearly.toLocaleString('en-IN')}`
          ]
        };
      }
    };
  }

  // BABY FOOD CALCULATOR
  if (id.includes('baby-food')) {
    return {
      title: 'Baby Food Calculator',
      description: 'Calculate baby food expenses.',
      inputs: [
        { name: 'age', label: 'Baby Age (months)', type: 'number', defaultValue: 9, min: 6, max: 24 },
        { name: 'feedType', label: 'Feed Type', type: 'select', options: ['Homemade (₹2000)', 'Commercial (₹4000)', 'Mixed (₹3000)'], defaultValue: 'Mixed (₹3000)' },
      ],
      calculate: (inputs) => {
        const age = safeFloat(inputs.age);
        const feed = inputs.feedType;
        
        const costs: Record<string, number> = {
          'Homemade (₹2000)': 2000,
          'Commercial (₹4000)': 4000,
          'Mixed (₹3000)': 3000
        };
        
        const monthly = costs[feed] || 3000;
        const yearly = monthly * 12;
        const perDay = monthly / 30;
        
        return {
          result: `₹${monthly.toLocaleString('en-IN')}/month`,
          explanation: `Baby food cost`,
          steps: [
            `Baby age: ${age} months`,
            `Feed: ${feed}`,
            `Monthly: ₹${monthly.toLocaleString('en-IN')}`,
            `Daily: ₹${perDay.toFixed(0)}`,
            `Yearly: ₹${yearly.toLocaleString('en-IN')}`
          ]
        };
      }
    };
  }

  // DAYCARE COST CALCULATOR
  if (id.includes('daycare-cost')) {
    return {
      title: 'Daycare Cost Calculator',
      description: 'Calculate childcare expenses.',
      inputs: [
        { name: 'hoursPerDay', label: 'Hours per Day', type: 'number', defaultValue: 8 },
        { name: 'daysPerWeek', label: 'Days per Week', type: 'number', defaultValue: 5, min: 1, max: 7 },
        { name: 'costPerHour', label: 'Cost per Hour (₹)', type: 'number', defaultValue: 100 },
      ],
      calculate: (inputs) => {
        const hours = safeFloat(inputs.hoursPerDay);
        const days = safeFloat(inputs.daysPerWeek);
        const cost = safeFloat(inputs.costPerHour);
        
        const daily = hours * cost;
        const weekly = daily * days;
        const monthly = weekly * 4;
        const yearly = monthly * 12;
        
        return {
          result: `₹${monthly.toLocaleString('en-IN')}/month`,
          explanation: `Daycare cost`,
          steps: [
            `Daily: ${hours}h × ₹${cost} = ₹${daily}`,
            `Weekly: ₹${daily} × ${days} days = ₹${weekly.toLocaleString('en-IN')}`,
            `Monthly: ₹${monthly.toLocaleString('en-IN')}`,
            `Yearly: ₹${yearly.toLocaleString('en-IN')}`
          ]
        };
      }
    };
  }

  // CHILD EDUCATION COST
  if (id.includes('child-education-cost')) {
    return {
      title: 'Child Education Cost Calculator',
      description: 'Estimate education expenses.',
      inputs: [
        { name: 'currentAge', label: 'Child Age (years)', type: 'number', defaultValue: 5, min: 1, max: 18 },
        { name: 'schoolType', label: 'School Type', type: 'select', options: ['Government (₹5k/year)', 'Private (₹50k/year)', 'International (₹3L/year)'], defaultValue: 'Private (₹50k/year)' },
        { name: 'yearsLeft', label: 'Years Until College', type: 'number', defaultValue: 13 },
      ],
      calculate: (inputs) => {
        const age = safeFloat(inputs.currentAge);
        const school = inputs.schoolType;
        const years = safeFloat(inputs.yearsLeft);
        
        const fees: Record<string, number> = {
          'Government (₹5k/year)': 5000,
          'Private (₹50k/year)': 50000,
          'International (₹3L/year)': 300000
        };
        
        const yearlyFee = fees[school] || 50000;
        const totalSchool = yearlyFee * years;
        const monthlyFee = yearlyFee / 12;
        
        return {
          result: `₹${totalSchool.toLocaleString('en-IN')}`,
          explanation: `Total education cost`,
          steps: [
            `Child age: ${age} years`,
            `School: ${school}`,
            `Yearly fee: ₹${yearlyFee.toLocaleString('en-IN')}`,
            `Years: ${years}`,
            `Total: ₹${totalSchool.toLocaleString('en-IN')}`,
            `Monthly: ₹${monthlyFee.toLocaleString('en-IN')}`
          ]
        };
      }
    };
  }

  // FORMULA MILK CALCULATOR
  if (id.includes('formula-milk')) {
    return {
      title: 'Formula Milk Calculator',
      description: 'Calculate formula milk cost.',
      inputs: [
        { name: 'age', label: 'Baby Age (months)', type: 'number', defaultValue: 6, min: 0, max: 24 },
        { name: 'canPrice', label: 'Price per Can (₹)', type: 'number', defaultValue: 800 },
        { name: 'canWeight', label: 'Can Weight (grams)', type: 'number', defaultValue: 400 },
      ],
      calculate: (inputs) => {
        const age = safeFloat(inputs.age);
        const price = safeFloat(inputs.canPrice);
        const weight = safeFloat(inputs.canWeight);
        
        const dailyGrams = age <= 6 ? 100 : age <= 12 ? 120 : 80;
        const monthlyGrams = dailyGrams * 30;
        const cansNeeded = Math.ceil(monthlyGrams / weight);
        const monthlyCost = cansNeeded * price;
        
        return {
          result: `₹${monthlyCost.toLocaleString('en-IN')}/month`,
          explanation: `Formula milk cost`,
          steps: [
            `Baby age: ${age} months`,
            `Daily need: ${dailyGrams}g`,
            `Monthly: ${monthlyGrams}g`,
            `Cans: ${cansNeeded} (${weight}g each)`,
            `Cost: ${cansNeeded} × ₹${price} = ₹${monthlyCost.toLocaleString('en-IN')}`
          ]
        };
      }
    };
  }

  // MEETING TIME FINDER
  if (id.includes('meeting-time-finder')) {
    return {
      title: 'Meeting Time Finder',
      description: 'Find best meeting time across time zones.',
      inputs: [
        { name: 'yourTime', label: 'Your Time (24h)', type: 'number', defaultValue: 14, min: 0, max: 23 },
        { name: 'yourZone', label: 'Your Zone', type: 'select', options: ['IST (UTC+5.5)', 'EST (UTC-5)', 'PST (UTC-8)', 'GMT (UTC+0)', 'CET (UTC+1)'], defaultValue: 'IST (UTC+5.5)' },
        { name: 'theirZone', label: 'Their Zone', type: 'select', options: ['IST (UTC+5.5)', 'EST (UTC-5)', 'PST (UTC-8)', 'GMT (UTC+0)', 'CET (UTC+1)'], defaultValue: 'EST (UTC-5)' },
      ],
      calculate: (inputs) => {
        const time = safeFloat(inputs.yourTime);
        const zone1 = inputs.yourZone;
        const zone2 = inputs.theirZone;
        
        const offsets: Record<string, number> = {
          'IST (UTC+5.5)': 5.5,
          'EST (UTC-5)': -5,
          'PST (UTC-8)': -8,
          'GMT (UTC+0)': 0,
          'CET (UTC+1)': 1
        };
        
        const offset1 = offsets[zone1] || 0;
        const offset2 = offsets[zone2] || 0;
        
        const diff = offset2 - offset1;
        let theirTime = time + diff;
        
        if (theirTime < 0) theirTime += 24;
        if (theirTime >= 24) theirTime -= 24;
        
        const isWorkingHours = theirTime >= 9 && theirTime <= 17;
        
        return {
          result: `${Math.floor(theirTime)}:${Math.round((theirTime % 1) * 60).toString().padStart(2, '0')}`,
          explanation: isWorkingHours ? 'Good time (Working hours)' : 'Outside working hours (9-5)',
          steps: [
            `Your time: ${time}:00 ${zone1}`,
            `Time difference: ${diff > 0 ? '+' : ''}${diff} hours`,
            `Their time: ${Math.floor(theirTime)}:${Math.round((theirTime % 1) * 60).toString().padStart(2, '0')} ${zone2}`
          ]
        };
      }
    };
  }

  // BREAK TIME CALCULATOR
  if (id.includes('break-time')) {
    return {
      title: 'Break Time Calculator',
      description: 'Calculate optimal break schedule.',
      inputs: [
        { name: 'workHours', label: 'Total Work Hours', type: 'number', defaultValue: 8 },
        { name: 'method', label: 'Method', type: 'select', options: ['52-17 Rule', 'Pomodoro (25-5)', '90-20 Rule'], defaultValue: '52-17 Rule' },
      ],
      calculate: (inputs) => {
        const hours = safeFloat(inputs.workHours);
        const method = inputs.method;
        const totalMins = hours * 60;
        
        let workBlock = 52;
        let breakBlock = 17;
        
        if (method.includes('Pomodoro')) { workBlock = 25; breakBlock = 5; }
        if (method.includes('90-20')) { workBlock = 90; breakBlock = 20; }
        
        const cycle = workBlock + breakBlock;
        const cycles = Math.floor(totalMins / cycle);
        const totalBreak = cycles * breakBlock;
        
        return {
          result: `${totalBreak} mins total break`,
          explanation: `Based on ${method}`,
          steps: [
            `Work block: ${workBlock} mins`,
            `Break block: ${breakBlock} mins`,
            `Cycles in ${hours}h: ${cycles}`,
            `Total break time: ${totalBreak} mins`
          ]
        };
      }
    };
  }

  // DEADLINE CALCULATOR
  if (id.includes('deadline')) {
    return {
      title: 'Deadline Calculator',
      description: 'Calculate days remaining until deadline.',
      inputs: [
        { name: 'days', label: 'Days Given', type: 'number', defaultValue: 30 },
        { name: 'hoursPerDay', label: 'Work Hours/Day', type: 'number', defaultValue: 6 },
        { name: 'taskHours', label: 'Estimated Task Hours', type: 'number', defaultValue: 100 },
      ],
      calculate: (inputs) => {
        const days = safeFloat(inputs.days);
        const daily = safeFloat(inputs.hoursPerDay);
        const total = safeFloat(inputs.taskHours);
        
        const daysNeeded = total / daily;
        const daysSpare = days - daysNeeded;
        
        return {
          result: daysSpare >= 0 ? `${daysSpare.toFixed(1)} days spare` : `${Math.abs(daysSpare).toFixed(1)} days overdue`,
          explanation: daysSpare >= 0 ? 'On track' : 'Need more time',
          steps: [
            `Total hours needed: ${total}`,
            `Daily capacity: ${daily} hours`,
            `Days required: ${daysNeeded.toFixed(1)}`,
            `Days available: ${days}`,
            `Buffer: ${daysSpare.toFixed(1)} days`
          ]
        };
      }
    };
  }

  // HOUR TO DAY CONVERTER
  if (id.includes('hour-to-day')) {
    return {
      title: 'Hour to Day Converter',
      description: 'Convert hours to work days.',
      inputs: [
        { name: 'hours', label: 'Total Hours', type: 'number', defaultValue: 100 },
        { name: 'hoursPerDay', label: 'Standard Work Day (hours)', type: 'number', defaultValue: 8 },
      ],
      calculate: (inputs) => {
        const hours = safeFloat(inputs.hours);
        const standard = safeFloat(inputs.hoursPerDay);
        
        const days = hours / standard;
        const weeks = days / 5;
        
        return {
          result: `${days.toFixed(1)} work days`,
          explanation: `Time conversion`,
          steps: [
            `Total hours: ${hours}`,
            `Standard day: ${standard} hours`,
            `Work days: ${days.toFixed(1)}`,
            `Work weeks (5 days): ${weeks.toFixed(1)}`
          ]
        };
      }
    };
  }

  // SHIFT SCHEDULE CALCULATOR
  if (id.includes('shift-schedule')) {
    return {
      title: 'Shift Schedule Calculator',
      description: 'Calculate shift rotation.',
      inputs: [
        { name: 'teams', label: 'Number of Teams', type: 'number', defaultValue: 4 },
        { name: 'shiftLength', label: 'Shift Length (hours)', type: 'number', defaultValue: 12 },
        { name: 'coverage', label: 'Hours Covered/Day', type: 'number', defaultValue: 24 },
      ],
      calculate: (inputs) => {
        const teams = safeFloat(inputs.teams);
        const length = safeFloat(inputs.shiftLength);
        const coverage = safeFloat(inputs.coverage);
        
        const shiftsPerDay = coverage / length;
        const hoursPerWeek = (shiftsPerDay * length * 7) / teams;
        
        return {
          result: `${hoursPerWeek.toFixed(1)} hours/week`,
          explanation: `Average hours per team`,
          steps: [
            `Shifts per day: ${shiftsPerDay}`,
            `Total weekly hours needed: ${shiftsPerDay * length * 7}`,
            `Divided by ${teams} teams`,
            `Average per team: ${hoursPerWeek.toFixed(1)} hours`
          ]
        };
      }
    };
  }

  // TIME CARD CALCULATOR
  if (id.includes('time-card')) {
    return {
      title: 'Time Card Calculator',
      description: 'Calculate weekly pay from hours.',
      inputs: [
        { name: 'mon', label: 'Monday Hours', type: 'number', defaultValue: 8 },
        { name: 'tue', label: 'Tuesday Hours', type: 'number', defaultValue: 8 },
        { name: 'wed', label: 'Wednesday Hours', type: 'number', defaultValue: 8 },
        { name: 'thu', label: 'Thursday Hours', type: 'number', defaultValue: 8 },
        { name: 'fri', label: 'Friday Hours', type: 'number', defaultValue: 8 },
        { name: 'rate', label: 'Hourly Rate (₹)', type: 'number', defaultValue: 500 },
      ],
      calculate: (inputs) => {
        const total = safeFloat(inputs.mon) + safeFloat(inputs.tue) + safeFloat(inputs.wed) + safeFloat(inputs.thu) + safeFloat(inputs.fri);
        const rate = safeFloat(inputs.rate);
        const pay = total * rate;
        
        return {
          result: `₹${pay.toLocaleString('en-IN')}`,
          explanation: `Weekly pay`,
          steps: [
            `Total hours: ${total}`,
            `Hourly rate: ₹${rate}`,
            `Total pay: ₹${pay.toLocaleString('en-IN')}`
          ]
        };
      }
    };
  }

  // PRODUCTIVITY SCORE
  if (id.includes('productivity-score')) {
    return {
      title: 'Productivity Score Calculator',
      description: 'Calculate productivity efficiency.',
      inputs: [
        { name: 'output', label: 'Output Value (₹)', type: 'number', defaultValue: 50000 },
        { name: 'input', label: 'Input Cost (₹)', type: 'number', defaultValue: 20000 },
        { name: 'hours', label: 'Hours Worked', type: 'number', defaultValue: 40 },
      ],
      calculate: (inputs) => {
        const output = safeFloat(inputs.output);
        const input = safeFloat(inputs.input);
        const hours = safeFloat(inputs.hours);
        
        const valueAdd = output - input;
        const productivity = valueAdd / hours;
        
        return {
          result: `₹${productivity.toFixed(0)}/hour`,
          explanation: `Value added per hour`,
          steps: [
            `Output value: ₹${output}`,
            `Input cost: ₹${input}`,
            `Value added: ₹${valueAdd}`,
            `Productivity: ₹${valueAdd} ÷ ${hours}h = ₹${productivity.toFixed(0)}/hour`
          ]
        };
      }
    };
  }

  // PARKING COST CALCULATOR
  if (id.includes('parking-cost')) {
    return {
      title: 'Parking Cost Calculator',
      description: 'Calculate monthly parking expenses.',
      inputs: [
        { name: 'dailyRate', label: 'Daily Rate (₹)', type: 'number', defaultValue: 50 },
        { name: 'days', label: 'Days per Month', type: 'number', defaultValue: 22 },
        { name: 'monthlyPass', label: 'Monthly Pass Cost (₹)', type: 'number', defaultValue: 1000 },
      ],
      calculate: (inputs) => {
        const daily = safeFloat(inputs.dailyRate);
        const days = safeFloat(inputs.days);
        const pass = safeFloat(inputs.monthlyPass);
        
        const payAsYouGo = daily * days;
        const savings = payAsYouGo - pass;
        const better = savings > 0 ? 'Monthly Pass' : 'Daily Pay';
        
        return {
          result: `${better} saves ₹${Math.abs(savings)}`,
          explanation: `Parking cost comparison`,
          steps: [
            `Pay daily: ₹${daily} × ${days} = ₹${payAsYouGo}`,
            `Monthly pass: ₹${pass}`,
            `Difference: ₹${Math.abs(savings)}`
          ]
        };
      }
    };
  }

  // ROAD TRIP PLANNER
  if (id.includes('road-trip')) {
    return {
      title: 'Road Trip Planner',
      description: 'Estimate road trip budget.',
      inputs: [
        { name: 'distance', label: 'Total Distance (km)', type: 'number', defaultValue: 500 },
        { name: 'mileage', label: 'Car Mileage (km/L)', type: 'number', defaultValue: 15 },
        { name: 'fuelPrice', label: 'Fuel Price (₹/L)', type: 'number', defaultValue: 100 },
        { name: 'foodPerDay', label: 'Food/Day (₹)', type: 'number', defaultValue: 1000 },
        { name: 'days', label: 'Number of Days', type: 'number', defaultValue: 2 },
      ],
      calculate: (inputs) => {
        const dist = safeFloat(inputs.distance);
        const mileage = safeFloat(inputs.mileage);
        const price = safeFloat(inputs.fuelPrice);
        const food = safeFloat(inputs.foodPerDay);
        const days = safeFloat(inputs.days);
        
        const fuelCost = (dist / mileage) * price;
        const foodCost = food * days;
        const total = fuelCost + foodCost;
        
        return {
          result: `₹${total.toFixed(0)}`,
          explanation: `Estimated trip cost`,
          steps: [
            `Fuel: (${dist}/${mileage}) × ₹${price} = ₹${fuelCost.toFixed(0)}`,
            `Food: ₹${food} × ${days} = ₹${foodCost}`,
            `Total: ₹${total.toFixed(0)}`
          ]
        };
      }
    };
  }

  // FLIGHT COST COMPARISON
  if (id.includes('flight-cost')) {
    return {
      title: 'Flight Cost Comparison',
      description: 'Compare flight options.',
      inputs: [
        { name: 'flightA', label: 'Flight A Price (₹)', type: 'number', defaultValue: 5000 },
        { name: 'baggageA', label: 'Flight A Baggage (₹)', type: 'number', defaultValue: 0 },
        { name: 'flightB', label: 'Flight B Price (₹)', type: 'number', defaultValue: 4500 },
        { name: 'baggageB', label: 'Flight B Baggage (₹)', type: 'number', defaultValue: 1000 },
      ],
      calculate: (inputs) => {
        const a = safeFloat(inputs.flightA) + safeFloat(inputs.baggageA);
        const b = safeFloat(inputs.flightB) + safeFloat(inputs.baggageB);
        
        const diff = Math.abs(a - b);
        const cheaper = a < b ? 'Flight A' : 'Flight B';
        
        return {
          result: `${cheaper} is cheaper by ₹${diff}`,
          explanation: `Total cost comparison`,
          steps: [
            `Flight A total: ₹${a}`,
            `Flight B total: ₹${b}`,
            `Difference: ₹${diff}`
          ]
        };
      }
    };
  }

  // HOTEL COST CALCULATOR
  if (id.includes('hotel-cost')) {
    return {
      title: 'Hotel Cost Calculator',
      description: 'Calculate accommodation expenses.',
      inputs: [
        { name: 'nights', label: 'Number of Nights', type: 'number', defaultValue: 3 },
        { name: 'rate', label: 'Rate per Night (₹)', type: 'number', defaultValue: 2500 },
        { name: 'tax', label: 'Tax Rate (%)', type: 'number', defaultValue: 12 },
      ],
      calculate: (inputs) => {
        const nights = safeFloat(inputs.nights);
        const rate = safeFloat(inputs.rate);
        const tax = safeFloat(inputs.tax) / 100;
        
        const base = nights * rate;
        const taxAmt = base * tax;
        const total = base + taxAmt;
        
        return {
          result: `₹${total.toFixed(0)}`,
          explanation: `Total hotel cost`,
          steps: [
            `Base cost: ${nights} × ₹${rate} = ₹${base}`,
            `Tax (${inputs.tax}%): ₹${taxAmt.toFixed(0)}`,
            `Total: ₹${total.toFixed(0)}`
          ]
        };
      }
    };
  }

  // TRAVEL BUDGET CALCULATOR
  if (id.includes('travel-budget')) {
    return {
      title: 'Travel Budget Calculator',
      description: 'Plan total travel budget.',
      inputs: [
        { name: 'transport', label: 'Transport (₹)', type: 'number', defaultValue: 5000 },
        { name: 'stay', label: 'Accommodation (₹)', type: 'number', defaultValue: 8000 },
        { name: 'food', label: 'Food (₹)', type: 'number', defaultValue: 4000 },
        { name: 'activities', label: 'Activities (₹)', type: 'number', defaultValue: 3000 },
        { name: 'buffer', label: 'Buffer (%)', type: 'number', defaultValue: 10 },
      ],
      calculate: (inputs) => {
        const base = safeFloat(inputs.transport) + safeFloat(inputs.stay) + safeFloat(inputs.food) + safeFloat(inputs.activities);
        const buffer = base * (safeFloat(inputs.buffer) / 100);
        const total = base + buffer;
        
        return {
          result: `₹${total.toFixed(0)}`,
          explanation: `Total budget with buffer`,
          steps: [
            `Base expenses: ₹${base}`,
            `Buffer (${inputs.buffer}%): ₹${buffer.toFixed(0)}`,
            `Total required: ₹${total.toFixed(0)}`
          ]
        };
      }
    };
  }

  // ETA CALCULATOR
  if (id.includes('eta-calculator')) {
    return {
      title: 'ETA Calculator',
      description: 'Calculate estimated time of arrival.',
      inputs: [
        { name: 'distance', label: 'Distance (km)', type: 'number', defaultValue: 100 },
        { name: 'speed', label: 'Average Speed (km/h)', type: 'number', defaultValue: 50 },
        { name: 'startTime', label: 'Start Time (24h)', type: 'number', defaultValue: 9 },
      ],
      calculate: (inputs) => {
        const dist = safeFloat(inputs.distance);
        const speed = safeFloat(inputs.speed);
        const start = safeFloat(inputs.startTime);
        
        const hours = dist / speed;
        let arrival = start + hours;
        if (arrival >= 24) arrival -= 24;
        
        const h = Math.floor(arrival);
        const m = Math.round((arrival % 1) * 60);
        
        return {
          result: `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`,
          explanation: `Estimated arrival time`,
          steps: [
            `Travel time: ${hours.toFixed(1)} hours`,
            `Start time: ${start}:00`,
            `Arrival: ${h}:${m.toString().padStart(2, '0')}`
          ]
        };
      }
    };
  }

  // TRAIN TICKET ESTIMATOR
  if (id.includes('train-ticket')) {
    return {
      title: 'Train Ticket Estimator',
      description: 'Estimate train fare.',
      inputs: [
        { name: 'distance', label: 'Distance (km)', type: 'number', defaultValue: 500 },
        { name: 'class', label: 'Class', type: 'select', options: ['Sleeper (₹0.6/km)', '3AC (₹1.5/km)', '2AC (₹2.2/km)', '1AC (₹3.5/km)'], defaultValue: '3AC (₹1.5/km)' },
      ],
      calculate: (inputs) => {
        const dist = safeFloat(inputs.distance);
        const cls = inputs.class;
        
        const rates: Record<string, number> = {
          'Sleeper (₹0.6/km)': 0.6,
          '3AC (₹1.5/km)': 1.5,
          '2AC (₹2.2/km)': 2.2,
          '1AC (₹3.5/km)': 3.5
        };
        
        const rate = rates[cls] || 1.5;
        const fare = dist * rate;
        
        return {
          result: `₹${Math.round(fare)}`,
          explanation: `Estimated fare`,
          steps: [
            `Distance: ${dist} km`,
            `Rate: ₹${rate}/km`,
            `Fare: ₹${fare.toFixed(0)}`
          ]
        };
      }
    };
  }

  // BUS FARE CALCULATOR
  if (id.includes('bus-fare')) {
    return {
      title: 'Bus Fare Calculator',
      description: 'Estimate bus ticket price.',
      inputs: [
        { name: 'distance', label: 'Distance (km)', type: 'number', defaultValue: 300 },
        { name: 'type', label: 'Bus Type', type: 'select', options: ['Ordinary (₹1/km)', 'Express (₹1.5/km)', 'Volvo/AC (₹2.5/km)'], defaultValue: 'Express (₹1.5/km)' },
      ],
      calculate: (inputs) => {
        const dist = safeFloat(inputs.distance);
        const type = inputs.type;
        
        const rates: Record<string, number> = {
          'Ordinary (₹1/km)': 1,
          'Express (₹1.5/km)': 1.5,
          'Volvo/AC (₹2.5/km)': 2.5
        };
        
        const rate = rates[type] || 1.5;
        const fare = dist * rate;
        
        return {
          result: `₹${Math.round(fare)}`,
          explanation: `Estimated bus fare`,
          steps: [
            `Distance: ${dist} km`,
            `Rate: ₹${rate}/km`,
            `Fare: ₹${fare.toFixed(0)}`
          ]
        };
      }
    };
  }

  // LUGGAGE WEIGHT CALCULATOR
  if (id.includes('luggage-weight')) {
    return {
      title: 'Luggage Weight Calculator',
      description: 'Check baggage weight limit.',
      inputs: [
        { name: 'bag1', label: 'Bag 1 (kg)', type: 'number', defaultValue: 12 },
        { name: 'bag2', label: 'Bag 2 (kg)', type: 'number', defaultValue: 0 },
        { name: 'limit', label: 'Airline Limit (kg)', type: 'number', defaultValue: 15 },
        { name: 'excessRate', label: 'Excess Rate (₹/kg)', type: 'number', defaultValue: 500 },
      ],
      calculate: (inputs) => {
        const total = safeFloat(inputs.bag1) + safeFloat(inputs.bag2);
        const limit = safeFloat(inputs.limit);
        const rate = safeFloat(inputs.excessRate);
        
        const excess = Math.max(0, total - limit);
        const charge = excess * rate;
        
        return {
          result: excess > 0 ? `₹${charge} excess fee` : 'Within limit',
          explanation: `Baggage check`,
          steps: [
            `Total weight: ${total} kg`,
            `Limit: ${limit} kg`,
            `Excess: ${excess} kg`,
            excess > 0 ? `Charge: ${excess} × ₹${rate} = ₹${charge}` : 'No excess charge'
          ]
        };
      }
    };
  }

  // FOREIGN EXCHANGE CALCULATOR
  if (id.includes('foreign-exchange')) {
    return {
      title: 'Foreign Exchange Calculator',
      description: 'Calculate currency exchange.',
      inputs: [
        { name: 'amount', label: 'Amount (INR)', type: 'number', defaultValue: 50000 },
        { name: 'currency', label: 'Target Currency', type: 'select', options: ['USD (₹83)', 'EUR (₹90)', 'GBP (₹105)', 'AED (₹22)'], defaultValue: 'USD (₹83)' },
        { name: 'fee', label: 'Exchange Fee (%)', type: 'number', defaultValue: 2 },
      ],
      calculate: (inputs) => {
        const amount = safeFloat(inputs.amount);
        const curr = inputs.currency;
        const feePct = safeFloat(inputs.fee) / 100;
        
        const rates: Record<string, number> = {
          'USD (₹83)': 83,
          'EUR (₹90)': 90,
          'GBP (₹105)': 105,
          'AED (₹22)': 22
        };
        
        const rate = rates[curr] || 83;
        const fee = amount * feePct;
        const netAmount = amount - fee;
        const converted = netAmount / rate;
        
        return {
          result: `${converted.toFixed(2)} ${curr.split(' ')[0]}`,
          explanation: `Exchange result`,
          steps: [
            `Amount: ₹${amount}`,
            `Fee (${inputs.fee}%): ₹${fee}`,
            `Net amount: ₹${netAmount}`,
            `Rate: ₹${rate}`,
            `Result: ${converted.toFixed(2)}`
          ]
        };
      }
    };
  }

  // TRAVEL INSURANCE COST
  if (id.includes('travel-insurance')) {
    return {
      title: 'Travel Insurance Cost',
      description: 'Estimate insurance premium.',
      inputs: [
        { name: 'days', label: 'Trip Duration (days)', type: 'number', defaultValue: 10 },
        { name: 'travelers', label: 'Number of Travelers', type: 'number', defaultValue: 2 },
        { name: 'coverage', label: 'Coverage Amount ($)', type: 'select', options: ['50,000', '100,000', '500,000'], defaultValue: '100,000' },
      ],
      calculate: (inputs) => {
        const days = safeFloat(inputs.days);
        const travelers = safeFloat(inputs.travelers);
        const coverage = inputs.coverage;
        
        const baseRates: Record<string, number> = {
          '50,000': 50,
          '100,000': 80,
          '500,000': 150
        };
        
        const dailyRate = baseRates[coverage] || 80;
        const total = dailyRate * days * travelers;
        
        return {
          result: `₹${total}`,
          explanation: `Estimated premium`,
          steps: [
            `Daily rate: ₹${dailyRate}`,
            `Days: ${days}`,
            `Travelers: ${travelers}`,
            `Total: ₹${dailyRate} × ${days} × ${travelers} = ₹${total}`
          ]
        };
      }
    };
  }

  // WALLPAPER CALCULATOR
  if (id.includes('wallpaper')) {
    return {
      title: 'Wallpaper Calculator',
      description: 'Calculate wallpaper rolls needed.',
      inputs: [
        { name: 'wallWidth', label: 'Wall Width (ft)', type: 'number', defaultValue: 12 },
        { name: 'wallHeight', label: 'Wall Height (ft)', type: 'number', defaultValue: 10 },
        { name: 'rollWidth', label: 'Roll Width (ft)', type: 'number', defaultValue: 1.75 },
        { name: 'rollLength', label: 'Roll Length (ft)', type: 'number', defaultValue: 33 },
      ],
      calculate: (inputs) => {
        const w = safeFloat(inputs.wallWidth);
        const h = safeFloat(inputs.wallHeight);
        const rw = safeFloat(inputs.rollWidth);
        const rl = safeFloat(inputs.rollLength);
        
        const wallArea = w * h;
        const rollArea = rw * rl;
        const rolls = Math.ceil((wallArea * 1.15) / rollArea); // 15% wastage
        
        return {
          result: `${rolls} rolls`,
          explanation: `Including 15% wastage`,
          steps: [
            `Wall area: ${wallArea} sq ft`,
            `Roll area: ${rollArea.toFixed(1)} sq ft`,
            `Rolls needed: ${wallArea / rollArea}`,
            `With wastage: ${rolls} rolls`
          ]
        };
      }
    };
  }

  // FURNITURE DIMENSION CALCULATOR
  if (id.includes('furniture-dimension')) {
    return {
      title: 'Furniture Dimension Calculator',
      description: 'Check if furniture fits in room.',
      inputs: [
        { name: 'roomW', label: 'Room Width (cm)', type: 'number', defaultValue: 300 },
        { name: 'roomL', label: 'Room Length (cm)', type: 'number', defaultValue: 400 },
        { name: 'furnW', label: 'Furniture Width (cm)', type: 'number', defaultValue: 200 },
        { name: 'furnL', label: 'Furniture Length (cm)', type: 'number', defaultValue: 100 },
      ],
      calculate: (inputs) => {
        const rw = safeFloat(inputs.roomW);
        const rl = safeFloat(inputs.roomL);
        const fw = safeFloat(inputs.furnW);
        const fl = safeFloat(inputs.furnL);
        
        const roomArea = rw * rl;
        const furnArea = fw * fl;
        const occupancy = (furnArea / roomArea) * 100;
        
        return {
          result: `${occupancy.toFixed(1)}% occupied`,
          explanation: `Space utilization`,
          steps: [
            `Room area: ${roomArea} sq cm`,
            `Furniture area: ${furnArea} sq cm`,
            `Occupancy: ${occupancy.toFixed(1)}%`
          ]
        };
      }
    };
  }

  // MOVING COST CALCULATOR
  if (id.includes('moving-cost')) {
    return {
      title: 'Moving Cost Calculator',
      description: 'Estimate relocation expenses.',
      inputs: [
        { name: 'distance', label: 'Distance (km)', type: 'number', defaultValue: 50 },
        { name: 'volume', label: 'House Size', type: 'select', options: ['1 BHK', '2 BHK', '3 BHK'], defaultValue: '2 BHK' },
        { name: 'packing', label: 'Packing Service?', type: 'select', options: ['Yes', 'No'], defaultValue: 'Yes' },
      ],
      calculate: (inputs) => {
        const dist = safeFloat(inputs.distance);
        const size = inputs.volume;
        const packing = inputs.packing === 'Yes';
        
        const baseRates: Record<string, number> = {
          '1 BHK': 5000,
          '2 BHK': 8000,
          '3 BHK': 12000
        };
        
        let cost = baseRates[size] || 8000;
        cost += dist * 50; // Transport cost
        if (packing) cost += (size === '1 BHK' ? 2000 : size === '2 BHK' ? 4000 : 6000);
        
        return {
          result: `₹${cost.toLocaleString('en-IN')}`,
          explanation: `Estimated moving cost`,
          steps: [
            `Base cost (${size}): ₹${baseRates[size]}`,
            `Transport (${dist}km): ₹${dist * 50}`,
            `Packing: ${packing ? 'Included' : 'Not included'}`,
            `Total: ₹${cost.toLocaleString('en-IN')}`
          ]
        };
      }
    };
  }

  // UTILITY BILL CALCULATOR
  if (id.includes('utility-bill')) {
    return {
      title: 'Utility Bill Calculator',
      description: 'Calculate total monthly utilities.',
      inputs: [
        { name: 'electricity', label: 'Electricity (₹)', type: 'number', defaultValue: 2000 },
        { name: 'water', label: 'Water (₹)', type: 'number', defaultValue: 500 },
        { name: 'gas', label: 'Gas (₹)', type: 'number', defaultValue: 1000 },
        { name: 'internet', label: 'Internet (₹)', type: 'number', defaultValue: 800 },
        { name: 'maintenance', label: 'Maintenance (₹)', type: 'number', defaultValue: 2500 },
      ],
      calculate: (inputs) => {
        const total = safeFloat(inputs.electricity) + safeFloat(inputs.water) + safeFloat(inputs.gas) + safeFloat(inputs.internet) + safeFloat(inputs.maintenance);
        
        return {
          result: `₹${total.toLocaleString('en-IN')}`,
          explanation: `Total monthly utilities`,
          steps: [
            `Electricity: ₹${inputs.electricity}`,
            `Water: ₹${inputs.water}`,
            `Gas: ₹${inputs.gas}`,
            `Internet: ₹${inputs.internet}`,
            `Maintenance: ₹${inputs.maintenance}`,
            `Total: ₹${total.toLocaleString('en-IN')}`
          ]
        };
      }
    };
  }

  // WATER BILL CALCULATOR
  if (id.includes('water-bill')) {
    return {
      title: 'Water Bill Calculator',
      description: 'Calculate water usage cost.',
      inputs: [
        { name: 'usage', label: 'Usage (Liters)', type: 'number', defaultValue: 15000 },
        { name: 'rate', label: 'Rate per 1000L (₹)', type: 'number', defaultValue: 20 },
        { name: 'fixed', label: 'Fixed Charge (₹)', type: 'number', defaultValue: 100 },
      ],
      calculate: (inputs) => {
        const usage = safeFloat(inputs.usage);
        const rate = safeFloat(inputs.rate);
        const fixed = safeFloat(inputs.fixed);
        
        const variable = (usage / 1000) * rate;
        const total = variable + fixed;
        
        return {
          result: `₹${total.toFixed(0)}`,
          explanation: `Monthly water bill`,
          steps: [
            `Usage: ${usage} Liters`,
            `Variable cost: ₹${variable.toFixed(0)}`,
            `Fixed charge: ₹${fixed}`,
            `Total: ₹${total.toFixed(0)}`
          ]
        };
      }
    };
  }

  // GAS BILL CALCULATOR
  if (id.includes('gas-bill')) {
    return {
      title: 'Gas Bill Calculator',
      description: 'Calculate gas consumption cost.',
      inputs: [
        { name: 'units', label: 'Units Consumed (SCM)', type: 'number', defaultValue: 15 },
        { name: 'rate', label: 'Rate per SCM (₹)', type: 'number', defaultValue: 45 },
      ],
      calculate: (inputs) => {
        const units = safeFloat(inputs.units);
        const rate = safeFloat(inputs.rate);
        const total = units * rate;
        
        return {
          result: `₹${total.toFixed(0)}`,
          explanation: `Monthly gas bill`,
          steps: [
            `Units: ${units} SCM`,
            `Rate: ₹${rate}/SCM`,
            `Total: ₹${total.toFixed(0)}`
          ]
        };
      }
    };
  }

  // REFRIGERATOR COST CALCULATOR
  if (id.includes('refrigerator-cost')) {
    return {
      title: 'Refrigerator Cost Calculator',
      description: 'Calculate fridge electricity cost.',
      inputs: [
        { name: 'watts', label: 'Power Rating (Watts)', type: 'number', defaultValue: 150 },
        { name: 'hours', label: 'Compressor Run Hours/Day', type: 'number', defaultValue: 12 },
        { name: 'rate', label: 'Rate per Unit (₹)', type: 'number', defaultValue: 7 },
      ],
      calculate: (inputs) => {
        const watts = safeFloat(inputs.watts);
        const hours = safeFloat(inputs.hours);
        const rate = safeFloat(inputs.rate);
        
        const dailyUnits = (watts * hours) / 1000;
        const monthlyUnits = dailyUnits * 30;
        const cost = monthlyUnits * rate;
        
        return {
          result: `₹${cost.toFixed(0)}/month`,
          explanation: `Refrigerator running cost`,
          steps: [
            `Daily units: ${dailyUnits.toFixed(2)} kWh`,
            `Monthly units: ${monthlyUnits.toFixed(1)} kWh`,
            `Cost: ₹${cost.toFixed(0)}`
          ]
        };
      }
    };
  }

  // ROOM HEATER COST
  if (id.includes('room-heater')) {
    return {
      title: 'Room Heater Cost',
      description: 'Calculate heater electricity cost.',
      inputs: [
        { name: 'watts', label: 'Power (Watts)', type: 'number', defaultValue: 2000 },
        { name: 'hours', label: 'Hours per Day', type: 'number', defaultValue: 4 },
        { name: 'rate', label: 'Rate per Unit (₹)', type: 'number', defaultValue: 7 },
      ],
      calculate: (inputs) => {
        const watts = safeFloat(inputs.watts);
        const hours = safeFloat(inputs.hours);
        const rate = safeFloat(inputs.rate);
        
        const dailyUnits = (watts * hours) / 1000;
        const monthlyUnits = dailyUnits * 30;
        const cost = monthlyUnits * rate;
        
        return {
          result: `₹${cost.toFixed(0)}/month`,
          explanation: `Heater running cost`,
          steps: [
            `Daily units: ${dailyUnits.toFixed(2)} kWh`,
            `Monthly units: ${monthlyUnits.toFixed(1)} kWh`,
            `Cost: ₹${cost.toFixed(0)}`
          ]
        };
      }
    };
  }

  // INTERIOR DESIGN BUDGET
  if (id.includes('interior-design')) {
    return {
      title: 'Interior Design Budget',
      description: 'Estimate interior design cost.',
      inputs: [
        { name: 'area', label: 'Carpet Area (sq ft)', type: 'number', defaultValue: 1000 },
        { name: 'type', label: 'Finish Type', type: 'select', options: ['Basic (₹800/sqft)', 'Standard (₹1200/sqft)', 'Premium (₹1800/sqft)'], defaultValue: 'Standard (₹1200/sqft)' },
      ],
      calculate: (inputs) => {
        const area = safeFloat(inputs.area);
        const type = inputs.type;
        
        const rates: Record<string, number> = {
          'Basic (₹800/sqft)': 800,
          'Standard (₹1200/sqft)': 1200,
          'Premium (₹1800/sqft)': 1800
        };
        
        const rate = rates[type] || 1200;
        const total = area * rate;
        
        return {
          result: `₹${total.toLocaleString('en-IN')}`,
          explanation: `Estimated interior cost`,
          steps: [
            `Area: ${area} sq ft`,
            `Rate: ₹${rate}/sq ft`,
            `Total: ₹${total.toLocaleString('en-IN')}`
          ]
        };
      }
    };
  }

  // CALL COST CALCULATOR
  if (id.includes('call-cost')) {
    return {
      title: 'Call Cost Calculator',
      description: 'Calculate international call cost.',
      inputs: [
        { name: 'mins', label: 'Minutes', type: 'number', defaultValue: 10 },
        { name: 'rate', label: 'Rate per Minute (₹)', type: 'number', defaultValue: 15 },
      ],
      calculate: (inputs) => {
        const mins = safeFloat(inputs.mins);
        const rate = safeFloat(inputs.rate);
        const total = mins * rate;
        
        return {
          result: `₹${total.toFixed(2)}`,
          explanation: `Call cost`,
          steps: [
            `Duration: ${mins} mins`,
            `Rate: ₹${rate}/min`,
            `Total: ₹${total.toFixed(2)}`
          ]
        };
      }
    };
  }

  // SMS PACKAGE COST
  if (id.includes('sms-package')) {
    return {
      title: 'SMS Package Cost',
      description: 'Calculate SMS cost.',
      inputs: [
        { name: 'count', label: 'Number of SMS', type: 'number', defaultValue: 100 },
        { name: 'rate', label: 'Rate per SMS (₹)', type: 'number', defaultValue: 1.5 },
      ],
      calculate: (inputs) => {
        const count = safeFloat(inputs.count);
        const rate = safeFloat(inputs.rate);
        const total = count * rate;
        
        return {
          result: `₹${total.toFixed(2)}`,
          explanation: `SMS cost`,
          steps: [
            `Count: ${count}`,
            `Rate: ₹${rate}/SMS`,
            `Total: ₹${total.toFixed(2)}`
          ]
        };
      }
    };
  }

  // INTERNET SPEED CALCULATOR
  if (id.includes('internet-speed')) {
    return {
      title: 'Internet Speed Calculator',
      description: 'Calculate download time.',
      inputs: [
        { name: 'size', label: 'File Size (GB)', type: 'number', defaultValue: 2 },
        { name: 'speed', label: 'Internet Speed (Mbps)', type: 'number', defaultValue: 50 },
      ],
      calculate: (inputs) => {
        const size = safeFloat(inputs.size) * 1024 * 8; // Convert GB to Megabits
        const speed = safeFloat(inputs.speed);
        
        const seconds = size / speed;
        const mins = Math.floor(seconds / 60);
        const secs = Math.round(seconds % 60);
        
        return {
          result: `${mins}m ${secs}s`,
          explanation: `Download time`,
          steps: [
            `Size: ${inputs.size} GB = ${size} Megabits`,
            `Speed: ${speed} Mbps`,
            `Time: ${seconds.toFixed(0)} seconds`
          ]
        };
      }
    };
  }

  // ROAMING CHARGES CALCULATOR
  if (id.includes('roaming-charges')) {
    return {
      title: 'Roaming Charges Calculator',
      description: 'Estimate roaming bill.',
      inputs: [
        { name: 'days', label: 'Days', type: 'number', defaultValue: 5 },
        { name: 'dailyPack', label: 'Daily Pack Cost (₹)', type: 'number', defaultValue: 500 },
      ],
      calculate: (inputs) => {
        const days = safeFloat(inputs.days);
        const pack = safeFloat(inputs.dailyPack);
        const total = days * pack;
        
        return {
          result: `₹${total}`,
          explanation: `Roaming cost`,
          steps: [
            `Days: ${days}`,
            `Pack: ₹${pack}/day`,
            `Total: ₹${total}`
          ]
        };
      }
    };
  }

  // MOBILE INSURANCE CALCULATOR
  if (id.includes('mobile-insurance')) {
    return {
      title: 'Mobile Insurance Calculator',
      description: 'Calculate insurance premium.',
      inputs: [
        { name: 'price', label: 'Phone Price (₹)', type: 'number', defaultValue: 50000 },
        { name: 'rate', label: 'Premium Rate (%)', type: 'number', defaultValue: 5 },
      ],
      calculate: (inputs) => {
        const price = safeFloat(inputs.price);
        const rate = safeFloat(inputs.rate) / 100;
        const premium = price * rate;
        
        return {
          result: `₹${premium.toFixed(0)}`,
          explanation: `Insurance premium`,
          steps: [
            `Phone price: ₹${price}`,
            `Rate: ${inputs.rate}%`,
            `Premium: ₹${premium.toFixed(0)}`
          ]
        };
      }
    };
  }

  // PHONE UPGRADE CALCULATOR
  if (id.includes('phone-upgrade')) {
    return {
      title: 'Phone Upgrade Calculator',
      description: 'Calculate effective upgrade cost.',
      inputs: [
        { name: 'newPrice', label: 'New Phone Price (₹)', type: 'number', defaultValue: 80000 },
        { name: 'exchange', label: 'Exchange Value (₹)', type: 'number', defaultValue: 20000 },
      ],
      calculate: (inputs) => {
        const price = safeFloat(inputs.newPrice);
        const exchange = safeFloat(inputs.exchange);
        const cost = price - exchange;
        
        return {
          result: `₹${cost.toLocaleString('en-IN')}`,
          explanation: `Net upgrade cost`,
          steps: [
            `New phone: ₹${price}`,
            `Exchange: -₹${exchange}`,
            `Net cost: ₹${cost}`
          ]
        };
      }
    };
  }

  // INVITATION COST CALCULATOR
  if (id.includes('invitation-cost')) {
    return {
      title: 'Invitation Cost Calculator',
      description: 'Calculate invitation card cost.',
      inputs: [
        { name: 'count', label: 'Number of Cards', type: 'number', defaultValue: 200 },
        { name: 'price', label: 'Price per Card (₹)', type: 'number', defaultValue: 50 },
      ],
      calculate: (inputs) => {
        const count = safeFloat(inputs.count);
        const price = safeFloat(inputs.price);
        const total = count * price;
        
        return {
          result: `₹${total.toLocaleString('en-IN')}`,
          explanation: `Total invitation cost`,
          steps: [
            `Cards: ${count}`,
            `Price: ₹${price}/card`,
            `Total: ₹${total}`
          ]
        };
      }
    };
  }

  // PHOTOGRAPHY COST CALCULATOR
  if (id.includes('photography-cost')) {
    return {
      title: 'Photography Cost Calculator',
      description: 'Estimate photography package.',
      inputs: [
        { name: 'days', label: 'Number of Days', type: 'number', defaultValue: 2 },
        { name: 'rate', label: 'Rate per Day (₹)', type: 'number', defaultValue: 40000 },
        { name: 'album', label: 'Album Cost (₹)', type: 'number', defaultValue: 15000 },
      ],
      calculate: (inputs) => {
        const days = safeFloat(inputs.days);
        const rate = safeFloat(inputs.rate);
        const album = safeFloat(inputs.album);
        
        const service = days * rate;
        const total = service + album;
        
        return {
          result: `₹${total.toLocaleString('en-IN')}`,
          explanation: `Total photography cost`,
          steps: [
            `Service: ${days} days × ₹${rate} = ₹${service}`,
            `Album: ₹${album}`,
            `Total: ₹${total}`
          ]
        };
      }
    };
  }

  // WEDDING CARD COST
  if (id.includes('wedding-card')) {
    return {
      title: 'Wedding Card Cost',
      description: 'Calculate wedding card expenses.',
      inputs: [
        { name: 'quantity', label: 'Quantity', type: 'number', defaultValue: 300 },
        { name: 'cost', label: 'Cost per Card (₹)', type: 'number', defaultValue: 100 },
        { name: 'printing', label: 'Printing Cost (₹)', type: 'number', defaultValue: 2000 },
      ],
      calculate: (inputs) => {
        const qty = safeFloat(inputs.quantity);
        const cost = safeFloat(inputs.cost);
        const print = safeFloat(inputs.printing);
        
        const cards = qty * cost;
        const total = cards + print;
        
        return {
          result: `₹${total.toLocaleString('en-IN')}`,
          explanation: `Total card cost`,
          steps: [
            `Cards: ${qty} × ₹${cost} = ₹${cards}`,
            `Printing: ₹${print}`,
            `Total: ₹${total}`
          ]
        };
      }
    };
  }

  // GIFT REGISTRY CALCULATOR
  if (id.includes('gift-registry')) {
    return {
      title: 'Gift Registry Calculator',
      description: 'Track gift values.',
      inputs: [
        { name: 'items', label: 'Number of Items', type: 'number', defaultValue: 10 },
        { name: 'avgPrice', label: 'Average Price (₹)', type: 'number', defaultValue: 2000 },
      ],
      calculate: (inputs) => {
        const items = safeFloat(inputs.items);
        const price = safeFloat(inputs.avgPrice);
        const total = items * price;
        
        return {
          result: `₹${total.toLocaleString('en-IN')}`,
          explanation: `Total registry value`,
          steps: [
            `Items: ${items}`,
            `Avg Price: ₹${price}`,
            `Total: ₹${total}`
          ]
        };
      }
    };
  }

  // BABY GROWTH TRACKER
  if (id.includes('baby-growth')) {
    return {
      title: 'Baby Growth Tracker',
      description: 'Track baby weight gain.',
      inputs: [
        { name: 'birthWeight', label: 'Birth Weight (kg)', type: 'number', defaultValue: 3.2 },
        { name: 'currentWeight', label: 'Current Weight (kg)', type: 'number', defaultValue: 6.5 },
        { name: 'age', label: 'Age (months)', type: 'number', defaultValue: 4 },
      ],
      calculate: (inputs) => {
        const birth = safeFloat(inputs.birthWeight);
        const current = safeFloat(inputs.currentWeight);
        const age = safeFloat(inputs.age);
        
        const gain = current - birth;
        const monthlyGain = gain / age;
        
        return {
          result: `${gain.toFixed(2)} kg gained`,
          explanation: `Growth tracking`,
          steps: [
            `Birth: ${birth} kg`,
            `Current: ${current} kg`,
            `Total gain: ${gain.toFixed(2)} kg`,
            `Avg gain: ${monthlyGain.toFixed(2)} kg/month`
          ]
        };
      }
    };
  }

  // BABY SLEEP SCHEDULE
  if (id.includes('baby-sleep')) {
    return {
      title: 'Baby Sleep Schedule',
      description: 'Track sleep duration.',
      inputs: [
        { name: 'night', label: 'Night Sleep (hours)', type: 'number', defaultValue: 10 },
        { name: 'naps', label: 'Day Naps (hours)', type: 'number', defaultValue: 4 },
      ],
      calculate: (inputs) => {
        const night = safeFloat(inputs.night);
        const naps = safeFloat(inputs.naps);
        const total = night + naps;
        
        return {
          result: `${total} hours/day`,
          explanation: `Total sleep time`,
          steps: [
            `Night: ${night} hours`,
            `Naps: ${naps} hours`,
            `Total: ${total} hours`
          ]
        };
      }
    };
  }

  // VACCINATION SCHEDULE
  if (id.includes('vaccination-schedule')) {
    return {
      title: 'Vaccination Schedule',
      description: 'Check due vaccinations.',
      inputs: [
        { name: 'age', label: 'Baby Age (weeks)', type: 'number', defaultValue: 6 },
      ],
      calculate: (inputs) => {
        const age = safeFloat(inputs.age);
        let due = 'None';
        
        if (age >= 0 && age < 6) due = 'Birth Dose (BCG, Hep B, OPV)';
        else if (age >= 6 && age < 10) due = '6 Weeks (DTwP, IPV, Hep B, Hib, Rotavirus)';
        else if (age >= 10 && age < 14) due = '10 Weeks (DTwP, IPV, Hib, Rotavirus)';
        else if (age >= 14 && age < 24) due = '14 Weeks (DTwP, IPV, Hib, Rotavirus)';
        else due = 'Check with Pediatrician';
        
        return {
          result: due,
          explanation: `Vaccinations due at ${age} weeks`,
          steps: [
            `Age: ${age} weeks`,
            `Due: ${due}`
          ]
        };
      }
    };
  }

  // BABY PRODUCT BUDGET
  if (id.includes('baby-product')) {
    return {
      title: 'Baby Product Budget',
      description: 'Estimate baby gear cost.',
      inputs: [
        { name: 'stroller', label: 'Stroller (₹)', type: 'number', defaultValue: 8000 },
        { name: 'crib', label: 'Crib (₹)', type: 'number', defaultValue: 10000 },
        { name: 'clothes', label: 'Clothes (₹)', type: 'number', defaultValue: 5000 },
        { name: 'toys', label: 'Toys (₹)', type: 'number', defaultValue: 2000 },
      ],
      calculate: (inputs) => {
        const total = safeFloat(inputs.stroller) + safeFloat(inputs.crib) + safeFloat(inputs.clothes) + safeFloat(inputs.toys);
        
        return {
          result: `₹${total.toLocaleString('en-IN')}`,
          explanation: `Total baby gear cost`,
          steps: [
            `Stroller: ₹${inputs.stroller}`,
            `Crib: ₹${inputs.crib}`,
            `Clothes: ₹${inputs.clothes}`,
            `Toys: ₹${inputs.toys}`,
            `Total: ₹${total.toLocaleString('en-IN')}`
          ]
        };
      }
    };
  }

  // BABY MILESTONE TRACKER
  if (id.includes('baby-milestone')) {
    return {
      title: 'Baby Milestone Tracker',
      description: 'Check expected milestones.',
      inputs: [
        { name: 'age', label: 'Age (months)', type: 'number', defaultValue: 6 },
      ],
      calculate: (inputs) => {
        const age = safeFloat(inputs.age);
        let milestone = '';
        
        if (age < 3) milestone = 'Lifting head, smiling';
        else if (age < 6) milestone = 'Rolling over, reaching for objects';
        else if (age < 9) milestone = 'Sitting without support, babbling';
        else if (age < 12) milestone = 'Crawling, standing with support';
        else milestone = 'Walking, first words';
        
        return {
          result: milestone,
          explanation: `Expected milestones at ${age} months`,
          steps: [
            `Age: ${age} months`,
            `Milestone: ${milestone}`
          ]
        };
      }
    };
  }

  // BABY NAME NUMEROLOGY
  if (id.includes('baby-name')) {
    return {
      title: 'Baby Name Numerology',
      description: 'Calculate name number.',
      inputs: [
        { name: 'name', label: 'Baby Name', type: 'text', defaultValue: 'AARAV' },
      ],
      calculate: (inputs) => {
        const name = (inputs.name || '').toUpperCase().replace(/[^A-Z]/g, '');
        const values: Record<string, number> = {
          A:1, I:1, J:1, Q:1, Y:1,
          B:2, K:2, R:2,
          C:3, G:3, L:3, S:3,
          D:4, M:4, T:4,
          E:5, H:5, N:5, X:5,
          U:6, V:6, W:6,
          O:7, Z:7,
          F:8, P:8
        };
        
        let sum = 0;
        for (let i = 0; i < name.length; i++) {
          sum += values[name[i]] || 0;
        }
        
        while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
          let temp = 0;
          while (sum > 0) {
            temp += sum % 10;
            sum = Math.floor(sum / 10);
          }
          sum = temp;
        }
        
        return {
          result: `Number ${sum}`,
          explanation: `Numerology for ${name}`,
          steps: [
            `Name: ${name}`,
            `Sum: ${sum}`
          ]
        };
      }
    };
  }

  // AGE CALCULATOR
  if (id.includes('age-calculator')) {
    return {
      title: 'Age Calculator',
      description: 'Calculate age from date of birth.',
      inputs: [
        { name: 'dob', label: 'Date of Birth', type: 'date', defaultValue: '1990-01-01' },
      ],
      calculate: (inputs) => {
        const dob = new Date(inputs.dob);
        const now = new Date();
        
        let years = now.getFullYear() - dob.getFullYear();
        let months = now.getMonth() - dob.getMonth();
        let days = now.getDate() - dob.getDate();
        
        if (days < 0) {
          months--;
          days += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
        }
        if (months < 0) {
          years--;
          months += 12;
        }
        
        return {
          result: `${years} years, ${months} months, ${days} days`,
          explanation: `Your age today`,
          steps: [
            `DOB: ${inputs.dob}`,
            `Today: ${now.toISOString().split('T')[0]}`,
            `Age: ${years}y ${months}m ${days}d`
          ]
        };
      }
    };
  }

  // DAY COUNTER
  if (id.includes('day-counter')) {
    return {
      title: 'Day Counter',
      description: 'Count days between two dates.',
      inputs: [
        { name: 'start', label: 'Start Date', type: 'date', defaultValue: '2024-01-01' },
        { name: 'end', label: 'End Date', type: 'date', defaultValue: '2024-12-31' },
      ],
      calculate: (inputs) => {
        const start = new Date(inputs.start);
        const end = new Date(inputs.end);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        
        return {
          result: `${diffDays} days`,
          explanation: `Duration between dates`,
          steps: [
            `Start: ${inputs.start}`,
            `End: ${inputs.end}`,
            `Difference: ${diffDays} days`
          ]
        };
      }
    };
  }

  // FUEL COST CALCULATOR
  if (id.includes('fuel-cost')) {
    return {
      title: 'Fuel Cost Calculator',
      description: 'Calculate trip fuel cost.',
      inputs: [
        { name: 'distance', label: 'Distance (km)', type: 'number', defaultValue: 100 },
        { name: 'mileage', label: 'Mileage (km/L)', type: 'number', defaultValue: 15 },
        { name: 'price', label: 'Fuel Price (₹/L)', type: 'number', defaultValue: 100 },
      ],
      calculate: (inputs) => {
        const dist = safeFloat(inputs.distance);
        const mileage = safeFloat(inputs.mileage);
        const price = safeFloat(inputs.price);
        
        const fuel = dist / mileage;
        const cost = fuel * price;
        
        return {
          result: `₹${cost.toFixed(0)}`,
          explanation: `Fuel cost for ${dist} km`,
          steps: [
            `Fuel needed: ${fuel.toFixed(1)} Liters`,
            `Cost: ₹${cost.toFixed(0)}`
          ]
        };
      }
    };
  }

  // TRIP COST CALCULATOR
  if (id.includes('trip-cost')) {
    return {
      title: 'Trip Cost Calculator',
      description: 'Calculate total trip expenses.',
      inputs: [
        { name: 'fuel', label: 'Fuel Cost (₹)', type: 'number', defaultValue: 2000 },
        { name: 'tolls', label: 'Tolls (₹)', type: 'number', defaultValue: 500 },
        { name: 'food', label: 'Food (₹)', type: 'number', defaultValue: 1000 },
        { name: 'stay', label: 'Stay (₹)', type: 'number', defaultValue: 3000 },
      ],
      calculate: (inputs) => {
        const total = safeFloat(inputs.fuel) + safeFloat(inputs.tolls) + safeFloat(inputs.food) + safeFloat(inputs.stay);
        
        return {
          result: `₹${total}`,
          explanation: `Total trip cost`,
          steps: [
            `Fuel: ₹${inputs.fuel}`,
            `Tolls: ₹${inputs.tolls}`,
            `Food: ₹${inputs.food}`,
            `Stay: ₹${inputs.stay}`,
            `Total: ₹${total}`
          ]
        };
      }
    };
  }

  // MILEAGE TRACKER
  if (id.includes('mileage-tracker')) {
    return {
      title: 'Mileage Tracker',
      description: 'Calculate vehicle mileage.',
      inputs: [
        { name: 'distance', label: 'Distance Driven (km)', type: 'number', defaultValue: 500 },
        { name: 'fuel', label: 'Fuel Consumed (L)', type: 'number', defaultValue: 30 },
      ],
      calculate: (inputs) => {
        const dist = safeFloat(inputs.distance);
        const fuel = safeFloat(inputs.fuel);
        const mileage = dist / fuel;
        
        return {
          result: `${mileage.toFixed(1)} km/L`,
          explanation: `Vehicle mileage`,
          steps: [
            `Distance: ${dist} km`,
            `Fuel: ${fuel} L`,
            `Mileage: ${mileage.toFixed(1)} km/L`
          ]
        };
      }
    };
  }

  // CAR MAINTENANCE COST
  if (id.includes('car-maintenance')) {
    return {
      title: 'Car Maintenance Cost',
      description: 'Estimate annual maintenance.',
      inputs: [
        { name: 'service', label: 'Service Cost (₹)', type: 'number', defaultValue: 5000 },
        { name: 'repairs', label: 'Repairs (₹)', type: 'number', defaultValue: 2000 },
        { name: 'insurance', label: 'Insurance (₹)', type: 'number', defaultValue: 10000 },
        { name: 'tyres', label: 'Tyres/Oil (₹)', type: 'number', defaultValue: 3000 },
      ],
      calculate: (inputs) => {
        const total = safeFloat(inputs.service) + safeFloat(inputs.repairs) + safeFloat(inputs.insurance) + safeFloat(inputs.tyres);
        
        return {
          result: `₹${total}`,
          explanation: `Annual maintenance cost`,
          steps: [
            `Service: ₹${inputs.service}`,
            `Repairs: ₹${inputs.repairs}`,
            `Insurance: ₹${inputs.insurance}`,
            `Consumables: ₹${inputs.tyres}`,
            `Total: ₹${total}`
          ]
        };
      }
    };
  }

  // TOLL CALCULATOR
  if (id.includes('toll-calculator')) {
    return {
      title: 'Toll Calculator',
      description: 'Estimate toll charges.',
      inputs: [
        { name: 'distance', label: 'Highway Distance (km)', type: 'number', defaultValue: 200 },
        { name: 'rate', label: 'Avg Toll Rate (₹/km)', type: 'number', defaultValue: 2 },
      ],
      calculate: (inputs) => {
        const dist = safeFloat(inputs.distance);
        const rate = safeFloat(inputs.rate);
        const cost = dist * rate;
        
        return {
          result: `₹${cost.toFixed(0)}`,
          explanation: `Estimated toll charges`,
          steps: [
            `Distance: ${dist} km`,
            `Rate: ₹${rate}/km`,
            `Total: ₹${cost.toFixed(0)}`
          ]
        };
      }
    };
  }

  // DISTANCE CALCULATOR
  if (id.includes('distance-calculator')) {
    return {
      title: 'Distance Calculator',
      description: 'Calculate distance from speed and time.',
      inputs: [
        { name: 'speed', label: 'Speed (km/h)', type: 'number', defaultValue: 60 },
        { name: 'time', label: 'Time (hours)', type: 'number', defaultValue: 2.5 },
      ],
      calculate: (inputs) => {
        const speed = safeFloat(inputs.speed);
        const time = safeFloat(inputs.time);
        const dist = speed * time;
        
        return {
          result: `${dist.toFixed(1)} km`,
          explanation: `Total distance covered`,
          steps: [
            `Speed: ${speed} km/h`,
            `Time: ${time} hours`,
            `Distance: ${dist.toFixed(1)} km`
          ]
        };
      }
    };
  }

  // CAB FARE ESTIMATOR
  if (id.includes('cab-fare')) {
    return {
      title: 'Cab Fare Estimator',
      description: 'Estimate taxi fare.',
      inputs: [
        { name: 'distance', label: 'Distance (km)', type: 'number', defaultValue: 15 },
        { name: 'base', label: 'Base Fare (₹)', type: 'number', defaultValue: 50 },
        { name: 'rate', label: 'Rate per km (₹)', type: 'number', defaultValue: 12 },
        { name: 'time', label: 'Time Fare (₹)', type: 'number', defaultValue: 30 },
      ],
      calculate: (inputs) => {
        const dist = safeFloat(inputs.distance);
        const base = safeFloat(inputs.base);
        const rate = safeFloat(inputs.rate);
        const time = safeFloat(inputs.time);
        
        const fare = base + (dist * rate) + time;
        
        return {
          result: `₹${fare.toFixed(0)}`,
          explanation: `Estimated cab fare`,
          steps: [
            `Base fare: ₹${base}`,
            `Distance fare: ${dist} × ₹${rate} = ₹${dist * rate}`,
            `Time fare: ₹${time}`,
            `Total: ₹${fare.toFixed(0)}`
          ]
        };
      }
    };
  }

  // RENT VS BUY CALCULATOR
  if (id.includes('rent-vs-buy')) {
    return {
      title: 'Rent vs Buy Calculator',
      description: 'Compare renting vs buying cost.',
      inputs: [
        { name: 'rent', label: 'Monthly Rent (₹)', type: 'number', defaultValue: 20000 },
        { name: 'emi', label: 'Monthly EMI (₹)', type: 'number', defaultValue: 45000 },
        { name: 'years', label: 'Duration (Years)', type: 'number', defaultValue: 10 },
      ],
      calculate: (inputs) => {
        const rent = safeFloat(inputs.rent);
        const emi = safeFloat(inputs.emi);
        const years = safeFloat(inputs.years);
        const months = years * 12;
        
        const totalRent = rent * months;
        const totalEmi = emi * months;
        const diff = totalEmi - totalRent;
        
        return {
          result: diff > 0 ? `Renting saves ₹${diff.toLocaleString('en-IN')}` : `Buying saves ₹${Math.abs(diff).toLocaleString('en-IN')}`,
          explanation: `Cost comparison over ${years} years`,
          steps: [
            `Total Rent: ₹${totalRent.toLocaleString('en-IN')}`,
            `Total EMI: ₹${totalEmi.toLocaleString('en-IN')}`,
            `Difference: ₹${Math.abs(diff).toLocaleString('en-IN')}`
          ]
        };
      }
    };
  }

  // ROOM SIZE CALCULATOR
  if (id.includes('room-size')) {
    return {
      title: 'Room Size Calculator',
      description: 'Calculate room area and volume.',
      inputs: [
        { name: 'length', label: 'Length (ft)', type: 'number', defaultValue: 12 },
        { name: 'width', label: 'Width (ft)', type: 'number', defaultValue: 10 },
        { name: 'height', label: 'Height (ft)', type: 'number', defaultValue: 10 },
      ],
      calculate: (inputs) => {
        const l = safeFloat(inputs.length);
        const w = safeFloat(inputs.width);
        const h = safeFloat(inputs.height);
        
        const area = l * w;
        const volume = l * w * h;
        
        return {
          result: `${area} sq ft`,
          explanation: `Room dimensions`,
          steps: [
            `Floor Area: ${area} sq ft`,
            `Wall Area (approx): ${(l+w)*2*h} sq ft`,
            `Volume: ${volume} cu ft`
          ]
        };
      }
    };
  }

  // PAINT CALCULATOR
  if (id.includes('paint-calculator')) {
    return {
      title: 'Paint Calculator',
      description: 'Estimate paint required.',
      inputs: [
        { name: 'area', label: 'Wall Area (sq ft)', type: 'number', defaultValue: 500 },
        { name: 'coverage', label: 'Paint Coverage (sq ft/L)', type: 'number', defaultValue: 100 },
        { name: 'coats', label: 'Number of Coats', type: 'number', defaultValue: 2 },
      ],
      calculate: (inputs) => {
        const area = safeFloat(inputs.area);
        const coverage = safeFloat(inputs.coverage);
        const coats = safeFloat(inputs.coats);
        
        const liters = (area / coverage) * coats;
        
        return {
          result: `${liters.toFixed(1)} Liters`,
          explanation: `Paint required for ${coats} coats`,
          steps: [
            `Total Area: ${area} sq ft`,
            `Coverage: ${coverage} sq ft/L`,
            `Required: ${liters.toFixed(1)} Liters`
          ]
        };
      }
    };
  }

  // TILE CALCULATOR
  if (id.includes('tile-calculator')) {
    return {
      title: 'Tile Calculator',
      description: 'Calculate tiles needed.',
      inputs: [
        { name: 'area', label: 'Floor Area (sq ft)', type: 'number', defaultValue: 100 },
        { name: 'tileL', label: 'Tile Length (inch)', type: 'number', defaultValue: 24 },
        { name: 'tileW', label: 'Tile Width (inch)', type: 'number', defaultValue: 24 },
      ],
      calculate: (inputs) => {
        const area = safeFloat(inputs.area);
        const tl = safeFloat(inputs.tileL) / 12; // convert to ft
        const tw = safeFloat(inputs.tileW) / 12; // convert to ft
        
        const tileArea = tl * tw;
        const tiles = Math.ceil((area * 1.1) / tileArea); // 10% wastage
        
        return {
          result: `${tiles} tiles`,
          explanation: `Including 10% wastage`,
          steps: [
            `Floor Area: ${area} sq ft`,
            `Tile Area: ${tileArea.toFixed(2)} sq ft`,
            `Tiles needed: ${tiles}`
          ]
        };
      }
    };
  }

  // ELECTRICITY BILL CALCULATOR
  if (id.includes('electricity-bill')) {
    return {
      title: 'Electricity Bill Calculator',
      description: 'Estimate monthly electricity bill.',
      inputs: [
        { name: 'units', label: 'Units Consumed (kWh)', type: 'number', defaultValue: 200 },
        { name: 'rate', label: 'Rate per Unit (₹)', type: 'number', defaultValue: 7 },
        { name: 'fixed', label: 'Fixed Charges (₹)', type: 'number', defaultValue: 100 },
      ],
      calculate: (inputs) => {
        const units = safeFloat(inputs.units);
        const rate = safeFloat(inputs.rate);
        const fixed = safeFloat(inputs.fixed);
        
        const energyCharge = units * rate;
        const total = energyCharge + fixed;
        
        return {
          result: `₹${total.toFixed(0)}`,
          explanation: `Estimated bill`,
          steps: [
            `Energy Charges: ${units} × ₹${rate} = ₹${energyCharge}`,
            `Fixed Charges: ₹${fixed}`,
            `Total: ₹${total.toFixed(0)}`
          ]
        };
      }
    };
  }

  // AC POWER CONSUMPTION
  if (id.includes('ac-power')) {
    return {
      title: 'AC Power Consumption',
      description: 'Calculate AC running cost.',
      inputs: [
        { name: 'ton', label: 'AC Capacity (Ton)', type: 'number', defaultValue: 1.5 },
        { name: 'star', label: 'Star Rating', type: 'select', options: ['3 Star', '5 Star'], defaultValue: '3 Star' },
        { name: 'hours', label: 'Usage Hours/Day', type: 'number', defaultValue: 8 },
        { name: 'rate', label: 'Rate per Unit (₹)', type: 'number', defaultValue: 7 },
      ],
      calculate: (inputs) => {
        const ton = safeFloat(inputs.ton);
        const hours = safeFloat(inputs.hours);
        const rate = safeFloat(inputs.rate);
        const is5Star = inputs.star === '5 Star';
        
        // Approx watts: 1.5 Ton 3 Star ~ 1600W, 5 Star ~ 1450W
        const watts = ton * (is5Star ? 950 : 1100); 
        
        const dailyUnits = (watts * hours) / 1000;
        const monthlyCost = dailyUnits * 30 * rate;
        
        return {
          result: `₹${monthlyCost.toFixed(0)}/month`,
          explanation: `Estimated AC cost`,
          steps: [
            `Power: ~${watts} Watts`,
            `Daily Units: ${dailyUnits.toFixed(2)} kWh`,
            `Monthly Cost: ₹${monthlyCost.toFixed(0)}`
          ]
        };
      }
    };
  }

  // CARPET AREA CALCULATOR
  if (id.includes('carpet-area')) {
    return {
      title: 'Carpet Area Calculator',
      description: 'Calculate usable floor area.',
      inputs: [
        { name: 'superArea', label: 'Super Built-up Area (sq ft)', type: 'number', defaultValue: 1200 },
        { name: 'loading', label: 'Loading Factor (%)', type: 'number', defaultValue: 30 },
      ],
      calculate: (inputs) => {
        const superArea = safeFloat(inputs.superArea);
        const loading = safeFloat(inputs.loading);
        
        const carpetArea = superArea * (1 - (loading / 100));
        
        return {
          result: `${carpetArea.toFixed(0)} sq ft`,
          explanation: `Usable carpet area`,
          steps: [
            `Super Area: ${superArea} sq ft`,
            `Loading: ${loading}%`,
            `Carpet Area: ${carpetArea.toFixed(0)} sq ft`
          ]
        };
      }
    };
  }

  // DATA PLAN CALCULATOR
  if (id.includes('data-plan')) {
    return {
      title: 'Data Plan Calculator',
      description: 'Estimate data usage cost.',
      inputs: [
        { name: 'usage', label: 'Daily Usage (GB)', type: 'number', defaultValue: 1.5 },
        { name: 'days', label: 'Validity (Days)', type: 'number', defaultValue: 28 },
        { name: 'price', label: 'Plan Price (₹)', type: 'number', defaultValue: 299 },
      ],
      calculate: (inputs) => {
        const usage = safeFloat(inputs.usage);
        const days = safeFloat(inputs.days);
        const price = safeFloat(inputs.price);
        
        const totalData = usage * days;
        const costPerGB = price / totalData;
        
        return {
          result: `₹${costPerGB.toFixed(2)}/GB`,
          explanation: `Cost efficiency`,
          steps: [
            `Total Data: ${totalData} GB`,
            `Plan Price: ₹${price}`,
            `Cost per GB: ₹${costPerGB.toFixed(2)}`
          ]
        };
      }
    };
  }

  // WIFI COVERAGE CALCULATOR
  if (id.includes('wifi-coverage')) {
    return {
      title: 'WiFi Coverage Calculator',
      description: 'Estimate router range.',
      inputs: [
        { name: 'power', label: 'Router Power (mW)', type: 'number', defaultValue: 100 },
        { name: 'walls', label: 'Number of Walls', type: 'number', defaultValue: 2 },
      ],
      calculate: (inputs) => {
        const power = safeFloat(inputs.power);
        const walls = safeFloat(inputs.walls);
        
        // Very rough estimation
        let range = Math.sqrt(power) * 3; // meters
        range = range * Math.pow(0.7, walls); // 30% loss per wall
        
        return {
          result: `${range.toFixed(1)} meters`,
          explanation: `Estimated effective range`,
          steps: [
            `Base Range: ${(Math.sqrt(power) * 3).toFixed(1)}m`,
            `Walls: ${walls}`,
            `Effective Range: ${range.toFixed(1)}m`
          ]
        };
      }
    };
  }

  // PHONE BILL ESTIMATOR
  if (id.includes('phone-bill')) {
    return {
      title: 'Phone Bill Estimator',
      description: 'Estimate monthly bill.',
      inputs: [
        { name: 'plan', label: 'Plan Rental (₹)', type: 'number', defaultValue: 499 },
        { name: 'extra', label: 'Extra Usage (₹)', type: 'number', defaultValue: 50 },
        { name: 'tax', label: 'Tax (%)', type: 'number', defaultValue: 18 },
      ],
      calculate: (inputs) => {
        const plan = safeFloat(inputs.plan);
        const extra = safeFloat(inputs.extra);
        const tax = safeFloat(inputs.tax) / 100;
        
        const subtotal = plan + extra;
        const taxAmt = subtotal * tax;
        const total = subtotal + taxAmt;
        
        return {
          result: `₹${total.toFixed(0)}`,
          explanation: `Total monthly bill`,
          steps: [
            `Subtotal: ₹${subtotal}`,
            `Tax: ₹${taxAmt.toFixed(0)}`,
            `Total: ₹${total.toFixed(0)}`
          ]
        };
      }
    };
  }

  // PREPAID VS POSTPAID
  if (id.includes('prepaid-vs-postpaid')) {
    return {
      title: 'Prepaid vs Postpaid',
      description: 'Compare plan costs.',
      inputs: [
        { name: 'prepaid', label: 'Prepaid (28 days) (₹)', type: 'number', defaultValue: 299 },
        { name: 'postpaid', label: 'Postpaid (Monthly) (₹)', type: 'number', defaultValue: 399 },
      ],
      calculate: (inputs) => {
        const pre = safeFloat(inputs.prepaid);
        const post = safeFloat(inputs.postpaid);
        
        // Normalize to 1 year (365 days)
        const preYear = (pre / 28) * 365;
        const postYear = post * 12;
        
        const diff = postYear - preYear;
        
        return {
          result: diff > 0 ? `Prepaid saves ₹${diff.toFixed(0)}/yr` : `Postpaid saves ₹${Math.abs(diff).toFixed(0)}/yr`,
          explanation: `Annual cost comparison`,
          steps: [
            `Prepaid Annual: ₹${preYear.toFixed(0)}`,
            `Postpaid Annual: ₹${postYear.toFixed(0)}`,
            `Difference: ₹${Math.abs(diff).toFixed(0)}`
          ]
        };
      }
    };
  }

  // WEDDING BUDGET CALCULATOR
  if (id.includes('wedding-budget')) {
    return {
      title: 'Wedding Budget Calculator',
      description: 'Plan total wedding expenses.',
      inputs: [
        { name: 'venue', label: 'Venue & Food (₹)', type: 'number', defaultValue: 500000 },
        { name: 'attire', label: 'Attire & Makeup (₹)', type: 'number', defaultValue: 100000 },
        { name: 'decor', label: 'Decoration (₹)', type: 'number', defaultValue: 150000 },
        { name: 'photo', label: 'Photography (₹)', type: 'number', defaultValue: 100000 },
        { name: 'misc', label: 'Miscellaneous (₹)', type: 'number', defaultValue: 50000 },
      ],
      calculate: (inputs) => {
        const total = safeFloat(inputs.venue) + safeFloat(inputs.attire) + safeFloat(inputs.decor) + safeFloat(inputs.photo) + safeFloat(inputs.misc);
        
        return {
          result: `₹${total.toLocaleString('en-IN')}`,
          explanation: `Total estimated budget`,
          steps: [
            `Venue: ₹${inputs.venue}`,
            `Attire: ₹${inputs.attire}`,
            `Decor: ₹${inputs.decor}`,
            `Photo: ₹${inputs.photo}`,
            `Misc: ₹${inputs.misc}`,
            `Total: ₹${total.toLocaleString('en-IN')}`
          ]
        };
      }
    };
  }

  // GUEST LIST CALCULATOR
  if (id.includes('guest-list')) {
    return {
      title: 'Guest List Calculator',
      description: 'Estimate total guests.',
      inputs: [
        { name: 'families', label: 'Number of Families', type: 'number', defaultValue: 100 },
        { name: 'avgSize', label: 'Avg Family Size', type: 'number', defaultValue: 3 },
        { name: 'friends', label: 'Friends (Individual)', type: 'number', defaultValue: 50 },
      ],
      calculate: (inputs) => {
        const families = safeFloat(inputs.families);
        const size = safeFloat(inputs.avgSize);
        const friends = safeFloat(inputs.friends);
        
        const total = (families * size) + friends;
        
        return {
          result: `${total} guests`,
          explanation: `Estimated attendance`,
          steps: [
            `Family members: ${families} × ${size} = ${families * size}`,
            `Friends: ${friends}`,
            `Total: ${total}`
          ]
        };
      }
    };
  }

  // VENUE COST CALCULATOR
  if (id.includes('venue-cost')) {
    return {
      title: 'Venue Cost Calculator',
      description: 'Calculate venue rental.',
      inputs: [
        { name: 'rent', label: 'Base Rent (₹)', type: 'number', defaultValue: 100000 },
        { name: 'days', label: 'Number of Days', type: 'number', defaultValue: 2 },
        { name: 'tax', label: 'Tax (%)', type: 'number', defaultValue: 18 },
      ],
      calculate: (inputs) => {
        const rent = safeFloat(inputs.rent);
        const days = safeFloat(inputs.days);
        const tax = safeFloat(inputs.tax) / 100;
        
        const base = rent * days;
        const taxAmt = base * tax;
        const total = base + taxAmt;
        
        return {
          result: `₹${total.toLocaleString('en-IN')}`,
          explanation: `Total venue cost`,
          steps: [
            `Base Rent: ₹${base}`,
            `Tax: ₹${taxAmt.toFixed(0)}`,
            `Total: ₹${total.toLocaleString('en-IN')}`
          ]
        };
      }
    };
  }

  // CATERING COST CALCULATOR
  if (id.includes('catering-cost')) {
    return {
      title: 'Catering Cost Calculator',
      description: 'Calculate food expenses.',
      inputs: [
        { name: 'guests', label: 'Number of Guests', type: 'number', defaultValue: 300 },
        { name: 'plateCost', label: 'Cost per Plate (₹)', type: 'number', defaultValue: 800 },
      ],
      calculate: (inputs) => {
        const guests = safeFloat(inputs.guests);
        const cost = safeFloat(inputs.plateCost);
        
        const total = guests * cost;
        
        return {
          result: `₹${total.toLocaleString('en-IN')}`,
          explanation: `Total catering cost`,
          steps: [
            `Guests: ${guests}`,
            `Per Plate: ₹${cost}`,
            `Total: ₹${total.toLocaleString('en-IN')}`
          ]
        };
      }
    };
  }

  // DECORATION BUDGET
  if (id.includes('decoration-budget')) {
    return {
      title: 'Decoration Budget',
      description: 'Estimate decoration cost.',
      inputs: [
        { name: 'stage', label: 'Stage Decor (₹)', type: 'number', defaultValue: 50000 },
        { name: 'entrance', label: 'Entrance Decor (₹)', type: 'number', defaultValue: 20000 },
        { name: 'lighting', label: 'Lighting (₹)', type: 'number', defaultValue: 30000 },
        { name: 'flowers', label: 'Flowers (₹)', type: 'number', defaultValue: 25000 },
      ],
      calculate: (inputs) => {
        const total = safeFloat(inputs.stage) + safeFloat(inputs.entrance) + safeFloat(inputs.lighting) + safeFloat(inputs.flowers);
        
        return {
          result: `₹${total.toLocaleString('en-IN')}`,
          explanation: `Total decoration cost`,
          steps: [
            `Stage: ₹${inputs.stage}`,
            `Entrance: ₹${inputs.entrance}`,
            `Lighting: ₹${inputs.lighting}`,
            `Flowers: ₹${inputs.flowers}`,
            `Total: ₹${total.toLocaleString('en-IN')}`
          ]
        };
      }
    };
  }

  // HONEYMOON BUDGET
  if (id.includes('honeymoon-budget')) {
    return {
      title: 'Honeymoon Budget',
      description: 'Plan honeymoon expenses.',
      inputs: [
        { name: 'flights', label: 'Flights (₹)', type: 'number', defaultValue: 60000 },
        { name: 'hotels', label: 'Hotels (₹)', type: 'number', defaultValue: 80000 },
        { name: 'food', label: 'Food & Drink (₹)', type: 'number', defaultValue: 40000 },
        { name: 'activities', label: 'Activities (₹)', type: 'number', defaultValue: 30000 },
      ],
      calculate: (inputs) => {
        const total = safeFloat(inputs.flights) + safeFloat(inputs.hotels) + safeFloat(inputs.food) + safeFloat(inputs.activities);
        
        return {
          result: `₹${total.toLocaleString('en-IN')}`,
          explanation: `Total honeymoon budget`,
          steps: [
            `Flights: ₹${inputs.flights}`,
            `Hotels: ₹${inputs.hotels}`,
            `Food: ₹${inputs.food}`,
            `Activities: ₹${inputs.activities}`,
            `Total: ₹${total.toLocaleString('en-IN')}`
          ]
        };
      }
    };
  }

  // BABY DUE DATE CALCULATOR
  if (id.includes('baby-due-date')) {
    return {
      title: 'Baby Due Date Calculator',
      description: 'Calculate estimated due date.',
      inputs: [
        { name: 'lmp', label: 'First Day of Last Period', type: 'date', defaultValue: '2024-01-01' },
        { name: 'cycle', label: 'Cycle Length (days)', type: 'number', defaultValue: 28 },
      ],
      calculate: (inputs) => {
        const lmp = new Date(inputs.lmp);
        const cycle = safeFloat(inputs.cycle);
        
        // Naegele's Rule: LMP + 1 year - 3 months + 7 days
        // Adjusted for cycle length: + (cycle - 28) days
        
        const dueDate = new Date(lmp);
        dueDate.setDate(dueDate.getDate() + 280 + (cycle - 28));
        
        return {
          result: dueDate.toDateString(),
          explanation: `Estimated Due Date`,
          steps: [
            `LMP: ${inputs.lmp}`,
            `Cycle: ${cycle} days`,
            `Gestational Age: 280 days`,
            `Due Date: ${dueDate.toDateString()}`
          ]
        };
      }
    };
  }

  // DIAPER COST CALCULATOR
  if (id.includes('diaper-cost')) {
    return {
      title: 'Diaper Cost Calculator',
      description: 'Estimate diaper expenses.',
      inputs: [
        { name: 'perDay', label: 'Diapers per Day', type: 'number', defaultValue: 6 },
        { name: 'cost', label: 'Cost per Diaper (₹)', type: 'number', defaultValue: 12 },
        { name: 'months', label: 'Duration (Months)', type: 'number', defaultValue: 12 },
      ],
      calculate: (inputs) => {
        const perDay = safeFloat(inputs.perDay);
        const cost = safeFloat(inputs.cost);
        const months = safeFloat(inputs.months);
        
        const totalDiapers = perDay * 30 * months;
        const totalCost = totalDiapers * cost;
        
        return {
          result: `₹${totalCost.toLocaleString('en-IN')}`,
          explanation: `Total diaper cost for ${months} months`,
          steps: [
            `Daily Cost: ₹${perDay * cost}`,
            `Monthly Cost: ₹${perDay * 30 * cost}`,
            `Total Diapers: ${totalDiapers}`,
            `Total Cost: ₹${totalCost.toLocaleString('en-IN')}`
          ]
        };
      }
    };
  }

  // BABY FOOD CALCULATOR
  if (id.includes('baby-food')) {
    return {
      title: 'Baby Food Calculator',
      description: 'Estimate baby food cost.',
      inputs: [
        { name: 'jars', label: 'Jars/Pouches per Day', type: 'number', defaultValue: 3 },
        { name: 'price', label: 'Price per Unit (₹)', type: 'number', defaultValue: 80 },
      ],
      calculate: (inputs) => {
        const jars = safeFloat(inputs.jars);
        const price = safeFloat(inputs.price);
        
        const daily = jars * price;
        const monthly = daily * 30;
        
        return {
          result: `₹${monthly.toLocaleString('en-IN')}/month`,
          explanation: `Monthly food cost`,
          steps: [
            `Daily: ₹${daily}`,
            `Monthly: ₹${monthly.toLocaleString('en-IN')}`
          ]
        };
      }
    };
  }

  // CHILD EDUCATION COST
  if (id.includes('child-education')) {
    return {
      title: 'Child Education Cost',
      description: 'Estimate future education cost.',
      inputs: [
        { name: 'currentCost', label: 'Current Annual Fee (₹)', type: 'number', defaultValue: 100000 },
        { name: 'years', label: 'Years until College', type: 'number', defaultValue: 15 },
        { name: 'inflation', label: 'Education Inflation (%)', type: 'number', defaultValue: 10 },
      ],
      calculate: (inputs) => {
        const current = safeFloat(inputs.currentCost);
        const years = safeFloat(inputs.years);
        const inflation = safeFloat(inputs.inflation) / 100;
        
        const futureCost = current * Math.pow(1 + inflation, years);
        
        return {
          result: `₹${futureCost.toFixed(0)}`,
          explanation: `Future annual cost`,
          steps: [
            `Current Cost: ₹${current}`,
            `Years: ${years}`,
            `Inflation: ${inputs.inflation}%`,
            `Future Cost: ₹${futureCost.toFixed(0)}`
          ]
        };
      }
    };
  }

  // DAYCARE COST CALCULATOR
  if (id.includes('daycare-cost')) {
    return {
      title: 'Daycare Cost Calculator',
      description: 'Calculate annual daycare cost.',
      inputs: [
        { name: 'monthly', label: 'Monthly Fee (₹)', type: 'number', defaultValue: 8000 },
        { name: 'registration', label: 'Registration Fee (₹)', type: 'number', defaultValue: 5000 },
      ],
      calculate: (inputs) => {
        const monthly = safeFloat(inputs.monthly);
        const reg = safeFloat(inputs.registration);
        
        const annual = (monthly * 12) + reg;
        
        return {
          result: `₹${annual.toLocaleString('en-IN')}`,
          explanation: `Annual daycare cost`,
          steps: [
            `Monthly: ₹${monthly}`,
            `Annual Fees: ₹${monthly * 12}`,
            `Registration: ₹${reg}`,
            `Total: ₹${annual.toLocaleString('en-IN')}`
          ]
        };
      }
    };
  }

  // FORMULA MILK CALCULATOR
  if (id.includes('formula-milk')) {
    return {
      title: 'Formula Milk Calculator',
      description: 'Estimate formula cost.',
      inputs: [
        { name: 'tins', label: 'Tins per Month', type: 'number', defaultValue: 4 },
        { name: 'price', label: 'Price per Tin (₹)', type: 'number', defaultValue: 800 },
      ],
      calculate: (inputs) => {
        const tins = safeFloat(inputs.tins);
        const price = safeFloat(inputs.price);
        
        const monthly = tins * price;
        const annual = monthly * 12;
        
        return {
          result: `₹${monthly.toLocaleString('en-IN')}/month`,
          explanation: `Formula milk cost`,
          steps: [
            `Monthly: ₹${monthly.toLocaleString('en-IN')}`,
            `Annual: ₹${annual.toLocaleString('en-IN')}`
          ]
        };
      }
    };
  }

  // TIP CALCULATOR
  if (id.includes('tip-calculator')) {
    return {
      title: 'Tip Calculator',
      description: 'Calculate tip and split bill.',
      inputs: [
        { name: 'bill', label: 'Bill Amount (₹)', type: 'number', defaultValue: 1000 },
        { name: 'tip', label: 'Tip (%)', type: 'number', defaultValue: 10 },
        { name: 'people', label: 'Split Between', type: 'number', defaultValue: 2 },
      ],
      calculate: (inputs) => {
        const bill = safeFloat(inputs.bill);
        const tipPct = safeFloat(inputs.tip);
        const people = safeFloat(inputs.people);
        
        const tipAmt = bill * (tipPct / 100);
        const total = bill + tipAmt;
        const perPerson = total / people;
        
        return {
          result: `₹${perPerson.toFixed(0)} per person`,
          explanation: `Total bill split`,
          steps: [
            `Bill: ₹${bill}`,
            `Tip (${tipPct}%): ₹${tipAmt.toFixed(0)}`,
            `Total: ₹${total.toFixed(0)}`,
            `Per Person: ₹${perPerson.toFixed(0)}`
          ]
        };
      }
    };
  }

  // RECIPE CONVERTER
  if (id.includes('recipe-converter')) {
    return {
      title: 'Recipe Converter',
      description: 'Scale recipe ingredients.',
      inputs: [
        { name: 'original', label: 'Original Servings', type: 'number', defaultValue: 4 },
        { name: 'desired', label: 'Desired Servings', type: 'number', defaultValue: 10 },
        { name: 'amount', label: 'Ingredient Amount', type: 'number', defaultValue: 200 },
      ],
      calculate: (inputs) => {
        const orig = safeFloat(inputs.original);
        const desired = safeFloat(inputs.desired);
        const amount = safeFloat(inputs.amount);
        
        const ratio = desired / orig;
        const newAmount = amount * ratio;
        
        return {
          result: `${newAmount.toFixed(1)}`,
          explanation: `Scaled amount`,
          steps: [
            `Ratio: ${desired} / ${orig} = ${ratio}`,
            `New Amount: ${amount} × ${ratio} = ${newAmount.toFixed(1)}`
          ]
        };
      }
    };
  }

  // SERVING SIZE CALCULATOR
  if (id.includes('serving-size')) {
    return {
      title: 'Serving Size Calculator',
      description: 'Adjust portion sizes.',
      inputs: [
        { name: 'weight', label: 'Total Weight (g)', type: 'number', defaultValue: 1000 },
        { name: 'servings', label: 'Number of Servings', type: 'number', defaultValue: 5 },
      ],
      calculate: (inputs) => {
        const weight = safeFloat(inputs.weight);
        const servings = safeFloat(inputs.servings);
        
        const size = weight / servings;
        
        return {
          result: `${size.toFixed(0)}g per serving`,
          explanation: `Portion size`,
          steps: [
            `Total Weight: ${weight}g`,
            `Servings: ${servings}`,
            `Size: ${size.toFixed(0)}g`
          ]
        };
      }
    };
  }

  // COOKING TIME CALCULATOR
  if (id.includes('cooking-time')) {
    return {
      title: 'Cooking Time Calculator',
      description: 'Estimate cooking time by weight.',
      inputs: [
        { name: 'weight', label: 'Weight (kg)', type: 'number', defaultValue: 2 },
        { name: 'timePerKg', label: 'Minutes per kg', type: 'number', defaultValue: 45 },
        { name: 'extra', label: 'Extra Time (mins)', type: 'number', defaultValue: 20 },
      ],
      calculate: (inputs) => {
        const weight = safeFloat(inputs.weight);
        const rate = safeFloat(inputs.timePerKg);
        const extra = safeFloat(inputs.extra);
        
        const total = (weight * rate) + extra;
        const hours = Math.floor(total / 60);
        const mins = total % 60;
        
        return {
          result: `${hours}h ${mins}m`,
          explanation: `Total cooking time`,
          steps: [
            `Base Time: ${weight}kg × ${rate}m = ${weight * rate}m`,
            `Extra Time: ${extra}m`,
            `Total: ${total}m`
          ]
        };
      }
    };
  }

  // UNIT CONVERTER
  if (id.includes('unit-converter')) {
    return {
      title: 'Unit Converter',
      description: 'Convert common units.',
      inputs: [
        { name: 'value', label: 'Value', type: 'number', defaultValue: 1 },
        { name: 'type', label: 'Type', type: 'select', options: ['Kg to Lbs', 'Lbs to Kg', 'Km to Miles', 'Miles to Km'], defaultValue: 'Kg to Lbs' },
      ],
      calculate: (inputs) => {
        const val = safeFloat(inputs.value);
        const type = inputs.type;
        let res = 0;
        let unit = '';
        
        if (type === 'Kg to Lbs') { res = val * 2.20462; unit = 'lbs'; }
        if (type === 'Lbs to Kg') { res = val / 2.20462; unit = 'kg'; }
        if (type === 'Km to Miles') { res = val * 0.621371; unit = 'miles'; }
        if (type === 'Miles to Km') { res = val / 0.621371; unit = 'km'; }
        
        return {
          result: `${res.toFixed(2)} ${unit}`,
          explanation: `Conversion result`,
          steps: [
            `Input: ${val}`,
            `Type: ${type}`,
            `Result: ${res.toFixed(2)} ${unit}`
          ]
        };
      }
    };
  }

  // TEMPERATURE CONVERTER
  if (id.includes('temperature-converter')) {
    return {
      title: 'Temperature Converter',
      description: 'Convert Celsius and Fahrenheit.',
      inputs: [
        { name: 'temp', label: 'Temperature', type: 'number', defaultValue: 37 },
        { name: 'type', label: 'Convert To', type: 'select', options: ['Fahrenheit', 'Celsius'], defaultValue: 'Fahrenheit' },
      ],
      calculate: (inputs) => {
        const temp = safeFloat(inputs.temp);
        const type = inputs.type;
        let res = 0;
        let unit = '';
        
        if (type === 'Fahrenheit') { 
          res = (temp * 9/5) + 32; 
          unit = '°F'; 
          return {
            result: `${res.toFixed(1)} ${unit}`,
            explanation: `Celsius to Fahrenheit`,
            steps: [`(${temp} × 9/5) + 32 = ${res.toFixed(1)}`]
          };
        } else {
          res = (temp - 32) * 5/9;
          unit = '°C';
          return {
            result: `${res.toFixed(1)} ${unit}`,
            explanation: `Fahrenheit to Celsius`,
            steps: [`(${temp} - 32) × 5/9 = ${res.toFixed(1)}`]
          };
        }
      }
    };
  }

  // CURRENCY CONVERTER (Simple)
  if (id.includes('currency-converter')) {
    return {
      title: 'Currency Converter',
      description: 'Simple currency conversion.',
      inputs: [
        { name: 'amount', label: 'Amount', type: 'number', defaultValue: 100 },
        { name: 'rate', label: 'Exchange Rate', type: 'number', defaultValue: 83 },
      ],
      calculate: (inputs) => {
        const amount = safeFloat(inputs.amount);
        const rate = safeFloat(inputs.rate);
        
        return {
          result: `${(amount * rate).toFixed(2)}`,
          explanation: `Converted amount`,
          steps: [
            `Amount: ${amount}`,
            `Rate: ${rate}`,
            `Total: ${(amount * rate).toFixed(2)}`
          ]
        };
      }
    };
  }

  // LENGTH CONVERTER
  if (id.includes('length-converter')) {
    return {
      title: 'Length Converter',
      description: 'Convert length units.',
      inputs: [
        { name: 'value', label: 'Value', type: 'number', defaultValue: 1 },
        { name: 'type', label: 'Conversion', type: 'select', options: ['Meter to Feet', 'Feet to Meter', 'Inch to Cm', 'Cm to Inch'], defaultValue: 'Meter to Feet' },
      ],
      calculate: (inputs) => {
        const val = safeFloat(inputs.value);
        const type = inputs.type;
        let res = 0;
        let unit = '';
        
        if (type === 'Meter to Feet') { res = val * 3.28084; unit = 'ft'; }
        if (type === 'Feet to Meter') { res = val / 3.28084; unit = 'm'; }
        if (type === 'Inch to Cm') { res = val * 2.54; unit = 'cm'; }
        if (type === 'Cm to Inch') { res = val / 2.54; unit = 'inch'; }
        
        return {
          result: `${res.toFixed(2)} ${unit}`,
          explanation: `Length conversion`,
          steps: [
            `Input: ${val}`,
            `Type: ${type}`,
            `Result: ${res.toFixed(2)} ${unit}`
          ]
        };
      }
    };
  }

  // DISCOUNT CALCULATOR
  if (id.includes('discount-calculator')) {
    return {
      title: 'Discount Calculator',
      description: 'Calculate sale price.',
      inputs: [
        { name: 'price', label: 'Original Price (₹)', type: 'number', defaultValue: 1000 },
        { name: 'discount', label: 'Discount (%)', type: 'number', defaultValue: 20 },
      ],
      calculate: (inputs) => {
        const price = safeFloat(inputs.price);
        const disc = safeFloat(inputs.discount);
        
        const saved = price * (disc / 100);
        const final = price - saved;
        
        return {
          result: `₹${final.toFixed(0)}`,
          explanation: `Price after discount`,
          steps: [
            `Original: ₹${price}`,
            `Discount: ${disc}% (₹${saved.toFixed(0)})`,
            `Final Price: ₹${final.toFixed(0)}`
          ]
        };
      }
    };
  }

  // SALES TAX CALCULATOR
  if (id.includes('sales-tax')) {
    return {
      title: 'Sales Tax Calculator',
      description: 'Calculate tax on purchase.',
      inputs: [
        { name: 'price', label: 'Price (₹)', type: 'number', defaultValue: 1000 },
        { name: 'tax', label: 'Tax Rate (%)', type: 'number', defaultValue: 18 },
      ],
      calculate: (inputs) => {
        const price = safeFloat(inputs.price);
        const tax = safeFloat(inputs.tax);
        
        const taxAmt = price * (tax / 100);
        const total = price + taxAmt;
        
        return {
          result: `₹${total.toFixed(0)}`,
          explanation: `Total with tax`,
          steps: [
            `Price: ₹${price}`,
            `Tax: ${tax}% (₹${taxAmt.toFixed(0)})`,
            `Total: ₹${total.toFixed(0)}`
          ]
        };
      }
    };
  }

  // PRICE COMPARISON
  if (id.includes('price-comparison')) {
    return {
      title: 'Price Comparison',
      description: 'Compare unit prices.',
      inputs: [
        { name: 'price1', label: 'Item 1 Price', type: 'number', defaultValue: 100 },
        { name: 'qty1', label: 'Item 1 Qty', type: 'number', defaultValue: 1 },
        { name: 'price2', label: 'Item 2 Price', type: 'number', defaultValue: 180 },
        { name: 'qty2', label: 'Item 2 Qty', type: 'number', defaultValue: 2 },
      ],
      calculate: (inputs) => {
        const p1 = safeFloat(inputs.price1);
        const q1 = safeFloat(inputs.qty1);
        const p2 = safeFloat(inputs.price2);
        const q2 = safeFloat(inputs.qty2);
        
        const u1 = p1 / q1;
        const u2 = p2 / q2;
        
        const better = u1 < u2 ? 'Item 1' : 'Item 2';
        
        return {
          result: `${better} is cheaper`,
          explanation: `Unit price comparison`,
          steps: [
            `Item 1: ${u1.toFixed(2)} per unit`,
            `Item 2: ${u2.toFixed(2)} per unit`,
            `Winner: ${better}`
          ]
        };
      }
    };
  }

  // BUDGET CALCULATOR
  if (id.includes('budget-calculator')) {
    return {
      title: 'Budget Calculator',
      description: 'Track monthly budget.',
      inputs: [
        { name: 'income', label: 'Monthly Income (₹)', type: 'number', defaultValue: 50000 },
        { name: 'expenses', label: 'Total Expenses (₹)', type: 'number', defaultValue: 35000 },
        { name: 'savings', label: 'Target Savings (₹)', type: 'number', defaultValue: 10000 },
      ],
      calculate: (inputs) => {
        const income = safeFloat(inputs.income);
        const expenses = safeFloat(inputs.expenses);
        const savings = safeFloat(inputs.savings);
        
        const balance = income - expenses;
        const surplus = balance - savings;
        
        return {
          result: surplus >= 0 ? `Surplus: ₹${surplus}` : `Deficit: ₹${Math.abs(surplus)}`,
          explanation: `Budget analysis`,
          steps: [
            `Income: ₹${income}`,
            `Expenses: ₹${expenses}`,
            `Balance: ₹${balance}`,
            `Target Savings: ₹${savings}`,
            `Remaining: ₹${surplus}`
          ]
        };
      }
    };
  }

  // GROCERY COST CALCULATOR
  if (id.includes('grocery-cost')) {
    return {
      title: 'Grocery Cost Calculator',
      description: 'Calculate grocery shopping cost with smart insights.',
      emoji: '🛒',
      category: 'shopping',
      presetScenarios: [
        { name: 'Weekly Shopping', icon: '📅', values: { items: 20, avgPrice: 120, discount: 10 } },
        { name: 'Monthly Stock', icon: '📦', values: { items: 50, avgPrice: 150, discount: 15 } },
        { name: 'Quick Run', icon: '⚡', values: { items: 8, avgPrice: 80, discount: 5 } },
      ],
      inputs: [
        { 
          name: 'items', 
          label: 'Number of Items', 
          type: 'slider', 
          defaultValue: 15,
          min: 1,
          max: 100,
          step: 1,
          helpText: 'How many items are you buying?'
        },
        { 
          name: 'avgPrice', 
          label: 'Average Price per Item (₹)', 
          type: 'slider', 
          defaultValue: 100,
          min: 10,
          max: 500,
          step: 10,
          helpText: 'Typical price per item'
        },
        { 
          name: 'discount', 
          label: 'Discount %', 
          type: 'slider', 
          defaultValue: 10,
          min: 0,
          max: 50,
          step: 5,
          helpText: 'Any offers or discounts?'
        },
      ],
      calculate: (inputs) => {
        const items = safeFloat(inputs.items);
        const avg = safeFloat(inputs.avgPrice);
        const disc = safeFloat(inputs.discount);
        
        const total = items * avg;
        const discAmount = (total * disc) / 100;
        const final = total - discAmount;
        
        const avgMonthly = 8000;
        const comparison = final < avgMonthly * 0.7 ? 'good' : final > avgMonthly * 1.3 ? 'poor' : 'average';
        
        return {
          result: `₹${final.toFixed(0)}`,
          explanation: `Final grocery cost after ${disc}% discount`,
          steps: [
            `Items: ${items}`,
            `Subtotal: ₹${total.toFixed(0)}`,
            `Discount: ₹${discAmount.toFixed(0)} (${disc}%)`,
            `Final Cost: ₹${final.toFixed(0)}`
          ],
          tips: [
            disc < 10 ? '💡 Look for discount coupons to save more!' : '✅ Good use of discounts!',
            items > 30 ? '📦 Bulk buying detected - make sure you can use everything before expiry' : '',
            avg > 200 ? '💎 Premium products detected - consider store brands for savings' : '',
          ].filter(Boolean),
          comparison: {
            label: 'vs Average Monthly Grocery',
            value: Math.round((final / avgMonthly) * 100),
            status: comparison as 'good' | 'average' | 'poor'
          },
          chartData: [
            { label: 'Subtotal', value: total, color: 'bg-blue-500' },
            { label: 'Discount', value: discAmount, color: 'bg-green-500' },
            { label: 'Final', value: final, color: 'bg-purple-500' }
          ]
        };
      }
    };
  }

  // MEAL COST CALCULATOR
  if (id.includes('meal-cost')) {
    return {
      title: 'Meal Cost Calculator',
      description: 'Calculate cost per meal with restaurant comparison.',
      emoji: '🍽️',
      category: 'food',
      presetScenarios: [
        { name: 'Family Dinner', icon: '👨‍👩‍👧‍👦', values: { ingredients: 800, servings: 4 } },
        { name: 'Solo Meal', icon: '🧑', values: { ingredients: 150, servings: 1 } },
        { name: 'Party Prep', icon: '🎉', values: { ingredients: 2000, servings: 10 } },
      ],
      inputs: [
        { 
          name: 'ingredients', 
          label: 'Total Ingredient Cost (₹)', 
          type: 'slider',
          defaultValue: 500,
          min: 50,
          max: 5000,
          step: 50,
          helpText: 'Total cost of all ingredients'
        },
        { 
          name: 'servings', 
          label: 'Number of Servings', 
          type: 'slider',
          defaultValue: 4,
          min: 1,
          max: 20,
          step: 1,
          helpText: 'How many people will eat?'
        },
      ],
      calculate: (inputs) => {
        const cost = safeFloat(inputs.ingredients);
        const servings = safeFloat(inputs.servings);
        
        const perMeal = cost / servings;
        const restaurantCost = perMeal * 3.5;
        const savings = restaurantCost - perMeal;
        
        return {
          result: `₹${perMeal.toFixed(0)}`,
          explanation: `Cost per serving (${servings} servings)`,
          steps: [
            `Total Ingredients: ₹${cost}`,
            `Number of Servings: ${servings}`,
            `Per Meal Cost: ₹${perMeal.toFixed(0)}`,
            `Restaurant Equivalent: ₹${restaurantCost.toFixed(0)}`,
            `You Save: ₹${savings.toFixed(0)} per meal! 💰`
          ],
          tips: [
            `🏠 Cooking at home saves you ₹${(savings * servings).toFixed(0)} on this meal!`,
            perMeal < 100 ? '✅ Very economical meal!' : perMeal < 200 ? '👍 Reasonable meal cost' : '💡 Consider cheaper alternatives',
            `📊 Average restaurant meal costs ₹${restaurantCost.toFixed(0)} - you're saving ${((savings/restaurantCost)*100).toFixed(0)}%`
          ],
          comparison: {
            label: 'vs Restaurant Cost',
            value: Math.round((perMeal / restaurantCost) * 100),
            status: perMeal < restaurantCost * 0.4 ? 'good' : 'average'
          },
          chartData: [
            { label: 'Home Cooked', value: perMeal, color: 'bg-green-500' },
            { label: 'Restaurant', value: restaurantCost, color: 'bg-red-500' },
            { label: 'Savings', value: savings, color: 'bg-blue-500' }
          ]
        };
      }
    };
  }

  // CALORIES PER SERVING
  if (id.includes('calories-per-serving')) {
    return {
      title: 'Calories Per Serving',
      description: 'Calculate calories per serving.',
      inputs: [
        { name: 'totalCals', label: 'Total Calories', type: 'number', defaultValue: 1200 },
        { name: 'servings', label: 'Number of Servings', type: 'number', defaultValue: 4 },
      ],
      calculate: (inputs) => {
        const total = safeFloat(inputs.totalCals);
        const servings = safeFloat(inputs.servings);
        
        const perServing = total / servings;
        
        return {
          result: `${perServing.toFixed(0)} calories`,
          explanation: `Calories per serving`,
          steps: [
            `Total Calories: ${total}`,
            `Servings: ${servings}`,
            `Per Serving: ${perServing.toFixed(0)} cal`
          ]
        };
      }
    };
  }

  // FOOD WASTE CALCULATOR
  if (id.includes('food-waste')) {
    return {
      title: 'Food Waste Calculator',
      description: 'Calculate food waste cost.',
      inputs: [
        { name: 'groceries', label: 'Monthly Groceries (₹)', type: 'number', defaultValue: 10000 },
        { name: 'wastePercent', label: 'Waste Percentage', type: 'number', defaultValue: 20 },
      ],
      calculate: (inputs) => {
        const groceries = safeFloat(inputs.groceries);
        const waste = safeFloat(inputs.wastePercent);
        
        const wasteAmount = (groceries * waste) / 100;
        const yearly = wasteAmount * 12;
        
        return {
          result: `₹${wasteAmount.toFixed(0)}/month`,
          explanation: `Food waste cost`,
          steps: [
            `Monthly Groceries: ₹${groceries}`,
            `Waste: ${waste}%`,
            `Monthly Waste: ₹${wasteAmount.toFixed(0)}`,
            `Yearly Waste: ₹${yearly.toFixed(0)}`
          ]
        };
      }
    };
  }

  // WEIGHT CONVERTER
  if (id.includes('weight-converter')) {
    return {
      title: 'Weight Converter',
      description: 'Convert between weight units.',
      inputs: [
        { name: 'value', label: 'Value', type: 'number', defaultValue: 1 },
        { name: 'from', label: 'From Unit', type: 'select', options: ['kg', 'g', 'lb', 'oz'], defaultValue: 'kg' },
        { name: 'to', label: 'To Unit', type: 'select', options: ['kg', 'g', 'lb', 'oz'], defaultValue: 'lb' },
      ],
      calculate: (inputs) => {
        const val = safeFloat(inputs.value);
        const from = inputs.from;
        const to = inputs.to;
        
        const toKg: Record<string, number> = { 'kg': 1, 'g': 0.001, 'lb': 0.453592, 'oz': 0.0283495 };
        const fromKg: Record<string, number> = { 'kg': 1, 'g': 1000, 'lb': 2.20462, 'oz': 35.274 };
        
        const kg = val * toKg[from];
        const result = kg * fromKg[to];
        
        return {
          result: `${result.toFixed(3)} ${to}`,
          explanation: `Converted weight`,
          steps: [
            `${val} ${from} = ${kg.toFixed(3)} kg`,
            `${kg.toFixed(3)} kg = ${result.toFixed(3)} ${to}`
          ]
        };
      }
    };
  }

  // VOLUME CONVERTER
  if (id.includes('volume-converter')) {
    return {
      title: 'Volume Converter',
      description: 'Convert between volume units.',
      inputs: [
        { name: 'value', label: 'Value', type: 'number', defaultValue: 1 },
        { name: 'from', label: 'From Unit', type: 'select', options: ['L', 'mL', 'gal', 'cup'], defaultValue: 'L' },
        { name: 'to', label: 'To Unit', type: 'select', options: ['L', 'mL', 'gal', 'cup'], defaultValue: 'gal' },
      ],
      calculate: (inputs) => {
        const val = safeFloat(inputs.value);
        const from = inputs.from;
        const to = inputs.to;
        
        const toLiters: Record<string, number> = { 'L': 1, 'mL': 0.001, 'gal': 3.78541, 'cup': 0.236588 };
        const fromLiters: Record<string, number> = { 'L': 1, 'mL': 1000, 'gal': 0.264172, 'cup': 4.22675 };
        
        const liters = val * toLiters[from];
        const result = liters * fromLiters[to];
        
        return {
          result: `${result.toFixed(3)} ${to}`,
          explanation: `Converted volume`,
          steps: [
            `${val} ${from} = ${liters.toFixed(3)} L`,
            `${liters.toFixed(3)} L = ${result.toFixed(3)} ${to}`
          ]
        };
      }
    };
  }

  // SPEED CONVERTER
  if (id.includes('speed-converter')) {
    return {
      title: 'Speed Converter',
      description: 'Convert between speed units.',
      inputs: [
        { name: 'value', label: 'Value', type: 'number', defaultValue: 100 },
        { name: 'from', label: 'From Unit', type: 'select', options: ['km/h', 'm/s', 'mph'], defaultValue: 'km/h' },
        { name: 'to', label: 'To Unit', type: 'select', options: ['km/h', 'm/s', 'mph'], defaultValue: 'mph' },
      ],
      calculate: (inputs) => {
        const val = safeFloat(inputs.value);
        const from = inputs.from;
        const to = inputs.to;
        
        const toKmh: Record<string, number> = { 'km/h': 1, 'm/s': 3.6, 'mph': 1.60934 };
        const fromKmh: Record<string, number> = { 'km/h': 1, 'm/s': 0.277778, 'mph': 0.621371 };
        
        const kmh = val * toKmh[from];
        const result = kmh * fromKmh[to];
        
        return {
          result: `${result.toFixed(2)} ${to}`,
          explanation: `Converted speed`,
          steps: [
            `${val} ${from} = ${kmh.toFixed(2)} km/h`,
            `${kmh.toFixed(2)} km/h = ${result.toFixed(2)} ${to}`
          ]
        };
      }
    };
  }

  // SAVINGS GOAL CALCULATOR
  if (id.includes('savings-goal')) {
    return {
      title: 'Savings Goal Calculator',
      description: 'Calculate monthly savings needed.',
      inputs: [
        { name: 'goal', label: 'Savings Goal (₹)', type: 'number', defaultValue: 100000 },
        { name: 'months', label: 'Number of Months', type: 'number', defaultValue: 12 },
        { name: 'current', label: 'Current Savings (₹)', type: 'number', defaultValue: 10000 },
      ],
      calculate: (inputs) => {
        const goal = safeFloat(inputs.goal);
        const months = safeFloat(inputs.months);
        const current = safeFloat(inputs.current);
        
        const remaining = goal - current;
        const perMonth = remaining / months;
        
        return {
          result: `₹${perMonth.toFixed(0)}/month`,
          explanation: `Monthly savings needed`,
          steps: [
            `Goal: ₹${goal}`,
            `Current: ₹${current}`,
            `Remaining: ₹${remaining}`,
            `Months: ${months}`,
            `Per Month: ₹${perMonth.toFixed(0)}`
          ]
        };
      }
    };
  }

  // COST PER USE CALCULATOR
  if (id.includes('cost-per-use')) {
    return {
      title: 'Cost Per Use Calculator',
      description: 'Calculate cost per use of an item.',
      inputs: [
        { name: 'price', label: 'Item Price (₹)', type: 'number', defaultValue: 5000 },
        { name: 'uses', label: 'Expected Uses', type: 'number', defaultValue: 100 },
      ],
      calculate: (inputs) => {
        const price = safeFloat(inputs.price);
        const uses = safeFloat(inputs.uses);
        
        const perUse = price / uses;
        
        return {
          result: `₹${perUse.toFixed(2)} per use`,
          explanation: `Cost per use`,
          steps: [
            `Item Price: ₹${price}`,
            `Expected Uses: ${uses}`,
            `Per Use: ₹${perUse.toFixed(2)}`
          ]
        };
      }
    };
  }

  // DEFAULT GENERIC CALCULATOR
  return {
    title: id.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    description: 'Everyday life calculator.',
    inputs: [
      { name: 'value', label: 'Value', type: 'number', defaultValue: 100 },
    ],
    calculate: (inputs) => {
      const val = safeFloat(inputs.value);
      return { 
        result: val.toFixed(2), 
        explanation: `Result`,
        steps: [`Value: ${val}`]
      };
    }
  };
};

// Helper function to determine category-based styling
const getCategoryTheme = (id: string) => {
  if (id.includes('food') || id.includes('meal') || id.includes('grocery') || id.includes('calories') || id.includes('serving') || id.includes('recipe') || id.includes('cooking') || id.includes('tip'))
    return {
      gradient: 'from-orange-500/20 via-red-500/10 to-pink-500/20',
      icon: Utensils,
      emoji: '🍽️',
      accentColor: 'text-orange-500'
    };
  if (id.includes('converter') || id.includes('conversion') || id.includes('temperature') || id.includes('length') || id.includes('weight') || id.includes('volume') || id.includes('speed'))
    return {
      gradient: 'from-blue-500/20 via-cyan-500/10 to-teal-500/20',
      icon: Zap,
      emoji: '🔄',
      accentColor: 'text-cyan-500'
    };
  if (id.includes('budget') || id.includes('savings') || id.includes('cost') || id.includes('price') || id.includes('discount') || id.includes('shopping'))
    return {
      gradient: 'from-green-500/20 via-emerald-500/10 to-lime-500/20',
      icon: DollarSign,
      emoji: '💰',
      accentColor: 'text-green-500'
    };
  if (id.includes('time') || id.includes('pomodoro') || id.includes('productivity') || id.includes('work') || id.includes('deadline'))
    return {
      gradient: 'from-purple-500/20 via-violet-500/10 to-fuchsia-500/20',
      icon: Coffee,
      emoji: '⏰',
      accentColor: 'text-purple-500'
    };
  return {
    gradient: 'from-primary/20 via-primary/10 to-primary/5',
    icon: Calculator,
    emoji: '🧮',
    accentColor: 'text-primary'
  };
};

export function GenericEverydayTool({ id }: { id: string }) {
  if (!id) return <div className="p-8 text-center text-muted-foreground">Calculator configuration not found</div>;
  
  const config = getToolConfig(id);
  const theme = getCategoryTheme(id);
  const ThemeIcon = theme.icon;

  const [inputValues, setInputValues] = useState<Record<string, any>>(() => {
    const initial: Record<string, any> = {};
    config.inputs.forEach(inp => {
      initial[inp.name] = inp.defaultValue;
    });
    return initial;
  });

  const [result, setResult] = useState<CalculationResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [autoCalculate, setAutoCalculate] = useState(true);

  // Auto-calculate on input change
  useEffect(() => {
    if (autoCalculate && Object.keys(inputValues).length > 0) {
      const timer = setTimeout(() => {
        const res = config.calculate(inputValues);
        setResult(res);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [inputValues, autoCalculate]);

  useEffect(() => {
    const initial: Record<string, any> = {};
    config.inputs.forEach(inp => {
      initial[inp.name] = inp.defaultValue;
    });
    setInputValues(initial);
    setResult(null);
  }, [id]);

  const handleCalculate = () => {
    setIsCalculating(true);
    setTimeout(() => {
      const res = config.calculate(inputValues);
      setResult(res);
      setIsCalculating(false);
    }, 300);
  };

  const handleCopy = () => {
    if (result) {
      const text = `${config.title}\n\nResult: ${result.result}\n${result.explanation || ''}\n\nCalculated at: ${new Date().toLocaleString()}`;
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const applyPreset = (preset: any) => {
    setInputValues(preset.values);
  };

  return (
    <FinancialCalculatorTemplate
      title={config.title}
      description={config.description}
      icon={ThemeIcon}
      calculate={handleCalculate}
      values={Object.values(inputValues)}
      seoContent={<SeoContentGenerator title={config.title} description={config.description} categoryName="Everyday Life" />}
      inputs={
        <div className="space-y-6">
          {/* Preset Scenarios */}
          {config.presetScenarios && config.presetScenarios.length > 0 && (
            <div className="space-y-3 animate-in fade-in duration-500">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Zap className="w-4 h-4" />
                Quick Presets
              </div>
              <div className="grid grid-cols-3 gap-2">
                {config.presetScenarios.map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => applyPreset(preset)}
                    className={`p-3 rounded-lg bg-gradient-to-br ${theme.gradient} border border-primary/20 hover:border-primary/50 transition-all duration-300 hover:scale-105 group`}
                  >
                    <div className="text-2xl mb-1">{preset.icon || '⚡'}</div>
                    <div className="text-xs font-medium">{preset.name}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Auto-Calculate Toggle */}
          <div className="flex items-center justify-between p-3 bg-secondary/20 rounded-lg">
            <div className="flex items-center gap-2 text-sm">
              <RefreshCw className="w-4 h-4" />
              <span>Auto-calculate</span>
            </div>
            <button
              onClick={() => setAutoCalculate(!autoCalculate)}
              className={`relative w-12 h-6 rounded-full transition-colors ${autoCalculate ? 'bg-primary' : 'bg-secondary'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${autoCalculate ? 'translate-x-7' : 'translate-x-1'}`} />
            </button>
          </div>

          {/* Input Fields */}
          {config.inputs.map((inp, idx) => (
            <div 
              key={inp.name} 
              className="space-y-3 animate-in fade-in slide-in-from-left-2"
              style={{ animationDelay: `${idx * 50}ms`, animationDuration: '400ms' }}
            >
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <span className={theme.accentColor}>{inp.label}</span>
                </label>
                {inp.helpText && (
                  <div className="group relative">
                    <Lightbulb className="w-4 h-4 text-muted-foreground cursor-help" />
                    <div className="absolute right-0 top-6 w-48 p-2 bg-popover text-popover-foreground text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                      {inp.helpText}
                    </div>
                  </div>
                )}
              </div>

              {inp.type === 'slider' ? (
                <div className="space-y-2">
                  <input
                    type="range"
                    value={inputValues[inp.name]}
                    onChange={(e) => setInputValues({ ...inputValues, [inp.name]: parseFloat(e.target.value) })}
                    min={inp.min}
                    max={inp.max}
                    step={inp.step || 1}
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gradient-to-r from-primary/20 to-primary/60"
                    style={{
                      background: `linear-gradient(to right, var(--primary) 0%, var(--primary) ${((inputValues[inp.name] - (inp.min || 0)) / ((inp.max || 100) - (inp.min || 0))) * 100}%, rgb(var(--secondary) / 0.3) ${((inputValues[inp.name] - (inp.min || 0)) / ((inp.max || 100) - (inp.min || 0))) * 100}%, rgb(var(--secondary) / 0.3) 100%)`
                    }}
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{inp.min}</span>
                    <span className={`text-lg font-bold ${theme.accentColor}`}>{inputValues[inp.name]}</span>
                    <span className="text-xs text-muted-foreground">{inp.max}</span>
                  </div>
                </div>
              ) : inp.type === 'select' ? (
                <select
                  value={inputValues[inp.name]}
                  onChange={(e) => setInputValues({ ...inputValues, [inp.name]: e.target.value })}
                  className={`w-full p-3.5 rounded-xl bg-gradient-to-r ${theme.gradient} border-2 border-transparent hover:border-primary/30 focus:border-primary/50 outline-none transition-all duration-300 font-medium shadow-sm hover:shadow-md`}
                >
                  {inp.options?.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              ) : (
                <div className="relative group">
                  <input
                    type={inp.type}
                    value={inputValues[inp.name]}
                    onChange={(e) => setInputValues({ ...inputValues, [inp.name]: e.target.value })}
                    placeholder={inp.placeholder}
                    min={inp.min}
                    max={inp.max}
                    className={`w-full p-3.5 ${inp.type === 'number' ? 'pr-12' : ''} rounded-xl bg-gradient-to-r ${theme.gradient} border-2 border-transparent hover:border-primary/30 focus:border-primary/50 outline-none transition-all duration-300 font-medium shadow-sm hover:shadow-md`}
                  />
                  {inp.type === 'number' ? (
                    <VoiceNumberButton
                      label={inp.label}
                      onValueAction={(v) => setInputValues({ ...inputValues, [inp.name]: String(v) })}
                      min={typeof inp.min === 'number' ? inp.min : undefined}
                      max={typeof inp.max === 'number' ? inp.max : undefined}
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                    />
                  ) : (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                      <Sparkles className="w-4 h-4 text-primary/50" />
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      }
      result={
        result && (
          <div className="space-y-6 relative">
            {/* Action Buttons */}
            <div className="flex gap-2 justify-end">
              <button
                onClick={handleCopy}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${copied ? 'bg-green-500' : 'bg-secondary'} hover:bg-secondary/80 transition-all duration-300`}
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span className="text-sm">{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>

            {/* Main Result Card */}
            <div className={`relative overflow-hidden p-8 bg-gradient-to-br ${theme.gradient} rounded-2xl border-2 border-primary/20 shadow-xl animate-in zoom-in-95 fade-in duration-500`}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-2xl" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-white/10 to-transparent rounded-full blur-xl" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-3xl">{theme.emoji}</span>
                  <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Result</div>
                </div>
                <div className={`text-5xl font-black ${theme.accentColor} tracking-tight mb-2 animate-in slide-in-from-bottom-4 duration-700 delay-100`}>
                  {result.result}
                </div>
                {result.explanation && (
                  <div className="mt-3 text-base text-muted-foreground font-medium flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    {result.explanation}
                  </div>
                )}
              </div>
            </div>

            {/* Comparison Bar */}
            {result.comparison && (
              <div className={`p-5 bg-gradient-to-r ${theme.gradient} rounded-xl border border-primary/20 animate-in fade-in duration-500 delay-100`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium">{result.comparison.label}</span>
                  <span className={`text-sm font-bold ${
                    result.comparison.status === 'good' ? 'text-green-500' : 
                    result.comparison.status === 'poor' ? 'text-red-500' : 'text-yellow-500'
                  }`}>
                    {result.comparison.value}%
                  </span>
                </div>
                <div className="w-full h-3 bg-secondary/30 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ${
                      result.comparison.status === 'good' ? 'bg-green-500' : 
                      result.comparison.status === 'poor' ? 'bg-red-500' : 'bg-yellow-500'
                    }`}
                    style={{ width: `${Math.min(result.comparison.value, 100)}%` }}
                  />
                </div>
              </div>
            )}

            {/* Chart Data */}
            {result.chartData && result.chartData.length > 0 && (
              <div className="space-y-3 animate-in fade-in duration-500 delay-200">
                <h4 className="font-bold flex items-center gap-2">
                  <BarChart3 className={`w-5 h-5 ${theme.accentColor}`} />
                  Visual Breakdown
                </h4>
                <div className="space-y-2">
                  {result.chartData.map((item, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span>{item.label}</span>
                        <span className="font-bold">₹{item.value.toFixed(0)}</span>
                      </div>
                      <div className="w-full h-2 bg-secondary/30 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${item.color || 'bg-primary'} transition-all duration-1000`}
                          style={{ 
                            width: `${(item.value / Math.max(...result.chartData!.map(d => d.value))) * 100}%`,
                            animationDelay: `${idx * 100}ms`
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tips */}
            {result.tips && result.tips.length > 0 && (
              <div className={`p-5 bg-gradient-to-r ${theme.gradient} rounded-xl border border-primary/20 animate-in fade-in duration-500 delay-250`}>
                <h4 className="font-bold mb-3 flex items-center gap-2">
                  <Lightbulb className={`w-5 h-5 ${theme.accentColor}`} />
                  Smart Tips
                </h4>
                <ul className="space-y-2">
                  {result.tips.map((tip, idx) => (
                    <li key={idx} className="text-sm flex items-start gap-2 animate-in slide-in-from-left-2" style={{ animationDelay: `${idx * 100}ms` }}>
                      <span className="mt-0.5">💡</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Steps Breakdown */}
            {result.steps && result.steps.length > 0 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-200">
                <h3 className="text-xl font-bold flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${theme.gradient}`}>
                    <Activity className={`w-5 h-5 ${theme.accentColor}`} />
                  </div>
                  <span>Calculation Breakdown</span>
                </h3>
                <div className="space-y-3">
                  {result.steps.map((step, idx) => (
                    <div 
                      key={idx}
                      className="group relative p-4 bg-gradient-to-r from-secondary/40 to-secondary/20 rounded-xl border border-secondary/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] animate-in slide-in-from-left-2"
                      style={{ animationDelay: `${idx * 100}ms`, animationDuration: '400ms' }}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br ${theme.gradient} flex items-center justify-center font-bold ${theme.accentColor} text-sm`}>
                          {idx + 1}
                        </div>
                        <div className="text-sm font-medium">{step}</div>
                      </div>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Sparkles className={`w-4 h-4 ${theme.accentColor}`} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Insights */}
            {result.insights && result.insights.length > 0 && (
              <div className={`p-6 bg-gradient-to-r ${theme.gradient} rounded-xl border-2 border-primary/20 animate-in fade-in duration-500 delay-300`}>
                <h4 className="font-bold mb-3 flex items-center gap-2">
                  <Sparkles className={`w-5 h-5 ${theme.accentColor}`} />
                  Smart Insights
                </h4>
                <ul className="space-y-2">
                  {result.insights.map((insight, idx) => (
                    <li key={idx} className="text-sm flex items-start gap-2">
                      <span className={`${theme.accentColor} mt-0.5`}>•</span>
                      <span>{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Loading State */}
            {isCalculating && (
              <div className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-xl flex items-center justify-center z-20">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${theme.accentColor} bg-current animate-bounce`} style={{ animationDelay: '0ms' }} />
                  <div className={`w-3 h-3 rounded-full ${theme.accentColor} bg-current animate-bounce`} style={{ animationDelay: '150ms' }} />
                  <div className={`w-3 h-3 rounded-full ${theme.accentColor} bg-current animate-bounce`} style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
          </div>
        )
      }
    />
  );
}