import React from 'react';
import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity, Dimensions, SafeAreaView } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { mockListings } from '@/mocks/listings';
import { useApp } from '@/hooks/use-app-context';
import { X, MapPin, Home, Bath, Maximize, Calendar, Check, MessageCircle, Heart, Building, Shield, Euro } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function ListingDetailScreen() {
  const { id } = useLocalSearchParams();
  const { t, favorites, toggleFavorite } = useApp();
  
  const listing = mockListings.find(l => l.id === id);
  
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
            <X size={24} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.favoriteButton}
            onPress={() => toggleFavorite(listing.id)}
          >
            <Heart 
              size={24} 
              color={isFavorite ? '#EF4444' : '#000'}
              fill={isFavorite ? '#EF4444' : 'transparent'}
            />
          </TouchableOpacity>
        </View>

        <ScrollView horizontal pagingEnabled style={styles.imageScroll}>
          {listing.images.map((image, index) => (
            <Image key={index} source={{ uri: image }} style={styles.image} />
          ))}
        </ScrollView>

        <View style={styles.content}>
          <Text style={styles.title}>{listing.title}</Text>
          
          <View style={styles.locationRow}>
            <MapPin size={16} color="#666" />
            <Text style={styles.location}>
              {listing.address.street}, {listing.address.city}
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
              <Maximize size={20} color="#666" />
              <Text style={styles.featureText}>{listing.surface} m²</Text>
            </View>
            {listing.rooms && (
              <View style={styles.feature}>
                <Home size={20} color="#666" />
                <Text style={styles.featureText}>{listing.rooms} {t.listings.rooms.toLowerCase()}</Text>
              </View>
            )}
            <View style={styles.feature}>
              <Bath size={20} color="#666" />
              <Text style={styles.featureText}>{listing.bathrooms} {t.listings.bathrooms.toLowerCase()}</Text>
            </View>
            {listing.floor && (
              <View style={styles.feature}>
                <Building size={20} color="#666" />
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
              {listing.features.terrace && (
                <View style={styles.featureItem}>
                  <Check size={16} color="#10B981" />
                  <Text style={styles.featureItemText}>{t.listings.terrace}</Text>
                </View>
              )}
              {listing.features.garden && (
                <View style={styles.featureItem}>
                  <Check size={16} color="#10B981" />
                  <Text style={styles.featureItemText}>{t.listings.garden}</Text>
                </View>
              )}
              {listing.features.petsAllowed && (
                <View style={styles.featureItem}>
                  <Check size={16} color="#10B981" />
                  <Text style={styles.featureItemText}>{t.listings.petsAllowed}</Text>
                </View>
              )}
              {listing.features.accessibleForDisabled && (
                <View style={styles.featureItem}>
                  <Check size={16} color="#10B981" />
                  <Text style={styles.featureItemText}>{t.listings.accessible}</Text>
                </View>
              )}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Dettagli</Text>
            <View style={styles.detail}>
              <Calendar size={16} color="#666" />
              <Text style={styles.detailText}>
                {listing.availabilityType === 'immediately' ? 'Disponibile da subito' : `Disponibile dal ${new Date(listing.availableFrom).toLocaleDateString()}`}
              </Text>
            </View>
            <View style={styles.detail}>
              <Text style={styles.detailLabel}>Durata minima contratto:</Text>
              <Text style={styles.detailText}>{listing.minimumContractMonths} mesi</Text>
            </View>
            <View style={styles.detail}>
              <Text style={styles.detailLabel}>Arredamento:</Text>
              <Text style={styles.detailText}>
                {listing.furnishing === 'furnished' ? 'Arredato' : 
                 listing.furnishing === 'partially_furnished' ? 'Parzialmente arredato' : 'Non arredato'}
              </Text>
            </View>
            {listing.yearlyAdjustment && (
              <View style={styles.detail}>
                <Check size={16} color="#10B981" />
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
          {listing.accessibility.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Accessibilità</Text>
              <View style={styles.featuresList}>
                {listing.accessibility.map((feature, index) => (
                  <View key={index} style={styles.featureItem}>
                    <Check size={16} color="#10B981" />
                    <Text style={styles.featureItemText}>
                      {feature === 'elevator' ? 'Ascensore' :
                       feature === 'disabled_access' ? 'Accesso disabili' :
                       feature === 'ground_floor' ? 'Piano terra' :
                       feature === 'ramp' ? 'Rampa di accesso' : feature}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Security Deposit Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Deposito Cauzionale</Text>
            <View style={styles.detail}>
              <Euro size={16} color="#666" />
              <Text style={styles.detailText}>€{listing.securityDeposit}</Text>
            </View>
            {listing.acceptsSwissCaution && (
              <View style={styles.detail}>
                <Shield size={16} color="#10B981" />
                <Text style={styles.detailText}>Accetta SwissCaution</Text>
              </View>
            )}
            {listing.acceptsOtherGuarantees && listing.guaranteeServices && (
              <View style={styles.detail}>
                <Shield size={16} color="#10B981" />
                <Text style={styles.detailText}>Servizi accettati: {listing.guaranteeServices}</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.contactButton}
          onPress={() => router.push(`/profile/${listing.userId}`)}
        >
          <MessageCircle size={20} color="#FFF" />
          <Text style={styles.contactButtonText}>{t.listings.contactOwner}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    zIndex: 10,
  },
  closeButton: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 20,
    padding: 8,
  },
  favoriteButton: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 20,
    padding: 8,
  },
  imageScroll: {
    height: 300,
  },
  image: {
    width,
    height: 300,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 16,
  },
  location: {
    fontSize: 16,
    color: '#666',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 24,
  },
  price: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2563EB',
  },
  priceLabel: {
    fontSize: 16,
    color: '#666',
    marginLeft: 4,
  },
  expenses: {
    fontSize: 14,
    color: '#999',
    marginLeft: 12,
  },
  features: {
    flexDirection: 'row',
    gap: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 24,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featureText: {
    fontSize: 14,
    color: '#374151',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: '#4B5563',
    lineHeight: 22,
  },
  featuresList: {
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featureItemText: {
    fontSize: 15,
    color: '#374151',
  },
  detail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  detailText: {
    fontSize: 14,
    color: '#374151',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#FFF',
  },
  contactButton: {
    backgroundColor: '#2563EB',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 8,
  },
  contactButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});