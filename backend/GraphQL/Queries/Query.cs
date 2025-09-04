using Microsoft.EntityFrameworkCore;
using StudentHousingAPI.Data;
using StudentHousingAPI.Models;

namespace StudentHousingAPI.GraphQL.Queries
{
    public class Query
    {
        // Users
        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public IQueryable<User> GetUsers([Service] ApplicationDbContext context)
        {
            return context.Users;
        }

        [UseProjection]
        public async Task<User?> GetUser([Service] ApplicationDbContext context, int id)
        {
            return await context.Users.FirstOrDefaultAsync(u => u.Id == id);
        }

        [UseProjection]
        public async Task<User?> GetUserByUsername([Service] ApplicationDbContext context, string username)
        {
            return await context.Users.FirstOrDefaultAsync(u => u.Username == username);
        }

        // Listings
        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public IQueryable<Listing> GetListings([Service] ApplicationDbContext context)
        {
            return context.Listings.Where(l => l.Status == ListingStatus.Active);
        }

        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public IQueryable<Listing> GetAllListings([Service] ApplicationDbContext context)
        {
            return context.Listings;
        }

        [UseProjection]
        public async Task<Listing?> GetListing([Service] ApplicationDbContext context, int id)
        {
            return await context.Listings.FirstOrDefaultAsync(l => l.Id == id);
        }

        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public IQueryable<Listing> GetListingsByUser([Service] ApplicationDbContext context, int userId)
        {
            return context.Listings.Where(l => l.UserId == userId);
        }

        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public IQueryable<Listing> GetListingsByCategory([Service] ApplicationDbContext context, int categoryId)
        {
            return context.Listings.Where(l => l.CategoryId == categoryId && l.Status == ListingStatus.Active);
        }

        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public IQueryable<Listing> SearchListings(
            [Service] ApplicationDbContext context,
            string? searchTerm = null,
            decimal? minPrice = null,
            decimal? maxPrice = null,
            string? city = null,
            int? categoryId = null,
            bool? petsAllowed = null,
            bool? hasTerrace = null,
            bool? hasGarden = null,
            FurnishingStatus? furnishingStatus = null)
        {
            var query = context.Listings.Where(l => l.Status == ListingStatus.Active);

            if (!string.IsNullOrEmpty(searchTerm))
            {
                query = query.Where(l => l.Title.Contains(searchTerm) || l.Description.Contains(searchTerm));
            }

            if (minPrice.HasValue)
            {
                query = query.Where(l => l.MonthlyRent >= minPrice.Value);
            }

            if (maxPrice.HasValue)
            {
                query = query.Where(l => l.MonthlyRent <= maxPrice.Value);
            }

            if (!string.IsNullOrEmpty(city))
            {
                query = query.Where(l => l.City.Contains(city));
            }

            if (categoryId.HasValue)
            {
                query = query.Where(l => l.CategoryId == categoryId.Value);
            }

            if (petsAllowed.HasValue)
            {
                query = query.Where(l => l.PetsAllowed == petsAllowed.Value);
            }

            if (hasTerrace.HasValue)
            {
                query = query.Where(l => l.HasTerrace == hasTerrace.Value);
            }

            if (hasGarden.HasValue)
            {
                query = query.Where(l => l.HasGarden == hasGarden.Value);
            }

            if (furnishingStatus.HasValue)
            {
                query = query.Where(l => l.FurnishingStatus == furnishingStatus.Value);
            }

            return query;
        }

        // Categories
        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public IQueryable<Category> GetCategories([Service] ApplicationDbContext context)
        {
            return context.Categories;
        }

        [UseProjection]
        public async Task<Category?> GetCategory([Service] ApplicationDbContext context, int id)
        {
            return await context.Categories.FirstOrDefaultAsync(c => c.Id == id);
        }

        // Messages
        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public IQueryable<Message> GetMessages([Service] ApplicationDbContext context)
        {
            return context.Messages;
        }

        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public IQueryable<Message> GetMessagesByUser([Service] ApplicationDbContext context, int userId)
        {
            return context.Messages.Where(m => m.SenderId == userId || m.ReceiverId == userId);
        }

        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public IQueryable<Message> GetReceivedMessages([Service] ApplicationDbContext context, int userId)
        {
            return context.Messages.Where(m => m.ReceiverId == userId);
        }

        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public IQueryable<Message> GetSentMessages([Service] ApplicationDbContext context, int userId)
        {
            return context.Messages.Where(m => m.SenderId == userId);
        }

        // Favorites
        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public IQueryable<Favorite> GetFavorites([Service] ApplicationDbContext context)
        {
            return context.Favorites;
        }

        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public IQueryable<Favorite> GetFavoritesByUser([Service] ApplicationDbContext context, int userId)
        {
            return context.Favorites.Where(f => f.UserId == userId);
        }

        [UseProjection]
        public async Task<bool> IsFavorite([Service] ApplicationDbContext context, int userId, int listingId)
        {
            return await context.Favorites.AnyAsync(f => f.UserId == userId && f.ListingId == listingId);
        }
    }
}