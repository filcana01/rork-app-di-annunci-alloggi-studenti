// Tipi per le entità del database
export interface User {
  switchEduID: number;
  firstName: string;
  lastName: string;
  companyName?: string;
  email: string;
  phoneNumber: string;
  address?: string;
  username?: string;
  userType: UserType;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export enum UserType {
  Student = 0,
  Individual = 1,
  Agency = 2,
  Admin = 3
}

export interface Category {
  id: number;
  name: string;
  nameEn: string;
  createdAt: string;
}

export interface Listing {
  id: number;
  userId: number;
  categoryId: number;
  title: string;
  description: string;
  address: string;
  postalCode: string;
  city: string;
  country: string;
  latitude?: number;
  longitude?: number;
  surfaceArea: number;
  numberOfRooms?: number;
  floor: number;
  numberOfBathrooms?: number;
  furnishingStatus: FurnishingStatus;
  monthlyRent: number;
  expensesIncluded: boolean;
  monthlyExpenses?: number;
  annualAdjustment: boolean;
  hasTerrace: boolean;
  hasGarden: boolean;
  petsAllowed: boolean;
  availabilityDate: string;
  isAvailableImmediately: boolean;
  minContractDuration?: number;
  rules?: string;
  accessibility?: string;
  securityDeposit?: number;
  acceptsSwissCaution: boolean;
  status: ListingStatus;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  user?: User;
  category?: Category;
  images?: ListingImage[];
  isFavorite?: boolean;
}

export enum FurnishingStatus {
  Unfurnished = 0,
  PartiallyFurnished = 1,
  Furnished = 2
}

export enum ListingStatus {
  Draft = 0,
  Active = 1,
  Expired = 2,
  Archived = 3
}

export interface ListingImage {
  id: number;
  listingId: number;
  imageUrl: string;
  isPrimary: boolean;
  orderIndex: number;
  createdAt: string;
}

export interface Favorite {
  id: number;
  userId: number;
  listingId: number;
  createdAt: string;
  listing?: Listing;
}

export interface Message {
  id: number;
  senderId: number;
  receiverId: number;
  listingId?: number;
  subject: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  sender?: User;
  receiver?: User;
  listing?: Listing;
}

export interface SavedSearch {
  id: number;
  userId: number;
  searchName: string;
  searchCriteria: string; // JSON string
  notificationsEnabled: boolean;
  createdAt: string;
}

// Tipi per i filtri di ricerca
export interface SearchFilters {
  categoryId?: number;
  city?: string;
  minRent?: number;
  maxRent?: number;
  minSurfaceArea?: number;
  maxSurfaceArea?: number;
  numberOfRooms?: number;
  furnishingStatus?: FurnishingStatus;
  hasTerrace?: boolean;
  hasGarden?: boolean;
  petsAllowed?: boolean;
  availableFrom?: string;
  minContractDuration?: number;
}

// Tipi per le mutazioni
export interface CreateListingInput {
  categoryId: number;
  title: string;
  description: string;
  address: string;
  postalCode: string;
  city: string;
  country: string;
  latitude?: number;
  longitude?: number;
  surfaceArea: number;
  numberOfRooms?: number;
  floor: number;
  numberOfBathrooms?: number;
  furnishingStatus: FurnishingStatus;
  monthlyRent: number;
  expensesIncluded: boolean;
  monthlyExpenses?: number;
  annualAdjustment: boolean;
  hasTerrace: boolean;
  hasGarden: boolean;
  petsAllowed: boolean;
  availabilityDate: string;
  isAvailableImmediately: boolean;
  minContractDuration?: number;
  rules?: string;
  accessibility?: string;
  securityDeposit?: number;
  acceptsSwissCaution: boolean;
}

export interface UpdateListingInput extends Partial<CreateListingInput> {
  id: number;
}

export interface CreateMessageInput {
  receiverId: number;
  listingId?: number;
  subject: string;
  content: string;
}