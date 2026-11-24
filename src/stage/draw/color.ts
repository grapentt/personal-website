export function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function rgba(hex: string, alpha: number) {
  const [r, g, b] = hexToRgb(hex);
  return `rgba(${r},${g},${b},${alpha})`;
}

/** Linear mix of two hex colours; u = 0 gives a, u = 1 gives b. */
export function mix(a: string, b: string, u: number) {
  const A = hexToRgb(a);
  const B = hexToRgb(b);
  return `rgb(${A.map((x, i) => Math.round(x + (B[i] - x) * u)).join(',')})`;
}

/** Hue around the colour wheel (0 … 1) as an hsl string; used to colour fibres by base point. */
export const hue = (u: number, s = 70, l = 62) => `hsl(${Math.round(((u % 1) + 1) % 1 * 360)}, ${s}%, ${l}%)`;
