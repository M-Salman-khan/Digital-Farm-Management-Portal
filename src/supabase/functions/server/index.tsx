import { Hono } from 'npm:hono'
import { cors } from 'npm:hono/cors'
import { logger } from 'npm:hono/logger'
import { createClient } from 'npm:@supabase/supabase-js@2'
import * as kv from './kv_store.tsx'

const app = new Hono()

app.use('*', cors())
app.use('*', logger(console.log))

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
)

// User Registration
app.post('/make-server-91b564be/signup', async (c) => {
  try {
    const { email, password, name, role, farmType, location, language } = await c.req.json()
    
    // Create user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name, role },
      email_confirm: true // Auto-confirm email since email server hasn't been configured
    })

    if (authError) {
      console.log('Auth error during signup:', authError)
      return c.json({ error: authError.message }, 400)
    }

    // Store user profile in KV
    const userId = authData.user.id
    const profile = {
      userId,
      name,
      email,
      role, // 'farmer', 'vet', 'authority'
      farmType, // 'pig', 'poultry', 'both'
      location,
      language,
      createdAt: new Date().toISOString()
    }

    await kv.set(`user:${userId}:profile`, profile)
    
    return c.json({ success: true, userId, message: 'User created successfully' })
  } catch (error) {
    console.log('Error during signup:', error)
    return c.json({ error: 'Signup failed: ' + error.message }, 500)
  }
})

// Get User Profile
app.get('/make-server-91b564be/profile', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const profile = await kv.get(`user:${user.id}:profile`)
    if (!profile) {
      return c.json({ error: 'Profile not found' }, 404)
    }

    return c.json({ profile })
  } catch (error) {
    console.log('Error fetching profile:', error)
    return c.json({ error: 'Failed to fetch profile: ' + error.message }, 500)
  }
})

// Update User Profile
app.put('/make-server-91b564be/profile', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const updates = await c.req.json()
    const existingProfile = await kv.get(`user:${user.id}:profile`)
    
    const updatedProfile = { ...existingProfile, ...updates, updatedAt: new Date().toISOString() }
    await kv.set(`user:${user.id}:profile`, updatedProfile)

    return c.json({ success: true, profile: updatedProfile })
  } catch (error) {
    console.log('Error updating profile:', error)
    return c.json({ error: 'Failed to update profile: ' + error.message }, 500)
  }
})

// Submit Risk Assessment
app.post('/make-server-91b564be/risk-assessment', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const assessment = await c.req.json()
    const assessmentId = `${user.id}_${Date.now()}`
    
    // Calculate risk score
    const score = calculateRiskScore(assessment.responses)
    const riskLevel = getRiskLevel(score)
    
    const assessmentData = {
      id: assessmentId,
      userId: user.id,
      farmType: assessment.farmType,
      responses: assessment.responses,
      score,
      riskLevel,
      timestamp: new Date().toISOString()
    }

    // Store assessment
    await kv.set(`assessment:${assessmentId}`, assessmentData)
    
    // Get user's assessments list
    const userAssessments = await kv.get(`user:${user.id}:assessments`) || []
    userAssessments.push(assessmentId)
    await kv.set(`user:${user.id}:assessments`, userAssessments)

    return c.json({ success: true, assessment: assessmentData })
  } catch (error) {
    console.log('Error submitting assessment:', error)
    return c.json({ error: 'Failed to submit assessment: ' + error.message }, 500)
  }
})

// Get User Assessments
app.get('/make-server-91b564be/risk-assessments', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const assessmentIds = await kv.get(`user:${user.id}:assessments`) || []
    const assessments = []
    
    for (const id of assessmentIds) {
      const assessment = await kv.get(`assessment:${id}`)
      if (assessment) assessments.push(assessment)
    }

    return c.json({ assessments: assessments.reverse() })
  } catch (error) {
    console.log('Error fetching assessments:', error)
    return c.json({ error: 'Failed to fetch assessments: ' + error.message }, 500)
  }
})

// Add Compliance Record
app.post('/make-server-91b564be/compliance', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const record = await c.req.json()
    const recordId = `${user.id}_${Date.now()}`
    
    const complianceRecord = {
      id: recordId,
      userId: user.id,
      type: record.type, // 'vaccination', 'inspection', 'sanitation'
      date: record.date,
      details: record.details,
      attachments: record.attachments || [],
      timestamp: new Date().toISOString()
    }

    await kv.set(`compliance:${recordId}`, complianceRecord)
    
    const userRecords = await kv.get(`user:${user.id}:compliance`) || []
    userRecords.push(recordId)
    await kv.set(`user:${user.id}:compliance`, userRecords)

    return c.json({ success: true, record: complianceRecord })
  } catch (error) {
    console.log('Error adding compliance record:', error)
    return c.json({ error: 'Failed to add compliance record: ' + error.message }, 500)
  }
})

// Get Compliance Records
app.get('/make-server-91b564be/compliance', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const recordIds = await kv.get(`user:${user.id}:compliance`) || []
    const records = []
    
    for (const id of recordIds) {
      const record = await kv.get(`compliance:${id}`)
      if (record) records.push(record)
    }

    return c.json({ records: records.reverse() })
  } catch (error) {
    console.log('Error fetching compliance records:', error)
    return c.json({ error: 'Failed to fetch compliance records: ' + error.message }, 500)
  }
})

// Create Alert (Admin/Vet only)
app.post('/make-server-91b564be/alerts', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const profile = await kv.get(`user:${user.id}:profile`)
    if (profile.role !== 'vet' && profile.role !== 'authority') {
      return c.json({ error: 'Forbidden: Only vets and authorities can create alerts' }, 403)
    }

    const alert = await c.req.json()
    const alertId = `alert_${Date.now()}`
    
    const alertData = {
      id: alertId,
      title: alert.title,
      description: alert.description,
      severity: alert.severity, // 'low', 'medium', 'high', 'critical'
      location: alert.location,
      farmType: alert.farmType,
      createdBy: user.id,
      timestamp: new Date().toISOString(),
      active: true
    }

    await kv.set(`alert:${alertId}`, alertData)
    
    const activeAlerts = await kv.get('alerts:active') || []
    activeAlerts.push(alertId)
    await kv.set('alerts:active', activeAlerts)

    return c.json({ success: true, alert: alertData })
  } catch (error) {
    console.log('Error creating alert:', error)
    return c.json({ error: 'Failed to create alert: ' + error.message }, 500)
  }
})

// Get Active Alerts
app.get('/make-server-91b564be/alerts', async (c) => {
  try {
    const alertIds = await kv.get('alerts:active') || []
    const alerts = []
    
    for (const id of alertIds) {
      const alert = await kv.get(`alert:${id}`)
      if (alert && alert.active) alerts.push(alert)
    }

    return c.json({ alerts: alerts.reverse() })
  } catch (error) {
    console.log('Error fetching alerts:', error)
    return c.json({ error: 'Failed to fetch alerts: ' + error.message }, 500)
  }
})

// Update Training Progress
app.post('/make-server-91b564be/training/progress', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const { moduleId, completed, quizScore } = await c.req.json()
    
    const progress = await kv.get(`user:${user.id}:training`) || {}
    progress[moduleId] = {
      completed,
      quizScore,
      completedAt: new Date().toISOString()
    }
    
    await kv.set(`user:${user.id}:training`, progress)

    return c.json({ success: true, progress })
  } catch (error) {
    console.log('Error updating training progress:', error)
    return c.json({ error: 'Failed to update training progress: ' + error.message }, 500)
  }
})

// Get Training Progress
app.get('/make-server-91b564be/training/progress', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const progress = await kv.get(`user:${user.id}:training`) || {}
    return c.json({ progress })
  } catch (error) {
    console.log('Error fetching training progress:', error)
    return c.json({ error: 'Failed to fetch training progress: ' + error.message }, 500)
  }
})

// Community Forum - Create Post
app.post('/make-server-91b564be/community/posts', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const { title, content, category } = await c.req.json()
    const postId = `post_${Date.now()}`
    const profile = await kv.get(`user:${user.id}:profile`)
    
    const post = {
      id: postId,
      userId: user.id,
      authorName: profile.name,
      authorRole: profile.role,
      title,
      content,
      category,
      timestamp: new Date().toISOString(),
      replies: []
    }

    await kv.set(`community:post:${postId}`, post)
    
    const allPosts = await kv.get('community:posts:all') || []
    allPosts.push(postId)
    await kv.set('community:posts:all', allPosts)

    return c.json({ success: true, post })
  } catch (error) {
    console.log('Error creating post:', error)
    return c.json({ error: 'Failed to create post: ' + error.message }, 500)
  }
})

// Community Forum - Get Posts
app.get('/make-server-91b564be/community/posts', async (c) => {
  try {
    const postIds = await kv.get('community:posts:all') || []
    const posts = []
    
    for (const id of postIds) {
      const post = await kv.get(`community:post:${id}`)
      if (post) posts.push(post)
    }

    return c.json({ posts: posts.reverse() })
  } catch (error) {
    console.log('Error fetching posts:', error)
    return c.json({ error: 'Failed to fetch posts: ' + error.message }, 500)
  }
})

// Analytics Dashboard (Admin/Authority)
app.get('/make-server-91b564be/analytics', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const profile = await kv.get(`user:${user.id}:profile`)
    if (profile.role !== 'authority') {
      return c.json({ error: 'Forbidden: Only authorities can access analytics' }, 403)
    }

    // Aggregate data from KV store
    const allUsers = await kv.getByPrefix('user:')
    const allAssessments = await kv.getByPrefix('assessment:')
    const allAlerts = await kv.getByPrefix('alert:')
    
    const analytics = {
      totalUsers: allUsers.filter(u => u.key.includes(':profile')).length,
      totalAssessments: allAssessments.length,
      activeAlerts: allAlerts.filter(a => a.value?.active).length,
      riskDistribution: calculateRiskDistribution(allAssessments),
      farmTypeDistribution: calculateFarmTypeDistribution(allUsers),
      timestamp: new Date().toISOString()
    }

    return c.json({ analytics })
  } catch (error) {
    console.log('Error fetching analytics:', error)
    return c.json({ error: 'Failed to fetch analytics: ' + error.message }, 500)
  }
})

// Health Records Routes
app.get('/make-server-91b564be/health-records', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const recordIds = await kv.get(`user:${user.id}:health-records`) || []
    const records = []
    
    for (const id of recordIds) {
      const record = await kv.get(`health-record:${id}`)
      if (record) records.push(record)
    }

    return c.json({ records: records.reverse() })
  } catch (error) {
    console.log('Error fetching health records:', error)
    return c.json({ error: 'Failed to fetch health records: ' + error.message }, 500)
  }
})

app.post('/make-server-91b564be/health-records', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const record = await c.req.json()
    const recordId = `${user.id}_${record.id}`
    
    await kv.set(`health-record:${recordId}`, record)
    
    const userRecords = await kv.get(`user:${user.id}:health-records`) || []
    userRecords.push(recordId)
    await kv.set(`user:${user.id}:health-records`, userRecords)

    return c.json({ success: true, record })
  } catch (error) {
    console.log('Error adding health record:', error)
    return c.json({ error: 'Failed to add health record: ' + error.message }, 500)
  }
})

// Finance Tracker Routes
app.get('/make-server-91b564be/finance', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const transactionIds = await kv.get(`user:${user.id}:transactions`) || []
    const transactions = []
    
    for (const id of transactionIds) {
      const transaction = await kv.get(`transaction:${id}`)
      if (transaction) transactions.push(transaction)
    }

    return c.json({ transactions: transactions.reverse() })
  } catch (error) {
    console.log('Error fetching transactions:', error)
    return c.json({ error: 'Failed to fetch transactions: ' + error.message }, 500)
  }
})

app.post('/make-server-91b564be/finance', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const transaction = await c.req.json()
    const transactionId = `${user.id}_${transaction.id}`
    
    await kv.set(`transaction:${transactionId}`, transaction)
    
    const userTransactions = await kv.get(`user:${user.id}:transactions`) || []
    userTransactions.push(transactionId)
    await kv.set(`user:${user.id}:transactions`, userTransactions)

    return c.json({ success: true, transaction })
  } catch (error) {
    console.log('Error adding transaction:', error)
    return c.json({ error: 'Failed to add transaction: ' + error.message }, 500)
  }
})

// Gamification Routes
app.get('/make-server-91b564be/gamification', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const gamification = await kv.get(`user:${user.id}:gamification`) || {
      points: 0,
      level: 1,
      badges: [],
      streak: 0,
      lastActivity: null
    }

    return c.json({ gamification })
  } catch (error) {
    console.log('Error fetching gamification data:', error)
    return c.json({ error: 'Failed to fetch gamification data: ' + error.message }, 500)
  }
})

app.post('/make-server-91b564be/gamification/award', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const { points, badge } = await c.req.json()
    
    const gamification = await kv.get(`user:${user.id}:gamification`) || {
      points: 0,
      level: 1,
      badges: [],
      streak: 0,
      lastActivity: null
    }

    gamification.points += points || 0
    gamification.level = Math.floor(gamification.points / 100) + 1
    
    if (badge && !gamification.badges.includes(badge)) {
      gamification.badges.push(badge)
    }

    gamification.lastActivity = new Date().toISOString()
    
    await kv.set(`user:${user.id}:gamification`, gamification)

    return c.json({ success: true, gamification })
  } catch (error) {
    console.log('Error updating gamification:', error)
    return c.json({ error: 'Failed to update gamification: ' + error.message }, 500)
  }
})

// Helper Functions
function calculateRiskScore(responses: any): number {
  let score = 0
  const maxScore = Object.keys(responses).length * 10
  
  for (const [key, value] of Object.entries(responses)) {
    if (typeof value === 'boolean') {
      score += value ? 10 : 0
    } else if (typeof value === 'number') {
      score += value
    }
  }
  
  return Math.round((score / maxScore) * 100)
}

function getRiskLevel(score: number): string {
  if (score >= 80) return 'low'
  if (score >= 50) return 'medium'
  return 'high'
}

function calculateRiskDistribution(assessments: any[]): any {
  const distribution = { low: 0, medium: 0, high: 0 }
  assessments.forEach(a => {
    const level = a.value?.riskLevel
    if (level) distribution[level]++
  })
  return distribution
}

function calculateFarmTypeDistribution(users: any[]): any {
  const distribution = { pig: 0, poultry: 0, both: 0 }
  users.forEach(u => {
    const farmType = u.value?.farmType
    if (farmType) distribution[farmType]++
  })
  return distribution
}

Deno.serve(app.fetch)