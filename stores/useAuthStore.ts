import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

type User = {
  id: string;
  email: string;
  name: string;
};

type AuthState = {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  hydrate: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  signIn: async (email, password) => {
    // Mock authentication
    const mockUser = {
      id: '1',
      email,
      name: 'John Doe',
    };
    await AsyncStorage.setItem('user', JSON.stringify(mockUser));
    set({ user: mockUser });
  },
  signUp: async (email, password, name) => {
    // Mock registration
    const mockUser = {
      id: '1',
      email,
      name,
    };
    await AsyncStorage.setItem('user', JSON.stringify(mockUser));
    set({ user: mockUser });
  },
  signOut: async () => {
    await AsyncStorage.removeItem('user');
    set({ user: null });
  },
  hydrate: async () => {
    try {
      const userJson = await AsyncStorage.getItem('user');
      if (userJson) {
        set({ user: JSON.parse(userJson) });
      }
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      set({ isLoading: false });
    }
  },
}));