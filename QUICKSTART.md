# FoodJourney - Quick Start Guide

## 🚀 Get Started in 5 Steps

### 1️⃣ Install Dependencies
```bash
npm run install:all
```

### 2️⃣ Configure Supabase + Vercel Env
```bash
# Backend env
cp backend/.env.example backend/.env
cp web/.env.example web/.env.local

# Edit backend/.env and add:
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.your-project.supabase.co:5432/postgres
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
GOOGLE_VISION_API_KEY=your-key-optional
FRONTEND_URL=http://localhost:3000

# Edit web/.env.local and add:
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 3️⃣ Initialize Database
```bash
cd backend
npm run prisma:generate
npm run migrate
# Optional: npm run seed  # Load sample data
cd ..
```

### 4️⃣ Start Development
```bash
# All servers at once
npm run dev:all

# Or individually:
npm run dev:web      # Web: http://localhost:3000
npm run dev:backend  # API: http://localhost:3001
npm run dev:mobile   # Mobile: Expo
```

### 5️⃣ Start Building! 🎯

---

## 📚 What's Ready to Use

### Backend Services ✅
- **Social Service** - Friends, leaderboards, challenges
  ```typescript
  await socialService.addFriend(userId, friendId);
  await socialService.getLeaderboards('flavorScore', 50);
  await socialService.joinChallenge(userId, challengeId);
  ```

- **Meal Recognition** - AI + fallback
  ```typescript
  const result = await recognizeMeal(imageUrl);
  // Returns: items, confidence, nutrition estimate
  ```

- **Gamification** - All algorithms ready
  ```typescript
  const score = calculateFlavorScore(nutrition, taste, sustainability);
  const level = calculateLevel(totalFlavorScore);
  ```

### Components ✅

**Web Components** (`web/components/`)
```tsx
<Button variant="primary" size="lg">Click me</Button>
<Card><CardHeader title="Title" /></Card>
<Badge variant="success">Achievement Unlocked</Badge>
<StatBlock icon="🎯" label="Flavor Score" value={2450} />
<Leaderboard entries={data} metric="flavorScore" />
<ChallengeCard {...challengeData} />
```

**Mobile Components** (`mobile/components/`)
```tsx
<MobileButton title="Log Meal" onPress={() => {}} />
<MobileCard><Text>Content</Text></MobileCard>
<MobileProgressRing value={45} max={100} label="Daily Goal" />
```

### Database ✅
All 11 models ready to use with Prisma:
```typescript
// User with stats
await prisma.user.create({
  data: {
    email, username, passwordHash,
    profile: { create: { ... } }
  }
});

// Meal with AI results
await prisma.meal.create({
  data: {
    mealName, calories, cuisineType,
    recognizedItems: ['chicken', 'rice'],
    flavorScore: 85
  }
});

// Quest progress
await prisma.questProgress.create({
  data: { userId, questId, progress: 3 }
});
```

---

## 🎯 Implementation Checklist

### Phase 2A: Authentication (2-3 days)
- [x] Link Supabase Auth to the web app
- [x] Add GitHub OAuth sign-in
- [x] Add email/password auth through Supabase
- [x] Sync Supabase sessions with backend users
- [x] Create login form (web)
- [ ] Create signup screen (mobile)

### Phase 2B: Meal Logging (3-4 days)
- [ ] Implement `POST /api/meals` endpoint
- [ ] Add meal calculation logic
- [ ] Implement `GET /api/meals` with pagination
- [ ] Create meal form (web)
- [ ] Create camera screen (mobile)
- [ ] Add AI recognition integration
- [ ] Integrate Flavor Score calculation

### Phase 2C: Quests & Achievements (2-3 days)
- [ ] Implement `/api/quests` endpoints
- [ ] Create quest progress checking
- [ ] Add achievement unlocking logic
- [ ] Create quests UI (web)
- [ ] Create quests screen (mobile)
- [ ] Add notifications for unlocks

### Phase 2D: Challenges & Social (3-4 days)
- [ ] Implement `/api/challenges` endpoints
- [ ] Set up WebSocket handlers
- [ ] Create challenge UI (web)
- [ ] Add leaderboard display
- [ ] Create friend system UI
- [ ] Test real-time updates

### Phase 2E: Analytics & Dashboard (2-3 days)
- [ ] Create dashboard page (web)
- [ ] Add charts and visualizations
- [ ] Create home screen (mobile)
- [ ] Display user stats
- [ ] Show recent meals
- [ ] Display upcoming challenges

---

## 🔑 Key Files to Know

### Backend
- `src/index.ts` - Main server
- `src/services/` - Business logic (ready to use!)
- `src/routes/social.ts` - Social endpoints template
- `prisma/schema.prisma` - Database schema

### Web
- `styles/globals.css` - Design system
- `components/` - Reusable components (ready to use!)
- `app/` - Pages (create routes here)
- `lib/api/` - API client (set up endpoints here)

### Mobile
- `app/index.tsx` - Navigation setup
- `services/api.ts` - API client
- `screens/` - Create screens here
- `components/` - Reusable components (ready to use!)

---

## 💻 Common Commands

```bash
# Development
npm run dev:all              # Start everything
npm run dev:web             # Web only
npm run dev:backend         # API only
npm run type-check          # TypeScript check

# Database
npm run migrate             # Run migrations
npx prisma studio         # Visual DB editor
npm run seed               # Load sample data

# Deployment
npm run build:web          # Build web
npm run build:backend      # Build API
docker build -t app .      # Docker image

# Testing
npm test                   # Run tests
npm run lint               # Linting
```

---

## 🎓 Learning Resources

- **Architecture**: Read `docs/architecture.md`
- **Design**: Review `docs/design-system.md`
- **Development**: Check `docs/development.md`
- **Contributing**: See `CONTRIBUTING.md`

---

## 🐛 Troubleshooting

**Port already in use?**
```bash
lsof -i :3001
kill -9 <PID>
```

**Database connection failed?**
```bash
# Check environment variable
echo $DATABASE_URL

# Test connection
psql $DATABASE_URL -c "SELECT 1"
```

**Module not found?**
```bash
npm run type-check
rm -rf node_modules
npm run install:all
```

---

## 🚀 What's Next?

1. **Pick a feature** - Start with authentication or meals
2. **Implement endpoint** - Follow REST patterns
3. **Build UI** - Use provided components
4. **Test** - Add unit tests
5. **Iterate** - Get feedback and refine

---

## 📞 Need Help?

- Check `docs/development.md` for detailed guides
- Review API examples in routes
- Look at schema.prisma for data structure
- Search components folder for similar patterns

---

## 🎉 You're Ready!

Everything is set up. The hard part is done. Now comes the fun part: **bringing FoodJourney to life!**

Good luck, and make it awesome! 🌍

---

**Happy coding!** ✨
