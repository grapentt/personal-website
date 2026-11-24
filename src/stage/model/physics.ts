// Illustrative physical constants for the molecule scenes.

/** Thermal energy at 300 K, in eV. */
export const kT = 0.0259;

/** Force constants (curvature of the energy) in eV/Å². */
export const stiffness = Object.freeze({ soft: 0.05, stiff: 20 });

/** Thermal spread along each mode, in Å: σ = √(kT / k). */
export const sigma = Object.freeze({
  soft: Math.sqrt(kT / stiffness.soft),
  stiff: Math.sqrt(kT / stiffness.stiff),
});

/** κ = λ_max / λ_min of the stiffness matrix. */
export const conditionNumber = stiffness.stiff / stiffness.soft;
