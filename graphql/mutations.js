import { gql } from '@apollo/client';

export const CREATE_USER = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      name
      email
      phoneNumber
      createdAt
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser($input: UpdateUserInput!) {
    updateUser(input: $input) {
      id
      name
      email
      phoneNumber
      updatedAt
    }
  }
`;

export const DELETE_USER = gql`
  mutation DeleteUser($input: DeleteInput!) {
    deleteUser(input: $input)
  }
`;

export const CREATE_LISTING = gql`
  mutation CreateListing($input: CreateListingInput!) {
    createListing(input: $input) {
      id
      title
      description
      price
      location
      categoryId
      userId
      createdAt
    }
  }
`;

export const UPDATE_LISTING = gql`
  mutation UpdateListing($input: UpdateListingInput!) {
    updateListing(input: $input) {
      id
      title
      description
      price
      location
      updatedAt
    }
  }
`;

export const DELETE_LISTING = gql`
  mutation DeleteListing($input: DeleteInput!) {
    deleteListing(input: $input)
  }
`;

export const CREATE_CATEGORY = gql`
  mutation CreateCategory($input: CreateCategoryInput!) {
    createCategory(input: $input) {
      id
      name
      description
      createdAt
    }
  }
`;

export const DELETE_CATEGORY = gql`
  mutation DeleteCategory($input: DeleteInput!) {
    deleteCategory(input: $input)
  }
`;

export const ADD_FAVORITE = gql`
  mutation AddFavorite($input: FavoriteInput!) {
    addFavorite(input: $input) {
      id
      userId
      listingId
      createdAt
    }
  }
`;

export const REMOVE_FAVORITE = gql`
  mutation RemoveFavorite($input: FavoriteInput!) {
    removeFavorite(input: $input)
  }
`;

export const CREATE_MESSAGE = gql`
  mutation CreateMessage($input: CreateMessageInput!) {
    createMessage(input: $input) {
      id
      content
      senderId
      receiverId
      listingId
      createdAt
    }
  }
`;

export const DELETE_MESSAGE = gql`
  mutation DeleteMessage($input: DeleteInput!) {
    deleteMessage(input: $input)
  }
`;

export const CREATE_LISTING_IMAGE = gql`
  mutation CreateListingImage($input: CreateListingImageInput!) {
    createListingImage(input: $input) {
      id
      listingId
      url
      createdAt
    }
  }
`;

export const DELETE_LISTING_IMAGE = gql`
  mutation DeleteListingImage($input: DeleteInput!) {
    deleteListingImage(input: $input)
  }
`;

export const CREATE_SAVED_SEARCH = gql`
  mutation CreateSavedSearch($input: CreateSavedSearchInput!) {
    createSavedSearch(input: $input) {
      id
      userId
      searchName
      filters
      createdAt
    }
  }
`;

export const DELETE_SAVED_SEARCH = gql`
  mutation DeleteSavedSearch($input: DeleteInput!) {
    deleteSavedSearch(input: $input)
  }
`;
