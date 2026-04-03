# FoodJourney - Development Guide

## Project Setup

### Prerequisites
- Node.js 18+ (LTS)
- npm or yarn
- PostgreSQL 14+
- Git

### Quick Start

1. **Clone the repository**
   ```bash
   git clone [repository]
   cd Tracking
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**
   ```bash
   # Backend
   cp backend/.env.example backend/.env
   
   # Update backend/.env with:
   DATABASE_URL=postgresql://user:password@localhost:5432/foodjourney
   JWT_SECRET=your-secret-key
   GOOGLE_VISION_API_KEY=your-api-key
   
   # Frontend
   cp web/.env.example web/.env.local
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```

4. **Initialize database**
   ```bash
   cd backend
   npm run prisma:generate
   npm run migrate
   npm run seed  # Optional: load sample data
   ```

5. **Start development servers**
   ```bash
   # From root directory
   npm run dev:all
   ```

   Or run individually:
   ```bash
   npm run dev:web      # Web: http://localhost:3000
   npm run dev:backend  # API: http://localhost:3001
   npm run dev:mobile   # Mobile: Expo
   ```

## Development Workflow

### Feature Development

1. **Create feature branch**
   ```bash
   git checkout -b feature/meal-logging
   ```

2. **Develop and test**
   - Make changes following the architecture
   - Run type checking: `npm run type-check`
   - Run linting: `npm run lint`

3. **Commit with conventional commits**
   ```bash
   git commit -m "feat: add meal logging functionality"
   ```

4. **Push and create pull request**
   ```bash
   git push origin feature/meal-logging
   ```

### Code Structure

**Backend** - Clean Architecture:
```
src/
├── routes/        - Express route handlers
├── controllers/   - Request handling logic
├── services/      - Business logic
├── middleware/    - Middleware functions
├── db/           - Database setup
├── utils/        - Utilities and helpers
└── types/        - TypeScript definitions
```

**Web** - Next.js App Router:
```
app/
├── (auth)/       - Auth routes
├── (app)/        - Protected app routes
├── api/          - API routes
├── layout.tsx    - Root layout
└── page.tsx      - Home page

components/
├── ui/           - Reusable UI components
├── features/     - Feature-specific components
└── providers/    - React context providers

lib/
├── api/          - API client
├── hooks/        - Custom hooks
├── utils/        - Utility functions
└── store/        - Zustand stores
```

**Mobile** - Expo with Expo Router:
```
app/
├── (tabs)/       - Tab navigation
├── (auth)/       - Auth screens
└── _layout.tsx   - Root layout

screens/
├── HomeScreen/
├── CameraScreen/
└── ...

components/
├── ui/           - Reusable components
└── features/     - Feature components

services/
├── api.ts        - API client
└── store.ts      - State management
```

## Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd web
npm test
```

### Integration Tests
```bash
npm run test:integration
```

## Database

### Migrations

Create a new migration:
```bash
cd backend
npx prisma migrate dev --name add_new_field
```

Apply migrations:
```bash
npm run migrate        # Development
npm run migrate:prod   # Production
```

Review migrations:
```bash
npx prisma migrate status
```

### Database Seeding

Add seed data:
```bash
cd backend
npm run seed
```

See `backend/prisma/seed.ts` for seed implementation.

## API Development

### Creating a New Endpoint

1. **Define route in `routes/[name].ts`**
   ```typescript
   import express from 'express';
   
   const router = express.Router();
   
   router.post('/', create);
   router.get('/', list);
   router.get('/:id', getById);
   
   export default router;
   ```

2. **Implement controller in `controllers/[name]Controller.ts`**
   ```typescript
   export async function create(req, res) {
     // Validation
     // Business logic
     // Response
   }
   ```

3. **Register in main `index.ts`**
   ```typescript
   app.use('/api/resource', resourceRoutes);
   ```

### API Response Format
```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
```

All responses should follow this format.

## Performance Optimization

### Frontend Optimization

- Image optimization with `next/image`
- Code splitting per route
- CSS minimization
- Bundle size monitoring

### Backend Optimization

- Database query caching
- Request/response compression
- Rate limiting
- Connection pooling

### Mobile Optimization

- Lazy loading screens
- Efficient re-renders
- Image compression
- Offline-first sync

## Debugging

### Backend Debugging

Using VS Code:
```json
{
  "type": "node",
  "request": "launch",
  "program": "${workspaceFolder}/backend/src/index.ts",
  "preLaunchTask": "tsc"
}
```

Console logging:
```typescript
import { logger } from './utils/logger';
logger.info('Message', { context });
```

### Frontend Debugging

- Use React DevTools browser extension
- Next.js debug output in terminal
- Browser DevTools Network tab

### Database Debugging

```bash
# Open Prisma Studio
npx prisma studio
```

## Git Workflow

### Conventional Commits
```
feat: add meal recognition feature
fix: resolve authentication bug
docs: update API documentation
style: format code with prettier
refactor: simplify gamification logic
perf: optimize database queries
test: add meal creation tests
chore: update dependencies
```

### Branch Naming
```
feature/    - New features
bugfix/     - Bug fixes
hotfix/     - Critical production fixes
docs/       - Documentation updates
refactor/   - Code refactoring
perf/       - Performance improvements
test/       - Test additions
chore/      - Maintenance tasks
```

## Deployment

### Web (Vercel)
```bash
npm run build:web
# Set environment variables in Vercel dashboard
# Auto-deploy from GitHub
```

### Backend (Docker + Railway/AWS)
```bash
npm run build:backend
docker build -t foodjourney-api .
docker run -e DATABASE_URL=... foodjourney-api
```

### Database Backup
```bash
# PostgreSQL backup
pg_dump foodjourney > backup.sql

# Restore
psql foodjourney < backup.sql
```

## Troubleshooting

### Port Already in Use
```bash
# Find and kill process using port
lsof -i :3001
kill -9 <PID>
```

### Database Connection Issues
```bash
# Check connection string
echo $DATABASE_URL

# Test connection
psql $DATABASE_URL -c "SELECT 1"
```

### Module Not Found
```bash
# Rebuild project
npm run type-check

# Clear Next.js cache
rm -rf .next
```

### Dependencies Issue
```bash
# Clear node_modules
rm -rf node_modules package-lock.json
npm run install:all
```

## Resources

- [Next.js Docs](https://nextjs.org)
- [React Native Docs](https://reactnative.dev)
- [Express Docs](https://expressjs.com)
- [Prisma Docs](https://www.prisma.io/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

## Code Review Checklist

- [ ] Follows project structure
- [ ] No console.log statements
- [ ] Type-safe (TypeScript strict)
- [ ] Error handling implemented
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No hardcoded values
- [ ] Performance considered
- [ ] Accessibility checked
- [ ] Security verified
