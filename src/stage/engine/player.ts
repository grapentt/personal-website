// Interactive playback: animation loop, transport controls, chapter list,
// narration and keyboard shortcuts, plus the controls of live scenes and
// explore mode. The player owns no drawing logic; it asks the timeline for a
// frame whenever something changed, and places the formula overlay.
//
// Two modes: 'film' (narrated timeline with transport) and 'explorable'
// (one live scene, time running, every control the viewer's from the start).

import { clamp } from './timing';
import { STAGE, narrationAt, Timeline, Scene } from './timeline';
import { LiveView, warmUp } from './live';
import { Control, Region } from './controls';
import { formatNumber } from '../draw/text';
import { collectTex, TexPlacement } from '../draw/tex';
import { color } from '../draw/theme';

const formatTime = (s: number) => {
  const v = Math.max(0, s);
  return `${Math.floor(v / 60)}:${String(Math.floor(v % 60)).padStart(2, '0')}`;
};
const pad2 = (n: number) => String(n).padStart(2, '0');

const el = <K extends keyof HTMLElementTagNameMap>(tag: K, props: Record<string, unknown> = {}, ...children: (Node | string)[]): HTMLElementTagNameMap[K] => {
  const node = Object.assign(document.createElement(tag), props as object);
  node.append(...children);
  return node;
};

/** How long a hand-over prompt stays up while the film plays on. */
const HANDOVER_SHOWN = 8;
/** Time per frame for simulating, in ms: normally, and while catching up after a far jump. */
const FRAME_BUDGET = 10;
const CATCH_UP_BUDGET = 14;
/** How long a control stays highlighted after the film moved it, in ms. */
const MOVING_SHOWN = 900;
/** Pointer travel (stage units) that turns a click into a drag. */
const DRAG_THRESHOLD = 5;

export interface PlayerUi {
  canvas: HTMLCanvasElement;
  overlay?: HTMLElement | null;
  stage?: HTMLElement | null;
  screen?: HTMLElement | null;
  root?: HTMLElement | null;
  poster?: HTMLButtonElement | null;
  play?: HTMLButtonElement | null;
  prev?: HTMLButtonElement | null;
  next?: HTMLButtonElement | null;
  scrub?: HTMLInputElement | null;
  time?: HTMLElement | null;
  speed?: HTMLSelectElement | null;
  fullscreen?: HTMLButtonElement | null;
  narration?: HTMLElement | null;
  narrationLabel?: HTMLElement | null;
  chapters?: HTMLElement | null;
  strip?: HTMLElement | null;
  controls?: HTMLElement | null;
  exploreBar?: HTMLElement | null;
  exploreStatus?: HTMLElement | null;
  explorePause?: HTMLButtonElement | null;
  exploreBack?: HTMLButtonElement | null;
  handover?: HTMLElement | null;
  handoverText?: HTMLElement | null;
  handoverTry?: HTMLButtonElement | null;
}

export interface PlayerOptions {
  posterTime?: number;
  mode?: 'film' | 'explorable';
  /** Explorable mode: restart time at the scene's end (default) or stop. */
  loop?: boolean;
}

interface ControlEntry {
  c: Control;
  row: HTMLElement;
  input?: HTMLInputElement;
  output?: HTMLOutputElement;
  buttons?: [string, HTMLButtonElement][];
  shown?: unknown;
  movedAt?: number;
}

interface DragState {
  scene: Scene;
  name: string;
  from: [number, number];
  base: [number, number];
}

export class Player {
  timeline: Timeline;
  ui: PlayerUi;
  mode: 'film' | 'explorable';
  loop: boolean;
  view: LiveView;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  time: number;
  playing = false;
  waiting = false;
  speed = 1;
  dirty = true;
  shownScene = -1;
  shownNarration = '';
  live: ReturnType<Timeline['render']> | null = null;
  drag: DragState | null = null;
  pressed: { p: [number, number]; moved: boolean; pointerId: number } | null = null;
  stopWarmUp: (() => void) | null = null;
  endListeners = new Set<() => void>();
  controlInputs = new Map<string, ControlEntry>();
  chapterButtons: HTMLButtonElement[] = [];
  beatButtons: { button: HTMLButtonElement; scene: number; from: number; to: number }[] = [];
  overlayNodes = new Map<string, HTMLElement>();
  destroyed = false;
  private unbind: (() => void)[] = [];
  private frame = 0;

  constructor(timeline: Timeline, ui: PlayerUi, { posterTime = 0, mode = 'film', loop = true }: PlayerOptions = {}) {
    this.timeline = timeline;
    this.ui = ui;
    this.mode = mode;
    this.loop = loop;
    this.view = new LiveView({ budgetMs: FRAME_BUDGET });
    this.canvas = ui.canvas;
    this.ctx = ui.canvas.getContext('2d')!;
    this.time = posterTime;

    // a player owns its formula overlay: clear what an earlier player on the same element left behind
    ui.overlay?.replaceChildren();
    this.bindControls();
    this.bindCanvas();
    this.buildChapters();
    const ro = new ResizeObserver(() => this.resize());
    ro.observe(this.canvas);
    this.unbind.push(() => ro.disconnect());
    if (ui.strip && ui.screen) {
      const so = new ResizeObserver(() => ui.screen!.style.setProperty('--strip', `${ui.strip!.offsetHeight}px`));
      so.observe(ui.strip);
      this.unbind.push(() => so.disconnect());
    }
    this.resize();
    if (mode === 'explorable') this.startExplorable();
    this.frame = requestAnimationFrame((now) => this.loopFrame(now, now));
  }

  // ---- public API --------------------------------------------------------

  play() {
    if (this.mode === 'explorable') {
      this.playing = true;
      if (this.view.explore) this.view.explore.paused = false;
      this.syncPlayButton();
      return;
    }
    this.leaveExplore();
    if (this.time >= this.timeline.duration - 0.01) this.time = 0;
    this.playing = true;
    this.hidePoster();
    this.startWarmUp();
    this.syncPlayButton();
  }

  pause() {
    this.playing = false;
    if (this.mode === 'explorable' && this.view.explore) this.view.explore.paused = true;
    this.syncPlayButton();
    this.endListeners.forEach((fn) => fn());
  }

  toggle() {
    if (this.playing) this.pause();
    else this.play();
  }

  seek(T: number) {
    this.leaveExplore();
    this.time = clamp(T, 0, this.timeline.duration - 0.001);
    this.hidePoster();
    this.startWarmUp();
    this.invalidate();
  }

  seekScene(index: number) {
    const scene = this.timeline.scenes[clamp(index, 0, this.timeline.scenes.length - 1)];
    this.seek(scene.start + 0.001);
  }

  setSpeed(speed: number) {
    this.speed = speed;
  }

  /** Request a redraw on the next animation frame. */
  invalidate() {
    this.dirty = true;
  }

  /** Resolves the next time playback stops (end reached or paused). */
  untilStopped(): Promise<void> {
    return new Promise((resolve) => {
      const done = () => {
        this.endListeners.delete(done);
        resolve();
      };
      this.endListeners.add(done);
    });
  }

  /** Pause the narration and let the viewer run the current live scene with their own settings. */
  explore() {
    const scene = this.scene();
    if (!scene.live || this.view.explore) return;
    this.pause();
    const t0 = Math.max(this.time - scene.start, scene.exploreFrom);
    this.time = scene.start + t0;
    this.view.startExplore(scene, t0);
    this.syncExplore();
    this.invalidate();
  }

  /** Leave explore mode and play the narrated version on from the moment where exploring began. */
  resumeVideo() {
    this.play();
  }

  /** Explorable mode: back to the authored values and a fresh simulation. */
  reset() {
    const scene = this.scene();
    this.view.clear();
    this.time = scene.start;
    if (this.mode === 'explorable') {
      this.view.startExplore(scene, 0);
      this.buildControls(scene);
    }
    this.invalidate();
  }

  /** Stop the animation loop and release listeners. */
  destroy() {
    this.destroyed = true;
    cancelAnimationFrame(this.frame);
    this.stopWarmUp?.();
    this.unbind.forEach((fn) => fn());
    this.unbind = [];
    this.overlayNodes.forEach((node) => node.remove());
    this.overlayNodes.clear();
  }

  // ---- internals ---------------------------------------------------------

  private startExplorable() {
    const scene = this.timeline.scenes[0];
    this.time = 0;
    this.hidePoster();
    if (scene.live) this.view.startExplore(scene, 0);
    this.playing = true;
    this.syncPlayButton();
  }

  private leaveExplore() {
    if (!this.view.explore || this.mode === 'explorable') return;
    this.view.stopExplore();
    this.syncExplore();
    this.invalidate();
  }

  private scene(): Scene {
    return this.timeline.sceneAt(this.time);
  }

  private loopFrame(now: number, last: number) {
    if (this.destroyed) return;
    this.frame = requestAnimationFrame((next) => this.loopFrame(next, now)); // first, so an error below cannot stop the loop
    const dt = Math.min(0.1, (now - last) / 1000);
    if (this.mode === 'explorable') {
      if (this.playing) {
        this.time += dt * this.speed;
        const scene = this.timeline.scenes[0];
        if (this.time >= scene.duration) this.time = this.loop ? this.time - scene.duration : scene.duration - 0.001;
        if (this.view.explore) this.view.stepExplore(dt);
        this.dirty = true;
      }
    } else if (this.view.explore) {
      if (this.view.stepExplore(dt)) this.dirty = true;
    } else if (this.playing) {
      if (!this.waiting) this.time += dt * this.speed;
      if (this.time >= this.timeline.duration) {
        this.time = this.timeline.duration - 0.001;
        this.pause();
      }
      this.dirty = true;
    }
    if (this.dirty || this.waiting) {
      this.dirty = false;
      this.render();
    }
  }

  private render() {
    const { ctx, canvas } = this;
    if (!canvas.width) return;
    ctx.setTransform(canvas.width / STAGE.width, 0, 0, canvas.height / STAGE.height, 0, 0);
    this.view.budgetMs = this.waiting ? CATCH_UP_BUDGET : FRAME_BUDGET;
    const placed = collectTex(() => {
      this.live = this.timeline.render(ctx, this.time, this.view);
    });
    this.waiting = this.live?.pending ?? false;
    this.syncOverlay(placed, this.live?.dip ?? 0);
    this.syncUi();
  }

  /** Position the KaTeX overlay elements for the formulas placed in this frame. */
  private syncOverlay(placed: TexPlacement[], dip: number) {
    const { overlay } = this.ui;
    if (!overlay) return;
    const used = new Set<string>();
    const counts = new Map<string, number>();
    for (const item of placed) {
      const n = (counts.get(item.tex.source) ?? 0) + 1;
      counts.set(item.tex.source, n);
      const key = `${item.tex.source}#${n}`;
      used.add(key);
      let node = this.overlayNodes.get(key);
      if (!node) {
        node = el('div', { className: 'stage-tex' });
        node.innerHTML = item.tex.html;
        overlay.append(node);
        this.overlayNodes.set(key, node);
      }
      const tx = item.align === 'center' ? '-50%' : item.align === 'right' ? '-100%' : '0';
      const style = node.style;
      const left = `${((item.x / STAGE.width) * 100).toFixed(3)}%`;
      const top = `${((item.y / STAGE.height) * 100).toFixed(3)}%`;
      const fontSize = `${((item.size / STAGE.height) * 100 / 1.21).toFixed(3)}cqh`;
      const opacity = Math.max(0, Math.min(1, item.alpha * (1 - dip))).toFixed(3);
      if (style.left !== left) style.left = left;
      if (style.top !== top) style.top = top;
      if (style.fontSize !== fontSize) style.fontSize = fontSize;
      if (style.opacity !== opacity) style.opacity = opacity;
      const transform = `translate(${tx}, -50%)`;
      if (style.transform !== transform) style.transform = transform;
      const tint = item.color ?? color.ink;
      if (style.color !== tint) style.color = tint;
      if (node.hidden) node.hidden = false;
    }
    for (const [key, node] of this.overlayNodes) {
      if (!used.has(key) && !node.hidden) node.hidden = true;
    }
  }

  private resize() {
    const { canvas } = this;
    const rect = canvas.getBoundingClientRect();
    if (!rect.width) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.round(rect.width * dpr);
    const height = Math.round((width * STAGE.height) / STAGE.width);
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
    this.invalidate();
  }

  private syncUi() {
    const { ui, timeline } = this;
    const index = timeline.indexAt(this.time);
    const scene = timeline.scenes[index];
    const t = this.time - scene.start;
    if (index !== this.shownScene) {
      this.shownScene = index;
      // a viewer's view settings hold until the scene ends
      for (const other of timeline.scenes) if (other !== scene) this.view.resetLenses(other);
      if (ui.narrationLabel) ui.narrationLabel.textContent = `${pad2(index)} · ${scene.name}`;
      this.chapterButtons.forEach((b, k) => b.classList.toggle('on', k === index));
      this.buildControls(scene);
    }
    const line = this.view.explore && this.mode === 'film'
      ? 'You are exploring: the narration is paused here. Space pauses the simulation; Esc or “Resume the film” plays the narration on from here.'
      : narrationAt(scene, t).text;
    if (ui.narration && line !== this.shownNarration) {
      this.shownNarration = line;
      ui.narration.textContent = line;
    }
    this.beatButtons.forEach(({ button, scene: k, from, to }) => button.classList.toggle('on', k === index && t >= from && t < to));
    this.syncControls();
    this.syncHandover(scene, t);
    if (ui.scrub && document.activeElement !== ui.scrub) ui.scrub.value = this.time.toFixed(2);
    if (ui.time) ui.time.textContent = `${formatTime(this.time)} / ${formatTime(timeline.duration)}`;
  }

  private syncPlayButton() {
    const { play } = this.ui;
    if (!play) return;
    play.textContent = this.playing ? 'Pause' : 'Play';
    play.setAttribute('aria-label', this.playing ? 'Pause' : 'Play');
    play.dataset.state = this.playing ? 'playing' : 'paused';
  }

  private hidePoster() {
    if (this.ui.poster) this.ui.poster.hidden = true;
    this.ui.stage?.classList.remove('is-poster');
  }

  private startWarmUp() {
    this.stopWarmUp ??= warmUp(this.timeline.scenes, { busy: () => this.waiting });
  }

  private buildChapters() {
    const list = this.ui.chapters;
    if (!list) return;
    list.replaceChildren();
    this.chapterButtons = [];
    this.beatButtons = [];
    this.timeline.scenes.forEach((scene, i) => {
      const button = el('button', { type: 'button' }, el('b', { textContent: pad2(i) }), el('span', { textContent: scene.name }), el('i', { textContent: formatTime(scene.start) }));
      button.addEventListener('click', () => this.seekScene(i));
      list.append(el('li', {}, button));
      this.chapterButtons.push(button);
      scene.beats.forEach(([from, name], k) => {
        const beat = el('button', { type: 'button', className: 'beat', textContent: name });
        beat.addEventListener('click', () => this.seek(scene.start + from));
        list.append(el('li', {}, beat));
        this.beatButtons.push({ button: beat, scene: i, from, to: scene.beats[k + 1]?.[0] ?? scene.duration });
      });
    });
  }

  // ---- live scenes: control strip, canvas dragging, explore mode, hand-overs

  private buildControls(scene: Scene) {
    const { strip, controls } = this.ui;
    if (!controls) return;
    controls.replaceChildren();
    this.controlInputs = new Map();
    const kinds = Object.values(scene.controls ?? {}).map((c) => c.kind);
    this.canvas.style.touchAction = kinds.includes('drag') ? 'none' : '';
    if (strip) strip.hidden = !scene.live;
    if (!scene.controls) return;

    const explorable = this.mode === 'explorable';
    // two groups, so viewers can tell which controls pause the film
    const physics = el('div', { className: 'control-group', role: 'group' }, el('span', { className: 'group-label', textContent: explorable ? 'Physics' : 'Physics · pauses the film' }));
    const view = el('div', { className: 'control-group', role: 'group' }, el('span', { className: 'group-label', textContent: 'View' }));
    for (const [name, c] of Object.entries(scene.controls)) {
      const group = c.lens ? view : physics;
      if (c.kind === 'slider') {
        const input = el('input', { type: 'range', min: String(c.min), max: String(c.max), step: String(c.step) });
        const output = el('output');
        input.addEventListener('input', () => this.onControl(name, parseFloat(input.value)));
        const row = el('label', { className: 'control control--slider' }, el('span', { className: 'control__label', textContent: c.label }), input, output);
        group.append(row);
        this.controlInputs.set(name, { c, row, input, output });
      } else if (c.kind === 'choice') {
        const buttons = Object.entries(c.options).map(([key, label]) => {
          const button = el('button', { type: 'button', textContent: label });
          button.addEventListener('click', () => this.onControl(name, key));
          return [key, button] as [string, HTMLButtonElement];
        });
        const row = el('div', { className: 'control' }, el('span', { className: 'control__label', textContent: c.label }), el('span', { className: 'segmented', role: 'group' }, ...buttons.map(([, b]) => b)));
        group.append(row);
        this.controlInputs.set(name, { c, row, buttons });
      } else if (c.kind === 'toggle') {
        const buttons: [string, HTMLButtonElement][] = [['false', el('button', { type: 'button', textContent: 'off' })], ['true', el('button', { type: 'button', textContent: 'on' })]];
        buttons.forEach(([key, b]) => b.addEventListener('click', () => this.onControl(name, key === 'true')));
        const row = el('div', { className: 'control' }, el('span', { className: 'control__label', textContent: c.label }), el('span', { className: 'segmented', role: 'group' }, ...buttons.map(([, b]) => b)));
        group.append(row);
        this.controlInputs.set(name, { c, row, buttons });
      } else if (c.kind === 'pick') {
        const clear = el('button', { type: 'button', textContent: 'Clear points' });
        clear.addEventListener('click', () => this.onControl(name, []));
        const row = el('div', { className: 'control control--hint' }, el('span', { className: 'control__label', textContent: c.label }), clear);
        group.append(row);
        this.controlInputs.set(name, { c, row });
      } else {
        group.append(el('span', { className: 'control control--hint', textContent: c.label }));
      }
    }
    if (Object.values(scene.controls).some((c) => c.lens) || explorable) {
      const reset = el('button', { type: 'button', className: 'reset-view', textContent: explorable ? 'Reset' : 'Reset view' });
      reset.addEventListener('click', () => {
        if (explorable) this.reset();
        else {
          this.view.resetLenses(scene);
          this.invalidate();
        }
      });
      (explorable && physics.childElementCount > 1 ? physics : view).append(reset);
    }
    for (const group of [physics, view]) if (group.childElementCount > 1) controls.append(group);
  }

  /**
   * Show the current values (authored, or the viewer's) on the controls, and highlight a control
   * while the film itself is moving it, so viewers see what each control does.
   */
  private syncControls() {
    if (!this.controlInputs.size || !this.live) return;
    const scene = this.scene();
    const now = performance.now();
    for (const [name, entry] of this.controlInputs) {
      const { c, row, input, output, buttons } = entry;
      const value = this.live.input[name];
      if (input && output) {
        if (document.activeElement !== input || !this.view.explore) input.value = String(value);
        const s = c.kind === 'slider' ? c : null;
        output.value = `${formatNumber(value as number, s?.digits ?? 2)}${s?.unit ? ` ${s.unit}` : ''}`;
      } else if (buttons) {
        for (const [key, button] of buttons) button.setAttribute('aria-pressed', String(key === String(value)));
      }
      const byVideo = !this.view.explore && this.view.lens(scene, name) === undefined;
      if (value !== entry.shown && entry.shown !== undefined && byVideo) entry.movedAt = now;
      entry.shown = value;
      row.classList.toggle('moving', now - (entry.movedAt ?? -Infinity) < MOVING_SHOWN);
    }
  }

  private onControl(name: string, value: unknown) {
    const scene = this.scene();
    const c = scene.controls?.[name];
    if (!c) return;
    if (c.lens) this.view.setLens(scene, name, value);
    else {
      if (this.mode === 'film') this.explore();
      this.view.setLever(name, value);
    }
    this.invalidate();
  }

  private syncExplore() {
    const { exploreBar, explorePause, exploreStatus } = this.ui;
    const ex = this.view.explore;
    if (exploreBar) exploreBar.hidden = !ex;
    if (exploreStatus && ex) exploreStatus.textContent = `Exploring from ${formatTime(ex.scene.start + ex.t0)}: the narration waits here.`;
    if (explorePause) explorePause.textContent = ex?.paused ? 'Resume simulation' : 'Pause simulation';
    this.shownNarration = '';
  }

  private toggleExplorePause() {
    const ex = this.view.explore;
    if (!ex) return;
    ex.paused = !ex.paused;
    this.syncExplore();
  }

  private syncHandover(scene: Scene, t: number) {
    const { handover, handoverText } = this.ui;
    if (!handover || !handoverText) return;
    const h = this.view.explore ? null : scene.handovers.find(({ at }) => t >= at && t < at + HANDOVER_SHOWN);
    handover.hidden = !h;
    if (h && handoverText.textContent !== h.prompt) handoverText.textContent = h.prompt;
  }

  /** Stage coordinates of a pointer event. */
  private stagePoint(e: PointerEvent): [number, number] {
    const rect = this.canvas.getBoundingClientRect();
    return [((e.clientX - rect.left) * STAGE.width) / rect.width, ((e.clientY - rect.top) * STAGE.height) / rect.height];
  }

  private inRegion(p: [number, number], region: Region) {
    return p[0] >= region[0] && p[0] <= region[2] && p[1] >= region[1] && p[1] <= region[3];
  }

  /** The control of the given kind whose region contains stage point p, as [name, control]. */
  private controlAt(p: [number, number], kind: 'drag' | 'pick') {
    const controls = this.scene().controls ?? {};
    return Object.entries(controls).find(([, c]) => c.kind === kind && this.inRegion(p, c.region));
  }

  private bindCanvas() {
    const { canvas } = this;
    const down = (e: PointerEvent) => {
      if (e.button !== 0 && e.pointerType === 'mouse') return;
      const p = this.stagePoint(e);
      const draggable = this.controlAt(p, 'drag');
      const pickable = this.controlAt(p, 'pick');
      if (!draggable && !pickable) return;
      this.pressed = { p, moved: false, pointerId: e.pointerId };
      if (draggable) {
        const [name] = draggable;
        const scene = this.scene();
        const base = (this.view.lens(scene, name) ?? this.live?.input[name] ?? [0, 0]) as [number, number];
        this.drag = { scene, name, from: p, base };
      }
      canvas.setPointerCapture(e.pointerId);
      e.preventDefault();
    };
    const move = (e: PointerEvent) => {
      const p = this.stagePoint(e);
      if (!this.pressed) {
        canvas.style.cursor = this.controlAt(p, 'drag') ? 'grab' : this.controlAt(p, 'pick') ? 'crosshair' : '';
        return;
      }
      if (!this.pressed.moved && Math.hypot(p[0] - this.pressed.p[0], p[1] - this.pressed.p[1]) > DRAG_THRESHOLD) this.pressed.moved = true;
      if (!this.drag || !this.pressed.moved) return;
      canvas.style.cursor = 'grabbing';
      const { scene, name, from, base } = this.drag;
      this.view.setLens(scene, name, [base[0] + p[0] - from[0], base[1] + p[1] - from[1]]);
      this.invalidate();
    };
    const up = (e: PointerEvent) => {
      if (this.pressed && !this.pressed.moved) {
        const p = this.stagePoint(e);
        const pickable = this.controlAt(p, 'pick');
        if (pickable) {
          const [name, c] = pickable;
          if (c.kind === 'pick') {
            const scene = this.scene();
            const current = ((this.view.lens(scene, name) ?? this.live?.input[name] ?? []) as [number, number][]).slice();
            const near = current.findIndex(([x, y]) => Math.hypot(x - p[0], y - p[1]) < 14);
            if (near >= 0) current.splice(near, 1);
            else {
              current.push(p);
              while (current.length > c.max) current.shift();
            }
            this.view.setLens(scene, name, current);
            this.invalidate();
          }
        }
      }
      this.pressed = null;
      this.drag = null;
      canvas.style.cursor = '';
    };
    canvas.addEventListener('pointerdown', down);
    canvas.addEventListener('pointermove', move);
    canvas.addEventListener('pointerup', up);
    canvas.addEventListener('pointercancel', up);
    this.unbind.push(() => {
      canvas.removeEventListener('pointerdown', down);
      canvas.removeEventListener('pointermove', move);
      canvas.removeEventListener('pointerup', up);
      canvas.removeEventListener('pointercancel', up);
    });
  }

  private bindControls() {
    const { ui } = this;
    if (ui.scrub) {
      ui.scrub.max = this.timeline.duration.toFixed(2);
      ui.scrub.addEventListener('input', () => this.seek(parseFloat(ui.scrub!.value)));
    }
    ui.play?.addEventListener('click', () => this.toggle());
    ui.poster?.addEventListener('click', () => {
      this.time = 0;
      this.play();
    });
    ui.prev?.addEventListener('click', () => this.previousChapter());
    ui.next?.addEventListener('click', () => this.seekScene(this.timeline.indexAt(this.time) + 1));
    ui.speed?.addEventListener('change', () => this.setSpeed(parseFloat(ui.speed!.value)));
    ui.fullscreen?.addEventListener('click', () => this.toggleFullscreen());
    ui.handoverTry?.addEventListener('click', () => this.explore());
    ui.explorePause?.addEventListener('click', () => this.toggleExplorePause());
    ui.exploreBack?.addEventListener('click', () => this.resumeVideo());

    // Keyboard shortcuts apply while the player (or something inside it) has the focus.
    const root = ui.root ?? ui.stage ?? ui.canvas;
    let clicked: Element | null = null;
    const onPointerDown = (e: PointerEvent) => {
      clicked = (e.target as Element | null)?.closest?.('button') ?? null;
    };
    const onFocusIn = (e: FocusEvent) => {
      if (e.target !== clicked) clicked = null;
    };
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName;
      if (tag === 'SELECT') return;
      const inLive = Boolean(ui.strip?.contains(target) || ui.handover?.contains(target));
      const ownsSpace = tag === 'BUTTON' && target !== clicked;
      if (inLive && (e.key === 'Enter' || e.key.startsWith('Arrow') || (e.code === 'Space' && ownsSpace))) return;
      if (e.code === 'Space') {
        e.preventDefault();
        if (this.view.explore && this.mode === 'film') this.toggleExplorePause();
        else {
          if (!this.playing && ui.poster && !ui.poster.hidden) this.time = 0;
          this.toggle();
        }
      } else if (e.key === 'Escape' && this.view.explore && this.mode === 'film') this.resumeVideo();
      else if (this.mode === 'film' && e.key === 'ArrowRight' && tag !== 'INPUT') this.seek(this.time + 5);
      else if (this.mode === 'film' && e.key === 'ArrowLeft' && tag !== 'INPUT') this.seek(this.time - 5);
      else if (this.mode === 'film' && e.key === ']') this.seekScene(this.timeline.indexAt(this.time) + 1);
      else if (this.mode === 'film' && e.key === '[') this.previousChapter();
      else if (e.key === 'f' || e.key === 'F') this.toggleFullscreen();
    };
    root.addEventListener('pointerdown', onPointerDown, true);
    root.addEventListener('focusin', onFocusIn);
    root.addEventListener('keydown', onKey);
    this.unbind.push(() => {
      root.removeEventListener('pointerdown', onPointerDown, true);
      root.removeEventListener('focusin', onFocusIn);
      root.removeEventListener('keydown', onKey);
    });
  }

  /** Back to the start of this chapter, or to the previous one if we are near its start. */
  private previousChapter() {
    const i = this.timeline.indexAt(this.time);
    const intoScene = this.time - this.timeline.scenes[i].start;
    this.seekScene(intoScene > 1.5 || i === 0 ? i : i - 1);
  }

  private toggleFullscreen() {
    const screen = this.ui.screen ?? this.ui.stage;
    try {
      if (document.fullscreenElement) document.exitFullscreen();
      else screen?.requestFullscreen?.().catch(() => {});
    } catch {
      /* fullscreen is optional */
    }
  }
}
