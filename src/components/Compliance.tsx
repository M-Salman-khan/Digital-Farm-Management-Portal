import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { localCompliance } from '../utils/local-storage'
import { 
  Plus, 
  Syringe, 
  ClipboardCheck, 
  Droplet, 
  Calendar, 
  FileText,
  Download
} from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'

export function Compliance() {
  const { user } = useAuth()
  const { t } = useLanguage()
  const [records, setRecords] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showDialog, setShowDialog] = useState(false)
  const [recordType, setRecordType] = useState<'vaccination' | 'inspection' | 'sanitation'>('vaccination')
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    details: '',
  })

  useEffect(() => {
    if (user) {
      fetchRecords()
    }
  }, [user])

  const fetchRecords = async () => {
    if (!user) return
    try {
      const data = localCompliance.getAll(user.id)
      setRecords(data)
    } catch (error) {
      console.error('Error fetching compliance records:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    try {
      localCompliance.create(user.id, {
        type: recordType,
        ...formData,
      })

      if (response.ok) {
        setShowDialog(false)
        setFormData({ date: new Date().toISOString().split('T')[0], details: '' })
        await fetchRecords()
      }
    } catch (error) {
      console.error('Error adding record:', error)
    }
  }

  const getRecordIcon = (type: string) => {
    switch (type) {
      case 'vaccination': return Syringe
      case 'inspection': return ClipboardCheck
      case 'sanitation': return Droplet
      default: return FileText
    }
  }

  const getRecordColor = (type: string) => {
    switch (type) {
      case 'vaccination': return 'bg-blue-50 border-blue-200 text-blue-700'
      case 'inspection': return 'bg-green-50 border-green-200 text-green-700'
      case 'sanitation': return 'bg-purple-50 border-purple-200 text-purple-700'
      default: return 'bg-gray-50 border-gray-200 text-gray-700'
    }
  }

  const filterRecordsByType = (type: string) => {
    return records.filter(r => r.type === type)
  }

  const exportRecords = () => {
    const csvContent = [
      ['Date', 'Type', 'Details'],
      ...records.map(r => [
        new Date(r.date).toLocaleDateString(),
        r.type,
        r.details
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `compliance-records-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-gray-900">{t('compliance')} & {t('details')}</h1>
            <p className="text-gray-600 mt-1">
              Maintain digital records for inspections, vaccinations, and sanitation
            </p>
          </div>
          <div className="flex gap-3">
            <Button onClick={exportRecords} variant="outline" disabled={records.length === 0}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button onClick={() => setShowDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              {t('addRecord')}
            </Button>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <Syringe className="w-8 h-8 text-blue-500" />
            <div>
              <p className="text-gray-600">{t('vaccination')}</p>
              <p className="text-gray-900">{filterRecordsByType('vaccination').length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <ClipboardCheck className="w-8 h-8 text-green-500" />
            <div>
              <p className="text-gray-600">{t('inspection')}</p>
              <p className="text-gray-900">{filterRecordsByType('inspection').length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <Droplet className="w-8 h-8 text-purple-500" />
            <div>
              <p className="text-gray-600">{t('sanitation')}</p>
              <p className="text-gray-900">{filterRecordsByType('sanitation').length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Records */}
      <Card className="p-6">
        <Tabs defaultValue="all">
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Records</TabsTrigger>
            <TabsTrigger value="vaccination">{t('vaccination')}</TabsTrigger>
            <TabsTrigger value="inspection">{t('inspection')}</TabsTrigger>
            <TabsTrigger value="sanitation">{t('sanitation')}</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <RecordsList records={records} t={t} getRecordIcon={getRecordIcon} getRecordColor={getRecordColor} />
          </TabsContent>

          <TabsContent value="vaccination">
            <RecordsList 
              records={filterRecordsByType('vaccination')} 
              t={t} 
              getRecordIcon={getRecordIcon} 
              getRecordColor={getRecordColor} 
            />
          </TabsContent>

          <TabsContent value="inspection">
            <RecordsList 
              records={filterRecordsByType('inspection')} 
              t={t} 
              getRecordIcon={getRecordIcon} 
              getRecordColor={getRecordColor} 
            />
          </TabsContent>

          <TabsContent value="sanitation">
            <RecordsList 
              records={filterRecordsByType('sanitation')} 
              t={t} 
              getRecordIcon={getRecordIcon} 
              getRecordColor={getRecordColor} 
            />
          </TabsContent>
        </Tabs>
      </Card>

      {/* Add Record Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('addRecord')}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Record Type</Label>
              <select
                value={recordType}
                onChange={(e) => setRecordType(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="vaccination">{t('vaccination')}</option>
                <option value="inspection">{t('inspection')}</option>
                <option value="sanitation">{t('sanitation')}</option>
              </select>
            </div>

            <div>
              <Label htmlFor="date">{t('date')}</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="details">{t('details')}</Label>
              <textarea
                id="details"
                value={formData.details}
                onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md min-h-24"
                placeholder={`Enter ${recordType} details...`}
                required
              />
            </div>

            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={() => setShowDialog(false)} className="flex-1">
                {t('cancel')}
              </Button>
              <Button type="submit" className="flex-1">
                {t('save')}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function RecordsList({ records, t, getRecordIcon, getRecordColor }: any) {
  if (records.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p>{t('noData')}</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {records.map((record: any) => {
        const Icon = getRecordIcon(record.type)
        return (
          <div
            key={record.id}
            className={`flex items-start gap-4 p-4 border rounded-lg ${getRecordColor(record.type)}`}
          >
            <Icon className="w-6 h-6 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="capitalize">{record.type}</p>
                  <div className="flex items-center gap-2 text-sm opacity-75 mt-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(record.date).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <p className="text-sm opacity-90">{record.details}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}