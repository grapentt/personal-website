// Everything a scene needs, in one import:
//   import { defineScene, seg, fade, text, color, type, tex, drawSurface, … } from '@/stage/kit';

export { defineScene, STAGE, Timeline, narrationAt } from './engine/timeline';
export type { Scene, SceneSpec, Film, NarrationCue } from './engine/timeline';
export * from './engine/timing';
export { slider, choice, toggle, drag, pick, inputsAt } from './engine/controls';
export type { Control, Controls, Inputs, Region, Keyframes } from './engine/controls';
export { simulation, stepAt } from './engine/simulation';
export type { Simulation, SimulationSpec } from './engine/simulation';
export { createRng } from './engine/random';
export type { Rng } from './engine/random';
export type { LiveState } from './engine/live';

export { color, axisColor, axisName, font, type, loadFonts } from './draw/theme';
export type { TextStyle } from './draw/theme';
export { rgba, mix, hexToRgb, hue } from './draw/color';
export { text, wrap, curvedText, splitLines, formatNumber, measure, SUBSCRIPT } from './draw/text';
export { arrow, line, dashedLine, dot, ring, brace, bar, roundRect, polyline } from './draw/shapes';
export { card, columnFrame, vectorRow, columnVector, rowVector, readout, sceneHeader } from './draw/widgets';
export { tex, Tex, collectTex } from './draw/tex';
export { drawMolecule, moleculeCamera, arrow3, drawAxisTriad } from './draw/moleculeView';
export { drawSurface, polyline3, polygon3, spherePoint } from './draw/surface';
export { dotGridBackground } from './draw/background';

export { camera } from './model/camera';
export type { Camera, CameraOptions, Projected } from './model/camera';
export * as vec3 from './model/vec3';
export type { Vec3 } from './model/vec3';
export * as rotation from './model/rotation';
export type { Mat3 } from './model/rotation';
export * as quaternion from './model/quaternion';
export type { Quat } from './model/quaternion';
export * as hopf from './model/hopf';
export { zeroMomentumRotations, rotationAt, centred } from './model/rigidBody';
export { springNetwork, springEnergy } from './model/energy';
export { molecule, modes, configuration, atomColor, ELEMENTS, Molecule } from './model/molecule';
export { kT, stiffness, sigma, conditionNumber } from './model/physics';
