"use client"

import { ReactNode, useState, useEffect } from "react"
import { 
  Activity, LucideIcon, Download, Printer, Share2, RotateCcw, 
  FileText, FileSpreadsheet, FileJson, FileCode, FileImage, 
  Database, FileArchive, Presentation, X, ChevronDown, TrendingUp,
  Heart, Scale, AlertCircle, CheckCircle, Info, Copy, Mail
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { toast } from "react-hot-toast"
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
import { generateReport } from "@/lib/downloadUtils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

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

interface ComprehensiveHealthTemplateProps {
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

export function ComprehensiveHealthTemplate({
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
}: ComprehensiveHealthTemplateProps) {
  const { language } = useSettings()
  const t = getMergedTranslations(language)
  
  const [isAutoCalculate, setIsAutoCalculate] = useState(false)
  const [showDownloadModal, setShowDownloadModal] = useState(false)
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
    "name": title,
    "applicationCategory": "HealthApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": description,
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
            {title}
          </h1>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto px-4">
            {description}
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-12 gap-6 md:gap-8 mb-8">
          {/* Input Section - 4 Columns */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="border-border shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scale className="h-5 w-5 text-primary" />
                  Input Parameters
                </CardTitle>
                <CardDescription>Enter your details below</CardDescription>
              </CardHeader>
              <CardContent>
                {inputs}

                <div className="mt-6 pt-6 border-t border-border">
                  <div className="flex items-center justify-between mb-4">
                    <Label htmlFor="auto-calculate" className="text-sm cursor-pointer">
                      Auto-calculate
                    </Label>
                    <Switch
                      id="auto-calculate"
                      checked={isAutoCalculate}
                      onCheckedChange={setIsAutoCalculate}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={calculate}
                      className="flex-1 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white shadow-md hover:shadow-lg transition-all duration-300"
                      size="lg"
                    >
                      <Activity className="h-5 w-5 mr-2" />
                      {calculateLabel}
                    </Button>
                    {onClear && (
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={onClear}
                        className="px-3"
                        title="Reset"
                      >
                        <RotateCcw className="h-5 w-5" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions for Mobile */}
            <div className="lg:hidden grid grid-cols-2 gap-2">
               <Button variant="outline" onClick={() => initiateDownload('pdf')} className="w-full">
                  <FileText className="h-4 w-4 mr-2" /> PDF
               </Button>
               <Button variant="outline" onClick={handleShare} className="w-full">
                  <Share2 className="h-4 w-4 mr-2" /> Share
               </Button>
            </div>
          </div>

          {/* Results Section - 8 Columns */}
          <div className="lg:col-span-8 space-y-6">
            {result ? (
              <>
                {/* Primary Result Card */}
                <div className="grid md:grid-cols-2 gap-4">
                  {result.primaryMetric && (
                    <Card className={cn(
                      "border-2 shadow-lg hover:shadow-xl transition-all duration-300",
                      getStatusColor(result.primaryMetric.status)
                    )}>
                      <CardContent className="p-6">
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
                      </CardContent>
                    </Card>
                  )}

                  {/* Health Score Card */}
                  {result.healthScore !== undefined && (
                    <Card className="border-border shadow-lg">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-semibold flex items-center gap-2">
                            <Heart className="h-5 w-5 text-primary" />
                            Health Score
                          </h3>
                          <span className="text-2xl font-bold text-primary">
                            {result.healthScore}/100
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3 dark:bg-gray-700 mb-2">
                          <div
                            className="bg-gradient-to-r from-primary to-primary/70 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${result.healthScore}%` }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Based on your inputs and standard health guidelines.
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Detailed Sections (no Tabs dependency) */}
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-primary" />
                        Detailed Metrics
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid sm:grid-cols-2 gap-4">
                      {result.metrics?.map((metric, idx) => (
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
                      {(!result.metrics || result.metrics.length === 0) && (
                        <p className="text-muted-foreground">No metrics available.</p>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-primary" />
                        Personalized Recommendations
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {result.recommendations?.map((rec, idx) => (
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
                      {(!result.recommendations || result.recommendations.length === 0) && (
                        <p className="text-muted-foreground text-center py-4">No specific recommendations available.</p>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="border-red-100 dark:border-red-900/20">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2 text-red-600 dark:text-red-400">
                        <AlertCircle className="h-5 w-5" />
                        Risk Assessment
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {result.riskFactors?.map((risk, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                            <span>{risk}</span>
                          </li>
                        ))}
                        {(!result.riskFactors || result.riskFactors.length === 0) && (
                          <li className="flex items-center gap-2 text-green-600 dark:text-green-400">
                            <CheckCircle className="h-4 w-4" />
                            <span>No significant risk factors identified based on provided data.</span>
                          </li>
                        )}
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                {/* Multiple Download Buttons Section */}
                <Card className="bg-muted/30 border-border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Download className="h-5 w-5 text-primary" />
                      Download & Share Results
                    </CardTitle>
                    <CardDescription>Save your health report in your preferred format</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-3">
                      <Button 
                        variant="outline" 
                        className="flex-1 min-w-[120px] bg-background hover:bg-primary/5 hover:text-primary border-primary/20"
                        onClick={() => initiateDownload('pdf')}
                      >
                        <FileText className="h-4 w-4 mr-2 text-red-500" />
                        PDF Report
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="flex-1 min-w-[120px] bg-background hover:bg-primary/5 hover:text-primary border-primary/20"
                        onClick={() => initiateDownload('excel')}
                      >
                        <FileSpreadsheet className="h-4 w-4 mr-2 text-green-600" />
                        Excel
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="flex-1 min-w-[120px] bg-background hover:bg-primary/5 hover:text-primary border-primary/20"
                        onClick={() => initiateDownload('png')}
                      >
                        <FileImage className="h-4 w-4 mr-2 text-purple-500" />
                        Image
                      </Button>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" className="flex-1 min-w-[120px] bg-background">
                            More Formats
                            <ChevronDown className="h-4 w-4 ml-2" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => initiateDownload('csv')}>
                            <FileCode className="h-4 w-4 mr-2" /> CSV
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => initiateDownload('json')}>
                            <FileJson className="h-4 w-4 mr-2" /> JSON
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => initiateDownload('xml')}>
                            <Database className="h-4 w-4 mr-2" /> XML
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => initiateDownload('pptx')}>
                            <Presentation className="h-4 w-4 mr-2" /> PowerPoint
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => initiateDownload('zip')}>
                            <FileArchive className="h-4 w-4 mr-2" /> ZIP Archive
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    
                    <div className="flex gap-3 mt-4 pt-4 border-t border-border/50">
                      <Button variant="ghost" size="sm" onClick={handlePrint} className="flex-1">
                        <Printer className="h-4 w-4 mr-2" /> Print
                      </Button>
                      <Button variant="ghost" size="sm" onClick={handleShare} className="flex-1">
                        <Share2 className="h-4 w-4 mr-2" /> Share
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => {
                        navigator.clipboard.writeText(window.location.href)
                        toast.success("Link copied!")
                      }} className="flex-1">
                        <Copy className="h-4 w-4 mr-2" /> Copy Link
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center bg-card border border-dashed border-border rounded-2xl p-12 text-center min-h-[400px]">
                <div className="bg-primary/10 p-4 rounded-full mb-4">
                  <Activity className="h-12 w-12 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Ready to Calculate</h3>
                <p className="text-muted-foreground max-w-md mx-auto mb-6">
                  Enter your parameters in the input section and click calculate to see your detailed health analysis, recommendations, and download options.
                </p>
                <Button onClick={calculate} variant="outline">
                  Calculate Now
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* SEO Content */}
        {seoContent && (
          <div className="mt-12 prose dark:prose-invert max-w-none bg-card p-8 rounded-2xl border border-border shadow-sm">
            {seoContent}
          </div>
        )}
      </div>

      {/* Download Options Modal */}
      {showDownloadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-md w-full shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Download className="h-5 w-5 text-primary" />
                Download Options
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDownloadModal(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <Label htmlFor="include-summary" className="text-sm cursor-pointer font-medium">
                  Include Summary
                </Label>
                <Switch
                  id="include-summary"
                  checked={downloadOptions.includeSummary}
                  onCheckedChange={(checked) =>
                    setDownloadOptions(prev => ({ ...prev, includeSummary: checked }))
                  }
                />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <Label htmlFor="include-metrics" className="text-sm cursor-pointer font-medium">
                  Include Detailed Metrics
                </Label>
                <Switch
                  id="include-metrics"
                  checked={downloadOptions.includeMetrics}
                  onCheckedChange={(checked) =>
                    setDownloadOptions(prev => ({ ...prev, includeMetrics: checked }))
                  }
                />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <Label htmlFor="include-recs" className="text-sm cursor-pointer font-medium">
                  Include Recommendations
                </Label>
                <Switch
                  id="include-recs"
                  checked={downloadOptions.includeRecommendations}
                  onCheckedChange={(checked) =>
                    setDownloadOptions(prev => ({ ...prev, includeRecommendations: checked }))
                  }
                />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <Label htmlFor="include-risks" className="text-sm cursor-pointer font-medium">
                  Include Risk Analysis
                </Label>
                <Switch
                  id="include-risks"
                  checked={downloadOptions.includeDetailedBreakdown}
                  onCheckedChange={(checked) =>
                    setDownloadOptions(prev => ({ ...prev, includeDetailedBreakdown: checked }))
                  }
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowDownloadModal(false)}>
                Cancel
              </Button>
              <Button className="flex-1" onClick={confirmDownload}>
                Download {pendingFormat?.toUpperCase()}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
