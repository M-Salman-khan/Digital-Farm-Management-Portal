import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Badge } from './ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { localCommunity } from '../utils/local-storage'
import { 
  MessageCircle, 
  Plus, 
  User, 
  Clock,
  TrendingUp,
  Users
} from 'lucide-react'

export function Community() {
  const { user } = useAuth()
  const { t } = useLanguage()
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showDialog, setShowDialog] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'general',
  })

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const data = localCommunity.getAll()
      setPosts(data)
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    try {
      localCommunity.create(user.id, user.name, formData)
      setShowDialog(false)
      setFormData({ title: '', content: '', category: 'general' })
      await fetchPosts()
    } catch (error) {
      console.error('Error creating post:', error)
    }
  }

  const getCategoryColor = (category: string) => {
    const colors: any = {
      general: 'bg-gray-100 text-gray-700',
      diseaseControl: 'bg-red-100 text-red-700',
      feedManagement: 'bg-green-100 text-green-700',
      wasteManagement: 'bg-blue-100 text-blue-700',
    }
    return colors[category] || colors.general
  }

  const getRoleColor = (role: string) => {
    const colors: any = {
      farmer: 'text-green-600',
      vet: 'text-blue-600',
      authority: 'text-purple-600',
    }
    return colors[role] || 'text-gray-600'
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8 text-blue-500" />
            <div>
              <h1 className="text-gray-900">{t('community')} Forum</h1>
              <p className="text-gray-600 mt-1">
                Connect with farmers, veterinarians, and experts
              </p>
            </div>
          </div>
          <Button onClick={() => setShowDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            {t('createPost')}
          </Button>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <MessageCircle className="w-8 h-8 text-blue-500" />
            <div>
              <p className="text-gray-600">Total Posts</p>
              <p className="text-gray-900">{posts.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-green-500" />
            <div>
              <p className="text-gray-600">Active Today</p>
              <p className="text-gray-900">
                {posts.filter(p => {
                  const postDate = new Date(p.timestamp).toDateString()
                  const today = new Date().toDateString()
                  return postDate === today
                }).length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8 text-purple-500" />
            <div>
              <p className="text-gray-600">Contributors</p>
              <p className="text-gray-900">
                {new Set(posts.map(p => p.userId)).size}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filter Tabs */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-2">
          {['All', 'General', 'Disease Control', 'Feed Management', 'Waste Management'].map(cat => (
            <Button key={cat} variant="outline" size="sm">
              {cat}
            </Button>
          ))}
        </div>
      </Card>

      {/* Posts List */}
      <div className="space-y-4">
        {loading ? (
          <Card className="p-12 text-center">
            <p className="text-gray-500">{t('loading')}</p>
          </Card>
        ) : posts.length === 0 ? (
          <Card className="p-12 text-center">
            <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600">No posts yet</p>
            <p className="text-gray-500 text-sm mt-2">
              Be the first to start a discussion!
            </p>
          </Card>
        ) : (
          posts.map((post) => (
            <Card key={post.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                {/* Author Avatar */}
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-6 h-6 text-white" />
                </div>

                {/* Post Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-gray-900">{post.authorName}</span>
                        <Badge variant="outline" className={getRoleColor(post.authorRole)}>
                          {post.authorRole}
                        </Badge>
                        <span className={`px-2 py-0.5 rounded text-xs ${getCategoryColor(post.category)}`}>
                          {post.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        {new Date(post.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <h3 className="text-gray-900 mb-2">{post.title}</h3>
                  <p className="text-gray-700 mb-4">{post.content}</p>

                  {/* Actions */}
                  <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm">
                      <MessageCircle className="w-4 h-4 mr-1" />
                      Reply ({post.replies?.length || 0})
                    </Button>
                    <Button variant="ghost" size="sm">
                      👍 Helpful
                    </Button>
                    <Button variant="ghost" size="sm">
                      Share
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Featured Resources */}
      <Card className="p-6 bg-gradient-to-r from-green-50 to-blue-50">
        <h3 className="text-gray-900 mb-4">Featured Resources</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-white rounded-lg border">
            <h4 className="text-gray-900 mb-2">Expert Webinar Series</h4>
            <p className="text-sm text-gray-600 mb-3">
              Join our monthly webinars with veterinary experts
            </p>
            <Button variant="outline" size="sm">Learn More</Button>
          </div>
          <div className="p-4 bg-white rounded-lg border">
            <h4 className="text-gray-900 mb-2">Biosecurity Guidelines</h4>
            <p className="text-sm text-gray-600 mb-3">
              Download comprehensive biosecurity manuals
            </p>
            <Button variant="outline" size="sm">Download</Button>
          </div>
        </div>
      </Card>

      {/* Create Post Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t('createPost')}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">{t('title')}</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="What's your question or topic?"
                required
              />
            </div>

            <div>
              <Label htmlFor="category">{t('category')}</Label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="general">{t('general')}</option>
                <option value="diseaseControl">{t('diseaseControl')}</option>
                <option value="feedManagement">{t('feedManagement')}</option>
                <option value="wasteManagement">{t('wasteManagement')}</option>
              </select>
            </div>

            <div>
              <Label htmlFor="content">{t('content')}</Label>
              <textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md min-h-32"
                placeholder="Share your thoughts, questions, or experiences..."
                required
              />
            </div>

            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={() => setShowDialog(false)} className="flex-1">
                {t('cancel')}
              </Button>
              <Button type="submit" className="flex-1">
                Post to Community
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}