# Integrazione GraphQL con React Native

## Installazione dei pacchetti necessari

Nel tuo progetto React Native, installa i pacchetti per GraphQL:

```bash
npm install @apollo/client graphql
# oppure
bun add @apollo/client graphql
```

## Configurazione Apollo Client

Crea un file `graphql/client.ts`:

```typescript
import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import AsyncStorage from '@react-native-async-storage/async-storage';

const httpLink = createHttpLink({
  uri: 'https://your-backend-url.com/graphql', // Sostituisci con il tuo URL
});

const authLink = setContext(async (_, { headers }) => {
  const token = await AsyncStorage.getItem('authToken');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  };
});

export const apolloClient = new ApolloClient({
  link: from([authLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
    },
    query: {
      errorPolicy: 'all',
    },
  },
});
```

## Query e Mutations

Crea un file `graphql/queries.ts`:

```typescript
import { gql } from '@apollo/client';

// Authentication
export const LOGIN_MUTATION = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
      user {
        id
        firstName
        lastName
        email
        userType
        isVerified
      }
    }
  }
`;

// Listings
export const GET_LISTINGS = gql`
  query GetListings {
    listings {
      id
      title
      description
      monthlyRent
      city
      address
      hasTerrace
      hasGarden
      petsAllowed
      images {
        id
        imageUrl
        isPrimary
      }
      user {
        id
        firstName
        lastName
        phoneNumber
      }
      category {
        id
        name
      }
    }
  }
`;

export const SEARCH_LISTINGS = gql`
  query SearchListings(
    $searchTerm: String
    $minPrice: Decimal
    $maxPrice: Decimal
    $city: String
    $categoryId: Int
    $petsAllowed: Boolean
    $hasTerrace: Boolean
    $hasGarden: Boolean
    $furnishingStatus: FurnishingStatus
  ) {
    searchListings(
      searchTerm: $searchTerm
      minPrice: $minPrice
      maxPrice: $maxPrice
      city: $city
      categoryId: $categoryId
      petsAllowed: $petsAllowed
      hasTerrace: $hasTerrace
      hasGarden: $hasGarden
      furnishingStatus: $furnishingStatus
    ) {
      id
      title
      description
      monthlyRent
      city
      address
      hasTerrace
      hasGarden
      petsAllowed
      furnishingStatus
      images {
        imageUrl
        isPrimary
      }
      user {
        firstName
        lastName
      }
    }
  }
`;

export const GET_LISTING_DETAIL = gql`
  query GetListing($id: Int!) {
    listing(id: $id) {
      id
      title
      description
      address
      postalCode
      city
      country
      monthlyRent
      expensesIncluded
      monthlyExpenses
      annualAdjustment
      surfaceArea
      numberOfRooms
      floor
      numberOfBathrooms
      furnishingStatus
      hasTerrace
      hasGarden
      petsAllowed
      availabilityDate
      isAvailableImmediately
      minContractDuration
      rules
      accessibility
      securityDeposit
      acceptsSwissCaution
      images {
        id
        imageUrl
        isPrimary
        orderIndex
      }
      user {
        id
        firstName
        lastName
        email
        phoneNumber
        companyName
        userType
      }
      category {
        id
        name
        nameEn
      }
    }
  }
`;

export const CREATE_LISTING = gql`
  mutation CreateListing(
    $userId: Int!
    $categoryId: Int!
    $title: String!
    $description: String!
    $address: String!
    $postalCode: String!
    $city: String!
    $country: String!
    $monthlyRent: Decimal!
    $availabilityDate: DateTime!
    $latitude: Decimal
    $longitude: Decimal
    $surfaceArea: Int
    $numberOfRooms: Int
    $floor: Int
    $numberOfBathrooms: Int
    $furnishingStatus: FurnishingStatus
    $expensesIncluded: Boolean
    $monthlyExpenses: Decimal
    $annualAdjustment: Boolean
    $hasTerrace: Boolean
    $hasGarden: Boolean
    $petsAllowed: Boolean
    $isAvailableImmediately: Boolean
    $minContractDuration: Int
    $rules: String
    $accessibility: String
    $securityDeposit: Decimal
    $acceptsSwissCaution: Boolean
    $status: ListingStatus
  ) {
    createListing(
      userId: $userId
      categoryId: $categoryId
      title: $title
      description: $description
      address: $address
      postalCode: $postalCode
      city: $city
      country: $country
      monthlyRent: $monthlyRent
      availabilityDate: $availabilityDate
      latitude: $latitude
      longitude: $longitude
      surfaceArea: $surfaceArea
      numberOfRooms: $numberOfRooms
      floor: $floor
      numberOfBathrooms: $numberOfBathrooms
      furnishingStatus: $furnishingStatus
      expensesIncluded: $expensesIncluded
      monthlyExpenses: $monthlyExpenses
      annualAdjustment: $annualAdjustment
      hasTerrace: $hasTerrace
      hasGarden: $hasGarden
      petsAllowed: $petsAllowed
      isAvailableImmediately: $isAvailableImmediately
      minContractDuration: $minContractDuration
      rules: $rules
      accessibility: $accessibility
      securityDeposit: $securityDeposit
      acceptsSwissCaution: $acceptsSwissCaution
      status: $status
    ) {
      id
      title
      status
      createdAt
    }
  }
`;

// Favorites
export const GET_USER_FAVORITES = gql`
  query GetUserFavorites($userId: Int!) {
    favoritesByUser(userId: $userId) {
      id
      createdAt
      listing {
        id
        title
        monthlyRent
        city
        images {
          imageUrl
          isPrimary
        }
      }
    }
  }
`;

export const ADD_TO_FAVORITES = gql`
  mutation AddToFavorites($userId: Int!, $listingId: Int!) {
    addToFavorites(userId: $userId, listingId: $listingId) {
      id
      createdAt
    }
  }
`;

export const REMOVE_FROM_FAVORITES = gql`
  mutation RemoveFromFavorites($userId: Int!, $listingId: Int!) {
    removeFromFavorites(userId: $userId, listingId: $listingId)
  }
`;

// Messages
export const GET_USER_MESSAGES = gql`
  query GetUserMessages($userId: Int!) {
    messagesByUser(userId: $userId) {
      id
      subject
      content
      isRead
      createdAt
      sender {
        id
        firstName
        lastName
      }
      receiver {
        id
        firstName
        lastName
      }
      listing {
        id
        title
      }
    }
  }
`;

export const CREATE_MESSAGE = gql`
  mutation CreateMessage(
    $senderId: Int!
    $receiverId: Int!
    $subject: String!
    $content: String!
    $listingId: Int
  ) {
    createMessage(
      senderId: $senderId
      receiverId: $receiverId
      subject: $subject
      content: $content
      listingId: $listingId
    ) {
      id
      subject
      content
      createdAt
    }
  }
`;

// Categories
export const GET_CATEGORIES = gql`
  query GetCategories {
    categories {
      id
      name
      nameEn
    }
  }
`;
```

## Utilizzo nei componenti React Native

Esempio di utilizzo in un componente:

```typescript
import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { useQuery } from '@apollo/client';
import { GET_LISTINGS } from '../graphql/queries';

export const ListingsScreen = () => {
  const { data, loading, error, refetch } = useQuery(GET_LISTINGS);

  if (loading) return <Text>Caricamento...</Text>;
  if (error) return <Text>Errore: {error.message}</Text>;

  return (
    <View>
      <FlatList
        data={data?.listings}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View>
            <Text>{item.title}</Text>
            <Text>{item.monthlyRent} CHF/mese</Text>
            <Text>{item.city}</Text>
          </View>
        )}
        onRefresh={refetch}
        refreshing={loading}
      />
    </View>
  );
};
```

## Provider Apollo

Nel tuo `app/_layout.tsx`, avvolgi l'app con ApolloProvider:

```typescript
import { ApolloProvider } from '@apollo/client';
import { apolloClient } from '../graphql/client';

export default function RootLayout() {
  return (
    <ApolloProvider client={apolloClient}>
      {/* Il resto della tua app */}
    </ApolloProvider>
  );
}
```

## Hook personalizzati

Crea hook personalizzati per semplificare l'uso:

```typescript
// hooks/useAuth.ts
import { useMutation } from '@apollo/client';
import { LOGIN_MUTATION } from '../graphql/queries';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useAuth = () => {
  const [loginMutation] = useMutation(LOGIN_MUTATION);

  const login = async (username: string, password: string) => {
    try {
      const { data } = await loginMutation({
        variables: { username, password }
      });
      
      if (data?.login?.token) {
        await AsyncStorage.setItem('authToken', data.login.token);
        return data.login;
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('authToken');
  };

  return { login, logout };
};
```

Questo setup ti permetterà di utilizzare GraphQL in modo efficiente nella tua applicazione React Native, con un singolo endpoint per tutte le operazioni CRUD.