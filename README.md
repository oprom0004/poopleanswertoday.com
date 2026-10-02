# Poople Answer Today (poopleanswertoday.com)

A high-performance, SEO/GEO-optimized companion website and solver for the daily **Poople** (word ladder to POOP) game.

## 🚀 Key Features & Competitive Advantages over pooplehints.com

1. **Exact Match Domain (EMD)**: Built specifically for `poopleanswertoday.com` to capture the highest-intent daily search query (`poople answer today`).
2. **Advanced SEO & GEO Architecture**:
   - **Rich Schema.org**: `FAQPage`, `HowTo` (with step-by-step ladder actions), `BreadcrumbList`, `SoftwareApplication`, and `Game`.
   - **AI Direct Answer Block (GEO)**: Structured summaries tailored for Google AI Overviews, Perplexity, and ChatGPT Search.
   - **Enhanced Content Depth**: Each step includes transitional word definitions, first-move trap warnings, and difficulty distribution to satisfy Google's Helpful Content System.
3. **Core Utility Suite**:
   - **Daily Answer & Hints**: Progressive spoiler-free clues (Step count → First position → First word → Full solution).
   - **In-Page Interactive Game**: Play right inside the site with on-screen/physical keyboard and Stink-O-Meter distance tracker.
   - **Wordle-style Emoji Share**: One-click results copying for viral social sharing.
   - **Universal Poople Solver**: Lightning-fast BFS solver calculating shortest paths for any 4-letter English word.
   - **Unlimited Practice Mode**: Infinite word ladders from randomized starting words.
   - **Complete Historical Archive**: Full database with search and difficulty filters.
   - **Compliance Suite**: How to Play, About, Privacy Policy, and Terms (AdSense ready).

## 🛠️ Tech Stack

- **Framework**: [Astro 5](https://astro.build/) (Static Site Generation / SSG for 100/100 Core Web Vitals)
- **Styling**: Tailwind CSS with custom warm paper & game palette
- **Deployment Target**: Cloudflare Pages / Vercel (Free global CDN, automatic SSL)

## 📦 Build & Local Development

```bash
# Install dependencies
npm install

# Start development server (http://localhost:4321)
npm run dev

# Build static production assets into /dist
npm run build

# Preview production build locally
npm run preview
```

## 🌐 Deploy to Cloudflare Pages (Recommended)

1. Push this folder to your GitHub / GitLab repository.
2. In the Cloudflare Dashboard, go to **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**.
3. Configure build settings:
   - **Framework preset**: `Astro`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
4. Bind your custom domain `poopleanswertoday.com` under **Custom domains**.
5. Submit `https://poopleanswertoday.com/sitemap-index.xml` to Google Search Console (GSC).
