import { gql } from '@apollo/client';

// Fragment per riutilizzare parti comuni
export const LISTING_FRAGMENT = gql`
  fragment ListingFragment on Listing {
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
    petsAllowed
    availabilityDate
    isAvailableImmediately
    minContractDuration
    rules
    accessibility
    securityDeposit
    acceptsSwissCaution
    status
    isVerified
    createdAt
    updatedAt
  }
`;

export const USER_FRAGMENT = gql`
  fragment UserFragment on User {
    switchEduID
    firstName
    lastName
    companyName
    email
    phoneNumber
    address
    userType
    isVerified
    createdAt
  }
`;

export const LISTING_IMAGE_FRAGMENT = gql`
  fragment ListingImageFragment on ListingImage {
    id
    listingId
    imageUrl
    isPrimary
    orderIndex
    createdAt
  }
`;

// Query per ottenere tutti gli annunci con filtri
export const GET_LISTINGS = gql`
  ${LISTING_FRAGMENT}
  ${USER_FRAGMENT}
  ${LISTING_IMAGE_FRAGMENT}
  query GetListings(
    $filters: SearchFiltersInput
    $skip: Int
    $take: Int
    $orderBy: [ListingSortInput!]
  ) {
    listings(
      where: $filters
      skip: $skip
      take: $take
      order: $orderBy
    ) {
      ...ListingFragment
      user {
        ...UserFragment
      }
      category {
        id
        name
        nameEn
      }
      images {
        ...ListingImageFragment
      }
    }
  }
`;

// Query per ottenere un singolo annuncio
export const GET_LISTING_BY_ID = gql`
  ${LISTING_FRAGMENT}
  ${USER_FRAGMENT}
  ${LISTING_IMAGE_FRAGMENT}
  query GetListingById($id: Int!) {
    listing(where: { id: { eq: $id } }) {
      ...ListingFragment
      user {
        ...UserFragment
      }
      category {
        id
        name
        nameEn
      }
      images {
        ...ListingImageFragment
      }
    }
  }
`;

// Query per ottenere le categorie
export const GET_CATEGORIES = gql`
  query GetCategories {
    categories {
      id
      name
      nameEn
      createdAt
    }
  }
`;

// Query per ottenere i preferiti dell'utente
export const GET_USER_FAVORITES = gql`
  ${LISTING_FRAGMENT}
  ${LISTING_IMAGE_FRAGMENT}
  query GetUserFavorites($userId: Int!) {
    favorites(where: { userId: { eq: $userId } }) {
      id
      createdAt
      listing {
        ...ListingFragment
        images {
          ...ListingImageFragment
        }
        category {
          id
          name
          nameEn
        }
      }
    }
  }
`;

// Query per ottenere i messaggi dell'utente
export const GET_USER_MESSAGES = gql`
  ${USER_FRAGMENT}
  query GetUserMessages($userId: Int!) {
    messages(where: { receiverId: { eq: $userId } }) {
      id
      senderId
      receiverId
      listingId
      subject
      content
      isRead
      createdAt
      sender {
        ...UserFragment
      }
      listing {
        id
        title
        city
      }
    }
  }
`;

// Query per ottenere le ricerche salvate
export const GET_SAVED_SEARCHES = gql`
  query GetSavedSearches($userId: Int!) {
    savedSearches(where: { userId: { eq: $userId } }) {
      id
      userId
      searchName
      searchCriteria
      notificationsEnabled
      createdAt
    }
  }
`;

// Mutation per creare un nuovo annuncio
export const CREATE_LISTING = gql`
  ${LISTING_FRAGMENT}
  mutation CreateListing($input: CreateListingInput!) {
    createListing(input: $input) {
      ...ListingFragment
    }
  }
`;

// Mutation per aggiornare un annuncio
export const UPDATE_LISTING = gql`
  ${LISTING_FRAGMENT}
  mutation UpdateListing($input: UpdateListingInput!) {
    updateListing(input: $input) {
      ...ListingFragment
    }
  }
`;

// Mutation per eliminare un annuncio
export const DELETE_LISTING = gql`
  mutation DeleteListing($id: Int!) {
    deleteListing(id: $id)
  }
`;

// Mutation per aggiungere/rimuovere dai preferiti
export const TOGGLE_FAVORITE = gql`
  mutation ToggleFavorite($userId: Int!, $listingId: Int!) {
    toggleFavorite(userId: $userId, listingId: $listingId) {
      id
      userId
      listingId
      createdAt
    }
  }
`;

// Mutation per inviare un messaggio
export const SEND_MESSAGE = gql`
  mutation SendMessage($input: CreateMessageInput!) {
    sendMessage(input: $input) {
      id
      senderId
      receiverId
      listingId
      subject
      content
      isRead
      createdAt
    }
  }
`;

// Mutation per salvare una ricerca
export const SAVE_SEARCH = gql`
  mutation SaveSearch($input: SaveSearchInput!) {
    saveSearch(input: $input) {
      id
      userId
      searchName
      searchCriteria
      notificationsEnabled
      createdAt
    }
  }
`;

// Mutation per caricare immagini
export const UPLOAD_LISTING_IMAGES = gql`
  mutation UploadListingImages($listingId: Int!, $images: [Upload!]!) {
    uploadListingImages(listingId: $listingId, images: $images) {
      id
      listingId
      imageUrl
      isPrimary
      orderIndex
      createdAt
    }
  }
`;