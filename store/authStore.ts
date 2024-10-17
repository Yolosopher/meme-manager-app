import { create } from 'zustand';

type AuthStore = {
  auth: AuthResult | null;
  setAuth: (auth: AuthResult | null) => void;
};
const authStore = create<AuthStore>((set) => ({
  auth: null,
  setAuth: (auth) => set({ auth }),
}));

export default authStore;
