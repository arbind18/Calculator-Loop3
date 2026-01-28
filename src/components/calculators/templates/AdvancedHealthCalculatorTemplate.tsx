"use client"

import { ReactNode, useState, useEffect, useMemo } from "react"
import { 
  Activity, LucideIcon, Download, Printer, Share2, RotateCcw, 
  FileText, FileSpreadsheet, FileJson, FileCode, FileImage, 
  Database, FileArchive, Presentation, X, ChevronDown, TrendingUp,
  Heart, Scale, AlertCircle, CheckCircle, Info
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { toast } from "react-hot-toast"
import { VoiceNumberButton } from "@/components/ui/VoiceNumberButton"
import { CustomDownloadModal } from "@/components/CustomDownloadModal"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useSettings } from "@/components/providers/SettingsProvider"
import { getMergedTranslations } from "@/lib/translations"
import { localizeToolMeta } from "@/lib/toolLocalization"
import { generateReport } from "@/lib/downloadUtils"

export interface HealthMetric {
  label: string
  value: string | number
  unit?: string
  status?: 'normal' | 'warning' | 'danger' | 'good'
  description?: string
  icon?: LucideIcon
}

export interface HealthRecommendation {
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  category: string
}

export interface HealthResult {
  primaryMetric?: HealthMetric
  metrics?: HealthMetric[]
  recommendations?: HealthRecommendation[]
  chartData?: any[]
  detailedBreakdown?: Record<string, any>
  riskFactors?: string[]
  healthScore?: number
}

interface AdvancedHealthCalculatorTemplateProps {
  title: string
  description: string
  icon?: LucideIcon
  inputs: ReactNode
  result: HealthResult | null
  calculate: () => void
  calculateLabel?: string
  onClear?: () => void
  values?: any[]
  seoContent?: ReactNode
  categoryName?: string
  toolId?: string
}

export interface DownloadOptions {
  includeSummary: boolean
  includeMetrics: boolean
  includeRecommendations: boolean
  includeChart: boolean
  includeDetailedBreakdown: boolean
}

export function AdvancedHealthCalculatorTemplate({
  title,
  description,
  icon: Icon = Activity,
  inputs,
  result,
  calculate,
  calculateLabel = "Calculate",
  onClear,
  values = [],
  seoContent,
  categoryName = "Health",
  toolId = "health-calculator"
}: AdvancedHealthCalculatorTemplateProps) {
  const { language } = useSettings()
  const t = useMemo(() => getMergedTranslations(language), [language])

  const { title: displayTitle, description: displayDescription } = useMemo(
    () =>
      localizeToolMeta({
        dict: t,
        toolId,
        fallbackTitle: title,
        fallbackDescription: description,
      }),
    [t, toolId, title, description]
  )
  
  const [isAutoCalculate, setIsAutoCalculate] = useState(false)
  const [showDownloadModal, setShowDownloadModal] = useState(false)
  const [downloadFormat, setDownloadFormat] = useState<string>('pdf')
  const [pendingFormat, setPendingFormat] = useState<string | null>(null)
  const [downloadOptions, setDownloadOptions] = useState<DownloadOptions>({
    includeSummary: true,
    includeMetrics: true,
    includeRecommendations: true,
    includeChart: true,
    includeDetailedBreakdown: true
  })

  useEffect(() => {
    if (isAutoCalculate && values.length > 0) {
      calculate()
    }
  }, [isAutoCalculate, JSON.stringify(values)])

  const handleDownload = async (format: string) => {
    if (!result) {
      toast.error("Please calculate first before downloading")
      return
    }

    try {
      const headers = ["Metric", "Value", "Status"]
      const data: (string | number)[][] = []

      // Add primary metric if available
      if (downloadOptions.includeSummary && result.primaryMetric) {
        data.push([
          result.primaryMetric.label,
          `${result.primaryMetric.value}${result.primaryMetric.unit ? ' ' + result.primaryMetric.unit : ''}`,
          result.primaryMetric.status || 'N/A'
        ])
      }

      // Add all metrics if available
      if (downloadOptions.includeMetrics && result.metrics) {
        result.metrics.forEach(metric => {
          data.push([
            metric.label,
            `${metric.value}${metric.unit ? ' ' + metric.unit : ''}`,
            metric.status || 'N/A'
          ])
        })
      }

      // Add detailed breakdown if available
      if (downloadOptions.includeDetailedBreakdown && result.detailedBreakdown) {
        Object.entries(result.detailedBreakdown).forEach(([key, value]) => {
          data.push([key, String(value), 'Info'])
        })
      }

      // Add recommendations if available
      if (downloadOptions.includeRecommendations && result.recommendations) {
        data.push(['--- Recommendations ---', '', ''])
        result.recommendations.forEach((rec, idx) => {
          data.push([
            `${idx + 1}. ${rec.title}`,
            rec.description,
            rec.priority.toUpperCase()
          ])
        })
      }

      // Add risk factors if available
      if (result.riskFactors && result.riskFactors.length > 0) {
        data.push(['--- Risk Factors ---', '', ''])
        result.riskFactors.forEach((risk, idx) => {
          data.push([`${idx + 1}`, risk, 'Warning'])
        })
      }

      // Add health score if available
      if (result.healthScore !== undefined) {
        data.push(['Overall Health Score', `${result.healthScore}/100`, 'Score'])
      }

      const metadata: Record<string, any> = {
        'Report Title': title,
        'Category': categoryName,
        'Generated On': new Date().toLocaleString(),
        'Calculator': toolId
      }

      if (result.primaryMetric) {
        metadata['Primary Result'] = `${result.primaryMetric.label}: ${result.primaryMetric.value}${result.primaryMetric.unit ? ' ' + result.primaryMetric.unit : ''}`
      }

      await generateReport(
        format,
        `${toolId}_health_report`,
        headers,
        data,
        title,
        metadata
      )
      
      setShowDownloadModal(false)
      setPendingFormat(null)
    } catch (error) {
      console.error('Download error:', error)
      toast.error('Failed to generate report')
    }
  }

  const initiateDownload = (format: string) => {
    setDownloadFormat(format)
    setPendingFormat(format)
    setShowDownloadModal(true)
  }

  const confirmDownload = () => {
    if (pendingFormat) {
      handleDownload(pendingFormat)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: description,
          url: window.location.href,
        })
      } catch (err) {
        console.error("Error sharing:", err)
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success("Link copied to clipboard!")
    }
  }

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'good':
      case 'normal':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case 'danger':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <Info className="h-4 w-4 text-blue-500" />
    }
  }

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'good':
      case 'normal':
        return 'bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800'
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 dark:bg-yellow-950/20 dark:border-yellow-800'
      case 'danger':
        return 'bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800'
      default:
        return 'bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400'
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-400'
      case 'low':
        return 'bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400'
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-950/30 dark:text-gray-400'
    }
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": displayTitle,
    "applicationCategory": "HealthApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": displayDescription ?? description,
    "featureList": "Health metrics calculation, Multiple export formats, Health recommendations, Risk assessment",
    "browserRequirements": "Requires JavaScript"
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-secondary/20 to-background py-6 md:py-12 px-4 print:py-0 print:bg-none">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div id="calculator-content" className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-6 md:mb-10 animate-fadeIn print:hidden">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4 md:mb-6 shadow-sm">
            <Icon className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">{categoryName} Calculator</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            {displayTitle}
          </h1>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto px-4">
            {displayDescription ?? description}
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-6 md:gap-8 mb-8">
          {/* Input Section */}
          <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Scale className="h-5 w-5 text-primary" />
                Input Parameters
              </h2>
              {onClear && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClear}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
              )}
            </div>
            
            {inputs}

            <div className="mt-6 pt-6 border-t border-border">
              <div className="flex items-center justify-between mb-4">
                <Label htmlFor="auto-calculate" className="text-sm cursor-pointer">
                  Auto-calculate on change
                </Label>
                <Switch
                  id="auto-calculate"
                  checked={isAutoCalculate}
                  onCheckedChange={setIsAutoCalculate}
                />
              </div>
              <Button
                onClick={calculate}
                className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white shadow-md hover:shadow-lg transition-all duration-300"
                size="lg"
              >
                <Activity className="h-5 w-5 mr-2" />
                {calculateLabel}
              </Button>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {result ? (
              <>
                {/* Primary Metric */}
                {result.primaryMetric && (
                  <div className={cn(
                    "bg-card border-2 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300",
                    getStatusColor(result.primaryMetric.status)
                  )}>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">
                          {result.primaryMetric.label}
                        </p>
                        <div className="flex items-baseline gap-2">
                          <span className="text-4xl font-bold">
                            {result.primaryMetric.value}
                          </span>
                          {result.primaryMetric.unit && (
                            <span className="text-xl text-muted-foreground">
                              {result.primaryMetric.unit}
                            </span>
                          )}
                        </div>
                      </div>
                      {getStatusIcon(result.primaryMetric.status)}
                    </div>
                    {result.primaryMetric.description && (
                      <p className="text-sm text-muted-foreground mt-2">
                        {result.primaryMetric.description}
                      </p>
                    )}
                  </div>
                )}

                {/* Health Score */}
                {result.healthScore !== undefined && (
                  <div className="bg-card border border-border rounded-2xl p-6 shadow-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold flex items-center gap-2">
                        <Heart className="h-5 w-5 text-primary" />
                        Overall Health Score
                      </h3>
                      <span className="text-2xl font-bold text-primary">
                        {result.healthScore}/100
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 dark:bg-gray-700">
                      <div
                        className="bg-gradient-to-r from-primary to-primary/70 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${result.healthScore}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Additional Metrics */}
                {result.metrics && result.metrics.length > 0 && (
                  <div className="bg-card border border-border rounded-2xl p-6 shadow-lg">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      Detailed Metrics
                    </h3>
                    <div className="space-y-3">
                      {result.metrics.map((metric, idx) => (
                        <div
                          key={idx}
                          className={cn(
                            "flex items-center justify-between p-3 rounded-lg border",
                            getStatusColor(metric.status)
                          )}
                        >
                          <div className="flex items-center gap-2">
                            {metric.icon && <metric.icon className="h-4 w-4" />}
                            <span className="text-sm font-medium">{metric.label}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold">
                              {metric.value}
                              {metric.unit && ` ${metric.unit}`}
                            </span>
                            {getStatusIcon(metric.status)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="bg-card border border-border rounded-2xl p-4 shadow-lg">
                  <div className="grid grid-cols-2 gap-3">
                    {/* Download Dropdown */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                          <ChevronDown className="h-4 w-4 ml-auto" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-56">
                        <DropdownMenuLabel>Export Options</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => initiateDownload('pdf')}>
                          <FileText className="h-4 w-4 mr-2" />
                          PDF Report
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => initiateDownload('excel')}>
                          <FileSpreadsheet className="h-4 w-4 mr-2" />
                          Excel Spreadsheet
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => initiateDownload('csv')}>
                          <FileCode className="h-4 w-4 mr-2" />
                          CSV Data
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => initiateDownload('json')}>
                          <FileJson className="h-4 w-4 mr-2" />
                          JSON Format
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => initiateDownload('xml')}>
                          <Database className="h-4 w-4 mr-2" />
                          XML Format
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => initiateDownload('png')}>
                          <FileImage className="h-4 w-4 mr-2" />
                          PNG Image
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => initiateDownload('pptx')}>
                          <Presentation className="h-4 w-4 mr-2" />
                          PowerPoint
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => initiateDownload('zip')}>
                          <FileArchive className="h-4 w-4 mr-2" />
                          ZIP Archive (All Formats)
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <Button variant="outline" onClick={handlePrint}>
                      <Printer className="h-4 w-4 mr-2" />
                      Print
                    </Button>

                    <Button variant="outline" onClick={handleShare} className="col-span-2">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share Results
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-card border border-dashed border-border rounded-2xl p-12 text-center">
                <Activity className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground">
                  Enter your parameters and click calculate to see results
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Recommendations Section */}
        {result?.recommendations && result.recommendations.length > 0 && (
          <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-lg mb-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Heart className="h-6 w-6 text-primary" />
              Health Recommendations
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {result.recommendations.map((rec, idx) => (
                <div
                  key={idx}
                  className="border border-border rounded-xl p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-sm">{rec.title}</h3>
                    <span className={cn(
                      "text-xs px-2 py-1 rounded-full font-medium",
                      getPriorityColor(rec.priority)
                    )}>
                      {rec.priority}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{rec.description}</p>
                  <span className="text-xs text-muted-foreground italic">{rec.category}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Risk Factors */}
        {result?.riskFactors && result.riskFactors.length > 0 && (
          <div className="bg-red-50 dark:bg-red-950/20 border-2 border-red-200 dark:border-red-800 rounded-2xl p-6 md:p-8 shadow-lg mb-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-red-700 dark:text-red-400">
              <AlertCircle className="h-6 w-6" />
              Risk Factors to Consider
            </h2>
            <ul className="space-y-2">
              {result.riskFactors.map((risk, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm">
                  <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <span>{risk}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* SEO Content */}
        {seoContent && (
          <div className="mt-12 prose dark:prose-invert max-w-none">
            {seoContent}
          </div>
        )}
      </div>

      {/* Enhanced Download Modal */}
      <CustomDownloadModal
        open={showDownloadModal}
        onClose={() => setShowDownloadModal(false)}
        data={{
          ...result,
          title: displayTitle,
          description: displayDescription,
          category: categoryName,
          timestamp: new Date().toISOString(),
        }}
        title={displayTitle}
        format={downloadFormat}
      />

      {/* Legacy Download Options Modal - Hidden */}
      {false && showDownloadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Download Options</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDownloadModal(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between">
                <Label htmlFor="include-summary" className="text-sm cursor-pointer">
                  Include Summary
                </Label>
                <Switch
                  id="include-summary"
                  checked={downloadOptions.includeSummary}
                  onCheckedChange={(checked) =>
                    setDownloadOptions({ ...downloadOptions, includeSummary: checked })
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="include-metrics" className="text-sm cursor-pointer">
                  Include All Metrics
                </Label>
                <Switch
                  id="include-metrics"
                  checked={downloadOptions.includeMetrics}
                  onCheckedChange={(checked) =>
                    setDownloadOptions({ ...downloadOptions, includeMetrics: checked })
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="include-recommendations" className="text-sm cursor-pointer">
                  Include Recommendations
                </Label>
                <Switch
                  id="include-recommendations"
                  checked={downloadOptions.includeRecommendations}
                  onCheckedChange={(checked) =>
                    setDownloadOptions({ ...downloadOptions, includeRecommendations: checked })
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="include-breakdown" className="text-sm cursor-pointer">
                  Include Detailed Breakdown
                </Label>
                <Switch
                  id="include-breakdown"
                  checked={downloadOptions.includeDetailedBreakdown}
                  onCheckedChange={(checked) =>
                    setDownloadOptions({ ...downloadOptions, includeDetailedBreakdown: checked })
                  }
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowDownloadModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={confirmDownload}
                className="flex-1 bg-primary text-white"
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Reusable Components
export function InputGroup({
  label,
  value,
  onChangeAction,
  min = 0,
  max = 1000,
  step = 1,
  suffix,
  prefix,
  description
}: {
  label: string
  value: number
  onChangeAction: (value: number) => void
  min?: number
  max?: number
  step?: number
  suffix?: string
  prefix?: string
  description?: string
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">{label}</label>
        <div className="text-sm font-semibold text-primary">
          {prefix}
          {value}
          {suffix}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChangeAction(Number(e.target.value))}
          className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
        />

        <div className="flex items-center gap-1 min-w-[100px]">
          <div className="relative w-full">
            <input
              type="number"
              min={min}
              max={max}
              step={step}
              value={value}
              onChange={(e) => onChangeAction(Number(e.target.value))}
              className="w-full px-3 py-2 pr-10 text-sm border border-border rounded-lg bg-background"
            />
            <VoiceNumberButton
              label={label}
              onValueAction={onChangeAction}
              min={min}
              max={max}
              className="absolute right-1 top-1/2 -translate-y-1/2"
            />
          </div>
          {suffix && <span className="text-sm text-muted-foreground whitespace-nowrap">{suffix}</span>}
        </div>
      </div>

      {description && <p className="text-xs text-muted-foreground">{description}</p>}
    </div>
  )
}

export function ResultCard({
  label,
  value,
  icon: Icon,
  trend,
  description
}: {
  label: string
  value: string | number
  icon?: LucideIcon
  trend?: 'up' | 'down' | 'neutral'
  description?: string
}) {
  return (
    <div className="bg-card border border-border rounded-xl p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-muted-foreground">{label}</span>
        {Icon && <Icon className="h-4 w-4 text-primary" />}
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold">{value}</span>
        {trend && (
          <span className={cn(
            "text-sm",
            trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-gray-500'
          )}>
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}
          </span>
        )}
      </div>
      {description && (
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      )}
    </div>
  )
}
