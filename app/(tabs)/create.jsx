import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, Alert, Image } from 'react-native';
import { useApp } from '@/hooks/use-app-context';
import { Camera, MapPin, Plus, X, Upload, Calendar } from 'lucide-react-native';
import { router } from 'expo-router';

export default function CreateListingScreen() {
  const { t } = useApp();
  const [form, setForm] = useState({
    category: 'room',
    title: '',
    description: '',
    images: [],
    address: {
      street: '',
      zipCode: '',
      city: '',
      country: 'Italia'
    },
    surface: '',
    rooms: '',
    floor: '',
    bathrooms: '1',
    furnishing: 'furnished',
    monthlyRent: '',
    expensesIncluded: true,
    monthlyExpenses: '',
    yearlyAdjustment: false,
    features: {
      terrace: false,
      garden: false,
      petsAllowed: false,
      accessibleForDisabled: false
    },
    availabilityType: 'immediately',
    availableFrom: '',
    minimumContractMonths: '12',
    rules: '',
    accessibility: [],
    securityDeposit: '',
    acceptsSwissCaution: false,
    acceptsOtherGuarantees: false,
    guaranteeServices: ''
  });

  const updateForm = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const updateAddress = (field, value) => {
    setForm(prev => ({
      ...prev,
      address: { ...prev.address, [field]: value }
    }));
  };

  const updateFeatures = (feature, value) => {
    setForm(prev => ({
      ...prev,
      features: { ...prev.features, [feature]: value }
    }));
  };

  const updateAccessibility = (feature) => {
    setForm(prev => ({
      ...prev,
      accessibility: prev.accessibility.includes(feature)
        ? prev.accessibility.filter(f => f !== feature)
        : [...prev.accessibility, feature]
    }));
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
    if (!form.address.street.trim() || !form.address.city.trim()) {
      Alert.alert('Errore', 'Indirizzo completo obbligatorio');
      return false;
    }
    if (!form.surface || parseInt(form.surface) <= 0) {
      Alert.alert('Errore', 'Superficie deve essere maggiore di 0');
      return false;
    }
    if (!form.monthlyRent || parseInt(form.monthlyRent) <= 0) {
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
              {['room', 'apartment', 'parking'].map(cat => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryButton,
                    form.category === cat && styles.categoryButtonActive
                  ]}
                  onPress={() => updateForm('category', cat)}
                >
                  <Text style={[
                    styles.categoryButtonText,
                    form.category === cat && styles.categoryButtonTextActive
                  ]}>
                    {cat === 'room' ? 'Camera' : cat === 'apartment' ? 'Appartamento' : 'Parcheggio'}
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
              value={form.address.street}
              onChangeText={(text) => updateAddress('street', text)}
            />
            <View style={styles.row}>
              <TextInput
                style={[styles.input, styles.halfInput]}
                placeholder="CAP *"
                value={form.address.zipCode}
                onChangeText={(text) => updateAddress('zipCode', text)}
                keyboardType="numeric"
              />
              <TextInput
                style={[styles.input, styles.halfInput]}
                placeholder="Città *"
                value={form.address.city}
                onChangeText={(text) => updateAddress('city', text)}
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
                value={form.surface}
                onChangeText={(text) => updateForm('surface', text)}
                keyboardType="numeric"
              />
              {form.category !== 'parking' && (
                <TextInput
                  style={[styles.input, styles.halfInput]}
                  placeholder="N. Locali"
                  value={form.rooms}
                  onChangeText={(text) => updateForm('rooms', text)}
                  keyboardType="numeric"
                />
              )}
            </View>
            <View style={styles.row}>
              <TextInput
                style={[styles.input, styles.halfInput]}
                placeholder="Piano"
                value={form.floor}
                onChangeText={(text) => updateForm('floor', text)}
              />
              <TextInput
                style={[styles.input, styles.halfInput]}
                placeholder="N. Bagni"
                value={form.bathrooms}
                onChangeText={(text) => updateForm('bathrooms', text)}
                keyboardType="numeric"
              />
            </View>
          </View>

          {/* Furnishing */}
          {form.category !== 'parking' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Arredamento</Text>
              <View style={styles.furnishingButtons}>
                {['furnished', 'partially_furnished', 'unfurnished'].map(furn => (
                  <TouchableOpacity
                    key={furn}
                    style={[
                      styles.furnishingButton,
                      form.furnishing === furn && styles.furnishingButtonActive
                    ]}
                    onPress={() => updateForm('furnishing', furn)}
                  >
                    <Text style={[
                      styles.furnishingButtonText,
                      form.furnishing === furn && styles.furnishingButtonTextActive
                    ]}>
                      {furn === 'furnished' ? 'Arredato' : 
                       furn === 'partially_furnished' ? 'Parz. Arredato' : 'Non Arredato'}
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
              onPress={() => updateForm('yearlyAdjustment', !form.yearlyAdjustment)}
            >
              <View style={[styles.checkbox, form.yearlyAdjustment && styles.checkboxActive]} />
              <Text style={styles.checkboxText}>Conguaglio annuale</Text>
            </TouchableOpacity>
          </View>

          {/* Features */}
          {form.category !== 'parking' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Caratteristiche</Text>
              {Object.entries({
                terrace: 'Terrazza',
                garden: 'Giardino',
                petsAllowed: 'Animali ammessi',
                accessibleForDisabled: 'Accessibile ai disabili'
              }).map(([key, label]) => (
                <TouchableOpacity
                  key={key}
                  style={styles.checkboxRow}
                  onPress={() => updateFeatures(key, !form.features[key])}
                >
                  <View style={[
                    styles.checkbox, 
                    form.features[key] && styles.checkboxActive
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
              {['immediately', 'from_date'].map(type => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.availabilityButton,
                    form.availabilityType === type && styles.availabilityButtonActive
                  ]}
                  onPress={() => updateForm('availabilityType', type)}
                >
                  <Text style={[
                    styles.availabilityButtonText,
                    form.availabilityType === type && styles.availabilityButtonTextActive
                  ]}>
                    {type === 'immediately' ? 'Da subito' : 'Da data specifica'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {form.availabilityType === 'from_date' && (
              <TextInput
                style={styles.input}
                placeholder="Data disponibilità (gg/mm/aaaa)"
                value={form.availableFrom}
                onChangeText={(text) => updateForm('availableFrom', text)}
              />
            )}
            <TextInput
              style={styles.input}
              placeholder="Durata minima contratto (mesi)"
              value={form.minimumContractMonths}
              onChangeText={(text) => updateForm('minimumContractMonths', text)}
              keyboardType="numeric"
            />
          </View>

          {/* Accessibility */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Accessibilità</Text>
            {Object.entries({
              elevator: 'Ascensore',
              disabled_access: 'Accesso disabili',
              ground_floor: 'Piano terra',
              ramp: 'Rampa di accesso'
            }).map(([key, label]) => (
              <TouchableOpacity
                key={key}
                style={styles.checkboxRow}
                onPress={() => updateAccessibility(key)}
              >
                <View style={[
                  styles.checkbox, 
                  form.accessibility.includes(key) && styles.checkboxActive
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
            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={() => updateForm('acceptsOtherGuarantees', !form.acceptsOtherGuarantees)}
            >
              <View style={[styles.checkbox, form.acceptsOtherGuarantees && styles.checkboxActive]} />
              <Text style={styles.checkboxText}>Accetta altri servizi di garanzia</Text>
            </TouchableOpacity>
            {form.acceptsOtherGuarantees && (
              <TextInput
                style={styles.input}
                placeholder="Servizi di garanzia accettati (es. Garantme, Locapass)"
                value={form.guaranteeServices}
                onChangeText={(text) => updateForm('guaranteeServices', text)}
              />
            )}
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