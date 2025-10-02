import React, { useState, useEffect } from 'react'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { LanguageProvider, useLanguage } from './contexts/LanguageContext'
import { ThemeProvider, useTheme } from './contexts/ThemeContext'
import { Login } from './components/Login'
import { Register } from './components/Register'
import { Dashboard } from './components/Dashboard'
import { RiskAssessment } from './components/RiskAssessment'
import { Training } from './components/Training'
import { Compliance } from './components/Compliance'
import { Alerts } from './components/Alerts'
import { Community } from './components/Community'
import { AdminDashboard } from './components/AdminDashboard'
import { WelcomeGuide } from './components/WelcomeGuide'
import { QuickActions } from './components/QuickActions'
import { HealthRecords } from './components/HealthRecords'
import { FinanceTracker } from './components/FinanceTracker'
import { FeedCalculator } from './components/FeedCalculator'
import { Gamification } from './components/Gamification'
import { EmergencySOS } from './components/EmergencySOS'
import { 
  LayoutDashboard, 
  Activity, 
  GraduationCap, 
  FileText, 
  Bell, 
  Users, 
  User,
  LogOut,
  Menu,
  X,
  BarChart3,
  Heart,
  DollarSign,
  Calculator,
  Trophy,
  Moon,
  Sun
} from 'lucide-react'

function AppContent() {
  const { user, logout, loading } = useAuth()
  const { t, language, setLanguage } = useLanguage()
  const { theme, toggleTheme } = useTheme()
  const [showRegister, setShowRegister] = useState(false)
  const [currentView, setCurrentView] = useState('dashboard')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showWelcome, setShowWelcome] = useState(false)

  useEffect(() => {
    if (user) {
      // Check if user has seen welcome guide
      const hasSeenWelcome = localStorage.getItem(`welcome_seen_${user.id}`)
      if (!hasSeenWelcome) {
        setShowWelcome(true)
      }
    }
  }, [user])

  const handleWelcomeClose = () => {
    setShowWelcome(false)
    if (user) {
      localStorage.setItem(`welcome_seen_${user.id}`, 'true')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">{t('loading')}</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return showRegister ? (
      <Register onToggle={() => setShowRegister(false)} />
    ) : (
      <Login onToggle={() => setShowRegister(true)} />
    )
  }

  const menuItems = [
    { id: 'dashboard', label: t('dashboard'), icon: LayoutDashboard, roles: ['farmer', 'vet', 'authority'] },
    { id: 'risk', label: t('riskAssessment'), icon: Activity, roles: ['farmer'] },
    { id: 'health', label: 'Health Records', icon: Heart, roles: ['farmer'] },
    { id: 'finance', label: 'Finance Tracker', icon: DollarSign, roles: ['farmer'] },
    { id: 'feed', label: 'Feed Calculator', icon: Calculator, roles: ['farmer'] },
    { id: 'training', label: t('training'), icon: GraduationCap, roles: ['farmer', 'vet'] },
    { id: 'compliance', label: t('compliance'), icon: FileText, roles: ['farmer'] },
    { id: 'alerts', label: t('alerts'), icon: Bell, roles: ['farmer', 'vet', 'authority'] },
    { id: 'community', label: t('community'), icon: Users, roles: ['farmer', 'vet', 'authority'] },
    { id: 'achievements', label: 'Achievements', icon: Trophy, roles: ['farmer', 'vet'] },
    { id: 'analytics', label: t('analytics'), icon: BarChart3, roles: ['authority'] },
  ]

  const visibleMenuItems = menuItems.filter(item => item.roles.includes(user.role))

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />
      case 'risk':
        return <RiskAssessment />
      case 'health':
        return <HealthRecords />
      case 'finance':
        return <FinanceTracker />
      case 'feed':
        return <FeedCalculator />
      case 'training':
        return <Training />
      case 'compliance':
        return <Compliance />
      case 'alerts':
        return <Alerts />
      case 'community':
        return <Community />
      case 'achievements':
        return <Gamification />
      case 'analytics':
        return <AdminDashboard />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Top Navigation Bar */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                {mobileMenuOpen ? <X className="w-6 h-6 dark:text-gray-200" /> : <Menu className="w-6 h-6 dark:text-gray-200" />}
              </button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white">🌾</span>
                </div>
                <h1 className="text-green-600 dark:text-green-400 hidden sm:block">{t('appName')}</h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
              >
                {theme === 'light' ? (
                  <Moon className="w-5 h-5 text-gray-600" />
                ) : (
                  <Sun className="w-5 h-5 text-yellow-500" />
                )}
              </button>

              {/* Language Selector */}
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 dark:text-gray-200"
              >
                <option value="en">EN</option>
                <option value="hi">हि</option>
                <option value="ta">த</option>
                <option value="te">తె</option>
                <option value="bn">বা</option>
                <option value="pa">ਪੰ</option>
              </select>

              {/* User Menu */}
              <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <User className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                <span className="hidden sm:inline text-sm text-gray-700 dark:text-gray-200">{user.name}</span>
              </div>

              <button
                onClick={logout}
                className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-red-600 dark:text-red-400"
                title={t('logout')}
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Side Navigation */}
        <aside className={`
          fixed lg:static inset-y-0 left-0 z-30
          w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700
          transform transition-transform duration-200 ease-in-out
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          mt-[57px] lg:mt-0
        `}>
          <nav className="p-4 space-y-1 h-full overflow-y-auto">
            {visibleMenuItems.map((item) => {
              const Icon = item.icon
              const isActive = currentView === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentView(item.id)
                    setMobileMenuOpen(false)
                  }}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                    ${isActive 
                      ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              )
            })}

            {/* Profile Section */}
            <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t('role')}</p>
                <p className="text-gray-900 dark:text-gray-100 capitalize">{t(user.role)}</p>
                {user.farmType && (
                  <>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 mb-1">{t('farmType')}</p>
                    <p className="text-gray-900 dark:text-gray-100">{t(user.farmType)}</p>
                  </>
                )}
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 mb-1">{t('location')}</p>
                <p className="text-gray-900 dark:text-gray-100">{user.location}</p>
              </div>
            </div>
          </nav>
        </aside>

        {/* Mobile Overlay */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {renderView()}
          </div>
        </main>
      </div>

      {/* Welcome Guide */}
      <WelcomeGuide 
        isOpen={showWelcome} 
        onClose={handleWelcomeClose}
        userRole={user.role}
      />

      {/* Emergency SOS Button */}
      <EmergencySOS />
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <LanguageProvider>
          <AppContent />
        </LanguageProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}