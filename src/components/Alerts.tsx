import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { Badge } from './ui/badge'
import { localAlerts } from '../utils/local-storage'
import { 
  AlertTriangle, 
  AlertCircle, 
  Info, 
  MapPin, 
  Clock,
  Plus,
  Bell
} from 'lucide-react'

export function Alerts() {
  const { user } = useAuth()
  const { t } = useLanguage()
  const [alerts, setAlerts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showDialog, setShowDialog] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    severity: 'medium',
    location: '',
    farmType: 'both',
  })

  const canCreateAlerts = user?.role === 'vet' || user?.role === 'authority'

  useEffect(() => {
    fetchAlerts()
    // Set up polling for new alerts
    const interval = setInterval(fetchAlerts, 30000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const fetchAlerts = async () => {
    try {
      const data = localAlerts.getAll()
      setAlerts(data)
    } catch (error) {
      console.error('Error fetching alerts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      localAlerts.create(formData)
      setShowDialog(false)
      setFormData({
        title: '',
        description: '',
        severity: 'medium',
        location: '',
        farmType: 'both',
      })
      await fetchAlerts()
    } catch (error) {
      console.error('Error creating alert:', error)
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return AlertTriangle
      case 'high': return AlertCircle
      case 'medium': return AlertCircle
      case 'low': return Info
      default: return Info
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 border-red-300 text-red-900'
      case 'high': return 'bg-orange-100 border-orange-300 text-orange-900'
      case 'medium': return 'bg-yellow-100 border-yellow-300 text-yellow-900'
      case 'low': return 'bg-blue-100 border-blue-300 text-blue-900'
      default: return 'bg-gray-100 border-gray-300 text-gray-900'
    }
  }

  const getSeverityBadge = (severity: string) => {
    const colors: any = {
      critical: 'destructive',
      high: 'default',
      medium: 'secondary',
      low: 'outline',
    }
    return colors[severity] || 'outline'
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell className="w-8 h-8 text-red-500" />
            <div>
              <h1 className="text-gray-900">{t('activeAlerts')}</h1>
              <p className="text-gray-600 mt-1">
                Real-time disease outbreak alerts and biosecurity warnings
              </p>
            </div>
          </div>
          {canCreateAlerts && (
            <Button onClick={() => setShowDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              {t('createAlert')}
            </Button>
          )}
        </div>
      </Card>

      {/* Alert Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {['critical', 'high', 'medium', 'low'].map(severity => {
          const count = alerts.filter(a => a.severity === severity).length
          const Icon = getSeverityIcon(severity)
          return (
            <Card key={severity} className={`p-4 ${getSeverityColor(severity)}`}>
              <div className="flex items-center gap-2 mb-1">
                <Icon className="w-5 h-5" />
                <span className="capitalize">{severity}</span>
              </div>
              <p className="text-2xl">{count}</p>
            </Card>
          )
        })}
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {loading ? (
          <Card className="p-12 text-center">
            <p className="text-gray-500">{t('loading')}</p>
          </Card>
        ) : alerts.length === 0 ? (
          <Card className="p-12 text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600">No active alerts</p>
            <p className="text-gray-500 text-sm mt-2">
              All clear! No disease outbreaks reported in your area.
            </p>
          </Card>
        ) : (
          alerts.map((alert) => {
            const Icon = getSeverityIcon(alert.severity)
            return (
              <Card
                key={alert.id}
                className={`p-6 border-2 ${getSeverityColor(alert.severity)}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3 flex-1">
                    <Icon className="w-6 h-6 flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-gray-900">{alert.title}</h3>
                        <Badge variant={getSeverityBadge(alert.severity)}>
                          {alert.severity}
                        </Badge>
                      </div>
                      <p className="text-gray-700 mb-3">{alert.description}</p>
                      <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{alert.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{new Date(alert.timestamp).toLocaleString()}</span>
                        </div>
                        <div className="capitalize">
                          Farm Type: {alert.farmType}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                  <Button variant="outline" size="sm">
                    Mark as Read
                  </Button>
                </div>
              </Card>
            )
          })
        )}
      </div>

      {/* Information Card */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3">
          <Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-gray-900 mb-2">About Disease Alerts</h3>
            <p className="text-gray-700 text-sm">
              Disease alerts are issued by veterinarians and authorities when outbreaks 
              are detected in your region. Pay close attention to critical and high-severity 
              alerts and take immediate preventive measures. Contact your local veterinarian 
              if you notice similar symptoms in your farm.
            </p>
          </div>
        </div>
      </Card>

      {/* Create Alert Dialog */}
      {canCreateAlerts && (
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{t('createAlert')}</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">{t('title')}</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., African Swine Fever Outbreak"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">{t('description')}</Label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md min-h-24"
                  placeholder="Provide detailed information about the outbreak..."
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="severity">{t('severity')}</Label>
                  <select
                    id="severity"
                    value={formData.severity}
                    onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="farmType">{t('farmType')}</Label>
                  <select
                    id="farmType"
                    value={formData.farmType}
                    onChange={(e) => setFormData({ ...formData, farmType: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="pig">{t('pig')}</option>
                    <option value="poultry">{t('poultry')}</option>
                    <option value="both">{t('both')}</option>
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="location">{t('location')}</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="City, District, State"
                  required
                />
              </div>

              <div className="flex gap-3">
                <Button type="button" variant="outline" onClick={() => setShowDialog(false)} className="flex-1">
                  {t('cancel')}
                </Button>
                <Button type="submit" className="flex-1">
                  Publish Alert
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}