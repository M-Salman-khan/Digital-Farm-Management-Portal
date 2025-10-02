import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { localAssessments, localAlerts, localCompliance } from '../utils/local-storage'
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp, 
  Calendar,
  FileText,
  Users,
  Bell
} from 'lucide-react'

export function Dashboard() {
  const { user } = useAuth()
  const { t } = useLanguage()
  const [stats, setStats] = useState<any>({})
  const [assessments, setAssessments] = useState<any[]>([])
  const [alerts, setAlerts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      if (!user) return

      // Fetch recent assessments from local storage
      const assessmentsData = localAssessments.getAll(user.id)
      setAssessments(assessmentsData.slice(0, 3))

      // Fetch alerts from local storage
      const alertsData = localAlerts.getAll()
      setAlerts(alertsData.slice(0, 3))

      // Fetch compliance records from local storage
      const complianceData = localCompliance.getAll(user.id)

      setStats({
        totalAssessments: assessmentsData.length,
        activeAlerts: alertsData.length,
        complianceRecords: complianceData.length,
      })
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'high': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500'
      case 'high': return 'bg-orange-500'
      case 'medium': return 'bg-yellow-500'
      case 'low': return 'bg-blue-500'
      default: return 'bg-gray-500'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">{t('loading')}</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
        <h1>{t('welcome')}, {user?.name}!</h1>
        <p className="mt-2 opacity-90">
          {user?.role === 'farmer' && `${t('farmType')}: ${t(user?.farmType || '')}`}
        </p>
        <p className="opacity-90">{user?.location}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 mb-1">{t('recentAssessments')}</p>
              <p className="text-gray-900">{stats.totalAssessments}</p>
            </div>
            <Activity className="w-10 h-10 text-blue-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 mb-1">{t('activeAlerts')}</p>
              <p className="text-gray-900">{stats.activeAlerts}</p>
            </div>
            <Bell className="w-10 h-10 text-red-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 mb-1">{t('compliance')} {t('details')}</p>
              <p className="text-gray-900">{stats.complianceRecords}</p>
            </div>
            <FileText className="w-10 h-10 text-green-500" />
          </div>
        </Card>
      </div>

      {/* Recent Assessments */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-900">{t('recentAssessments')}</h3>
          <TrendingUp className="w-5 h-5 text-gray-400" />
        </div>
        
        {assessments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>{t('noData')}</p>
            <p className="mt-2">{t('startAssessment')}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {assessments.map((assessment) => (
              <div 
                key={assessment.id} 
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <p className="text-gray-900">
                    {assessment.farmType === 'pig' ? t('pig') : t('poultry')} {t('riskAssessment')}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(assessment.timestamp).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-gray-700">{assessment.score}/100</span>
                  <span className={`px-3 py-1 rounded-full text-sm border ${getRiskColor(assessment.riskLevel)}`}>
                    {t(assessment.riskLevel)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Active Alerts */}
      {alerts.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-900">{t('activeAlerts')}</h3>
            <AlertTriangle className="w-5 h-5 text-red-500" />
          </div>
          
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div 
                key={alert.id} 
                className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg"
              >
                <div className={`w-2 h-2 rounded-full mt-2 ${getSeverityColor(alert.severity)}`} />
                <div className="flex-1">
                  <p className="text-gray-900">{alert.title}</p>
                  <p className="text-sm text-gray-600 mt-1">{alert.description}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <span>{alert.location}</span>
                    <span>{new Date(alert.timestamp).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="text-gray-900 mb-4">{t('upcomingTasks')}</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <Calendar className="w-5 h-5 text-blue-600" />
            <span className="text-gray-700">Complete monthly biosecurity assessment</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-gray-700">Update vaccination records</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <FileText className="w-5 h-5 text-yellow-600" />
            <span className="text-gray-700">Review sanitation logs</span>
          </div>
        </div>
      </Card>
    </div>
  )
}