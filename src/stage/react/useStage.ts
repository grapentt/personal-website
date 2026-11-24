import { useEffect, useRef } from 'react';
import { Timeline, Scene, Film, STAGE } from '../engine/timeline';
import { Player, PlayerUi, PlayerOptions } from '../engine/player';
import { dotGridBackground } from '../draw/background';
import { loadFonts } from '../draw/theme';

let background: ((ctx: CanvasRenderingContext2D) => void) | null = null;
export const stageBackground = () => {
  background ??= dotGridBackground(STAGE.width, STAGE.height);
  return background;
};

/** Mounts a Player on the given UI elements for the lifetime of the component. */
export function usePlayer(scenes: Scene[] | Film, getUi: () => PlayerUi | null, options: PlayerOptions, deps: unknown[] = []) {
  const playerRef = useRef<Player | null>(null);
  useEffect(() => {
    const ui = getUi();
    if (!ui) return;
    const list = Array.isArray(scenes) ? scenes : scenes.scenes;
    const timeline = new Timeline(list, { background: stageBackground() });
    const player = new Player(timeline, ui, options);
    playerRef.current = player;
    // development only: reach the player from the console, e.g. document.querySelector('.film').__player.seek(42)
    if (import.meta.env.DEV) Object.assign(ui.root ?? ui.canvas, { __player: player });
    loadFonts().then(() => player.invalidate());
    return () => {
      player.destroy();
      playerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return playerRef;
}
