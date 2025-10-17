import { useQuery, useMutation } from '@apollo/client';
import { GET_FAVORITES } from '@/graphql/queries';
import { ADD_FAVORITE, REMOVE_FAVORITE } from '@/graphql/mutations';

export function useFavorites(userId) {
  const { data, loading, error, refetch } = useQuery(GET_FAVORITES, {
    variables: { userId: parseInt(userId) },
    skip: !userId,
  });

  return {
    favorites: data?.favorites || [],
    loading,
    error,
    refetch,
  };
}

export function useAddFavorite() {
  const [addFavoriteMutation, { loading, error }] = useMutation(ADD_FAVORITE, {
    refetchQueries: [GET_FAVORITES],
  });

  const addFavorite = async (userId, listingId) => {
    try {
      const { data } = await addFavoriteMutation({
        variables: {
          input: {
            userId: parseInt(userId),
            listingId: parseInt(listingId),
          },
        },
      });
      return { success: true, favorite: data.addFavorite };
    } catch (err) {
      console.error('Error adding favorite:', err);
      return { success: false, error: err.message };
    }
  };

  return { addFavorite, loading, error };
}

export function useRemoveFavorite() {
  const [removeFavoriteMutation, { loading, error }] = useMutation(REMOVE_FAVORITE, {
    refetchQueries: [GET_FAVORITES],
  });

  const removeFavorite = async (userId, listingId) => {
    try {
      await removeFavoriteMutation({
        variables: {
          input: {
            userId: parseInt(userId),
            listingId: parseInt(listingId),
          },
        },
      });
      return { success: true };
    } catch (err) {
      console.error('Error removing favorite:', err);
      return { success: false, error: err.message };
    }
  };

  return { removeFavorite, loading, error };
}
