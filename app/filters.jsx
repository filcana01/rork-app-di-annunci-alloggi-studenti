import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Switch, SafeAreaView } from 'react-native';
import { X, MapPin, Home, Car, DoorOpen } from 'lucide-react-native';
import { router } from 'expo-router';
import { Colors, Shadows, Typography, Spacing, BorderRadius } from '../constants/colors';
import { useApp } from '../hooks/use-app-context';
import { createSearchFilters, FurnishingStatus, getFurnishingStatusText } from '../types';

export default function FiltersScreen() {
  const { applyFilters } = useApp();
  const [filters, setFilters] = useState(createSearchFilters());

  const categories = [
    { id: 1, name: 'Camera', nameEn: 'Room', icon: DoorOpen },
    { id: 2, name: 'Appartamento', nameEn: 'Apartment', icon: Home },
    { id: 3, name: 'Parcheggio', nameEn: 'Parking', icon: Car },
  ];

  const furnishingOptions = [
    { value: FurnishingStatus.UNFURNISHED, label: getFurnishingStatusText(FurnishingStatus.UNFURNISHED) },
    { value: FurnishingStatus.PARTIALLY_FURNISHED, label: getFurnishingStatusText(FurnishingStatus.PARTIALLY_FURNISHED) },
    { value: FurnishingStatus.FURNISHED, label: getFurnishingStatusText(FurnishingStatus.FURNISHED) },
  ];

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = () => {
    if (applyFilters) {
      applyFilters(filters);
    }
    router.back();
  };

  const handleClearFilters = () => {
    setFilters(createSearchFilters());
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Filtri</Text>
          <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
            <X size={24} color={Colors.text.primary} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Category Filter */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categoria</Text>
          <View style={styles.categoryGrid}>
            {categories.map((category) => {
              const IconComponent = category.icon;
              const isSelected = filters.categoryId === category.id;
              return (
                <TouchableOpacity
                  key={category.id}
                  style={[styles.categoryCard, isSelected && styles.categoryCardSelected]}
                  onPress={() => updateFilter('categoryId', isSelected ? null : category.id)}
                >
                  <IconComponent 
                    size={24} 
                    color={isSelected ? Colors.text.primary : Colors.text.secondary} 
                  />
                  <Text style={[styles.categoryText, isSelected && styles.categoryTextSelected]}>
                    {category.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Price Range */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Prezzo mensile (€)</Text>
          <View style={styles.priceRow}>
            <View style={styles.priceInput}>
              <Text style={styles.inputLabel}>Min</Text>
              <TextInput
                style={styles.input}
                value={filters.minPrice !== null && filters.minPrice !== undefined ? filters.minPrice.toString() : ''}
                onChangeText={(text) => updateFilter('minPrice', text ? parseInt(text) : null)}
                placeholder="0"
                keyboardType="numeric"
              />
            </View>
            <Text style={styles.priceSeparator}>-</Text>
            <View style={styles.priceInput}>
              <Text style={styles.inputLabel}>Max</Text>
              <TextInput
                style={styles.input}
                value={filters.maxPrice !== null && filters.maxPrice !== undefined ? filters.maxPrice.toString() : ''}
                onChangeText={(text) => updateFilter('maxPrice', text ? parseInt(text) : null)}
                placeholder="∞"
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>

        {/* Location */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Località</Text>
          <View style={styles.inputContainer}>
            <MapPin size={20} color={Colors.text.secondary} />
            <TextInput
              style={styles.locationInput}
              value={filters.city}
              onChangeText={(text) => updateFilter('city', text)}
              placeholder="Inserisci città o zona"
            />
          </View>
        </View>

        {/* Surface */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Superficie (m²)</Text>
          <View style={styles.priceRow}>
            <View style={styles.priceInput}>
              <Text style={styles.inputLabel}>Min</Text>
              <TextInput
                style={styles.input}
                value={filters.minSurface !== null && filters.minSurface !== undefined ? filters.minSurface.toString() : ''}
                onChangeText={(text) => updateFilter('minSurface', text ? parseInt(text) : null)}
                placeholder="0"
                keyboardType="numeric"
              />
            </View>
            <Text style={styles.priceSeparator}>-</Text>
            <View style={styles.priceInput}>
              <Text style={styles.inputLabel}>Max</Text>
              <TextInput
                style={styles.input}
                value={filters.maxSurface !== null && filters.maxSurface !== undefined ? filters.maxSurface.toString() : ''}
                onChangeText={(text) => updateFilter('maxSurface', text ? parseInt(text) : null)}
                placeholder="∞"
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>

        {/* Rooms and Bathrooms */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Locali e Bagni</Text>
          <View style={styles.priceRow}>
            <View style={styles.priceInput}>
              <Text style={styles.inputLabel}>Stanze</Text>
              <TextInput
                style={styles.input}
                value={filters.numberOfRooms !== null && filters.numberOfRooms !== undefined ? filters.numberOfRooms.toString() : ''}
                onChangeText={(text) => updateFilter('numberOfRooms', text ? parseInt(text) : null)}
                placeholder="Qualsiasi"
                keyboardType="numeric"
              />
            </View>
            <View style={styles.priceInput}>
              <Text style={styles.inputLabel}>Bagni</Text>
              <TextInput
                style={styles.input}
                value={filters.numberOfBathrooms !== null && filters.numberOfBathrooms !== undefined ? filters.numberOfBathrooms.toString() : ''}
                onChangeText={(text) => updateFilter('numberOfBathrooms', text ? parseInt(text) : null)}
                placeholder="Qualsiasi"
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>

        {/* Furnishing */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Arredamento</Text>
          <View style={styles.categoryGrid}>
            {furnishingOptions.map((option) => {
              const isSelected = filters.furnishingStatus === option.value;
              return (
                <TouchableOpacity
                  key={option.value}
                  style={[styles.categoryCard, isSelected && styles.categoryCardSelected]}
                  onPress={() => updateFilter('furnishingStatus', isSelected ? null : option.value)}
                >
                  <Text style={[styles.categoryText, isSelected && styles.categoryTextSelected]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Features */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Caratteristiche</Text>
          
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Terrazza</Text>
            <Switch
              value={filters.hasTerrace === true}
              onValueChange={(value) => updateFilter('hasTerrace', value ? true : null)}
              trackColor={{ false: Colors.border.light, true: Colors.text.primary }}
              thumbColor={Colors.background.primary}
            />
          </View>
          
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Giardino</Text>
            <Switch
              value={filters.hasGarden === true}
              onValueChange={(value) => updateFilter('hasGarden', value ? true : null)}
              trackColor={{ false: Colors.border.light, true: Colors.text.primary }}
              thumbColor={Colors.background.primary}
            />
          </View>
          
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Piscina</Text>
            <Switch
              value={filters.hasPool === true}
              onValueChange={(value) => updateFilter('hasPool', value ? true : null)}
              trackColor={{ false: Colors.border.light, true: Colors.text.primary }}
              thumbColor={Colors.background.primary}
            />
          </View>
          
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Animali ammessi</Text>
            <Switch
              value={filters.petsAllowed === true}
              onValueChange={(value) => updateFilter('petsAllowed', value ? true : null)}
              trackColor={{ false: Colors.border.light, true: Colors.text.primary }}
              thumbColor={Colors.background.primary}
            />
          </View>
        </View>

        {/* Accessibility */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Accessibilità</Text>
          
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Ascensore</Text>
            <Switch
              value={filters.hasElevator === true}
              onValueChange={(value) => updateFilter('hasElevator', value ? true : null)}
              trackColor={{ false: Colors.border.light, true: Colors.text.primary }}
              thumbColor={Colors.background.primary}
            />
          </View>
          
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Accesso disabili</Text>
            <Switch
              value={filters.hasRampAccess === true}
              onValueChange={(value) => updateFilter('hasRampAccess', value ? true : null)}
              trackColor={{ false: Colors.border.light, true: Colors.text.primary }}
              thumbColor={Colors.background.primary}
            />
          </View>
        </View>

        {/* Other Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Altre Opzioni</Text>
          
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Accetta SwissCaution</Text>
            <Switch
              value={filters.acceptsSwissCaution === true}
              onValueChange={(value) => updateFilter('acceptsSwissCaution', value ? true : null)}
              trackColor={{ false: Colors.border.light, true: Colors.text.primary }}
              thumbColor={Colors.background.primary}
            />
          </View>
          
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Disponibile subito</Text>
            <Switch
              value={filters.isAvailableImmediately === true}
              onValueChange={(value) => updateFilter('isAvailableImmediately', value ? true : null)}
              trackColor={{ false: Colors.border.light, true: Colors.text.primary }}
              thumbColor={Colors.background.primary}
            />
          </View>
        </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.clearButton} onPress={handleClearFilters}>
            <Text style={styles.clearButtonText}>Cancella</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.applyButton} onPress={handleApplyFilters}>
            <Text style={styles.applyButtonText}>Applica Filtri</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  innerContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
    ...Shadows.small,
  },
  headerTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
  },
  closeButton: {
    padding: Spacing.sm,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  section: {
    marginVertical: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },
  categoryGrid: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  categoryCard: {
    flex: 1,
    alignItems: 'center',
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border.light,
    backgroundColor: Colors.background.primary,
  },
  categoryCardSelected: {
    borderColor: Colors.text.primary,
    backgroundColor: Colors.border.light,
  },
  categoryText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text.secondary,
    marginTop: Spacing.sm,
    textAlign: 'center',
  },
  categoryTextSelected: {
    color: Colors.text.primary,
    fontWeight: Typography.fontWeight.semibold,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Spacing.md,
  },
  priceInput: {
    flex: 1,
  },
  priceSeparator: {
    fontSize: Typography.fontSize.lg,
    color: Colors.text.secondary,
    marginBottom: Spacing.sm,
  },
  inputLabel: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text.secondary,
    marginBottom: Spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border.light,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: Typography.fontSize.base,
    color: Colors.text.primary,
    backgroundColor: Colors.background.primary,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border.light,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
    backgroundColor: Colors.background.primary,
  },
  locationInput: {
    flex: 1,
    fontSize: Typography.fontSize.base,
    color: Colors.text.primary,
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
    gap: Spacing.md,
    backgroundColor: Colors.background.primary,
  },
  clearButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border.medium,
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.secondary,
  },
  applyButton: {
    flex: 2,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.text.primary,
    alignItems: 'center',
    ...Shadows.small,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  switchLabel: {
    fontSize: Typography.fontSize.base,
    color: Colors.text.primary,
    flex: 1,
  },
  applyButtonText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.inverse,
  },
});