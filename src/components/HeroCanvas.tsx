import { useEffect, useRef } from 'react';
import { camera } from '../stage/model/camera';
import { fibreSamples, spherePoint } from '../stage/model/hopf';
import { polyline3 } from '../stage/draw/surface';
import { resolvedTheme } from '../app/theme';

/**
 * The Hopf fibration, live, behind the home page title: the fibres over a ring
 * of base points, projected stereographically and slowly turned. Drawn in the
 * page's own colours, lightly, so the text stays readable.
 */
const HeroCanvas = ({ className }: { className?: string }) => {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let frame = 0;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let theme = resolvedTheme();

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
    };
    const onTheme = () => {
      theme = resolvedTheme();
    };
    window.addEventListener('themechange', onTheme);

    // the base points: two rings of latitude, colours by longitude
    const COUNT = 14;
    const rings = [0.62, 1.05, 1.55];

    const draw = (time: number) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);
      const dark = theme === 'dark';
      const cam = camera({
        yaw: 0.35 + time * 0.00006,
        pitch: 0.42 + 0.08 * Math.sin(time * 0.00011),
        scale: Math.min(width, height) * 0.26,
        cx: width * (width > 900 ? 0.76 : 0.7),
        cy: height * 0.5,
        focal: 9,
      });
      const phase = time * 0.00025;
      rings.forEach((polar, r) => {
        for (let k = 0; k < COUNT; k++) {
          const lambda = (2 * Math.PI * k) / COUNT + r * 0.3;
          const base = spherePoint(polar, lambda);
          const pts = fibreSamples(base, 90, phase * (1 + 0.15 * r), 40);
          const hue = (lambda / (2 * Math.PI)) * 360;
          const alpha = dark ? 0.26 : 0.22;
          polyline3(ctx, cam, pts, {
            color: dark ? `hsla(${hue.toFixed(0)}, 70%, 68%, ${alpha})` : `hsla(${hue.toFixed(0)}, 55%, 42%, ${alpha})`,
            width: 1.4,
            widthAt: (_, p) => 0.6 + 0.8 * p.k,
          });
        }
      });
    };

    const loop = (now: number) => {
      frame = requestAnimationFrame(loop);
      draw(now);
    };
    const ro = new ResizeObserver(() => {
      resize();
      if (reduced) draw(0);
    });
    ro.observe(canvas);
    resize();
    if (reduced) draw(0);
    else frame = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      window.removeEventListener('themechange', onTheme);
    };
  }, []);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
};

export default HeroCanvas;
