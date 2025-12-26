export interface MonthlyAmortizationRow {
  month: number
  year: number
  principal: number
  interest: number
  totalPayment: number
  balance: number
  cumulativeInterest?: number
}

export interface YearlyAmortizationRow {
  year: number
  principal: number
  interest: number
  totalPayment: number
  startBalance: number
  endBalance: number
}

export function aggregateAmortizationByYear(
  rows: MonthlyAmortizationRow[]
): YearlyAmortizationRow[] {
  if (!rows?.length) return []

  const sorted = [...rows].sort((a, b) => a.month - b.month)
  const byYear = new Map<number, MonthlyAmortizationRow[]>()

  for (const row of sorted) {
    const year = row.year ?? Math.ceil(row.month / 12)
    const list = byYear.get(year)
    if (list) list.push(row)
    else byYear.set(year, [row])
  }

  const years = Array.from(byYear.keys()).sort((a, b) => a - b)

  return years.map((year) => {
    const list = byYear.get(year) ?? []
    const first = list[0]
    const last = list[list.length - 1]

    const principal = list.reduce((sum, r) => sum + (Number(r.principal) || 0), 0)
    const interest = list.reduce((sum, r) => sum + (Number(r.interest) || 0), 0)
    const totalPayment = list.reduce(
      (sum, r) => sum + (Number(r.totalPayment) || 0),
      0
    )

    const endBalance = Number(last?.balance) || 0

    // Approximate start-of-year balance by undoing the first month's principal payment.
    // This keeps the table informative without requiring initial principal as input.
    const startBalance = Math.max(0, (Number(first?.balance) || 0) + (Number(first?.principal) || 0))

    return {
      year,
      principal,
      interest,
      totalPayment,
      startBalance,
      endBalance,
    }
  })
}
