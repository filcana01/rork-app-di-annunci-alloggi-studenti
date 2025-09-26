import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, Alert, Image } from 'react-native';
import { useApp } from '@/hooks/use-app-context';
import { Camera, MapPin, Plus, X, Upload, Calendar } from 'lucide-react-native';
import { router } from 'expo-router';
import { createListing, FurnishingStatus, ListingStatus, getFurnishingStatusText } from '@/types';

export default function CreateListingScreen() {
  const [form, setForm] = useState(createListing({
    categoryId: 1, // Default to room
    country: 'Svizzera',
    furnishingStatus: FurnishingStatus.FURNISHED,
    expensesIncluded: true,
    isAvailableImmediately: true,
    minContractDuration: 12,
    status: ListingStatus.DRAFT
  }));

  const updateForm = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };



  const addImage = () => {
    // Placeholder per aggiungere immagini
    const placeholderImages = [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800',
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800'
    ];
    
    const randomImage = placeholderImages[Math.floor(Math.random() * placeholderImages.length)];
    setForm(prev => ({
      ...prev,
      images: [...prev.images, randomImage]
    }));
  };

  const removeImage = (index) => {
    setForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    if (!form.title.trim()) {
      Alert.alert('Errore', 'Il titolo è obbligatorio');
      return false;
    }
    if (!form.description.trim()) {
      Alert.alert('Errore', 'La descrizione è obbligatoria');
      return false;
    }
    if (!form.address.trim() || !form.city.trim()) {
      Alert.alert('Errore', 'Indirizzo completo obbligatorio');
      return false;
    }
    if (!form.surfaceArea || form.surfaceArea <= 0) {
      Alert.alert('Errore', 'Superficie deve essere maggiore di 0');
      return false;
    }
    if (!form.monthlyRent || form.monthlyRent <= 0) {
      Alert.alert('Errore', 'Prezzo mensile obbligatorio');
      return false;
    }
    if (form.images.length === 0) {
      Alert.alert('Errore', 'Aggiungi almeno una foto');
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    // Qui normalmente invieresti i dati al server
    Alert.alert(
      'Annuncio Creato!',
      'Il tuo annuncio è stato salvato come bozza e sarà verificato prima della pubblicazione.',
      [
        {
          text: 'OK',
          onPress: () => router.push('/')
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>Crea Nuovo Annuncio</Text>
          <Text style={styles.subtitle}>Compila tutti i campi per pubblicare il tuo annuncio</Text>
        </View>

        <View style={styles.form}>
          {/* Category */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Categoria *</Text>
            <View style={styles.categoryButtons}>
              {[
                { id: 1, name: 'Camera' },
                { id: 2, name: 'Appartamento' },
                { id: 3, name: 'Parcheggio' }
              ].map(cat => (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.categoryButton,
                    form.categoryId === cat.id && styles.categoryButtonActive
                  ]}
                  onPress={() => updateForm('categoryId', cat.id)}
                >
                  <Text style={[
                    styles.categoryButtonText,
                    form.categoryId === cat.id && styles.categoryButtonTextActive
                  ]}>
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Basic Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Informazioni Base</Text>
            <TextInput
              style={styles.input}
              placeholder="Titolo annuncio *"
              value={form.title}
              onChangeText={(text) => updateForm('title', text)}
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Descrizione dettagliata *"
              value={form.description}
              onChangeText={(text) => updateForm('description', text)}
              multiline
              numberOfLines={4}
            />
          </View>

          {/* Images */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Foto *</Text>
            <ScrollView horizontal style={styles.imagesContainer}>
              {form.images.map((image, index) => (
                <View key={index} style={styles.imageContainer}>
                  <Image source={{ uri: image }} style={styles.image} />
                  <TouchableOpacity
                    style={styles.removeImageButton}
                    onPress={() => removeImage(index)}
                  >
                    <X size={16} color="#FFF" />
                  </TouchableOpacity>
                </View>
              ))}
              <TouchableOpacity style={styles.addImageButton} onPress={addImage}>
                <Plus size={24} color="#666" />
                <Text style={styles.addImageText}>Aggiungi Foto</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>

          {/* Address */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Indirizzo *</Text>
            <TextInput
              style={styles.input}
              placeholder="Via e numero civico *"
              value={form.address}
              onChangeText={(text) => updateForm('address', text)}
            />
            <View style={styles.row}>
              <TextInput
                style={[styles.input, styles.halfInput]}
                placeholder="CAP *"
                value={form.postalCode}
                onChangeText={(text) => updateForm('postalCode', text)}
                keyboardType="numeric"
              />
              <TextInput
                style={[styles.input, styles.halfInput]}
                placeholder="Città *"
                value={form.city}
                onChangeText={(text) => updateForm('city', text)}
              />
            </View>
          </View>

          {/* Property Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Dettagli Immobile</Text>
            <View style={styles.row}>
              <TextInput
                style={[styles.input, styles.halfInput]}
                placeholder="Superficie (m²) *"
                value={form.surfaceArea?.toString() || ''}
                onChangeText={(text) => updateForm('surfaceArea', text ? parseInt(text) : 0)}
                keyboardType="numeric"
              />
              {form.categoryId !== 3 && (
                <TextInput
                  style={[styles.input, styles.halfInput]}
                  placeholder="N. Locali"
                  value={form.numberOfRooms?.toString() || ''}
                  onChangeText={(text) => updateForm('numberOfRooms', text ? parseInt(text) : null)}
                  keyboardType="numeric"
                />
              )}
            </View>
            <View style={styles.row}>
              <TextInput
                style={[styles.input, styles.halfInput]}
                placeholder="Piano"
                value={form.floor?.toString() || ''}
                onChangeText={(text) => updateForm('floor', text ? parseInt(text) : 0)}
                keyboardType="numeric"
              />
              <TextInput
                style={[styles.input, styles.halfInput]}
                placeholder="N. Bagni"
                value={form.numberOfBathrooms?.toString() || ''}
                onChangeText={(text) => updateForm('numberOfBathrooms', text ? parseInt(text) : null)}
                keyboardType="numeric"
              />
            </View>
          </View>

          {/* Furnishing */}
          {form.categoryId !== 3 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Arredamento</Text>
              <View style={styles.furnishingButtons}>
                {[
                  { value: FurnishingStatus.FURNISHED, label: getFurnishingStatusText(FurnishingStatus.FURNISHED) },
                  { value: FurnishingStatus.PARTIALLY_FURNISHED, label: getFurnishingStatusText(FurnishingStatus.PARTIALLY_FURNISHED) },
                  { value: FurnishingStatus.UNFURNISHED, label: getFurnishingStatusText(FurnishingStatus.UNFURNISHED) }
                ].map(furn => (
                  <TouchableOpacity
                    key={furn.value}
                    style={[
                      styles.furnishingButton,
                      form.furnishingStatus === furn.value && styles.furnishingButtonActive
                    ]}
                    onPress={() => updateForm('furnishingStatus', furn.value)}
                  >
                    <Text style={[
                      styles.furnishingButtonText,
                      form.furnishingStatus === furn.value && styles.furnishingButtonTextActive
                    ]}>
                      {furn.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Price */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Prezzo *</Text>
            <TextInput
              style={styles.input}
              placeholder="Prezzo mensile (€) *"
              value={form.monthlyRent}
              onChangeText={(text) => updateForm('monthlyRent', text)}
              keyboardType="numeric"
            />
            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={() => updateForm('expensesIncluded', !form.expensesIncluded)}
            >
              <View style={[styles.checkbox, form.expensesIncluded && styles.checkboxActive]} />
              <Text style={styles.checkboxText}>Spese incluse</Text>
            </TouchableOpacity>
            {!form.expensesIncluded && (
              <TextInput
                style={styles.input}
                placeholder="Spese mensili (€)"
                value={form.monthlyExpenses}
                onChangeText={(text) => updateForm('monthlyExpenses', text)}
                keyboardType="numeric"
              />
            )}
            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={() => updateForm('annualAdjustment', !form.annualAdjustment)}
            >
              <View style={[styles.checkbox, form.annualAdjustment && styles.checkboxActive]} />
              <Text style={styles.checkboxText}>Conguaglio annuale</Text>
            </TouchableOpacity>
          </View>

          {/* Features */}
          {form.categoryId !== 3 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Caratteristiche</Text>
              {Object.entries({
                hasTerrace: 'Terrazza',
                hasGarden: 'Giardino',
                hasPool: 'Piscina',
                petsAllowed: 'Animali ammessi'
              }).map(([key, label]) => (
                <TouchableOpacity
                  key={key}
                  style={styles.checkboxRow}
                  onPress={() => updateForm(key, !form[key])}
                >
                  <View style={[
                    styles.checkbox, 
                    form[key] && styles.checkboxActive
                  ]} />
                  <Text style={styles.checkboxText}>{label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Availability */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Disponibilità</Text>
            <View style={styles.availabilityButtons}>
              {[true, false].map(isImmediate => (
                <TouchableOpacity
                  key={isImmediate.toString()}
                  style={[
                    styles.availabilityButton,
                    form.isAvailableImmediately === isImmediate && styles.availabilityButtonActive
                  ]}
                  onPress={() => updateForm('isAvailableImmediately', isImmediate)}
                >
                  <Text style={[
                    styles.availabilityButtonText,
                    form.isAvailableImmediately === isImmediate && styles.availabilityButtonTextActive
                  ]}>
                    {isImmediate ? 'Da subito' : 'Da data specifica'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {!form.isAvailableImmediately && (
              <TextInput
                style={styles.input}
                placeholder="Data disponibilità (gg/mm/aaaa)"
                value={form.availabilityDate ? form.availabilityDate.toLocaleDateString('it-IT') : ''}
                onChangeText={(text) => {
                  // Simple date parsing - in production use a proper date picker
                  const parts = text.split('/');
                  if (parts.length === 3) {
                    const date = new Date(parts[2], parts[1] - 1, parts[0]);
                    updateForm('availabilityDate', date);
                  }
                }}
              />
            )}
            <TextInput
              style={styles.input}
              placeholder="Durata minima contratto (mesi)"
              value={form.minContractDuration?.toString() || ''}
              onChangeText={(text) => updateForm('minContractDuration', text ? parseInt(text) : null)}
              keyboardType="numeric"
            />
          </View>

          {/* Accessibility */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Accessibilità</Text>
            {Object.entries({
              hasElevator: 'Ascensore',
              hasRampAccess: 'Accesso disabili'
            }).map(([key, label]) => (
              <TouchableOpacity
                key={key}
                style={styles.checkboxRow}
                onPress={() => updateForm(key, !form[key])}
              >
                <View style={[
                  styles.checkbox, 
                  form[key] && styles.checkboxActive
                ]} />
                <Text style={styles.checkboxText}>{label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Security Deposit */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Deposito Cauzionale</Text>
            <TextInput
              style={styles.input}
              placeholder="Ammontare deposito cauzionale (€)"
              value={form.securityDeposit}
              onChangeText={(text) => updateForm('securityDeposit', text)}
              keyboardType="numeric"
            />
            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={() => updateForm('acceptsSwissCaution', !form.acceptsSwissCaution)}
            >
              <View style={[styles.checkbox, form.acceptsSwissCaution && styles.checkboxActive]} />
              <Text style={styles.checkboxText}>Accetta SwissCaution</Text>
            </TouchableOpacity>

          </View>

          {/* Rules */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Regole (Opzionale)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Regole della casa, orari, no fumatori, no animali, ecc..."
              value={form.rules}
              onChangeText={(text) => updateForm('rules', text)}
              multiline
              numberOfLines={3}
            />
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Pubblica Annuncio</Text>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  form: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    marginBottom: 12,
    backgroundColor: '#FFF',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  categoryButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  categoryButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    alignItems: 'center',
  },
  categoryButtonActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  categoryButtonText: {
    fontSize: 14,
    color: '#6B7280',
  },
  categoryButtonTextActive: {
    color: '#FFF',
    fontWeight: '600',
  },
  imagesContainer: {
    flexDirection: 'row',
  },
  imageContainer: {
    position: 'relative',
    marginRight: 12,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#EF4444',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addImageButton: {
    width: 100,
    height: 100,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderStyle: 'dashed',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addImageText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'center',
  },
  furnishingButtons: {
    gap: 8,
  },
  furnishingButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    alignItems: 'center',
  },
  furnishingButtonActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  furnishingButtonText: {
    fontSize: 14,
    color: '#6B7280',
  },
  furnishingButtonTextActive: {
    color: '#FFF',
    fontWeight: '600',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderRadius: 4,
    marginRight: 12,
  },
  checkboxActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  checkboxText: {
    fontSize: 16,
    color: '#374151',
  },
  availabilityButtons: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  availabilityButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    alignItems: 'center',
  },
  availabilityButtonActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  availabilityButtonText: {
    fontSize: 14,
    color: '#6B7280',
  },
  availabilityButtonTextActive: {
    color: '#FFF',
    fontWeight: '600',
  },
  footer: {
    padding: 16,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  submitButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
});