import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, SafeAreaView } from 'react-native';
import { X, MapPin, Home, Car, DoorOpen } from 'lucide-react-native';
import { router } from 'expo-router';
import { Colors, Shadows, Typography, Spacing, BorderRadius } from '@/constants/colors';
import { useApp } from '@/hooks/use-app-context';

export default function FiltersScreen() {
  const { t } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [city, setCity] = useState('');
  const [minSurface, setMinSurface] = useState('');
  const [rooms, setRooms] = useState('');

  const categories = [
    { id: 'room', name: t.listings.room, icon: DoorOpen },
    { id: 'apartment', name: t.listings.apartment, icon: Home },
    { id: 'parking', name: t.listings.parking, icon: Car },
  ];

  const handleApplyFilters = () => {
    // TODO: Apply filters logic
    router.back();
  };

  const handleClearFilters = () => {
    setSelectedCategory('');
    setMinPrice('');
    setMaxPrice('');
    setCity('');
    setMinSurface('');
    setRooms('');
  };

  return (
    <SafeAreaView style={styles.container}>
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
              const isSelected = selectedCategory === category.id;
              return (
                <TouchableOpacity
                  key={category.id}
                  style={[styles.categoryCard, isSelected && styles.categoryCardSelected]}
                  onPress={() => setSelectedCategory(isSelected ? '' : category.id)}
                >
                  <IconComponent 
                    size={24} 
                    color={isSelected ? Colors.primary[500] : Colors.text.secondary} 
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
                value={minPrice}
                onChangeText={setMinPrice}
                placeholder="0"
                keyboardType="numeric"
              />
            </View>
            <Text style={styles.priceSeparator}>-</Text>
            <View style={styles.priceInput}>
              <Text style={styles.inputLabel}>Max</Text>
              <TextInput
                style={styles.input}
                value={maxPrice}
                onChangeText={setMaxPrice}
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
              value={city}
              onChangeText={setCity}
              placeholder="Inserisci città o zona"
            />
          </View>
        </View>

        {/* Surface */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Superficie minima (m²)</Text>
          <TextInput
            style={styles.input}
            value={minSurface}
            onChangeText={setMinSurface}
            placeholder="Es. 50"
            keyboardType="numeric"
          />
        </View>

        {/* Rooms */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Numero di stanze</Text>
          <TextInput
            style={styles.input}
            value={rooms}
            onChangeText={setRooms}
            placeholder="Es. 2"
            keyboardType="numeric"
          />
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
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
    borderColor: Colors.primary[500],
    backgroundColor: Colors.primary[50],
  },
  categoryText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text.secondary,
    marginTop: Spacing.sm,
    textAlign: 'center',
  },
  categoryTextSelected: {
    color: Colors.primary[500],
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
    backgroundColor: Colors.primary[500],
    alignItems: 'center',
    ...Shadows.small,
  },
  applyButtonText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.inverse,
  },
});