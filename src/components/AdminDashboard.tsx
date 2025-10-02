import React, { useState, useEffect } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { Card } from './ui/card'
import { localAnalytics } from '../utils/local-storage'
import { Users, Activity, AlertTriangle, TrendingUp, PieChart } from 'lucide-react'
import { Progress } from './ui/progress'

export function AdminDashboard() {
  const { t } = useLanguage()
  const [analytics, setAnalytics] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const data = localAnalytics.get()
      setAnalytics(data)
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">{t('loading')}</p>
      </div>
    )
  }

  if (!analytics) {
    return (
      <Card className="p-12 text-center">
        <p className="text-gray-600">Unable to load analytics data</p>
      </Card>
    )
  }

  const totalRisk = analytics.riskDistribution.low + 
                     analytics.riskDistribution.medium + 
                     analytics.riskDistribution.high

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-blue-600 rounded-lg p-6 text-white">
        <h1>{t('analytics')} Dashboard</h1>
        <p className="mt-2 opacity-90">
          Comprehensive insights for policy-making and disease surveillance
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 mb-1">{t('totalUsers')}</p>
              <p className="text-gray-900">{analytics.totalUsers}</p>
            </div>
            <Users className="w-10 h-10 text-blue-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 mb-1">{t('totalAssessments')}</p>
              <p className="text-gray-900">{analytics.totalAssessments}</p>
            </div>
            <Activity className="w-10 h-10 text-green-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 mb-1">{t('activeAlerts')}</p>
              <p className="text-gray-900">{analytics.activeAlerts}</p>
            </div>
            <AlertTriangle className="w-10 h-10 text-red-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 mb-1">Engagement Rate</p>
              <p className="text-gray-900">87%</p>
            </div>
            <TrendingUp className="w-10 h-10 text-purple-500" />
          </div>
        </Card>
      </div>

      {/* Risk Distribution */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <PieChart className="w-6 h-6 text-gray-700" />
          <h2 className="text-gray-900">{t('riskDistribution')}</h2>
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-700">Low Risk Farms</span>
              <span className="text-green-600">
                {analytics.riskDistribution.low} ({totalRisk > 0 ? Math.round((analytics.riskDistribution.low / totalRisk) * 100) : 0}%)
              </span>
            </div>
            <Progress 
              value={totalRisk > 0 ? (analytics.riskDistribution.low / totalRisk) * 100 : 0} 
              className="h-3 [&>div]:bg-green-500"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-700">Medium Risk Farms</span>
              <span className="text-yellow-600">
                {analytics.riskDistribution.medium} ({totalRisk > 0 ? Math.round((analytics.riskDistribution.medium / totalRisk) * 100) : 0}%)
              </span>
            </div>
            <Progress 
              value={totalRisk > 0 ? (analytics.riskDistribution.medium / totalRisk) * 100 : 0} 
              className="h-3 [&>div]:bg-yellow-500"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-700">High Risk Farms</span>
              <span className="text-red-600">
                {analytics.riskDistribution.high} ({totalRisk > 0 ? Math.round((analytics.riskDistribution.high / totalRisk) * 100) : 0}%)
              </span>
            </div>
            <Progress 
              value={totalRisk > 0 ? (analytics.riskDistribution.high / totalRisk) * 100 : 0} 
              className="h-3 [&>div]:bg-red-500"
            />
          </div>
        </div>
      </Card>

      {/* Farm Type Distribution */}
      <Card className="p-6">
        <h2 className="text-gray-900 mb-6">{t('farmStats')}</h2>

        <div className="grid grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-24 h-24 mx-auto bg-pink-100 rounded-full flex items-center justify-center mb-3">
              <span className="text-4xl">🐷</span>
            </div>
            <p className="text-gray-600 mb-1">{t('pig')} Farms</p>
            <p className="text-gray-900">{analytics.farmTypeDistribution.pig}</p>
          </div>

          <div className="text-center">
            <div className="w-24 h-24 mx-auto bg-yellow-100 rounded-full flex items-center justify-center mb-3">
              <span className="text-4xl">🐔</span>
            </div>
            <p className="text-gray-600 mb-1">{t('poultry')} Farms</p>
            <p className="text-gray-900">{analytics.farmTypeDistribution.poultry}</p>
          </div>

          <div className="text-center">
            <div className="w-24 h-24 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-3">
              <span className="text-4xl">🌾</span>
            </div>
            <p className="text-gray-600 mb-1">Mixed Farms</p>
            <p className="text-gray-900">{analytics.farmTypeDistribution.both}</p>
          </div>
        </div>
      </Card>

      {/* Insights & Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-6 bg-blue-50 border-blue-200">
          <h3 className="text-gray-900 mb-3">Key Insights</h3>
          <ul className="space-y-2 text-gray-700 text-sm">
            <li>• {analytics.totalAssessments} biosecurity assessments completed this month</li>
            <li>• {analytics.riskDistribution.high} farms require immediate intervention</li>
            <li>• Average compliance rate improved by 23% this quarter</li>
            <li>• Training module completion rate: 76%</li>
          </ul>
        </Card>

        <Card className="p-6 bg-green-50 border-green-200">
          <h3 className="text-gray-900 mb-3">Recommendations</h3>
          <ul className="space-y-2 text-gray-700 text-sm">
            <li>• Focus outreach efforts on high-risk farms</li>
            <li>• Increase vaccination awareness campaigns</li>
            <li>• Deploy mobile vet units to underserved areas</li>
            <li>• Enhance real-time disease monitoring systems</li>
          </ul>
        </Card>
      </div>

      {/* Export Data */}
      <Card className="p-6">
        <h3 className="text-gray-900 mb-4">Data Export & Reports</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors text-gray-700">
            📊 Export Assessment Data
          </button>
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors text-gray-700">
            📈 Generate Monthly Report
          </button>
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors text-gray-700">
            📋 Download Compliance Logs
          </button>
        </div>
      </Card>
    </div>
  )
}