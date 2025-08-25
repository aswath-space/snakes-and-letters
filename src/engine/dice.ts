// Simple seeded random number generator for deterministic dice rolls
export class RNG {
  private seed: number;
  constructor(seed = Date.now()) {
    this.seed = seed;
  }
  next() {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }
}

// Roll a die using optional RNG; returns values 3-6
export function rollDie(rng?: RNG): number {
  const r = rng ? rng.next() : Math.random();
  // Die now ranges 3-6 to avoid one- or two-letter rounds
  return Math.floor(r * 4) + 3;
}
