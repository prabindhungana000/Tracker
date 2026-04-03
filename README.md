# 🌍 FoodJourney - A Culinary Adventure

A **revolutionary** food tracking app that transforms calorie counting into an exciting culinary quest. Instead of boring metrics, embark on a **Flavor Journey** with AI recognition, social challenges, gameplay elements, and beautiful minimal design.

## 🎯 The Vision

FoodJourney isn't just another calorie tracker—it's a **lifestyle companion** that makes food tracking engaging, social, and entertaining. We believe tracking food should be:

- **🎮 Gamified**: Quests, achievements, streaks, and levels
- **👥 Social**: Share meals, compete with friends, join cooking challenges
- **🤖 Intelligent**: AI-powered meal recognition from photos
- **🌿 Sustainable**: Track carbon footprint and environmental impact
- **✨ Beautiful**: Minimalist Zen aesthetic with mood-based analytics
- **🍳 Creative**: AI-generated recipes tailored to your journey

## 📱 Full-Stack Solution

### **Web App** (`/web`)
- Modern React/Next.js interface
- Interactive dashboards and analytics
- Social community features
- Web-based meal logging

### **Mobile App** (`/mobile`)
- React Native with Expo
- Camera-based meal recognition
- Push notifications for challenges
- Offline-first architecture
- Code sharing with web app

### **Backend API** (`/backend`)
- Node.js + Express
- PostgreSQL database
- AI meal recognition integration (Google Vision API)
- Real-time social features
- Gamification engine
- Environmental impact calculations

### **Shared Code** (`/shared`)
- TypeScript types and interfaces
- Constants and utilities
- Shared business logic

## 🚀 Unique Features

### 1. **Quest-Based Tracking**
- Every meal logged is a "Discovery" on your journey
- Track different cuisines to complete "Cuisine Mastery" quests
- Unlock badges for trying new food types

### 2. **Flavor Score** (Not Just Calories)
```
Flavor Score = (Nutrition Balance × 0.4) + (Variety × 0.3) + 
               (Sustainability × 0.2) + (Enjoyment × 0.1)
```
- Holistic health metric beyond plain calorie counting
- Encourages balanced, sustainable eating

### 3. **AI Meal Recognition**
- Snap a photo of your meal
- AI identifies food items and portions
- Auto-logs nutritional data
- Works offline with progressive refinement

### 4. **Social Cooking Challenges**
- Weekly challenges: "Vegan Monday", "Spicy Weekend", "Local Farmers" etc.
- Compete with friends on Flavor Scores
- Leaderboards by cuisine, diet type, sustainability
- Challenge creation by community

### 5. **Mood-Based Analytics**
- Beautiful, interactive charts (not boring bar graphs)
- "Your Week in Flavors" visual story
- Circular progress indicators
- Animated transitions

### 6. **AI Recipe Generator**
- Personalized recipes based on your journey
- Recipes change based on challenges you're doing
- Difficulty levels (Quick bites, Meal prep, Gourmet)
- Nutritional info pre-calculated

### 7. **Environmental Impact Dashboard**
- Carbon footprint of meals
- Sustainability score
- Compare impact across cuisines
- "Green Streaks" for sustainable choices

### 8. **Minimalist Design Philosophy**
- Lots of whitespace
- Focus on typography
- Natural color palette (sage, earth tones, warm accents)
- Smooth animations
- Zen-like user experience

## 📋 Project Structure

```
FoodJourney/
├── web/                 # Next.js web application
│   ├── app/            # App router pages
│   ├── components/     # React components
│   ├── lib/            # Utilities and helpers
│   └── styles/         # Global styles
├── mobile/             # React Native Expo app
│   ├── app/            # Navigation and screens
│   ├── components/     # Native components
│   └── services/       # API and device services
├── backend/            # Node.js/Express API
│   ├── routes/         # API endpoints
│   ├── controllers/    # Business logic
│   ├── models/         # Database models
│   ├── middleware/     # Auth, validation, etc.
│   └── config/         # Database, env configs
├── shared/             # Shared types and utilities
│   ├── types/          # TypeScript interfaces
│   ├── constants/      # App constants
│   └── utils/          # Shared functions
└── docs/               # Documentation
```

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend (Web)** | Next.js 14, React 18, TypeScript |
| **Frontend (Mobile)** | React Native, Expo, TypeScript |
| **Backend** | Node.js, Express, TypeScript |
| **Database** | PostgreSQL, Prisma ORM |
| **AI/ML** | Google Vision API for meal recognition |
| **Auth** | Supabase Auth (GitHub + email/password) |
| **Real-time** | Socket.io for social features |
| **Styling** | Tailwind CSS + custom design system |
| **Testing** | Jest, React Testing Library |
| **Deployment** | Vercel (web), Supabase (Postgres/Auth), Docker/Railway/AWS (API) |

## 📊 Key Data Models

### User Profile
- Identity & preferences
- Dietary restrictions
- Cuisine preferences
- Environmental priorities

### Quest & Achievement System
- Quest definitions (cuisines, challenges)
- User progress tracking
- Achievement unlocks
- Streak management

### Meal Logging
- Meal details (time, location, mood)
- Nutritional breakdown
- Food item recognition
- Photos and memories

### Social Graph
- Friends and followers
- Challenges participation
- Leaderboard rankings
- Activity feed

### Gamification Metrics
- Flavor Score calculations
- Environmental impact
- Quest completion
- Achievement tracking

## 🎮 Gamification Mechanics

### Progression System
- **Levels**: Profile levels based on total Flavor Score
- **Streaks**: Daily/weekly consistency rewards
- **Badges**: Achievement unlocks for milestones
- **Titles**: Special titles for completing quests

### Challenges
- **Timed**: Weekly, monthly challenges
- **Themed**: Cuisine masters, diet explorations
- **Community**: Trending challenges created by users
- **Personal**: Custom goals with friends

### Rewards
- Virtual currency (Flavor Points)
- Unlock special features
- Customize avatar/profile
- Recipe unlocks

## 🔌 API Endpoints Overview

```
# Auth
GET    /api/auth/me
GET    /api/auth/providers

# Meals
POST   /api/meals
GET    /api/meals
POST   /api/meals/recognize (AI recognition)
GET    /api/meals/stats
POST   /api/meals/:id/edit

# Quests & Achievements
GET    /api/quests
GET    /api/quests/:id/progress
POST   /api/quests/:id/complete
GET    /api/achievements

# Social
GET    /api/friends
POST   /api/friends/:id/add
GET    /api/challenges
POST   /api/challenges/:id/join
GET    /api/leaderboards

# User Profile
GET    /api/user/profile
PUT    /api/user/profile
GET    /api/user/analytics
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- PostgreSQL 14+
- Expo CLI (for mobile development)

### Installation

```bash
# Install all dependencies
npm run install:all

# Configure backend env
cp backend/.env.example backend/.env

# Configure web env
cp web/.env.example web/.env.local

# Edit both files with your Supabase project values

# Run migrations
cd backend && npm run migrate

# Start development servers
npm run dev:all
```

### Development

```bash
# Web app only (http://localhost:3000)
npm run dev:web

# Backend API (http://localhost:3001)
npm run dev:backend

# Mobile Expo
npm run dev:mobile
```

## 📚 Documentation

- [Architecture Design](./docs/architecture.md)
- [API Documentation](./backend/API.md)
- [Database Schema](./backend/DATABASE.md)
- [UI/UX Design System](./web/DESIGN_SYSTEM.md)
- [Contributing Guidelines](./CONTRIBUTING.md)

## 🔐 Security & Privacy

- End-to-end encryption for personal data
- No data sharing without explicit consent
- GDPR compliant
- Privacy-first architecture
- Regular security audits

## 📄 License

MIT License - Feel free to use for personal or commercial projects

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## 📞 Support

- **Issues**: GitHub Issues for bug reports and features
- **Discussions**: GitHub Discussions for Q&A
- **Discord**: Join our community (coming soon)

---

**Built with ❤️ to make food tracking a joy, not a chore.**
