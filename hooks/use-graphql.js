import { useQuery, useQueryClient } from '@tanstack/react-query';
import { graphqlClient, GET_LISTINGS_QUERY, GET_LISTING_BY_ID_QUERY, GET_CATEGORIES_QUERY } from '@/constants/graphql';
import { GRAPHQL_CONFIG, isGraphQLEndpointConfigured } from '@/constants/graphql-config';
import { mockListings, mockCategories } from '@/mocks/listings';

// Hook per ottenere tutti i listings
export const useListings = () => {
  return useQuery({
    queryKey: ['listings'],
    queryFn: async () => {
      try {
        console.log('Fetching listings from GraphQL...');
        const data = await graphqlClient.request(GET_LISTINGS_QUERY);
        console.log('GraphQL listings response:', data);
        return data.listings || [];
      } catch (error) {
        console.warn('GraphQL endpoint not available, using mock data:', error.message);
        // Fallback ai mock data se l'endpoint non è disponibile
        return mockListings;
      }
    },
    staleTime: GRAPHQL_CONFIG.staleTime,
    cacheTime: GRAPHQL_CONFIG.cacheTime,
    retry: (failureCount, error) => {
      // Non ritentare se l'endpoint non è configurato o non disponibile
      if (!isGraphQLEndpointConfigured() || error.message.includes('fetch')) {
        return false;
      }
      return failureCount < GRAPHQL_CONFIG.retryCount;
    },
  });
};

// Hook per ottenere un singolo listing
export const useListing = (id) => {
  return useQuery({
    queryKey: ['listing', id],
    queryFn: async () => {
      try {
        console.log(`Fetching listing ${id} from GraphQL...`);
        const data = await graphqlClient.request(GET_LISTING_BY_ID_QUERY, { id: parseInt(id) });
        console.log('GraphQL listing response:', data);
        return data.listing;
      } catch (error) {
        console.warn(`GraphQL endpoint not available for listing ${id}, using mock data:`, error.message);
        // Fallback ai mock data
        const mockListing = mockListings.find(listing => listing.id === parseInt(id));
        return mockListing || null;
      }
    },
    enabled: !!id, // Esegui la query solo se l'id è presente
    staleTime: GRAPHQL_CONFIG.staleTime,
    cacheTime: GRAPHQL_CONFIG.cacheTime,
    retry: (failureCount, error) => {
      if (!isGraphQLEndpointConfigured() || error.message.includes('fetch')) {
        return false;
      }
      return failureCount < GRAPHQL_CONFIG.retryCount;
    },
  });
};

// Hook per ottenere le categorie
export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      try {
        console.log('Fetching categories from GraphQL...');
        const data = await graphqlClient.request(GET_CATEGORIES_QUERY);
        console.log('GraphQL categories response:', data);
        return data.categories || [];
      } catch (error) {
        console.warn('GraphQL endpoint not available for categories, using mock data:', error.message);
        // Fallback ai mock data
        return mockCategories;
      }
    },
    staleTime: 30 * 60 * 1000, // 30 minuti (le categorie cambiano raramente)
    cacheTime: 60 * 60 * 1000, // 1 ora
    retry: (failureCount, error) => {
      if (!isGraphQLEndpointConfigured() || error.message.includes('fetch')) {
        return false;
      }
      return failureCount < GRAPHQL_CONFIG.retryCount;
    },
  });
};

// Hook per invalidare la cache dei listings (utile dopo create/update/delete)
export const useInvalidateListings = () => {
  const queryClient = useQueryClient();
  
  return () => {
    queryClient.invalidateQueries({ queryKey: ['listings'] });
    queryClient.invalidateQueries({ queryKey: ['listing'] });
  };
};

// Hook per aggiornare l'endpoint GraphQL e invalidare la cache
export const useUpdateGraphQLEndpoint = () => {
  const queryClient = useQueryClient();
  
  return (newEndpoint) => {
    if (!newEndpoint || typeof newEndpoint !== 'string' || !newEndpoint.trim()) {
      console.warn('Invalid GraphQL endpoint provided');
      return;
    }
    
    // Aggiorna la configurazione
    GRAPHQL_CONFIG.endpoint = newEndpoint.trim();
    console.log('GraphQL endpoint updated to:', newEndpoint);
    
    // Invalida tutta la cache per forzare il refetch con il nuovo endpoint
    queryClient.invalidateQueries();
  };
};