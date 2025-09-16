import { GraphQLClient } from 'graphql-request';
import { GRAPHQL_CONFIG } from './graphql-config';

// Crea il client GraphQL usando la configurazione
export const graphqlClient = new GraphQLClient(GRAPHQL_CONFIG.endpoint, {
  headers: GRAPHQL_CONFIG.headers,
  timeout: GRAPHQL_CONFIG.timeout,
});

// Query per ottenere tutti i listings
export const GET_LISTINGS_QUERY = `
  query GetListings {
    listings {
      id
      userId
      categoryId
      title
      description
      address
      postalCode
      city
      country
      latitude
      longitude
      surfaceArea
      numberOfRooms
      floor
      numberOfBathrooms
      furnishingStatus
      monthlyRent
      expensesIncluded
      monthlyExpenses
      annualAdjustment
      hasTerrace
      hasGarden
      hasPool
      petsAllowed
      availabilityDate
      isAvailableImmediately
      minContractDuration
      rules
      hasElevator
      hasRampAccess
      securityDeposit
      acceptsSwissCaution
      status
      verifiedAt
      createdAt
      updatedAt
      category {
        id
        nameIt
        nameEn
      }
      user {
        id
        firstName
        lastName
        companyName
        email
        phoneNumber
        isIndividual
        isAgency
        isVerified
      }
      images {
        id
        imageUrl
        isPrimary
        orderIndex
      }
    }
  }
`;

// Query per ottenere un singolo listing
export const GET_LISTING_BY_ID_QUERY = `
  query GetListingById($id: Int!) {
    listing(id: $id) {
      id
      userId
      categoryId
      title
      description
      address
      postalCode
      city
      country
      latitude
      longitude
      surfaceArea
      numberOfRooms
      floor
      numberOfBathrooms
      furnishingStatus
      monthlyRent
      expensesIncluded
      monthlyExpenses
      annualAdjustment
      hasTerrace
      hasGarden
      hasPool
      petsAllowed
      availabilityDate
      isAvailableImmediately
      minContractDuration
      rules
      hasElevator
      hasRampAccess
      securityDeposit
      acceptsSwissCaution
      status
      verifiedAt
      createdAt
      updatedAt
      category {
        id
        nameIt
        nameEn
      }
      user {
        id
        firstName
        lastName
        companyName
        email
        phoneNumber
        isIndividual
        isAgency
        isVerified
      }
      images {
        id
        imageUrl
        isPrimary
        orderIndex
      }
    }
  }
`;

// Query per ottenere le categorie
export const GET_CATEGORIES_QUERY = `
  query GetCategories {
    categories {
      id
      nameIt
      nameEn
      createdAt
    }
  }
`;