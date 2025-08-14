import { create } from 'zustand';

export type FilterState = {
  searchTerm: string;
  minPopulation: number;
  selectedContinents: string[];
  showOnlyIndependent: boolean;
};

// Defines the shape of the store's actions
export type FilterActions = {
  setSearchTerm: (searchTerm: string) => void;
  setMinPopulation: (minPopulation: number) => void;
  toggleContinent: (continent: string) => void;
  toggleShowOnlyIndependent: () => void;
};

export type FilterStore = FilterState & FilterActions;

export const useFilterStore = create<FilterStore>((set) => ({
  searchTerm: '',
  minPopulation: 0,
  selectedContinents: [],
  showOnlyIndependent: false,
  setSearchTerm: (searchTerm: string) => set({ searchTerm }),
  setMinPopulation: (minPopulation: number) => set({ minPopulation }),
  toggleContinent: (continent: string) =>
    set((state) => {
      const selectedContinents = state.selectedContinents.includes(continent)
        ? state.selectedContinents.filter((c) => c !== continent)
        : [...state.selectedContinents, continent];
      return { selectedContinents };
    }),
  toggleShowOnlyIndependent: () =>
    set((state) => ({ showOnlyIndependent: !state.showOnlyIndependent })),
}));
