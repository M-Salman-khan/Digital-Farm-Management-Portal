import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { localTraining } from '../utils/local-storage'
import { 
  PlayCircle, 
  CheckCircle, 
  Clock, 
  Book, 
  Video, 
  FileText,
  Award 
} from 'lucide-react'
import { Progress } from './ui/progress'

const trainingModules = [
  {
    id: 'intro-biosecurity',
    title: 'Introduction to Biosecurity',
    titleHi: 'जैव सुरक्षा का परिचय',
    duration: '15 min',
    type: 'video',
    description: 'Learn the fundamentals of biosecurity and why it matters for your farm.',
    topics: ['What is biosecurity?', 'Why it matters', 'Basic principles', 'Common risks'],
  },
  {
    id: 'visitor-management',
    title: 'Visitor and Vehicle Management',
    titleHi: 'आगंतुक और वाहन प्रबंधन',
    duration: '20 min',
    type: 'video',
    description: 'Best practices for controlling farm access and preventing disease transmission.',
    topics: ['Access control', 'Visitor logs', 'Vehicle disinfection', 'Protective clothing'],
  },
  {
    id: 'sanitation',
    title: 'Sanitation and Hygiene Protocols',
    titleHi: 'स्वच्छता और स्वास्थ्य प्रोटोकॉल',
    duration: '25 min',
    type: 'video',
    description: 'Comprehensive guide to cleaning and disinfection procedures.',
    topics: ['Cleaning procedures', 'Disinfectants', 'Equipment sanitation', 'Hand hygiene'],
  },
  {
    id: 'disease-prevention',
    title: 'Disease Prevention Strategies',
    titleHi: 'रोग रोकथाम रणनीतियाँ',
    duration: '30 min',
    type: 'video',
    description: 'Learn to identify, prevent, and respond to common diseases.',
    topics: ['Disease signs', 'Vaccination', 'Quarantine', 'Emergency response'],
  },
  {
    id: 'record-keeping',
    title: 'Record Keeping and Documentation',
    titleHi: 'रिकॉर्ड रखना और प्रलेखन',
    duration: '15 min',
    type: 'document',
    description: 'Master the art of maintaining accurate farm records.',
    topics: ['What to record', 'Digital tools', 'Compliance', 'Best practices'],
  },
  {
    id: 'pest-control',
    title: 'Integrated Pest Management',
    titleHi: 'एकीकृत कीट प्रबंधन',
    duration: '20 min',
    type: 'video',
    description: 'Control pests and rodents that can spread diseases.',
    topics: ['Common pests', 'Prevention methods', 'Safe pesticide use', 'Monitoring'],
  },
]

export function Training() {
  const { user } = useAuth()
  const { t, language } = useLanguage()
  const [progress, setProgress] = useState<Record<string, any>>({})
  const [selectedModule, setSelectedModule] = useState<any>(null)
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchProgress()
    }
  }, [user])

  const fetchProgress = async () => {
    if (!user) return
    try {
      const progressData = localTraining.getProgress(user.id)
      const progressMap: Record<string, any> = {}
      progressData.forEach((p: any) => {
        progressMap[p.moduleId] = p
      })
      setProgress(progressMap)
    } catch (error) {
      console.error('Error fetching training progress:', error)
    } finally {
      setLoading(false)
    }
  }

  const markComplete = async (moduleId: string, quizScore: number = 100) => {
    if (!user) return
    try {
      localTraining.saveProgress(user.id, moduleId, true)
      await fetchProgress()
      setSelectedModule(null)
    } catch (error) {
      console.error('Error updating progress:', error)
    }
  }



  const getModuleStatus = (moduleId: string) => {
    if (progress[moduleId]?.completed) return 'completed'
    return 'not-started'
  }

  const completedCount = Object.values(progress).filter((p: any) => p.completed).length
  const totalCount = trainingModules.length
  const overallProgress = (completedCount / totalCount) * 100

  if (selectedModule) {
    return (
      <div className="max-w-3xl mx-auto">
        <Card className="p-8">
          <Button 
            onClick={() => setSelectedModule(null)} 
            variant="outline" 
            className="mb-6"
          >
            ← Back to Modules
          </Button>

          <div className="mb-6">
            <h1 className="mb-2 text-gray-900">
              {language === 'hi' && selectedModule.titleHi ? selectedModule.titleHi : selectedModule.title}
            </h1>
            <div className="flex items-center gap-4 text-gray-600">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {selectedModule.duration}
              </span>
              <span className="flex items-center gap-1">
                {selectedModule.type === 'video' ? (
                  <Video className="w-4 h-4" />
                ) : (
                  <FileText className="w-4 h-4" />
                )}
                {selectedModule.type}
              </span>
            </div>
          </div>

          <div className="mb-6 p-6 bg-gray-50 rounded-lg">
            <p className="text-gray-700 mb-4">{selectedModule.description}</p>
            <h4 className="text-gray-900 mb-2">Topics Covered:</h4>
            <ul className="space-y-2">
              {selectedModule.topics.map((topic: string, index: number) => (
                <li key={index} className="flex items-center gap-2 text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  {topic}
                </li>
              ))}
            </ul>
          </div>

          {selectedModule.type === 'video' && (
            <div className="mb-6 aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
              <div className="text-center text-white">
                <PlayCircle className="w-16 h-16 mx-auto mb-4 opacity-75" />
                <p>Video Player</p>
                <p className="text-sm opacity-75 mt-2">
                  In a production app, embed training videos here
                </p>
              </div>
            </div>
          )}

          {selectedModule.type === 'document' && (
            <div className="mb-6 p-6 bg-white border rounded-lg">
              <h3 className="text-gray-900 mb-4">Training Material</h3>
              <div className="prose max-w-none text-gray-700">
                <p>
                  This section would contain comprehensive written guides, 
                  infographics, and downloadable resources about {selectedModule.title.toLowerCase()}.
                </p>
                <p className="mt-4">
                  Key learning points and step-by-step instructions would be 
                  displayed here for farmers to read and reference.
                </p>
              </div>
            </div>
          )}

          {/* Simple Quiz */}
          <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg mb-6">
            <h3 className="text-gray-900 mb-4">Quick Assessment</h3>
            <p className="text-gray-700 mb-4">
              Test your understanding of this module
            </p>
            <div className="space-y-4">
              <div>
                <p className="text-gray-900 mb-2">
                  1. Which of the following is most important for biosecurity?
                </p>
                <div className="space-y-2">
                  {['Visitor control', 'Regular cleaning', 'Staff training', 'All of the above'].map((option, i) => (
                    <button
                      key={i}
                      onClick={() => setQuizAnswers({ ...quizAnswers, q1: i })}
                      className={`w-full p-3 text-left rounded border ${
                        quizAnswers.q1 === i
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <Button 
            onClick={() => markComplete(selectedModule.id)} 
            className="w-full"
            disabled={Object.keys(quizAnswers).length === 0}
          >
            Complete Module
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress Overview */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-gray-900">{t('trainingModules')}</h2>
            <p className="text-gray-600 mt-1">
              {completedCount} of {totalCount} modules completed
            </p>
          </div>
          <Award className="w-10 h-10 text-yellow-500" />
        </div>
        <Progress value={overallProgress} className="h-3" />
      </Card>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {trainingModules.map((module) => {
          const status = getModuleStatus(module.id)
          const isCompleted = status === 'completed'

          return (
            <Card key={module.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-gray-900 mb-1">
                    {language === 'hi' && module.titleHi ? module.titleHi : module.title}
                  </h3>
                  <p className="text-sm text-gray-600">{module.description}</p>
                </div>
                {isCompleted && (
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 ml-2" />
                )}
              </div>

              <div className="flex items-center gap-3 mb-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {module.duration}
                </span>
                <span className="flex items-center gap-1">
                  {module.type === 'video' ? (
                    <Video className="w-4 h-4" />
                  ) : (
                    <FileText className="w-4 h-4" />
                  )}
                  {module.type}
                </span>
              </div>

              <Button
                onClick={() => setSelectedModule(module)}
                variant={isCompleted ? 'outline' : 'default'}
                className="w-full"
              >
                {isCompleted ? 'Review' : t('startLearning')}
              </Button>
            </Card>
          )
        })}
      </div>

      {/* Certification Card */}
      {completedCount === totalCount && (
        <Card className="p-6 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
          <div className="flex items-center gap-4">
            <Award className="w-12 h-12 text-yellow-600" />
            <div className="flex-1">
              <h3 className="text-gray-900">Congratulations!</h3>
              <p className="text-gray-700 mt-1">
                You've completed all training modules. Download your certificate!
              </p>
            </div>
            <Button>Download Certificate</Button>
          </div>
        </Card>
      )}
    </div>
  )
}