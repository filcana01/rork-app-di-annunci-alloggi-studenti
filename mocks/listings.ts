import { createListing, createListingImage, createCategory, createUser, FurnishingStatus, ListingStatus } from '@/types';

// Mock categories
export const mockCategories = [
  createCategory({ id: 1, nameIt: 'Camera', nameEn: 'Room' }),
  createCategory({ id: 2, nameIt: 'Appartamento', nameEn: 'Apartment' }),
  createCategory({ id: 3, nameIt: 'Parcheggio', nameEn: 'Parking' })
];

// Mock users
export const mockUsers = [
  createUser({ 
    id: 1, 
    firstName: 'Marco', 
    lastName: 'Rossi', 
    email: 'marco.rossi@email.com', 
    phoneNumber: '+41 79 123 4567',
    isIndividual: true,
    isVerified: true
  }),
  createUser({ 
    id: 2, 
    firstName: 'Anna', 
    lastName: 'Bianchi', 
    companyName: 'Immobiliare Milano', 
    email: 'anna@immobiliare.com', 
    phoneNumber: '+41 79 234 5678',
    isAgency: true,
    isVerified: true
  }),
  createUser({ 
    id: 3, 
    firstName: 'Giuseppe', 
    lastName: 'Verdi', 
    email: 'giuseppe.verdi@email.com', 
    phoneNumber: '+41 79 345 6789',
    isIndividual: true,
    isVerified: true
  })
];

export const mockListings = [
  createListing({
    id: 1,
    userId: 1,
    categoryId: 1,
    title: 'Stanza singola vicino università',
    description: 'Bella stanza singola luminosa in appartamento condiviso con altri 2 studenti. Zona tranquilla e ben collegata con università.',
    address: 'Via Roma 123',
    postalCode: '20121',
    city: 'Milano',
    country: 'Italia',
    latitude: 45.4642,
    longitude: 9.1900,
    surfaceArea: 15,
    numberOfBathrooms: 1,
    furnishingStatus: FurnishingStatus.FURNISHED,
    monthlyRent: 450,
    expensesIncluded: false,
    monthlyExpenses: 50,
    annualAdjustment: true,
    hasTerrace: false,
    hasGarden: false,
    petsAllowed: false,
    availabilityDate: new Date('2024-02-01'),
    isAvailableImmediately: false,
    minContractDuration: 6,
    rules: 'Non fumatori, no feste',
    hasElevator: true,
    hasRampAccess: true,
    securityDeposit: 900,
    acceptsSwissCaution: true,
    status: ListingStatus.ACTIVE,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    images: [
      createListingImage({ imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800', isPrimary: true, orderIndex: 0 }),
      createListingImage({ imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800', isPrimary: false, orderIndex: 1 })
    ],
    category: mockCategories[0],
    user: mockUsers[0]
  }),
  createListing({
    id: 2,
    userId: 2,
    categoryId: 2,
    title: 'Bilocale moderno zona Navigli',
    description: 'Splendido bilocale completamente ristrutturato, ideale per studenti o giovani professionisti. Vicino a metro e tram.',
    address: 'Via Navigli 45',
    postalCode: '20144',
    city: 'Milano',
    country: 'Italia',
    latitude: 45.4520,
    longitude: 9.1780,
    surfaceArea: 55,
    numberOfRooms: 2,
    floor: 3,
    numberOfBathrooms: 1,
    furnishingStatus: FurnishingStatus.FURNISHED,
    monthlyRent: 1200,
    expensesIncluded: true,
    annualAdjustment: false,
    hasTerrace: true,
    hasGarden: false,
    petsAllowed: true,
    availabilityDate: new Date('2024-03-01'),
    isAvailableImmediately: false,
    minContractDuration: 12,
    hasElevator: true,
    hasRampAccess: false,
    securityDeposit: 2400,
    acceptsSwissCaution: false,
    status: ListingStatus.ACTIVE,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
    images: [
      createListingImage({ imageUrl: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800', isPrimary: true, orderIndex: 0 }),
      createListingImage({ imageUrl: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800', isPrimary: false, orderIndex: 1 })
    ],
    category: mockCategories[1],
    user: mockUsers[1]
  }),
  createListing({
    id: 3,
    userId: 3,
    categoryId: 3,
    title: 'Posto auto coperto centro città',
    description: 'Posto auto in garage sotterraneo videosorvegliato, accesso con telecomando.',
    address: 'Piazza Duomo 1',
    postalCode: '20122',
    city: 'Milano',
    country: 'Italia',
    latitude: 45.4641,
    longitude: 9.1919,
    surfaceArea: 12,
    numberOfBathrooms: 0,
    furnishingStatus: FurnishingStatus.UNFURNISHED,
    monthlyRent: 150,
    expensesIncluded: true,
    annualAdjustment: false,
    hasTerrace: false,
    hasGarden: false,
    petsAllowed: false,
    availabilityDate: new Date('2024-01-20'),
    isAvailableImmediately: true,
    minContractDuration: 1,
    hasElevator: false,
    hasRampAccess: true,
    securityDeposit: 300,
    acceptsSwissCaution: true,
    status: ListingStatus.ACTIVE,
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-05'),
    images: [
      createListingImage({ imageUrl: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=800', isPrimary: true, orderIndex: 0 })
    ],
    category: mockCategories[2],
    user: mockUsers[2]
  })
];