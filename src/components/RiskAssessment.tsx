import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { Label } from './ui/label'
import { localAssessments } from '../utils/local-storage'
import { AlertCircle, CheckCircle, Info } from 'lucide-react'
import { Progress } from './ui/progress'

const assessmentQuestions = {
  pig: [
    { id: 'biosecurity_protocol', question: 'Do you have written biosecurity protocols?', type: 'boolean' },
    { id: 'visitor_log', question: 'Do you maintain a visitor log and restrict access?', type: 'boolean' },
    { id: 'footbath', question: 'Are footbaths with disinfectant available at entry points?', type: 'boolean' },
    { id: 'quarantine', question: 'Do you quarantine new animals before introducing them?', type: 'boolean' },
    { id: 'pest_control', question: 'Is there an active pest control program?', type: 'boolean' },
    { id: 'water_quality', question: 'Is drinking water regularly tested for quality?', type: 'boolean' },
    { id: 'vaccination', question: 'Are animals vaccinated according to schedule?', type: 'boolean' },
    { id: 'disposal', question: 'Are dead animals properly disposed of?', type: 'boolean' },
    { id: 'equipment', question: 'Is equipment regularly cleaned and disinfected?', type: 'boolean' },
    { id: 'training', question: 'Have staff received biosecurity training?', type: 'boolean' },
  ],
  poultry: [
    { id: 'biosecurity_protocol', question: 'Do you have written biosecurity protocols?', type: 'boolean' },
    { id: 'visitor_control', question: 'Is visitor access controlled and recorded?', type: 'boolean' },
    { id: 'disinfection', question: 'Are vehicles disinfected before entering the farm?', type: 'boolean' },
    { id: 'all_in_out', question: 'Do you follow all-in/all-out production system?', type: 'boolean' },
    { id: 'wild_birds', question: 'Are measures in place to prevent wild bird contact?', type: 'boolean' },
    { id: 'feed_storage', question: 'Is feed stored properly to prevent contamination?', type: 'boolean' },
    { id: 'vaccination', question: 'Are birds vaccinated as per recommended schedule?', type: 'boolean' },
    { id: 'mortality', question: 'Do you monitor and record daily mortality?', type: 'boolean' },
    { id: 'litter_management', question: 'Is litter managed and disposed of properly?', type: 'boolean' },
    { id: 'staff_training', question: 'Have workers been trained in disease prevention?', type: 'boolean' },
  ],
}

export function RiskAssessment() {
  const { user } = useAuth()
  const { t } = useLanguage()
  const [farmType, setFarmType] = useState<'pig' | 'poultry'>('poultry')
  const [responses, setResponses] = useState<Record<string, boolean>>({})
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState<'select' | 'assess' | 'result'>('select')

  const questions = assessmentQuestions[farmType]
  const progress = (Object.keys(responses).length / questions.length) * 100

  const handleResponse = (questionId: string, value: boolean) => {
    setResponses(prev => ({ ...prev, [questionId]: value }))
  }

  const handleSubmit = async () => {
    if (!user) return
    
    setLoading(true)
    try {
      // Calculate risk score locally
      const totalQuestions = questions.length
      const positiveResponses = Object.values(responses).filter(v => v).length
      const riskScore = ((totalQuestions - positiveResponses) / totalQuestions) * 100
      
      let riskLevel: 'low' | 'medium' | 'high'
      if (riskScore < 30) riskLevel = 'low'
      else if (riskScore < 60) riskLevel = 'medium'
      else riskLevel = 'high'

      // Save assessment to local storage
      const assessment = localAssessments.create(user.id, {
        farmType,
        responses,
        riskScore,
        riskLevel,
      })

      setResult(assessment)
      setStep('result')
    } catch (error) {
      console.error('Error submitting assessment:', error)
      alert('Failed to submit assessment')
    } finally {
      setLoading(false)
    }
  }

  const startNewAssessment = () => {
    setStep('select')
    setResponses({})
    setResult(null)
  }

  if (step === 'select') {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="p-8">
          <h1 className="mb-2 text-gray-900">{t('riskAssessment')}</h1>
          <p className="text-gray-600 mb-6">
            Complete a self-assessment to evaluate biosecurity measures on your farm
          </p>

          <div className="space-y-4">
            <Label>Select Farm Type</Label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setFarmType('poultry')}
                className={`p-6 border-2 rounded-lg transition-all ${
                  farmType === 'poultry'
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-4xl mb-2">🐔</div>
                <p className="text-gray-900">{t('poultry')}</p>
              </button>

              <button
                onClick={() => setFarmType('pig')}
                className={`p-6 border-2 rounded-lg transition-all ${
                  farmType === 'pig'
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-4xl mb-2">🐷</div>
                <p className="text-gray-900">{t('pig')}</p>
              </button>
            </div>

            <Button onClick={() => setStep('assess')} className="w-full mt-6">
              {t('startAssessment')}
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  if (step === 'result') {
    const getRiskInfo = (level: string) => {
      switch (level) {
        case 'low':
          return {
            color: 'text-green-600',
            bg: 'bg-green-50 border-green-200',
            icon: CheckCircle,
            message: 'Excellent! Your biosecurity measures are strong.',
          }
        case 'medium':
          return {
            color: 'text-yellow-600',
            bg: 'bg-yellow-50 border-yellow-200',
            icon: Info,
            message: 'Good progress, but there is room for improvement.',
          }
        case 'high':
          return {
            color: 'text-red-600',
            bg: 'bg-red-50 border-red-200',
            icon: AlertCircle,
            message: 'Urgent attention needed to improve biosecurity.',
          }
        default:
          return {
            color: 'text-gray-600',
            bg: 'bg-gray-50 border-gray-200',
            icon: Info,
            message: 'Assessment complete.',
          }
      }
    }

    const riskInfo = getRiskInfo(result.riskLevel)
    const RiskIcon = riskInfo.icon

    return (
      <div className="max-w-2xl mx-auto">
        <Card className="p-8">
          <h1 className="mb-6 text-gray-900">Assessment Results</h1>

          <div className={`p-6 border-2 rounded-lg ${riskInfo.bg} mb-6`}>
            <div className="flex items-center gap-3 mb-4">
              <RiskIcon className={`w-8 h-8 ${riskInfo.color}`} />
              <div>
                <p className={`${riskInfo.color}`}>{t(result.riskLevel)} {t('riskLevel')}</p>
                <p className="text-gray-700 mt-1">{riskInfo.message}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Progress value={result.score} className="h-3" />
              </div>
              <span className={`${riskInfo.color}`}>
                {result.score}/100
              </span>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <h3 className="text-gray-900 mb-3">Recommendations</h3>
            <ul className="space-y-2 text-gray-700">
              {result.riskLevel === 'high' && (
                <>
                  <li>• Implement written biosecurity protocols immediately</li>
                  <li>• Establish visitor control and logging system</li>
                  <li>• Schedule staff training on biosecurity measures</li>
                  <li>• Consult with a veterinarian for detailed assessment</li>
                </>
              )}
              {result.riskLevel === 'medium' && (
                <>
                  <li>• Review and update existing biosecurity protocols</li>
                  <li>• Improve monitoring and record-keeping systems</li>
                  <li>• Conduct regular staff training refreshers</li>
                  <li>• Enhance pest control and sanitation measures</li>
                </>
              )}
              {result.riskLevel === 'low' && (
                <>
                  <li>• Maintain current biosecurity standards</li>
                  <li>• Continue regular monitoring and documentation</li>
                  <li>• Stay updated on new biosecurity guidelines</li>
                  <li>• Share best practices with other farmers</li>
                </>
              )}
            </ul>
          </div>

          <div className="flex gap-3">
            <Button onClick={startNewAssessment} variant="outline" className="flex-1">
              New Assessment
            </Button>
            <Button onClick={() => window.location.hash = '#training'} className="flex-1">
              View Training
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="p-8">
        <div className="mb-6">
          <h1 className="mb-2 text-gray-900">
            {farmType === 'pig' ? t('pig') : t('poultry')} {t('riskAssessment')}
          </h1>
          <p className="text-gray-600">Answer all questions honestly for accurate assessment</p>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Progress</span>
            <span className="text-sm text-gray-600">
              {Object.keys(responses).length} / {questions.length}
            </span>
          </div>
          <Progress value={progress} />
        </div>

        <div className="space-y-6">
          {questions.map((q, index) => (
            <div key={q.id} className="p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-900 mb-3">
                {index + 1}. {q.question}
              </p>
              <div className="flex gap-3">
                <Button
                  onClick={() => handleResponse(q.id, true)}
                  variant={responses[q.id] === true ? 'default' : 'outline'}
                  className="flex-1"
                >
                  Yes
                </Button>
                <Button
                  onClick={() => handleResponse(q.id, false)}
                  variant={responses[q.id] === false ? 'default' : 'outline'}
                  className="flex-1"
                >
                  No
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex gap-3">
          <Button
            onClick={() => setStep('select')}
            variant="outline"
            className="flex-1"
          >
            {t('cancel')}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={Object.keys(responses).length !== questions.length || loading}
            className="flex-1"
          >
            {loading ? t('loading') : t('submit')}
          </Button>
        </div>
      </Card>
    </div>
  )
}