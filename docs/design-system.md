# FoodJourney - Design System

## Color Palette

The FoodJourney design uses a minimalist, nature-inspired color palette:

### Primary Colors
- **Sage** (#9CAF88) - Primary action color, calm and natural
- **Charcoal** (#2C2C2C) - Text and dark elements
- **Cream** (#F5F3EF) - Background, light and warm
- **Warm Accent** (#D4A574) - Highlights, food-related warmth
- **Success** (#7CBC8C) - Positive actions, achievements

### Secondary Colors
- **Warning** (#F4A460) - Caution, important info
- **Error** (#D94949) - Errors and alerts
- **Muted Gray** (#999999) - Inactive, secondary text

## Typography

### Font Family
- Primary: System fonts (-apple-system, BlinkMacSystemFont, Segoe UI)
- Fallback: Helvetica Neue, sans-serif
- Rationale: Native feel, optimal readability, zero-load performance

### Type Scale
```
H1: 48px (desktop), 32px (mobile) - Page titles
H2: 36px (desktop), 28px (mobile) - Section headers
H3: 28px (desktop), 24px (mobile) - Subsections
H4: 24px (desktop), 20px (mobile) - Card titles
Body: 16px - Default text
Small: 14px - Secondary text
Micro: 12px - Labels, badges
```

### Font Weights
- Regular (400) - Body text
- Medium (500) - Emphasized text
- Semibold (600) - Headers

## Components

### Card
- White background with subtle shadow
- Rounded corners (8px)
- Padding: 24px
- Hover: Shadow increase, sage border

### Button
- Rounded corners (8px)
- Padding: 12px 24px
- Height: 44px (touch target minimum)

**States:**
- Primary: Sage background, white text
- Secondary: White background, sage border
- Ghost: Transparent, sage text
- Disabled: 50% opacity

### Input Fields
- Rounded corners (8px)
- Padding: 12px 16px
- Border: 2px solid gray-200
- Focus: Sage border, subtle shadow
- Transition: 200ms ease

### Badge
- Rounded pill shape (24px height)
- Padding: 4px 12px
- Font size: 12px
- Font weight: Medium

**Variants:**
- Success: Green background
- Warning: Yellow background
- Info: Sage background

## Spacing System

Consistent 8px base unit:
- XS: 2px
- SM: 4px
- MD: 8px
- LG: 12px
- XL: 16px
- 2XL: 24px
- 3XL: 32px

## Animations

### Transitions
- Quick: 200ms (hover states)
- Normal: 300ms (modal open/close)
- Slow: 500ms (page transitions)

### Easing Functions
- ease-out: User action feedback
- ease-in-out: Smooth navigation
- ease-in: Exit animations

### Micro-interactions
- Button scale: 0.95x on press
- Card lift: Shadow + 2px translate on hover
- Fade in: 0.5s ease-out on mount

## Responsive Design

### Breakpoints
- Mobile: 0px - 640px
- Tablet: 641px - 1024px
- Desktop: 1025px+

### Layout Principles
- Mobile-first design
- Single column on mobile, grid on larger screens
- Readable line lengths (40-70 characters)
- Touch-friendly targets (min 44x44px)

## Accessibility

- **Color Contrast**: WCAG AA compliance minimum
- **Focus States**: Visible keyboard navigation
- **Alt Text**: All images labeled
- **ARIA Labels**: Interactive elements properly marked
- **Keyboard Navigation**: All features keyboard accessible

## Dark Mode (Future)

When implemented, use:
- Charcoal (#2C2C2C) as base
- Cream (#F5F3EF) becomes inverted
- Sage (#9CAF88) remains consistent

## Brand Elements

### Logo
- Emoji-based: 🌍 (Earth) or 🍽️ (Plate)
- Logotype: "FoodJourney" in medium weight

### Mood Board
- Zen-like simplicity
- Nature-inspired aesthetics
- Minimalist philosophy
- Warm, inviting atmosphere

### Brand Voice
- Encouraging and supportive
- Playful but not childish
- Focused on personal growth
- Environmental consciousness

## Usage Guidelines

### Do's
- ✅ Use ample whitespace
- ✅ Keep interfaces simple
- ✅ Use sage for primary actions
- ✅ Maintain visual hierarchy
- ✅ Respect user attention

### Don'ts
- ❌ Don't use more than 3 colors per section
- ❌ Don't clutter with decorative elements
- ❌ Don't use animations excessively
- ❌ Don't ignore accessibility
- ❌ Don't break the spacing system

## Implementation

### CSS Custom Properties
```css
:root {
  --color-sage: #9CAF88;
  --color-cream: #F5F3EF;
  --color-charcoal: #2C2C2C;
  --color-warm-accent: #D4A574;
  --spacing-xs: 0.25rem;
  /* ... */
}
```

### Tailwind Configuration
See `web/tailwind.config.js` for Tailwind customization.

## Component Library

Reusable components are located in:
- **Web**: `web/components/`
- **Mobile**: `mobile/components/`

All components should:
1. Follow the design system
2. Be fully typed (TypeScript)
3. Be accessible (WCAG 2.1)
4. Have consistent APIs
5. Support dark mode (future)
