import { useRef } from 'react';
import type { Film as FilmSpec } from '../engine/timeline';
import { usePlayer } from './useStage';
import { STAGE } from '../engine/timeline';
import { countEvent } from '../../app/analytics';

interface FilmProps {
  film: FilmSpec;
  /** Shown above the stage; defaults to the film's heading. */
  caption?: string;
}

/**
 * A narrated, scrubbable film with chapters, a control strip for live scenes,
 * explore mode and keyboard shortcuts. Scenes come from `film.scenes`.
 */
const Film = ({ film, caption }: FilmProps) => {
  const refs = {
    root: useRef<HTMLDivElement>(null),
    screen: useRef<HTMLDivElement>(null),
    stage: useRef<HTMLDivElement>(null),
    canvas: useRef<HTMLCanvasElement>(null),
    overlay: useRef<HTMLDivElement>(null),
    poster: useRef<HTMLButtonElement>(null),
    play: useRef<HTMLButtonElement>(null),
    prev: useRef<HTMLButtonElement>(null),
    next: useRef<HTMLButtonElement>(null),
    scrub: useRef<HTMLInputElement>(null),
    time: useRef<HTMLSpanElement>(null),
    speed: useRef<HTMLSelectElement>(null),
    fullscreen: useRef<HTMLButtonElement>(null),
    narration: useRef<HTMLParagraphElement>(null),
    narrationLabel: useRef<HTMLSpanElement>(null),
    chapters: useRef<HTMLOListElement>(null),
    strip: useRef<HTMLDivElement>(null),
    controls: useRef<HTMLDivElement>(null),
    exploreBar: useRef<HTMLDivElement>(null),
    exploreStatus: useRef<HTMLSpanElement>(null),
    explorePause: useRef<HTMLButtonElement>(null),
    exploreBack: useRef<HTMLButtonElement>(null),
    handover: useRef<HTMLDivElement>(null),
    handoverText: useRef<HTMLParagraphElement>(null),
    handoverTry: useRef<HTMLButtonElement>(null),
  };

  usePlayer(
    film,
    () => (refs.canvas.current ? { ...Object.fromEntries(Object.entries(refs).map(([k, r]) => [k, r.current])), canvas: refs.canvas.current } as never : null),
    { posterTime: film.posterTime ?? 0, mode: 'film', onEvent: (event) => countEvent(`film/${film.id}/${event}`) },
    [film],
  );

  const hasLive = film.scenes.some((s) => s.live);

  return (
    <div className="film breakout" ref={refs.root} tabIndex={-1} aria-label={film.title}>
      <div className="film__top">
        <h3 className="film__heading">
          {caption ?? film.heading[0]} {!caption && <em>{film.heading[1]}</em>}
        </h3>
        <span className="film__label">{film.label}</span>
      </div>

      <div className="screen" ref={refs.screen}>
        <div className="stage is-poster" ref={refs.stage}>
          <canvas ref={refs.canvas} width={STAGE.width} height={STAGE.height} aria-label={`${film.title}, animated film`} />
          <div className="stage__overlay" ref={refs.overlay} aria-hidden="true" />
          <button ref={refs.poster} className="poster-play" type="button">
            ▶&nbsp; Play the film
          </button>
          <div className="handover" ref={refs.handover} role="status" hidden>
            <p ref={refs.handoverText} />
            <button ref={refs.handoverTry} type="button">Try it</button>
          </div>
        </div>
        <div className="live-strip" ref={refs.strip} hidden>
          <div className="live-controls" ref={refs.controls} />
          <div className="explore-bar" ref={refs.exploreBar} hidden>
            <span ref={refs.exploreStatus} />
            <button ref={refs.explorePause} type="button">Pause simulation</button>
            <button ref={refs.exploreBack} type="button">Resume the film</button>
          </div>
        </div>
      </div>

      <div className="transport">
        <button ref={refs.play} type="button" className="transport__play">Play</button>
        <button ref={refs.prev} type="button" title="Previous chapter" aria-label="Previous chapter">‹</button>
        <button ref={refs.next} type="button" title="Next chapter" aria-label="Next chapter">›</button>
        <input ref={refs.scrub} type="range" min="0" max="100" step="0.05" defaultValue="0" aria-label="Timeline" />
        <span ref={refs.time} className="transport__time">0:00 / 0:00</span>
        <select ref={refs.speed} aria-label="Playback speed" defaultValue="1">
          <option value="0.5">0.5×</option>
          <option value="0.75">0.75×</option>
          <option value="1">1×</option>
          <option value="1.5">1.5×</option>
          <option value="2">2×</option>
        </select>
        <button ref={refs.fullscreen} type="button" title="Fullscreen (F)">⛶</button>
      </div>

      <section className="narration">
        <span ref={refs.narrationLabel} className="narration__label">Narration</span>
        <p ref={refs.narration} />
      </section>

      <details className="chapters-box">
        <summary>Chapters</summary>
        <ol className="chapters" ref={refs.chapters} />
      </details>
      <p className="film__hint">
        Space: play / pause · ← →: 5 s · [ ]: chapter · F: fullscreen
        {hasLive && ' · live scenes: touch a control to take over, Esc to resume'}
      </p>
    </div>
  );
};

export default Film;
