import { ReactNode, useRef } from 'react';
import type { Scene } from '../engine/timeline';
import { STAGE } from '../engine/timeline';
import { usePlayer } from './useStage';
import { countEvent } from '../../app/analytics';

interface ExplorableProps {
  scene: Scene;
  title?: string;
  caption?: ReactNode;
  /** Restart the scene's clock when it reaches its duration (default) or stop there. */
  loop?: boolean;
}

/**
 * One live scene, running from the start under the reader's control: the
 * controls in the strip are theirs, time keeps running, and Reset starts over.
 */
const Explorable = ({ scene, title, caption, loop = true }: ExplorableProps) => {
  const root = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const overlay = useRef<HTMLDivElement>(null);
  const play = useRef<HTMLButtonElement>(null);
  const strip = useRef<HTMLDivElement>(null);
  const controls = useRef<HTMLDivElement>(null);
  const fullscreen = useRef<HTMLButtonElement>(null);
  const screen = useRef<HTMLDivElement>(null);

  usePlayer(
    [scene],
    () =>
      canvas.current
        ? {
            canvas: canvas.current,
            root: root.current,
            stage: stage.current,
            screen: screen.current,
            overlay: overlay.current,
            play: play.current,
            strip: strip.current,
            controls: controls.current,
            fullscreen: fullscreen.current,
          }
        : null,
    {
      mode: 'explorable',
      loop,
      onEvent: (event) => {
        const article = window.location.pathname.match(/\/blog\/([^/]+)/)?.[1];
        if (event === 'interact' && article) countEvent(`explorable/${article}`);
      },
    },
    [scene],
  );

  return (
    <figure className="explorable breakout" ref={root} tabIndex={-1}>
      {title && (
        <div className="film__top">
          <h3 className="film__heading">{title}</h3>
          <span className="film__label">Explorable</span>
        </div>
      )}
      <div className="screen" ref={screen}>
        <div className="stage" ref={stage}>
          <canvas ref={canvas} width={STAGE.width} height={STAGE.height} aria-label={title ?? scene.name} />
          <div className="stage__overlay" ref={overlay} aria-hidden="true" />
          <div className="explorable__corner">
            <button ref={play} type="button" className="transport__play">Pause</button>
            <button ref={fullscreen} type="button" title="Fullscreen (F)">⛶</button>
          </div>
        </div>
        <div className="live-strip" ref={strip} hidden>
          <div className="live-controls" ref={controls} />
        </div>
      </div>
      {caption && <figcaption className="caption">{caption}</figcaption>}
    </figure>
  );
};

export default Explorable;
