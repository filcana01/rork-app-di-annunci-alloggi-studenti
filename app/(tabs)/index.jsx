import React, { useState, useMemo } from 'react';
import { View, FlatList, StyleSheet, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Map, List, AlertCircle } from 'lucide-react-native';
import ListingCard from '@/components/ListingCard';
import SearchBar from '@/components/SearchBar';
import { useApp } from '@/hooks/use-app-context';
import { router } from 'expo-router';
import { Colors, Shadows, Typography, Spacing, BorderRadius } from '@/constants/colors';

export default function HomeScreen() {
  const { filteredListings, isLoadingListings, listingsError } = useApp();
  const [viewMode, setViewMode] = useState('list');
  const [searchQuery, setSearchQuery] = useState('');

  const displayListings = useMemo(() => {
    if (!searchQuery.trim()) {
      return filteredListings;
    }
    return filteredListings.filter(listing =>
      listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.city.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [filteredListings, searchQuery]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.logoContainer}>
            <View style={styles.logoPlaceholder}>
              <Text style={styles.logoText}>USI</Text>
            </View>
          </View>
          <Text style={styles.headerTitle}>USI Housing</Text>
        </View>
        <TouchableOpacity
          style={styles.viewToggle}
          onPress={() => setViewMode(viewMode === 'list' ? 'map' : 'list')}
        >
          {viewMode === 'list' ? (
            <Map size={20} color={Colors.text.primary} />
          ) : (
            <List size={20} color={Colors.text.primary} />
          )}
        </TouchableOpacity>
      </View>

      <SearchBar 
        onSearch={setSearchQuery}
        onFilterPress={() => router.push('/filters')}
      />

      {viewMode === 'list' ? (
        isLoadingListings ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.text.primary} />
            <Text style={styles.loadingText}>Caricamento annunci...</Text>
          </View>
        ) : listingsError ? (
          <View style={styles.errorContainer}>
            <AlertCircle size={48} color={Colors.text.secondary} />
            <Text style={styles.errorTitle}>Errore di connessione</Text>
            <Text style={styles.errorText}>Impossibile caricare gli annunci dal server.</Text>
            <Text style={styles.errorSubtext}>Visualizzazione dati di esempio.</Text>
          </View>
        ) : displayListings.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nessun annuncio trovato</Text>
            <Text style={styles.emptySubtext}>Prova a modificare i filtri di ricerca</Text>
          </View>
        ) : (
          <FlatList
            data={displayListings}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <ListingCard listing={item} />}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )
      ) : (
        <View style={styles.mapContainer}>
          <Text style={styles.mapPlaceholder}>Mappa interattiva qui</Text>
        </View>
      )}
    </View>
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
    borderBottomWidth: 2,
    borderBottomColor: Colors.border.black,
    ...Shadows.medium,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  logoContainer: {
    width: 40,
    height: 40,
  },
  logoPlaceholder: {
    width: 40,
    height: 40,
    backgroundColor: Colors.text.primary,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    color: Colors.text.inverse,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.bold,
  },
  headerTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
    letterSpacing: 0.5,
  },
  viewToggle: {
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.background.tertiary,
    borderWidth: 1,
    borderColor: Colors.border.medium,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  loadingText: {
    marginTop: Spacing.md,
    fontSize: Typography.fontSize.base,
    color: Colors.text.secondary,
    fontWeight: Typography.fontWeight.medium,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xl,
  },
  errorTitle: {
    marginTop: Spacing.md,
    fontSize: Typography.fontSize.lg,
    color: Colors.text.primary,
    fontWeight: Typography.fontWeight.semibold,
    textAlign: 'center',
  },
  errorText: {
    marginTop: Spacing.sm,
    fontSize: Typography.fontSize.base,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: Typography.fontSize.base * Typography.lineHeight.relaxed,
  },
  errorSubtext: {
    marginTop: Spacing.xs,
    fontSize: Typography.fontSize.sm,
    color: Colors.text.tertiary,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xl,
  },
  emptyText: {
    fontSize: Typography.fontSize.lg,
    color: Colors.text.primary,
    fontWeight: Typography.fontWeight.semibold,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  emptySubtext: {
    fontSize: Typography.fontSize.base,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
});