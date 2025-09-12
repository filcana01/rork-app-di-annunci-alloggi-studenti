using GraphQL;
using GraphQL.Types;
using HousingAPI.Business.Model;
using HousingAPI.Business.Service;
using HousingAPI.GraphQLModels.Type;

namespace HousingAPI.GraphQLModels
{
    public class Query : ObjectGraphType
    {
        public Query()
        {
            Name = "Query";
            
            // Category queries
            Category();
            
            // User queries
            Users();
            User();
            
            // Listing queries
            Listings();
            Listing();
            ListingsByUser();
            ListingsByCategory();
            
            // Listing Image queries
            ListingImages();
            
            // Favorite queries
            UserFavorites();
            
            // Message queries
            UserMessages();
            Conversation();
            
            // Saved Search queries
            UserSavedSearches();
        }

        private void Category()
        {
            Field<ListGraphType<CategoryType>>("Categories")
                .ResolveAsync(async context =>
                {
                    try
                    {
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

        private void Users()
        {
            Field<ListGraphType<UserType>>("Users")
                .ResolveAsync(async context =>
                {
                    try
                    {
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

        private void Listings()
        {
            Field<ListGraphType<ListingType>>("Listings")
                .ResolveAsync(async context =>
                {
                    try
                    {
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
                .ResolveAsync(async context =>
                {
                    try
                    {
                        var userId = context.GetArgument<long>("userId");
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
                .ResolveAsync(async context =>
                {
                    try
                    {
                        var categoryId = context.GetArgument<long>("categoryId");
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

        private void ListingImages()
        {
            Field<ListGraphType<ListingImageType>>("ListingImages")
                .Argument<NonNullGraphType<LongGraphType>>("listingId")
                .ResolveAsync(async context =>
                {
                    try
                    {
                        var listingId = context.GetArgument<long>("listingId");
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
                .ResolveAsync(async context =>
                {
                    try
                    {
                        var userId = context.GetArgument<long>("userId");
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
                .ResolveAsync(async context =>
                {
                    try
                    {
                        var userId = context.GetArgument<long>("userId");
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
                .Argument<NonNullGraphType<LongGraphType>>("senderId")
                .Argument<NonNullGraphType<LongGraphType>>("receiverId")
                .Argument<NonNullGraphType<LongGraphType>>("listingId")
                .ResolveAsync(async context =>
                {
                    try
                    {
                        var senderId = context.GetArgument<long>("senderId");
                        var receiverId = context.GetArgument<long>("receiverId");
                        var listingId = context.GetArgument<long>("listingId");
                        IServiceProvider? serviceProvider = context.RequestServices;
                        if (serviceProvider is not null)
                        {
                            return await serviceProvider.GetRequiredService<IHousingService>().GetConversation(senderId, receiverId, listingId);
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
                .ResolveAsync(async context =>
                {
                    try
                    {
                        var userId = context.GetArgument<long>("userId");
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
    }
}