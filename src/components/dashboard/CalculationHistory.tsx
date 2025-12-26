"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Calendar, Download, Trash2, Eye, Filter, Search, ArrowRightLeft, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import Link from 'next/link'

interface CalculationRecord {
  id: string
  calculatorType: string
  calculatorName: string
  timestamp: Date
  inputs: Record<string, any>
  result: any
  category: string
}

export function CalculationHistory() {
  const { data: session } = useSession()
  const [history, setHistory] = useState<CalculationRecord[]>([])
  const [filteredHistory, setFilteredHistory] = useState<CalculationRecord[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [isLoading, setIsLoading] = useState(true)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [showCompare, setShowCompare] = useState(false)

  useEffect(() => {
    loadHistory()
  }, [session])

  useEffect(() => {
    filterHistory()
  }, [searchTerm, filterCategory, history])

  const loadHistory = async () => {
    setIsLoading(true)
    try {
      if (session?.user) {
        const res = await fetch('/api/user/history')
        const data = await res.json()
        if (data.calculations) {
          const mapped = data.calculations.map((item: any) => ({
            ...item,
            timestamp: new Date(item.createdAt)
          }))
          setHistory(mapped)
          setFilteredHistory(mapped)
        }
      } else {
        const stored = localStorage.getItem('calculationHistory')
        const data = stored ? JSON.parse(stored) : []
        setHistory(data)
        setFilteredHistory(data)
      }
    } catch (error) {
      console.error('Error loading history:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterHistory = () => {
    let filtered = [...history]

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(record =>
        record.calculatorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by category
    if (filterCategory !== 'all') {
      filtered = filtered.filter(record => record.category === filterCategory)
    }

    setFilteredHistory(filtered)
  }

  const deleteRecord = async (id: string) => {
    if (session?.user) {
      try {
        const res = await fetch(`/api/user/history?id=${id}`, { method: 'DELETE' })
        if (!res.ok) {
          throw new Error(`Failed to delete record (status ${res.status})`)
        }

        const updated = history.filter(record => record.id !== id)
        setHistory(updated)
        setSelectedIds(prev => prev.filter(selectedId => selectedId !== id))
      } catch (error) {
        console.error('Error deleting record:', error)
      }
    } else {
      const updated = history.filter(record => record.id !== id)
      setHistory(updated)
      setSelectedIds(prev => prev.filter(selectedId => selectedId !== id))
      localStorage.setItem('calculationHistory', JSON.stringify(updated))
      window.dispatchEvent(new Event('history-updated'))
    }
  }

  const clearAllHistory = async () => {
    if (!confirm('Are you sure you want to clear all history? This cannot be undone.')) {
      return
    }

    try {
      if (session?.user) {
        const res = await fetch('/api/user/history', { method: 'DELETE' })
        if (!res.ok) {
          throw new Error(`Failed to clear history (status ${res.status})`)
        }
      } else {
        localStorage.setItem('calculationHistory', JSON.stringify([]))
        window.dispatchEvent(new Event('history-updated'))
      }

      setHistory([])
      setFilteredHistory([])
      setSelectedIds([])
    } catch (error) {
      console.error('Error clearing history:', error)
    }
  }

  const exportHistory = () => {
    const dataStr = JSON.stringify(history, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `calculation-history-${new Date().toISOString().split('T')[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const toggleSelection = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) 
        ? prev.filter(i => i !== id)
        : [...prev, id]
    )
  }

  const getSelectedCalculations = () => {
    return history.filter(h => selectedIds.includes(h.id))
  }

  const categories = Array.from(new Set(history.map(r => r.category)))

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Calculation History</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {history.length} total calculations
          </p>
        </div>
        <div className="flex gap-2">
          {selectedIds.length >= 2 && (
            <Dialog open={showCompare} onOpenChange={setShowCompare}>
              <DialogTrigger asChild>
                <Button variant="default" size="sm" className="bg-purple-600 hover:bg-purple-700">
                  <ArrowRightLeft className="h-4 w-4 mr-2" />
                  Compare ({selectedIds.length})
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Compare Calculations</DialogTitle>
                  <DialogDescription>
                    Comparing {selectedIds.length} selected calculations side by side.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                  {getSelectedCalculations().map(calc => (
                    <Card key={calc.id} className="p-4 border-2 border-purple-100 dark:border-purple-900">
                      <h3 className="font-bold text-lg mb-2">{calc.calculatorName}</h3>
                      <Badge variant="secondary" className="mb-4">{calc.category}</Badge>
                      
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Inputs</h4>
                          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 space-y-2">
                            {Object.entries(calc.inputs).map(([key, value]) => (
                              <div key={key} className="flex justify-between text-sm">
                                <span className="text-gray-500">{key}:</span>
                                <span className="font-medium">{String(value)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Results</h4>
                          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 space-y-2">
                            {Object.entries(calc.result)
                              .filter(([key]) => typeof key === 'string' && !['schedule', 'chartData'].includes(key))
                              .map(([key, value]) => (
                                <div key={key} className="flex justify-between text-sm">
                                  <span className="text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                                  <span className="font-bold text-purple-700 dark:text-purple-300">
                                    {typeof value === 'number' 
                                      ? value.toLocaleString('en-IN', { maximumFractionDigits: 2 })
                                      : String(value)}
                                  </span>
                                </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          )}
          <Button variant="outline" size="sm" onClick={exportHistory}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm" onClick={clearAllHistory}>
            <Trash2 className="h-4 w-4 mr-2" />
            Clear All
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search calculations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        >
          <option value="all">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* History List */}
      {filteredHistory.length === 0 ? (
        <Card className="p-12 text-center">
          <Calendar className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold mb-2">No calculations found</h3>
          <p className="text-sm text-muted-foreground">
            {searchTerm || filterCategory !== 'all'
              ? 'Try adjusting your filters'
              : 'Start using calculators to build your history'}
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredHistory.map((record) => (
            <Card key={record.id} className={`p-4 hover:shadow-md transition-shadow ${selectedIds.includes(record.id) ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/10' : ''}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center h-full pt-1">
                  <div 
                    className={`h-5 w-5 rounded border cursor-pointer flex items-center justify-center transition-colors ${
                      selectedIds.includes(record.id) 
                        ? 'bg-purple-600 border-purple-600 text-white' 
                        : 'border-gray-300 hover:border-purple-400'
                    }`}
                    onClick={() => toggleSelection(record.id)}
                  >
                    {selectedIds.includes(record.id) && <Check className="h-3 w-3" />}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {record.calculatorName}
                    </h3>
                    <span className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 px-2 py-0.5 rounded-full">
                      {record.category}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3" />
                      {new Date(record.timestamp).toLocaleString('en-IN', {
                        dateStyle: 'medium',
                        timeStyle: 'short'
                      })}
                    </div>
                    {/* Display key inputs */}
                    <div className="flex flex-wrap gap-3 mt-2">
                      {Object.entries(record.inputs).slice(0, 3).map(([key, value]) => (
                        <div key={key} className="text-xs">
                          <span className="text-gray-500">{key}:</span>{' '}
                          <span className="font-medium">{String(value)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link href={{
                    pathname: `/calculator/${record.calculatorType === 'home-loan' ? 'home-loan-emi' : record.calculatorType}`,
                    query: record.inputs
                  }}>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteRecord(record.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
