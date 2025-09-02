import React, { useState } from 'react';
import { View, FlatList, StyleSheet, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { Map, List } from 'lucide-react-native';
import ListingCard from '@/components/ListingCard';
import SearchBar from '@/components/SearchBar';
import { mockListings } from '@/mocks/listings';
import { useApp } from '@/hooks/use-app-context';
import { router } from 'expo-router';
import { Colors, Shadows, Typography, Spacing, BorderRadius } from '@/constants/colors';

export default function HomeScreen() {
  const { t } = useApp();
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredListings = mockListings.filter(listing =>
    listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    listing.address.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t.listings.title}</Text>
        <TouchableOpacity
          style={styles.viewToggle}
          onPress={() => setViewMode(viewMode === 'list' ? 'map' : 'list')}
        >
          {viewMode === 'list' ? (
            <Map size={20} color={Colors.primary[500]} />
          ) : (
            <List size={20} color={Colors.primary[500]} />
          )}
        </TouchableOpacity>
      </View>

      <SearchBar 
        onSearch={setSearchQuery}
        onFilterPress={() => router.push('/filters')}
      />

      {viewMode === 'list' ? (
        <FlatList
          data={filteredListings}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ListingCard listing={item} />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.mapContainer}>
          <Text style={styles.mapPlaceholder}>Mappa interattiva qui</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.secondary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
    ...Shadows.small,
  },
  headerTitle: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
  },
  viewToggle: {
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.background.tertiary,
  },
  listContent: {
    paddingVertical: Spacing.sm,
  },
  mapContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background.tertiary,
    margin: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  mapPlaceholder: {
    fontSize: Typography.fontSize.base,
    color: Colors.text.secondary,
    fontWeight: Typography.fontWeight.medium,
  },
});