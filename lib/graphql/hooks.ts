import { useQuery, useMutation } from 'urql';
import { 
  GET_LISTINGS, 
  GET_LISTING_BY_ID, 
  GET_CATEGORIES,
  GET_USER_FAVORITES,
  GET_USER_MESSAGES,
  GET_SAVED_SEARCHES,
  CREATE_LISTING,
  UPDATE_LISTING,
  DELETE_LISTING,
  TOGGLE_FAVORITE,
  SEND_MESSAGE,
  SAVE_SEARCH
} from './queries';
import { 
  Listing, 
  Category, 
  Favorite, 
  Message, 
  SavedSearch,
  SearchFilters,
  CreateListingInput,
  UpdateListingInput,
  CreateMessageInput
} from '@/types/graphql';

// Hook per ottenere gli annunci con filtri
export const useListings = (filters?: SearchFilters, skip = 0, take = 20) => {
  const [result] = useQuery<{ listings: Listing[] }>({
    query: GET_LISTINGS,
    variables: {
      filters,
      skip,
      take,
      orderBy: [{ createdAt: 'DESC' }]
    }
  });

  return {
    data: result.data,
    loading: result.fetching,
    error: result.error
  };
};

// Hook per ottenere un singolo annuncio
export const useListing = (id: number) => {
  const [result] = useQuery<{ listing: Listing }>({
    query: GET_LISTING_BY_ID,
    variables: { id },
    pause: !id
  });

  return {
    data: result.data,
    loading: result.fetching,
    error: result.error
  };
};

// Hook per ottenere le categorie
export const useCategories = () => {
  const [result] = useQuery<{ categories: Category[] }>({
    query: GET_CATEGORIES
  });

  return {
    data: result.data,
    loading: result.fetching,
    error: result.error
  };
};

// Hook per ottenere i preferiti dell'utente
export const useFavorites = (userId: number) => {
  const [result] = useQuery<{ favorites: Favorite[] }>({
    query: GET_USER_FAVORITES,
    variables: { userId },
    pause: !userId
  });

  return {
    data: result.data,
    loading: result.fetching,
    error: result.error
  };
};

// Hook per ottenere i messaggi dell'utente
export const useMessages = (userId: number) => {
  const [result] = useQuery<{ messages: Message[] }>({
    query: GET_USER_MESSAGES,
    variables: { userId },
    pause: !userId
  });

  return {
    data: result.data,
    loading: result.fetching,
    error: result.error
  };
};

// Hook per ottenere le ricerche salvate
export const useSavedSearches = (userId: number) => {
  const [result] = useQuery<{ savedSearches: SavedSearch[] }>({
    query: GET_SAVED_SEARCHES,
    variables: { userId },
    pause: !userId
  });

  return {
    data: result.data,
    loading: result.fetching,
    error: result.error
  };
};

// Hook per creare un nuovo annuncio
export const useCreateListing = () => {
  const [, executeMutation] = useMutation<{ createListing: Listing }>(CREATE_LISTING);
  
  return {
    createListing: (input: CreateListingInput) => executeMutation({ input })
  };
};

// Hook per aggiornare un annuncio
export const useUpdateListing = () => {
  const [, executeMutation] = useMutation<{ updateListing: Listing }>(UPDATE_LISTING);
  
  return {
    updateListing: (input: UpdateListingInput) => executeMutation({ input })
  };
};

// Hook per eliminare un annuncio
export const useDeleteListing = () => {
  const [, executeMutation] = useMutation<{ deleteListing: boolean }>(DELETE_LISTING);
  
  return {
    deleteListing: (id: number) => executeMutation({ id })
  };
};

// Hook per aggiungere/rimuovere dai preferiti
export const useToggleFavorite = () => {
  const [, executeMutation] = useMutation<{ toggleFavorite: Favorite }>(TOGGLE_FAVORITE);
  
  return {
    toggleFavorite: (userId: number, listingId: number) => executeMutation({ userId, listingId })
  };
};

// Hook per inviare un messaggio
export const useSendMessage = () => {
  const [, executeMutation] = useMutation<{ sendMessage: Message }>(SEND_MESSAGE);
  
  return {
    sendMessage: (input: CreateMessageInput) => executeMutation({ input })
  };
};

// Hook per salvare una ricerca
export const useSaveSearch = () => {
  const [, executeMutation] = useMutation(SAVE_SEARCH);
  
  return {
    saveSearch: (input: any) => executeMutation({ input })
  };
};