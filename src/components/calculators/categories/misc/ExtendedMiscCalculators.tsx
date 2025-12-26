"use client"

import { useMemo, useState } from "react"
import {
  Calculator as CalculatorIcon,
  Thermometer,
  Zap,
  Wifi,
  Download,
  Shield,
  RectangleHorizontal,
  Type,
  Sparkles,
  Clock,
  Calendar,
  Star,
  Heart,
  GraduationCap,
  Gauge,
  Droplets,
  Square,
  Timer,
  Wind,
  Battery
} from "lucide-react"
import {
  FinancialCalculatorTemplate,
  InputGroup,
  ResultCard
} from "@/components/calculators/templates/FinancialCalculatorTemplate"

const fmtNumber = (n: number, digits = 2) => {
  if (!Number.isFinite(n)) return "-"
  return n.toLocaleString("en-IN", { maximumFractionDigits: digits })
}

const gcd = (a: number, b: number) => {
  let x = Math.abs(Math.round(a))
  let y = Math.abs(Math.round(b))
  while (y) {
    const t = y
    y = x % y
    x = t
  }
  return x || 1
}

const parseTimeToMinutes = (hhmm: string) => {
  const [hStr, mStr] = hhmm.split(":")
  const h = Number(hStr)
  const m = Number(mStr)
  if (!Number.isFinite(h) || !Number.isFinite(m)) return null
  return h * 60 + m
}

const diffYMD = (from: Date, to: Date) => {
  let years = to.getFullYear() - from.getFullYear()
  let months = to.getMonth() - from.getMonth()
  let days = to.getDate() - from.getDate()

  if (days < 0) {
    months -= 1
    const daysInPrevMonth = new Date(to.getFullYear(), to.getMonth(), 0).getDate()
    days += daysInPrevMonth
  }
  if (months < 0) {
    years -= 1
    months += 12
  }

  return { years, months, days }
}

export function UnitConverter() {
  const units = useMemo(
    () =>
      ({
        mm: 0.001,
        cm: 0.01,
        m: 1,
        km: 1000,
        inch: 0.0254,
        ft: 0.3048,
        yd: 0.9144,
        mile: 1609.344
      }) as const,
    []
  )

  const [value, setValue] = useState(1)
  const [fromUnit, setFromUnit] = useState<keyof typeof units>("m")
  const [toUnit, setToUnit] = useState<keyof typeof units>("ft")

  const result = useMemo(() => {
    const meters = value * units[fromUnit]
    return meters / units[toUnit]
  }, [value, fromUnit, toUnit, units])

  return (
    <FinancialCalculatorTemplate
      title="Unit Converter (Length)"
      description="Convert common length units."
      icon={CalculatorIcon}
      calculate={() => {}}
      values={[value, fromUnit, toUnit]}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Value" value={value} onChange={setValue} min={-1e9} max={1e9} step={0.01} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">From</label>
              <select
                value={fromUnit}
                onChange={(e) => setFromUnit(e.target.value as any)}
                className="w-full p-3 rounded-xl bg-background border border-input hover:border-primary/50 transition-colors"
              >
                {Object.keys(units).map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">To</label>
              <select
                value={toUnit}
                onChange={(e) => setToUnit(e.target.value as any)}
                className="w-full p-3 rounded-xl bg-background border border-input hover:border-primary/50 transition-colors"
              >
                {Object.keys(units).map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      }
      result={<ResultCard label="Converted Value" value={fmtNumber(result)} type="highlight" />}
    />
  )
}

export function TemperatureConverter() {
  const [value, setValue] = useState(25)
  const [from, setFrom] = useState<"C" | "F" | "K">("C")
  const [to, setTo] = useState<"C" | "F" | "K">("F")

  const converted = useMemo(() => {
    let c = value
    if (from === "F") c = (value - 32) * (5 / 9)
    if (from === "K") c = value - 273.15

    if (to === "C") return c
    if (to === "F") return c * (9 / 5) + 32
    return c + 273.15
  }, [value, from, to])

  return (
    <FinancialCalculatorTemplate
      title="Temperature Converter"
      description="Convert between Celsius, Fahrenheit, and Kelvin."
      icon={Thermometer}
      calculate={() => {}}
      values={[value, from, to]}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Value" value={value} onChange={setValue} min={-1000} max={10000} step={0.1} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">From</label>
              <select
                value={from}
                onChange={(e) => setFrom(e.target.value as any)}
                className="w-full p-3 rounded-xl bg-background border border-input hover:border-primary/50 transition-colors"
              >
                <option value="C">°C</option>
                <option value="F">°F</option>
                <option value="K">K</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">To</label>
              <select
                value={to}
                onChange={(e) => setTo(e.target.value as any)}
                className="w-full p-3 rounded-xl bg-background border border-input hover:border-primary/50 transition-colors"
              >
                <option value="C">°C</option>
                <option value="F">°F</option>
                <option value="K">K</option>
              </select>
            </div>
          </div>
        </div>
      }
      result={<ResultCard label="Converted" value={fmtNumber(converted)} type="highlight" />}
    />
  )
}

export function ElectricityBillCalculator() {
  const [units, setUnits] = useState(250)
  const [rate, setRate] = useState(8)
  const [fixedCharge, setFixedCharge] = useState(100)
  const [taxPct, setTaxPct] = useState(5)
  const [result, setResult] = useState<{ energy: number; subtotal: number; tax: number; total: number } | null>(null)

  const calculate = () => {
    const energy = units * rate
    const subtotal = energy + fixedCharge
    const tax = (subtotal * taxPct) / 100
    const total = subtotal + tax
    setResult({ energy, subtotal, tax, total })
  }

  return (
    <FinancialCalculatorTemplate
      title="Electricity Bill Calculator"
      description="Estimate electricity bill using units × rate + fixed charges + tax."
      icon={Zap}
      calculate={calculate}
      values={[units, rate, fixedCharge, taxPct]}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Units Consumed (kWh)" value={units} onChange={setUnits} min={0} max={100000} step={1} />
          <InputGroup label="Rate per Unit" value={rate} onChange={setRate} min={0} max={1000} step={0.01} prefix="₹" />
          <InputGroup label="Fixed Charges" value={fixedCharge} onChange={setFixedCharge} min={0} max={100000} step={1} prefix="₹" />
          <InputGroup label="Tax/Other %" value={taxPct} onChange={setTaxPct} min={0} max={50} step={0.1} suffix="%" />
        </div>
      }
      result={
        result && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <ResultCard label="Energy Charges" value={`₹${fmtNumber(result.energy)}`} />
            <ResultCard label="Subtotal" value={`₹${fmtNumber(result.subtotal)}`} />
            <ResultCard label="Tax" value={`₹${fmtNumber(result.tax)}`} type="warning" />
            <ResultCard label="Total Bill" value={`₹${fmtNumber(result.total)}`} type="highlight" />
          </div>
        )
      }
    />
  )
}

export function DataUsageCalculator() {
  const [dailyGB, setDailyGB] = useState(2)
  const [days, setDays] = useState(30)
  const [pricePerGB, setPricePerGB] = useState(10)
  const [result, setResult] = useState<{ totalGB: number; cost: number } | null>(null)

  const calculate = () => {
    const totalGB = dailyGB * days
    const cost = totalGB * pricePerGB
    setResult({ totalGB, cost })
  }

  return (
    <FinancialCalculatorTemplate
      title="Data Usage Calculator"
      description="Estimate total data used and approximate cost."
      icon={Wifi}
      calculate={calculate}
      values={[dailyGB, days, pricePerGB]}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Daily Usage" value={dailyGB} onChange={setDailyGB} min={0} max={1000} step={0.1} suffix=" GB" />
          <InputGroup label="Days" value={days} onChange={setDays} min={1} max={365} step={1} />
          <InputGroup label="Price per GB" value={pricePerGB} onChange={setPricePerGB} min={0} max={10000} step={0.1} prefix="₹" />
        </div>
      }
      result={
        result && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ResultCard label="Total Data" value={`${fmtNumber(result.totalGB, 2)} GB`} type="highlight" />
            <ResultCard label="Estimated Cost" value={`₹${fmtNumber(result.cost, 2)}`} type="success" />
          </div>
        )
      }
    />
  )
}

const formatDuration = (seconds: number) => {
  const s = Math.max(0, Math.round(seconds))
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  const pad = (x: number) => x.toString().padStart(2, "0")
  return `${pad(h)}:${pad(m)}:${pad(sec)}`
}

export function DownloadTimeCalculator() {
  const [size, setSize] = useState(2)
  const [sizeUnit, setSizeUnit] = useState<"MB" | "GB">("GB")
  const [speed, setSpeed] = useState(50)
  const [speedUnit, setSpeedUnit] = useState<"Mbps" | "MBps">("Mbps")
  const [result, setResult] = useState<{ seconds: number } | null>(null)

  const calculate = () => {
    const bytes = sizeUnit === "GB" ? size * 1024 * 1024 * 1024 : size * 1024 * 1024
    const bits = bytes * 8
    const bitsPerSecond = speedUnit === "MBps" ? speed * 8 * 1024 * 1024 : speed * 1024 * 1024
    const seconds = bitsPerSecond > 0 ? bits / bitsPerSecond : 0
    setResult({ seconds })
  }

  return (
    <FinancialCalculatorTemplate
      title="Download Time Calculator"
      description="Estimate download time from file size and internet speed."
      icon={Download}
      calculate={calculate}
      values={[size, sizeUnit, speed, speedUnit]}
      inputs={
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputGroup label="File Size" value={size} onChange={setSize} min={0} max={1e6} step={0.01} />
            <div className="space-y-2">
              <label className="text-sm font-medium">Size Unit</label>
              <select
                value={sizeUnit}
                onChange={(e) => setSizeUnit(e.target.value as any)}
                className="w-full p-3 rounded-xl bg-background border border-input hover:border-primary/50 transition-colors"
              >
                <option value="MB">MB</option>
                <option value="GB">GB</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputGroup label="Speed" value={speed} onChange={setSpeed} min={0} max={1e6} step={0.1} />
            <div className="space-y-2">
              <label className="text-sm font-medium">Speed Unit</label>
              <select
                value={speedUnit}
                onChange={(e) => setSpeedUnit(e.target.value as any)}
                className="w-full p-3 rounded-xl bg-background border border-input hover:border-primary/50 transition-colors"
              >
                <option value="Mbps">Mbps</option>
                <option value="MBps">MB/s</option>
              </select>
            </div>
          </div>
        </div>
      }
      result={result && <ResultCard label="Estimated Time" value={formatDuration(result.seconds)} type="highlight" />}
    />
  )
}

const passwordScore = (pwd: string) => {
  if (!pwd) return { score: 0, label: "Empty" }

  let score = 0
  const length = pwd.length
  score += Math.min(40, length * 4)

  const hasLower = /[a-z]/.test(pwd)
  const hasUpper = /[A-Z]/.test(pwd)
  const hasNumber = /\d/.test(pwd)
  const hasSymbol = /[^A-Za-z0-9]/.test(pwd)

  score += hasLower ? 10 : 0
  score += hasUpper ? 10 : 0
  score += hasNumber ? 10 : 0
  score += hasSymbol ? 15 : 0

  if (/^(.)\1+$/.test(pwd)) score -= 20
  if (/1234|password|qwerty|admin/i.test(pwd)) score -= 25

  score = Math.max(0, Math.min(100, score))

  const label =
    score >= 80
      ? "Strong"
      : score >= 60
        ? "Good"
        : score >= 40
          ? "Fair"
          : score >= 20
            ? "Weak"
            : "Very Weak"

  return { score, label }
}

export function PasswordStrengthCalculator() {
  const [password, setPassword] = useState("")

  const result = useMemo(() => passwordScore(password), [password])

  return (
    <FinancialCalculatorTemplate
      title="Password Strength Calculator"
      description="Get a simple strength score based on length and character variety."
      icon={Shield}
      calculate={() => {}}
      values={[password]}
      inputs={
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Password</label>
            <input
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-xl bg-background border border-input hover:border-primary/50 transition-colors"
              placeholder="Enter a password"
              autoComplete="off"
            />
          </div>
        </div>
      }
      result={
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ResultCard label="Score" value={`${result.score}/100`} type="highlight" />
          <ResultCard label="Strength" value={result.label} type={result.score >= 60 ? "success" : result.score >= 40 ? "default" : "warning"} />
        </div>
      }
    />
  )
}

export function AspectRatioCalculator() {
  const [width, setWidth] = useState(1920)
  const [height, setHeight] = useState(1080)
  const [newWidth, setNewWidth] = useState(1280)
  const [lock, setLock] = useState<"width" | "height">("width")

  const result = useMemo(() => {
    const ratio = width > 0 && height > 0 ? width / height : 1
    const computedHeight = lock === "width" ? newWidth / ratio : height
    const computedWidth = lock === "height" ? height * ratio : newWidth
    const d = gcd(width, height)
    return {
      ratioText: `${Math.round(width / d)}:${Math.round(height / d)}`,
      computedWidth,
      computedHeight
    }
  }, [width, height, newWidth, lock])

  return (
    <FinancialCalculatorTemplate
      title="Aspect Ratio Calculator"
      description="Keep aspect ratio while resizing dimensions."
      icon={RectangleHorizontal}
      calculate={() => {}}
      values={[width, height, newWidth, lock]}
      inputs={
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputGroup label="Original Width" value={width} onChange={setWidth} min={1} max={1e8} step={1} />
            <InputGroup label="Original Height" value={height} onChange={setHeight} min={1} max={1e8} step={1} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Lock Dimension</label>
            <select
              value={lock}
              onChange={(e) => setLock(e.target.value as any)}
              className="w-full p-3 rounded-xl bg-background border border-input hover:border-primary/50 transition-colors"
            >
              <option value="width">Lock width (compute height)</option>
              <option value="height">Lock height (compute width)</option>
            </select>
          </div>

          {lock === "width" ? (
            <InputGroup label="New Width" value={newWidth} onChange={setNewWidth} min={1} max={1e8} step={1} />
          ) : (
            <InputGroup label="New Height" value={newWidth} onChange={setNewWidth} min={1} max={1e8} step={1} />
          )}
        </div>
      }
      result={
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ResultCard label="Ratio" value={result.ratioText} type="highlight" />
          <ResultCard label="Computed Width" value={fmtNumber(result.computedWidth, 2)} />
          <ResultCard label="Computed Height" value={fmtNumber(result.computedHeight, 2)} />
        </div>
      }
    />
  )
}

export function PixelsToRemCalculator() {
  const [px, setPx] = useState(16)
  const [rem, setRem] = useState(1)
  const [base, setBase] = useState(16)

  const computed = useMemo(() => {
    const pxToRem = base !== 0 ? px / base : 0
    const remToPx = rem * base
    return { pxToRem, remToPx }
  }, [px, rem, base])

  return (
    <FinancialCalculatorTemplate
      title="Pixels to Rem Calculator"
      description="Convert px ↔ rem using a base font size."
      icon={Type}
      calculate={() => {}}
      values={[px, rem, base]}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Base Font Size" value={base} onChange={setBase} min={1} max={200} step={1} suffix=" px" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputGroup label="Pixels" value={px} onChange={setPx} min={0} max={1e6} step={1} suffix=" px" />
            <InputGroup label="Rem" value={rem} onChange={setRem} min={0} max={1e6} step={0.01} suffix=" rem" />
          </div>
        </div>
      }
      result={
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ResultCard label="px → rem" value={fmtNumber(computed.pxToRem, 4)} type="highlight" />
          <ResultCard label="rem → px" value={fmtNumber(computed.remToPx, 2)} type="success" />
        </div>
      }
    />
  )
}

export function GoldenRatioCalculator() {
  const [total, setTotal] = useState(100)
  const phi = 1.61803398875

  const result = useMemo(() => {
    const smaller = total / phi
    const larger = total - smaller
    return { smaller, larger }
  }, [total])

  return (
    <FinancialCalculatorTemplate
      title="Golden Ratio Calculator"
      description="Split a total into golden ratio parts (φ ≈ 1.618)."
      icon={Sparkles}
      calculate={() => {}}
      values={[total]}
      inputs={<InputGroup label="Total" value={total} onChange={setTotal} min={0} max={1e9} step={0.01} />}
      result={
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ResultCard label="Larger Part" value={fmtNumber(result.larger, 4)} type="highlight" />
          <ResultCard label="Smaller Part" value={fmtNumber(result.smaller, 4)} />
        </div>
      }
    />
  )
}

export function TimeDurationCalculator() {
  const [start, setStart] = useState("09:00")
  const [end, setEnd] = useState("17:30")
  const [result, setResult] = useState<{ minutes: number; label: string } | null>(null)

  const calculate = () => {
    const s = parseTimeToMinutes(start)
    const e = parseTimeToMinutes(end)
    if (s === null || e === null) {
      setResult(null)
      return
    }
    let diff = e - s
    if (diff < 0) diff += 24 * 60
    const h = Math.floor(diff / 60)
    const m = diff % 60
    setResult({ minutes: diff, label: `${h}h ${m}m` })
  }

  return (
    <FinancialCalculatorTemplate
      title="Time Duration Calculator"
      description="Calculate duration between two times (wraps to next day if needed)."
      icon={Clock}
      calculate={calculate}
      values={[start, end]}
      inputs={
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Start Time</label>
              <input
                type="time"
                value={start}
                onChange={(e) => setStart(e.target.value)}
                className="w-full p-3 rounded-xl bg-background border border-input hover:border-primary/50 transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">End Time</label>
              <input
                type="time"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
                className="w-full p-3 rounded-xl bg-background border border-input hover:border-primary/50 transition-colors"
              />
            </div>
          </div>
        </div>
      }
      result={
        result && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ResultCard label="Duration" value={result.label} type="highlight" />
            <ResultCard label="Total Minutes" value={fmtNumber(result.minutes, 0)} />
          </div>
        )
      }
    />
  )
}

export function AgeDifferenceCalculator() {
  const [dob1, setDob1] = useState("1995-01-01")
  const [dob2, setDob2] = useState("2000-01-01")
  const [result, setResult] = useState<{ years: number; months: number; days: number } | null>(null)

  const calculate = () => {
    const d1 = new Date(dob1)
    const d2 = new Date(dob2)
    const from = d1 <= d2 ? d1 : d2
    const to = d1 <= d2 ? d2 : d1
    setResult(diffYMD(from, to))
  }

  return (
    <FinancialCalculatorTemplate
      title="Age Difference Calculator"
      description="Calculate the age difference between two dates."
      icon={Calendar}
      calculate={calculate}
      values={[dob1, dob2]}
      inputs={
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Date 1</label>
              <input
                type="date"
                value={dob1}
                onChange={(e) => setDob1(e.target.value)}
                className="w-full p-3 rounded-xl bg-background border border-input hover:border-primary/50 transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Date 2</label>
              <input
                type="date"
                value={dob2}
                onChange={(e) => setDob2(e.target.value)}
                className="w-full p-3 rounded-xl bg-background border border-input hover:border-primary/50 transition-colors"
              />
            </div>
          </div>
        </div>
      }
      result={
        result && <ResultCard label="Difference" value={`${result.years}y ${result.months}m ${result.days}d`} type="highlight" />
      }
    />
  )
}

const zodiacFor = (dateStr: string) => {
  const d = new Date(dateStr)
  const day = d.getDate()
  const month = d.getMonth() + 1
  if (month === 1) return day >= 20 ? "Aquarius" : "Capricorn"
  if (month === 2) return day >= 19 ? "Pisces" : "Aquarius"
  if (month === 3) return day >= 21 ? "Aries" : "Pisces"
  if (month === 4) return day >= 20 ? "Taurus" : "Aries"
  if (month === 5) return day >= 21 ? "Gemini" : "Taurus"
  if (month === 6) return day >= 21 ? "Cancer" : "Gemini"
  if (month === 7) return day >= 23 ? "Leo" : "Cancer"
  if (month === 8) return day >= 23 ? "Virgo" : "Leo"
  if (month === 9) return day >= 23 ? "Libra" : "Virgo"
  if (month === 10) return day >= 23 ? "Scorpio" : "Libra"
  if (month === 11) return day >= 22 ? "Sagittarius" : "Scorpio"
  return day >= 22 ? "Capricorn" : "Sagittarius"
}

export function ZodiacSignCalculator() {
  const [dob, setDob] = useState("2000-01-01")
  const [result, setResult] = useState<string | null>(null)

  const calculate = () => {
    setResult(zodiacFor(dob))
  }

  return (
    <FinancialCalculatorTemplate
      title="Zodiac Sign Calculator"
      description="Find your (Western) zodiac sign based on your birth date."
      icon={Star}
      calculate={calculate}
      values={[dob]}
      inputs={
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Date of Birth</label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="w-full p-3 rounded-xl bg-background border border-input hover:border-primary/50 transition-colors"
            />
          </div>
        </div>
      }
      result={result && <ResultCard label="Zodiac Sign" value={result} type="highlight" />}
    />
  )
}

const hashString = (s: string) => {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

export function LoveCalculator() {
  const [name1, setName1] = useState("")
  const [name2, setName2] = useState("")

  const result = useMemo(() => {
    const a = name1.trim().toLowerCase()
    const b = name2.trim().toLowerCase()
    if (!a || !b) return null
    const seed = hashString([a, b].sort().join("|"))
    const percent = 30 + (seed % 71) // 30..100
    const label = percent >= 85 ? "Excellent" : percent >= 70 ? "Great" : percent >= 55 ? "Good" : "Okay"
    return { percent, label }
  }, [name1, name2])

  return (
    <FinancialCalculatorTemplate
      title="Love Calculator"
      description="A fun compatibility score based on names (for entertainment only)."
      icon={Heart}
      calculate={() => {}}
      values={[name1, name2]}
      inputs={
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name 1</label>
              <input
                type="text"
                value={name1}
                onChange={(e) => setName1(e.target.value)}
                className="w-full p-3 rounded-xl bg-background border border-input hover:border-primary/50 transition-colors"
                placeholder="First name"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Name 2</label>
              <input
                type="text"
                value={name2}
                onChange={(e) => setName2(e.target.value)}
                className="w-full p-3 rounded-xl bg-background border border-input hover:border-primary/50 transition-colors"
                placeholder="Second name"
              />
            </div>
          </div>
        </div>
      }
      result={
        result && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ResultCard label="Compatibility" value={`${result.percent}%`} type="highlight" />
            <ResultCard label="Label" value={result.label} type="success" />
          </div>
        )
      }
    />
  )
}

export function GradeCalculator() {
  const [obtained, setObtained] = useState(420)
  const [total, setTotal] = useState(500)
  const [result, setResult] = useState<{ percent: number; grade: string } | null>(null)

  const calculate = () => {
    const percent = total > 0 ? (obtained / total) * 100 : 0
    const grade =
      percent >= 90
        ? "A+"
        : percent >= 80
          ? "A"
          : percent >= 70
            ? "B"
            : percent >= 60
              ? "C"
              : percent >= 50
                ? "D"
                : "F"
    setResult({ percent, grade })
  }

  return (
    <FinancialCalculatorTemplate
      title="Grade Calculator"
      description="Calculate percentage and grade from marks."
      icon={GraduationCap}
      calculate={calculate}
      values={[obtained, total]}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Marks Obtained" value={obtained} onChange={setObtained} min={0} max={1e9} step={1} />
          <InputGroup label="Total Marks" value={total} onChange={setTotal} min={1} max={1e9} step={1} />
        </div>
      }
      result={
        result && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ResultCard label="Percentage" value={`${fmtNumber(result.percent, 2)}%`} type="highlight" />
            <ResultCard label="Grade" value={result.grade} type="success" />
            <ResultCard label="Status" value={result.grade === "F" ? "Fail" : "Pass"} type={result.grade === "F" ? "warning" : "default"} />
          </div>
        )
      }
    />
  )
}

export function GPACalculator() {
  const [gp1, setGp1] = useState(8)
  const [cr1, setCr1] = useState(3)
  const [gp2, setGp2] = useState(7)
  const [cr2, setCr2] = useState(3)
  const [gp3, setGp3] = useState(9)
  const [cr3, setCr3] = useState(3)
  const [gp4, setGp4] = useState(8)
  const [cr4, setCr4] = useState(2)
  const [gp5, setGp5] = useState(7)
  const [cr5, setCr5] = useState(2)
  const [result, setResult] = useState<{ gpa: number; totalCredits: number } | null>(null)

  const calculate = () => {
    const points = gp1 * cr1 + gp2 * cr2 + gp3 * cr3 + gp4 * cr4 + gp5 * cr5
    const credits = cr1 + cr2 + cr3 + cr4 + cr5
    const gpa = credits > 0 ? points / credits : 0
    setResult({ gpa, totalCredits: credits })
  }

  return (
    <FinancialCalculatorTemplate
      title="GPA Calculator"
      description="Calculate weighted GPA using grade points and credits (5 courses)."
      icon={GraduationCap}
      calculate={calculate}
      values={[gp1, cr1, gp2, cr2, gp3, cr3, gp4, cr4, gp5, cr5]}
      inputs={
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputGroup label="Course 1 Grade Points" value={gp1} onChange={setGp1} min={0} max={10} step={0.1} />
            <InputGroup label="Course 1 Credits" value={cr1} onChange={setCr1} min={0} max={10} step={1} />
            <InputGroup label="Course 2 Grade Points" value={gp2} onChange={setGp2} min={0} max={10} step={0.1} />
            <InputGroup label="Course 2 Credits" value={cr2} onChange={setCr2} min={0} max={10} step={1} />
            <InputGroup label="Course 3 Grade Points" value={gp3} onChange={setGp3} min={0} max={10} step={0.1} />
            <InputGroup label="Course 3 Credits" value={cr3} onChange={setCr3} min={0} max={10} step={1} />
            <InputGroup label="Course 4 Grade Points" value={gp4} onChange={setGp4} min={0} max={10} step={0.1} />
            <InputGroup label="Course 4 Credits" value={cr4} onChange={setCr4} min={0} max={10} step={1} />
            <InputGroup label="Course 5 Grade Points" value={gp5} onChange={setGp5} min={0} max={10} step={0.1} />
            <InputGroup label="Course 5 Credits" value={cr5} onChange={setCr5} min={0} max={10} step={1} />
          </div>
        </div>
      }
      result={
        result && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ResultCard label="GPA" value={fmtNumber(result.gpa, 3)} type="highlight" />
            <ResultCard label="Total Credits" value={fmtNumber(result.totalCredits, 0)} />
          </div>
        )
      }
    />
  )
}

function SimpleConverterTemplate(props: {
  title: string
  description: string
  icon: any
  units: Record<string, number>
  defaultFrom: string
  defaultTo: string
  digits?: number
}) {
  const [value, setValue] = useState(1)
  const [from, setFrom] = useState(props.defaultFrom)
  const [to, setTo] = useState(props.defaultTo)

  const converted = useMemo(() => {
    const base = value * props.units[from]
    return base / props.units[to]
  }, [value, from, to, props.units])

  return (
    <FinancialCalculatorTemplate
      title={props.title}
      description={props.description}
      icon={props.icon}
      calculate={() => {}}
      values={[value, from, to]}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Value" value={value} onChange={setValue} min={-1e9} max={1e9} step={0.01} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">From</label>
              <select
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="w-full p-3 rounded-xl bg-background border border-input hover:border-primary/50 transition-colors"
              >
                {Object.keys(props.units).map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">To</label>
              <select
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="w-full p-3 rounded-xl bg-background border border-input hover:border-primary/50 transition-colors"
              >
                {Object.keys(props.units).map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      }
      result={<ResultCard label="Converted" value={fmtNumber(converted, props.digits ?? 4)} type="highlight" />}
    />
  )
}

export function SpeedConverter() {
  const units = useMemo(
    () => ({
      "m/s": 1,
      "km/h": 0.2777777778,
      mph: 0.44704,
      knot: 0.5144444444
    }),
    []
  )

  return (
    <SimpleConverterTemplate
      title="Speed Converter"
      description="Convert between common speed units."
      icon={Gauge}
      units={units}
      defaultFrom="km/h"
      defaultTo="mph"
    />
  )
}

export function VolumeConverter() {
  const units = useMemo(
    () => ({
      ml: 0.001,
      L: 1,
      "m³": 1000,
      "US gal": 3.785411784,
      "US qt": 0.946352946,
      "US cup": 0.2365882365
    }),
    []
  )

  return (
    <SimpleConverterTemplate
      title="Volume Converter"
      description="Convert common volume units."
      icon={Droplets}
      units={units}
      defaultFrom="L"
      defaultTo="ml"
    />
  )
}

export function AreaConverter() {
  const units = useMemo(
    () => ({
      "m²": 1,
      "km²": 1_000_000,
      "ft²": 0.09290304,
      "yd²": 0.83612736,
      acre: 4046.8564224,
      hectare: 10_000
    }),
    []
  )

  return (
    <SimpleConverterTemplate
      title="Area Converter"
      description="Convert common area units."
      icon={Square}
      units={units}
      defaultFrom="m²"
      defaultTo="ft²"
    />
  )
}

export function TimeConverter() {
  const units = useMemo(
    () => ({
      second: 1,
      minute: 60,
      hour: 3600,
      day: 86400,
      week: 604800
    }),
    []
  )

  return (
    <SimpleConverterTemplate
      title="Time Converter"
      description="Convert between seconds, minutes, hours, days, and weeks."
      icon={Timer}
      units={units}
      defaultFrom="hour"
      defaultTo="minute"
      digits={4}
    />
  )
}

export function PressureConverter() {
  const units = useMemo(
    () => ({
      Pa: 1,
      kPa: 1000,
      bar: 100000,
      atm: 101325,
      psi: 6894.757293
    }),
    []
  )

  return (
    <SimpleConverterTemplate
      title="Pressure Converter"
      description="Convert pressure units."
      icon={Wind}
      units={units}
      defaultFrom="kPa"
      defaultTo="psi"
    />
  )
}

export function PowerConverter() {
  const units = useMemo(
    () => ({
      W: 1,
      kW: 1000,
      hp: 745.699872
    }),
    []
  )

  return (
    <SimpleConverterTemplate
      title="Power Converter"
      description="Convert W, kW, and horsepower."
      icon={Battery}
      units={units}
      defaultFrom="kW"
      defaultTo="hp"
    />
  )
}

export function EnergyConverter() {
  const units = useMemo(
    () => ({
      J: 1,
      kJ: 1000,
      Wh: 3600,
      kWh: 3_600_000,
      cal: 4.184,
      kcal: 4184
    }),
    []
  )

  return (
    <SimpleConverterTemplate
      title="Energy Converter"
      description="Convert between common energy units."
      icon={Zap}
      units={units}
      defaultFrom="kWh"
      defaultTo="J"
    />
  )
}

export function DataStorageConverter() {
  const [base, setBase] = useState<1000 | 1024>(1024)
  const [value, setValue] = useState(1)
  const [from, setFrom] = useState("GB")
  const [to, setTo] = useState("MB")

  const units = useMemo(() => {
    const b = base
    return {
      B: 1,
      KB: b,
      MB: b ** 2,
      GB: b ** 3,
      TB: b ** 4,
      PB: b ** 5
    }
  }, [base])

  const converted = useMemo(() => {
    const bytes = value * (units as any)[from]
    return bytes / (units as any)[to]
  }, [value, from, to, units])

  return (
    <FinancialCalculatorTemplate
      title="Data Storage Converter"
      description="Convert storage units with base 1000 (SI) or 1024 (binary)."
      icon={Wifi}
      calculate={() => {}}
      values={[base, value, from, to]}
      inputs={
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Base</label>
            <select
              value={base}
              onChange={(e) => setBase(Number(e.target.value) as any)}
              className="w-full p-3 rounded-xl bg-background border border-input hover:border-primary/50 transition-colors"
            >
              <option value={1000}>1000 (KB/MB/GB)</option>
              <option value={1024}>1024 (KiB/MiB/GiB)</option>
            </select>
          </div>

          <InputGroup label="Value" value={value} onChange={setValue} min={0} max={1e18} step={0.01} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">From</label>
              <select
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="w-full p-3 rounded-xl bg-background border border-input hover:border-primary/50 transition-colors"
              >
                {Object.keys(units).map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">To</label>
              <select
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="w-full p-3 rounded-xl bg-background border border-input hover:border-primary/50 transition-colors"
              >
                {Object.keys(units).map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      }
      result={<ResultCard label="Converted" value={fmtNumber(converted, 6)} type="highlight" />}
    />
  )
}

export function CookingConverter() {
  const units = useMemo(
    () => ({
      tsp: 4.92892159375,
      tbsp: 14.78676478125,
      cup: 236.5882365,
      "fl oz": 29.5735295625,
      ml: 1,
      L: 1000
    }),
    []
  )

  return (
    <SimpleConverterTemplate
      title="Cooking Converter"
      description="Convert common cooking volume measures."
      icon={Droplets}
      units={units}
      defaultFrom="cup"
      defaultTo="ml"
      digits={4}
    />
  )
}

const toRoman = (num: number) => {
  if (!Number.isFinite(num) || num <= 0 || num >= 4000) return null
  const map: Array<[number, string]> = [
    [1000, "M"],
    [900, "CM"],
    [500, "D"],
    [400, "CD"],
    [100, "C"],
    [90, "XC"],
    [50, "L"],
    [40, "XL"],
    [10, "X"],
    [9, "IX"],
    [5, "V"],
    [4, "IV"],
    [1, "I"]
  ]
  let n = Math.floor(num)
  let out = ""
  for (const [v, s] of map) {
    while (n >= v) {
      out += s
      n -= v
    }
  }
  return out
}

const fromRoman = (roman: string) => {
  const s = roman.trim().toUpperCase()
  if (!s) return null
  const values: Record<string, number> = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 }
  let total = 0
  for (let i = 0; i < s.length; i++) {
    const v = values[s[i]]
    const next = i + 1 < s.length ? values[s[i + 1]] : 0
    if (!v) return null
    total += v < next ? -v : v
  }
  // basic validation round-trip
  const back = toRoman(total)
  if (!back || back !== s) return null
  return total
}

export function RomanNumeralConverter() {
  const [mode, setMode] = useState<"toRoman" | "toNumber">("toRoman")
  const [number, setNumber] = useState(1999)
  const [roman, setRoman] = useState("MCMXCIX")

  const result = useMemo(() => {
    if (mode === "toRoman") {
      const r = toRoman(number)
      return r ? { ok: true, value: r } : { ok: false, value: "Enter 1..3999" }
    }
    const n = fromRoman(roman)
    return n !== null ? { ok: true, value: n.toString() } : { ok: false, value: "Invalid Roman numeral" }
  }, [mode, number, roman])

  return (
    <FinancialCalculatorTemplate
      title="Roman Numeral Converter"
      description="Convert numbers ↔ Roman numerals (I..MMMCMXCIX)."
      icon={CalculatorIcon}
      calculate={() => {}}
      values={[mode, number, roman]}
      inputs={
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Mode</label>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value as any)}
              className="w-full p-3 rounded-xl bg-background border border-input hover:border-primary/50 transition-colors"
            >
              <option value="toRoman">Number → Roman</option>
              <option value="toNumber">Roman → Number</option>
            </select>
          </div>

          {mode === "toRoman" ? (
            <InputGroup label="Number" value={number} onChange={setNumber} min={1} max={3999} step={1} />
          ) : (
            <div className="space-y-2">
              <label className="text-sm font-medium">Roman Numeral</label>
              <input
                type="text"
                value={roman}
                onChange={(e) => setRoman(e.target.value)}
                className="w-full p-3 rounded-xl bg-background border border-input hover:border-primary/50 transition-colors"
                placeholder="e.g. XIV"
              />
            </div>
          )}
        </div>
      }
      result={<ResultCard label="Result" value={result.value} type={result.ok ? "highlight" : "warning"} />}
    />
  )
}
