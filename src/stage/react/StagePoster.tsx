import { useEffect, useRef, useState } from 'react';
import { Timeline, STAGE } from '../engine/timeline';
import { loadFonts } from '../draw/theme';
import { stageBackground } from './useStage';
import { films } from '../../content/films';

/** The poster frame of a film, drawn once into a canvas (no overlay: posters carry no formulas). */
const StagePoster = ({ slug, alt }: { slug: string; alt: string }) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const load = films[slug];
    const canvas = ref.current;
    if (!load || !canvas) return;
    let cancelled = false;
    Promise.all([load(), loadFonts()]).then(([m]) => {
      if (cancelled) return;
      const film = m.default;
      const timeline = new Timeline(film.scenes, { background: stageBackground() });
      const draw = () => {
        const rect = canvas.getBoundingClientRect();
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const width = Math.max(1, Math.round((rect.width || 320) * dpr));
        canvas.width = width;
        canvas.height = Math.round((width * STAGE.height) / STAGE.width);
        const ctx = canvas.getContext('2d')!;
        ctx.setTransform(canvas.width / STAGE.width, 0, 0, canvas.height / STAGE.height, 0, 0);
        timeline.render(ctx, film.posterTime ?? 0);
      };
      draw();
      setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  return <canvas ref={ref} width={STAGE.width} height={STAGE.height} aria-label={alt} style={{ opacity: ready ? 1 : 0, transition: 'opacity 0.4s' }} />;
};

export default StagePoster;
