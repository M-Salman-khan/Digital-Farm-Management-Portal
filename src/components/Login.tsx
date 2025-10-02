import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Card } from './ui/card'
import { Select } from './ui/select'
import { AlertCircle } from 'lucide-react'

interface LoginProps {
  onToggle: () => void
}

export function Login({ onToggle }: LoginProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const { t, language, setLanguage } = useLanguage()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(email, password)
    } catch (err: any) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <Card className="w-full max-w-md p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-green-600">{t('appName')}</h1>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as any)}
            className="px-3 py-1 border border-gray-300 rounded-md"
          >
            <option value="en">English</option>
            <option value="hi">हिंदी</option>
            <option value="ta">தமிழ்</option>
            <option value="te">తెలుగు</option>
            <option value="bn">বাংলা</option>
            <option value="pa">ਪੰਜਾਬੀ</option>
          </select>
        </div>

        <h2 className="mb-6 text-gray-700">{t('login')}</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2 text-red-700">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">{t('email')}</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="farmer@example.com"
            />
          </div>

          <div>
            <Label htmlFor="password">{t('password')}</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? t('loading') : t('login')}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={onToggle}
            className="text-green-600 hover:text-green-700"
          >
            {t('register')}
          </button>
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md text-sm">
          <p className="mb-2">Demo Accounts:</p>
          <p className="text-gray-600">Farmer: farmer@example.com / password123</p>
          <p className="text-gray-600">Vet: vet@example.com / password123</p>
          <p className="text-gray-600">Authority: authority@example.com / password123</p>
        </div>
      </Card>
    </div>
  )
}