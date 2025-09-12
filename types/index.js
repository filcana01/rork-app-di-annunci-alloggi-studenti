// Database-aligned type definitions

// User types
export const UserType = {
  INDIVIDUAL: 'individual',
  AGENCY: 'agency',
  ADMIN: 'admin'
};

// Category types
export const CategoryType = {
  ROOM: 'room',
  APARTMENT: 'apartment', 
  PARKING: 'parking'
};

// Listing status
export const ListingStatus = {
  DRAFT: 0,
  ACTIVE: 1,
  EXPIRED: 2,
  ARCHIVED: 3
};

// Furnishing status
export const FurnishingStatus = {
  UNFURNISHED: 0,
  PARTIALLY_FURNISHED: 1,
  FURNISHED: 2
};

// User interface
export const createUser = (data = {}) => ({
  id: null,
  firstName: '',
  lastName: '',
  companyName: null,
  companyWebsite: null,
  email: '',
  phoneNumber: '',
  address: null,
  isIndividual: false,
  isAgency: false,
  isAdmin: false,
  isVerified: false,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...data
});

// Category interface
export const createCategory = (data = {}) => ({
  id: null,
  nameIt: '',
  nameEn: '',
  createdAt: new Date(),
  ...data
});

// Listing interface
export const createListing = (data = {}) => ({
  id: null,
  userId: null,
  categoryId: null,
  title: '',
  description: '',
  address: '',
  postalCode: '',
  city: '',
  country: '',
  latitude: null,
  longitude: null,
  surfaceArea: 0,
  numberOfRooms: null,
  floor: 0,
  numberOfBathrooms: null,
  furnishingStatus: FurnishingStatus.UNFURNISHED,
  monthlyRent: 0,
  expensesIncluded: false,
  monthlyExpenses: null,
  annualAdjustment: false,
  hasTerrace: false,
  hasGarden: false,
  hasPool: false,
  petsAllowed: false,
  availabilityDate: new Date(),
  isAvailableImmediately: false,
  minContractDuration: null,
  rules: null,
  hasElevator: false,
  hasRampAccess: false,
  securityDeposit: null,
  acceptsSwissCaution: false,
  status: ListingStatus.DRAFT,
  verifiedAt: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
  // Additional fields for UI
  images: [],
  category: null, // Will be populated from Category table
  user: null, // Will be populated from User table
  ...data
});

// Listing Image interface
export const createListingImage = (data = {}) => ({
  id: null,
  listingId: null,
  imageUrl: '',
  isPrimary: false,
  orderIndex: 0,
  createdAt: new Date(),
  ...data
});

// Favorite interface
export const createFavorite = (data = {}) => ({
  id: null,
  userId: null,
  listingId: null,
  createdAt: new Date(),
  ...data
});

// Message interface
export const createMessage = (data = {}) => ({
  id: null,
  senderUserId: null,
  receiverUserId: null,
  listingId: null,
  content: '',
  isRead: false,
  createdAt: new Date(),
  ...data
});

// Saved Search interface
export const createSavedSearch = (data = {}) => ({
  id: null,
  userId: null,
  searchName: '',
  searchCriteria: '{}', // JSON string
  notificationsEnabled: true,
  createdAt: new Date(),
  ...data
});

// Helper functions
export const getFurnishingStatusText = (status, language = 'it') => {
  const texts = {
    it: {
      [FurnishingStatus.UNFURNISHED]: 'Non arredato',
      [FurnishingStatus.PARTIALLY_FURNISHED]: 'Parzialmente arredato',
      [FurnishingStatus.FURNISHED]: 'Arredato'
    },
    en: {
      [FurnishingStatus.UNFURNISHED]: 'Unfurnished',
      [FurnishingStatus.PARTIALLY_FURNISHED]: 'Partially furnished',
      [FurnishingStatus.FURNISHED]: 'Furnished'
    }
  };
  return texts[language][status] || '';
};

export const getListingStatusText = (status, language = 'it') => {
  const texts = {
    it: {
      [ListingStatus.DRAFT]: 'Bozza',
      [ListingStatus.ACTIVE]: 'Attivo',
      [ListingStatus.EXPIRED]: 'Scaduto',
      [ListingStatus.ARCHIVED]: 'Archiviato'
    },
    en: {
      [ListingStatus.DRAFT]: 'Draft',
      [ListingStatus.ACTIVE]: 'Active',
      [ListingStatus.EXPIRED]: 'Expired',
      [ListingStatus.ARCHIVED]: 'Archived'
    }
  };
  return texts[language][status] || '';
};

// Search filters interface
export const createSearchFilters = (data = {}) => ({
  categoryId: null,
  minPrice: null,
  maxPrice: null,
  city: '',
  minSurface: null,
  maxSurface: null,
  numberOfRooms: null,
  numberOfBathrooms: null,
  furnishingStatus: null,
  hasTerrace: null,
  hasGarden: null,
  hasPool: null,
  petsAllowed: null,
  hasElevator: null,
  hasRampAccess: null,
  acceptsSwissCaution: null,
  isAvailableImmediately: null,
  availabilityDateFrom: null,
  availabilityDateTo: null,
  ...data
});