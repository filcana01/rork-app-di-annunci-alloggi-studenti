using GraphQL;
using GraphQL.Types;
using HousingAPI.Business.Model;
using HousingAPI.Business.Service;
using HousingAPI.GraphQLModels.Mutations.Inputs;
using HousingAPI.GraphQLModels.Mutations.InputTypes;
using HousingAPI.GraphQLModels.Type;

namespace HousingAPI.GraphQLModels.Mutations
{
    public class Mutation : ObjectGraphType
    {
        public Mutation(IHousingService housingService)
        {
            Name = "Mutation";
            Description = "The mutation type, represents all updates we can make to our data";

            // User Mutations
            Field<UserType>("createUser")
                .Description("Create a new user")
                .Arguments(new QueryArguments(
                    new QueryArgument<NonNullGraphType<CreateUserInputGraphType>> { Name = "input" }
                ))
                .ResolveAsync(async context =>
                {
                    var input = context.GetArgument<CreateUserInput>("input");
                    return await housingService.CreateUser(input);
                });

            Field<UserType>("updateUser")
                .Description("Update an existing user")
                .Arguments(new QueryArguments(
                    new QueryArgument<NonNullGraphType<UpdateUserInputGraphType>> { Name = "input" }
                ))
                .ResolveAsync(async context =>
                {
                    var input = context.GetArgument<UpdateUserInput>("input");
                    return await housingService.UpdateUser(input);
                });

            Field<BooleanGraphType>("deleteUser")
                .Description("Delete a user")
                .Arguments(new QueryArguments(
                    new QueryArgument<NonNullGraphType<DeleteInputGraphType>> { Name = "input" }
                ))
                .ResolveAsync(async context =>
                {
                    var input = context.GetArgument<DeleteInput>("input");
                    return await housingService.DeleteUser(input.Id);
                });

            // Listing Mutations
            Field<ListingType>("createListing")
                .Description("Create a new listing")
                .Arguments(new QueryArguments(
                    new QueryArgument<NonNullGraphType<CreateListingInputGraphType>> { Name = "input" }
                ))
                .ResolveAsync(async context =>
                {
                    var input = context.GetArgument<CreateListingInput>("input");
                    return await housingService.CreateListing(input);
                });

            Field<ListingType>("updateListing")
                .Description("Update an existing listing")
                .Arguments(new QueryArguments(
                    new QueryArgument<NonNullGraphType<UpdateListingInputGraphType>> { Name = "input" }
                ))
                .ResolveAsync(async context =>
                {
                    var input = context.GetArgument<UpdateListingInput>("input");
                    return await housingService.UpdateListing(input);
                });

            Field<BooleanGraphType>("deleteListing")
                .Description("Delete a listing")
                .Arguments(new QueryArguments(
                    new QueryArgument<NonNullGraphType<DeleteInputGraphType>> { Name = "input" }
                ))
                .ResolveAsync(async context =>
                {
                    var input = context.GetArgument<DeleteInput>("input");
                    return await housingService.DeleteListing(input.Id);
                });

            Field<BooleanGraphType>("archiveListing")
                .Description("Archive a listing (soft delete)")
                .Arguments(new QueryArguments(
                    new QueryArgument<NonNullGraphType<DeleteInputGraphType>> { Name = "input" }
                ))
                .ResolveAsync(async context =>
                {
                    var input = context.GetArgument<DeleteInput>("input");
                    return await housingService.ArchiveListing(input.Id);
                });

            // Category Mutations
            Field<CategoryType>("createCategory")
                .Description("Create a new category")
                .Arguments(new QueryArguments(
                    new QueryArgument<NonNullGraphType<CreateCategoryInputGraphType>> { Name = "input" }
                ))
                .ResolveAsync(async context =>
                {
                    var input = context.GetArgument<CreateCategoryInput>("input");
                    return await housingService.CreateCategory(input);
                });

            Field<BooleanGraphType>("deleteCategory")
                .Description("Delete a category")
                .Arguments(new QueryArguments(
                    new QueryArgument<NonNullGraphType<DeleteInputGraphType>> { Name = "input" }
                ))
                .ResolveAsync(async context =>
                {
                    var input = context.GetArgument<DeleteInput>("input");
                    return await housingService.DeleteCategory(input.Id);
                });

            // Message Mutations
            Field<MessageType>("createMessage")
                .Description("Send a new message")
                .Arguments(new QueryArguments(
                    new QueryArgument<NonNullGraphType<CreateMessageInputGraphType>> { Name = "input" }
                ))
                .ResolveAsync(async context =>
                {
                    var input = context.GetArgument<CreateMessageInput>("input");
                    return await housingService.CreateMessage(input);
                });

            Field<BooleanGraphType>("markMessageAsRead")
                .Description("Mark a message as read")
                .Arguments(new QueryArguments(
                    new QueryArgument<NonNullGraphType<DeleteInputGraphType>> { Name = "input" }
                ))
                .ResolveAsync(async context =>
                {
                    var input = context.GetArgument<DeleteInput>("input");
                    return await housingService.MarkMessageAsRead(input.Id);
                });

            Field<BooleanGraphType>("deleteMessage")
                .Description("Delete a message")
                .Arguments(new QueryArguments(
                    new QueryArgument<NonNullGraphType<DeleteInputGraphType>> { Name = "input" }
                ))
                .ResolveAsync(async context =>
                {
                    var input = context.GetArgument<DeleteInput>("input");
                    return await housingService.DeleteMessage(input.Id);
                });

            // Listing Image Mutations
            Field<ListingImageType>("addListingImage")
                .Description("Add an image to a listing")
                .Arguments(new QueryArguments(
                    new QueryArgument<NonNullGraphType<CreateListingImageInputGraphType>> { Name = "input" }
                ))
                .ResolveAsync(async context =>
                {
                    var input = context.GetArgument<CreateListingImageInput>("input");
                    return await housingService.AddListingImage(input);
                });

            Field<BooleanGraphType>("deleteListingImage")
                .Description("Delete a listing image")
                .Arguments(new QueryArguments(
                    new QueryArgument<NonNullGraphType<DeleteInputGraphType>> { Name = "input" }
                ))
                .ResolveAsync(async context =>
                {
                    var input = context.GetArgument<DeleteInput>("input");
                    return await housingService.DeleteListingImage(input.Id);
                });

            Field<BooleanGraphType>("setPrimaryListingImage")
                .Description("Set an image as primary for a listing")
                .Arguments(new QueryArguments(
                    new QueryArgument<NonNullGraphType<DeleteInputGraphType>> { Name = "input" }
                ))
                .ResolveAsync(async context =>
                {
                    var input = context.GetArgument<DeleteInput>("input");
                    return await housingService.SetPrimaryListingImage(input.Id);
                });

            // Favorite Mutations
            Field<FavoriteType>("addFavorite")
                .Description("Add a listing to favorites")
                .Arguments(new QueryArguments(
                    new QueryArgument<NonNullGraphType<FavoriteInputGraphType>> { Name = "input" }
                ))
                .ResolveAsync(async context =>
                {
                    var input = context.GetArgument<FavoriteInput>("input");
                    return await housingService.AddFavorite(input);
                });

            Field<BooleanGraphType>("removeFavorite")
                .Description("Remove a listing from favorites")
                .Arguments(new QueryArguments(
                    new QueryArgument<NonNullGraphType<FavoriteInputGraphType>> { Name = "input" }
                ))
                .ResolveAsync(async context =>
                {
                    var input = context.GetArgument<FavoriteInput>("input");
                    return await housingService.RemoveFavorite(input);
                });

            // Saved Search Mutations
            Field<SavedSearchType>("createSavedSearch")
                .Description("Create a new saved search")
                .Arguments(new QueryArguments(
                    new QueryArgument<NonNullGraphType<CreateSavedSearchInputGraphType>> { Name = "input" }
                ))
                .ResolveAsync(async context =>
                {
                    var input = context.GetArgument<CreateSavedSearchInput>("input");
                    return await housingService.CreateSavedSearch(input);
                });

            Field<BooleanGraphType>("deleteSavedSearch")
                .Description("Delete a saved search")
                .Arguments(new QueryArguments(
                    new QueryArgument<NonNullGraphType<DeleteInputGraphType>> { Name = "input" }
                ))
                .ResolveAsync(async context =>
                {
                    var input = context.GetArgument<DeleteInput>("input");
                    return await housingService.DeleteSavedSearch(input.Id);
                });

            Field<BooleanGraphType>("toggleSavedSearchNotifications")
                .Description("Toggle notifications for a saved search")
                .Arguments(new QueryArguments(
                    new QueryArgument<NonNullGraphType<DeleteInputGraphType>> { Name = "input" }
                ))
                .ResolveAsync(async context =>
                {
                    var input = context.GetArgument<DeleteInput>("input");
                    return await housingService.ToggleSavedSearchNotifications(input.Id);
                });
        }
    }
}