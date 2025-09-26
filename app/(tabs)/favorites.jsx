import React from 'react';
import { View, FlatList, StyleSheet, Text, SafeAreaView } from 'react-native';
import { useApp } from '@/hooks/use-app-context';
import ListingCard from '@/components/ListingCard';
import { mockListings } from '@/mocks/listings';
import { Heart } from 'lucide-react-native';

export default function FavoritesScreen() {
  const { t, favorites } = useApp();
  
  const favoriteListings = mockListings.filter(listing => 
    favorites.includes(listing.id)
  );

  if (favoriteListings.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{t.dashboard.favorites}</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Heart size={64} color="#D1D5DB" />
          <Text style={styles.emptyText}>Nessun preferito</Text>
          <Text style={styles.emptySubtext}>
            Aggiungi alloggi ai preferiti per trovarli facilmente
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t.dashboard.favorites}</Text>
      </View>
      <FlatList
        data={favoriteListings}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ListingCard listing={item} />}
        contentContainerStyle={styles.listContent}
      />
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
  listContent: {
    paddingVertical: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 8,
  },
});