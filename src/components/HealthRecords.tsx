import React, { useState, useEffect } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { useAuth } from '../contexts/AuthContext'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Select } from './ui/select'
import { Textarea } from './ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Badge } from './ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { 
  Syringe, 
  Pill, 
  Thermometer, 
  Calendar,
  Plus,
  Search,
  Filter,
  Download,
  TrendingUp,
  AlertTriangle
} from 'lucide-react'
import { localHealthRecords } from '../utils/local-storage'

interface HealthRecord {
  id: string
  batchId: string
  batchName: string
  recordType: 'vaccination' | 'medication' | 'checkup' | 'treatment'
  date: string
  details: string
  veterinarian?: string
  nextDue?: string
  status: 'completed' | 'scheduled' | 'overdue'
  notes?: string
}

export function HealthRecords() {
  const { t } = useLanguage()
  const { user } = useAuth()
  const [records, setRecords] = useState<HealthRecord[]>([])
  const [filteredRecords, setFilteredRecords] = useState<HealthRecord[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  // Form state
  const [formData, setFormData] = useState({
    batchId: '',
    batchName: '',
    recordType: 'vaccination' as const,
    date: new Date().toISOString().split('T')[0],
    details: '',
    veterinarian: '',
    nextDue: '',
    notes: ''
  })

  useEffect(() => {
    loadRecords()
  }, [])

  useEffect(() => {
    filterRecords()
  }, [records, searchTerm, filterType])

  const loadRecords = async () => {
    if (!user) return
    try {
      setLoading(true)
      const data = localHealthRecords.getAll(user.id)
      setRecords(data)
    } catch (error) {
      console.error('Error loading health records:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterRecords = () => {
    let filtered = records

    if (searchTerm) {
      filtered = filtered.filter(record =>
        record.batchName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.details.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (filterType !== 'all') {
      filtered = filtered.filter(record => record.recordType === filterType)
    }

    setFilteredRecords(filtered)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const newRecord: HealthRecord = {
        id: Date.now().toString(),
        ...formData,
        status: new Date(formData.date) > new Date() ? 'scheduled' : 'completed'
      }

      if (!user) return
      
      localHealthRecords.create(user.id, newRecord)
      await loadRecords()
      setIsAddDialogOpen(false)
      resetForm()
    } catch (error) {
      console.error('Error adding health record:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      batchId: '',
      batchName: '',
      recordType: 'vaccination',
      date: new Date().toISOString().split('T')[0],
      details: '',
      veterinarian: '',
      nextDue: '',
      notes: ''
    })
  }

  const getRecordIcon = (type: string) => {
    switch (type) {
      case 'vaccination':
        return <Syringe className="w-5 h-5" />
      case 'medication':
        return <Pill className="w-5 h-5" />
      case 'checkup':
        return <Thermometer className="w-5 h-5" />
      default:
        return <Calendar className="w-5 h-5" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'scheduled':
        return 'bg-blue-100 text-blue-800'
      case 'overdue':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const upcomingRecords = filteredRecords.filter(r => r.status === 'scheduled').length
  const overdueRecords = filteredRecords.filter(r => r.status === 'overdue').length
  const completedRecords = filteredRecords.filter(r => r.status === 'completed').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-gray-900">Digital Health Records</h2>
          <p className="text-gray-600 mt-1">Track vaccinations, medications, and treatments for your livestock</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Record
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add Health Record</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Batch ID</Label>
                  <Input
                    value={formData.batchId}
                    onChange={(e) => setFormData({ ...formData, batchId: e.target.value })}
                    placeholder="e.g., BATCH-001"
                    required
                  />
                </div>
                <div>
                  <Label>Batch Name</Label>
                  <Input
                    value={formData.batchName}
                    onChange={(e) => setFormData({ ...formData, batchName: e.target.value })}
                    placeholder="e.g., Broiler Batch A"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Record Type</Label>
                  <select
                    value={formData.recordType}
                    onChange={(e) => setFormData({ ...formData, recordType: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="vaccination">Vaccination</option>
                    <option value="medication">Medication</option>
                    <option value="checkup">Checkup</option>
                    <option value="treatment">Treatment</option>
                  </select>
                </div>
                <div>
                  <Label>Date</Label>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <Label>Details</Label>
                <Textarea
                  value={formData.details}
                  onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                  placeholder="e.g., Newcastle Disease Vaccine, Dose: 0.5ml per bird"
                  required
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Veterinarian (Optional)</Label>
                  <Input
                    value={formData.veterinarian}
                    onChange={(e) => setFormData({ ...formData, veterinarian: e.target.value })}
                    placeholder="Dr. Name"
                  />
                </div>
                <div>
                  <Label>Next Due Date (Optional)</Label>
                  <Input
                    type="date"
                    value={formData.nextDue}
                    onChange={(e) => setFormData({ ...formData, nextDue: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label>Additional Notes (Optional)</Label>
                <Textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Any additional observations or notes"
                  rows={2}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700 text-white">
                  Save Record
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Upcoming</p>
              <p className="text-2xl text-blue-600 mt-1">{upcomingRecords}</p>
            </div>
            <Calendar className="w-8 h-8 text-blue-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Overdue</p>
              <p className="text-2xl text-red-600 mt-1">{overdueRecords}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl text-green-600 mt-1">{completedRecords}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search records..."
              className="pl-10"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md bg-white"
          >
            <option value="all">All Types</option>
            <option value="vaccination">Vaccination</option>
            <option value="medication">Medication</option>
            <option value="checkup">Checkup</option>
            <option value="treatment">Treatment</option>
          </select>
        </div>
      </Card>

      {/* Records List */}
      <div className="space-y-3">
        {loading ? (
          <Card className="p-8 text-center">
            <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading health records...</p>
          </Card>
        ) : filteredRecords.length === 0 ? (
          <Card className="p-8 text-center">
            <Thermometer className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No health records found</p>
            <p className="text-sm text-gray-500 mt-1">Add your first record to start tracking</p>
          </Card>
        ) : (
          filteredRecords.map((record) => (
            <Card key={record.id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-green-50 rounded-lg text-green-600">
                  {getRecordIcon(record.recordType)}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-gray-900">{record.batchName}</h3>
                      <p className="text-sm text-gray-600">ID: {record.batchId}</p>
                    </div>
                    <Badge className={getStatusColor(record.status)}>
                      {record.status}
                    </Badge>
                  </div>
                  <p className="text-gray-700 mb-2">{record.details}</p>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(record.date).toLocaleDateString()}
                    </span>
                    {record.veterinarian && (
                      <span>Vet: {record.veterinarian}</span>
                    )}
                    {record.nextDue && (
                      <span className="text-blue-600">
                        Next Due: {new Date(record.nextDue).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  {record.notes && (
                    <p className="text-sm text-gray-600 mt-2 italic">Note: {record.notes}</p>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}