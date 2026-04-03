# FoodJourney Project - Copilot Instructions

## Project Overview
FoodJourney is a unique full-stack food tracking application combining:
- Gamification (quests, achievements, streaks)
- AI meal recognition
- Social features (challenges, leaderboards)
- Minimalist design philosophy
- Environmental sustainability tracking

## Technology Stack
- **Web**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Mobile**: React Native, Expo, TypeScript
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **AI**: Google Vision API for meal recognition
- **Real-time**: Socket.io for social features

## Project Structure
```
FoodJourney/
├── web/          - Next.js web frontend
├── mobile/       - React Native mobile app
├── backend/      - Express API server
├── shared/       - Shared types and utilities
└── docs/         - Documentation
```

## Key Development Priorities
1. **Unique Design**: Minimalist, Zen aesthetic with mood-based analytics
2. **Gamification**: Quest, achievement, and streak systems
3. **AI Integration**: Photo-based meal recognition
4. **Social First**: Friends, challenges, leaderboards
5. **Code Quality**: TypeScript, tests, documentation

## Coding Standards
- TypeScript preferred across all projects
- ESLint + Prettier for code formatting
- Modular component architecture
- Comprehensive error handling
- Type-safe API routes

## Important Notes
- This is a **unique, original design** - avoid common calorie tracker tropes
- Focus on user experience and engagement over feature bloat
- Sustainability and environmental impact are key differentiators
- Privacy-first approach to personal data
- Mobile-first at core, web as secondary platform

## Setup Commands
```bash
npm run install:all   # Install all dependencies
npm run dev:all       # Run web + backend
npm run dev:web       # Web only
npm run dev:backend   # Backend only
npm run dev:mobile    # Mobile Expo
```
