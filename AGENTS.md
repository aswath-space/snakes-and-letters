---
Project: "Snakes & Letters"
Type: "PWA (React + TypeScript + Vite + Tailwind + Zustand + Vitest)"
Goal: > 
  Generate a runnable MVP with tests passing, packaged as a responsive PWA. 
  Keep the game engine pure/testable, and the UI minimal but polished.
---

# AGENTS.md

## 1. What to build (MVP scope)

A word-driven board game inspired by snakes & ladders:
- Roll a die → required word length for this turn.
- Player types a word that:
   - Has the exact length,
   - Exists in the dictionary, and
   - Starts with the last letter of the previous valid word (first turn uses a random start letter).
- Movement: On valid word → move forward by word length. On invalid word:
   - Easy Mode: stay put,
   - Challenge Mode: move back by die value.
- Snakes/Ladders: Resolve immediately. “Snake resist” challenge (optional rule): prompt for a bonus word (length = die + 1); if valid, ignore the snake.
- Wildcards: each player has 2 wildcards to ignore starting-letter rule once.
- No repeats option: words cannot be reused in a game.
- Multiplayer: turn passes with the next start letter = last letter of the accepted word.
- Timers (mode): optional per-turn countdown (UI-level only for v1).
- Non-goals for v1: online matchmaking, profiles, sync cloud saves, accessibility beyond basic ARIA.

## 2. Repository structure (authoritative)

```text
snakes-and-letters/
├─ package.json
├─ pnpm-lock.yaml                 # or npm/yarn lockfile (pick one)
├─ tsconfig.json
├─ vite.config.ts
├─ tailwind.config.ts
├─ postcss.config.cjs
├─ index.html
├─ public/
│  ├─ favicon.svg
│  ├─ manifest.webmanifest
│  ├─ icons/                # 196.png, 512.png (ignored in git)
│  └─ dictionary/
│     └─ english.txt              # simple newline word list (MVP)
├─ src/
│  ├─ main.tsx
│  ├─ app.css
│  ├─ App.tsx
│  ├─ engine/                     # Pure, DOM-free logic (unit-tested)
│  │  ├─ board.ts                 # serpentine mapping, snakes/ladders resolve
│  │  ├─ rules.ts                 # rule toggles, modes, constants
│  │  ├─ validate.ts              # validateWord(), canSatisfy(), normalize
│  │  ├─ dice.ts                  # rng with seed support
│  │  ├─ types.ts                 # shared types/interfaces/enums
│  │  └─ index.ts                 # re-exports
│  ├─ dictionary/
│  │  ├─ loader.ts                # loadWordlist(), hasWord(), preload
│  │  └─ index.ts
│  ├─ store/
│  │  └─ useGameStore.ts          # Zustand store: state + actions
│  ├─ components/
│  │  ├─ Board.tsx
│  │  ├─ Cell.tsx
│  │  ├─ HUD.tsx                  # score, die, word-length target, timer
│  │  ├─ WordInput.tsx
│  │  ├─ Dice.tsx
│  │  └─ ToggleBar.tsx            # mode toggles: easy/challenge, no-repeats, timers
│  ├─ pwa/
│  │  ├─ service-worker.ts
│  │  └─ registerSW.ts
│  ├─ utils/
│  │  └─ random.ts
│  └─ styles/
│     └─ tailwind.css
├─ tests/
│  ├─ board.test.ts
│  ├─ validate.test.ts
│  ├─ snakes-ladders.test.ts
│  └─ store.test.ts
├─ .eslintrc.cjs
├─ .prettierrc
└─ README.md
```
Agents: honor this structure; do not invent extra top-level folders.

## 3. Setup & commands (single source of truth)

```bash
# Node 20+ recommended
pnpm i        # or npm ci / yarn install
pnpm dev      # vite dev server
pnpm build    # production build
pnpm preview  # preview build
pnpm test     # vitest + jsdom
pnpm lint     # eslint
pnpm format   # prettier
```

PWA must be installable (manifest + SW); verify Lighthouse PWA checks locally.

## 4. Tech decisions (lock these)

- React 18 + TypeScript + Vite as build tool.
- TailwindCSS for styling; no CSS frameworks beyond Tailwind.
- Zustand for state; keep pure engine separate from React.
- Vitest + @testing-library/react for tests.
- ESLint + Prettier for style.

This mirrors current best practice for AGENTS.md-driven repos: keep commands explicit and conventions discoverable. 

## 5. Engine contracts (pure functions)

Keep these in `src/engine/` and unit-test thoroughly.
```ts
// types.ts
export type CellIndex = number;         // 0..(N-1), N default 100
export interface SnakeOrLadder { from: CellIndex; to: CellIndex; }
export interface Rules {
  boardSize: number;                    // default 100
  snakes: SnakeOrLadder[];
  ladders: SnakeOrLadder[];
  allowWildcards: boolean;              // default true (2 each)
  noRepeats: boolean;                   // default false
  mode: 'easy' | 'challenge';
  timerSeconds?: number;                // optional per turn
}

// validate.ts
export function normalize(word: string): string;
export function validateWord(params: {
  word: string;
  requiredLength: number;
  startLetter: string;                  // ignored if wildcard used
  hasWord: (w: string) => boolean;      // dictionary contract
  noRepeats: boolean;
  usedWords: Set<string>;
}): { valid: boolean; reason?: 'length'|'start'|'missing'|'repeat' };

// board.ts
export function serpentineIndex(i: CellIndex, cols: number = 10): { row: number; col: number };
export function resolveSnakesLadders(pos: CellIndex, rules: Rules): CellIndex;

// dice.ts
export function rollDie(rng?: () => number): number; // 1..6
```

Movement logic (authoritative):
- If `validateWord` returns `valid: true` → `pos += word.length`.
- Else:
    - Easy: no move.
    - Challenge: `pos -= lastDie`.
- Apply `resolveSnakesLadders` immediately after each move.
- Clamp `pos` to `[0, boardSize - 1]`. First to last cell wins.

## 6. Dictionary loader contract

`src/dictionary/loader.ts`:
```ts
export interface Dictionary {
  hasWord: (w: string) => boolean;
  canSatisfy?: (len: number, startsWith?: string) => boolean; // optional perf
}

export async function loadWordlist(path = '/dictionary/english.txt'): Promise<Dictionary>;
```
- MVP: simple newline-delimited word list.
- Must be case-insensitive.
- Expose `hasWord()` and optionally `canSatisfy()` for UX hints (e.g., pre-check if any word can exist for given length and starting letter).

## 7. Store API (Zustand)

`src/store/useGameStore.ts` (shape; feel free to extend conservatively):
```ts
type PlayerId = 0 | 1; // MVP: two players local

interface GameState {
  rules: Rules;
  positions: Record<PlayerId, CellIndex>;
  current: PlayerId;
  lastDie: number;
  startLetter: string;          // letter constraint for this turn
  usedWords: Set<string>;
  wildcards: Record<PlayerId, number>; // start at 2

  // Derived/UI
  requiredLength: number;

  // Actions
  newGame(rules?: Partial<Rules>): void;
  roll(): void;                 // sets requiredLength
  submitWord(word: string, useWildcard?: boolean): { accepted: boolean; reason?: string };
  endTurn(): void;
}
```
Rules for actions (must implement):
- `roll()` → sets `lastDie` 1..6 and `requiredLength = lastDie` (option: later allow 9–10 bonus; leave flag for v2).
- `submitWord()`:
  - Normalize input.
  - Validate via `validateWord` with dictionary.
  - If accepted, move forward by `word.length`, update `startLetter = word.at(-1)`.
  - If rejected, apply Easy/Challenge fallback.
  - Resolve snakes/ladders.
  - Track `usedWords` if `noRepeats`.
  - Decrement wildcard if used.
- `endTurn()` → switch player.

## 8. UI components (minimum)

- Board: 10×10 serpentine grid; highlight current player cell.
- Dice: press → triggers `roll()`. Show face 1–6.
- WordInput: text box, submit, optional wildcard toggle, simple error messaging.
- HUD: shows required length, start letter, last die, toggles (modes), remaining wildcards, basic timer if enabled.
- ToggleBar: easy/challenge, no-repeats, timer on/off (persist within session).
- Responsiveness: mobile-first, single-column stacking; keep FPS smooth.

## 9. PWA requirements

- `public/manifest.webmanifest` with name, short_name, theme/background.
- Icons: `favicon.svg` plus PNG icons (`/icons/196.png`, `/icons/512.png`).
- `src/pwa/service-worker.ts` with basic asset caching (Vite plugin or Workbox ok).
- Register SW in `main.tsx` via `registerSW.ts`.
- Pass core Lighthouse PWA checks locally.

Note for agents: Follow the PWA checklist; don’t over-engineer offline. The goal is installable + basic cache.

## 10. Testing (must pass)

Implement Vitest unit tests to green:
- `validate.test.ts`
  - length/start/dictionary/no-repeats cases, wildcard bypass.
- `board.test.ts`
  - serpentine mapping row/col, clamping.
- `snakes-ladders.test.ts`
  - resolve on exact landings and chains (ladder→snake).
- `store.test.ts`
  - roll/submitWord/endTurn flows, movement math, wildcards, Easy vs Challenge branches.

Agents should iterate until all tests pass.

## 11. Coding standards & constraints

- Strict TypeScript, no `any` unless justified with comment.
- Keep engine side-effect free (no DOM/timeouts).
- Timer logic belongs in UI; engine may expose `timerSeconds` as configuration only.
- Keep dictionary boundary abstract (`hasWord()` only).
- No network calls; MVP is fully local.
- Lint and format clean.
- Small components; keep `App.tsx` thin.

AGENTS.md is the single, predictable place for instructions—tools should read this file to act consistently across runs. 

## 12. Default content (seed)

- `public/dictionary/english.txt` — include ~2–5k common words (ASCII only for MVP).
- `rules.ts` — seed 4–6 snakes and 4–6 ladders (balanced).

## 13. Task checklist (for agents)

- Scaffold repo exactly per structure above.
- Add configs: Vite, Tailwind, ESLint, Prettier, TS strict.
- Implement engine functions + unit tests.
- Implement dictionary loader + simple wordlist.
- Implement Zustand store with required actions.
- Build UI components and wire to store.
- Add PWA manifest + service worker + basic caching.
- Ensure `pnpm test` passes and `pnpm build` succeeds.
- Run a local Lighthouse check; fix installability if needed.
- Prepare a concise README.md (how to run, controls, rules).

## 14. Acceptance criteria

- `pnpm i && pnpm test && pnpm build` runs clean on Node 20+.
- Game works end-to-end locally: roll → input → move → resolve snakes/ladders → next turn.
- PWA is installable; board is responsive and performant on mobile.
- Unit tests cover the contracts above and pass.

## 15. Notes for different agents

- Codex (cloud or CLI): respect this file as project contract; prefer incremental PRs or local edits with passing tests.
- Other coding agents: AGENTS.md is intended to be cross-tool and future-proof. Keep commands explicit and avoid hidden steps. 

## References (for the human reading this)

- OpenAI’s Codex (software engineering agent) and setup guidance. 
- AGENTS.md open format (examples and rationale). 
- Agents API/SDK docs (general agent patterns). 
