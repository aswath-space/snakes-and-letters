import { describe, it, expect, beforeEach } from 'vitest';
import { useDictionaryStore } from '../src/store/dictionaryStore';

beforeEach(() => {
  useDictionaryStore.setState({ dictionary: new Set() });
});

describe('dictionary store', () => {
  it('loads dictionary into state', async () => {
    await useDictionaryStore.getState().load();
    expect(useDictionaryStore.getState().dictionary.size).toBeGreaterThan(0);
  });
});
