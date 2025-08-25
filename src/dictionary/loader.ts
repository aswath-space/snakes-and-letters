// Keep the current public API shape for minimal churn.
export type Dictionary = Set<string>;

// Convert raw word list text into a normalized set of lowercase words
function normalize(text: string): Dictionary {
  return new Set(
    text
      .split(/\r?\n/)
      .map((w) => w.trim().toLowerCase())
      .filter((w) => w.length > 1),
  );
}

/**
 * Loads the word list from:
 * - Browser: fetch('/dictionary/english.txt') served from /public
 * - Node/Vitest: reads {projectRoot}/public/dictionary/english.txt
 */
export interface LoadOptions {
  retries?: number;
  delayMs?: number;
  fetchFn?: (input: RequestInfo, init?: RequestInit) => Promise<Response>;
}

export async function loadWordlist(
  path = '/dictionary/english.txt',
  opts: LoadOptions = {},
): Promise<Dictionary> {
  const isNode = typeof process !== 'undefined' && !!process.versions?.node;
  const retries = opts.retries ?? 2;
  const delayMs = opts.delayMs ?? 500;
  const fetchFn = opts.fetchFn;

  if (isNode && !fetchFn) {
    const { readFile } = await import('fs/promises');
    const { resolve } = await import('path');

    // In ESM/Vite, __dirname may be undefined; resolve from project root.
    // `path` is like '/dictionary/english.txt' → strip leading slash.
    const rel = path.replace(/^\//, '');
    const abs = resolve(process.cwd(), 'public', rel.replace(/^public\//, ''));
    const text = await readFile(abs, 'utf-8');
    return normalize(text);
  }

  const fetcher = fetchFn ?? fetch;
  // Browser (Vite dev/prod) with retry logic
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetcher(path, { cache: 'no-cache' });
      if (!res.ok) {
        throw new Error(`Failed to fetch dictionary: ${path} (${res.status})`);
      }
      const text = await res.text();
      return normalize(text);
    } catch (err) {
      if (attempt === retries) {
        throw new Error(
          `Unable to load dictionary after ${retries + 1} attempts`,
        );
      }
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
  throw new Error('Failed to load dictionary');
}

// Check for existence of a word in the dictionary
export function hasWord(dict: Dictionary, word: string): boolean {
  return dict.has(word.toLowerCase());
}

// Return a small list of candidate words matching the criteria
export function getHints(
  dict: Dictionary,
  startLetter: string,
  length: number,
  limit = 5,
): string[] {
  const lower = startLetter.toLowerCase();
  const hints: string[] = [];
  for (const word of dict) {
    if (word.length === length && word.startsWith(lower)) {
      hints.push(word);
      if (hints.length >= limit) break;
    }
  }
  return hints;
}
