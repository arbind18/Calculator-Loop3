export type Numeric = number

export type LoanLikeScheduleRow = {
  month?: Numeric
  year?: Numeric
  principal?: Numeric
  interest?: Numeric
  totalPayment?: Numeric
  balance?: Numeric
  cumulativeInterest?: Numeric
}

export type YearlyLoanScheduleRow = {
  year: number
  principalPaid: number
  interestPaid: number
  totalPaid: number
  endingBalance: number
  cumulativeInterest?: number
}

export function aggregateLoanScheduleByYear(
  schedule: LoanLikeScheduleRow[]
): YearlyLoanScheduleRow[] {
  const byYear = new Map<number, YearlyLoanScheduleRow>()

  for (const row of schedule) {
    const year = typeof row.year === "number" && Number.isFinite(row.year) ? row.year : undefined
    if (!year) continue

    const existing = byYear.get(year) ?? {
      year,
      principalPaid: 0,
      interestPaid: 0,
      totalPaid: 0,
      endingBalance: 0,
    }

    const principal = typeof row.principal === "number" && Number.isFinite(row.principal) ? row.principal : 0
    const interest = typeof row.interest === "number" && Number.isFinite(row.interest) ? row.interest : 0
    const total = typeof row.totalPayment === "number" && Number.isFinite(row.totalPayment) ? row.totalPayment : principal + interest

    existing.principalPaid += principal
    existing.interestPaid += interest
    existing.totalPaid += total

    if (typeof row.balance === "number" && Number.isFinite(row.balance)) {
      existing.endingBalance = row.balance
    }

    if (typeof row.cumulativeInterest === "number" && Number.isFinite(row.cumulativeInterest)) {
      existing.cumulativeInterest = row.cumulativeInterest
    }

    byYear.set(year, existing)
  }

  return Array.from(byYear.values()).sort((a, b) => a.year - b.year)
}

export type ScheduleRangeOption = "all" | "1yr" | "5yr" | "custom"

export function filterScheduleByYearRange<T extends { year?: number }>(
  schedule: T[],
  range: ScheduleRangeOption,
  customStartYear?: number,
  customEndYear?: number
): T[] {
  if (range === "all") return schedule
  if (range === "1yr") return schedule.filter((r) => (r.year ?? 0) >= 1 && (r.year ?? 0) <= 1)
  if (range === "5yr") return schedule.filter((r) => (r.year ?? 0) >= 1 && (r.year ?? 0) <= 5)

  const start = typeof customStartYear === "number" && Number.isFinite(customStartYear) ? customStartYear : 1
  const end = typeof customEndYear === "number" && Number.isFinite(customEndYear) ? customEndYear : start
  const normalizedStart = Math.max(1, Math.min(start, end))
  const normalizedEnd = Math.max(1, Math.max(start, end))

  return schedule.filter((r) => {
    const y = r.year ?? 0
    return y >= normalizedStart && y <= normalizedEnd
  })
}
