import { loadWordlist, hasWord } from '../src/dictionary/loader';

describe('loadWordlist', () => {
  it('loads default english dictionary', async () => {
    const dict = await loadWordlist();
    expect(hasWord(dict, 'abacus')).toBe(true);
  });

  it('loads dictionary by identifier', async () => {
    const dict = await loadWordlist('animals');
    expect(hasWord(dict, 'cat')).toBe(true);
    expect(hasWord(dict, 'abacus')).toBe(false);
  });
});
