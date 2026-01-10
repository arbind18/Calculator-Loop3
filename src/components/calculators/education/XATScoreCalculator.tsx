'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Info, Trophy, Target, Award } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from 'recharts'
import { ActionButtons } from './ActionButtons'
import { XATContent } from './XATContent'

interface SectionInput {
  attempted: string
  correct: string
  unattempted: string
}

interface SectionScore {
  score: number
  correct: number
  incorrect: number
  unattempted: number
  accuracy: number
  percentileEstimate: number
}

// Data for Percentile Prediction (Interpolation Points)
const percentileData = {
  total: [
    { score: 45, percentile: 99.9 },
    { score: 38, percentile: 99 },
    { score: 34, percentile: 97 },
    { score: 31, percentile: 95 },
    { score: 28, percentile: 92 },
    { score: 25.5, percentile: 90 },
    { score: 23, percentile: 85 },
    { score: 21, percentile: 80 },
    { score: 18, percentile: 75 },
    { score: 15, percentile: 70 },
    { score: 10, percentile: 50 },
    { score: 0, percentile: 0 }
  ]
}

// Function to estimate percentile
const estimatePercentile = (score: number, points: { score: number, percentile: number }[]) => {
  if (score >= points[0].score) return 99.99
  if (score <= points[points.length - 1].score) return points[points.length - 1].percentile

  for (let i = 0; i < points.length - 1; i++) {
    const upper = points[i]
    const lower = points[i + 1]
    if (score <= upper.score && score >= lower.score) {
      // Linear interpolation
      const range = upper.score - lower.score
      const scoreDiff = score - lower.score
      const percentileRange = upper.percentile - lower.percentile
      return lower.percentile + (scoreDiff / range) * percentileRange
    }
  }
  return 0
}

export default function XATScoreCalculator({ id, title, description }: { id: string; title: string; description: string }) {
  const [val, setVal] = useState<SectionInput>({ attempted: '', correct: '', unattempted: '' })
  const [dm, setDm] = useState<SectionInput>({ attempted: '', correct: '', unattempted: '' })
  const [qa, setQa] = useState<SectionInput>({ attempted: '', correct: '', unattempted: '' })
  const [gk, setGk] = useState<SectionInput>({ attempted: '', correct: '', unattempted: '' })

  const [result, setResult] = useState<{
    val: SectionScore
    dm: SectionScore
    qa: SectionScore
    gk: SectionScore
    totalScores: {
      raw: number
      penalty: number
      final: number
    }
    percentile: number
    analysis: {
      goodScore: boolean
      excellentScore: boolean
    }
  } | null>(null)

  const handleReset = () => {
    setVal({ attempted: '', correct: '', unattempted: '' })
    setDm({ attempted: '', correct: '', unattempted: '' })
    setQa({ attempted: '', correct: '', unattempted: '' })
    setGk({ attempted: '', correct: '', unattempted: '' })
    setResult(null)
  }

  const calculateScore = () => {
    const parse = (val: string) => parseInt(val) || 0

    const calcSection = (input: SectionInput) => {
      const att = parse(input.attempted)
      const corr = parse(input.correct)
      let unatt = parse(input.unattempted)

      // Validation: Correct cannot exceed Attempted
      const safeCorrect = Math.min(corr, att)
      const incorrect = Math.max(0, att - safeCorrect)

      const score = (safeCorrect * 1) - (incorrect * 0.25)
      const accuracy = att > 0 ? (safeCorrect / att) * 100 : 0

      return {
        score,
        correct: safeCorrect,
        incorrect,
        unattempted: unatt,
        accuracy,
        percentileEstimate: 0 // Placeholder for sectional percentile if needed
      }
    }

    const valRes = calcSection(val)
    const dmRes = calcSection(dm)
    const qaRes = calcSection(qa)
    const gkRes = calcSection(gk) // GK separate

    // Unattempted Penalty
    // Rule: -0.10 for each unattempted question BEYOND 8 questions in total (VAL+DM+QA)
    const totalUnattemptedMain = valRes.unattempted + dmRes.unattempted + qaRes.unattempted
    const penaltyCount = Math.max(0, totalUnattemptedMain - 8)
    const penalty = penaltyCount * 0.10

    const rawTotal = valRes.score + dmRes.score + qaRes.score
    const finalScore = rawTotal - penalty

    const predictedPercentile = estimatePercentile(finalScore, percentileData.total)

    setResult({
      val: valRes,
      dm: dmRes,
      qa: qaRes,
      gk: gkRes,
      totalScores: {
        raw: rawTotal,
        penalty: penalty,
        final: finalScore
      },
      percentile: predictedPercentile,
      analysis: {
        goodScore: predictedPercentile > 90,
        excellentScore: predictedPercentile > 99
      }
    })
  }

  const chartData = result ? [
    { name: 'VALR', score: result.val.score, max: 15, fill: '#8884d8' }, // Rough benchmarks for chart scaling
    { name: 'DM', score: result.dm.score, max: 15, fill: '#82ca9d' },
    { name: 'QA-DI', score: result.qa.score, max: 15, fill: '#ffc658' },
  ] : []

  return (
    <div className="space-y-8">

      <div className="flex justify-between items-center">
        <div className="md:hidden"></div> {/* Spacer for mobile alignment if needed */}
        <ActionButtons onReset={handleReset} />
      </div>

      <Card className="border-t-4 border-t-primary shadow-md">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="h-6 w-6 text-yellow-500" />
            <h2 className="text-2xl font-bold text-primary">Advanced XAT Score Predictor</h2>
          </div>
          <CardDescription>
            Accurate score calculation with negative marking (-0.25) and unattempted penalty (-0.10 after 8 skips).
            <br />
            Includes <strong>Percentile Prediction</strong> based on XAT 2025/2026 trends.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            {/* Header for Desktop */}
            <div className="hidden md:grid grid-cols-4 gap-4 pb-2 border-b text-sm font-semibold text-muted-foreground">
              <div>Section</div>
              <div>Attempted</div>
              <div>Correct</div>
              <div>Unattempted</div>
            </div>

            {/* Inputs */}
            {[
              { label: 'Verbal & Logical (VALR)', state: val, setter: setVal },
              { label: 'Decision Making (DM)', state: dm, setter: setDm },
              { label: 'Quant & DI (QA-DI)', state: qa, setter: setQa },
              { label: 'General Knowledge (GK)', state: gk, setter: setGk, isGk: true },
            ].map((section, idx) => (
              <div key={idx} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center p-4 bg-muted/20 rounded-lg md:p-0 md:bg-transparent">
                <div className="font-semibold text-sm md:text-base flex items-center gap-2">
                  <div className={`w-2 h-8 rounded-sm ${idx === 3 ? 'bg-gray-400' : 'bg-primary'}`}></div>
                  {section.label}
                </div>

                <div className="w-full">
                  <Label className="md:hidden text-xs mb-1.5 block">Attempted</Label>
                  <Input
                    type="number"
                    placeholder="Total Attempts"
                    value={section.state.attempted}
                    onChange={(e) => section.setter({ ...section.state, attempted: e.target.value })}
                    className="bg-background"
                  />
                </div>

                <div className="w-full">
                  <Label className="md:hidden text-xs mb-1.5 block">Correct</Label>
                  <Input
                    type="number"
                    placeholder="Correct Ans"
                    value={section.state.correct}
                    onChange={(e) => section.setter({ ...section.state, correct: e.target.value })}
                    className="bg-background"
                  />
                </div>

                <div className="w-full">
                  <Label className="md:hidden text-xs mb-1.5 block">Unattempted</Label>
                  <Input
                    type="number"
                    placeholder="Skipped"
                    value={section.state.unattempted}
                    onChange={(e) => section.setter({ ...section.state, unattempted: e.target.value })}
                    className="bg-background"
                  />
                </div>
              </div>
            ))}

            <Button onClick={calculateScore} size="lg" className="w-full mt-4 text-lg h-12 bg-gradient-to-r from-primary to-blue-700 hover:from-primary/90 hover:to-blue-700/90 shadow-lg">
              Calculate XAT Score & Percentile
            </Button>
          </div>
        </CardContent>
      </Card>

      {result && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
            {/* Main Score Card */}
            <Card className="col-span-1 md:col-span-2 lg:col-span-1 bg-gradient-to-br from-primary/10 to-blue-500/10 border-primary/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium text-muted-foreground flex items-center gap-2">
                  <Target className="w-5 h-5" /> Overall Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-5xl font-extrabold text-primary mb-1">
                  {result.totalScores.final.toFixed(2)}
                </div>
                <div className="text-sm font-medium text-muted-foreground mb-4">Total Score (excluding GK)</div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Raw Score:</span>
                    <span className="font-semibold">{result.totalScores.raw.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-red-500">
                    <span>Penalty (Unattempted):</span>
                    <span className="font-semibold">-{result.totalScores.penalty.toFixed(2)}</span>
                  </div>
                  <div className="pt-2 border-t mt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-base font-bold text-foreground">Predicted Percentile</span>
                      <span className="text-2xl font-bold text-blue-600">{result.percentile.toFixed(2)}%ile</span>
                    </div>
                    <Progress value={result.percentile} className="h-2 mt-2" />
                    <p className="text-xs text-muted-foreground mt-2 text-right">*Based on XAT 2025/26 trends</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Analysis Chart */}
            <Card className="col-span-1 md:col-span-2 bg-card">
              <CardHeader>
                <CardTitle className="text-lg">Sectional Breakdown</CardTitle>
                <CardDescription>Comparison of your scores across sections</CardDescription>
              </CardHeader>
              <CardContent className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" domain={[0, 'auto']} hide />
                    <YAxis dataKey="name" type="category" width={60} tick={{ fontSize: 12 }} />
                    <RechartsTooltip
                      cursor={{ fill: 'transparent' }}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    />
                    <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={30}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-primary" /> Detailed Report
              </h3>
              <div className="space-y-4">
                {[
                  { title: "Verbal & Logical", data: result.val, color: "text-blue-600" },
                  { title: "Decision Making", data: result.dm, color: "text-green-600" },
                  { title: "Quant & DI", data: result.qa, color: "text-amber-600" }
                ].map((item, idx) => (
                  <Card key={idx} className="overflow-hidden">
                    <div className={`h-1 w-full bg-gradient-to-r ${item.color === 'text-blue-600' ? 'from-blue-500 to-blue-300' : item.color === 'text-green-600' ? 'from-green-500 to-green-300' : 'from-amber-500 to-amber-300'}`}></div>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <div className="font-bold text-base">{item.title}</div>
                        <div className={`text-xl font-bold ${item.color}`}>{item.data.score.toFixed(2)}</div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center text-xs text-muted-foreground bg-muted/30 p-2 rounded-lg">
                        <div>
                          <div className="font-semibold text-foreground">{item.data.correct}</div>
                          Correct
                        </div>
                        <div>
                          <div className="font-semibold text-red-500">{item.data.incorrect}</div>
                          Incorrect
                        </div>
                        <div>
                          <div className="font-semibold text-foreground">{item.data.accuracy.toFixed(0)}%</div>
                          Accuracy
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {/* GK Separate */}
                <Card className="bg-gray-50 dark:bg-muted/10 border-dashed">
                  <CardContent className="p-4 flex justify-between items-center opacity-80">
                    <div>
                      <div className="font-semibold">General Knowledge</div>
                      <div className="text-xs text-muted-foreground">Not counted in Percentile</div>
                    </div>
                    <div className="text-lg font-bold text-gray-500">{result.gk.score.toFixed(2)}</div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="space-y-6">
              <Alert className={result.analysis.goodScore ? "bg-green-50 text-green-900 border-green-200 dark:bg-green-900/10 dark:text-green-100 dark:border-green-900/20" : "bg-blue-50 text-blue-900 border-blue-200 dark:bg-blue-900/10 dark:text-blue-100 dark:border-blue-900/20"}>
                <Info className="h-4 w-4" />
                <AlertTitle>{result.analysis.excellentScore ? "Excellent Performance!" : result.analysis.goodScore ? "Strong Performance" : "Keep Improving"}</AlertTitle>
                <AlertDescription>
                  {result.analysis.excellentScore
                    ? "Your score is in the top tier (99%ile+ range). This is a highly competitive score for top institutes like XLRI."
                    : result.analysis.goodScore
                      ? "You are likely in the 90-99%ile range. Good chance for calls from top programs."
                      : "Focus on improving accuracy and section balancing to boost your score."}
                </AlertDescription>
              </Alert>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Why Unattempted Penalty?</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-2">
                  <p>XAT charges a penalty of 0.10 marks for every unattempted question after the first 8 unattempted ones (accumulative across VALR, DM, QA).</p>
                  <div className="bg-muted p-3 rounded text-xs font-mono">
                    Penalty = MAX(0, (Total_Unattempted - 8)) * 0.10
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}

      <XATContent />
    </div>
  )
}
