import { useQuery } from '@tanstack/react-query';
import { graphqlClient, GET_LISTINGS_QUERY, GET_CATEGORIES_QUERY, GET_LISTING_BY_ID_QUERY } from '@/constants/graphql';

// Types for GraphQL responses
export interface GraphQLListing {
  id: number;
  userId: number;
  categoryId: number;
  title: string;
  description: string;
  address: string;
  postalCode: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  surfaceArea: number;
  numberOfRooms?: number;
  floor?: number;
  numberOfBathrooms: number;
  furnishingStatus: number;
  monthlyRent: number;
  expensesIncluded: boolean;
  monthlyExpenses?: number;
  annualAdjustment: boolean;
  hasTerrace: boolean;
  hasGarden: boolean;
  hasPool?: boolean;
  petsAllowed: boolean;
  availabilityDate: string;
  isAvailableImmediately: boolean;
  minContractDuration: number;
  rules?: string;
  hasElevator: boolean;
  hasRampAccess: boolean;
  securityDeposit: number;
  acceptsSwissCaution: boolean;
  status: number;
  createdAt: string;
  updatedAt: string;
  images: {
    id: number;
    imageUrl: string;
    isPrimary: boolean;
    orderIndex: number;
  }[];
  category: {
    id: number;
    nameIt: string;
    nameEn: string;
  };
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
    companyName?: string;
    isIndividual: boolean;
    isAgency: boolean;
    isVerified: boolean;
  };
}

export interface GraphQLCategory {
  id: number;
  nameIt: string;
  nameEn: string;
}

// Service functions
export const fetchListings = async (): Promise<GraphQLListing[]> => {
  console.log('🔄 Fetching listings from GraphQL...');
  try {
    const data = await graphqlClient.request<{ listings: GraphQLListing[] }>(GET_LISTINGS_QUERY);
    console.log('✅ Listings fetched successfully:', data.listings.length, 'items');
    return data.listings;
  } catch (error) {
    console.error('❌ Error fetching listings:', error);
    throw error;
  }
};

export const fetchCategories = async (): Promise<GraphQLCategory[]> => {
  console.log('🔄 Fetching categories from GraphQL...');
  try {
    const data = await graphqlClient.request<{ categories: GraphQLCategory[] }>(GET_CATEGORIES_QUERY);
    console.log('✅ Categories fetched successfully:', data.categories.length, 'items');
    return data.categories;
  } catch (error) {
    console.error('❌ Error fetching categories:', error);
    throw error;
  }
};

export const fetchListingById = async (id: number): Promise<GraphQLListing> => {
  console.log('🔄 Fetching listing by ID:', id);
  try {
    const data = await graphqlClient.request<{ listing: GraphQLListing }>(GET_LISTING_BY_ID_QUERY, { id });
    console.log('✅ Listing fetched successfully:', data.listing.title);
    return data.listing;
  } catch (error) {
    console.error('❌ Error fetching listing by ID:', error);
    throw error;
  }
};

// React Query hooks
export const useListings = () => {
  return useQuery({
    queryKey: ['listings'],
    queryFn: fetchListings,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
  });
};

export const useListingById = (id: number) => {
  return useQuery({
    queryKey: ['listing', id],
    queryFn: () => fetchListingById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};