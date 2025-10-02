import React, { useState } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Badge } from './ui/badge'
import { 
  Calculator,
  Wheat,
  Scale,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react'

interface FeedRecommendation {
  dailyFeed: number
  weeklyFeed: number
  monthlyFeed: number
  feedType: string
  cost: number
  tips: string[]
}

export function FeedCalculator() {
  const { t } = useLanguage()
  const [animalType, setAnimalType] = useState<'poultry' | 'pig'>('poultry')
  const [animalCount, setAnimalCount] = useState('')
  const [averageWeight, setAverageWeight] = useState('')
  const [ageWeeks, setAgeWeeks] = useState('')
  const [growthStage, setGrowthStage] = useState<'starter' | 'grower' | 'finisher'>('grower')
  const [recommendation, setRecommendation] = useState<FeedRecommendation | null>(null)

  const calculateFeed = () => {
    const count = parseInt(animalCount)
    const weight = parseFloat(averageWeight)
    const age = parseInt(ageWeeks)

    if (!count || !weight || !age) return

    let dailyFeedPerAnimal = 0
    let feedType = ''
    let costPerKg = 0
    let tips: string[] = []

    if (animalType === 'poultry') {
      // Poultry feed calculation based on age and stage
      if (growthStage === 'starter') {
        dailyFeedPerAnimal = weight * 0.05 // 5% of body weight
        feedType = 'Starter Feed (22-24% Protein)'
        costPerKg = 45
        tips = [
          'Provide fresh water at all times',
          'Feed should be fine crumbs or mash',
          'Monitor chick activity and appetite',
          'Maintain brooding temperature at 32-35°C'
        ]
      } else if (growthStage === 'grower') {
        dailyFeedPerAnimal = weight * 0.045 // 4.5% of body weight
        feedType = 'Grower Feed (18-20% Protein)'
        costPerKg = 40
        tips = [
          'Gradually transition from starter feed',
          'Provide adequate feeder space',
          'Monitor growth rate weekly',
          'Ensure proper ventilation in housing'
        ]
      } else {
        dailyFeedPerAnimal = weight * 0.04 // 4% of body weight
        feedType = 'Finisher Feed (16-18% Protein)'
        costPerKg = 38
        tips = [
          'Optimize feed conversion ratio',
          'Monitor market weight targets',
          'Reduce protein as birds approach market weight',
          'Ensure adequate minerals and vitamins'
        ]
      }
    } else {
      // Pig feed calculation
      if (growthStage === 'starter') {
        dailyFeedPerAnimal = weight * 0.04 // 4% of body weight
        feedType = 'Pig Starter Feed (20-22% Protein)'
        costPerKg = 50
        tips = [
          'Provide creep feed from 7-10 days',
          'Ensure clean water supply',
          'Monitor for diarrhea and adjust feed',
          'Maintain temperature at 28-30°C'
        ]
      } else if (growthStage === 'grower') {
        dailyFeedPerAnimal = weight * 0.035 // 3.5% of body weight
        feedType = 'Pig Grower Feed (16-18% Protein)'
        costPerKg = 45
        tips = [
          'Feed 2-3 times daily',
          'Monitor average daily gain',
          'Provide rooting materials',
          'Ensure proper pen hygiene'
        ]
      } else {
        dailyFeedPerAnimal = weight * 0.03 // 3% of body weight
        feedType = 'Pig Finisher Feed (14-16% Protein)'
        costPerKg = 42
        tips = [
          'Monitor backfat thickness',
          'Adjust feed to reach market weight',
          'Consider split-sex feeding',
          'Track feed conversion efficiency'
        ]
      }
    }

    const totalDailyFeed = dailyFeedPerAnimal * count
    const weeklyFeed = totalDailyFeed * 7
    const monthlyFeed = totalDailyFeed * 30
    const monthlyCost = monthlyFeed * costPerKg

    setRecommendation({
      dailyFeed: totalDailyFeed,
      weeklyFeed,
      monthlyFeed,
      feedType,
      cost: monthlyCost,
      tips
    })
  }

  const handleReset = () => {
    setAnimalCount('')
    setAverageWeight('')
    setAgeWeeks('')
    setRecommendation(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-gray-900">Smart Feed Calculator</h2>
        <p className="text-gray-600 mt-1">Calculate optimal feed quantity based on your livestock data</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <Card className="p-6">
          <h3 className="text-gray-900 mb-4">Enter Details</h3>
          
          <div className="space-y-4">
            {/* Animal Type */}
            <div>
              <Label>Animal Type</Label>
              <div className="grid grid-cols-2 gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setAnimalType('poultry')}
                  className={`p-3 border-2 rounded-lg transition-colors ${
                    animalType === 'poultry'
                      ? 'border-green-600 bg-green-50 text-green-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="text-2xl mb-1 block">🐔</span>
                  <span className="text-sm">Poultry</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAnimalType('pig')}
                  className={`p-3 border-2 rounded-lg transition-colors ${
                    animalType === 'pig'
                      ? 'border-green-600 bg-green-50 text-green-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="text-2xl mb-1 block">🐷</span>
                  <span className="text-sm">Pig</span>
                </button>
              </div>
            </div>

            {/* Growth Stage */}
            <div>
              <Label>Growth Stage</Label>
              <select
                value={growthStage}
                onChange={(e) => setGrowthStage(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md mt-2"
              >
                <option value="starter">Starter</option>
                <option value="grower">Grower</option>
                <option value="finisher">Finisher</option>
              </select>
            </div>

            {/* Number of Animals */}
            <div>
              <Label>Number of Animals</Label>
              <div className="relative mt-2">
                <Scale className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="number"
                  value={animalCount}
                  onChange={(e) => setAnimalCount(e.target.value)}
                  placeholder="e.g., 100"
                  className="pl-10"
                />
              </div>
            </div>

            {/* Average Weight */}
            <div>
              <Label>Average Weight (kg)</Label>
              <div className="relative mt-2">
                <Wheat className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="number"
                  step="0.1"
                  value={averageWeight}
                  onChange={(e) => setAverageWeight(e.target.value)}
                  placeholder={animalType === 'poultry' ? 'e.g., 1.5' : 'e.g., 50'}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Age */}
            <div>
              <Label>Age (weeks)</Label>
              <div className="relative mt-2">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="number"
                  value={ageWeeks}
                  onChange={(e) => setAgeWeeks(e.target.value)}
                  placeholder="e.g., 8"
                  className="pl-10"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                onClick={calculateFeed}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              >
                <Calculator className="w-4 h-4 mr-2" />
                Calculate
              </Button>
              <Button
                onClick={handleReset}
                variant="outline"
                className="flex-1"
              >
                Reset
              </Button>
            </div>
          </div>
        </Card>

        {/* Results */}
        <Card className="p-6">
          <h3 className="text-gray-900 mb-4">Feed Recommendation</h3>
          
          {recommendation ? (
            <div className="space-y-4">
              {/* Feed Type */}
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-green-700">Recommended Feed</span>
                </div>
                <p className="text-green-900">{recommendation.feedType}</p>
              </div>

              {/* Feed Quantities */}
              <div className="grid grid-cols-1 gap-3">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Daily Requirement</p>
                  <p className="text-2xl text-gray-900">{recommendation.dailyFeed.toFixed(2)} kg</p>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Weekly Requirement</p>
                  <p className="text-2xl text-gray-900">{recommendation.weeklyFeed.toFixed(2)} kg</p>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Monthly Requirement</p>
                  <p className="text-2xl text-gray-900">{recommendation.monthlyFeed.toFixed(2)} kg</p>
                </div>
              </div>

              {/* Cost Estimate */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-700 mb-1">Estimated Monthly Cost</p>
                <p className="text-2xl text-blue-900">₹{recommendation.cost.toLocaleString()}</p>
              </div>

              {/* Tips */}
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle className="w-5 h-5 text-yellow-700" />
                  <span className="text-sm text-yellow-700">Feeding Tips</span>
                </div>
                <ul className="space-y-2">
                  {recommendation.tips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-yellow-900">
                      <span className="text-yellow-600 mt-0.5">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Calculator className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Enter animal details to get feed recommendations</p>
              <p className="text-sm text-gray-500 mt-2">
                Our calculator uses industry-standard ratios to provide accurate feed estimates
              </p>
            </div>
          )}
        </Card>
      </div>

      {/* Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white rounded-lg">
              <Wheat className="w-5 h-5 text-green-600" />
            </div>
            <h4 className="text-green-900">Optimal Nutrition</h4>
          </div>
          <p className="text-sm text-green-800">
            Calculations based on industry standards for optimal growth and health
          </p>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white rounded-lg">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <h4 className="text-blue-900">Cost Efficient</h4>
          </div>
          <p className="text-sm text-blue-800">
            Avoid overfeeding and reduce waste with precise calculations
          </p>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white rounded-lg">
              <Scale className="w-5 h-5 text-purple-600" />
            </div>
            <h4 className="text-purple-900">Weight Based</h4>
          </div>
          <p className="text-sm text-purple-800">
            Adjusted recommendations based on current weight and growth stage
          </p>
        </Card>
      </div>
    </div>
  )
}