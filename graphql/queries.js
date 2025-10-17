import { gql } from '@apollo/client';

export const GET_LISTINGS = gql`
  query GetListings($filter: ListingFilterInput, $pagination: PaginationInput) {
    listings(filter: $filter, pagination: $pagination) {
      id
      title
      description
      price
      location
      category {
        id
        name
      }
      user {
        id
        name
        email
      }
      images {
        id
        url
      }
      createdAt
      updatedAt
    }
  }
`;

export const GET_LISTING_BY_ID = gql`
  query GetListingById($id: Int!) {
    listing(id: $id) {
      id
      title
      description
      price
      location
      category {
        id
        name
      }
      user {
        id
        name
        email
        phoneNumber
      }
      images {
        id
        url
      }
      createdAt
      updatedAt
    }
  }
`;

export const GET_USER_LISTINGS = gql`
  query GetUserListings($userId: Int!, $pagination: PaginationInput) {
    userListings(userId: $userId, pagination: $pagination) {
      id
      title
      description
      price
      location
      images {
        id
        url
      }
      createdAt
    }
  }
`;

export const GET_FAVORITES = gql`
  query GetFavorites($userId: Int!) {
    favorites(userId: $userId) {
      id
      listing {
        id
        title
        description
        price
        location
        images {
          id
          url
        }
      }
      createdAt
    }
  }
`;

export const GET_CATEGORIES = gql`
  query GetCategories {
    categories {
      id
      name
      description
    }
  }
`;

export const GET_MESSAGES = gql`
  query GetMessages($filter: MessageFilterInput) {
    messages(filter: $filter) {
      id
      content
      senderId
      receiverId
      listingId
      createdAt
      sender {
        id
        name
      }
      receiver {
        id
        name
      }
    }
  }
`;

export const GET_CONVERSATIONS = gql`
  query GetConversations($input: ConversationInput!) {
    conversations(input: $input) {
      userId
      userName
      lastMessage
      lastMessageDate
      listingId
      listingTitle
    }
  }
`;

export const SEARCH_LISTINGS = gql`
  query SearchListings($input: SearchInput!) {
    searchListings(input: $input) {
      id
      title
      description
      price
      location
      images {
        id
        url
      }
      category {
        id
        name
      }
    }
  }
`;

export const GET_SAVED_SEARCHES = gql`
  query GetSavedSearches($userId: Int!) {
    savedSearches(userId: $userId) {
      id
      userId
      searchName
      filters
      createdAt
    }
  }
`;
