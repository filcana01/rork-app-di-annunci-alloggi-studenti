using HousingAPI.Business.Model;
using HousingAPI.GraphQLModels.Mutations.Inputs;
using Microsoft.EntityFrameworkCore;

namespace HousingAPI.Business.Service
{
    public interface IHousingService
    {
        // Query methods
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

        // User mutations
        Task<UserModel> CreateUser(CreateUserInput input);
        Task<UserModel> UpdateUser(UpdateUserInput input);
        Task<bool> DeleteUser(long id);

        // Listing mutations
        Task<ListingModel> CreateListing(CreateListingInput input);
        Task<ListingModel> UpdateListing(UpdateListingInput input);
        Task<bool> DeleteListing(long id);
        Task<bool> ArchiveListing(long id);

        // Category mutations
        Task<CategoryModel> CreateCategory(CreateCategoryInput input);
        Task<bool> DeleteCategory(long id);

        // Message mutations
        Task<MessageModel> CreateMessage(CreateMessageInput input);
        Task<bool> MarkMessageAsRead(long id);
        Task<bool> DeleteMessage(long id);

        // Listing image mutations
        Task<ListingImageModel> AddListingImage(CreateListingImageInput input);
        Task<bool> DeleteListingImage(long id);
        Task<bool> SetPrimaryListingImage(long id);

        // Favorite mutations
        Task<FavoriteModel> AddFavorite(FavoriteInput input);
        Task<bool> RemoveFavorite(FavoriteInput input);

        // Saved search mutations
        Task<SavedSearchModel> CreateSavedSearch(CreateSavedSearchInput input);
        Task<bool> DeleteSavedSearch(long id);
        Task<bool> ToggleSavedSearchNotifications(long id);
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

        // User mutations implementation
        public async Task<UserModel> CreateUser(CreateUserInput input)
        {
            var user = new UserModel
            {
                FirstName = input.FirstName,
                LastName = input.LastName,
                CompanyName = input.CompanyName,
                CompanyWebsite = input.CompanyWebsite,
                Email = input.Email,
                PhoneNumber = input.PhoneNumber,
                Address = input.Address,
                IsIndividual = input.IsIndividual,
                IsAgency = input.IsAgency,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _dbContext.Set<UserModel>().Add(user);
            await _dbContext.SaveChangesAsync();
            return user;
        }

        public async Task<UserModel> UpdateUser(UpdateUserInput input)
        {
            var user = await _dbContext.Set<UserModel>().FirstOrDefaultAsync(u => u.Id == input.Id);
            if (user == null)
                throw new ArgumentException($"User with ID {input.Id} not found");

            if (!string.IsNullOrEmpty(input.FirstName)) user.FirstName = input.FirstName;
            if (!string.IsNullOrEmpty(input.LastName)) user.LastName = input.LastName;
            if (input.CompanyName != null) user.CompanyName = input.CompanyName;
            if (input.CompanyWebsite != null) user.CompanyWebsite = input.CompanyWebsite;
            if (!string.IsNullOrEmpty(input.Email)) user.Email = input.Email;
            if (!string.IsNullOrEmpty(input.PhoneNumber)) user.PhoneNumber = input.PhoneNumber;
            if (input.Address != null) user.Address = input.Address;
            if (input.IsIndividual.HasValue) user.IsIndividual = input.IsIndividual.Value;
            if (input.IsAgency.HasValue) user.IsAgency = input.IsAgency.Value;
            if (input.IsVerified.HasValue) user.IsVerified = input.IsVerified.Value;
            
            user.UpdatedAt = DateTime.UtcNow;

            await _dbContext.SaveChangesAsync();
            return user;
        }

        public async Task<bool> DeleteUser(long id)
        {
            var user = await _dbContext.Set<UserModel>().FirstOrDefaultAsync(u => u.Id == id);
            if (user == null) return false;

            _dbContext.Set<UserModel>().Remove(user);
            await _dbContext.SaveChangesAsync();
            return true;
        }

        // Listing mutations implementation
        public async Task<ListingModel> CreateListing(CreateListingInput input)
        {
            var listing = new ListingModel
            {
                UserId = input.UserId,
                CategoryId = input.CategoryId,
                Title = input.Title,
                Description = input.Description,
                Address = input.Address,
                PostalCode = input.PostalCode,
                City = input.City,
                Country = input.Country,
                Latitude = input.Latitude,
                Longitude = input.Longitude,
                SurfaceArea = input.SurfaceArea,
                NumberOfRooms = input.NumberOfRooms,
                Floor = input.Floor,
                NumberOfBathrooms = input.NumberOfBathrooms,
                FurnishingStatus = input.FurnishingStatus,
                MonthlyRent = input.MonthlyRent,
                ExpensesIncluded = input.ExpensesIncluded,
                MonthlyExpenses = input.MonthlyExpenses,
                AnnualAdjustment = input.AnnualAdjustment,
                HasTerrace = input.HasTerrace,
                HasGarden = input.HasGarden,
                HasPool = input.HasPool,
                PetsAllowed = input.PetsAllowed,
                AvailabilityDate = input.AvailabilityDate,
                IsAvailableImmediately = input.IsAvailableImmediately,
                MinContractDuration = input.MinContractDuration,
                Rules = input.Rules,
                HasElevator = input.HasElevator,
                HasRampAccess = input.HasRampAccess,
                SecurityDeposit = input.SecurityDeposit,
                AcceptsSwissCaution = input.AcceptsSwissCaution,
                Status = 0, // Draft by default
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _dbContext.Set<ListingModel>().Add(listing);
            await _dbContext.SaveChangesAsync();
            return listing;
        }

        public async Task<ListingModel> UpdateListing(UpdateListingInput input)
        {
            var listing = await _dbContext.Set<ListingModel>().FirstOrDefaultAsync(l => l.Id == input.Id);
            if (listing == null)
                throw new ArgumentException($"Listing with ID {input.Id} not found");

            if (!string.IsNullOrEmpty(input.Title)) listing.Title = input.Title;
            if (!string.IsNullOrEmpty(input.Description)) listing.Description = input.Description;
            if (!string.IsNullOrEmpty(input.Address)) listing.Address = input.Address;
            if (!string.IsNullOrEmpty(input.PostalCode)) listing.PostalCode = input.PostalCode;
            if (!string.IsNullOrEmpty(input.City)) listing.City = input.City;
            if (!string.IsNullOrEmpty(input.Country)) listing.Country = input.Country;
            if (input.Latitude.HasValue) listing.Latitude = input.Latitude;
            if (input.Longitude.HasValue) listing.Longitude = input.Longitude;
            if (input.SurfaceArea.HasValue) listing.SurfaceArea = input.SurfaceArea.Value;
            if (input.NumberOfRooms.HasValue) listing.NumberOfRooms = input.NumberOfRooms;
            if (input.Floor.HasValue) listing.Floor = input.Floor.Value;
            if (input.NumberOfBathrooms.HasValue) listing.NumberOfBathrooms = input.NumberOfBathrooms;
            if (input.FurnishingStatus.HasValue) listing.FurnishingStatus = input.FurnishingStatus.Value;
            if (input.MonthlyRent.HasValue) listing.MonthlyRent = input.MonthlyRent.Value;
            if (input.ExpensesIncluded.HasValue) listing.ExpensesIncluded = input.ExpensesIncluded.Value;
            if (input.MonthlyExpenses.HasValue) listing.MonthlyExpenses = input.MonthlyExpenses;
            if (input.AnnualAdjustment.HasValue) listing.AnnualAdjustment = input.AnnualAdjustment.Value;
            if (input.HasTerrace.HasValue) listing.HasTerrace = input.HasTerrace.Value;
            if (input.HasGarden.HasValue) listing.HasGarden = input.HasGarden.Value;
            if (input.HasPool.HasValue) listing.HasPool = input.HasPool.Value;
            if (input.PetsAllowed.HasValue) listing.PetsAllowed = input.PetsAllowed.Value;
            if (input.AvailabilityDate.HasValue) listing.AvailabilityDate = input.AvailabilityDate.Value;
            if (input.IsAvailableImmediately.HasValue) listing.IsAvailableImmediately = input.IsAvailableImmediately.Value;
            if (input.MinContractDuration.HasValue) listing.MinContractDuration = input.MinContractDuration;
            if (input.Rules != null) listing.Rules = input.Rules;
            if (input.HasElevator.HasValue) listing.HasElevator = input.HasElevator.Value;
            if (input.HasRampAccess.HasValue) listing.HasRampAccess = input.HasRampAccess.Value;
            if (input.SecurityDeposit.HasValue) listing.SecurityDeposit = input.SecurityDeposit;
            if (input.AcceptsSwissCaution.HasValue) listing.AcceptsSwissCaution = input.AcceptsSwissCaution.Value;
            if (input.Status.HasValue) listing.Status = input.Status.Value;
            
            listing.UpdatedAt = DateTime.UtcNow;

            await _dbContext.SaveChangesAsync();
            return listing;
        }

        public async Task<bool> DeleteListing(long id)
        {
            var listing = await _dbContext.Set<ListingModel>().FirstOrDefaultAsync(l => l.Id == id);
            if (listing == null) return false;

            _dbContext.Set<ListingModel>().Remove(listing);
            await _dbContext.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ArchiveListing(long id)
        {
            var listing = await _dbContext.Set<ListingModel>().FirstOrDefaultAsync(l => l.Id == id);
            if (listing == null) return false;

            listing.Status = 3; // Archived
            listing.DeletedAt = DateTime.UtcNow;
            listing.UpdatedAt = DateTime.UtcNow;

            await _dbContext.SaveChangesAsync();
            return true;
        }

        // Category mutations implementation
        public async Task<CategoryModel> CreateCategory(CreateCategoryInput input)
        {
            var category = new CategoryModel
            {
                NameIt = input.NameIt,
                NameEn = input.NameEn,
                CreatedAt = DateTime.UtcNow
            };

            _dbContext.Set<CategoryModel>().Add(category);
            await _dbContext.SaveChangesAsync();
            return category;
        }

        public async Task<bool> DeleteCategory(long id)
        {
            var category = await _dbContext.Set<CategoryModel>().FirstOrDefaultAsync(c => c.Id == id);
            if (category == null) return false;

            _dbContext.Set<CategoryModel>().Remove(category);
            await _dbContext.SaveChangesAsync();
            return true;
        }

        // Message mutations implementation
        public async Task<MessageModel> CreateMessage(CreateMessageInput input)
        {
            var message = new MessageModel
            {
                SenderUserId = input.SenderUserId,
                ReceiverUserId = input.ReceiverUserId,
                ListingId = input.ListingId,
                Content = input.Content,
                IsRead = false,
                CreatedAt = DateTime.UtcNow
            };

            _dbContext.Set<MessageModel>().Add(message);
            await _dbContext.SaveChangesAsync();
            return message;
        }

        public async Task<bool> MarkMessageAsRead(long id)
        {
            var message = await _dbContext.Set<MessageModel>().FirstOrDefaultAsync(m => m.Id == id);
            if (message == null) return false;

            message.IsRead = true;
            await _dbContext.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteMessage(long id)
        {
            var message = await _dbContext.Set<MessageModel>().FirstOrDefaultAsync(m => m.Id == id);
            if (message == null) return false;

            _dbContext.Set<MessageModel>().Remove(message);
            await _dbContext.SaveChangesAsync();
            return true;
        }

        // Listing image mutations implementation
        public async Task<ListingImageModel> AddListingImage(CreateListingImageInput input)
        {
            var image = new ListingImageModel
            {
                ListingId = input.ListingId,
                ImageUrl = input.ImageUrl,
                IsPrimary = input.IsPrimary,
                OrderIndex = input.OrderIndex,
                CreatedAt = DateTime.UtcNow
            };

            // If this is set as primary, unset other primary images for this listing
            if (input.IsPrimary)
            {
                var existingPrimary = await _dbContext.Set<ListingImageModel>()
                    .Where(img => img.ListingId == input.ListingId && img.IsPrimary)
                    .ToListAsync();
                
                foreach (var img in existingPrimary)
                {
                    img.IsPrimary = false;
                }
            }

            _dbContext.Set<ListingImageModel>().Add(image);
            await _dbContext.SaveChangesAsync();
            return image;
        }

        public async Task<bool> DeleteListingImage(long id)
        {
            var image = await _dbContext.Set<ListingImageModel>().FirstOrDefaultAsync(img => img.Id == id);
            if (image == null) return false;

            _dbContext.Set<ListingImageModel>().Remove(image);
            await _dbContext.SaveChangesAsync();
            return true;
        }

        public async Task<bool> SetPrimaryListingImage(long id)
        {
            var image = await _dbContext.Set<ListingImageModel>().FirstOrDefaultAsync(img => img.Id == id);
            if (image == null) return false;

            // Unset other primary images for this listing
            var existingPrimary = await _dbContext.Set<ListingImageModel>()
                .Where(img => img.ListingId == image.ListingId && img.IsPrimary && img.Id != id)
                .ToListAsync();
            
            foreach (var img in existingPrimary)
            {
                img.IsPrimary = false;
            }

            image.IsPrimary = true;
            await _dbContext.SaveChangesAsync();
            return true;
        }

        // Favorite mutations implementation
        public async Task<FavoriteModel> AddFavorite(FavoriteInput input)
        {
            // Check if favorite already exists
            var existingFavorite = await _dbContext.Set<FavoriteModel>()
                .FirstOrDefaultAsync(f => f.UserId == input.UserId && f.ListingId == input.ListingId);
            
            if (existingFavorite != null)
                return existingFavorite;

            var favorite = new FavoriteModel
            {
                UserId = input.UserId,
                ListingId = input.ListingId,
                CreatedAt = DateTime.UtcNow
            };

            _dbContext.Set<FavoriteModel>().Add(favorite);
            await _dbContext.SaveChangesAsync();
            return favorite;
        }

        public async Task<bool> RemoveFavorite(FavoriteInput input)
        {
            var favorite = await _dbContext.Set<FavoriteModel>()
                .FirstOrDefaultAsync(f => f.UserId == input.UserId && f.ListingId == input.ListingId);
            
            if (favorite == null) return false;

            _dbContext.Set<FavoriteModel>().Remove(favorite);
            await _dbContext.SaveChangesAsync();
            return true;
        }

        // Saved search mutations implementation
        public async Task<SavedSearchModel> CreateSavedSearch(CreateSavedSearchInput input)
        {
            var savedSearch = new SavedSearchModel
            {
                UserId = input.UserId,
                SearchName = input.SearchName,
                SearchCriteria = input.SearchCriteria,
                NotificationsEnabled = input.NotificationsEnabled,
                CreatedAt = DateTime.UtcNow
            };

            _dbContext.Set<SavedSearchModel>().Add(savedSearch);
            await _dbContext.SaveChangesAsync();
            return savedSearch;
        }

        public async Task<bool> DeleteSavedSearch(long id)
        {
            var savedSearch = await _dbContext.Set<SavedSearchModel>().FirstOrDefaultAsync(s => s.Id == id);
            if (savedSearch == null) return false;

            _dbContext.Set<SavedSearchModel>().Remove(savedSearch);
            await _dbContext.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ToggleSavedSearchNotifications(long id)
        {
            var savedSearch = await _dbContext.Set<SavedSearchModel>().FirstOrDefaultAsync(s => s.Id == id);
            if (savedSearch == null) return false;

            savedSearch.NotificationsEnabled = !savedSearch.NotificationsEnabled;
            await _dbContext.SaveChangesAsync();
            return true;
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