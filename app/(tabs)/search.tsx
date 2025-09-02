import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TextInput, TouchableOpacity, SafeAreaView, Modal } from 'react-native';
import { useApp } from '@/hooks/use-app-context';
import { SearchFilters, FurnishingStatus } from '@/types';
import ListingCard from '@/components/ListingCard';
import { mockListings } from '@/mocks/listings';
import { X, SlidersHorizontal, MapPin } from 'lucide-react-native';

export default function SearchScreen() {
  const { t } = useApp();
  const [filters, setFilters] = useState<SearchFilters>({});
  const [results, setResults] = useState(mockListings);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const applyFilters = () => {
    let filtered = mockListings;

    // Text search
    if (searchQuery) {
      filtered = filtered.filter(l => 
        l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.address.city.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (filters.category) {
      filtered = filtered.filter(l => l.category === filters.category);
    }
    
    // Price filters
    if (filters.minPrice) {
      filtered = filtered.filter(l => l.monthlyRent >= filters.minPrice!);
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(l => l.monthlyRent <= filters.maxPrice!);
    }
    
    // Location filter
    if (filters.city) {
      filtered = filtered.filter(l => 
        l.address.city.toLowerCase().includes(filters.city!.toLowerCase())
      );
    }
    
    // Surface filters
    if (filters.minSurface) {
      filtered = filtered.filter(l => l.surface >= filters.minSurface!);
    }
    if (filters.maxSurface) {
      filtered = filtered.filter(l => l.surface <= filters.maxSurface!);
    }
    
    // Rooms filter
    if (filters.rooms) {
      filtered = filtered.filter(l => l.rooms === filters.rooms);
    }
    
    // Furnishing filter
    if (filters.furnishing) {
      filtered = filtered.filter(l => l.furnishing === filters.furnishing);
    }
    
    // Features filters
    if (filters.petsAllowed) {
      filtered = filtered.filter(l => l.features.petsAllowed);
    }
    if (filters.accessibleForDisabled) {
      filtered = filtered.filter(l => l.features.accessibleForDisabled);
    }

    setResults(filtered);
    setShowAdvancedFilters(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>{t.common.search}</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Cerca annunci..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={applyFilters}
          />
          <TouchableOpacity 
            style={styles.advancedFiltersButton}
            onPress={() => setShowAdvancedFilters(true)}
          >
            <SlidersHorizontal size={20} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* Quick Filters */}
        <View style={styles.quickFiltersContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.categoryButtons}>
              {(['room', 'apartment', 'parking'] as const).map(cat => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.quickFilterButton,
                    filters.category === cat && styles.quickFilterButtonActive
                  ]}
                  onPress={() => {
                    const newFilters = { ...filters };
                    if (filters.category === cat) {
                      delete newFilters.category;
                    } else {
                      newFilters.category = cat;
                    }
                    setFilters(newFilters);
                    applyFilters();
                  }}
                >
                  <Text style={[
                    styles.quickFilterButtonText,
                    filters.category === cat && styles.quickFilterButtonTextActive
                  ]}>
                    {t.listings[cat]}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        <View style={styles.results}>
          <Text style={styles.resultsCount}>
            {results.length} {t.listings.title.toLowerCase()}
          </Text>
          {results.map(listing => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </View>
      </ScrollView>

      {/* Advanced Filters Modal */}
      <Modal
        visible={showAdvancedFilters}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filtri Avanzati</Text>
            <TouchableOpacity onPress={() => setShowAdvancedFilters(false)}>
              <X size={24} color="#000" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            {/* Category */}
            <Text style={styles.sectionTitle}>{t.search.category}</Text>
            <View style={styles.categoryButtons}>
              {(['room', 'apartment', 'parking'] as const).map(cat => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryButton,
                    filters.category === cat && styles.categoryButtonActive
                  ]}
                  onPress={() => setFilters({ ...filters, category: cat })}
                >
                  <Text style={[
                    styles.categoryButtonText,
                    filters.category === cat && styles.categoryButtonTextActive
                  ]}>
                    {t.listings[cat]}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Price Range */}
            <Text style={styles.sectionTitle}>{t.search.priceRange}</Text>
            <View style={styles.priceInputs}>
              <TextInput
                style={styles.priceInput}
                placeholder={t.search.minPrice}
                keyboardType="numeric"
                value={filters.minPrice?.toString() || ''}
                onChangeText={(text) => setFilters({ 
                  ...filters, 
                  minPrice: text ? parseInt(text) : undefined 
                })}
              />
              <TextInput
                style={styles.priceInput}
                placeholder={t.search.maxPrice}
                keyboardType="numeric"
                value={filters.maxPrice?.toString() || ''}
                onChangeText={(text) => setFilters({ 
                  ...filters, 
                  maxPrice: text ? parseInt(text) : undefined 
                })}
              />
            </View>

            {/* Surface */}
            <Text style={styles.sectionTitle}>Superficie (m²)</Text>
            <View style={styles.priceInputs}>
              <TextInput
                style={styles.priceInput}
                placeholder="Min m²"
                keyboardType="numeric"
                value={filters.minSurface?.toString() || ''}
                onChangeText={(text) => setFilters({ 
                  ...filters, 
                  minSurface: text ? parseInt(text) : undefined 
                })}
              />
              <TextInput
                style={styles.priceInput}
                placeholder="Max m²"
                keyboardType="numeric"
                value={filters.maxSurface?.toString() || ''}
                onChangeText={(text) => setFilters({ 
                  ...filters, 
                  maxSurface: text ? parseInt(text) : undefined 
                })}
              />
            </View>

            {/* Rooms */}
            <Text style={styles.sectionTitle}>Numero Locali</Text>
            <View style={styles.roomsContainer}>
              {[1, 2, 3, 4, 5].map(num => (
                <TouchableOpacity
                  key={num}
                  style={[
                    styles.roomButton,
                    filters.rooms === num && styles.roomButtonActive
                  ]}
                  onPress={() => setFilters({ 
                    ...filters, 
                    rooms: filters.rooms === num ? undefined : num 
                  })}
                >
                  <Text style={[
                    styles.roomButtonText,
                    filters.rooms === num && styles.roomButtonTextActive
                  ]}>
                    {num}+
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Furnishing */}
            <Text style={styles.sectionTitle}>Arredamento</Text>
            <View style={styles.furnishingContainer}>
              {(['furnished', 'partially_furnished', 'unfurnished'] as FurnishingStatus[]).map(furn => (
                <TouchableOpacity
                  key={furn}
                  style={[
                    styles.furnishingButton,
                    filters.furnishing === furn && styles.furnishingButtonActive
                  ]}
                  onPress={() => setFilters({ 
                    ...filters, 
                    furnishing: filters.furnishing === furn ? undefined : furn 
                  })}
                >
                  <Text style={[
                    styles.furnishingButtonText,
                    filters.furnishing === furn && styles.furnishingButtonTextActive
                  ]}>
                    {furn === 'furnished' ? 'Arredato' : 
                     furn === 'partially_furnished' ? 'Parz. Arredato' : 'Non Arredato'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Features */}
            <Text style={styles.sectionTitle}>Caratteristiche</Text>
            <TouchableOpacity
              style={[
                styles.featureToggle,
                filters.petsAllowed && styles.featureToggleActive
              ]}
              onPress={() => setFilters({ 
                ...filters, 
                petsAllowed: !filters.petsAllowed 
              })}
            >
              <Text style={[
                styles.featureToggleText,
                filters.petsAllowed && styles.featureToggleTextActive
              ]}>
                Animali ammessi
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.featureToggle,
                filters.accessibleForDisabled && styles.featureToggleActive
              ]}
              onPress={() => setFilters({ 
                ...filters, 
                accessibleForDisabled: !filters.accessibleForDisabled 
              })}
            >
              <Text style={[
                styles.featureToggleText,
                filters.accessibleForDisabled && styles.featureToggleTextActive
              ]}>
                Accessibile ai disabili
              </Text>
            </TouchableOpacity>

            {/* City */}
            <Text style={styles.sectionTitle}>Città</Text>
            <TextInput
              style={styles.cityInput}
              placeholder="Milano, Roma, Torino..."
              value={filters.city || ''}
              onChangeText={(text) => setFilters({ ...filters, city: text })}
            />
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity 
              style={styles.resetButton}
              onPress={() => {
                setFilters({});
                setSearchQuery('');
                setResults(mockListings);
              }}
            >
              <Text style={styles.resetButtonText}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.applyButton}
              onPress={applyFilters}
            >
              <Text style={styles.applyButtonText}>Applica Filtri</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    padding: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    gap: 12,
  },
  searchInput: {
    flex: 1,
    height: 44,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  advancedFiltersButton: {
    width: 44,
    height: 44,
    backgroundColor: '#2563EB',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickFiltersContainer: {
    backgroundColor: '#FFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  categoryButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  quickFilterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFF',
  },
  quickFilterButtonActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  quickFilterButtonText: {
    fontSize: 14,
    color: '#6B7280',
  },
  quickFilterButtonTextActive: {
    color: '#FFF',
    fontWeight: '600',
  },
  results: {
    marginTop: 8,
  },
  resultsCount: {
    fontSize: 14,
    color: '#6B7280',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
    marginBottom: 12,
  },
  categoryButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    alignItems: 'center',
  },
  categoryButtonActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  categoryButtonText: {
    fontSize: 14,
    color: '#6B7280',
  },
  categoryButtonTextActive: {
    color: '#FFF',
    fontWeight: '600',
  },
  priceInputs: {
    flexDirection: 'row',
    gap: 12,
  },
  priceInput: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  roomsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  roomButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    minWidth: 50,
    alignItems: 'center',
  },
  roomButtonActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  roomButtonText: {
    fontSize: 14,
    color: '#6B7280',
  },
  roomButtonTextActive: {
    color: '#FFF',
    fontWeight: '600',
  },
  furnishingContainer: {
    gap: 8,
  },
  furnishingButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    alignItems: 'center',
  },
  furnishingButtonActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  furnishingButtonText: {
    fontSize: 14,
    color: '#6B7280',
  },
  furnishingButtonTextActive: {
    color: '#FFF',
    fontWeight: '600',
  },
  featureToggle: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    marginBottom: 8,
  },
  featureToggleActive: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  featureToggleText: {
    fontSize: 14,
    color: '#6B7280',
  },
  featureToggleTextActive: {
    color: '#FFF',
    fontWeight: '600',
  },
  cityInput: {
    height: 44,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  resetButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    alignItems: 'center',
  },
  resetButtonText: {
    fontSize: 16,
    color: '#6B7280',
  },
  applyButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#2563EB',
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: '600',
  },
});