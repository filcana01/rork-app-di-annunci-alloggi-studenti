import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect, useMemo } from 'react';
import { translations } from '@/constants/translations';
import { createSearchFilters } from '@/types';
import { useListings, useCategories } from '@/hooks/use-graphql';


export const [AppProvider, useApp] = createContextHook(() => {
  const [language, setLanguageState] = useState('it');
  const [user, setUserState] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [currentFilters, setCurrentFilters] = useState(createSearchFilters());
  
  // Usa React Query per ottenere i listings
  const { data: listings = [], isLoading: listingsLoading, error: listingsError } = useListings();
  const { data: categories = [], isLoading: categoriesLoading } = useCategories();

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

      if (storedLang) setLanguageState(storedLang);
      if (storedUser) setUserState(JSON.parse(storedUser));
      if (storedFavorites) setFavorites(JSON.parse(storedFavorites));
    } catch (error) {
      console.error('Error loading stored data:', error);
    }
  };

  const setLanguage = async (lang) => {
    setLanguageState(lang);
    await AsyncStorage.setItem('language', lang);
  };

  const setUser = async (newUser) => {
    setUserState(newUser);
    if (newUser) {
      await AsyncStorage.setItem('user', JSON.stringify(newUser));
    } else {
      await AsyncStorage.removeItem('user');
    }
  };

  const toggleFavorite = async (listingId) => {
    const newFavorites = favorites.includes(listingId)
      ? favorites.filter(id => id !== listingId)
      : [...favorites, listingId];
    
    setFavorites(newFavorites);
    await AsyncStorage.setItem('favorites', JSON.stringify(newFavorites));
  };

  const login = async (email, password) => {
    // Mock login
    if (email && password) {
      const mockUser = {
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

  const register = async (userData) => {
    // Mock registration
    const newUser = {
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

  // Calcola i listings filtrati usando useMemo per ottimizzare le performance
  const filteredListings = useMemo(() => {
    if (!listings.length) return [];
    
    return listings.filter(listing => {
      // Category filter
      if (currentFilters.categoryId && listing.categoryId !== currentFilters.categoryId) {
        return false;
      }
      
      // Price filters
      if (currentFilters.minPrice && listing.monthlyRent < currentFilters.minPrice) {
        return false;
      }
      if (currentFilters.maxPrice && listing.monthlyRent > currentFilters.maxPrice) {
        return false;
      }
      
      // City filter
      if (currentFilters.city && !listing.city.toLowerCase().includes(currentFilters.city.toLowerCase())) {
        return false;
      }
      
      // Surface filters
      if (currentFilters.minSurface && listing.surfaceArea < currentFilters.minSurface) {
        return false;
      }
      if (currentFilters.maxSurface && listing.surfaceArea > currentFilters.maxSurface) {
        return false;
      }
      
      // Rooms filter
      if (currentFilters.numberOfRooms && listing.numberOfRooms !== currentFilters.numberOfRooms) {
        return false;
      }
      
      // Bathrooms filter
      if (currentFilters.numberOfBathrooms && listing.numberOfBathrooms !== currentFilters.numberOfBathrooms) {
        return false;
      }
      
      // Furnishing filter
      if (currentFilters.furnishingStatus !== null && listing.furnishingStatus !== currentFilters.furnishingStatus) {
        return false;
      }
      
      // Features filters
      if (currentFilters.hasTerrace === true && !listing.hasTerrace) {
        return false;
      }
      if (currentFilters.hasGarden === true && !listing.hasGarden) {
        return false;
      }
      if (currentFilters.hasPool === true && !listing.hasPool) {
        return false;
      }
      if (currentFilters.petsAllowed === true && !listing.petsAllowed) {
        return false;
      }
      
      // Accessibility filters
      if (currentFilters.hasElevator === true && !listing.hasElevator) {
        return false;
      }
      if (currentFilters.hasRampAccess === true && !listing.hasRampAccess) {
        return false;
      }
      
      // Other filters
      if (currentFilters.acceptsSwissCaution === true && !listing.acceptsSwissCaution) {
        return false;
      }
      if (currentFilters.isAvailableImmediately === true && !listing.isAvailableImmediately) {
        return false;
      }
      
      return true;
    });
  }, [listings, currentFilters]);
  
  const applyFilters = (filters) => {
    console.log('Applying filters:', filters);
    setCurrentFilters(filters);
  };

  const clearFilters = () => {
    console.log('Clearing filters');
    const emptyFilters = createSearchFilters();
    setCurrentFilters(emptyFilters);
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
    currentFilters,
    filteredListings,
    applyFilters,
    clearFilters,
    // Aggiungi stati di loading e errore per l'UI
    listings,
    categories,
    listingsLoading,
    categoriesLoading,
    listingsError,
  };
});