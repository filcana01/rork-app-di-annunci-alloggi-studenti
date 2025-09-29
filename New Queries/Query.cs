using GraphQL;
using GraphQL.Types;
using HousingAPI.Business.Model;
using HousingAPI.Business.Service;
using HousingAPI.GraphQLModels.Type;
using HousingAPI.GraphQLModels.Queries.Inputs;
using HousingAPI.GraphQLModels.Queries.InputTypes;

namespace HousingAPI.GraphQLModels.Queries
{
    public class Query : ObjectGraphType
    {
        public Query()
        {
            Name = "Query";
            
            // Category queries
            Categories();
            Category();
            
            // User queries
            Users();
            User();
            SearchUsers();
            
            // Listing queries
            Listings();
            Listing();
            ListingsByUser();
            ListingsByCategory();
            SearchListings();
            
            // Listing Image queries
            ListingImages();
            
            // Favorite queries
            UserFavorites();
            
            // Message queries
            UserMessages();
            Conversation();
            SearchMessages();
            
            // Saved Search queries
            UserSavedSearches();
            SearchSavedSearches();
        }

        private void Categories()
        {
            Field<ListGraphType<CategoryType>>("Categories")
                .Argument<PaginationInputGraphType>("pagination")
                .ResolveAsync(async context =>
                {
                    try
                    {
                        var pagination = context.GetArgument<PaginationInput>("pagination");
                        IServiceProvider? serviceProvider = context.RequestServices;
                        if (serviceProvider is not null)
                        {
                            return await serviceProvider.GetRequiredService<IHousingService>().GetCurrentCategory();
                        }
                    }
                    catch (Exception e)
                    {
                        context.Errors.Add(new ExecutionError(e.InnerException?.Message ?? e.Message));
                    }
                    return null;
                });
        }

        private void Category()
        {
            Field<CategoryType>("Category")
                .Argument<NonNullGraphType<LongGraphType>>("id")
                .ResolveAsync(async context =>
                {
                    try
                    {
                        var id = context.GetArgument<long>("id");
                        IServiceProvider? serviceProvider = context.RequestServices;
                        if (serviceProvider is not null)
                        {
                            return await serviceProvider.GetRequiredService<IHousingService>().GetCategoryById(id);
                        }
                    }
                    catch (Exception e)
                    {
                        context.Errors.Add(new ExecutionError(e.InnerException?.Message ?? e.Message));
                    }
                    return null;
                });
        }

        private void Users()
        {
            Field<ListGraphType<UserType>>("Users")
                .Argument<UserFilterInputGraphType>("filter")
                .Argument<PaginationInputGraphType>("pagination")
                .ResolveAsync(async context =>
                {
                    try
                    {
                        var filter = context.GetArgument<UserFilterInput>("filter");
                        var pagination = context.GetArgument<PaginationInput>("pagination");
                        IServiceProvider? serviceProvider = context.RequestServices;
                        if (serviceProvider is not null)
                        {
                            return await serviceProvider.GetRequiredService<IHousingService>().GetUsers();
                        }
                    }
                    catch (Exception e)
                    {
                        context.Errors.Add(new ExecutionError(e.InnerException?.Message ?? e.Message));
                    }
                    return null;
                });
        }

        private void User()
        {
            Field<UserType>("User")
                .Argument<NonNullGraphType<LongGraphType>>("id")
                .ResolveAsync(async context =>
                {
                    try
                    {
                        var id = context.GetArgument<long>("id");
                        IServiceProvider? serviceProvider = context.RequestServices;
                        if (serviceProvider is not null)
                        {
                            return await serviceProvider.GetRequiredService<IHousingService>().GetUserById(id);
                        }
                    }
                    catch (Exception e)
                    {
                        context.Errors.Add(new ExecutionError(e.InnerException?.Message ?? e.Message));
                    }
                    return null;
                });
        }

        private void SearchUsers()
        {
            Field<ListGraphType<UserType>>("SearchUsers")
                .Argument<NonNullGraphType<SearchInputGraphType>>("search")
                .Argument<UserFilterInputGraphType>("filter")
                .Argument<PaginationInputGraphType>("pagination")
                .ResolveAsync(async context =>
                {
                    try
                    {
                        var search = context.GetArgument<SearchInput>("search");
                        var filter = context.GetArgument<UserFilterInput>("filter");
                        var pagination = context.GetArgument<PaginationInput>("pagination");
                        IServiceProvider? serviceProvider = context.RequestServices;
                        if (serviceProvider is not null)
                        {
                            return await serviceProvider.GetRequiredService<IHousingService>().SearchUsers(search, filter, pagination);
                        }
                    }
                    catch (Exception e)
                    {
                        context.Errors.Add(new ExecutionError(e.InnerException?.Message ?? e.Message));
                    }
                    return null;
                });
        }

        private void Listings()
        {
            Field<ListGraphType<ListingType>>("Listings")
                .Argument<ListingFilterInputGraphType>("filter")
                .Argument<PaginationInputGraphType>("pagination")
                .ResolveAsync(async context =>
                {
                    try
                    {
                        var filter = context.GetArgument<ListingFilterInput>("filter");
                        var pagination = context.GetArgument<PaginationInput>("pagination");
                        IServiceProvider? serviceProvider = context.RequestServices;
                        if (serviceProvider is not null)
                        {
                            return await serviceProvider.GetRequiredService<IHousingService>().GetListings();
                        }
                    }
                    catch (Exception e)
                    {
                        context.Errors.Add(new ExecutionError(e.InnerException?.Message ?? e.Message));
                    }
                    return null;
                });
        }

        private void Listing()
        {
            Field<ListingType>("Listing")
                .Argument<NonNullGraphType<LongGraphType>>("id")
                .ResolveAsync(async context =>
                {
                    try
                    {
                        var id = context.GetArgument<long>("id");
                        IServiceProvider? serviceProvider = context.RequestServices;
                        if (serviceProvider is not null)
                        {
                            return await serviceProvider.GetRequiredService<IHousingService>().GetListingById(id);
                        }
                    }
                    catch (Exception e)
                    {
                        context.Errors.Add(new ExecutionError(e.InnerException?.Message ?? e.Message));
                    }
                    return null;
                });
        }

        private void ListingsByUser()
        {
            Field<ListGraphType<ListingType>>("ListingsByUser")
                .Argument<NonNullGraphType<LongGraphType>>("userId")
                .Argument<ListingFilterInputGraphType>("filter")
                .Argument<PaginationInputGraphType>("pagination")
                .ResolveAsync(async context =>
                {
                    try
                    {
                        var userId = context.GetArgument<long>("userId");
                        var filter = context.GetArgument<ListingFilterInput>("filter");
                        var pagination = context.GetArgument<PaginationInput>("pagination");
                        IServiceProvider? serviceProvider = context.RequestServices;
                        if (serviceProvider is not null)
                        {
                            return await serviceProvider.GetRequiredService<IHousingService>().GetListingsByUserId(userId);
                        }
                    }
                    catch (Exception e)
                    {
                        context.Errors.Add(new ExecutionError(e.InnerException?.Message ?? e.Message));
                    }
                    return null;
                });
        }

        private void ListingsByCategory()
        {
            Field<ListGraphType<ListingType>>("ListingsByCategory")
                .Argument<NonNullGraphType<LongGraphType>>("categoryId")
                .Argument<ListingFilterInputGraphType>("filter")
                .Argument<PaginationInputGraphType>("pagination")
                .ResolveAsync(async context =>
                {
                    try
                    {
                        var categoryId = context.GetArgument<long>("categoryId");
                        var filter = context.GetArgument<ListingFilterInput>("filter");
                        var pagination = context.GetArgument<PaginationInput>("pagination");
                        IServiceProvider? serviceProvider = context.RequestServices;
                        if (serviceProvider is not null)
                        {
                            return await serviceProvider.GetRequiredService<IHousingService>().GetListingsByCategory(categoryId);
                        }
                    }
                    catch (Exception e)
                    {
                        context.Errors.Add(new ExecutionError(e.InnerException?.Message ?? e.Message));
                    }
                    return null;
                });
        }

        private void SearchListings()
        {
            Field<ListGraphType<ListingType>>("SearchListings")
                .Argument<NonNullGraphType<SearchInputGraphType>>("search")
                .Argument<ListingFilterInputGraphType>("filter")
                .Argument<PaginationInputGraphType>("pagination")
                .ResolveAsync(async context =>
                {
                    try
                    {
                        var search = context.GetArgument<SearchInput>("search");
                        var filter = context.GetArgument<ListingFilterInput>("filter");
                        var pagination = context.GetArgument<PaginationInput>("pagination");
                        IServiceProvider? serviceProvider = context.RequestServices;
                        if (serviceProvider is not null)
                        {
                            return await serviceProvider.GetRequiredService<IHousingService>().SearchListings(search, filter, pagination);
                        }
                    }
                    catch (Exception e)
                    {
                        context.Errors.Add(new ExecutionError(e.InnerException?.Message ?? e.Message));
                    }
                    return null;
                });
        }

        private void ListingImages()
        {
            Field<ListGraphType<ListingImageType>>("ListingImages")
                .Argument<NonNullGraphType<LongGraphType>>("listingId")
                .Argument<PaginationInputGraphType>("pagination")
                .ResolveAsync(async context =>
                {
                    try
                    {
                        var listingId = context.GetArgument<long>("listingId");
                        var pagination = context.GetArgument<PaginationInput>("pagination");
                        IServiceProvider? serviceProvider = context.RequestServices;
                        if (serviceProvider is not null)
                        {
                            return await serviceProvider.GetRequiredService<IHousingService>().GetListingImages(listingId);
                        }
                    }
                    catch (Exception e)
                    {
                        context.Errors.Add(new ExecutionError(e.InnerException?.Message ?? e.Message));
                    }
                    return null;
                });
        }

        private void UserFavorites()
        {
            Field<ListGraphType<FavoriteType>>("UserFavorites")
                .Argument<NonNullGraphType<LongGraphType>>("userId")
                .Argument<PaginationInputGraphType>("pagination")
                .ResolveAsync(async context =>
                {
                    try
                    {
                        var userId = context.GetArgument<long>("userId");
                        var pagination = context.GetArgument<PaginationInput>("pagination");
                        IServiceProvider? serviceProvider = context.RequestServices;
                        if (serviceProvider is not null)
                        {
                            return await serviceProvider.GetRequiredService<IHousingService>().GetUserFavorites(userId);
                        }
                    }
                    catch (Exception e)
                    {
                        context.Errors.Add(new ExecutionError(e.InnerException?.Message ?? e.Message));
                    }
                    return null;
                });
        }

        private void UserMessages()
        {
            Field<ListGraphType<MessageType>>("UserMessages")
                .Argument<NonNullGraphType<LongGraphType>>("userId")
                .Argument<MessageFilterInputGraphType>("filter")
                .Argument<PaginationInputGraphType>("pagination")
                .ResolveAsync(async context =>
                {
                    try
                    {
                        var userId = context.GetArgument<long>("userId");
                        var filter = context.GetArgument<MessageFilterInput>("filter");
                        var pagination = context.GetArgument<PaginationInput>("pagination");
                        IServiceProvider? serviceProvider = context.RequestServices;
                        if (serviceProvider is not null)
                        {
                            return await serviceProvider.GetRequiredService<IHousingService>().GetUserMessages(userId);
                        }
                    }
                    catch (Exception e)
                    {
                        context.Errors.Add(new ExecutionError(e.InnerException?.Message ?? e.Message));
                    }
                    return null;
                });
        }

        private void Conversation()
        {
            Field<ListGraphType<MessageType>>("Conversation")
                .Argument<NonNullGraphType<ConversationInputGraphType>>("input")
                .Argument<PaginationInputGraphType>("pagination")
                .ResolveAsync(async context =>
                {
                    try
                    {
                        var input = context.GetArgument<ConversationInput>("input");
                        var pagination = context.GetArgument<PaginationInput>("pagination");
                        IServiceProvider? serviceProvider = context.RequestServices;
                        if (serviceProvider is not null)
                        {
                            return await serviceProvider.GetRequiredService<IHousingService>().GetConversation(input.SenderId, input.ReceiverId, input.ListingId);
                        }
                    }
                    catch (Exception e)
                    {
                        context.Errors.Add(new ExecutionError(e.InnerException?.Message ?? e.Message));
                    }
                    return null;
                });
        }

        private void SearchMessages()
        {
            Field<ListGraphType<MessageType>>("SearchMessages")
                .Argument<NonNullGraphType<SearchInputGraphType>>("search")
                .Argument<MessageFilterInputGraphType>("filter")
                .Argument<PaginationInputGraphType>("pagination")
                .ResolveAsync(async context =>
                {
                    try
                    {
                        var search = context.GetArgument<SearchInput>("search");
                        var filter = context.GetArgument<MessageFilterInput>("filter");
                        var pagination = context.GetArgument<PaginationInput>("pagination");
                        IServiceProvider? serviceProvider = context.RequestServices;
                        if (serviceProvider is not null)
                        {
                            return await serviceProvider.GetRequiredService<IHousingService>().SearchMessages(search, filter, pagination);
                        }
                    }
                    catch (Exception e)
                    {
                        context.Errors.Add(new ExecutionError(e.InnerException?.Message ?? e.Message));
                    }
                    return null;
                });
        }

        private void UserSavedSearches()
        {
            Field<ListGraphType<SavedSearchType>>("UserSavedSearches")
                .Argument<NonNullGraphType<LongGraphType>>("userId")
                .Argument<SavedSearchFilterInputGraphType>("filter")
                .Argument<PaginationInputGraphType>("pagination")
                .ResolveAsync(async context =>
                {
                    try
                    {
                        var userId = context.GetArgument<long>("userId");
                        var filter = context.GetArgument<SavedSearchFilterInput>("filter");
                        var pagination = context.GetArgument<PaginationInput>("pagination");
                        IServiceProvider? serviceProvider = context.RequestServices;
                        if (serviceProvider is not null)
                        {
                            return await serviceProvider.GetRequiredService<IHousingService>().GetUserSavedSearches(userId);
                        }
                    }
                    catch (Exception e)
                    {
                        context.Errors.Add(new ExecutionError(e.InnerException?.Message ?? e.Message));
                    }
                    return null;
                });
        }

        private void SearchSavedSearches()
        {
            Field<ListGraphType<SavedSearchType>>("SearchSavedSearches")
                .Argument<NonNullGraphType<SearchInputGraphType>>("search")
                .Argument<SavedSearchFilterInputGraphType>("filter")
                .Argument<PaginationInputGraphType>("pagination")
                .ResolveAsync(async context =>
                {
                    try
                    {
                        var search = context.GetArgument<SearchInput>("search");
                        var filter = context.GetArgument<SavedSearchFilterInput>("filter");
                        var pagination = context.GetArgument<PaginationInput>("pagination");
                        IServiceProvider? serviceProvider = context.RequestServices;
                        if (serviceProvider is not null)
                        {
                            return await serviceProvider.GetRequiredService<IHousingService>().SearchSavedSearches(search, filter, pagination);
                        }
                    }
                    catch (Exception e)
                    {
                        context.Errors.Add(new ExecutionError(e.InnerException?.Message ?? e.Message));
                    }
                    return null;
                });
        }
    }
}