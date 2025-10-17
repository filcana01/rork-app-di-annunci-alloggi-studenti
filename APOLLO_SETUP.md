# Apollo Client Setup for HousingAPI Integration

This document explains how to use Apollo Client to connect your React Native frontend with the ASP.NET Core GraphQL backend.

## Configuration

### 1. Environment Variables

Create a `.env` file in the root of your project and add your GraphQL API URL:

```env
EXPO_PUBLIC_GRAPHQL_API_URL=https://your-backend-url.com/graphql
```

For local development:
```env
EXPO_PUBLIC_GRAPHQL_API_URL=http://localhost:5000/graphql
```

### 2. Apollo Client Configuration

The Apollo Client is configured in `lib/apollo.js` with:
- Automatic authentication header injection via `authLink`
- In-memory caching
- Network-first fetch policy for fresh data
- Error handling for all operations

## Usage Examples

### Using Hooks in Components

#### 1. Fetch Listings

```javascript
import { useListings } from '@/hooks/use-graphql-listings';

function ListingsScreen() {
  const { listings, loading, error, refetch } = useListings(
    { categoryId: 1, minPrice: 100, maxPrice: 1000 },
    { pageNumber: 1, pageSize: 20 }
  );

  if (loading) return <ActivityIndicator />;
  if (error) return <Text>Error: {error.message}</Text>;

  return (
    <FlatList
      data={listings}
      renderItem={({ item }) => <ListingCard listing={item} />}
      keyExtractor={(item) => item.id.toString()}
      onRefresh={refetch}
      refreshing={loading}
    />
  );
}
```

#### 2. Create a Listing

```javascript
import { useCreateListing } from '@/hooks/use-graphql-listings';
import { useState } from 'react';

function CreateListingScreen() {
  const { createListing, loading, error } = useCreateListing();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: 0,
    location: '',
    categoryId: 1,
    userId: 1,
  });

  const handleSubmit = async () => {
    const result = await createListing(formData);
    
    if (result.success) {
      console.log('Listing created:', result.listing);
      // Navigate to listing detail or show success message
    } else {
      console.error('Failed to create listing:', result.error);
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Title"
        value={formData.title}
        onChangeText={(text) => setFormData({ ...formData, title: text })}
      />
      {/* More form fields */}
      <Button
        title={loading ? "Creating..." : "Create Listing"}
        onPress={handleSubmit}
        disabled={loading}
      />
      {error && <Text style={{ color: 'red' }}>{error.message}</Text>}
    </View>
  );
}
```

#### 3. Manage Favorites

```javascript
import { useFavorites, useAddFavorite, useRemoveFavorite } from '@/hooks/use-graphql-favorites';

function FavoritesScreen({ userId }) {
  const { favorites, loading, refetch } = useFavorites(userId);
  const { addFavorite } = useAddFavorite();
  const { removeFavorite } = useRemoveFavorite();

  const handleToggleFavorite = async (listingId) => {
    const isFavorite = favorites.some(f => f.listing.id === listingId);
    
    if (isFavorite) {
      await removeFavorite(userId, listingId);
    } else {
      await addFavorite(userId, listingId);
    }
    
    refetch();
  };

  return (
    <FlatList
      data={favorites}
      renderItem={({ item }) => (
        <ListingCard
          listing={item.listing}
          onFavoritePress={() => handleToggleFavorite(item.listing.id)}
          isFavorite={true}
        />
      )}
    />
  );
}
```

#### 4. Messages and Conversations

```javascript
import { useConversations, useSendMessage } from '@/hooks/use-graphql-messages';

function MessagesScreen({ userId }) {
  const { conversations, loading } = useConversations(userId);
  const { sendMessage } = useSendMessage();

  const handleSendMessage = async (receiverId, content, listingId) => {
    const result = await sendMessage({
      content,
      senderId: userId,
      receiverId,
      listingId,
    });

    if (result.success) {
      console.log('Message sent:', result.message);
    }
  };

  return (
    <FlatList
      data={conversations}
      renderItem={({ item }) => (
        <ConversationItem
          conversation={item}
          onPress={() => {/* Navigate to chat */}}
        />
      )}
    />
  );
}
```

### Direct Apollo Client Usage

For more complex scenarios, you can use Apollo Client directly:

```javascript
import { useQuery, useMutation } from '@apollo/client';
import { GET_LISTINGS } from '@/graphql/queries';
import { CREATE_LISTING } from '@/graphql/mutations';

function CustomComponent() {
  // Query
  const { data, loading, error } = useQuery(GET_LISTINGS, {
    variables: {
      filter: { categoryId: 1 },
      pagination: { pageNumber: 1, pageSize: 10 }
    },
    onCompleted: (data) => {
      console.log('Query completed:', data);
    },
    onError: (error) => {
      console.error('Query error:', error);
    }
  });

  // Mutation
  const [createListing, { loading: mutationLoading }] = useMutation(CREATE_LISTING, {
    onCompleted: (data) => {
      console.log('Listing created:', data.createListing);
    },
    refetchQueries: [{ query: GET_LISTINGS }],
  });

  const handleCreate = () => {
    createListing({
      variables: {
        input: {
          title: 'New Listing',
          description: 'Description',
          price: 100.0,
          location: 'Location',
          categoryId: 1,
          userId: 1,
        }
      }
    });
  };

  return (
    <View>
      {/* Your UI */}
    </View>
  );
}
```

## Available Hooks

### Listings
- `useListings(filter, pagination)` - Fetch all listings with optional filters
- `useListingById(id)` - Fetch single listing by ID
- `useCreateListing()` - Create new listing
- `useUpdateListing()` - Update existing listing
- `useDeleteListing()` - Delete listing

### Favorites
- `useFavorites(userId)` - Fetch user's favorites
- `useAddFavorite()` - Add listing to favorites
- `useRemoveFavorite()` - Remove listing from favorites

### Messages
- `useMessages(filter)` - Fetch messages with filters
- `useConversations(userId)` - Fetch user's conversations
- `useSendMessage()` - Send a new message
- `useDeleteMessage()` - Delete a message

## GraphQL Files Structure

```
graphql/
  ├── queries.js       # All GraphQL queries
  └── mutations.js     # All GraphQL mutations

hooks/
  ├── use-graphql-listings.js    # Listing-related hooks
  ├── use-graphql-favorites.js   # Favorites-related hooks
  └── use-graphql-messages.js    # Messages-related hooks
```

## Authentication

To add authentication, modify `lib/apollo.js`:

```javascript
const authLink = setContext(async (_, { headers }) => {
  const token = await AsyncStorage.getItem('authToken');
  
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    }
  };
});
```

## Error Handling

All custom hooks return an error object that you can use for error handling:

```javascript
const { listings, loading, error } = useListings();

if (error) {
  if (error.networkError) {
    // Network error - show offline message
  } else if (error.graphQLErrors) {
    // GraphQL errors - show specific error messages
    error.graphQLErrors.forEach(err => {
      console.error(err.message);
    });
  }
}
```

## Cache Management

Apollo Client automatically caches your queries. To manually update the cache:

```javascript
import { apolloClient } from '@/lib/apollo';
import { GET_LISTINGS } from '@/graphql/queries';

// Refetch specific query
apolloClient.refetchQueries({
  include: [GET_LISTINGS],
});

// Clear entire cache
apolloClient.clearStore();

// Reset cache (also refetches active queries)
apolloClient.resetStore();
```

## Optimistic UI Updates

For better UX, implement optimistic updates:

```javascript
const { addFavorite } = useAddFavorite();

const handleAddFavorite = async (userId, listingId) => {
  await addFavorite(userId, listingId, {
    optimisticResponse: {
      addFavorite: {
        __typename: 'Favorite',
        id: 'temp-id',
        userId,
        listingId,
        createdAt: new Date().toISOString(),
      }
    }
  });
};
```

## Testing Your Setup

1. Make sure your ASP.NET Core backend is running
2. Verify the GraphQL endpoint is accessible (usually at `/graphql`)
3. Set the correct `EXPO_PUBLIC_GRAPHQL_API_URL` in your `.env` file
4. Test a simple query in your app to confirm the connection

## Troubleshooting

### Connection Issues
- Verify backend URL is correct and accessible
- Check CORS settings in your ASP.NET Core backend
- For localhost on physical device, use your computer's IP address instead of `localhost`

### Query/Mutation Errors
- Ensure your GraphQL schema matches the queries/mutations
- Check that input types and field names are correct
- Verify required fields are being provided

### Cache Issues
- Use `fetchPolicy: 'network-only'` to bypass cache temporarily
- Clear cache with `apolloClient.clearStore()` if data seems stale
