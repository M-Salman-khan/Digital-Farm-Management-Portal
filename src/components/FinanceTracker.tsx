import React, { useState, useEffect } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { useAuth } from '../contexts/AuthContext'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Badge } from './ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  PieChart,
  Plus,
  Calendar,
  Download,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'
import { localFinance } from '../utils/local-storage'

interface Transaction {
  id: string
  type: 'income' | 'expense'
  category: string
  amount: number
  date: string
  description: string
  notes?: string
}

export function FinanceTracker() {
  const { t } = useLanguage()
  const { user } = useAuth()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7))

  const [formData, setFormData] = useState({
    type: 'expense' as 'income' | 'expense',
    category: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    notes: ''
  })

  useEffect(() => {
    loadTransactions()
  }, [])

  const loadTransactions = async () => {
    if (!user) return
    try {
      setLoading(true)
      const data = localFinance.getAll(user.id)
      setTransactions(data)
    } catch (error) {
      console.error('Error loading transactions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    
    try {
      const newTransaction = {
        ...formData,
        amount: parseFloat(formData.amount)
      }

      localFinance.create(user.id, newTransaction)
      await loadTransactions()
      setIsAddDialogOpen(false)
      resetForm()
    } catch (error) {
      console.error('Error adding transaction:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      type: 'expense',
      category: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      description: '',
      notes: ''
    })
  }

  // Filter transactions by selected month
  const monthTransactions = transactions.filter(t => 
    t.date.startsWith(selectedMonth)
  )

  // Calculate totals
  const totalIncome = monthTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)
  
  const totalExpense = monthTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)
  
  const netProfit = totalIncome - totalExpense

  // Category breakdown
  const categoryTotals = monthTransactions.reduce((acc, t) => {
    if (t.type === 'expense') {
      acc[t.category] = (acc[t.category] || 0) + t.amount
    }
    return acc
  }, {} as Record<string, number>)

  const expenseCategories = [
    'Feed', 'Medicine', 'Labor', 'Equipment', 'Utilities', 'Transport', 'Other'
  ]

  const incomeCategories = [
    'Livestock Sales', 'Egg Sales', 'Meat Sales', 'Manure Sales', 'Other'
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-gray-900">Finance Tracker</h2>
          <p className="text-gray-600 mt-1">Track your farm income and expenses</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Transaction
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Add Transaction</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div>
                <Label>Transaction Type</Label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'income', category: '' })}
                    className={`p-3 border-2 rounded-lg transition-colors ${
                      formData.type === 'income'
                        ? 'border-green-600 bg-green-50 text-green-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <ArrowUpRight className="w-5 h-5 mx-auto mb-1" />
                    <span className="text-sm">Income</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'expense', category: '' })}
                    className={`p-3 border-2 rounded-lg transition-colors ${
                      formData.type === 'expense'
                        ? 'border-red-600 bg-red-50 text-red-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <ArrowDownRight className="w-5 h-5 mx-auto mb-1" />
                    <span className="text-sm">Expense</span>
                  </button>
                </div>
              </div>

              <div>
                <Label>Category</Label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Select category</option>
                  {(formData.type === 'income' ? incomeCategories : expenseCategories).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Amount (₹)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    placeholder="0.00"
                    required
                  />
                </div>
                <div>
                  <Label>Date</Label>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <Label>Description</Label>
                <Input
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description"
                  required
                />
              </div>

              <div>
                <Label>Notes (Optional)</Label>
                <Textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Additional details..."
                  rows={2}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700 text-white">
                  Save Transaction
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Month Selector */}
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-gray-600" />
          <Label>Select Month</Label>
          <Input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="max-w-xs"
          />
        </div>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Total Income</span>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-3xl text-green-600">₹{totalIncome.toLocaleString()}</p>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Total Expenses</span>
            <TrendingDown className="w-5 h-5 text-red-600" />
          </div>
          <p className="text-3xl text-red-600">₹{totalExpense.toLocaleString()}</p>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Net Profit</span>
            <DollarSign className="w-5 h-5 text-blue-600" />
          </div>
          <p className={`text-3xl ${netProfit >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
            ₹{netProfit.toLocaleString()}
          </p>
        </Card>
      </div>

      {/* Expense Breakdown */}
      {Object.keys(categoryTotals).length > 0 && (
        <Card className="p-6">
          <h3 className="text-gray-900 mb-4">Expense Breakdown</h3>
          <div className="space-y-3">
            {Object.entries(categoryTotals)
              .sort(([, a], [, b]) => b - a)
              .map(([category, amount]) => {
                const percentage = (amount / totalExpense) * 100
                return (
                  <div key={category}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-700">{category}</span>
                      <span className="text-sm text-gray-900">₹{amount.toLocaleString()}</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-600"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
          </div>
        </Card>
      )}

      {/* Recent Transactions */}
      <Card className="p-6">
        <h3 className="text-gray-900 mb-4">Recent Transactions</h3>
        {loading ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading transactions...</p>
          </div>
        ) : monthTransactions.length === 0 ? (
          <div className="text-center py-8">
            <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No transactions for this month</p>
          </div>
        ) : (
          <div className="space-y-3">
            {monthTransactions
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .slice(0, 10)
              .map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      transaction.type === 'income' ? 'bg-green-50' : 'bg-red-50'
                    }`}>
                      {transaction.type === 'income' ? (
                        <ArrowUpRight className="w-4 h-4 text-green-600" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="text-gray-900">{transaction.description}</p>
                      <p className="text-sm text-gray-600">{transaction.category} • {new Date(transaction.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <p className={`${
                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toLocaleString()}
                  </p>
                </div>
              ))}
          </div>
        )}
      </Card>
    </div>
  )
}