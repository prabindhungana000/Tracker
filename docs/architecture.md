# FoodJourney Architecture

## System Overview

FoodJourney is a modern, full-stack application architecture with three main components:

```
┌─────────────────────────────────────────────────────┐
│                Mobile App (React Native)             │
│              - Camera-based meal logging              │
│              - Offline-first architecture             │
│              - Real-time notifications                │
└───────────────────┬─────────────────────────────────┘
                    │
                    │ HTTP/WebSocket
                    ▼
┌─────────────────────────────────────────────────────┐
│             Backend API (Node.js + Express)          │
│              - REST API endpoints                     │
│              - WebSocket for real-time features      │
│              - Authentication & Authorization         │
│              - Business logic & gamification         │
│              - AI meal recognition integration       │
└───────────────┬──────────────────┬──────────────────┘
                │                  │
    📂 Database │                  │ 🤖 External APIs
    PostgreSQL  │                  │
                │                  ├─ Google Vision API
        Users   │                  ├─ Environmental Data API
        Meals   │                  └─ Recipe Database
        Quests  │
        etc.    │
```

## Frontend Architecture

### Web App (Next.js 14)
- **Framework**: React 18 + Next.js App Router
- **Styling**: Tailwind CSS with custom design system
- **State Management**: Zustand for global state
- **Charts**: Chart.js + React ChartJS2
- **Real-time**: Socket.io client
- **Type Safety**: TypeScript strict mode

**Key Pages:**
- `/` - Landing page
- `/app` - Protected app area
- `/app/dashboard` - Home with meal stats
- `/app/meals` - Meal logging and history
- `/app/quests` - Quest browser and progress
- `/app/challenges` - Social challenges
- `/app/leaderboard` - Rankings
- `/app/profile` - User profile and settings

### Mobile App (React Native with Expo)
- **Framework**: React Native with Expo SDK
- **Navigation**: React Navigation v6
- **State**: Zustand + AsyncStorage
- **Camera**: Expo Camera + Image Picker
- **Notifications**: Expo Notifications
- **Type Safety**: TypeScript

**Key Screens:**
- HomeScreen - Daily overview
- CameraScreen - Meal photo capture & recognition
- StatsScreen - Analytics dashboard
- ChallengesScreen - Active challenges
- ProfileScreen - User settings

## Backend Architecture

### API Server
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database ORM**: Prisma
- **Authentication**: JWT + bcrypt
- **Real-time**: Socket.io
- **Validation**: Zod
- **Type Safety**: TypeScript strict mode

### Microservices Approach
```
├── routes/
│   ├── auth.ts          - Login, register, token refresh
│   ├── meals.ts         - Meal CRUD and recognition
│   ├── quests.ts        - Quest management
│   ├── achievements.ts  - Achievement tracking
│   ├── challenges.ts    - Social challenges
│   ├── social.ts        - Friends and leaderboards
│   └── user.ts          - Profile and stats
│
├── controllers/
│   └── [resource]Controller.ts
│
├── services/
│   ├── mealRecognition.ts    - AI integration
│   ├── gamification.ts       - Quest, achievement logic
│   ├── sustainability.ts     - Carbon footprint calc
│   └── notification.ts       - Push notifications
│
└── middleware/
    ├── auth.ts          - JWT verification
    ├── validation.ts    - Request validation
    └── errorHandler.ts  - Centralized error handling
```

## Database Design

### Core Entities

#### User
- Profile information
- Authentication credentials
- Gamification stats (level, flavor score, streaks)
- Social relationships

#### Meal
- Nutritional data (calories, macros)
- Meal metadata (type, cuisine, mood, location)
- AI recognition results
- Flavor scores and carbon footprint

#### Gamification
- **Quest**: Repeatable challenges users can undertake
- **QuestProgress**: User's progress on individual quests
- **Achievement**: One-time unlockable badges
- **Challenge**: Timed community competitions

#### Social
- **Friends**: User-to-user relationships
- **ChallengeParticipation**: User participation in challenges
- **LeaderboardEntry**: Cached leaderboard rankings

#### AI Cache
- **MealRecognitionCache**: Cached AI recognition results

## Key Algorithms

### Flavor Score Calculation
```
FlavorScore = (NutritionScore × 0.4) + 
              (TasteScore × 0.3) + 
              (SustainabilityScore × 0.2) +
              (MoodBonus × 0.1)
```

- **NutritionScore**: Based on macro-nutrient balance
- **TasteScore**: Diversity of foods eaten
- **SustainabilityScore**: Environmental impact
- **MoodBonus**: User's emotional state while eating

### User Leveling
- Exponential progression curve
- Level based on cumulative Flavor Score
- Each level requires ~50% more points than previous

### Streak Calculation
- "Consistent Eater" achievement for daily logging
- Breaks if no meal logged for 24+ hours
- Longest streak tracked for statistics

## API Design

### REST Endpoints

#### Authentication
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/refresh
POST   /api/auth/logout
```

#### Meals
```
POST   /api/meals                    - Create meal
GET    /api/meals                    - Get user's meals
GET    /api/meals/:id                - Get specific meal
PUT    /api/meals/:id                - Update meal
DELETE /api/meals/:id                - Delete meal
POST   /api/meals/recognize          - AI meal recognition
GET    /api/meals/stats              - Meal statistics
```

#### Quests
```
GET    /api/quests                   - List available quests
GET    /api/quests/:id               - Get quest details
GET    /api/quests/:id/progress      - User's quest progress
POST   /api/quests/:id/participate   - Join quest
POST   /api/quests/:id/complete      - Complete quest
```

#### Achievements
```
GET    /api/achievements             - List achievements
GET    /api/achievements/unlocked    - User's unlocked
GET    /api/achievements/:id         - Achievement details
```

#### Social
```
GET    /api/friends                  - List friends
POST   /api/friends/:id/add          - Add friend
DELETE /api/friends/:id              - Remove friend
GET    /api/challenges               - List challenges
POST   /api/challenges/:id/join      - Join challenge
GET    /api/leaderboard              - Get leaderboard
```

#### User
```
GET    /api/user/profile             - Get user profile
PUT    /api/user/profile             - Update profile
GET    /api/user/stats               - Get user statistics
GET    /api/user/achievements        - Get achievements
```

## Real-time Features (WebSocket)

### Socket Events
```javascript
// Meal Updates
'meal-logged'           - New meal logged by friend
'meal-recognized'       - AI recognition complete

// Challenge Updates
'challenge-started'     - New challenge available
'challenge-update'      - Score update in challenge
'challenge-finished'    - Challenge completed

// Social Events
'friend-joined'         - New friend
'achievement-unlocked'  - Any user achievement

// Notifications
'push-notification'     - Server-sent notification
```

## Security Considerations

### Authentication
- JWT tokens with short expiration (15 min)
- Refresh tokens stored securely
- Password hashing with bcrypt (10+ rounds)

### Authorization
- Role-based access control (user levels can affect features)
- User can only access their own data by default
- Admin endpoints for management

### Data Protection
- HTTPS/TLS for all communication
- Password never stored in plain text
- PII encrypted at rest
- Rate limiting on auth endpoints
- CORS properly configured

### API Security
- Input validation on all endpoints (Zod)
- SQL injection prevention (Prisma parameterized queries)
- XSS protection (React auto-escapes)
- CSRF tokens for state-changing operations

## Deployment

### Production Deployment
```
├── Web (Vercel)
│   - Auto-deployment from GitHub
│   - CDN distribution
│   - Next.js edge functions
│
├── Backend (AWS/Railway)
│   - Docker containerization
│   - Auto-scaling
│   - Health checks and monitoring
│
├── Database (AWS RDS PostgreSQL)
│   - Multi-AZ deployment
│   - Automated backups
│   - Point-in-time recovery
│
└── Storage (AWS S3/Cloudflare)
    - Meal image storage
    - CDN integration
```

### Environment Configuration
```
Development:    localhost, test data
Staging:        Pre-production mirror
Production:     Live environment, customer data
```

## Performance Optimization

### Frontend
- Code splitting per route
- Image optimization with Next.js Image
- CSS-in-JS minimization
- Service Worker for offline support

### Backend
- Database query optimization with Prisma
- Caching strategy for recognition results
- Pagination for large datasets
- Compression for API responses

### Mobile
- Lazy loading of images
- Efficient state updates
- Offline-first data sync
- Push notification batching

## Monitoring & Analytics

- Server error tracking (Sentry)
- Application performance monitoring (New Relic)
- User analytics (Mixpanel)
- Database performance metrics

## Future Enhancements

- Machine learning for better recognition accuracy
- Social features expansion (groups, team challenges)
- Advanced nutritional analysis
- Integration with wearable devices
- AR meal visualization
- Multi-language support
