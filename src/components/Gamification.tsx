import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'
import { Card } from './ui/card'
import { Badge } from './ui/badge'
import { Progress } from './ui/progress'
import { 
  Trophy, 
  Award, 
  Star,
  Target,
  TrendingUp,
  Zap,
  Crown,
  Medal,
  Flame
} from 'lucide-react'
import { projectId, publicAnonKey } from '../utils/supabase/info'

interface GamificationData {
  points: number
  level: number
  badges: string[]
  streak: number
  lastActivity: string | null
}

interface Badge {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  earned: boolean
}

export function Gamification() {
  const { user } = useAuth()
  const { t } = useLanguage()
  const [data, setData] = useState<GamificationData>({
    points: 0,
    level: 1,
    badges: [],
    streak: 0,
    lastActivity: null
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadGamificationData()
  }, [])

  const loadGamificationData = async () => {
    try {
      setLoading(true)
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-91b564be/gamification`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          }
        }
      )
      
      if (response.ok) {
        const result = await response.json()
        setData(result.gamification)
      }
    } catch (error) {
      console.error('Error loading gamification data:', error)
    } finally {
      setLoading(false)
    }
  }

  const allBadges: Badge[] = [
    {
      id: 'first_assessment',
      name: 'First Steps',
      description: 'Completed your first risk assessment',
      icon: <Star className="w-6 h-6" />,
      earned: data.badges.includes('first_assessment')
    },
    {
      id: 'training_complete',
      name: 'Knowledge Seeker',
      description: 'Completed 5 training modules',
      icon: <Award className="w-6 h-6" />,
      earned: data.badges.includes('training_complete')
    },
    {
      id: 'compliance_master',
      name: 'Compliance Master',
      description: 'Maintained 100% compliance for 3 months',
      icon: <Trophy className="w-6 h-6" />,
      earned: data.badges.includes('compliance_master')
    },
    {
      id: 'community_helper',
      name: 'Community Helper',
      description: 'Helped 10 farmers in the community forum',
      icon: <Medal className="w-6 h-6" />,
      earned: data.badges.includes('community_helper')
    },
    {
      id: 'streak_7',
      name: 'Week Warrior',
      description: 'Maintained a 7-day activity streak',
      icon: <Flame className="w-6 h-6" />,
      earned: data.badges.includes('streak_7')
    },
    {
      id: 'perfect_score',
      name: 'Biosecurity Expert',
      description: 'Achieved perfect risk score',
      icon: <Crown className="w-6 h-6" />,
      earned: data.badges.includes('perfect_score')
    }
  ]

  const pointsToNextLevel = (data.level * 100) - data.points
  const progressPercentage = ((data.points % 100) / 100) * 100

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-gray-900">Achievements & Progress</h2>
        <p className="text-gray-600 mt-1">Track your journey and earn rewards for good practices</p>
      </div>

      {loading ? (
        <Card className="p-8 text-center">
          <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading achievements...</p>
        </Card>
      ) : (
        <>
          {/* Level & Points Card */}
          <Card className="p-6 bg-gradient-to-br from-green-500 to-blue-600 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white/20 rounded-lg">
                  <Trophy className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-white/80">Current Level</p>
                  <p className="text-3xl">Level {data.level}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white/80">Total Points</p>
                <p className="text-3xl">{data.points}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress to Level {data.level + 1}</span>
                <span>{pointsToNextLevel} points to go</span>
              </div>
              <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Badges Earned</p>
                  <p className="text-2xl text-gray-900 mt-1">{data.badges.length}/{allBadges.length}</p>
                </div>
                <Award className="w-8 h-8 text-yellow-500" />
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Current Streak</p>
                  <p className="text-2xl text-gray-900 mt-1">{data.streak} days</p>
                </div>
                <Flame className="w-8 h-8 text-orange-500" />
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">This Month</p>
                  <p className="text-2xl text-gray-900 mt-1">{data.points % 100} pts</p>
                </div>
                <Zap className="w-8 h-8 text-blue-500" />
              </div>
            </Card>
          </div>

          {/* Badges Section */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Medal className="w-6 h-6 text-gray-700" />
              <h3 className="text-gray-900">Badge Collection</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {allBadges.map((badge) => (
                <div
                  key={badge.id}
                  className={`p-4 border-2 rounded-lg transition-all ${
                    badge.earned
                      ? 'border-yellow-400 bg-yellow-50'
                      : 'border-gray-200 bg-gray-50 opacity-60'
                  }`}
                >
                  <div className={`p-3 rounded-lg inline-block mb-3 ${
                    badge.earned ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-200 text-gray-400'
                  }`}>
                    {badge.icon}
                  </div>
                  <h4 className={badge.earned ? 'text-gray-900' : 'text-gray-500'}>
                    {badge.name}
                  </h4>
                  <p className={`text-sm mt-1 ${badge.earned ? 'text-gray-600' : 'text-gray-400'}`}>
                    {badge.description}
                  </p>
                  {badge.earned && (
                    <Badge className="mt-2 bg-yellow-400 text-yellow-900">Earned</Badge>
                  )}
                  {!badge.earned && (
                    <Badge variant="outline" className="mt-2">Locked</Badge>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* How to Earn Points */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-6 h-6 text-gray-700" />
              <h3 className="text-gray-900">How to Earn Points</h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Star className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-gray-900">Complete Risk Assessment</p>
                    <p className="text-sm text-gray-600">Evaluate your farm's biosecurity</p>
                  </div>
                </div>
                <Badge className="bg-green-600 text-white">+20 pts</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Award className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-gray-900">Complete Training Module</p>
                    <p className="text-sm text-gray-600">Learn new biosecurity practices</p>
                  </div>
                </div>
                <Badge className="bg-blue-600 text-white">+15 pts</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-gray-900">Submit Compliance Record</p>
                    <p className="text-sm text-gray-600">Document your compliance activities</p>
                  </div>
                </div>
                <Badge className="bg-purple-600 text-white">+10 pts</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <Flame className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-gray-900">Daily Activity Streak</p>
                    <p className="text-sm text-gray-600">Login and stay active</p>
                  </div>
                </div>
                <Badge className="bg-orange-600 text-white">+5 pts</Badge>
              </div>
            </div>
          </Card>
        </>
      )}
    </div>
  )
}