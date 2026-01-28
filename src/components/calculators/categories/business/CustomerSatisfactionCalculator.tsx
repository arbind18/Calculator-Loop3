
"use client"

import { useState, useEffect } from "react"
import { TrendingUp, BarChart3, Users, CheckCircle2, AlertCircle, HelpCircle, Activity, Trophy, Target } from "lucide-react"
import { FinancialCalculatorTemplate, InputGroup, ResultCard } from "@/components/calculators/templates/FinancialCalculatorTemplate"
import { useTranslation } from "@/hooks/useTranslation"
import { motion, AnimatePresence } from "framer-motion"
import { PieChart, Pie, Cell, ResponsiveContainer, RadialBarChart, RadialBar, PolarAngleAxis } from "recharts"

export function CustomerSatisfactionCalculator() {
    const { t } = useTranslation()
    console.log("🚀 CustomerSatisfactionCalculator NEW UI MOUNTED")

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
            let color = ''
            if (csatScore >= 80) { rating = 'Excellent'; emoji = '🌟'; color = '#22c55e'; }
            else if (csatScore >= 70) { rating = 'Good'; emoji = '✅'; color = '#84cc16'; }
            else if (csatScore >= 60) { rating = 'Fair'; emoji = '⚠️'; color = '#eab308'; }
            else { rating = 'Needs Improvement'; emoji = '🔴'; color = '#ef4444'; }

            const insights = []
            if (csatScore > benchmarkCsat) {
                insights.push(`✓ Above industry average by ${vsIndustry.toFixed(1)}%`)
            } else {
                insights.push(`⚠ Below industry average by ${Math.abs(vsIndustry).toFixed(1)}%`)
            }

            setResult({
                score: csatScore,
                rating,
                emoji,
                color,
                benchmark: benchmarkCsat,
                vsIndustry,
                total,
                satisfied,
                neutral,
                dissatisfied,
                insights,
                chartData: [
                    { name: 'Satisfied', value: satisfied, fill: '#22c55e' },
                    { name: 'Neutral', value: neutral, fill: '#eab308' },
                    { name: 'Dissatisfied', value: dissatisfied, fill: '#ef4444' }
                ]
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
            let color = ''
            if (npsScore >= 70) { rating = 'World Class'; emoji = '🌟'; color = '#22c55e'; }
            else if (npsScore >= 50) { rating = 'Excellent'; emoji = '💎'; color = '#84cc16'; }
            else if (npsScore >= 30) { rating = 'Great'; emoji = '✅'; color = '#3b82f6'; }
            else if (npsScore >= 0) { rating = 'Good'; emoji = '👍'; color = '#eab308'; }
            else { rating = 'Needs Improvement'; emoji = '🔴'; color = '#ef4444'; }

            const insights = []
            if (npsScore > benchmarkNps) {
                insights.push(`✓ Above industry average by ${vsIndustry.toFixed(0)} points`)
            } else {
                insights.push(`⚠ Below industry average by ${Math.abs(vsIndustry).toFixed(0)} points`)
            }

            setResult({
                score: npsScore,
                rating,
                emoji,
                color,
                benchmark: benchmarkNps,
                vsIndustry,
                total,
                promoters,
                passives,
                detractors,
                insights,
                chartData: [
                    { name: 'Promoters', value: promoters, fill: '#22c55e' },
                    { name: 'Passives', value: passives, fill: '#eab308' },
                    { name: 'Detractors', value: detractors, fill: '#ef4444' }
                ]
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
            let color = ''
            if (avgScore <= 3.0) { rating = 'Excellent'; emoji = '🌟'; color = '#22c55e'; }
            else if (avgScore <= 4.0) { rating = 'Good'; emoji = '✅'; color = '#84cc16'; }
            else if (avgScore <= 5.0) { rating = 'Fair'; emoji = '⚠️'; color = '#eab308'; }
            else { rating = 'High Effort'; emoji = '🔴'; color = '#ef4444'; }

            const insights = []
            if (avgScore < benchmarkCes) {
                insights.push(`✓ Better than industry average (Lower is better)`)
            } else {
                insights.push(`⚠ More effort required than industry average`)
            }

            setResult({
                score: avgScore,
                rating,
                emoji,
                color,
                benchmark: benchmarkCes,
                total,
                lowEffort,
                mediumEffort,
                highEffort,
                insights,
                chartData: [
                    { name: 'Low Effort', value: lowEffort, fill: '#22c55e' },
                    { name: 'Medium Effort', value: mediumEffort, fill: '#eab308' },
                    { name: 'High Effort', value: highEffort, fill: '#ef4444' }
                ]
            })
        }
    }

    const handleClear = () => {
        setSatisfied(0); setNeutral(0); setDissatisfied(0);
        setPromoters(0); setPassives(0); setDetractors(0);
        setLowEffort(0); setMediumEffort(0); setHighEffort(0);
        setResult(null);
    }

    // Auto-calculate effect
    useEffect(() => {
        const timer = setTimeout(calculate, 300)
        return () => clearTimeout(timer)
    }, [metric, industry, satisfied, neutral, dissatisfied, promoters, passives, detractors, lowEffort, mediumEffort, highEffort])

    const MetricCard = ({ id, title, icon: Icon, desc, active }: any) => (
        <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setMetric(id)}
            className={`
                cursor-pointer relative overflow-hidden rounded-2xl p-4 border-2 transition-all duration-300
                ${active
                    ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10'
                    : 'border-border bg-card/50 hover:bg-card hover:border-primary/50'}
            `}
        >
            <div className={`p-3 rounded-xl w-fit mb-3 ${active ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
                <Icon className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg mb-1">{title}</h3>
            <p className="text-xs text-muted-foreground">{desc}</p>
            {active && (
                <motion.div
                    layoutId="active-ring"
                    className="absolute inset-0 border-2 border-primary rounded-2xl pointer-events-none"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
            )}
        </motion.div>
    )

    const CustomSlider = ({ label, value, onChange, color = "primary", max = 1000 }: any) => (
        <div className="space-y-3 bg-secondary/10 p-4 rounded-xl border border-border/50 hover:border-primary/20 transition-colors">
            <div className="flex justify-between items-center">
                <label className="text-sm font-medium">{label}</label>
                <div className="bg-background border px-3 py-1 rounded-lg font-mono text-sm font-bold w-20 text-right">
                    {value}
                </div>
            </div>
            <input
                type="range"
                min="0"
                max={max}
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                className={`w-full h-2 rounded-lg appearance-none cursor-pointer bg-secondary`}
                style={{
                    backgroundImage: `linear-gradient(to right, var(--${color}) 0%, var(--${color}) ${(value / max) * 100}%, transparent ${(value / max) * 100}%)`
                }}
            />
        </div>
    )

    return (
        <FinancialCalculatorTemplate
            title="Customer Satisfaction Analytics"
            description="Advanced CSAT, NPS & CES calculator with industry benchmarking and insights"
            icon={TrendingUp}
            calculate={calculate}
            onClear={handleClear}
            values={[metric, industry, satisfied, neutral, dissatisfied]}
            category="Business"
            calculatorId="customer-satisfaction"
            inputs={
                <div className="space-y-8">
                    {/* Metric Selection Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <MetricCard
                            id="CSAT"
                            title="CSAT"
                            icon={CheckCircle2}
                            desc="Measuring Satisfaction"
                            active={metric === 'CSAT'}
                        />
                        <MetricCard
                            id="NPS"
                            title="NPS"
                            icon={Activity}
                            desc="Measuring Loyalty"
                            active={metric === 'NPS'}
                        />
                        <MetricCard
                            id="CES"
                            title="CES"
                            icon={Target}
                            desc="Measuring Effort"
                            active={metric === 'CES'}
                        />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center gap-2">
                                <Trophy className="w-4 h-4 text-amber-500" />
                                Industry Benchmark
                            </label>
                            <select
                                value={industry}
                                onChange={(e) => setIndustry(e.target.value)}
                                className="w-full p-3 rounded-xl bg-background border-2 border-input focus:border-primary outline-none transition-all cursor-pointer hover:border-primary/50"
                            >
                                <option value="e-commerce">🛍️ E-commerce</option>
                                <option value="saas/software">💻 SaaS/Software</option>
                                <option value="retail">🏪 Retail</option>
                                <option value="healthcare">🏥 Healthcare</option>
                                <option value="banking">🏦 Banking</option>
                                <option value="services">🔧 Services</option>
                                <option value="logistics">🚚 Logistics</option>
                                <option value="hospitality">🏨 Hospitality</option>
                            </select>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-blue-500/10 text-blue-600 rounded-xl border border-blue-500/20 text-sm">
                            <HelpCircle className="w-5 h-5 flex-shrink-0" />
                            {metric === 'CSAT' && "Benchmarks are based on 2024 ACSI data."}
                            {metric === 'NPS' && "Based on Retently 2024 NPS benchmarks."}
                            {metric === 'CES' && "Lower score indicates better experience (1-7 scale)."}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Input Data</h4>
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={metric}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-4"
                            >
                                {metric === 'CSAT' && (
                                    <>
                                        <CustomSlider label="😊 Satisfied (4-5)" value={satisfied} onChange={setSatisfied} color="primary" />
                                        <CustomSlider label="😐 Neutral (3)" value={neutral} onChange={setNeutral} color="warning" />
                                        <CustomSlider label="😞 Dissatisfied (1-2)" value={dissatisfied} onChange={setDissatisfied} color="destructive" />
                                    </>
                                )}
                                {metric === 'NPS' && (
                                    <>
                                        <CustomSlider label="💚 Promoters (9-10)" value={promoters} onChange={setPromoters} color="primary" />
                                        <CustomSlider label="💛 Passives (7-8)" value={passives} onChange={setPassives} color="warning" />
                                        <CustomSlider label="❤️ Detractors (0-6)" value={detractors} onChange={setDetractors} color="destructive" />
                                    </>
                                )}
                                {metric === 'CES' && (
                                    <>
                                        <CustomSlider label="🟢 Low Effort (1-3)" value={lowEffort} onChange={setLowEffort} color="primary" />
                                        <CustomSlider label="🟡 Medium Effort (4-5)" value={mediumEffort} onChange={setMediumEffort} color="warning" />
                                        <CustomSlider label="🔴 High Effort (6-7)" value={highEffort} onChange={setHighEffort} color="destructive" />
                                    </>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            }
            result={
                result && !result.error && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-6"
                    >
                        {/* Main Score Radial Chart */}
                        <div className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-card to-secondary/30 rounded-3xl border border-border/50 shadow-xl relative overflow-hidden">
                            <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] pointer-events-none" />

                            <div className="w-64 h-64 relative">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadialBarChart
                                        cx="50%" cy="50%"
                                        innerRadius="60%" outerRadius="100%"
                                        barSize={20}
                                        data={[{ name: 'score', value: metric === 'NPS' ? (result.score + 100) / 2 : (metric === 'CES' ? (7 - result.score) / 7 * 100 : result.score), fill: result.color }]}
                                        startAngle={180} endAngle={0}
                                    >
                                        <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                                        <RadialBar background dataKey="value" cornerRadius={30} />
                                    </RadialBarChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex flex-col items-center justify-center -mt-10">
                                    <span className="text-5xl font-bold tracking-tighter" style={{ color: result.color }}>
                                        {metric === 'CES' ? result.score.toFixed(2) : metric === 'NPS' ? result.score.toFixed(0) : `${result.score.toFixed(1)}%`}
                                    </span>
                                    <span className="text-sm font-medium text-muted-foreground mt-1">{result.rating}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-8 w-full max-w-sm mt-[-40px] z-10">
                                <div className="text-center p-3 bg-background/50 backdrop-blur-sm rounded-xl border border-border/50">
                                    <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Industry Avg</div>
                                    <div className="font-bold text-lg">
                                        {metric === 'CES' ? result.benchmark.toFixed(1) : metric === 'NPS' ? result.benchmark : `${result.benchmark}%`}
                                    </div>
                                </div>
                                <div className="text-center p-3 bg-background/50 backdrop-blur-sm rounded-xl border border-border/50">
                                    <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Difference</div>
                                    <div className={`font-bold text-lg ${result.vsIndustry > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                        {result.vsIndustry > 0 ? '↑' : '↓'} {Math.abs(result.vsIndustry).toFixed(1)}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Breakdown Chart */}
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="p-4 bg-card rounded-2xl border border-border/50 shadow-sm flex flex-col justify-center items-center">
                                <h4 className="text-sm font-semibold mb-4 w-full text-left flex items-center gap-2">
                                    <BarChart3 className="w-4 h-4" /> Response Breakdown
                                </h4>
                                <div className="w-full h-48">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={result.chartData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={80}
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                {result.chartData.map((entry: any, index: number) => (
                                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                                ))}
                                            </Pie>
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="flex gap-4 justify-center mt-2 flex-wrap">
                                    {result.chartData.map((entry: any, i: number) => (
                                        <div key={i} className="flex items-center gap-1.5 text-xs">
                                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.fill }} />
                                            <span className="text-muted-foreground">{entry.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="p-4 bg-secondary/10 rounded-2xl border border-border/50 shadow-sm">
                                <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4 text-primary" />
                                    AI Insights
                                </h4>
                                <div className="space-y-3">
                                    {result.insights.map((insight: string, idx: number) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.1 }}
                                            className="flex gap-2 text-sm text-muted-foreground bg-background/50 p-2.5 rounded-lg border border-border/20"
                                        >
                                            <span className="text-primary mt-0.5">•</span>
                                            {insight}
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )
            }
        />
    )
}

