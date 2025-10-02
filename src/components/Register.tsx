import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Card } from './ui/card'
import { AlertCircle } from 'lucide-react'

interface RegisterProps {
  onToggle: () => void
}

export function Register({ onToggle }: RegisterProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'farmer',
    farmType: 'poultry',
    location: '',
    language: 'en',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const { t, language, setLanguage } = useLanguage()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await register(formData)
    } catch (err: any) {
      setError(err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <Card className="w-full max-w-md p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-green-600">{t('appName')}</h1>
          <select
            value={language}
            onChange={(e) => {
              const lang = e.target.value as any
              setLanguage(lang)
              handleChange('language', lang)
            }}
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

        <h2 className="mb-6 text-gray-700">{t('register')}</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2 text-red-700">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">{t('name')}</Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="email">{t('email')}</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="password">{t('password')}</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              required
              minLength={6}
            />
          </div>

          <div>
            <Label htmlFor="role">{t('role')}</Label>
            <select
              id="role"
              value={formData.role}
              onChange={(e) => handleChange('role', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            >
              <option value="farmer">{t('farmer')}</option>
              <option value="vet">{t('vet')}</option>
              <option value="authority">{t('authority')}</option>
            </select>
          </div>

          {formData.role === 'farmer' && (
            <div>
              <Label htmlFor="farmType">{t('farmType')}</Label>
              <select
                id="farmType"
                value={formData.farmType}
                onChange={(e) => handleChange('farmType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              >
                <option value="pig">{t('pig')}</option>
                <option value="poultry">{t('poultry')}</option>
                <option value="both">{t('both')}</option>
              </select>
            </div>
          )}

          <div>
            <Label htmlFor="location">{t('location')}</Label>
            <Input
              id="location"
              type="text"
              value={formData.location}
              onChange={(e) => handleChange('location', e.target.value)}
              placeholder="City, State"
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? t('loading') : t('register')}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={onToggle}
            className="text-green-600 hover:text-green-700"
          >
            {t('login')}
          </button>
        </div>
      </Card>
    </div>
  )
}