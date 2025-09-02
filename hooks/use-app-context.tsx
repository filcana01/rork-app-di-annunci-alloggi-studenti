import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';
import { Language, translations } from '@/constants/translations';
import { User, Listing } from '@/types';
import { mockListings } from '@/mocks/listings';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations.it;
  user: User | null;
  setUser: (user: User | null) => void;
  favorites: string[];
  toggleFavorite: (listingId: string) => void;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: Partial<User>) => Promise<boolean>;
}

export const [AppProvider, useApp] = createContextHook<AppContextType>(() => {
  const [language, setLanguageState] = useState<Language>('it');
  const [user, setUserState] = useState<User | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    loadStoredData();
  }, []);

  const loadStoredData = async () => {
    try {
      const [storedLang, storedUser, storedFavorites] = await Promise.all([
        AsyncStorage.getItem('language'),
        AsyncStorage.getItem('user'),
        AsyncStorage.getItem('favorites'),
      ]);

      if (storedLang) setLanguageState(storedLang as Language);
      if (storedUser) setUserState(JSON.parse(storedUser));
      if (storedFavorites) setFavorites(JSON.parse(storedFavorites));
    } catch (error) {
      console.error('Error loading stored data:', error);
    }
  };

  const setLanguage = async (lang: Language) => {
    setLanguageState(lang);
    await AsyncStorage.setItem('language', lang);
  };

  const setUser = async (newUser: User | null) => {
    setUserState(newUser);
    if (newUser) {
      await AsyncStorage.setItem('user', JSON.stringify(newUser));
    } else {
      await AsyncStorage.removeItem('user');
    }
  };

  const toggleFavorite = async (listingId: string) => {
    const newFavorites = favorites.includes(listingId)
      ? favorites.filter(id => id !== listingId)
      : [...favorites, listingId];
    
    setFavorites(newFavorites);
    await AsyncStorage.setItem('favorites', JSON.stringify(newFavorites));
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock login
    if (email && password) {
      const mockUser: User = {
        id: 'user1',
        email,
        firstName: 'Mario',
        lastName: 'Rossi',
        phone: '+39 333 1234567',
        role: email.includes('admin') ? 'admin' : 'student',
        verified: true,
        createdAt: new Date(),
      };
      await setUser(mockUser);
      return true;
    }
    return false;
  };

  const logout = async () => {
    await setUser(null);
    setFavorites([]);
    await AsyncStorage.removeItem('favorites');
  };

  const register = async (userData: Partial<User>): Promise<boolean> => {
    // Mock registration
    const newUser: User = {
      id: Date.now().toString(),
      email: userData.email || '',
      firstName: userData.firstName || '',
      lastName: userData.lastName || '',
      phone: userData.phone || '',
      role: 'student',
      verified: false,
      createdAt: new Date(),
      ...userData,
    };
    await setUser(newUser);
    return true;
  };

  return {
    language,
    setLanguage,
    t: translations[language],
    user,
    setUser,
    favorites,
    toggleFavorite,
    isAuthenticated: !!user,
    login,
    logout,
    register,
  };
});