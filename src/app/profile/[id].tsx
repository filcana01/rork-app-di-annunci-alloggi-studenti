import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useApp } from '@/providers/AppProvider';
import { mockListings } from '@/data/listings';
import { User, MapPin, Star, MessageCircle, Phone, Mail, Calendar, Shield } from 'lucide-react-native';

export default function ProfileScreen() {
  const { id } = useLocalSearchParams();
  const { t } = useApp();
  
  // Mock user data - in real app this would come from API
  const user = {
    id: id as string,
    firstName: 'Marco',
    lastName: 'Rossi',
    email: 'marco.rossi@email.com',
    phone: '+39 333 1234567',
    avatar: 'https://i.pravatar.cc/150?img=3',
    role: 'landlord' as const,
    verified: true,
    rating: 4.8,
    reviewCount: 24,
    joinedDate: '2023-01-15',
    description: 'Proprietario di diversi immobili in zona universitaria. Sempre disponibile per qualsiasi necessità degli inquilini.',
    responseTime: '2 ore',
    responseRate: '95%'
  };

  const userListings = mockListings.filter(listing => listing.userId === id);

  const handleContact = () => {
    // In a real app, this would open a chat or contact form
    console.log('Contact user:', user.id);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>← Indietro</Text>
          </TouchableOpacity>
        </View>

        {/* Profile Info */}
        <View style={styles.profileSection}>
          <View style={styles.profileHeader}>
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
            <View style={styles.profileInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.name}>{user.firstName} {user.lastName}</Text>
                {user.verified && (
                  <Shield size={20} color="#10B981" />
                )}
              </View>
              <View style={styles.ratingRow}>
                <Star size={16} color="#F59E0B" fill="#F59E0B" />
                <Text style={styles.rating}>{user.rating}</Text>
                <Text style={styles.reviewCount}>({user.reviewCount} recensioni)</Text>
              </View>
              <View style={styles.joinedRow}>
                <Calendar size={16} color="#6B7280" />
                <Text style={styles.joinedText}>
                  Su Housing dal {new Date(user.joinedDate).toLocaleDateString('it-IT', { 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </Text>
              </View>
            </View>
          </View>

          {user.description && (
            <Text style={styles.description}>{user.description}</Text>
          )}

          {/* Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{user.responseTime}</Text>
              <Text style={styles.statLabel}>Tempo di risposta</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{user.responseRate}</Text>
              <Text style={styles.statLabel}>Tasso di risposta</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{userListings.length}</Text>
              <Text style={styles.statLabel}>Annunci attivi</Text>
            </View>
          </View>
        </View>

        {/* Contact Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contatti</Text>
          <View style={styles.contactItem}>
            <Mail size={20} color="#6B7280" />
            <Text style={styles.contactText}>{user.email}</Text>
          </View>
          <View style={styles.contactItem}>
            <Phone size={20} color="#6B7280" />
            <Text style={styles.contactText}>{user.phone}</Text>
          </View>
        </View>

        {/* User's Listings */}
        {userListings.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Altri annunci di {user.firstName}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {userListings.map((listing) => (
                <TouchableOpacity
                  key={listing.id}
                  style={styles.listingCard}
                  onPress={() => router.push(`/listing/${listing.id}`)}
                >
                  <Image source={{ uri: listing.images[0] }} style={styles.listingImage} />
                  <View style={styles.listingInfo}>
                    <Text style={styles.listingTitle} numberOfLines={2}>
                      {listing.title}
                    </Text>
                    <View style={styles.listingLocation}>
                      <MapPin size={12} color="#6B7280" />
                      <Text style={styles.listingLocationText}>
                        {listing.location.city}
                      </Text>
                    </View>
                    <Text style={styles.listingPrice}>€{listing.price}/mese</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Reviews Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recensioni</Text>
          <View style={styles.reviewsPlaceholder}>
            <Text style={styles.reviewsPlaceholderText}>
              Le recensioni verranno mostrate qui
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Contact Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.contactButton} onPress={handleContact}>
          <MessageCircle size={20} color="#FFF" />
          <Text style={styles.contactButtonText}>Contatta {user.firstName}</Text>
        </TouchableOpacity>
      </View>
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
  backButton: {
    alignSelf: 'flex-start',
  },
  backButtonText: {
    fontSize: 16,
    color: '#2563EB',
  },
  profileSection: {
    backgroundColor: '#FFF',
    padding: 16,
    marginTop: 8,
  },
  profileHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 8,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 4,
  },
  rating: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  reviewCount: {
    fontSize: 14,
    color: '#6B7280',
  },
  joinedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  joinedText: {
    fontSize: 14,
    color: '#6B7280',
  },
  description: {
    fontSize: 15,
    color: '#4B5563',
    lineHeight: 22,
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#FFF',
    padding: 16,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  contactText: {
    fontSize: 16,
    color: '#374151',
  },
  listingCard: {
    width: 200,
    marginRight: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    overflow: 'hidden',
  },
  listingImage: {
    width: '100%',
    height: 120,
  },
  listingInfo: {
    padding: 12,
  },
  listingTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  listingLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 4,
  },
  listingLocationText: {
    fontSize: 12,
    color: '#6B7280',
  },
  listingPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2563EB',
  },
  reviewsPlaceholder: {
    padding: 32,
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
  },
  reviewsPlaceholderText: {
    fontSize: 14,
    color: '#6B7280',
  },
  footer: {
    padding: 16,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
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