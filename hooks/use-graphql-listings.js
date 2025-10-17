import { useQuery, useMutation } from '@apollo/client';
import { GET_LISTINGS, GET_LISTING_BY_ID } from '@/graphql/queries';
import { CREATE_LISTING, UPDATE_LISTING, DELETE_LISTING } from '@/graphql/mutations';

export function useListings(filter = null, pagination = null) {
  const { data, loading, error, refetch } = useQuery(GET_LISTINGS, {
    variables: { filter, pagination },
    fetchPolicy: 'cache-and-network',
  });

  return {
    listings: data?.listings || [],
    loading,
    error,
    refetch,
  };
}

export function useListingById(id) {
  const { data, loading, error, refetch } = useQuery(GET_LISTING_BY_ID, {
    variables: { id: parseInt(id) },
    skip: !id,
  });

  return {
    listing: data?.listing || null,
    loading,
    error,
    refetch,
  };
}

export function useCreateListing() {
  const [createListingMutation, { loading, error }] = useMutation(CREATE_LISTING, {
    refetchQueries: [{ query: GET_LISTINGS }],
  });

  const createListing = async (input) => {
    try {
      const { data } = await createListingMutation({
        variables: { input },
      });
      return { success: true, listing: data.createListing };
    } catch (err) {
      console.error('Error creating listing:', err);
      return { success: false, error: err.message };
    }
  };

  return { createListing, loading, error };
}

export function useUpdateListing() {
  const [updateListingMutation, { loading, error }] = useMutation(UPDATE_LISTING);

  const updateListing = async (input) => {
    try {
      const { data } = await updateListingMutation({
        variables: { input },
      });
      return { success: true, listing: data.updateListing };
    } catch (err) {
      console.error('Error updating listing:', err);
      return { success: false, error: err.message };
    }
  };

  return { updateListing, loading, error };
}

export function useDeleteListing() {
  const [deleteListingMutation, { loading, error }] = useMutation(DELETE_LISTING, {
    refetchQueries: [{ query: GET_LISTINGS }],
  });

  const deleteListing = async (id) => {
    try {
      await deleteListingMutation({
        variables: { input: { id: parseInt(id) } },
      });
      return { success: true };
    } catch (err) {
      console.error('Error deleting listing:', err);
      return { success: false, error: err.message };
    }
  };

  return { deleteListing, loading, error };
}
