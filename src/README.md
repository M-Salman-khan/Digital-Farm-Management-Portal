# 🌾 Digital Farm Biosecurity Portal

**SIH 2025 Problem Statement ID: SIH25006**

A comprehensive mobile-first, multilingual digital platform that empowers pig and poultry farmers to adopt, monitor, and sustain biosecurity practices.

---

## 🎯 Project Overview

This Digital Farm Management Portal addresses the critical need for improved biosecurity measures in pig and poultry farms across India. The platform provides farmers, veterinarians, and authorities with tools to assess risks, track compliance, receive disease alerts, and access training resources.

## ✨ Key Features

### 1. **User Authentication & Profiles**
- Secure registration and login system powered by Supabase Auth
- Role-based access control (Farmer, Veterinarian, Authority)
- Multilingual support: English, Hindi, Tamil, Telugu, Bengali, Punjabi
- User profile management with farm-specific details

### 2. **Risk Assessment Tools**
- Interactive self-assessment questionnaires
- Separate assessment forms for pig and poultry farms
- Automatic scoring system with risk-level indicators (Low/Medium/High)
- Historical assessment tracking
- Personalized recommendations based on risk level

### 3. **Training & Awareness**
- 6 comprehensive training modules covering:
  - Introduction to Biosecurity
  - Visitor & Vehicle Management
  - Sanitation & Hygiene Protocols
  - Disease Prevention Strategies
  - Record Keeping & Documentation
  - Integrated Pest Management
- Progress tracking with completion status
- Interactive quizzes for knowledge assessment
- Certificate generation upon completion

### 4. **Compliance & Record Keeping**
- Digital record management for:
  - Vaccinations
  - Farm inspections
  - Sanitation activities
- Date-stamped entries with detailed descriptions
- Filterable record views by category
- CSV export functionality for regulatory compliance
- Statistics dashboard

### 5. **Monitoring & Alerts**
- Real-time disease outbreak alert system
- Severity-based categorization (Critical/High/Medium/Low)
- Location-specific alerts
- Farm-type filtering (Pig/Poultry/Both)
- Alert creation interface for vets and authorities
- Auto-refresh for latest updates

### 6. **Collaboration Tools**
- Community forum for knowledge sharing
- Post creation with category tagging
- Role-based user identification
- Discussion threads
- Featured resources and expert webinars

### 7. **Analytics Dashboard (Authorities Only)**
- Comprehensive farm statistics
- Risk distribution visualization
- Farm type distribution metrics
- User engagement analytics
- Data export capabilities for policy-making
- Insights and recommendations

---

## 🛠️ Technology Stack

### Frontend
- **React.js** with TypeScript
- **Tailwind CSS v4.0** for styling
- **Shadcn/UI** component library
- **Lucide React** for icons
- Context API for state management

### Backend
- **Supabase** (PostgreSQL database)
- **Supabase Edge Functions** (Deno runtime)
- **Hono.js** web framework
- Key-Value store for data persistence

### Features
- Mobile-first responsive design
- Progressive Web App (PWA) capabilities
- Offline mode support (localStorage caching)
- Real-time data synchronization

---

## 🚀 Getting Started

### Demo Accounts

Use these pre-configured accounts to explore different user roles:

**Farmer Account:**
- Email: `farmer@example.com`
- Password: `password123`

**Veterinarian Account:**
- Email: `vet@example.com`
- Password: `password123`

**Authority Account:**
- Email: `authority@example.com`
- Password: `password123`

### Creating New Accounts

1. Click on "Register" on the login page
2. Fill in your details:
   - Name
   - Email
   - Password (minimum 6 characters)
   - Role (Farmer/Veterinarian/Authority)
   - Farm Type (for farmers: Pig/Poultry/Both)
   - Location
   - Preferred language
3. Click "Register" to create your account

---

## 📱 User Flows

### For Farmers

1. **Complete Risk Assessment**
   - Navigate to "Risk Assessment"
   - Select your farm type
   - Answer all biosecurity questions honestly
   - Receive instant risk score and recommendations

2. **Log Compliance Records**
   - Go to "Compliance"
   - Click "Add Record"
   - Select record type (Vaccination/Inspection/Sanitation)
   - Enter date and details
   - Save record

3. **Access Training**
   - Open "Training" section
   - Browse available modules
   - Complete modules and quizzes
   - Track your progress
   - Download certificate when all modules completed

4. **Monitor Alerts**
   - Check "Alerts" for disease outbreaks
   - Filter by severity and location
   - Take preventive actions based on alerts

5. **Join Community**
   - Visit "Community" forum
   - Read discussions from other farmers
   - Create posts to ask questions
   - Share your experiences

### For Veterinarians

1. **Create Disease Alerts**
   - Navigate to "Alerts"
   - Click "Create Alert"
   - Fill in outbreak details
   - Set severity level
   - Publish to notify farmers

2. **Access Training Materials**
   - Review training modules
   - Stay updated on best practices

3. **Engage with Community**
   - Provide expert advice in forums
   - Share resources and guidelines

### For Authorities

1. **View Analytics Dashboard**
   - Access comprehensive farm statistics
   - Monitor risk distribution across farms
   - Analyze compliance trends
   - Export data for reports

2. **Create System-Wide Alerts**
   - Issue critical disease outbreak warnings
   - Set geographical scope

3. **Monitor Platform Activity**
   - Track user engagement
   - Identify high-risk areas
   - Generate policy recommendations

---

## 🌍 Multilingual Support

The platform supports 6 languages:
- **English** (en)
- **Hindi** (हिंदी) (hi)
- **Tamil** (தமிழ்) (ta)
- **Telugu** (తెలుగు) (te)
- **Bengali** (বাংলা) (bn)
- **Punjabi** (ਪੰਜਾਬੀ) (pa)

Language can be changed from:
- Login/Register screens (dropdown in header)
- Application header (after login)

All UI elements, navigation, and content are translated.

---

## 📊 Data Architecture

### Key-Value Store Structure

```
user:{userId}:profile          - User profile information
user:{userId}:assessments      - List of assessment IDs
user:{userId}:compliance       - List of compliance record IDs
user:{userId}:training         - Training progress data

assessment:{assessmentId}      - Individual assessment data
compliance:{recordId}          - Individual compliance record
alert:{alertId}                - Disease alert information
community:post:{postId}        - Forum post content

alerts:active                  - List of active alert IDs
community:posts:all            - List of all post IDs
```

---

## 🔐 Security Features

- Supabase authentication with email confirmation
- Role-based access control (RBAC)
- Protected API routes requiring authentication
- Secure session management
- Data isolation per user/organization

---

## 📈 Future Enhancements

1. **AI/ML Integration**
   - Disease outbreak prediction models
   - Risk assessment automation
   - Pattern recognition in compliance data

2. **Mobile Applications**
   - Native iOS and Android apps
   - Offline-first architecture
   - Push notifications

3. **Advanced Features**
   - SMS alerts for areas with limited internet
   - QR code-based visitor logging
   - Integration with IoT sensors
   - Video consultation with veterinarians
   - Geofencing for location-based alerts

4. **Data Analytics**
   - Predictive analytics for disease spread
   - Seasonal trend analysis
   - Benchmarking against regional averages

5. **Integration**
   - Government database connectivity
   - Veterinary clinic management systems
   - Laboratory test result imports
   - Feed supplier integrations

---

## 🎓 Training Module Details

### Module 1: Introduction to Biosecurity (15 min)
- Fundamentals of biosecurity
- Why biosecurity matters
- Basic principles
- Common risk factors

### Module 2: Visitor & Vehicle Management (20 min)
- Access control strategies
- Visitor registration systems
- Vehicle disinfection protocols
- Protective clothing requirements

### Module 3: Sanitation & Hygiene Protocols (25 min)
- Cleaning procedures
- Disinfectant selection and usage
- Equipment sanitation
- Personal hygiene practices

### Module 4: Disease Prevention Strategies (30 min)
- Disease identification
- Vaccination schedules
- Quarantine procedures
- Emergency response protocols

### Module 5: Record Keeping & Documentation (15 min)
- What to record and why
- Digital vs. paper records
- Compliance requirements
- Best practices

### Module 6: Integrated Pest Management (20 min)
- Common pests and their risks
- Prevention strategies
- Safe pesticide application
- Monitoring and evaluation

---

## 🤝 Support & Collaboration

### For Technical Issues
- Check the community forum for solutions
- Contact your local veterinary office

### For Policy & Compliance
- Reach out to agricultural authorities
- Review government guidelines

### Community Engagement
- Participate in monthly webinars
- Join farmer support groups
- Share success stories

---

## 📝 License & Acknowledgments

This project was developed for Smart India Hackathon 2025 (SIH25006).

**Developed by:** Full-Stack AI Development Team
**Problem Statement:** Development of a Digital Farm Management Portal for Implementing Biosecurity Measures in Pig and Poultry Farms

---

## 🌟 Impact & Expected Outcomes

1. **Increased Awareness**
   - 80%+ of farmers complete biosecurity training
   - Improved understanding of disease prevention

2. **Risk Reduction**
   - 40% reduction in high-risk farms within 6 months
   - Early disease detection and response

3. **Better Compliance**
   - 90% digital record adoption
   - Streamlined regulatory reporting

4. **Data-Driven Policy**
   - Real-time disease surveillance
   - Evidence-based intervention strategies

5. **Community Building**
   - Knowledge sharing among 1000+ farmers
   - Peer-to-peer learning

---

## 📞 Contact Information

For questions, suggestions, or collaboration opportunities:
- Community Forum: Use the in-app community section
- Technical Support: Contact your system administrator
- Policy Inquiries: Reach out to agricultural authorities

---

**Built with ❤️ for Indian farmers**

*Empowering biosecurity, one farm at a time.*