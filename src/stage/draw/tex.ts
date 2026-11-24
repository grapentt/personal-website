// LaTeX on the stage. Formulas are typeset by KaTeX into HTML and shown in an
// overlay that sits on the canvas and scales with it; a scene simply calls
//
//   const sde = tex(String.raw`dx_t = g(t)\,dW_t`, 'dxₜ = g(t) dWₜ');
//   sde.draw(ctx, x, y, { size: 36, alpha });   // vertically centred on y, in stage units
//
// While a frame is being drawn, draw() records the formula and its placement; the
// player then positions the overlay elements. Outside a collected frame (posters,
// thumbnails) the plain-text fallback is drawn on the canvas instead.

import katex from 'katex';
import { color, font } from './theme';

export interface TexPlacement {
  tex: Tex;
  x: number;
  y: number;
  size: number;
  align: 'left' | 'center' | 'right';
  alpha: number;
  color?: string;
}

let collecting: TexPlacement[] | null = null;

/** Run `draw` and return every formula it placed. */
export function collectTex(draw: () => void): TexPlacement[] {
  const previous = collecting;
  const items: TexPlacement[] = [];
  collecting = items;
  try {
    draw();
  } finally {
    collecting = previous;
  }
  return items;
}

export class Tex {
  source: string;
  fallback: string;
  private rendered: string | null = null;

  constructor(source: string, fallback?: string) {
    this.source = source;
    this.fallback = fallback ?? source;
  }

  /** The KaTeX HTML, rendered once. */
  get html(): string {
    if (this.rendered === null) {
      try {
        this.rendered = katex.renderToString(this.source, { throwOnError: false, displayMode: false, output: 'html', strict: 'ignore' });
      } catch (err) {
        console.warn('Could not typeset, using the plain-text fallback:', this.source, err);
        this.rendered = `<span class="stage-tex__fallback">${this.fallback}</span>`;
      }
    }
    return this.rendered;
  }

  /** Approximate size in stage pixels at the given font size. */
  metrics(size: number) {
    return { width: this.fallback.length * size * 0.5, height: size * 1.2, depth: size * 0.25 };
  }

  /** Place the formula vertically centred on y. Options: size (stage px of 1em), align, alpha, color. */
  draw(ctx: CanvasRenderingContext2D, x: number, y: number, { size = 32, align = 'left', alpha = 1, color: tint }: { size?: number; align?: 'left' | 'center' | 'right'; alpha?: number; color?: string } = {}) {
    if (alpha <= 0.003) return;
    if (collecting) {
      collecting.push({ tex: this, x, y, size, align, alpha: alpha * ctx.globalAlpha, color: tint });
      return;
    }
    ctx.save();
    ctx.globalAlpha *= alpha;
    ctx.font = `italic 400 ${size * 0.86}px ${font.display}`;
    ctx.fillStyle = tint ?? color.ink;
    ctx.textAlign = align;
    ctx.textBaseline = 'middle';
    ctx.fillText(this.fallback, x, y);
    ctx.restore();
  }

  /** Place the formula centred on (cx, cy). */
  drawCentered(ctx: CanvasRenderingContext2D, cx: number, cy: number, o: { size?: number; alpha?: number; color?: string } = {}) {
    this.draw(ctx, cx, cy, { ...o, align: 'center' });
  }
}

export const tex = (source: string, fallback?: string) => new Tex(source, fallback);
