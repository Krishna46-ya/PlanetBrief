# AttendX — Attendance Crisis Management Website

> A modern, full-featured attendance tracking and calculator web app built with **Next.js 14**, **TypeScript**, and **Framer Motion**. Designed to help students detect and recover from attendance crises before it's too late.

---

## Table of Contents

- [Preview](#preview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Pages](#pages)
- [Calculator Logic](#calculator-logic)
- [Design System](#design-system)
- [Components](#components)
- [Responsive Breakpoints](#responsive-breakpoints)
- [Sections — Landing Page](#sections--landing-page)
- [Features — Calculator Page](#features--calculator-page)
- [Known TypeScript Fixes](#known-typescript-fixes)
- [Environment](#environment)
- [License](#license)

---

## Preview

| Page | Route | Description |
|---|---|---|
| Landing Page | `/` | Full marketing site with 16 sections |
| Calculator | `/calculate` | Multi-subject attendance calculator with graphs |

---

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| [Next.js](https://nextjs.org/) | 14+ | App Router, file-based routing, SSR |
| [TypeScript](https://www.typescriptlang.org/) | 5+ | Full type safety across all files |
| [Framer Motion](https://www.framer.com/motion/) | 11+ | Animations, transitions, AnimatePresence |
| React | 18+ | Hooks — `useState`, `useRef`, `useEffect`, `useInView` |
| Google Fonts | — | Syne (display) + JetBrains Mono (numbers) |

No UI library. No Tailwind. All styling is done via inline `style` props and scoped `<style>` blocks — fully self-contained with zero external CSS dependencies.

---

## Project Structure

```
your-nextjs-app/
├── app/
│   ├── page.tsx                  ← Landing page (Home)
│   └── calculate/
│       └── page.tsx              ← Calculator page
├── public/
├── package.json
├── tsconfig.json
└── README.md
```

---

## Getting Started

### 1. Create a Next.js project

```bash
npx create-next-app@latest attendx --typescript --app
cd attendx
```

> Do **not** select Tailwind if you want zero conflicts — the project uses its own styling system.

### 2. Install dependencies

```bash
npm install framer-motion
```

### 3. Place the files

```
app/page.tsx                  ← landing page
app/calculate/page.tsx        ← calculator page
```

### 4. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for production

```bash
npm run build
npm start
```

---

## Pages

### `/` — Landing Page (`app/page.tsx`)

The full marketing and information site. Contains 16 complete sections. All CTA buttons — "Get Started" in the nav, "Calculate Now →" in the hero, and "Calculate My Attendance →" in the CTA banner — route to `/calculate` using Next.js `<Link>`.

### `/calculate` — Calculator Page (`app/calculate/page.tsx`)

The core tool. Allows users to input data for up to 10 subjects, select a custom attendance threshold, and view a rich graphical breakdown of their attendance status.

---

## Calculator Logic

### Percentage Formula

```
attendance_percentage = (classes_attended / total_classes_held) × 100
```

Rounded to 1 decimal place:

```typescript
const pct = Math.round((present / total) * 1000) / 10;
```

### Status Thresholds

| Percentage | Status | Color | Meaning |
|---|---|---|---|
| ≥ 85% | Safe Zone | `#00e5a0` Green | Well within limit, can afford to skip |
| ≥ 75% | Borderline | `#f5c842` Amber | At minimum threshold, no room for absence |
| ≥ 60% | Critical | `#ff8c42` Orange | Below minimum, must attend all classes |
| < 60% | Danger Zone | `#ff3a5c` Red | Severely short, debarment risk |

### Recovery Formula

How many consecutive classes to attend to reach 75%:

```
classes_needed = ceil((0.75 × total − present) / (1 − 0.75))
```

```typescript
const needToAttend = Math.max(0, Math.ceil((0.75 * total - present) / 0.25));
```

### Safe-to-Skip Formula

How many more classes can be missed while staying above 75%:

```
can_skip = floor((present − 0.75 × total) / 0.75)
```

```typescript
const canSkip = Math.floor((present - 0.75 * total) / 0.75);
```

### Overall Attendance (Multi-Subject)

Aggregated across all subjects:

```
overall_percentage = (Σ present_i / Σ total_i) × 100
```

---

## Design System

### Typography

| Font | Usage | Weight |
|---|---|---|
| [Syne](https://fonts.google.com/specimen/Syne) | All headings, body text, UI labels | 400 / 600 / 700 / 800 |
| [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono) | Percentages, numbers, counters | 400 / 500 / 700 |

Loaded via Google Fonts inside a scoped `<style>` block — no `next/font` required.

### Color Palette

```
--bg       #080c14                    Page background (deepest)
--bg2      #0e1420                    Card / section background
--bg3      #131b2e                    Input / inner element background
--border   rgba(255,255,255,0.08)     Subtle dividers and card borders
--muted    #8892a4                    Secondary / label text
--red      #ff3a5c                    Primary accent — danger, CTA buttons
--amber    #f5c842                    Warning state
--green    #00e5a0                    Safe state
--blue     #4d9fff                    Info state
```

### Animation

All animations use Framer Motion with a shared cubic-bezier easing:

```typescript
const EASE = [0.22, 1, 0.36, 1] as const;
```

> The `as const` assertion is **required** — without it TypeScript infers `number[]` which is incompatible with Framer Motion's `Easing` type.

| Pattern | Implementation |
|---|---|
| Scroll-triggered fade-up | `useInView` + `variants` with `staggerChildren` |
| Page entry | `y: -60, opacity: 0` → `y: 0, opacity: 1` |
| Accordion expand/collapse | `AnimatePresence` + `height: 0 → "auto"` |
| Progress bar fill | `animate={{ width: "X%" }}` with 1.1s ease |
| SVG arc gauge | CSS `transition` on `stroke-dasharray` |
| Card hover lift | `whileHover={{ scale: 1.02 }}` |

---

## Components

### `Section` (Landing Page)

Reusable scroll-triggered section wrapper:

```typescript
interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  style?: React.CSSProperties;
}
```

Uses `useInView` to fire `"hidden"` → `"visible"` variants with `staggerChildren: 0.08`.

### `CircularGauge` (Calculator Page)

Pure SVG circular arc gauge — no canvas, no chart library.

```typescript
function CircularGauge({
  percentage: number;
  status: Status;
  size?: number;   // default: 200
})
```

- Draws a background track ring and an animated arc via `stroke-dasharray`
- Applies `<linearGradient>` and `<feGaussianBlur>` glow filter per status color
- Animates via CSS `transition` after a 100ms mount delay

### `ProgressBar` (Calculator Page)

Animated horizontal bar with threshold tick marks at 60%, 75%, and 85%. Animates width from `0` to `percentage%` on scroll entry via `useInView`.

### `RadarChart` (Calculator Page)

SVG spider/radar chart rendered when 3 or more subjects are present. Shows relative attendance across all subjects on a single polygon. Hidden below 900px via `.radar-hide`.

---

## Responsive Breakpoints

| Breakpoint | Behaviour |
|---|---|
| `> 900px` | Full layout — radar chart visible, multi-column grids |
| `≤ 900px` | Radar chart hidden |
| `≤ 640px` | Single-column input grid, results stack vertically, reduced padding |

Key responsive CSS classes applied inline:

| Class | Effect on mobile |
|---|---|
| `.subject-grid` | 3-col → 2-col |
| `.subject-name` | Spans full width |
| `.results-grid` | `minmax(340px,1fr)` → `1fr` |
| `.overall-grid` | 3-col → 2-col |
| `.radar-hide` | `display: none` below 900px |
| `.page-pad` | Reduces page padding |
| `.hero-title` | Clamps font size down |
| `.calc-card` | Reduces card padding |

---

## Sections — Landing Page

| # | Section | Details |
|---|---|---|
| 1 | **Header / Nav** | Fixed, blur backdrop, logo, 6 nav links, CTA → `/calculate`, hamburger menu |
| 2 | **Hero** | Headline, subheadline, dual CTAs → `/calculate`, stats row, floating badge |
| 3 | **Logo Ticker** | Infinite CSS marquee of institution names |
| 4 | **Attendance Calculator** | Inline widget with live progress bar and recovery message |
| 5 | **Features** | 6-card grid — icons, titles, descriptions |
| 6 | **How It Works** | 4-step numbered process with connector arrows |
| 7 | **About** | Company story, mission/vision card, 3 stats |
| 8 | **Benefits** | 3 comparison bullets + feature comparison table |
| 9 | **Testimonials** | 4 review cards with star ratings and avatars |
| 10 | **Case Studies** | 3 metric cards with results |
| 11 | **Pricing** | 3-tier table — Free / Pro / Institution |
| 12 | **FAQ** | Accordion with AnimatePresence |
| 13 | **Blog** | 3 article cards with tag badges |
| 14 | **Newsletter** | Email input with confirmation state |
| 15 | **CTA Banner** | Conversion section → `/calculate` |
| 16 | **Contact** | Contact info + form |
| 17 | **Footer** | 4-column links, social links, copyright |

---

## Features — Calculator Page

| Feature | Description |
|---|---|
| Multi-subject input | Add 1–10 subjects with name, attended count, total count |
| Live inline preview | Progress bar appears under each row as you type |
| Threshold selector | Toggle between 60% / 75% / 85% minimum requirement |
| Overall summary card | Circular gauge, aggregate stats, radar chart (3+ subjects) |
| Per-subject result cards | Mini gauge + progress bar + status badge + recovery message |
| Comparison bar chart | All subjects sorted by attendance with threshold marker |
| Recovery planner | Exact classes to attend or skip per subject |
| Save Report | `window.print()` to save or print results |
| Reset | Clears all inputs and results |
| Zero data storage | All calculations run client-side only |

---

## Known TypeScript Fixes

### 1. Framer Motion `ease` type error

**Error:** `Type 'number[]' is not assignable to type 'Easing'`

**Fix:** Use `as const` to narrow the array to a readonly tuple:

```typescript
// ❌ Wrong — TypeScript infers number[]
ease: [0.22, 1, 0.36, 1]

// ✅ Correct — narrowed to readonly [0.22, 1, 0.36, 1]
const EASE = [0.22, 1, 0.36, 1] as const;
// then use:
ease: EASE
```

### 2. `Section` component missing `id` / `style` props

**Error:** `Property 'id' does not exist on type 'IntrinsicAttributes & { children: ReactNode; className?: string }'`

**Fix:** Extend the props interface:

```typescript
interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  style?: React.CSSProperties;
}
```

---

## Environment

```
Node.js        ≥ 18.x
Next.js        14.x / 15.x
TypeScript     5.x
framer-motion  11.x
```

---

## License

MIT — free to use, modify, and distribute.

---

Built with ❤️ for students who refuse to let attendance ruin their semester.
