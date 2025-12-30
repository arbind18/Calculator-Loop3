"use client"

import { useMemo, useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Bookmark, Download, Trash2, Eye, Tag, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { toast } from 'react-hot-toast'
import { useSettings } from '@/components/providers/SettingsProvider'
import { getMergedTranslations } from '@/lib/translations'
import { localizeToolMeta } from '@/lib/toolLocalization'

interface SavedCalculation {
  id: string
  calculatorType: string
  calculatorName: string
  savedAt: Date
  inputs: Record<string, any>
  result: any
  notes?: string
  tags?: string[]
}

export function SavedCalculations() {
  const { data: session } = useSession()
  const { language } = useSettings()
  const dict = useMemo(() => getMergedTranslations(language), [language])

  const prefix = language && language !== 'en' ? `/${language}` : ''
  const withLocale = (href: string) => {
    if (!href) return href
    if (!href.startsWith('/')) return href
    if (!prefix) return href

    const [path, hash] = href.split('#')
    const localizedPath = path === '/' ? prefix : `${prefix}${path}`
    return hash ? `${localizedPath}#${hash}` : localizedPath
  }

  const [savedCalcs, setSavedCalcs] = useState<SavedCalculation[]>([])
  const [filteredCalcs, setFilteredCalcs] = useState<SavedCalculation[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [editingNotes, setEditingNotes] = useState<string | null>(null)
  const [noteText, setNoteText] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadSavedCalculations()
  }, [session])

  useEffect(() => {
    filterCalculations()
  }, [searchTerm, savedCalcs])

  const loadSavedCalculations = async () => {
    setIsLoading(true)
    try {
      if (session?.user) {
        const response = await fetch('/api/user/saved')
        if (response.ok) {
          const data = await response.json()
          // Transform API data to match SavedCalculation interface if needed
          // Assuming API returns data in a compatible format or we map it
          const formattedData = (data.savedResults || []).map((item: any) => ({
            id: item.id,
            calculatorType: item.calculatorType,
            calculatorName: item.calculatorName,
            savedAt: item.savedAt,
            inputs: item.inputs,
            result: item.result,
            notes: item.notes,
            tags: item.tags
          }))
          setSavedCalcs(formattedData)
          setFilteredCalcs(formattedData)
        }
      } else {
        const stored = localStorage.getItem('savedCalculations')
        const data = stored ? JSON.parse(stored) : []
        setSavedCalcs(data)
        setFilteredCalcs(data)
      }
    } catch (error) {
      console.error('Error loading saved calculations:', error)
      toast.error('Failed to load saved calculations')
    } finally {
      setIsLoading(false)
    }
  }

  const filterCalculations = () => {
    if (!searchTerm) {
      setFilteredCalcs(savedCalcs)
      return
    }

    const filtered = savedCalcs.filter(calc =>
      calc.calculatorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      calc.notes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      calc.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    setFilteredCalcs(filtered)
  }

  const deleteCalculation = async (id: string) => {
    if (confirm('Delete this saved calculation?')) {
      try {
        if (session?.user) {
          const response = await fetch(`/api/user/saved?id=${id}`, {
            method: 'DELETE',
          })
          
          if (!response.ok) throw new Error('Failed to delete')
          
          const updated = savedCalcs.filter(calc => calc.id !== id)
          setSavedCalcs(updated)
          toast.success('Calculation deleted')
        } else {
          const updated = savedCalcs.filter(calc => calc.id !== id)
          setSavedCalcs(updated)
          localStorage.setItem('savedCalculations', JSON.stringify(updated))
          toast.success('Calculation deleted')
        }
      } catch (error) {
        console.error('Error deleting calculation:', error)
        toast.error('Failed to delete calculation')
      }
    }
  }

  const saveNotes = async (id: string) => {
    try {
      if (session?.user) {
        const response = await fetch('/api/user/saved', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, notes: noteText })
        })

        if (!response.ok) throw new Error('Failed to update notes')

        const updated = savedCalcs.map(calc =>
          calc.id === id ? { ...calc, notes: noteText } : calc
        )
        setSavedCalcs(updated)
        setEditingNotes(null)
        setNoteText('')
        toast.success('Notes saved')
      } else {
        const updated = savedCalcs.map(calc =>
          calc.id === id ? { ...calc, notes: noteText } : calc
        )
        setSavedCalcs(updated)
        localStorage.setItem('savedCalculations', JSON.stringify(updated))
        setEditingNotes(null)
        setNoteText('')
        toast.success('Notes saved')
      }
    } catch (error) {
      console.error('Error saving notes:', error)
      toast.error('Failed to save notes')
    }
  }

  const exportCalculation = (calc: SavedCalculation) => {
    const dataStr = JSON.stringify(calc, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${calc.calculatorType}-${new Date(calc.savedAt).toISOString().split('T')[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
    toast.success('Calculation exported')
  }

  const shareCalculation = async (calc: SavedCalculation) => {
    const shareUrl = `${window.location.origin}${withLocale(`/calculator/${calc.calculatorType}`)}`
    try {
      await navigator.clipboard.writeText(shareUrl)
      toast.success('Link copied to clipboard')
    } catch (error) {
      toast.error('Failed to copy link')
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Bookmark className="h-6 w-6 text-purple-500" />
            Saved Calculations
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {savedCalcs.length} calculations saved
          </p>
        </div>
      </div>

      {/* Search */}
      <Input
        placeholder="Search by name, notes, or tags..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Saved Calculations List */}
      {filteredCalcs.length === 0 ? (
        <Card className="p-12 text-center">
          <Bookmark className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold mb-2">No saved calculations</h3>
          <p className="text-sm text-muted-foreground">
            {searchTerm
              ? 'No calculations match your search'
              : 'Save calculation results to access them later'}
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredCalcs.map((calc) => (
            <Card key={calc.id} className="p-5 hover:shadow-lg transition-shadow">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-1">
                      {localizeToolMeta({
                        dict,
                        toolId: calc.calculatorType,
                        fallbackTitle: calc.calculatorName,
                        fallbackDescription: '',
                      }).title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Saved on {new Date(calc.savedAt).toLocaleString('en-IN', {
                        dateStyle: 'medium',
                        timeStyle: 'short'
                      })}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => shareCalculation(calc)}
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => exportCalculation(calc)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Link href={withLocale(`/calculator/${calc.calculatorType}`)}>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteCalculation(calc.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>

                {/* Input Values */}
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
                  <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">
                    Input Values
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {Object.entries(calc.inputs).map(([key, value]) => (
                      <div key={key}>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{key}</p>
                        <p className="font-medium text-sm">{String(value)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                <div>
                  {editingNotes === calc.id ? (
                    <div className="space-y-2">
                      <textarea
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                        placeholder="Add notes..."
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                        rows={3}
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => saveNotes(calc.id)}>
                          Save Notes
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingNotes(null)
                            setNoteText('')
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      {calc.notes ? (
                        <div
                          className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer hover:text-gray-900 dark:hover:text-gray-200"
                          onClick={() => {
                            setEditingNotes(calc.id)
                            setNoteText(calc.notes || '')
                          }}
                        >
                          <p className="text-xs text-gray-500 mb-1">Notes:</p>
                          <p>{calc.notes}</p>
                        </div>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingNotes(calc.id)
                            setNoteText('')
                          }}
                        >
                          + Add Notes
                        </Button>
                      )}
                    </div>
                  )}
                </div>

                {/* Tags */}
                {calc.tags && calc.tags.length > 0 && (
                  <div className="flex gap-2 flex-wrap">
                    {calc.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-full flex items-center gap-1"
                      >
                        <Tag className="h-3 w-3" />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
