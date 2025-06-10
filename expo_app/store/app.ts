import { create } from 'zustand'

interface AppState {
  // Token management
  token: string
  setToken: (token: string) => void
}

export const useAppStore = create<AppState>((set) => ({
  // Token management
  token: '',
  setToken: (token) => set({ token }),
})) 