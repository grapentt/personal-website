# Personal Website

Personal website and blog featuring mathematical content with LaTeX rendering.

**Live Site:** [https://grapentt.github.io/personal-website](https://grapentt.github.io/personal-website)

## About

This is my personal website to host my blog, where I write about mathematics, physics, and machine learning. The project is forked from [mldangelo/personal-site](https://github.com/mldangelo/personal-site) and extensively customized to host blog articles written with LaTeX using KaTeX.

### Topics I plan to cover

**Differential Geometry & Topology:**
- The atoms of space: Cell and Handle decompositions
- Topological Manifolds
- The metric tensor: Riemannian Geometry
- Lie groups and Lie algebras
- My favourite manifolds: Projective spaces, Lie groups and Grassmannians
- Homology
- Cohomology and Poincaré duality
- Differential forms and Hodge duality
- Intersection forms of 4-manifolds
- Bundles
- Connections, curvature, and holonomy
- Characteristic classes
- Morse Theory
- h-cobordism theorem
- Self-duality and Donaldson Theory
- Spin groups, Spin structures and Spinors
- Dirac Operator on Spin-manifolds
- Spin^c structures and Seiberg-Witten Theory

**Mathematical Physics:**
- Pseudo-Riemannian spaces and applications to relativity
- Gauge theory in physics: Maxwell's equations
- Gauge theory in physics: Yang-Mills equations
- Gauge theory in physics: Minimal Coupling and Matter Fields
- Standard Model of particle physics
- Topological Quantum Field Theory
- Twistor theory
- Topological quantum computing

**Machine Learning Applications:**
- Mathematical foundations of Machine learning
- Topological Data Analysis
- Topological Deep Learning
- Geometric Deep Learning
- Category Theory: A unifying framework?
- Embedding Spaces
- Representation Learning
- Geometric approaches to explainable AI
- ... This list will certainly expand with time ...

The blog aims to make these advanced topics accessible through clear explanations, geometric intuition, and custom visualizations.

## Tech Stack

- **Frontend:** React 18 with React Router
- **Build Tool:** Vite
- **Styling:** SCSS
- **Math Rendering:** KaTeX (react-katex)
- **Deployment:** GitHub Pages

## Prerequisites

- **Node.js:** 20.19+ or 22.12+ (Vite requirement)
  - If you have Node 20.16.x, the project will still work but show a version warning
  - Upgrade recommended: `nvm install 20.19` or `nvm install 22`
- **npm:** 8.x or higher

Check your versions:
```bash
node --version  # Should be 20.19+ or 22.12+
npm --version
```

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/grapentt/personal-website.git
cd personal-website
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages including React, Vite, KaTeX, and other dependencies.

### 3. Run Development Server

```bash
npm run dev
```

The development server will start at [http://localhost:3000](http://localhost:3000) and automatically open in your browser.

**Features:**
- ⚡ Lightning-fast hot module replacement (HMR)
- 🔄 Instant updates on file changes
- 🐛 Better error messages in the browser


### 4. Preview Production Build

```bash
npm run preview
```

This serves the production build locally at [http://localhost:3000](http://localhost:3000) to test before deployment.

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Create production build |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint to check code quality |
| `npm run predeploy` | Build for deployment (used by CI/CD) |

## Project Structure

```
personal-website/
├── public/                    # Static assets (served as-is)
│   ├── visuals/              # Optimized videos (MP4/WebM)
│   ├── images/               # Images and icons
│   └── about.md              # About page content
├── src/
│   ├── features/             # Feature modules (pages + components + data)
│   │   ├── home/            # Landing page
│   │   ├── about/           # About page
│   │   ├── blog/            # Blog feature
│   │   │   ├── articles/    # MDX blog articles (*.mdx)
│   │   │   └── utils/       # Blog utilities (mdxUtils.ts)
│   │   ├── contact/         # Contact page
│   ├── shared/              # Shared/reusable code
│   │   ├── components/      # Shared UI components (Navigation, SideBar)
│   │   ├── layouts/         # Layout components (Main)
│   │   └── types/           # TypeScript type definitions
│   ├── config/              # App configuration (routes)
│   ├── styles/              # Global styles (SCSS)
│   ├── App.jsx              # Root app component with routing
│   └── index.tsx            # Entry point
├── vite.config.js           # Vite configuration
├── tsconfig.json            # TypeScript configuration
├── package.json             # Dependencies and scripts
└── index.html               # HTML template
```

## Development Workflow

### Making Changes

1. **Start dev server:** `npm run dev`
2. **Edit files:** Changes auto-reload in browser
3. **Check for errors:** Watch terminal and browser console
4. **Lint code:** `npm run lint` before committing

### Adding a Blog Article

Blog articles are written in **MDX format** (Markdown + JSX), making them easy to write while supporting React components and LaTeX math.

1. Create new article file in `src/features/blog/articles/your-article-slug.mdx`
2. Add frontmatter metadata (title, date, description, image)
3. Write content in Markdown with math notation
4. Update `src/features/blog/utils/mdxUtils.ts` to import and register the article
5. Article automatically appears at `/blog/your-article-slug`

**Example MDX article:**
```mdx
---
title: "Understanding the Euler Identity"
date: "2026-02-04"
description: "A beautiful equation connecting five fundamental constants"
image: "/personal-website/images/euler.png"
---

import { VideoPlayer } from '@/shared/components';

# Understanding the Euler Identity

Regular markdown text with **bold** and *italic*.

Inline math: $e^{i\pi} + 1 = 0$

Block math:
$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$

<VideoPlayer src="/personal-website/visuals/animation" alt="Demo" />
```

**Math syntax:**
- Inline: `$...$` (e.g., `$x^2$`)
- Block: `$$...$$` (e.g., `$$\int_0^1 x dx$$`)
- Powered by remark-math + rehype-katex

### Adding Visual Assets

- **Images:** Place in `public/images/`
- **Videos:** Place optimized videos (MP4/WebM) in `public/visuals/`
- **Documents:** Place PDFs in `public/`

Reference in code:
```jsx
src={`${import.meta.env.BASE_URL}visuals/animation.mp4`}
```

## Deployment

The site is automatically deployed to GitHub Pages via GitHub Actions when you push to the `main` branch.

**GitHub Actions:** Configured in `.github/workflows/github-pages.yml`

## Troubleshooting

### Dev server won't start

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Build fails

```bash
# Check Node.js version
node --version  # Should be 16.x or higher

# Clear build cache
rm -rf build
npm run build
```

### Port 3000 already in use

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or edit vite.config.js to use different port
```

### Lint errors

```bash
# Auto-fix lint issues
npm run lint -- --fix
```


## Acknowledgments

- Original template: [mldangelo/personal-site](https://github.com/mldangelo/personal-site)
- Math rendering: [KaTeX](https://katex.org/)
- Build tool: [Vite](https://vitejs.dev/)

## Contact

Thomas Grapentin - grapentthomas@gmail.com

---
