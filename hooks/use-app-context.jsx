import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';
import { translations } from '@/constants/translations';
import { createSearchFilters } from '@/types';
import { mockListings } from '@/mocks/listings';


export const [AppProvider, useApp] = createContextHook(() => {
  const [language, setLanguageState] = useState('it');
  const [user, setUserState] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [currentFilters, setCurrentFilters] = useState(createSearchFilters());
  const [filteredListings, setFilteredListings] = useState(mockListings);

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

  const applyFilters = (filters) => {
    setCurrentFilters(filters);
    
    let filtered = mockListings.filter(listing => {
      // Category filter
      if (filters.categoryId && listing.categoryId !== filters.categoryId) {
        return false;
      }
      
      // Price filters
      if (filters.minPrice && listing.monthlyRent < filters.minPrice) {
        return false;
      }
      if (filters.maxPrice && listing.monthlyRent > filters.maxPrice) {
        return false;
      }
      
      // City filter
      if (filters.city && !listing.city.toLowerCase().includes(filters.city.toLowerCase())) {
        return false;
      }
      
      // Surface filters
      if (filters.minSurface && listing.surfaceArea < filters.minSurface) {
        return false;
      }
      if (filters.maxSurface && listing.surfaceArea > filters.maxSurface) {
        return false;
      }
      
      // Rooms filter
      if (filters.numberOfRooms && listing.numberOfRooms !== filters.numberOfRooms) {
        return false;
      }
      
      // Bathrooms filter
      if (filters.numberOfBathrooms && listing.numberOfBathrooms !== filters.numberOfBathrooms) {
        return false;
      }
      
      // Furnishing filter
      if (filters.furnishingStatus !== null && listing.furnishingStatus !== filters.furnishingStatus) {
        return false;
      }
      
      // Features filters
      if (filters.hasTerrace === true && !listing.hasTerrace) {
        return false;
      }
      if (filters.hasGarden === true && !listing.hasGarden) {
        return false;
      }
      if (filters.hasPool === true && !listing.hasPool) {
        return false;
      }
      if (filters.petsAllowed === true && !listing.petsAllowed) {
        return false;
      }
      
      // Accessibility filters
      if (filters.hasElevator === true && !listing.hasElevator) {
        return false;
      }
      if (filters.hasRampAccess === true && !listing.hasRampAccess) {
        return false;
      }
      
      // Other filters
      if (filters.acceptsSwissCaution === true && !listing.acceptsSwissCaution) {
        return false;
      }
      if (filters.isAvailableImmediately === true && !listing.isAvailableImmediately) {
        return false;
      }
      
      return true;
    });
    
    setFilteredListings(filtered);
  };

  const clearFilters = () => {
    const emptyFilters = createSearchFilters();
    setCurrentFilters(emptyFilters);
    setFilteredListings(mockListings);
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
  };
});