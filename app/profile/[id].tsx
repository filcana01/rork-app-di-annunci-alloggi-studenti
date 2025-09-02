import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useApp } from '@/hooks/use-app-context';
import { mockListings } from '@/mocks/listings';
import { ArrowLeft, MapPin, Star, MessageCircle, Phone, Mail, Shield, Calendar } from 'lucide-react-native';
import ListingCard from '@/components/ListingCard';

// Mock user data - in a real app this would come from an API
const mockUsers = {
  'user1': {
    id: 'user1',
    firstName: 'Marco',
    lastName: 'Rossi',
    email: 'marco.rossi@email.com',
    phone: '+39 333 123 4567',
    role: 'landlord' as const,
    verified: true,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    rating: 4.8,
    reviewsCount: 24,
    joinedDate: '2022-03-15',
    description: 'Proprietario di diversi immobili nel centro di Milano. Sempre disponibile per i miei inquilini e attento alle loro esigenze.',
    responseTime: '2 ore',
    languages: ['Italiano', 'Inglese'],
    location: 'Milano, Italia'
  },
  'user2': {
    id: 'user2',
    firstName: 'Sofia',
    lastName: 'Bianchi',
    email: 'sofia.bianchi@email.com',
    phone: '+39 347 987 6543',
    role: 'landlord' as const,
    verified: true,
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    rating: 4.9,
    reviewsCount: 18,
    joinedDate: '2021-09-20',
    description: 'Agenzia immobiliare specializzata in alloggi per studenti. Offriamo supporto completo dalla ricerca al contratto.',
    responseTime: '1 ora',
    languages: ['Italiano', 'Inglese', 'Spagnolo'],
    location: 'Roma, Italia'
  }
};

export default function ProfileScreen() {
  const { id } = useLocalSearchParams();
  useApp();
  
  const user = mockUsers[id as keyof typeof mockUsers];
  const userListings = mockListings.filter(listing => listing.userId === id);
  
  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Profilo non trovato</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Torna indietro</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profilo Proprietario</Text>
        </View>

        {/* Profile Info */}
        <View style={styles.profileSection}>
          <View style={styles.profileHeader}>
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
            <View style={styles.profileInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.name}>{user.firstName} {user.lastName}</Text>
                {user.verified && (
                  <View style={styles.verifiedBadge}>
                    <Shield size={16} color="#10B981" />
                    <Text style={styles.verifiedText}>Verificato</Text>
                  </View>
                )}
              </View>
              
              <View style={styles.locationRow}>
                <MapPin size={16} color="#6B7280" />
                <Text style={styles.location}>{user.location}</Text>
              </View>
              
              <View style={styles.ratingRow}>
                <Star size={16} color="#F59E0B" fill="#F59E0B" />
                <Text style={styles.rating}>{user.rating}</Text>
                <Text style={styles.reviewsCount}>({user.reviewsCount} recensioni)</Text>
              </View>
            </View>
          </View>
          
          <Text style={styles.description}>{user.description}</Text>
          
          {/* Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{userListings.length}</Text>
              <Text style={styles.statLabel}>Annunci Attivi</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{user.responseTime}</Text>
              <Text style={styles.statLabel}>Tempo Risposta</Text>
            </View>
            <View style={styles.stat}>
              <Calendar size={16} color="#6B7280" />
              <Text style={styles.statLabel}>Dal {new Date(user.joinedDate).getFullYear()}</Text>
            </View>
          </View>
          
          {/* Languages */}
          <View style={styles.languagesContainer}>
            <Text style={styles.languagesTitle}>Lingue parlate:</Text>
            <View style={styles.languages}>
              {user.languages.map((lang, index) => (
                <View key={index} style={styles.languageTag}>
                  <Text style={styles.languageText}>{lang}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Contact Buttons */}
        <View style={styles.contactSection}>
          <TouchableOpacity style={styles.contactButton}>
            <MessageCircle size={20} color="#FFF" />
            <Text style={styles.contactButtonText}>Invia Messaggio</Text>
          </TouchableOpacity>
          
          <View style={styles.contactRow}>
            <TouchableOpacity style={styles.secondaryContactButton}>
              <Phone size={18} color="#2563EB" />
              <Text style={styles.secondaryContactText}>Chiama</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryContactButton}>
              <Mail size={18} color="#2563EB" />
              <Text style={styles.secondaryContactText}>Email</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* User's Listings */}
        {userListings.length > 0 && (
          <View style={styles.listingsSection}>
            <Text style={styles.listingsTitle}>Altri annunci di {user.firstName}</Text>
            {userListings.map(listing => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
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
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginRight: 8,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  verifiedText: {
    fontSize: 12,
    color: '#10B981',
    marginLeft: 4,
    fontWeight: '500',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  location: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 4,
  },
  reviewsCount: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 4,
  },
  description: {
    fontSize: 15,
    color: '#4B5563',
    lineHeight: 22,
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 16,
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
  languagesContainer: {
    marginBottom: 8,
  },
  languagesTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  languages: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  languageTag: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  languageText: {
    fontSize: 12,
    color: '#374151',
  },
  contactSection: {
    padding: 16,
    backgroundColor: '#FFF',
    marginTop: 8,
  },
  contactButton: {
    backgroundColor: '#2563EB',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 12,
  },
  contactButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  contactRow: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryContactButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2563EB',
  },
  secondaryContactText: {
    color: '#2563EB',
    fontSize: 14,
    fontWeight: '500',
  },
  listingsSection: {
    marginTop: 8,
    paddingBottom: 20,
  },
  listingsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#6B7280',
    marginBottom: 20,
  },
  backButtonText: {
    color: '#2563EB',
    fontSize: 16,
    fontWeight: '500',
  },
});