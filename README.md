# Personal Website

Personal website and blog featuring mathematical content with LaTeX rendering.

**Live Site:** [https://grapentt.github.io/personal-website](https://grapentt.github.io/personal-website)

## About

This is my personal website to host my blog, where I write about mathematics (mainly differential geometry + topology), physics and machine learning. The project is forked from [mldangelo/personal-site](https://github.com/mldangelo/personal-site) and extensively customized to host blog articles written with LaTeX using react-katex.

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

### 4. Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build/` directory.

**Build Output:**
- Minified and optimized JavaScript bundles
- Optimized CSS
- Static assets (videos, PDFs, images)
- Total JS bundle size: ~200 KB (gzipped)

### 5. Preview Production Build

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
├── public/              # Static assets (served as-is)
│   ├── visuals/         # Optimized videos (MP4/WebM)
│   ├── Resume.pdf       # Resume document
│   └── about.md         # About page content
├── src/
│   ├── components/      # React components
│   │   ├── blog/        # Blog-specific components
│   │   ├── Contact/     # Contact page components
│   │   └── Template/    # Shared UI components
│   ├── data/            # Data and content
│   │   ├── blogArticles.jsx      # Blog metadata
│   │   └── latexArticles/        # Blog article content
│   ├── layouts/         # Page layouts
│   ├── pages/           # Page components (routes)
│   ├── static/          # Styles (SCSS)
│   ├── App.jsx          # Main app component
│   └── index.jsx        # Entry point
├── vite.config.js       # Vite configuration
├── package.json         # Dependencies and scripts
└── index.html           # HTML template
```

## Development Workflow

### Making Changes

1. **Start dev server:** `npm run dev`
2. **Edit files:** Changes auto-reload in browser
3. **Check for errors:** Watch terminal and browser console
4. **Lint code:** `npm run lint` before committing

### Adding a Blog Article

1. Create new article file in `src/data/latexArticles/BlogArticleN.jsx`
2. Add article metadata to `src/data/blogArticles.jsx`
3. Use `<InlineMath math="..." />` for inline LaTeX
4. Use `<BlockMath math="..." />` for display equations
5. Reference videos via `<VideoPlayer src="..." />`

**Example:**
```jsx
import { InlineMath, BlockMath } from 'react-katex';

const BlogArticle2 = () => (
  <article>
    <h1>My New Article</h1>
    <p>
      The famous equation is <InlineMath math="E = mc^2" />
    </p>
    <BlockMath math="\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}" />
  </article>
);
```

### Adding Visual Assets

- **Images:** Place in `public/images/`
- **Videos:** Place optimized videos (MP4/WebM) in `public/visuals/`
- **Documents:** Place PDFs in `public/`

Reference in code:
```jsx
src={`${import.meta.env.BASE_URL}visuals/animation.mp4`}
```

## Environment Variables

Vite uses `VITE_` prefix for environment variables exposed to the client.

Create `.env` file (optional):
```bash
# Google Analytics (optional)
VITE_GA_TRACKING_ID=UA-XXXXXXXXX-X
```

Built-in variables:
- `import.meta.env.BASE_URL` - Base path (`/personal-website/`)
- `import.meta.env.MODE` - Current mode (`development` or `production`)
- `import.meta.env.DEV` - Boolean, true in dev mode
- `import.meta.env.PROD` - Boolean, true in production

## Deployment

The site is automatically deployed to GitHub Pages via GitHub Actions when you push to the `main` branch.

**Manual Deployment:**
```bash
npm run build
# Upload the build/ directory to your hosting provider
```

**GitHub Actions:** Configured in `.github/workflows/github-pages.yml`

## Performance Features

- ⚡ **Vite:** Lightning-fast dev server and builds
- 📦 **Optimized Assets:** Videos converted from GIF (85% smaller)
- 🎯 **Code Splitting:** Lazy-loaded routes and vendor chunks
- 🔄 **HMR:** Instant hot module replacement
- 📊 **Bundle Analysis:** Optimized chunk splitting

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

## Browser Support

- Chrome/Edge (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Modern mobile browsers

## Contributing

This is a personal website, but suggestions are welcome! Feel free to:
1. Fork the repository
2. Create a feature branch
3. Submit a pull request

## License

MIT License - See [LICENSE](LICENSE) file for details

## Acknowledgments

- Original template: [mldangelo/personal-site](https://github.com/mldangelo/personal-site)
- Math rendering: [KaTeX](https://katex.org/)
- Build tool: [Vite](https://vitejs.dev/)

## Contact

Thomas Grapentin - thomas.grapentin@gmx.de

---

**Note:** This project uses optimized video formats (MP4/WebM) instead of GIFs for better performance. Original GIF files are backed up in `public/visuals/originals/`.
