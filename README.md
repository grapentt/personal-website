# Thomas Grapentin — personal website

Mathematics, physics and machine learning, explained with hand-made and interactive
visualisations. **Live:** [grapentt.github.io/personal-website](https://grapentt.github.io/personal-website)

The newer articles are **interactive films**: narrated, scrubbable canvas animations with
chapters, live scenes the reader can take over, and small explorables embedded in the
prose. The film engine is a TypeScript port of the one built for my master's thesis
visualisations.

## Articles

| | |
| --- | --- |
| A geometric introduction to quaternions | rotations in 2D, 3D and 4D; isoclinic rotations; the quaternions |
| The Hopf fibration | the 3-sphere as a circle of circles: stereographic projection, linked fibres, nested tori, the Hopf connection and its holonomy |
| The geometry of shape space | why a molecule lives on a quotient; bundles, connections, curvature; the falling cat |

## Stack

React 18 · Vite 7 · TypeScript · MDX with KaTeX · a 2D-canvas film engine (`src/stage/`) · GitHub Pages.
Fonts (Spectral, IBM Plex Sans, IBM Plex Mono) are self-hosted. No analytics, no cookies.

## Developing

```sh
npm install
npm run dev        # http://localhost:3000/personal-website/
npm test           # typecheck + lint
npm run build      # production build in build/
npm run cv         # render cv/cv.html to public/Resume.pdf (needs Google Chrome)
```

Node 20.19+ (see `.nvmrc`). Pushes to `main` deploy through `.github/workflows/github-pages.yml`.

## How it is organised

See [docs/architecture.md](docs/architecture.md) for the layout of the code and the film
engine's API, and [docs/writing.md](docs/writing.md) for how an interactive film article is
put together. The Manim sources of the older videos are in `tools/manim/`.

## License

MIT. The site was originally forked from
[mldangelo/personal-site](https://github.com/mldangelo/personal-site); nothing of that
template remains except the deployment setup.
