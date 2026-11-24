# Architecture

The site is a React 18 + Vite + TypeScript single-page app, deployed to GitHub
Pages at `/personal-website/`. Articles are MDX with KaTeX. The newer articles
are **interactive films**: narrated, scrubbable canvas animations with live
scenes the reader can take over, built on the engine in `src/stage/`.

```
src/
  main.tsx                 entry: fonts, global styles, React root
  App.tsx                  router (every page is a lazy chunk), MDX component map
  app/                     site facts (site.ts), theme hook, Layout (header, footer)
  styles/                  tokens.css (light/dark design tokens), base.css, prose.css, site.css
  components/              shared UI: Seo, Mark, Figure, Video, Callout, ArticleCard, ArticlePoster,
                           TableOfContents, HeroCanvas (the Hopf fibration behind the home title)
  pages/                   HomePage, BlogPage, ArticlePage, AboutPage, ContactPage, DocumentPage, NotFoundPage
  content/
    articles/index.ts      the article registry (metadata eager, article lazy)
    articles/types.ts      ArticleMeta
    articles/<slug>/       meta.ts, index.mdx, and for films: film/ (scenes) and explorables/
    films.ts               film modules by slug (poster frames on cards)
    topics.ts              the map of topics on the home page
    about.mdx              the about page body
    mdxComponents.tsx      components every article can use: Figure, Video, Callout, Film, Explorable
  stage/                   the film engine (ported from the thesis visualisation project)
    engine/                timing, random, controls, simulation, live, timeline, player
    draw/                  theme, color, text, shapes, widgets, surface (3D), tex (KaTeX overlay), moleculeView
    model/                 vec3, rotation, camera, quaternion, hopf, rigidBody, energy, molecule, physics
    react/                 Film, Explorable, StagePoster, usePlayer
    kit.ts                 everything a scene needs, in one import
    stage.css              the player's styles
public/                    static files: visuals (webm/mp4), images, PDFs, 404.html (SPA redirect)
tools/manim/               the Manim sources of the older videos (not deployed)
```

## Adding an article

1. Create `src/content/articles/<slug>/meta.ts` (an `ArticleMeta`) and `index.mdx`.
2. Register it in `src/content/articles/index.ts`. Film articles also go in `src/content/films.ts`.
3. In MDX, `Figure`, `Video`, `Callout`, `Film` and `Explorable` are available without imports.
   Math is `$…$` / `$$…$$` (remark-math + KaTeX). Links inside the site use the full base path,
   e.g. `/personal-website/blog/hopf-fibration`.

## The film engine

**A scene is a pure function of time.** `draw(ctx, t, live)` gets the scene's local time
in seconds and draws that frame in stage units (1600 × 900), so any moment can be rendered
at any time: that is what makes scrubbing and poster frames work. Random quantities are
drawn once from fixed seeds (`createRng`). Timing uses four helpers from `engine/timing.ts`:

| helper | meaning |
| --- | --- |
| `seg(t, a, b)` | eased 0 → 1 between `a` and `b` (fades, moves) |
| `fade(t, a, b, c, d)` | fade in over `[a, b]`, out over `[c, d]` |
| `lin(t, a, b)` | linear 0 → 1 (typewriter text, sweeps) |
| `oscillate(t, a, b, cycles)` | out-and-back sine motion between `a` and `b` |

A scene:

```ts
import { defineScene, seg, text, type, color, tex, camera, drawSurface } from '@/stage/kit';

const EQUATION = tex(String.raw`S^1 \hookrightarrow S^3 \to S^2`, 'S¹ ↪ S³ → S²'); // KaTeX source + plain fallback

export default defineScene({
  name: 'One fibre',                      // chapter label
  duration: 12,                           // seconds
  narration: 'What the narrator says.',   // or [[0, 'first line'], [6, 'second line']]
  header: { eyebrow: '02 · ONE FIBRE', title: 'The fibre over a point is a circle' },
  draw(ctx, t) {
    EQUATION.draw(ctx, 900, 400, { size: 36, alpha: seg(t, 1, 2) });   // vertically centred on y
    text(ctx, 'A note', 900, 480, { ...type.body, color: color.muted, alpha: seg(t, 2, 3) });
  },
});
```

**Formulas** are typeset by KaTeX into an HTML overlay that sits on the canvas and scales
with it; `tex(...).draw(ctx, x, y, { size, align, alpha, color })` records the placement while
a frame is drawn, and the player positions the elements. `size` is the em size in stage
pixels. Outside a player (poster frames) the plain-text fallback is drawn on the canvas.
Formulas cannot be clipped or rotated; keep them in open space.

**The timeline** draws the background, the scene header (`header`) and the dip to dark
between scenes. `continues: true` flows straight on from the previous scene.

**Live scenes** add `controls` (and optionally a `sim`, `beats`, `handovers`):

```ts
controls: {
  D:    slider('Noise D', { min: 0, max: 1, value: [[0, 0.2], [19.5, 0.2], [20, 0.6]] }),   // keyframes; a lever if the sim uses it
  show: choice('Show', { a: 'one view', b: 'another' }, { value: 'a', lens: true }),       // a view control
  spin: toggle('Animate', { value: true, lens: true }),
  view: drag('Drag to rotate', { region: [40, 150, 700, 640] }),                            // stage units; value = [dx, dy]
  points: pick('Click the sphere to add a base point', { region: [40, 150, 700, 640], max: 10 }),  // value = stage points
},
sim: simulation({ seed: 5, dt: 1 / 300, tick: 1 / 60, uses: ['D'], init, step, onTick, events }),
draw(ctx, t, { input, state }) { /* from t, the control values and the simulation state */ },
```

A *lever* feeds the simulation; touching one in a film pauses the narration and starts
explore mode (the simulation runs on under the viewer's settings). A *lens* only changes
the view and never pauses. Levers must be listed in `sim.uses`; everything else must be a
lens (`lens: true`). Drag and pick controls are always lenses.

**Explorables** (`<Explorable scene={…} />`) are one live scene running under the reader's
control from the start: time keeps running (looping at `duration`), every control is theirs,
Reset starts over. A scene can be used both inside a film and as an explorable.

**3D** goes through `camera({ yaw, pitch, scale, cx, cy, focal, center })`. The camera is a proper
(orientation-preserving) projection: screen right, screen up and "towards the viewer" form a
right-handed frame. (The thesis engine drew view +x to the right with depth growing away from the
viewer, which mirrored every 3D picture; for the Hopf fibration, whose fibres have a handedness, that
matters.) A positive engine `pitch` puts the eye below the floor; the Hopf film's camera helpers flip
it so that a positive pitch means "seen from above". Drawing helpers: `drawSurface`
(shaded parametric surfaces, painter's algorithm), `polyline3` (null points lift the pen;
`visible(i)` culls hidden segments; `colorAt`, `widthAt` for per-segment styling), `polygon3`.
Keep a frame under a few thousand segments and one or two 64 × 24 surfaces.

**Conventions.** One scene per file, numbered in playing order, default-exported. Times
inside a scene are literal seconds, written next to what they animate. No state between
frames. Colours carry meaning and live in `draw/theme.ts`: vertical / fibre = gold,
horizontal = soft cyan; the Hopf film colours fibres by their base point with `hue()`.
The Hopf conventions (complex coordinates, the Hopf map, stereographic pole, connection,
sign of the holonomy) are stated once at the top of `src/stage/model/hopf.ts` and used
everywhere.

## Checks

```sh
npm run typecheck   # tsc
npm run lint        # eslint (airbnb + typescript)
npm run smoke       # draws every scene of every film and every explorable on a stub canvas
npm test            # all three
npm run build       # tsc + vite build → build/
npm run dev         # http://localhost:3000/personal-website/
```

The GitHub Actions workflow `github-pages.yml` builds `main` and deploys `build/`;
`node.js.yml` lints, typechecks and builds pull requests.
