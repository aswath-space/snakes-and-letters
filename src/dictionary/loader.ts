export type Dictionary = Set<string>;

export async function loadWordlist(
  path = '/dictionary/english.txt'
): Promise<Dictionary> {
  const normalize = (text: string): Dictionary =>
    new Set(
      text
        .split(/\r?\n/)
        .map((w) => w.trim().toLowerCase())
        .filter(Boolean)
    );

  if (typeof process !== 'undefined' && process.versions?.node) {
    const { readFile } = await import('fs/promises');
    const { resolve } = await import('path');
    const file = resolve(
      __dirname,
      '../../public',
      path.replace(/^\//, '')
    );
    const text = await readFile(file, 'utf-8');
    return normalize(text);
  }
  const res = await fetch(path);
  const text = await res.text();
  return normalize(text);
}

export function hasWord(dict: Dictionary, word: string): boolean {
  return dict.has(word.toLowerCase());
}
