// Keep the current public API shape for minimal churn.
export type Dictionary = Set<string>;

function normalize(text: string): Dictionary {
  return new Set(
    text
      .split(/\r?\n/)
      .map((w) => w.trim().toLowerCase())
      .filter(Boolean)
  );
}

/**
 * Loads the word list from:
 * - Browser: fetch('/dictionary/english.txt') served from /public
 * - Node/Vitest: reads {projectRoot}/public/dictionary/english.txt
 */
export async function loadWordlist(
  path = '/dictionary/english.txt'
): Promise<Dictionary> {
  const isNode = typeof process !== 'undefined' && !!process.versions?.node;

  if (isNode) {
    const { readFile } = await import('fs/promises');
    const { resolve } = await import('path');

    // In ESM/Vite, __dirname may be undefined; resolve from project root.
    // `path` is like '/dictionary/english.txt' → strip leading slash.
    const rel = path.replace(/^\//, '');
    const abs = resolve(process.cwd(), 'public', rel.replace(/^public\//, ''));
    const text = await readFile(abs, 'utf-8');
    return normalize(text);
  }

  // Browser (Vite dev/prod)
  const res = await fetch(path, { cache: 'no-cache' });
  if (!res.ok) throw new Error(`Failed to fetch dictionary: ${path} (${res.status})`);
  const text = await res.text();
  return normalize(text);
}

export function hasWord(dict: Dictionary, word: string): boolean {
  return dict.has(word.toLowerCase());
}