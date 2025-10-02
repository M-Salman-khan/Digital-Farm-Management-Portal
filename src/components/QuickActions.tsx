import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'
import { 
  Plus, 
  Activity, 
  FileText, 
  Bell, 
  MessageCircle,
  X
} from 'lucide-react'
import { Button } from './ui/button'

interface QuickActionsProps {
  onAction: (action: string) => void
}

export function QuickActions({ onAction }: QuickActionsProps) {
  const { user } = useAuth()
  const { t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)

  if (!user || user.role !== 'farmer') return null

  const actions = [
    {
      id: 'assessment',
      label: 'New Assessment',
      icon: Activity,
      color: 'bg-blue-500 hover:bg-blue-600',
      view: 'risk',
    },
    {
      id: 'compliance',
      label: 'Add Record',
      icon: FileText,
      color: 'bg-green-500 hover:bg-green-600',
      view: 'compliance',
    },
    {
      id: 'alerts',
      label: 'View Alerts',
      icon: Bell,
      color: 'bg-red-500 hover:bg-red-600',
      view: 'alerts',
    },
    {
      id: 'community',
      label: 'Ask Question',
      icon: MessageCircle,
      color: 'bg-purple-500 hover:bg-purple-600',
      view: 'community',
    },
  ]

  return (
    <div className="fixed bottom-6 right-6 z-50 lg:hidden">
      {/* Action Buttons */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 flex flex-col gap-3 mb-2">
          {actions.map((action) => {
            const Icon = action.icon
            return (
              <button
                key={action.id}
                onClick={() => {
                  onAction(action.view)
                  setIsOpen(false)
                }}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-full shadow-lg text-white
                  ${action.color} transition-all transform hover:scale-105
                `}
                style={{ animation: 'slideUp 0.3s ease-out' }}
              >
                <Icon className="w-5 h-5" />
                <span className="pr-2">{action.label}</span>
              </button>
            )
          })}
        </div>
      )}

      {/* Main FAB */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-14 h-14 rounded-full shadow-lg flex items-center justify-center
          transition-all transform
          ${isOpen 
            ? 'bg-gray-600 hover:bg-gray-700 rotate-45' 
            : 'bg-green-600 hover:bg-green-700'
          }
        `}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <Plus className="w-6 h-6 text-white" />
        )}
      </button>

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}