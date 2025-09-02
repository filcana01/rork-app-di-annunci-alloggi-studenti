import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Heart, MapPin, Home, Car, DoorOpen } from 'lucide-react-native';
import { Listing } from '@/types';
import { useApp } from '@/hooks/use-app-context';
import { router } from 'expo-router';
import { Colors, Shadows, Typography, Spacing, BorderRadius } from '@/constants/colors';

interface ListingCardProps {
  listing: Listing;
}

export default function ListingCard({ listing }: ListingCardProps) {
  const { t, favorites, toggleFavorite } = useApp();
  const isFavorite = favorites.includes(listing.id);

  const getCategoryIcon = () => {
    switch (listing.category) {
      case 'room':
        return <DoorOpen size={16} color={Colors.text.secondary} />;
      case 'apartment':
        return <Home size={16} color={Colors.text.secondary} />;
      case 'parking':
        return <Car size={16} color={Colors.text.secondary} />;
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
            color={isFavorite ? Colors.error : Colors.text.secondary}
            fill={isFavorite ? Colors.error : 'transparent'}
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
          <MapPin size={14} color={Colors.text.secondary} />
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
    backgroundColor: Colors.background.primary,
    borderRadius: BorderRadius.lg,
    marginHorizontal: Spacing.lg,
    marginVertical: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border.light,
    ...Shadows.medium,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: BorderRadius.lg,
    borderTopRightRadius: BorderRadius.lg,
  },
  favoriteButton: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: BorderRadius.full,
    padding: Spacing.sm,
    ...Shadows.small,
  },
  categoryBadge: {
    position: 'absolute',
    top: Spacing.md,
    left: Spacing.md,
    backgroundColor: Colors.background.primary,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    ...Shadows.small,
  },
  categoryText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.secondary,
  },
  content: {
    padding: Spacing.lg,
  },
  title: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
    lineHeight: Typography.fontSize.lg * Typography.lineHeight.tight,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  location: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    flex: 1,
  },
  details: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  surface: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    fontWeight: Typography.fontWeight.medium,
  },
  rooms: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    fontWeight: Typography.fontWeight.medium,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary[600],
  },
  priceLabel: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    marginLeft: 2,
  },
  expenses: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.tertiary,
    marginLeft: Spacing.sm,
  },
});