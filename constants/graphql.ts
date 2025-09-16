import { GraphQLClient } from 'graphql-request';

// GraphQL endpoint - remove /graphiql/ for actual queries
export const GRAPHQL_ENDPOINT = 'https://insidedev.usi.ch/microservices/housing/graphql';

// Create GraphQL client
export const graphqlClient = new GraphQLClient(GRAPHQL_ENDPOINT, {
  headers: {
    'Content-Type': 'application/json',
  },
});

// GraphQL Queries
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
      createdAt
      updatedAt
      images {
        id
        imageUrl
        isPrimary
        orderIndex
      }
      category {
        id
        nameIt
        nameEn
      }
      user {
        id
        firstName
        lastName
        email
        phoneNumber
        companyName
        isIndividual
        isAgency
        isVerified
      }
    }
  }
`;

export const GET_CATEGORIES_QUERY = `
  query GetCategories {
    categories {
      id
      nameIt
      nameEn
    }
  }
`;

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
      createdAt
      updatedAt
      images {
        id
        imageUrl
        isPrimary
        orderIndex
      }
      category {
        id
        nameIt
        nameEn
      }
      user {
        id
        firstName
        lastName
        email
        phoneNumber
        companyName
        isIndividual
        isAgency
        isVerified
      }
    }
  }
`;