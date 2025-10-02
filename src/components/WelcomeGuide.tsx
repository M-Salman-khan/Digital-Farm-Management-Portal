import React, { useState } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { Dialog, DialogContent } from './ui/dialog'
import { Button } from './ui/button'
import { 
  Activity, 
  GraduationCap, 
  FileText, 
  Bell, 
  Users,
  CheckCircle,
  ArrowRight
} from 'lucide-react'

interface WelcomeGuideProps {
  isOpen: boolean
  onClose: () => void
  userRole: string
}

export function WelcomeGuide({ isOpen, onClose, userRole }: WelcomeGuideProps) {
  const { t } = useLanguage()
  const [step, setStep] = useState(0)

  const farmerSteps = [
    {
      title: 'Welcome to Farm Biosecurity Portal!',
      description: 'Your digital companion for implementing and monitoring biosecurity measures on your farm.',
      icon: '🌾',
      features: [
        'Complete biosecurity risk assessments',
        'Access training modules and resources',
        'Track compliance and maintain records',
        'Receive real-time disease alerts',
        'Connect with other farmers and experts',
      ],
    },
    {
      title: 'Start with Risk Assessment',
      description: 'Evaluate your current biosecurity measures and get personalized recommendations.',
      icon: Activity,
      features: [
        'Answer simple questions about your farm',
        'Get instant risk score (Low/Medium/High)',
        'Receive actionable recommendations',
        'Track improvements over time',
      ],
    },
    {
      title: 'Complete Training Modules',
      description: 'Learn best practices and earn certificates to demonstrate your expertise.',
      icon: GraduationCap,
      features: [
        '6 comprehensive training modules',
        'Videos, guides, and interactive quizzes',
        'Track your learning progress',
        'Download certificates upon completion',
      ],
    },
    {
      title: 'Maintain Digital Records',
      description: 'Keep all your farm records organized and compliant with regulations.',
      icon: FileText,
      features: [
        'Log vaccinations and inspections',
        'Record sanitation activities',
        'Export reports for authorities',
        'Never lose important documentation',
      ],
    },
    {
      title: 'Stay Alert & Connected',
      description: 'Get notified about disease outbreaks and collaborate with the farming community.',
      icon: Bell,
      features: [
        'Real-time disease outbreak alerts',
        'Location-specific notifications',
        'Join community discussions',
        'Share experiences and learn from others',
      ],
    },
  ]

  const vetSteps = [
    {
      title: 'Welcome, Veterinarian!',
      description: 'Use this platform to support farmers and manage biosecurity in your region.',
      icon: '👨‍⚕️',
      features: [
        'Create and manage disease alerts',
        'Access training materials',
        'Engage with farming community',
        'Share expert guidance',
      ],
    },
    {
      title: 'Alert Management',
      description: 'Issue timely alerts to protect farms from disease outbreaks.',
      icon: Bell,
      features: [
        'Create critical disease alerts',
        'Set severity levels and location',
        'Reach farmers instantly',
        'Monitor alert engagement',
      ],
    },
    {
      title: 'Community Engagement',
      description: 'Provide expert advice and build trust with farmers.',
      icon: Users,
      features: [
        'Answer farmer questions',
        'Share best practices',
        'Post educational content',
        'Connect with other vets',
      ],
    },
  ]

  const authoritySteps = [
    {
      title: 'Welcome, Authority!',
      description: 'Access comprehensive analytics for policy-making and disease surveillance.',
      icon: '📊',
      features: [
        'View farm statistics and trends',
        'Monitor biosecurity compliance',
        'Track disease outbreaks',
        'Export data for reports',
      ],
    },
    {
      title: 'Analytics Dashboard',
      description: 'Make data-driven decisions with real-time insights.',
      icon: '📈',
      features: [
        'Risk distribution across regions',
        'Farm type statistics',
        'User engagement metrics',
        'Compliance tracking',
      ],
    },
    {
      title: 'Alert System',
      description: 'Issue system-wide alerts for critical situations.',
      icon: Bell,
      features: [
        'Create high-priority alerts',
        'Set geographical scope',
        'Monitor alert effectiveness',
        'Coordinate emergency response',
      ],
    },
  ]

  const steps = userRole === 'farmer' ? farmerSteps : userRole === 'vet' ? vetSteps : authoritySteps

  const currentStep = steps[step]
  const isLastStep = step === steps.length - 1

  const Icon = typeof currentStep.icon === 'string' ? null : currentStep.icon

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <div className="py-4">
          {/* Progress Indicator */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all ${
                  index === step
                    ? 'w-8 bg-green-600'
                    : index < step
                    ? 'w-2 bg-green-600'
                    : 'w-2 bg-gray-300'
                }`}
              />
            ))}
          </div>

          {/* Content */}
          <div className="text-center mb-8">
            {typeof currentStep.icon === 'string' ? (
              <div className="text-6xl mb-4">{currentStep.icon}</div>
            ) : Icon ? (
              <div className="flex justify-center mb-4">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                  <Icon className="w-10 h-10 text-green-600" />
                </div>
              </div>
            ) : null}

            <h2 className="text-gray-900 mb-3">{currentStep.title}</h2>
            <p className="text-gray-600 mb-6">{currentStep.description}</p>

            <div className="bg-gray-50 rounded-lg p-6 text-left">
              <ul className="space-y-3">
                {currentStep.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between gap-4">
            <Button
              variant="outline"
              onClick={() => step > 0 ? setStep(step - 1) : onClose()}
            >
              {step === 0 ? 'Skip' : 'Previous'}
            </Button>

            <Button
              onClick={() => {
                if (isLastStep) {
                  onClose()
                } else {
                  setStep(step + 1)
                }
              }}
              className="gap-2"
            >
              {isLastStep ? 'Get Started' : 'Next'}
              {!isLastStep && <ArrowRight className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}