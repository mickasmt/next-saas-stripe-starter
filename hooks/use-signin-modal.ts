import { create } from 'zustand';

interface useSigninModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useSigninModal = create<useSigninModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));