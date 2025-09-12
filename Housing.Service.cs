using HousingAPI.Business.Model;
using Microsoft.EntityFrameworkCore;

namespace HousingAPI.Business.Service
{
    public interface IHousingService
    {
        Task<List<CategoryModel>> GetCurrentCategory();
        Task<List<UserModel>> GetUsers();
        Task<UserModel?> GetUserById(long id);
        Task<List<ListingModel>> GetListings();
        Task<ListingModel?> GetListingById(long id);
        Task<List<ListingModel>> GetListingsByUserId(long userId);
        Task<List<ListingModel>> GetListingsByCategory(long categoryId);
        Task<List<ListingImageModel>> GetListingImages(long listingId);
        Task<List<FavoriteModel>> GetUserFavorites(long userId);
        Task<List<MessageModel>> GetUserMessages(long userId);
        Task<List<MessageModel>> GetConversation(long senderId, long receiverId, long listingId);
        Task<List<SavedSearchModel>> GetUserSavedSearches(long userId);
    }

    public class HousingService : IHousingService
    {
        private readonly DbContext _dbContext;

        public HousingService(DbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<List<CategoryModel>> GetCurrentCategory()
        {
            var list = await _dbContext.Set<CategoryModel>().ToListAsync();
            return list.Select(item => Utility.CopyPropertiesTo(item, new CategoryModel())).ToList();
        }

        public async Task<List<UserModel>> GetUsers()
        {
            var list = await _dbContext.Set<UserModel>().ToListAsync();
            return list.Select(item => Utility.CopyPropertiesTo(item, new UserModel())).ToList();
        }

        public async Task<UserModel?> GetUserById(long id)
        {
            var user = await _dbContext.Set<UserModel>().FirstOrDefaultAsync(u => u.Id == id);
            return user != null ? Utility.CopyPropertiesTo(user, new UserModel()) : null;
        }

        public async Task<List<ListingModel>> GetListings()
        {
            var list = await _dbContext.Set<ListingModel>()
                .Where(l => l.Status == 1) // Only active listings
                .OrderByDescending(l => l.CreatedAt)
                .ToListAsync();
            return list.Select(item => Utility.CopyPropertiesTo(item, new ListingModel())).ToList();
        }

        public async Task<ListingModel?> GetListingById(long id)
        {
            var listing = await _dbContext.Set<ListingModel>()
                .FirstOrDefaultAsync(l => l.Id == id && l.Status == 1);
            return listing != null ? Utility.CopyPropertiesTo(listing, new ListingModel()) : null;
        }

        public async Task<List<ListingModel>> GetListingsByUserId(long userId)
        {
            var list = await _dbContext.Set<ListingModel>()
                .Where(l => l.UserId == userId)
                .OrderByDescending(l => l.CreatedAt)
                .ToListAsync();
            return list.Select(item => Utility.CopyPropertiesTo(item, new ListingModel())).ToList();
        }

        public async Task<List<ListingModel>> GetListingsByCategory(long categoryId)
        {
            var list = await _dbContext.Set<ListingModel>()
                .Where(l => l.CategoryId == categoryId && l.Status == 1)
                .OrderByDescending(l => l.CreatedAt)
                .ToListAsync();
            return list.Select(item => Utility.CopyPropertiesTo(item, new ListingModel())).ToList();
        }

        public async Task<List<ListingImageModel>> GetListingImages(long listingId)
        {
            var list = await _dbContext.Set<ListingImageModel>()
                .Where(img => img.ListingId == listingId)
                .OrderBy(img => img.OrderIndex)
                .ToListAsync();
            return list.Select(item => Utility.CopyPropertiesTo(item, new ListingImageModel())).ToList();
        }

        public async Task<List<FavoriteModel>> GetUserFavorites(long userId)
        {
            var list = await _dbContext.Set<FavoriteModel>()
                .Where(f => f.UserId == userId)
                .OrderByDescending(f => f.CreatedAt)
                .ToListAsync();
            return list.Select(item => Utility.CopyPropertiesTo(item, new FavoriteModel())).ToList();
        }

        public async Task<List<MessageModel>> GetUserMessages(long userId)
        {
            var list = await _dbContext.Set<MessageModel>()
                .Where(m => m.SenderUserId == userId || m.ReceiverUserId == userId)
                .OrderByDescending(m => m.CreatedAt)
                .ToListAsync();
            return list.Select(item => Utility.CopyPropertiesTo(item, new MessageModel())).ToList();
        }

        public async Task<List<MessageModel>> GetConversation(long senderId, long receiverId, long listingId)
        {
            var list = await _dbContext.Set<MessageModel>()
                .Where(m => m.ListingId == listingId &&
                           ((m.SenderUserId == senderId && m.ReceiverUserId == receiverId) ||
                            (m.SenderUserId == receiverId && m.ReceiverUserId == senderId)))
                .OrderBy(m => m.CreatedAt)
                .ToListAsync();
            return list.Select(item => Utility.CopyPropertiesTo(item, new MessageModel())).ToList();
        }

        public async Task<List<SavedSearchModel>> GetUserSavedSearches(long userId)
        {
            var list = await _dbContext.Set<SavedSearchModel>()
                .Where(s => s.UserId == userId)
                .OrderByDescending(s => s.CreatedAt)
                .ToListAsync();
            return list.Select(item => Utility.CopyPropertiesTo(item, new SavedSearchModel())).ToList();
        }
    }

    // Utility class for property copying (you may need to implement this based on your existing utility)
    public static class Utility
    {
        public static T CopyPropertiesTo<T>(object source, T destination) where T : class
        {
            if (source == null || destination == null)
                return destination;

            var sourceType = source.GetType();
            var destinationType = typeof(T);

            var sourceProperties = sourceType.GetProperties();
            var destinationProperties = destinationType.GetProperties();

            foreach (var sourceProperty in sourceProperties)
            {
                var destinationProperty = destinationProperties
                    .FirstOrDefault(p => p.Name == sourceProperty.Name && p.PropertyType == sourceProperty.PropertyType);

                if (destinationProperty != null && destinationProperty.CanWrite)
                {
                    var value = sourceProperty.GetValue(source);
                    destinationProperty.SetValue(destination, value);
                }
            }

            return destination;
        }
    }
}