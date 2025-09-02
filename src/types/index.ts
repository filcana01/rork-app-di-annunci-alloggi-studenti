export type UserRole = 'guest' | 'student' | 'landlord' | 'admin';
export type ListingCategory = 'room' | 'apartment' | 'parking';
export type ListingStatus = 'draft' | 'pending' | 'active' | 'expired' | 'archived';
export type FurnishingStatus = 'furnished' | 'partially_furnished' | 'unfurnished';
export type AvailabilityType = 'immediately' | 'from_date';
export type AccessibilityFeature = 'elevator' | 'disabled_access' | 'ground_floor' | 'ramp';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: UserRole;
  companyName?: string;
  address?: string;
  verified: boolean;
  createdAt: Date;
}

export interface Listing {
  id: string;
  userId: string;
  category: ListingCategory;
  title: string;
  description: string;
  images: string[];
  address: {
    street: string;
    zipCode: string;
    city: string;
    country: string;
    latitude: number;
    longitude: number;
  };
  surface: number;
  rooms?: number;
  floor?: string;
  bathrooms: number;
  furnishing: FurnishingStatus;
  monthlyRent: number;
  expensesIncluded: boolean;
  monthlyExpenses?: number;
  yearlyAdjustment: boolean;
  features: {
    terrace: boolean;
    garden: boolean;
    petsAllowed: boolean;
    accessibleForDisabled: boolean;
  };
  availabilityType: AvailabilityType;
  availableFrom: Date;
  minimumContractMonths: number;
  rules?: string;
  accessibility: AccessibilityFeature[];
  securityDeposit: number;
  acceptsSwissCaution: boolean;
  acceptsOtherGuarantees: boolean;
  guaranteeServices?: string;
  status: ListingStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface SearchFilters {
  category?: ListingCategory;
  minPrice?: number;
  maxPrice?: number;
  city?: string;
  minSurface?: number;
  maxSurface?: number;
  rooms?: number;
  furnishing?: FurnishingStatus;
  petsAllowed?: boolean;
  accessibleForDisabled?: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  listingId: string;
  content: string;
  read: boolean;
  createdAt: Date;
}