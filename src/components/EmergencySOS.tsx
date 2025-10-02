import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { Badge } from './ui/badge'
import { 
  AlertTriangle,
  Phone,
  MapPin,
  Clock,
  User,
  X,
  PhoneCall,
  MessageCircle,
  Mail,
  Navigation
} from 'lucide-react'

interface EmergencyContact {
  name: string
  role: string
  phone: string
  email?: string
  location: string
  available: boolean
}

export function EmergencySOS() {
  const { user } = useAuth()
  const { t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const [selectedContact, setSelectedContact] = useState<EmergencyContact | null>(null)

  const emergencyContacts: EmergencyContact[] = [
    {
      name: 'Dr. Rajesh Kumar',
      role: 'Senior Veterinarian',
      phone: '+91-9876543210',
      email: 'dr.rajesh@example.com',
      location: 'District Animal Hospital, Delhi',
      available: true
    },
    {
      name: 'Dr. Priya Sharma',
      role: 'Poultry Specialist',
      phone: '+91-9876543211',
      email: 'dr.priya@example.com',
      location: 'Regional Poultry Center, Punjab',
      available: true
    },
    {
      name: 'Animal Disease Control Office',
      role: 'Disease Control Authority',
      phone: '+91-9876543212',
      email: 'adco@gov.in',
      location: 'State Animal Husbandry Dept.',
      available: true
    },
    {
      name: 'Livestock Emergency Helpline',
      role: '24/7 Emergency Support',
      phone: '1800-XXX-XXXX',
      location: 'National Helpline',
      available: true
    }
  ]

  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone}`
  }

  const handleEmail = (email: string) => {
    window.location.href = `mailto:${email}`
  }

  const handleSMS = (phone: string) => {
    const message = `URGENT: Disease outbreak suspected at ${user?.location}. Need immediate veterinary assistance. Farmer: ${user?.name}`
    window.location.href = `sms:${phone}?body=${encodeURIComponent(message)}`
  }

  return (
    <>
      {/* Floating Emergency Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 animate-pulse"
        title="Emergency SOS"
      >
        <AlertTriangle className="w-8 h-8" />
      </button>

      {/* Emergency Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <DialogTitle className="text-red-600">Emergency SOS</DialogTitle>
                <p className="text-sm text-gray-600 mt-1">Get immediate help for disease outbreaks or emergencies</p>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {/* Emergency Info Card */}
            <Card className="p-4 bg-red-50 border-2 border-red-200">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                <div>
                  <p className="text-red-900">
                    <strong>Important:</strong> Use this for genuine emergencies only
                  </p>
                  <p className="text-sm text-red-700 mt-1">
                    For disease outbreaks, sudden deaths, or biosecurity threats requiring immediate attention
                  </p>
                </div>
              </div>
            </Card>

            {/* Your Location Info */}
            <Card className="p-4 bg-blue-50">
              <div className="flex items-center gap-3 mb-3">
                <MapPin className="w-5 h-5 text-blue-600" />
                <h4 className="text-blue-900">Your Farm Location</h4>
              </div>
              <p className="text-blue-800">{user?.location || 'Location not set'}</p>
              <p className="text-sm text-blue-700 mt-1">Farm Type: {t(user?.farmType || 'N/A')}</p>
            </Card>

            {/* Emergency Contacts */}
            <div>
              <h4 className="text-gray-900 mb-3">Emergency Contacts</h4>
              <div className="space-y-3">
                {emergencyContacts.map((contact, index) => (
                  <Card key={index} className="p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                          <p className="text-gray-900">{contact.name}</p>
                          <p className="text-sm text-gray-600">{contact.role}</p>
                        </div>
                      </div>
                      {contact.available && (
                        <Badge className="bg-green-100 text-green-800">Available</Badge>
                      )}
                    </div>

                    <div className="space-y-2 mb-3">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <span>{contact.phone}</span>
                      </div>
                      {contact.email && (
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Mail className="w-4 h-4 text-gray-500" />
                          <span>{contact.email}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span>{contact.location}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleCall(contact.phone)}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                      >
                        <PhoneCall className="w-4 h-4 mr-2" />
                        Call Now
                      </Button>
                      <Button
                        onClick={() => handleSMS(contact.phone)}
                        variant="outline"
                        className="flex-1"
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        SMS
                      </Button>
                      {contact.email && (
                        <Button
                          onClick={() => handleEmail(contact.email!)}
                          variant="outline"
                        >
                          <Mail className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <Card className="p-4 bg-yellow-50">
              <h4 className="text-yellow-900 mb-3">While Waiting for Help</h4>
              <ul className="space-y-2 text-sm text-yellow-800">
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 mt-0.5">•</span>
                  <span>Isolate affected animals immediately</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 mt-0.5">•</span>
                  <span>Restrict movement in and out of the farm</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 mt-0.5">•</span>
                  <span>Document symptoms and take photos if possible</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 mt-0.5">•</span>
                  <span>Avoid contact with healthy animals</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 mt-0.5">•</span>
                  <span>Prepare farm records for the veterinarian</span>
                </li>
              </ul>
            </Card>

            {/* National Helplines */}
            <Card className="p-4 bg-gradient-to-br from-blue-50 to-purple-50">
              <h4 className="text-gray-900 mb-3">National Helplines</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-white rounded">
                  <span className="text-sm text-gray-700">Animal Disease Emergency</span>
                  <span className="text-sm text-gray-900">1962</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-white rounded">
                  <span className="text-sm text-gray-700">Kisan Call Center</span>
                  <span className="text-sm text-gray-900">1800-180-1551</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-white rounded">
                  <span className="text-sm text-gray-700">Agriculture Helpline</span>
                  <span className="text-sm text-gray-900">155261</span>
                </div>
              </div>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}