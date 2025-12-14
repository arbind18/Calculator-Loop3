"use client"

import { ReactNode, useState, useEffect, useRef } from "react"
import { 
  Calculator, LucideIcon, Download, Printer, Share2, RotateCcw, 
  FileText, FileSpreadsheet, FileJson, FileCode, Copy, FileType, 
  Zap, ZapOff, PieChart, TrendingUp, Image, FileImage, Database, 
  Lock, FileArchive, Code, Link as LinkIcon, Presentation, FileKey, X, Settings 
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

interface FinancialCalculatorTemplateProps {
  title: string
  description: string
  icon?: LucideIcon
  inputs: ReactNode
  result: ReactNode
  charts?: ReactNode
  schedule?: ReactNode
  calculate: () => void
  calculateLabel?: string
  onClear?: () => void
  onDownload?: (format: string) => void
  values?: any[]
  seoContent?: ReactNode
}

export interface DownloadOptions {
  includeSummary: boolean;
  includeChart: boolean;
  includeSchedule: boolean;
  scheduleRange: 'all' | '1yr' | '5yr';
}

export function FinancialCalculatorTemplate({
  title,
  description,
  icon: Icon = Calculator,
  inputs,
  result,
  charts,
  schedule,
  calculate,
  calculateLabel = "Calculate",
  onClear,
  onDownload,
  values = [],
  seoContent
}: FinancialCalculatorTemplateProps & { onDownload?: (format: string, options?: DownloadOptions) => void }) {
  const [isAutoCalculate, setIsAutoCalculate] = useState(false)
  const [showDownloadModal, setShowDownloadModal] = useState(false)
  const [pendingFormat, setPendingFormat] = useState<string | null>(null)
  const [downloadOptions, setDownloadOptions] = useState<DownloadOptions>({
    includeSummary: true,
    includeChart: true,
    includeSchedule: true,
    scheduleRange: 'all'
  })

  const initiateDownload = (format: string) => {
    setPendingFormat(format)
    setShowDownloadModal(true)
  }

  const confirmDownload = () => {
    if (pendingFormat && onDownload) {
      onDownload(pendingFormat, downloadOptions)
      setShowDownloadModal(false)
      setPendingFormat(null)
    }
  }

  useEffect(() => {
    if (isAutoCalculate) {
      calculate()
    }
  }, [isAutoCalculate, JSON.stringify(values)])

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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": title,
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": description,
    "featureList": "Financial calculation, PDF export, Excel export, Visual charts",
    "browserRequirements": "Requires JavaScript"
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-secondary/20 to-background py-6 md:py-12 px-4 print:py-0 print:bg-none">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <div className="text-center mb-6 md:mb-10 animate-fadeIn print:hidden">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4 md:mb-6 shadow-sm">
            <Icon className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Financial Calculator</span>
          </div>
          <h1 className="text-3xl md:text-6xl font-bold mb-4 md:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600 tracking-tight">
            {title}
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {description}
          </p>
        </div>

        {/* Print Header */}
        <div className="hidden print:block text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">{title}</h1>
          <p className="text-muted-foreground">{description}</p>
        </div>

        {/* Calculator Card */}
        <div id="calculator-content" className="bg-card border border-border/50 rounded-3xl p-6 md:p-10 shadow-2xl shadow-primary/5 backdrop-blur-sm print:shadow-none print:border-none print:p-0">
          
          {/* Action Toolbar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 p-2 rounded-2xl bg-secondary/10 border border-border/50 print:hidden">
            
            {/* Left Side: Auto Calculate Toggle */}
            <div className="flex items-center gap-3 px-4 py-2 rounded-xl w-full sm:w-auto justify-between sm:justify-start">
               <div className="flex items-center gap-2.5">
                  <div className={cn("p-2 rounded-lg transition-colors", isAutoCalculate ? "bg-yellow-500/10 text-yellow-600" : "bg-muted text-muted-foreground")}>
                    {isAutoCalculate ? <Zap className="h-4 w-4 fill-current" /> : <ZapOff className="h-4 w-4" />}
                  </div>
                  <Label htmlFor="auto-calculate" className="text-sm font-medium cursor-pointer select-none">
                    Auto Calculate
                  </Label>
               </div>
               <Switch 
                  id="auto-calculate" 
                  checked={isAutoCalculate}
                  onCheckedChange={setIsAutoCalculate}
                  className="data-[state=checked]:bg-yellow-500 ml-2"
                />
            </div>

            {/* Right Side: Actions */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end px-2">
              {onClear && (
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={onClear} 
                  className="h-10 w-10 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-colors"
                  title="Clear All"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              )}
              
              <div className="h-6 w-px bg-border mx-2 hidden sm:block" />

              <Button 
                variant="ghost" 
                size="icon"
                onClick={handleShare} 
                className="h-10 w-10 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-xl transition-colors"
                title="Share"
              >
                <Share2 className="h-4 w-4" />
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon"
                onClick={handlePrint} 
                className="h-10 w-10 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-xl transition-colors"
                title="Print"
              >
                <Printer className="h-4 w-4" />
              </Button>
              
              {onDownload && result && (
                <div className="flex items-center gap-2">
                  <Button 
                    variant="default" 
                    size="sm" 
                    onClick={() => initiateDownload('pdf')}
                    className="hidden md:flex gap-2 bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/20 rounded-xl px-4 h-10"
                  >
                    <FileType className="h-4 w-4" />
                    <span>PDF</span>
                  </Button>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="gap-2 border-primary/20 hover:bg-primary/5 hover:text-primary shadow-sm rounded-xl px-4 h-10"
                      >
                        <Download className="h-4 w-4" />
                        <span className="hidden sm:inline">Download</span>
                      </Button>
                    </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[500px] p-4 max-h-[80vh] overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-muted-foreground/50">
                    <DropdownMenuLabel className="px-2 py-1.5 text-lg font-bold border-b mb-3">Download Options</DropdownMenuLabel>
                    
                    <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                      {/* Left Column */}
                      <div className="space-y-4">
                        {/* Basic Section */}
                        <div className="space-y-1">
                          <div className="px-2 text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Basic & Standard</div>
                          <DropdownMenuItem onClick={() => initiateDownload('csv')} className="rounded-lg cursor-pointer">
                            <FileText className="mr-2 h-4 w-4 text-green-600" />
                            <span>CSV (Excel)</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => initiateDownload('excel')} className="rounded-lg cursor-pointer">
                            <FileSpreadsheet className="mr-2 h-4 w-4 text-green-600" />
                            <span>Excel (.xlsx)</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => initiateDownload('pdf')} className="rounded-lg cursor-pointer">
                            <FileType className="mr-2 h-4 w-4 text-red-500" />
                            <span>PDF Document</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => initiateDownload('json')} className="rounded-lg cursor-pointer">
                            <FileJson className="mr-2 h-4 w-4 text-yellow-500" />
                            <span>JSON Data</span>
                          </DropdownMenuItem>
                        </div>

                        {/* Images Section */}
                        <div className="space-y-1">
                          <div className="px-2 text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Images & Visuals</div>
                          <DropdownMenuItem onClick={() => initiateDownload('png')} className="rounded-lg cursor-pointer">
                            <Image className="mr-2 h-4 w-4 text-purple-500" />
                            <span>PNG Image</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => initiateDownload('jpg')} className="rounded-lg cursor-pointer">
                            <FileImage className="mr-2 h-4 w-4 text-orange-500" />
                            <span>JPG Image</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => initiateDownload('svg')} className="rounded-lg cursor-pointer">
                            <Code className="mr-2 h-4 w-4 text-pink-500" />
                            <span>SVG Vector</span>
                          </DropdownMenuItem>
                        </div>
                      </div>

                      {/* Right Column */}
                      <div className="space-y-4">
                        {/* Advanced Section */}
                        <div className="space-y-1">
                          <div className="px-2 text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Advanced Docs</div>
                          <DropdownMenuItem onClick={() => initiateDownload('html')} className="rounded-lg cursor-pointer">
                            <Code className="mr-2 h-4 w-4 text-orange-600" />
                            <span>HTML Report</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => initiateDownload('docx')} className="rounded-lg cursor-pointer">
                            <FileText className="mr-2 h-4 w-4 text-blue-700" />
                            <span>Word (DOCX)</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => initiateDownload('pptx')} className="rounded-lg cursor-pointer">
                            <Presentation className="mr-2 h-4 w-4 text-orange-700" />
                            <span>PowerPoint (PPTX)</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => initiateDownload('ods')} className="rounded-lg cursor-pointer">
                            <FileSpreadsheet className="mr-2 h-4 w-4 text-green-500" />
                            <span>OpenOffice (ODS)</span>
                          </DropdownMenuItem>
                        </div>

                        {/* Developer Section */}
                        <div className="space-y-1">
                          <div className="px-2 text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Developer & Data</div>
                          <DropdownMenuItem onClick={() => initiateDownload('xml')} className="rounded-lg cursor-pointer">
                            <FileCode className="mr-2 h-4 w-4 text-gray-500" />
                            <span>XML Data</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => initiateDownload('api')} className="rounded-lg cursor-pointer">
                            <LinkIcon className="mr-2 h-4 w-4 text-indigo-500" />
                            <span>API Link</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => initiateDownload('sql')} className="rounded-lg cursor-pointer">
                            <Database className="mr-2 h-4 w-4 text-blue-400" />
                            <span>SQL Insert</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => initiateDownload('sqlite')} className="rounded-lg cursor-pointer">
                            <Database className="mr-2 h-4 w-4 text-cyan-600" />
                            <span>SQLite DB</span>
                          </DropdownMenuItem>
                        </div>

                        {/* Security Section */}
                        <div className="space-y-1">
                          <div className="px-2 text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Archives & Security</div>
                          <DropdownMenuItem onClick={() => initiateDownload('zip')} className="rounded-lg cursor-pointer">
                            <FileArchive className="mr-2 h-4 w-4 text-yellow-600" />
                            <span>ZIP Archive</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => initiateDownload('pdf-encrypted')} className="rounded-lg cursor-pointer">
                            <Lock className="mr-2 h-4 w-4 text-red-600" />
                            <span>Encrypted PDF</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => initiateDownload('zip-encrypted')} className="rounded-lg cursor-pointer">
                            <FileKey className="mr-2 h-4 w-4 text-slate-600" />
                            <span>Password ZIP</span>
                          </DropdownMenuItem>
                        </div>
                      </div>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
                </div>
              )}
            </div>
          </div>

          <div className="grid gap-10 lg:grid-cols-12 items-start">
            <div className="lg:col-span-5 space-y-8">
              {/* Inputs Section */}
              <div className="space-y-6 bg-secondary/5 p-6 rounded-2xl border border-border/50">
                <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs">1</span>
                  Input Details
                </h3>
                {inputs}
              </div>

              {/* Calculate Button */}
              {!isAutoCalculate && (
                <Button 
                  onClick={calculate} 
                  size="lg"
                  className="w-full bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 text-white py-7 text-lg font-semibold shadow-xl shadow-primary/25 transition-all hover:scale-[1.02] rounded-xl"
                >
                  <Calculator className="h-5 w-5 mr-2" /> 
                  {calculateLabel}
                </Button>
              )}
            </div>

            {/* Results Section - Right Column on Desktop */}
            {result && (
              <div className="lg:col-span-7 space-y-8 animate-fadeInUp">
                <div className="h-px w-full bg-border/50 my-8 lg:hidden" />
                
                {/* Key Metrics */}
                <div className="bg-gradient-to-br from-secondary/30 to-background rounded-2xl p-6 border border-border/50 shadow-sm">
                  <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs">2</span>
                    Summary
                  </h3>
                  {result}
                </div>

                {/* Charts */}
                {charts && (
                  <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-sm overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-50" />
                    <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs">3</span>
                      Visual Breakdown
                    </h3>
                    <div className="bg-secondary/5 rounded-xl p-2 md:p-6 flex justify-center min-h-[300px]">
                      {charts}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Schedule Section - Full Width Bottom */}
          {result && schedule && (
            <div className="mt-16 animate-fadeInUp">
              <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent mb-12" />
              <h3 className="text-xl font-semibold mb-8 flex items-center gap-2">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm">4</span>
                Amortization Schedule
              </h3>
              <div className="rounded-2xl border border-border/50 overflow-hidden shadow-lg bg-card">
                {schedule}
              </div>
            </div>
          )}

          {/* SEO Content Section */}
          <div className="mt-20 max-w-4xl mx-auto space-y-16">
            {seoContent && (
              <div className="prose prose-slate dark:prose-invert prose-headings:font-bold prose-h2:text-2xl prose-h3:text-xl prose-p:text-muted-foreground prose-li:text-muted-foreground">
                {seoContent}
              </div>
            )}
            <GenericFinancialSeo title={title} />
          </div>
        </div>
      </div>

      {showDownloadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="bg-card border border-border shadow-2xl rounded-xl w-full max-w-md p-6 space-y-6 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b pb-4">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold">Customize Download</h3>
                <p className="text-xs text-muted-foreground">Select what to include in your {pendingFormat?.toUpperCase()} file</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setShowDownloadModal(false)} className="h-8 w-8 rounded-full">
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-5">
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="summary" className="flex flex-col space-y-1 cursor-pointer">
                  <span className="font-medium">Include Summary</span>
                  <span className="font-normal text-xs text-muted-foreground">Key metrics and input values</span>
                </Label>
                <Switch 
                  id="summary" 
                  checked={downloadOptions.includeSummary}
                  onCheckedChange={(c) => setDownloadOptions(prev => ({ ...prev, includeSummary: c }))}
                />
              </div>
              
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="chart" className="flex flex-col space-y-1 cursor-pointer">
                  <span className="font-medium">Include Charts</span>
                  <span className="font-normal text-xs text-muted-foreground">Visual graphs and diagrams</span>
                </Label>
                <Switch 
                  id="chart" 
                  checked={downloadOptions.includeChart}
                  onCheckedChange={(c) => setDownloadOptions(prev => ({ ...prev, includeChart: c }))}
                />
              </div>

              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="schedule" className="flex flex-col space-y-1 cursor-pointer">
                  <span className="font-medium">Include Data Table</span>
                  <span className="font-normal text-xs text-muted-foreground">Full amortization schedule</span>
                </Label>
                <Switch 
                  id="schedule" 
                  checked={downloadOptions.includeSchedule}
                  onCheckedChange={(c) => setDownloadOptions(prev => ({ ...prev, includeSchedule: c }))}
                />
              </div>

              {downloadOptions.includeSchedule && (
                 <div className="pt-4 border-t space-y-3">
                    <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Row Limit</Label>
                    <div className="grid grid-cols-3 gap-2">
                        {['all', '1yr', '5yr'].map((range) => (
                            <Button 
                                key={range}
                                variant={downloadOptions.scheduleRange === range ? "default" : "outline"}
                                size="sm"
                                onClick={() => setDownloadOptions(prev => ({ ...prev, scheduleRange: range as any }))}
                                className="text-xs h-8"
                            >
                                {range === 'all' ? 'All Rows' : range === '1yr' ? '1 Year' : '5 Years'}
                            </Button>
                        ))}
                    </div>
                 </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setShowDownloadModal(false)}>Cancel</Button>
              <Button onClick={confirmDownload} className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Download className="mr-2 h-4 w-4" />
                Download Now
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

interface InputGroupProps {
  label: string
  value: number
  onChange: (value: number) => void
  min: number
  max: number
  step?: number
  prefix?: string
  suffix?: string
  helpText?: string
}

export function InputGroup({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  prefix,
  suffix,
  helpText
}: InputGroupProps) {
  const [localValue, setLocalValue] = useState(value.toLocaleString('en-IN'))
  const isInternalChange = useRef(false)

  useEffect(() => {
    if (!isInternalChange.current && parseFloat(localValue.replace(/,/g, '')) !== value) {
      setLocalValue(value.toLocaleString('en-IN'))
    }
    isInternalChange.current = false
  }, [value])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/,/g, '')
    setLocalValue(e.target.value)
    isInternalChange.current = true

    if (rawValue === '' || rawValue === '.') return

    const numValue = parseFloat(rawValue)
    if (!isNaN(numValue)) {
      onChange(numValue)
    }
  }

  const handleBlur = () => {
    const rawValue = localValue.replace(/,/g, '')
    if (rawValue === '' || isNaN(parseFloat(rawValue))) {
      setLocalValue(value.toLocaleString('en-IN'))
    } else {
      setLocalValue(parseFloat(rawValue).toLocaleString('en-IN'))
    }
  }

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    const rawValue = localValue.replace(/,/g, '')
    setLocalValue(rawValue)
    e.target.select()
  }

  return (
    <div className="space-y-4 p-5 rounded-xl bg-background border border-border/50 hover:border-primary/30 hover:shadow-md transition-all group">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="w-1 h-4 bg-primary/30 rounded-full group-hover:bg-primary transition-colors"/>
          <label className="text-sm font-medium text-foreground/90">{label}</label>
        </div>
        <div className="flex items-center gap-2 bg-secondary/30 border border-transparent hover:border-primary/20 focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/10 rounded-xl px-4 py-3 transition-all w-full sm:w-auto">
          {prefix && <span className="text-muted-foreground font-medium select-none text-lg">{prefix}</span>}
          <input
            type="text"
            inputMode="decimal"
            value={localValue}
            onChange={handleInputChange}
            onBlur={handleBlur}
            onFocus={handleFocus}
            style={{ width: `${Math.max(localValue.length, 4)}ch` }}
            className="min-w-[60px] max-w-full text-right font-bold bg-transparent outline-none text-xl sm:text-2xl text-primary transition-all"
            placeholder="0"
          />
          {suffix && <span className="text-muted-foreground font-medium select-none text-lg">{suffix}</span>}
        </div>
      </div>
      
      <div className="space-y-3 pt-2">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary hover:accent-primary/90 transition-all"
        />
        <div className="flex justify-between text-xs text-muted-foreground font-medium px-1">
          <span>{prefix}{min.toLocaleString()}{suffix}</span>
          <span>{prefix}{max.toLocaleString()}{suffix}</span>
        </div>
      </div>
      
      {helpText && (
        <p className="text-xs text-muted-foreground mt-1 pl-1 border-l-2 border-primary/20">{helpText}</p>
      )}
    </div>
  )
}

interface ResultCardProps {
  label: string
  value: string | number
  subtext?: string
  type?: "default" | "highlight" | "success" | "warning"
}

export function ResultCard({ label, value, subtext, type = "default" }: ResultCardProps) {
  const styles = {
    default: "bg-card border-border/50 text-foreground hover:border-primary/20",
    highlight: "bg-primary/5 border-primary/20 text-primary hover:bg-primary/10",
    success: "bg-green-500/5 border-green-500/20 text-green-700 dark:text-green-400 hover:bg-green-500/10",
    warning: "bg-orange-500/5 border-orange-500/20 text-orange-700 dark:text-orange-400 hover:bg-orange-500/10"
  }

  const valueStr = value.toString()
  const isLong = valueStr.length > 12
  const isVeryLong = valueStr.length > 20

  return (
    <div className={cn("p-6 rounded-2xl border flex flex-col items-center justify-center text-center space-y-3 transition-all hover:shadow-lg hover:-translate-y-1 duration-300 overflow-hidden", styles[type])}>
      <p className="text-sm font-medium opacity-70 uppercase tracking-wider">{label}</p>
      <p className={cn(
        "font-bold tracking-tight break-words w-full px-2",
        isVeryLong ? "text-lg md:text-xl" : isLong ? "text-2xl md:text-3xl" : "text-3xl md:text-4xl"
      )}>
        {value}
      </p>
      {subtext && <p className="text-xs opacity-70 font-medium bg-background/50 px-2 py-1 rounded-full">{subtext}</p>}
    </div>
  )
}

function GenericFinancialSeo({ title }: { title: string }) {
  return (
    <article className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-bold prose-h2:text-2xl prose-h3:text-xl prose-p:text-muted-foreground prose-li:text-muted-foreground">
      <div className="p-8 bg-secondary/5 rounded-3xl border border-border/50 my-12">
        <h2 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
          Mastering Your Finances with the {title}
        </h2>
        <p className="lead text-lg">
          In today's rapidly evolving financial landscape, making informed decisions is more crucial than ever. 
          The <strong>{title}</strong> is designed to be your personal financial companion, bridging the gap between complex financial formulas and actionable insights. 
          Whether you are a seasoned investor, a business owner, or someone just starting their financial journey, understanding the mechanics behind your money is the first step towards financial freedom.
        </p>
      </div>

      <h3>Why Accuracy Matters in Financial Planning</h3>
      <p>
        Financial planning is not just about saving money; it's about predicting future outcomes based on current variables. 
        Small deviations in interest rates, tenure, or investment amounts can lead to significant differences over time due to the power of compounding. 
        Our {title} uses industry-standard algorithms to ensure that every calculation you perform is precise, reliable, and reflective of real-world scenarios.
      </p>
      <p>
        By using this tool, you eliminate the risk of human error associated with manual calculations. 
        This allows you to focus on what truly matters: analyzing the results and making strategic decisions for your future.
      </p>

      <h3>How to Use This Calculator Effectively</h3>
      <p>
        To get the most out of the {title}, consider the following tips:
      </p>
      <ul>
        <li><strong>Input Accurate Data:</strong> Ensure that the values you enter—such as interest rates, principal amounts, and time periods—are as accurate as possible. Even a 0.5% difference in interest rate can impact long-term results significantly.</li>
        <li><strong>Experiment with Scenarios:</strong> Don't just settle for one calculation. Use the tool to explore "what-if" scenarios. For example, see how increasing your monthly investment by just 10% affects your corpus over 20 years.</li>
        <li><strong>Review the Schedule:</strong> If available, check the amortization or investment schedule. It provides a granular view of how your money grows or how your liability decreases over time, offering insights that a simple summary cannot.</li>
        <li><strong>Download and Share:</strong> Use the download feature to save your calculations. Comparing different reports side-by-side can help you choose the best option among loans, investments, or tax regimes.</li>
      </ul>

      <h3>The Role of Technology in Personal Finance</h3>
      <p>
        Gone are the days of complex spreadsheets and manual ledgers. Modern financial tools like this {title} democratize access to sophisticated financial analysis. 
        They empower you to take control of your financial destiny without needing a degree in finance. 
        By providing instant visualization through charts and graphs, these tools make abstract numbers tangible, helping you understand the trajectory of your wealth.
      </p>

      <h3>Data Privacy and Security</h3>
      <p>
        We understand that financial data is sensitive. That's why our {title} operates with a <strong>privacy-first architecture</strong>. 
        All calculations are performed directly in your browser. 
        We do not store, transmit, or analyze your personal financial inputs on our servers. 
        You can use this tool with complete peace of mind, knowing that your data remains exclusively yours.
      </p>

      <h3>Understanding Key Financial Concepts</h3>
      <p>
        While this calculator handles the math, understanding the underlying concepts can enhance your decision-making:
      </p>
      <ul>
        <li><strong>Compounding:</strong> Often called the eighth wonder of the world, compounding is the process where the value of an investment increases because the earnings on an investment, both capital gains and interest, earn interest as time passes.</li>
        <li><strong>Inflation:</strong> Always consider the impact of inflation. A sum of money today will have less purchasing power in the future. Our tools often help you visualize real returns vs. nominal returns.</li>
        <li><strong>Risk vs. Reward:</strong> Higher returns often come with higher risk. Use our calculators to assess if the potential returns justify the risks involved in any financial product.</li>
      </ul>

      <div className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900/50 mt-8">
        <h4 className="text-blue-800 dark:text-blue-300 font-semibold mb-2">Disclaimer</h4>
        <p className="text-sm text-blue-700 dark:text-blue-400 m-0">
          The results provided by this {title} are intended for illustrative purposes only and should not be considered as financial advice. 
          Actual results may vary due to market fluctuations, changes in tax laws, and bank policies. 
          We recommend consulting with a qualified financial advisor before making any significant financial decisions.
        </p>
      </div>

      <div className="mt-12 border-t border-border/50 pt-10">
        <h3 className="text-2xl font-bold mb-6">Frequently Asked Questions (FAQ)</h3>
        <div className="space-y-6">
          <div className="space-y-2">
            <h4 className="text-lg font-semibold text-foreground">How accurate is this {title}?</h4>
            <p>
              Our {title} uses standard financial formulas used by banks and financial institutions. 
              However, slight variations may occur due to rounding off or specific bank policies (like 360 vs 365 days calculation). 
              It provides a highly accurate estimate for planning purposes.
            </p>
          </div>
          
          <div className="space-y-2">
            <h4 className="text-lg font-semibold text-foreground">Is my financial data safe?</h4>
            <p>
              Yes, absolutely. This calculator runs 100% on your browser (client-side). 
              We do not store, save, or transmit any of the data you enter. 
              Your financial privacy is fully protected.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-lg font-semibold text-foreground">Can I download the calculation results?</h4>
            <p>
              Yes, you can download the results in multiple formats including PDF, Excel, and CSV. 
              Simply click the "Download" button at the top of the calculator after performing a calculation.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-lg font-semibold text-foreground">Is this {title} free to use?</h4>
            <p>
              Yes, this tool is completely free to use. You can use it as many times as you want without any hidden charges or subscription fees.
            </p>
          </div>
        </div>
      </div>
    </article>
  )
}


