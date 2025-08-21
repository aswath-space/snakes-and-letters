# Snakes & Letters

A word-driven board game built with React, TypeScript, Vite, Tailwind and Zustand. Roll the die, type a word of the required length starting with the given letter and move across the board while avoiding snakes and climbing ladders.

## Setup

```bash
pnpm i
pnpm dev       # start dev server
pnpm test      # run unit tests
pnpm build     # production build
```

## Gameplay

- Roll to get a word length.
- Enter a dictionary word of that length starting with the required letter.
- Valid words move you forward by their length.
- Invalid words: stay put (easy) or move back by the die (challenge).
- Landing on a snake or ladder moves you immediately.

This project is an MVP scaffold; engine logic is unit tested and the UI is minimal yet functional.

## Shoutouts and Gratitude

- The list of words has been sourced from DWYL's repo [here](https://github.com/dwyl/english-words)
