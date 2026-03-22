# 🌍 Planet Brief

> A climate change awareness web app built for youth — explore the facts, test your knowledge, and discover actions that make a real difference.

Built with **Next.js 14**, **TypeScript**, and **Motion** as a college group project.

---

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page — hero, key stats, action tips, quiz CTA |
| `/quiz` | 6-question climate IQ quiz with scoring and results |

---

## Tech Stack

- **[Next.js 14](https://nextjs.org/)** — App Router, file-based routing
- **TypeScript** — full type safety across all components
- **[Motion](https://motion.dev/)** — page transitions, scroll animations, micro-interactions
- **Google Fonts** — Playfair Display for headings

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/planet-brief.git
cd planet-brief

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

---

## Project Structure

```
planet-brief/
├── app/
│   ├── layout.tsx          # Root layout with metadata & fonts
│   ├── page.tsx            # Landing page
│   └── quiz/
│       └── page.tsx        # Quiz page
├── public/
│   └── favicon-512x512.png
├── README.md
└── package.json
```

---

## Features

- **Climate facts** — four key statistics presented on the landing page
- **Action tips** — six categorised tips with impact ratings (Medium → Very High)
- **Interactive quiz** — 6 questions, animated answer feedback, fact reveals, and a results screen with score tiers
- **Smooth animations** — word-by-word hero reveal, scroll-triggered section entries, parallax rings, and animated progress ring on the quiz
- **Fully responsive** — works on mobile, tablet, and desktop
- **No login required** — fully static, no backend or database

---

## Quiz Score Tiers

| Score | Tier |
|-------|------|
| 0 – 2 | Climate Newcomer |
| 3 – 4 | Climate Aware |
| 5 | Climate Literate |
| 6 | Climate Champion |

---


## Acknowledgements

- Climate data sourced from [IPCC](https://www.ipcc.ch/), [NASA](https://climate.nasa.gov/), and [Our World in Data](https://ourworldindata.org/)
- Built as part of a college project on increasing climate change awareness among youth

---

## License

This project is for educational purposes only.