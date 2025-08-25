import { create } from 'zustand';
import { loadWordlist, Dictionary } from '../dictionary/loader';

interface DictionaryState {
  dictionary: Dictionary;
  load(): Promise<void>;
}

export const useDictionaryStore = create<DictionaryState>((set) => ({
  dictionary: new Set(),
  async load() {
    const dict = await loadWordlist();
    set({ dictionary: dict });
  },
}));

