import { describe, it, expect, vi } from 'vitest';
import { loadWordlist } from '../src/dictionary/loader';

describe('loadWordlist retries', () => {
  it('retries failed fetches and eventually succeeds', async () => {
    const fetchMock = vi
      .fn<Parameters<typeof fetch>, ReturnType<typeof fetch>>()
      .mockRejectedValueOnce(new Error('net'))
      .mockResolvedValueOnce({
        ok: true,
        text: async () => 'one\ntwo',
      } as Response);

    const dict = await loadWordlist('/fake', {
      fetchFn: fetchMock,
      retries: 1,
      delayMs: 0,
    });
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(dict.has('one')).toBe(true);
    expect(dict.has('two')).toBe(true);
  });

  it('throws after exhausting retries', async () => {
    const fetchMock = vi.fn().mockRejectedValue(new Error('net'));
    await expect(
      loadWordlist('/fake', { fetchFn: fetchMock, retries: 1, delayMs: 0 }),
    ).rejects.toThrow(/Unable to load dictionary/);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
