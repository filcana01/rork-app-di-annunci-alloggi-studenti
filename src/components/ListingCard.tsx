import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Heart, MapPin, Home, Car, DoorOpen } from 'lucide-react-native';
import { Listing } from '@/types';
import { useApp } from '@/providers/AppProvider';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

interface ListingCardProps {
  listing: Listing;
}

export default function ListingCard({ listing }: ListingCardProps) {
  const { t, favorites, toggleFavorite } = useApp();
  const isFavorite = favorites.includes(listing.id);

  const getCategoryIcon = () => {
    switch (listing.category) {
      case 'room':
        return <DoorOpen size={16} color="#666" />;
      case 'apartment':
        return <Home size={16} color="#666" />;
      case 'parking':
        return <Car size={16} color="#666" />;
    }
  };

  const getCategoryName = () => {
    switch (listing.category) {
      case 'room':
        return t.listings.room;
      case 'apartment':
        return t.listings.apartment;
      case 'parking':
        return t.listings.parking;
    }
  };

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={() => router.push(`/listing/${listing.id}`)}
      activeOpacity={0.9}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: listing.images[0] }} style={styles.image} />
        <TouchableOpacity 
          style={styles.favoriteButton}
          onPress={(e) => {
            e.stopPropagation();
            toggleFavorite(listing.id);
          }}
        >
          <Heart 
            size={20} 
            color={isFavorite ? '#EF4444' : '#FFF'}
            fill={isFavorite ? '#EF4444' : 'transparent'}
          />
        </TouchableOpacity>
        <View style={styles.categoryBadge}>
          {getCategoryIcon()}
          <Text style={styles.categoryText}>{getCategoryName()}</Text>
        </View>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>{listing.title}</Text>
        
        <View style={styles.locationRow}>
          <MapPin size={14} color="#666" />
          <Text style={styles.location} numberOfLines={1}>
            {listing.address.city}, {listing.address.street}
          </Text>
        </View>
        
        <View style={styles.details}>
          <Text style={styles.surface}>{listing.surface} m²</Text>
          {listing.rooms && (
            <Text style={styles.rooms}>{listing.rooms} {t.listings.rooms.toLowerCase()}</Text>
          )}
        </View>
        
        <View style={styles.priceRow}>
          <Text style={styles.price}>€{listing.monthlyRent}</Text>
          <Text style={styles.priceLabel}>/{t.listings.months}</Text>
          {!listing.expensesIncluded && listing.monthlyExpenses && (
            <Text style={styles.expenses}>+€{listing.monthlyExpenses} {t.listings.expenses.toLowerCase()}</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 8,
  },
  categoryBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#FFF',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  location: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  details: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  surface: {
    fontSize: 14,
    color: '#666',
  },
  rooms: {
    fontSize: 14,
    color: '#666',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2563EB',
  },
  priceLabel: {
    fontSize: 14,
    color: '#666',
    marginLeft: 2,
  },
  expenses: {
    fontSize: 12,
    color: '#999',
    marginLeft: 8,
  },
});