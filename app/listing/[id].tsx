import React from 'react';
import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity, Dimensions, SafeAreaView } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { mockListings } from '@/mocks/listings';
import { useApp } from '@/hooks/use-app-context';
import { X, MapPin, Home, Bath, Maximize, Calendar, Check, MessageCircle, Heart, Building, Shield, Euro } from 'lucide-react-native';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/colors';

const { width } = Dimensions.get('window');

export default function ListingDetailScreen() {
  const { id } = useLocalSearchParams();
  const { t, favorites, toggleFavorite } = useApp();
  
  const listing = mockListings.find(l => l.id.toString() === id);
  
  if (!listing) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Annuncio non trovato</Text>
      </SafeAreaView>
    );
  }

  const isFavorite = favorites.includes(listing.id);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
            <X size={24} color={Colors.text.primary} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.favoriteButton}
            onPress={() => toggleFavorite(listing.id)}
          >
            <Heart 
              size={24} 
              color={isFavorite ? Colors.error : Colors.text.primary}
              fill={isFavorite ? Colors.error : 'transparent'}
            />
          </TouchableOpacity>
        </View>

        <ScrollView horizontal pagingEnabled style={styles.imageScroll}>
          {listing.images.map((image, index) => (
            <Image key={index} source={{ uri: image.imageUrl || image }} style={styles.image} />
          ))}
        </ScrollView>

        <View style={styles.content}>
          <Text style={styles.title}>{listing.title}</Text>
          
          <View style={styles.locationRow}>
            <MapPin size={16} color={Colors.text.secondary} />
            <Text style={styles.location}>
              {listing.address}, {listing.city}
            </Text>
          </View>

          <View style={styles.priceContainer}>
            <Text style={styles.price}>€{listing.monthlyRent}</Text>
            <Text style={styles.priceLabel}>/{t.listings.months}</Text>
            {!listing.expensesIncluded && listing.monthlyExpenses && (
              <Text style={styles.expenses}>
                +€{listing.monthlyExpenses} {t.listings.expenses.toLowerCase()}
              </Text>
            )}
          </View>

          <View style={styles.features}>
            <View style={styles.feature}>
              <Maximize size={20} color={Colors.text.secondary} />
              <Text style={styles.featureText}>{listing.surfaceArea} m²</Text>
            </View>
            {listing.numberOfRooms && (
              <View style={styles.feature}>
                <Home size={20} color={Colors.text.secondary} />
                <Text style={styles.featureText}>{listing.numberOfRooms} {t.listings.rooms.toLowerCase()}</Text>
              </View>
            )}
            <View style={styles.feature}>
              <Bath size={20} color={Colors.text.secondary} />
              <Text style={styles.featureText}>{listing.numberOfBathrooms} {t.listings.bathrooms.toLowerCase()}</Text>
            </View>
            {listing.floor && (
              <View style={styles.feature}>
                <Building size={20} color={Colors.text.secondary} />
                <Text style={styles.featureText}>Piano {listing.floor}</Text>
              </View>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Descrizione</Text>
            <Text style={styles.description}>{listing.description}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.listings.features}</Text>
            <View style={styles.featuresList}>
              {listing.hasTerrace && (
                <View style={styles.featureItem}>
                  <Check size={16} color={Colors.success} />
                  <Text style={styles.featureItemText}>Terrazza</Text>
                </View>
              )}
              {listing.hasGarden && (
                <View style={styles.featureItem}>
                  <Check size={16} color={Colors.success} />
                  <Text style={styles.featureItemText}>Giardino</Text>
                </View>
              )}
              {listing.hasPool && (
                <View style={styles.featureItem}>
                  <Check size={16} color={Colors.success} />
                  <Text style={styles.featureItemText}>Piscina</Text>
                </View>
              )}
              {listing.petsAllowed && (
                <View style={styles.featureItem}>
                  <Check size={16} color={Colors.success} />
                  <Text style={styles.featureItemText}>Animali ammessi</Text>
                </View>
              )}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Dettagli</Text>
            <View style={styles.detail}>
              <Calendar size={16} color={Colors.text.secondary} />
              <Text style={styles.detailText}>
                {listing.isAvailableImmediately ? 'Disponibile da subito' : `Disponibile dal ${new Date(listing.availabilityDate).toLocaleDateString()}`}
              </Text>
            </View>
            <View style={styles.detail}>
              <Text style={styles.detailLabel}>Durata minima contratto:</Text>
              <Text style={styles.detailText}>{listing.minContractDuration} mesi</Text>
            </View>
            <View style={styles.detail}>
              <Text style={styles.detailLabel}>Arredamento:</Text>
              <Text style={styles.detailText}>
                {listing.furnishingStatus === 2 ? 'Arredato' : 
                 listing.furnishingStatus === 1 ? 'Parzialmente arredato' : 'Non arredato'}
              </Text>
            </View>
            {listing.annualAdjustment && (
              <View style={styles.detail}>
                <Check size={16} color={Colors.success} />
                <Text style={styles.detailText}>Conguaglio annuale</Text>
              </View>
            )}
            {listing.rules && (
              <View style={styles.detail}>
                <Text style={styles.detailLabel}>Regole:</Text>
                <Text style={styles.detailText}>{listing.rules}</Text>
              </View>
            )}
          </View>

          {/* Accessibility Section */}
          {(listing.hasElevator || listing.hasRampAccess) && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Accessibilità</Text>
              <View style={styles.featuresList}>
                {listing.hasElevator && (
                  <View style={styles.featureItem}>
                    <Check size={16} color={Colors.success} />
                    <Text style={styles.featureItemText}>Ascensore</Text>
                  </View>
                )}
                {listing.hasRampAccess && (
                  <View style={styles.featureItem}>
                    <Check size={16} color={Colors.success} />
                    <Text style={styles.featureItemText}>Accesso disabili</Text>
                  </View>
                )}
              </View>
            </View>
          )}

          {/* Security Deposit Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Deposito Cauzionale</Text>
            <View style={styles.detail}>
              <Euro size={16} color={Colors.text.secondary} />
              <Text style={styles.detailText}>€{listing.securityDeposit}</Text>
            </View>
            {listing.acceptsSwissCaution && (
              <View style={styles.detail}>
                <Shield size={16} color={Colors.success} />
                <Text style={styles.detailText}>Accetta SwissCaution</Text>
              </View>
            )}

          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.contactButton}
          onPress={() => router.push(`/profile/${listing.user?.id || listing.userId}`)}
        >
          <MessageCircle size={20} color={Colors.text.inverse} />
          <Text style={styles.contactButtonText}>{t.listings.contactOwner}</Text>
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
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    zIndex: 10,
  },
  closeButton: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: BorderRadius.full,
    padding: Spacing.sm,
  },
  favoriteButton: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: BorderRadius.full,
    padding: Spacing.sm,
  },
  imageScroll: {
    height: 300,
  },
  image: {
    width,
    height: 300,
  },
  content: {
    padding: Spacing.lg,
  },
  title: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
    lineHeight: Typography.fontSize['2xl'] * Typography.lineHeight.tight,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.lg,
  },
  location: {
    fontSize: Typography.fontSize.base,
    color: Colors.text.secondary,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: Spacing['2xl'],
  },
  price: {
    fontSize: Typography.fontSize['3xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary[600],
  },
  priceLabel: {
    fontSize: Typography.fontSize.base,
    color: Colors.text.secondary,
    marginLeft: 4,
  },
  expenses: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.tertiary,
    marginLeft: Spacing.md,
  },
  features: {
    flexDirection: 'row',
    gap: Spacing['2xl'],
    paddingVertical: Spacing.lg,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.border.light,
    marginBottom: Spacing['2xl'],
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  featureText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.primary,
    fontWeight: Typography.fontWeight.medium,
  },
  section: {
    marginBottom: Spacing['2xl'],
  },
  sectionTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },
  description: {
    fontSize: Typography.fontSize.base,
    color: Colors.text.secondary,
    lineHeight: Typography.fontSize.base * Typography.lineHeight.relaxed,
  },
  featuresList: {
    gap: Spacing.md,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  featureItemText: {
    fontSize: Typography.fontSize.base,
    color: Colors.text.primary,
  },
  detail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  detailLabel: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    fontWeight: Typography.fontWeight.medium,
  },
  detailText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.primary,
  },
  footer: {
    padding: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
    backgroundColor: Colors.background.primary,
  },
  contactButton: {
    backgroundColor: Colors.primary[500],
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.lg,
  },
  contactButtonText: {
    color: Colors.text.inverse,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
  },
});