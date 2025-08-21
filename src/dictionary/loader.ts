export type Dictionary = Set<string>;

export async function loadWordlist(
  path = '/src/dictionary/english.txt'
): Promise<Dictionary> {
  if (typeof process !== 'undefined' && process.versions?.node) {
    const { readFile } = await import('fs/promises');
    const { resolve } = await import('path');
    const text = await readFile(resolve(__dirname, 'english.txt'), 'utf-8');
    return new Set(
      text
        .split(/\r?\n/)
        .map((w) => w.trim().toLowerCase())
        .filter(Boolean)
    );
  }
  const res = await fetch(path);
  const text = await res.text();
  return new Set(
    text
      .split(/\r?\n/)
      .map((w) => w.trim().toLowerCase())
      .filter(Boolean)
  );
}

export function hasWord(dict: Dictionary, word: string): boolean {
  return dict.has(word.toLowerCase());
}
