// Local Storage utility for managing application data without Supabase

interface StorageData {
  users: any[]
  currentUser: any | null
  assessments: any[]
  alerts: any[]
  compliance: any[]
  community: any[]
  training: any[]
  healthRecords: any[]
  finance: any[]
  gamification: any
}

const STORAGE_KEY = 'farm_management_data'

// Initialize storage with demo data
const defaultData: StorageData = {
  users: [
    {
      id: '1',
      email: 'farmer@example.com',
      password: 'password123',
      name: 'Rajesh Kumar',
      role: 'farmer',
      farmType: 'poultry',
      location: 'Bangalore, Karnataka',
      language: 'en',
    },
    {
      id: '2',
      email: 'vet@example.com',
      password: 'password123',
      name: 'Dr. Priya Sharma',
      role: 'vet',
      location: 'Mumbai, Maharashtra',
      language: 'en',
    },
    {
      id: '3',
      email: 'authority@example.com',
      password: 'password123',
      name: 'Vikram Singh',
      role: 'authority',
      location: 'New Delhi',
      language: 'en',
    },
  ],
  currentUser: null,
  assessments: [],
  alerts: [
    {
      id: '1',
      title: 'African Swine Fever Alert - High Risk',
      description: 'Multiple cases of African Swine Fever detected in nearby districts. All pig farmers should implement strict biosecurity measures immediately.',
      severity: 'critical',
      location: 'Karnataka, Bangalore Rural',
      farmType: 'pig',
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      title: 'Avian Influenza H5N1 Surveillance',
      description: 'Low pathogenic avian influenza detected in wild birds. Poultry farmers advised to prevent contact between domestic birds and wild birds.',
      severity: 'medium',
      location: 'Kerala, Kottayam',
      farmType: 'poultry',
      createdAt: new Date().toISOString(),
    },
    {
      id: '3',
      title: 'Newcastle Disease Outbreak',
      description: 'Newcastle disease confirmed in backyard poultry in the region. Commercial poultry farms should strengthen biosecurity.',
      severity: 'high',
      location: 'Tamil Nadu, Coimbatore',
      farmType: 'poultry',
      createdAt: new Date().toISOString(),
    },
  ],
  compliance: [
    {
      id: '1',
      userId: '1',
      type: 'vaccination',
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      details: 'Administered Newcastle Disease vaccine to all birds (500 birds total).',
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '2',
      userId: '1',
      type: 'inspection',
      date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      details: 'Quarterly biosecurity inspection completed. All entry points secured.',
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ],
  community: [
    {
      id: '1',
      userId: '1',
      userName: 'Rajesh Kumar',
      title: 'Best practices for footbath maintenance?',
      content: 'I have set up footbaths at all entry points, but I am not sure how often to change the disinfectant solution.',
      category: 'diseaseControl',
      likes: 12,
      replies: 5,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '2',
      userId: '1',
      userName: 'Rajesh Kumar',
      title: 'Successful implementation of all-in-all-out system',
      content: 'After attending the training module, I implemented the all-in-all-out system. Mortality has reduced by 30%!',
      category: 'general',
      likes: 25,
      replies: 8,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ],
  training: [],
  healthRecords: [],
  finance: [],
  gamification: {
    points: 0,
    level: 1,
    badges: [],
    achievements: [],
  },
}

// Get data from localStorage
function getData(): StorageData {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error('Error reading from localStorage:', error)
  }
  return { ...defaultData }
}

// Save data to localStorage
function saveData(data: StorageData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (error) {
    console.error('Error saving to localStorage:', error)
  }
}

// Generate unique ID
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// Auth functions
export const localAuth = {
  login: (email: string, password: string) => {
    const data = getData()
    const user = data.users.find(u => u.email === email && u.password === password)
    if (!user) {
      throw new Error('Invalid email or password')
    }
    const { password: _, ...userWithoutPassword } = user
    data.currentUser = userWithoutPassword
    saveData(data)
    return userWithoutPassword
  },

  register: (userData: any) => {
    const data = getData()
    
    // Check if user already exists
    if (data.users.find(u => u.email === userData.email)) {
      throw new Error('User with this email already exists')
    }

    const newUser = {
      id: generateId(),
      ...userData,
    }
    
    data.users.push(newUser)
    const { password: _, ...userWithoutPassword } = newUser
    data.currentUser = userWithoutPassword
    saveData(data)
    return userWithoutPassword
  },

  logout: () => {
    const data = getData()
    data.currentUser = null
    saveData(data)
  },

  getCurrentUser: () => {
    const data = getData()
    return data.currentUser
  },
}

// Risk Assessment functions
export const localAssessments = {
  getAll: (userId: string) => {
    const data = getData()
    return data.assessments.filter(a => a.userId === userId)
  },

  create: (userId: string, assessment: any) => {
    const data = getData()
    const newAssessment = {
      id: generateId(),
      userId,
      ...assessment,
      createdAt: new Date().toISOString(),
    }
    data.assessments.push(newAssessment)
    saveData(data)
    return newAssessment
  },
}

// Alerts functions
export const localAlerts = {
  getAll: () => {
    const data = getData()
    return data.alerts
  },

  create: (alert: any) => {
    const data = getData()
    const newAlert = {
      id: generateId(),
      ...alert,
      createdAt: new Date().toISOString(),
    }
    data.alerts.unshift(newAlert)
    saveData(data)
    return newAlert
  },
}

// Compliance functions
export const localCompliance = {
  getAll: (userId: string) => {
    const data = getData()
    return data.compliance.filter(c => c.userId === userId)
  },

  create: (userId: string, record: any) => {
    const data = getData()
    const newRecord = {
      id: generateId(),
      userId,
      ...record,
      createdAt: new Date().toISOString(),
    }
    data.compliance.push(newRecord)
    saveData(data)
    return newRecord
  },
}

// Community functions
export const localCommunity = {
  getAll: () => {
    const data = getData()
    return data.community.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  },

  create: (userId: string, userName: string, post: any) => {
    const data = getData()
    const newPost = {
      id: generateId(),
      userId,
      userName,
      ...post,
      likes: 0,
      replies: 0,
      createdAt: new Date().toISOString(),
    }
    data.community.unshift(newPost)
    saveData(data)
    return newPost
  },
}

// Training functions
export const localTraining = {
  getProgress: (userId: string) => {
    const data = getData()
    return data.training.filter(t => t.userId === userId)
  },

  saveProgress: (userId: string, moduleId: string, completed: boolean) => {
    const data = getData()
    const existing = data.training.findIndex(
      t => t.userId === userId && t.moduleId === moduleId
    )
    
    if (existing >= 0) {
      data.training[existing].completed = completed
      data.training[existing].updatedAt = new Date().toISOString()
    } else {
      data.training.push({
        id: generateId(),
        userId,
        moduleId,
        completed,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
    }
    
    saveData(data)
    return data.training.filter(t => t.userId === userId)
  },
}

// Health Records functions
export const localHealthRecords = {
  getAll: (userId: string) => {
    const data = getData()
    return data.healthRecords.filter(r => r.userId === userId)
  },

  create: (userId: string, record: any) => {
    const data = getData()
    const newRecord = {
      id: generateId(),
      userId,
      ...record,
      createdAt: new Date().toISOString(),
    }
    data.healthRecords.push(newRecord)
    saveData(data)
    return newRecord
  },

  update: (recordId: string, updates: any) => {
    const data = getData()
    const index = data.healthRecords.findIndex(r => r.id === recordId)
    if (index >= 0) {
      data.healthRecords[index] = {
        ...data.healthRecords[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      }
      saveData(data)
      return data.healthRecords[index]
    }
    return null
  },

  delete: (recordId: string) => {
    const data = getData()
    data.healthRecords = data.healthRecords.filter(r => r.id !== recordId)
    saveData(data)
  },
}

// Finance functions
export const localFinance = {
  getAll: (userId: string) => {
    const data = getData()
    return data.finance.filter(t => t.userId === userId)
  },

  create: (userId: string, transaction: any) => {
    const data = getData()
    const newTransaction = {
      id: generateId(),
      userId,
      ...transaction,
      createdAt: new Date().toISOString(),
    }
    data.finance.push(newTransaction)
    saveData(data)
    return newTransaction
  },

  delete: (transactionId: string) => {
    const data = getData()
    data.finance = data.finance.filter(t => t.id !== transactionId)
    saveData(data)
  },
}

// Gamification functions
export const localGamification = {
  get: (userId: string) => {
    const data = getData()
    // Store gamification data per user
    const key = `gamification_${userId}`
    const stored = localStorage.getItem(key)
    if (stored) {
      return JSON.parse(stored)
    }
    return {
      points: 0,
      level: 1,
      badges: [],
      achievements: [],
    }
  },

  update: (userId: string, gamificationData: any) => {
    const key = `gamification_${userId}`
    localStorage.setItem(key, JSON.stringify(gamificationData))
    return gamificationData
  },

  addPoints: (userId: string, points: number) => {
    const current = localGamification.get(userId)
    const updated = {
      ...current,
      points: current.points + points,
      level: Math.floor((current.points + points) / 100) + 1,
    }
    return localGamification.update(userId, updated)
  },

  unlockBadge: (userId: string, badge: any) => {
    const current = localGamification.get(userId)
    if (!current.badges.find((b: any) => b.id === badge.id)) {
      const updated = {
        ...current,
        badges: [...current.badges, badge],
      }
      return localGamification.update(userId, updated)
    }
    return current
  },
}

// Analytics functions (for admin)
export const localAnalytics = {
  get: () => {
    const data = getData()
    return {
      totalUsers: data.users.length,
      totalAssessments: data.assessments.length,
      activeAlerts: data.alerts.length,
      riskDistribution: {
        low: data.assessments.filter(a => a.riskScore < 40).length,
        medium: data.assessments.filter(a => a.riskScore >= 40 && a.riskScore < 70).length,
        high: data.assessments.filter(a => a.riskScore >= 70).length,
      },
      farmTypeDistribution: {
        pig: data.users.filter(u => u.farmType === 'pig').length,
        poultry: data.users.filter(u => u.farmType === 'poultry').length,
        both: data.users.filter(u => u.farmType === 'both').length,
      },
    }
  },
}

// Initialize storage on first load
if (!localStorage.getItem(STORAGE_KEY)) {
  saveData(defaultData)
}
