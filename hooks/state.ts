import { create } from "zustand";

interface CategoryState {
  selected: string;
  setSelected: (selected: string) => void;
}

export const useCategoryState = create<CategoryState>()((set) => ({
  selected: "All Category",
  setSelected: (selected: string) => set({ selected }),
}));
