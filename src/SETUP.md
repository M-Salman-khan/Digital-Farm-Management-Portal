# 🚀 Setup Guide - Digital Farm Biosecurity Portal

This guide will help you set up and run the Digital Farm Biosecurity Portal locally or deploy it to production.

---

## 📋 Prerequisites

- Node.js 18+ or Deno 1.40+
- Supabase account (for backend services)
- Modern web browser
- Git (for version control)

---

## 🏗️ Project Structure

```
/
├── App.tsx                    # Main application component
├── components/                # React components
│   ├── Login.tsx             # Authentication - Login
│   ├── Register.tsx          # Authentication - Register
│   ├── Dashboard.tsx         # Farmer dashboard
│   ├── RiskAssessment.tsx    # Biosecurity assessment tool
│   ├── Training.tsx          # Training modules
│   ├── Compliance.tsx        # Record keeping
│   ├── Alerts.tsx            # Disease alerts
│   ├── Community.tsx         # Community forum
│   ├── AdminDashboard.tsx    # Analytics (authorities)
│   ├── WelcomeGuide.tsx      # Onboarding guide
│   └── ui/                   # Shadcn UI components
├── contexts/                  # React contexts
│   ├── AuthContext.tsx       # Authentication state
│   └── LanguageContext.tsx   # i18n translations
├── supabase/                  # Backend
│   └── functions/
│       └── server/
│           └── index.tsx     # Edge function API
├── utils/                     # Utilities
│   ├── supabase-client.ts    # Supabase client
│   └── demo-data.ts          # Demo data
├── styles/
│   └── globals.css           # Global styles
└── README.md                  # Documentation
```

---

## ⚙️ Backend Setup (Supabase)

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note your project URL and anon key

### 2. Configure Environment Variables

The following environment variables are automatically configured in Figma Make:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_DB_URL`

### 3. Deploy Edge Functions

The edge function at `/supabase/functions/server/index.tsx` is automatically deployed.

### 4. Set Up Key-Value Store

The system uses Supabase's built-in KV store table (`kv_store_91b564be`). This is automatically configured.

---

## 🎨 Frontend Setup

### Dependencies

The following packages are used:
- **React 18+** - UI framework
- **Tailwind CSS 4.0** - Styling
- **Shadcn/UI** - Component library
- **Lucide React** - Icons
- **@supabase/supabase-js** - Backend client

All dependencies are pre-installed in the Figma Make environment.

---

## 🔐 Authentication Flow

### User Registration

```typescript
POST /make-server-91b564be/signup
{
  "email": "user@example.com",
  "password": "password123",
  "name": "User Name",
  "role": "farmer" | "vet" | "authority",
  "farmType": "pig" | "poultry" | "both",
  "location": "City, State",
  "language": "en"
}
```

### User Login

```typescript
// Handled by Supabase Auth
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123',
})
```

### Session Management

- Access token stored in Supabase auth
- Profile data cached in KV store
- Role-based access control enforced on backend

---

## 📡 API Endpoints

All endpoints require authentication except signup.

### User Management
- `POST /make-server-91b564be/signup` - Create account
- `GET /make-server-91b564be/profile` - Get user profile
- `PUT /make-server-91b564be/profile` - Update profile

### Risk Assessment
- `POST /make-server-91b564be/risk-assessment` - Submit assessment
- `GET /make-server-91b564be/risk-assessments` - Get user assessments

### Compliance
- `POST /make-server-91b564be/compliance` - Add record
- `GET /make-server-91b564be/compliance` - Get records

### Alerts
- `POST /make-server-91b564be/alerts` - Create alert (vet/authority only)
- `GET /make-server-91b564be/alerts` - Get active alerts

### Training
- `POST /make-server-91b564be/training/progress` - Update progress
- `GET /make-server-91b564be/training/progress` - Get progress

### Community
- `POST /make-server-91b564be/community/posts` - Create post
- `GET /make-server-91b564be/community/posts` - Get posts

### Analytics
- `GET /make-server-91b564be/analytics` - Get analytics (authority only)

---

## 🌍 Internationalization (i18n)

### Supported Languages

- English (en)
- Hindi (hi)
- Tamil (ta)
- Telugu (te)
- Bengali (bn)
- Punjabi (pa)

### Adding New Translations

Edit `/contexts/LanguageContext.tsx`:

```typescript
const translations: Record<Language, Record<string, string>> = {
  en: {
    key: 'English translation',
  },
  hi: {
    key: 'हिंदी अनुवाद',
  },
  // Add more languages...
}
```

### Using Translations

```typescript
const { t } = useLanguage()
return <p>{t('key')}</p>
```

---

## 🧪 Testing

### Demo Accounts

Pre-configured test accounts:

**Farmer:**
- Email: `farmer@example.com`
- Password: `password123`

**Veterinarian:**
- Email: `vet@example.com`
- Password: `password123`

**Authority:**
- Email: `authority@example.com`
- Password: `password123`

### Test Scenarios

1. **Registration Flow**
   - Create new account
   - Verify profile data
   - Check multilingual UI

2. **Risk Assessment**
   - Complete assessment
   - Verify score calculation
   - Check recommendations

3. **Compliance Tracking**
   - Add vaccination record
   - Add inspection record
   - Export records as CSV

4. **Training Progress**
   - Complete a module
   - Take quiz
   - Verify progress tracking

5. **Alerts System**
   - Create alert (as vet)
   - View alerts (as farmer)
   - Check severity filtering

6. **Community Features**
   - Create post
   - View posts
   - Filter by category

7. **Analytics Dashboard**
   - View as authority
   - Check data aggregation
   - Export reports

---

## 🎯 Role-Based Features

### Farmer
- ✅ Dashboard overview
- ✅ Risk assessment
- ✅ Training modules
- ✅ Compliance records
- ✅ View alerts
- ✅ Community participation

### Veterinarian
- ✅ Dashboard overview
- ✅ Create alerts
- ✅ Training access
- ✅ Community participation
- ❌ Risk assessment (farmer-only)
- ❌ Analytics (authority-only)

### Authority
- ✅ Dashboard overview
- ✅ Analytics dashboard
- ✅ Create system-wide alerts
- ✅ View all data
- ✅ Export reports
- ✅ Community participation

---

## 📊 Data Models

### User Profile
```typescript
{
  userId: string
  name: string
  email: string
  role: 'farmer' | 'vet' | 'authority'
  farmType?: 'pig' | 'poultry' | 'both'
  location: string
  language: string
  createdAt: string
}
```

### Risk Assessment
```typescript
{
  id: string
  userId: string
  farmType: 'pig' | 'poultry'
  responses: Record<string, boolean>
  score: number
  riskLevel: 'low' | 'medium' | 'high'
  timestamp: string
}
```

### Compliance Record
```typescript
{
  id: string
  userId: string
  type: 'vaccination' | 'inspection' | 'sanitation'
  date: string
  details: string
  timestamp: string
}
```

### Alert
```typescript
{
  id: string
  title: string
  description: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  location: string
  farmType: 'pig' | 'poultry' | 'both'
  createdBy: string
  timestamp: string
  active: boolean
}
```

---

## 🔧 Customization

### Branding
- Update colors in `/styles/globals.css`
- Change logo in App header
- Modify theme tokens

### Assessment Questions
- Edit questions in `/components/RiskAssessment.tsx`
- Modify scoring algorithm
- Add new farm types

### Training Modules
- Add modules in `/components/Training.tsx`
- Upload video content
- Create new quizzes

---

## 🚀 Deployment

### Figma Make Deployment
The app is automatically deployed in the Figma Make environment.

### Production Deployment

For production deployment to your own infrastructure:

1. **Frontend Hosting** (Vercel/Netlify/Cloudflare Pages)
   - Build command: `npm run build`
   - Output directory: `dist`

2. **Backend** (Supabase)
   - Deploy edge functions
   - Configure authentication
   - Set up database

3. **Environment Variables**
   - Set Supabase credentials
   - Configure API endpoints
   - Add production URLs

---

## 📈 Performance Optimization

### Implemented Optimizations
- Code splitting by route
- Lazy loading of components
- Image optimization
- API response caching
- Debounced search/filters

### Future Optimizations
- Service worker for offline mode
- Progressive Web App (PWA)
- Push notifications
- Real-time updates via WebSocket

---

## 🐛 Troubleshooting

### Common Issues

**Login fails:**
- Check Supabase credentials
- Verify email is confirmed
- Check network connection

**Data not loading:**
- Verify authentication token
- Check API endpoint URLs
- Review browser console for errors

**Translation not working:**
- Ensure language code is valid
- Check LanguageContext provider
- Verify translation keys exist

---

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Shadcn/UI Components](https://ui.shadcn.com)

---

## 🤝 Contributing

To contribute to this project:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

## 📝 License

This project is developed for Smart India Hackathon 2025 (Problem Statement SIH25006).

---

## 💡 Support

For technical support:
- Create an issue in the repository
- Contact the development team
- Check the FAQ section

---

**Built with ❤️ for Indian farmers**