# FoodJourney Project Structure

## 📦 Project Overview

**FoodJourney** is a revolutionary food tracking application that combines:
- 🎮 Gamification (quests, achievements, streaks)
- 🤖 AI meal recognition from photos
- 👥 Social challenges and leaderboards
- 🌿 Environmental impact tracking
- ✨ Zen-like minimalist design

## 📁 Directory Structure

```
Tracking/
├── 📄 README.md                    # Main project documentation
├── 📄 CONTRIBUTING.md              # Contribution guidelines
├── 📄 package.json                 # Monorepo root configuration
├── 📄 .gitignore                   # Git ignore patterns
├── 📄 .github/
│   └── copilot-instructions.md    # Copilot guidelines
│
├── 🌐 web/                         # Next.js web application
│   ├── 📄 package.json             # Web dependencies
│   ├── 📄 tsconfig.json            # TypeScript config
│   ├── 📄 next.config.js           # Next.js configuration
│   ├── 📄 tailwind.config.js       # Tailwind CSS config
│   ├── 📄 postcss.config.js        # PostCSS config
│   ├── 📄 .gitignore               # Web-specific ignores
│   ├── app/
│   │   ├── layout.tsx              # Root layout
│   │   ├── page.tsx                # Landing page
│   │   └── ...                     # Additional routes
│   ├── components/
│   │   ├── ui/                     # Reusable UI components
│   │   └── features/               # Feature components
│   ├── lib/
│   │   ├── api/                    # API client setup
│   │   ├── hooks/                  # Custom React hooks
│   │   ├── utils/                  # Utility functions
│   │   └── store/                  # Zustand stores
│   └── styles/
│       └── globals.css             # Global styles + design system
│
├── 📱 mobile/                      # React Native Expo app
│   ├── 📄 package.json             # Mobile dependencies
│   ├── 📄 app.json                 # Expo configuration
│   ├── 📄 .gitignore               # Mobile-specific ignores
│   ├── app/
│   │   └── index.tsx               # Navigation setup
│   ├── screens/
│   │   ├── HomeScreen/             # Dashboard
│   │   ├── CameraScreen/           # Meal photo capture
│   │   ├── StatsScreen/            # Analytics
│   │   └── ProfileScreen/          # User profile
│   ├── components/
│   │   ├── ui/                     # Common components
│   │   └── features/               # Feature components
│   ├── services/
│   │   ├── api.ts                  # API client
│   │   └── store.ts                # State management
│   └── assets/
│       ├── icon.png                # App icon
│       └── splash.png              # Splash screen
│
├── ⚡ backend/                     # Node.js + Express API
│   ├── 📄 package.json             # Backend dependencies
│   ├── 📄 tsconfig.json            # TypeScript config
│   ├── 📄 .env.example             # Environment variables template
│   ├── 📄 .gitignore               # Backend-specific ignores
│   ├── prisma/
│   │   └── schema.prisma           # Database models (comprehensive!)
│   └── src/
│       ├── index.ts                # Express server entry point
│       ├── types/
│       │   └── index.ts            # TypeScript type definitions
│       ├── routes/
│       │   ├── auth.ts             # Authentication endpoints
│       │   ├── meals.ts            # Meal management
│       │   ├── quests.ts           # Quest system
│       │   ├── achievements.ts     # Achievement tracking
│       │   ├── challenges.ts       # Social challenges
│       │   ├── social.ts           # Friends & leaderboards
│       │   └── user.ts             # User profile
│       ├── controllers/
│       │   └── [resource]Controller.ts
│       ├── services/
│       │   ├── mealRecognition.ts  # AI meal recognition
│       │   ├── gamification.ts     # Points & level calculation
│       │   ├── sustainability.ts   # Carbon footprint
│       │   └── notification.ts     # Push notifications
│       ├── middleware/
│       │   ├── auth.ts             # JWT verification
│       │   ├── validation.ts       # Request validation
│       │   └── errorHandler.ts     # Error handling
│       └── utils/
│           ├── gamification.ts     # Gamification algorithms
│           └── logger.ts           # Logging utility
│
├── 🔗 shared/                      # Shared types & utilities
│   ├── 📄 package.json             # Shared config
│   ├── 📄 tsconfig.json            # TypeScript config
│   └── src/
│       ├── index.ts                # Exported types & constants
│       ├── types/                  # User, Meal, Quest types
│       ├── constants/              # App-wide constants
│       └── utils/                  # Shared utilities
│
└── 📚 docs/                        # Documentation
    ├── architecture.md             # System architecture
    ├── design-system.md            # UI/UX design system
    └── development.md              # Development guide
```

## 🎯 Key Features Implemented

### ✅ Complete
- [x] Next.js web app with landing page
- [x] React Native mobile app structure
- [x] Express backend scaffold
- [x] PostgreSQL database schema (comprehensive!)
- [x] Gamification calculation system
- [x] AI meal recognition service (with fallback)
- [x] Design system and styling
- [x] Documentation

### 🚀 Ready to Implement
- [ ] Authentication system (routes ready)
- [ ] Meal logging endpoints
- [ ] Quest and achievement system
- [ ] Social challenge features
- [ ] Real-time WebSocket integration
- [ ] UI component library

## 📊 Database Schema Highlights

**Core Models:**
- **User**: Profile, stats, authentication
- **Meal**: Nutritional data, AI recognition, flavor scores
- **Quest**: Challenges and progress tracking
- **Achievement**: Badge system
- **Challenge**: Social competitions
- **LeaderboardEntry**: Ranking cache

**Unique Features:**
- FlavorScore calculation (holistic metric)
- Carbon footprint tracking
- Streak management
- Level progression system

## 🛠️ Technology Stack

| Layer | Tech |
|-------|------|
| **Frontend (Web)** | Next.js 14, React 18, TypeScript, Tailwind CSS |
| **Frontend (Mobile)** | React Native, Expo, TypeScript |
| **Backend** | Node.js, Express, TypeScript |
| **Database** | PostgreSQL, Prisma ORM |
| **AI/ML** | Google Vision API, fallback recognition |
| **Real-time** | Socket.io |
| **State** | Zustand |
| **Authentication** | JWT + bcrypt |

## 🎨 Design Philosophy

- **Minimalist**: Clean, spacious interfaces
- **Zen-like**: Calming colors (sage, cream, charcoal)
- **Accessible**: WCAG 2.1 compliance
- **Functional**: Beauty serves usability
- **Type-safe**: Strict TypeScript everywhere

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Quick Setup
```bash
# Install all dependencies
npm run install:all

# Set up environment variables
cp backend/.env.example backend/.env
# Edit backend/.env with your database credentials

# Initialize database
cd backend
npm run prisma:generate
npm run migrate

# Start development
npm run dev:all
```

### Individual Development
```bash
npm run dev:web      # Web: http://localhost:3000
npm run dev:backend  # API: http://localhost:3001
npm run dev:mobile   # Expo
```

## 📖 Documentation Files

1. **[README.md](./README.md)** - Project overview and features
2. **[CONTRIBUTING.md](./CONTRIBUTING.md)** - Contribution guidelines
3. **[docs/architecture.md](./docs/architecture.md)** - System design
4. **[docs/design-system.md](./docs/design-system.md)** - UI/UX guide
5. **[docs/development.md](./docs/development.md)** - Developer guide
6. **[.github/copilot-instructions.md](./.github/copilot-instructions.md)** - Copilot guidelines

## 👥 Project Maintainers

- Create issues for bugs and feature requests
- Follow contributing guidelines
- Use conventional commits
- Reference issues in pull requests

## 📝 Next Steps

1. **Implement API Endpoints** (routes structure ready)
2. **Create UI Components** (design system complete)
3. **Add Database Migrations** (schema ready)
4. **Implement Authentication** (JWT setup ready)
5. **Add Real-time Features** (WebSocket scaffolded)
6. **Create Mobile Screens** (navigation ready)
7. **Deploy and Monitor** (Docker-ready)

## 🌟 Unique Selling Points

🎮 **Gamification** - Quest-based meal logging, achievements, streaks
🤖 **AI Recognition** - Photos to meals, instant nutritional data
👥 **Social Features** - Challenges, friends, leaderboards
🌿 **Sustainability** - Carbon footprint, environmental impact
✨ **Minimalist Design** - Zen aesthetics, focus on experience
🎯 **Flavor Score** - Holistic metric beyond calories

## 📄 License

MIT - See LICENSE file for details

---

**Built with ❤️ to make food tracking a joy, not a chore.**

Start building FoodJourney today! 🌍
