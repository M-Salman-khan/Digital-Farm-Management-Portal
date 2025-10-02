import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { localAuth } from '../utils/local-storage'

interface User {
  id: string
  email: string
  name: string
  role: 'farmer' | 'vet' | 'authority'
  farmType?: 'pig' | 'poultry' | 'both'
  location?: string
  language?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  register: (data: any) => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      const currentUser = localAuth.getCurrentUser()
      setUser(currentUser)
    } catch (error) {
      console.error('Error checking user:', error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const user = localAuth.login(email, password)
      setUser(user)
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  const logout = async () => {
    localAuth.logout()
    setUser(null)
  }

  const register = async (data: any) => {
    try {
      const newUser = localAuth.register(data)
      setUser(newUser)
    } catch (error) {
      console.error('Registration error:', error)
      throw error
    }
  }

  const refreshProfile = async () => {
    const currentUser = localAuth.getCurrentUser()
    setUser(currentUser)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
