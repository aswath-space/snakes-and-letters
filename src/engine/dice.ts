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

export function rollDie(rng?: RNG): number {
  const r = rng ? rng.next() : Math.random();
  return Math.floor(r * 6) + 1;
}
