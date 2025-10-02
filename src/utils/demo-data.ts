// Demo data initialization utilities
// This can be used to populate the database with sample data for demonstration

export const demoAlerts = [
  {
    title: 'African Swine Fever Alert - High Risk',
    description: 'Multiple cases of African Swine Fever detected in nearby districts. All pig farmers should implement strict biosecurity measures immediately. Restrict farm visits, disinfect all entry points, and monitor animals closely for symptoms.',
    severity: 'critical',
    location: 'Karnataka, Bangalore Rural',
    farmType: 'pig',
  },
  {
    title: 'Avian Influenza H5N1 Surveillance',
    description: 'Low pathogenic avian influenza detected in wild birds. Poultry farmers advised to prevent contact between domestic birds and wild birds. Ensure proper netting and biosecurity protocols.',
    severity: 'medium',
    location: 'Kerala, Kottayam',
    farmType: 'poultry',
  },
  {
    title: 'Newcastle Disease Outbreak',
    description: 'Newcastle disease confirmed in backyard poultry in the region. Commercial poultry farms should strengthen biosecurity, vaccinate all birds, and report any unusual mortality immediately.',
    severity: 'high',
    location: 'Tamil Nadu, Coimbatore',
    farmType: 'poultry',
  },
]

export const demoCommunityPosts = [
  {
    title: 'Best practices for footbath maintenance?',
    content: 'I have set up footbaths at all entry points, but I am not sure how often to change the disinfectant solution. What is the recommended frequency? Also, which disinfectant works best for African Swine Fever prevention?',
    category: 'diseaseControl',
  },
  {
    title: 'Successful implementation of all-in-all-out system',
    content: 'After attending the training module, I implemented the all-in-all-out system in my poultry farm. Mortality has reduced by 30% and birds are much healthier. Highly recommend this approach to other farmers!',
    category: 'general',
  },
  {
    title: 'Feed quality and biosecurity',
    content: 'Does anyone have experience with feed storage to prevent contamination? I recently learned that improper feed storage can be a biosecurity risk. Looking for practical storage solutions.',
    category: 'feedManagement',
  },
  {
    title: 'Dead bird disposal methods',
    content: 'What are the approved methods for disposing of dead birds in compliance with biosecurity standards? I want to ensure I am following proper protocols.',
    category: 'wasteManagement',
  },
]

export const demoUsers = [
  {
    email: 'farmer@example.com',
    password: 'password123',
    name: 'Rajesh Kumar',
    role: 'farmer',
    farmType: 'poultry',
    location: 'Bangalore, Karnataka',
    language: 'en',
  },
  {
    email: 'vet@example.com',
    password: 'password123',
    name: 'Dr. Priya Sharma',
    role: 'vet',
    location: 'Mumbai, Maharashtra',
    language: 'en',
  },
  {
    email: 'authority@example.com',
    password: 'password123',
    name: 'Vikram Singh',
    role: 'authority',
    location: 'New Delhi',
    language: 'en',
  },
]

export const sampleAssessmentResponses = {
  pig: {
    biosecurity_protocol: true,
    visitor_log: true,
    footbath: true,
    quarantine: false,
    pest_control: true,
    water_quality: true,
    vaccination: true,
    disposal: false,
    equipment: true,
    training: false,
  },
  poultry: {
    biosecurity_protocol: true,
    visitor_control: true,
    disinfection: false,
    all_in_out: true,
    wild_birds: true,
    feed_storage: true,
    vaccination: true,
    mortality: true,
    litter_management: false,
    staff_training: true,
  },
}

export const sampleComplianceRecords = [
  {
    type: 'vaccination',
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    details: 'Administered Newcastle Disease vaccine to all birds (500 birds total). Used ND Lasota strain via drinking water method. No adverse reactions observed.',
  },
  {
    type: 'inspection',
    date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    details: 'Quarterly biosecurity inspection completed. All entry points secured, footbaths functional, no signs of disease. Minor recommendation: improve ventilation in barn 2.',
  },
  {
    type: 'sanitation',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    details: 'Deep cleaning of poultry house 1 completed. Used Virkon S disinfectant at 1% concentration. All equipment sanitized, litter replaced.',
  },
]

// Helper function to format demo data for display
export function getDemoDataSummary() {
  return {
    alerts: demoAlerts.length,
    posts: demoCommunityPosts.length,
    users: demoUsers.length,
    assessmentQuestions: {
      pig: Object.keys(sampleAssessmentResponses.pig).length,
      poultry: Object.keys(sampleAssessmentResponses.poultry).length,
    },
  }
}

// Helper to generate sample analytics data
export function generateSampleAnalytics() {
  return {
    totalUsers: 247,
    totalAssessments: 189,
    activeAlerts: demoAlerts.length,
    riskDistribution: {
      low: 134,
      medium: 89,
      high: 24,
    },
    farmTypeDistribution: {
      pig: 78,
      poultry: 142,
      both: 27,
    },
  }
}