"use client"

import { useState } from "react"
import { TrendingUp, BarChart3, Users } from "lucide-react"
import { FinancialCalculatorTemplate, InputGroup, ResultCard } from "@/components/calculators/templates/FinancialCalculatorTemplate"
import { useTranslation } from "@/hooks/useTranslation"

export function CustomerSatisfactionCalculator() {
    const { t } = useTranslation()

    // Industry benchmarks for US market (2024 data)
    const industryBenchmarks: Record<string, { csat: number; nps: number; ces: number }> = {
        'e-commerce': { csat: 80, nps: 59, ces: 3.5 },
        'saas/software': { csat: 78, nps: 41, ces: 3.2 },
        'retail': { csat: 75, nps: 40, ces: 3.8 },
        'healthcare': { csat: 76, nps: 71, ces: 4.0 },
        'banking': { csat: 78, nps: 45, ces: 3.3 },
        'services': { csat: 75, nps: 40, ces: 3.7 },
        'logistics': { csat: 77, nps: 40, ces: 3.6 },
        'hospitality': { csat: 75, nps: 42, ces: 3.5 }
    }

    const [metric, setMetric] = useState<'CSAT' | 'NPS' | 'CES'>('CSAT')
    const [industry, setIndustry] = useState('e-commerce')

    // CSAT inputs
    const [satisfied, setSatisfied] = useState(85)
    const [neutral, setNeutral] = useState(10)
    const [dissatisfied, setDissatisfied] = useState(5)

    // NPS inputs
    const [promoters, setPromoters] = useState(70)
    const [passives, setPassives] = useState(20)
    const [detractors, setDetractors] = useState(10)

    // CES inputs
    const [lowEffort, setLowEffort] = useState(60)
    const [mediumEffort, setMediumEffort] = useState(30)
    const [highEffort, setHighEffort] = useState(10)

    const [result, setResult] = useState<any>(null)

    const calculate = () => {
        const benchmark = industryBenchmarks[industry.toLowerCase()] || industryBenchmarks['e-commerce']

        if (metric === 'CSAT') {
            const total = satisfied + neutral + dissatisfied
            if (total <= 0) {
                setResult({ error: 'Total responses must be greater than 0' })
                return
            }

            const csatScore = (satisfied / total) * 100
            const benchmarkCsat = benchmark.csat
            const vsIndustry = csatScore - benchmarkCsat

            let rating = ''
            let emoji = ''
            if (csatScore >= 80) { rating = 'Excellent'; emoji = '🌟'; }
            else if (csatScore >= 70) { rating = 'Good'; emoji = '✅'; }
            else if (csatScore >= 60) { rating = 'Fair'; emoji = '⚠️'; }
            else { rating = 'Needs Improvement'; emoji = '🔴'; }

            const insights = []
            if (csatScore > benchmarkCsat) {
                insights.push(`✓ Above industry average by ${vsIndustry.toFixed(1)}%`)
            } else {
                insights.push(`⚠ Below industry average by ${Math.abs(vsIndustry).toFixed(1)}%`)
            }

            if (dissatisfied > 0) {
                insights.push(`• ${dissatisfied} dissatisfied customers need attention`)
            }

            setResult({
                score: csatScore,
                rating,
                emoji,
                benchmark: benchmarkCsat,
                vsIndustry,
                total,
                satisfied,
                neutral,
                dissatisfied,
                insights
            })
        } else if (metric === 'NPS') {
            const total = promoters + passives + detractors
            if (total <= 0) {
                setResult({ error: 'Total responses must be greater than 0' })
                return
            }

            const promoterPct = (promoters / total) * 100
            const detractorPct = (detractors / total) * 100
            const npsScore = promoterPct - detractorPct
            const benchmarkNps = benchmark.nps
            const vsIndustry = npsScore - benchmarkNps

            let rating = ''
            let emoji = ''
            if (npsScore >= 70) { rating = 'World Class'; emoji = '🌟'; }
            else if (npsScore >= 50) { rating = 'Excellent'; emoji = '💎'; }
            else if (npsScore >= 30) { rating = 'Great'; emoji = '✅'; }
            else if (npsScore >= 0) { rating = 'Good'; emoji = '👍'; }
            else { rating = 'Needs Improvement'; emoji = '🔴'; }

            const insights = []
            if (npsScore > benchmarkNps) {
                insights.push(`✓ Above industry average by ${vsIndustry.toFixed(0)} points`)
            } else {
                insights.push(`⚠ Below industry average by ${Math.abs(vsIndustry).toFixed(0)} points`)
            }

            if (detractors > 0) {
                insights.push(`• ${detractors} detractors at risk of churn`)
            }

            setResult({
                score: npsScore,
                rating,
                emoji,
                benchmark: benchmarkNps,
                vsIndustry,
                total,
                promoters,
                passives,
                detractors,
                promoterPct,
                detractorPct,
                insights
            })
        } else { // CES
            const total = lowEffort + mediumEffort + highEffort
            if (total <= 0) {
                setResult({ error: 'Total responses must be greater than 0' })
                return
            }

            const avgScore = (lowEffort * 2 + mediumEffort * 4.5 + highEffort * 6.5) / total
            const benchmarkCes = benchmark.ces

            let rating = ''
            let emoji = ''
            if (avgScore <= 3.0) { rating = 'Excellent'; emoji = '🌟'; }
            else if (avgScore <= 4.0) { rating = 'Good'; emoji = '✅'; }
            else if (avgScore <= 5.0) { rating = 'Fair'; emoji = '⚠️'; }
            else { rating = 'High Effort'; emoji = '🔴'; }

            const lowEffortPct = (lowEffort / total) * 100

            const insights = []
            if (avgScore < benchmarkCes) {
                insights.push(`✓ Better than industry average (Lower is better)`)
            } else {
                insights.push(`⚠ More effort required than industry average`)
            }

            if (highEffort > 0) {
                insights.push(`• ${highEffort} customers found it difficult`)
            }

            setResult({
                score: avgScore,
                rating,
                emoji,
                benchmark: benchmarkCes,
                total,
                lowEffort,
                mediumEffort,
                highEffort,
                lowEffortPct,
                insights
            })
        }
    }

    const handleClear = () => {
        setSatisfied(0)
        setNeutral(0)
        setDissatisfied(0)
        setPromoters(0)
        setPassives(0)
        setDetractors(0)
        setLowEffort(0)
        setMediumEffort(0)
        setHighEffort(0)
        setResult(null)
    }

    const getMetricTitle = () => {
        if (metric === 'CSAT') return 'Customer Satisfaction (CSAT)'
        if (metric === 'NPS') return 'Net Promoter Score (NPS)'
        return 'Customer Effort Score (CES)'
    }

    const getMetricDescription = () => {
        if (metric === 'CSAT') return 'Measure customer satisfaction percentage with industry benchmarking'
        if (metric === 'NPS') return 'Calculate customer loyalty score from -100 to +100'
        return 'Track how easy customers found your service (lower is better)'
    }

    return (
        <FinancialCalculatorTemplate
            title="Customer Satisfaction Analytics"
            description="Advanced CSAT, NPS & CES calculator with industry benchmarking and insights"
            icon={TrendingUp}
            calculate={calculate}
            onClear={handleClear}
            onRestoreAction={(vals) => {
                setMetric(vals[0] as any || 'CSAT')
                setIndustry(vals[1] || 'e-commerce')
                if (vals[0] === 'CSAT') {
                    setSatisfied(Number(vals[2]) || 0)
                    setNeutral(Number(vals[3]) || 0)
                    setDissatisfied(Number(vals[4]) || 0)
                } else if (vals[0] === 'NPS') {
                    setPromoters(Number(vals[2]) || 0)
                    setPassives(Number(vals[3]) || 0)
                    setDetractors(Number(vals[4]) || 0)
                } else {
                    setLowEffort(Number(vals[2]) || 0)
                    setMediumEffort(Number(vals[3]) || 0)
                    setHighEffort(Number(vals[4]) || 0)
                }
            }}
            values={
                metric === 'CSAT'
                    ? [metric, industry, satisfied, neutral, dissatisfied]
                    : metric === 'NPS'
                        ? [metric, industry, promoters, passives, detractors]
                        : [metric, industry, lowEffort, mediumEffort, highEffort]
            }
            category="Business"
            calculatorId="customer-satisfaction"
            inputs={
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Select Metric</label>
                        <select
                            value={metric}
                            onChange={(e) => setMetric(e.target.value as any)}
                            className="w-full p-3 rounded-xl bg-background border-2 border-input focus:border-primary outline-none transition-all"
                        >
                            <option value="CSAT">CSAT (Satisfaction)</option>
                            <option value="NPS">NPS (Net Promoter)</option>
                            <option value="CES">CES (Effort Score)</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Your Industry</label>
                        <select
                            value={industry}
                            onChange={(e) => setIndustry(e.target.value)}
                            className="w-full p-3 rounded-xl bg-background border-2 border-input focus:border-primary outline-none transition-all"
                        >
                            <option value="e-commerce">E-commerce</option>
                            <option value="saas/software">SaaS/Software</option>
                            <option value="retail">Retail</option>
                            <option value="healthcare">Healthcare</option>
                            <option value="banking">Banking</option>
                            <option value="services">Services</option>
                            <option value="logistics">Logistics</option>
                            <option value="hospitality">Hospitality</option>
                        </select>
                    </div>

                    <div className="pt-4 border-t">
                        <h4 className="text-sm font-semibold mb-4">{getMetricTitle()}</h4>

                        {metric === 'CSAT' && (
                            <>
                                <InputGroup
                                    label="Satisfied Responses (4-5 rating)"
                                    value={satisfied}
                                    onChange={setSatisfied}
                                    min={0}
                                    max={10000}
                                    step={1}
                                />
                                <InputGroup
                                    label="Neutral Responses (3 rating)"
                                    value={neutral}
                                    onChange={setNeutral}
                                    min={0}
                                    max={10000}
                                    step={1}
                                />
                                <InputGroup
                                    label="Dissatisfied Responses (1-2 rating)"
                                    value={dissatisfied}
                                    onChange={setDissatisfied}
                                    min={0}
                                    max={10000}
                                    step={1}
                                />
                            </>
                        )}

                        {metric === 'NPS' && (
                            <>
                                <InputGroup
                                    label="Promoters (9-10 rating)"
                                    value={promoters}
                                    onChange={setPromoters}
                                    min={0}
                                    max={10000}
                                    step={1}
                                />
                                <InputGroup
                                    label="Passives (7-8 rating)"
                                    value={passives}
                                    onChange={setPassives}
                                    min={0}
                                    max={10000}
                                    step={1}
                                />
                                <InputGroup
                                    label="Detractors (0-6 rating)"
                                    value={detractors}
                                    onChange={setDetractors}
                                    min={0}
                                    max={10000}
                                    step={1}
                                />
                            </>
                        )}

                        {metric === 'CES' && (
                            <>
                                <InputGroup
                                    label="Low Effort (1-3 on 7-point scale)"
                                    value={lowEffort}
                                    onChange={setLowEffort}
                                    min={0}
                                    max={10000}
                                    step={1}
                                />
                                <InputGroup
                                    label="Medium Effort (4-5)"
                                    value={mediumEffort}
                                    onChange={setMediumEffort}
                                    min={0}
                                    max={10000}
                                    step={1}
                                />
                                <InputGroup
                                    label="High Effort (6-7)"
                                    value={highEffort}
                                    onChange={setHighEffort}
                                    min={0}
                                    max={10000}
                                    step={1}
                                />
                            </>
                        )}
                    </div>
                </div>
            }
            result={
                result && !result.error && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <ResultCard
                                label={metric === 'CES' ? 'CES Score' : `${metric} Score`}
                                value={metric === 'CES' ? result.score.toFixed(2) : metric === 'NPS' ? result.score.toFixed(0) : `${result.score.toFixed(1)}%`}
                                type="highlight"
                                icon={TrendingUp}
                                suffix={result.emoji}
                            />
                            <ResultCard
                                label="Performance"
                                value={result.rating}
                                type={result.rating.includes('Excellent') || result.rating.includes('World') ? 'success' : 'default'}
                                icon={BarChart3}
                            />
                            <ResultCard
                                label="Industry Avg"
                                value={metric === 'CES' ? result.benchmark.toFixed(1) : metric === 'NPS' ? result.benchmark : `${result.benchmark}%`}
                                type="default"
                                icon={Users}
                            />
                        </div>

                        <div className="p-4 bg-secondary/20 rounded-xl border border-border/50">
                            <h4 className="font-semibold mb-3 flex items-center gap-2">
                                💡 Insights & Recommendations
                            </h4>
                            <ul className="space-y-2">
                                {result.insights.map((insight: string, idx: number) => (
                                    <li key={idx} className="text-sm text-muted-foreground">{insight}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )
            }
        />
    )
}
