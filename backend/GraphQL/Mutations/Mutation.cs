using Microsoft.EntityFrameworkCore;
using StudentHousingAPI.Data;
using StudentHousingAPI.Models;
using StudentHousingAPI.GraphQL.Types;
using StudentHousingAPI.Services;
using System.Security.Cryptography;
using System.Text;

namespace StudentHousingAPI.GraphQL.Mutations
{
    public class Mutation
    {
        // Authentication Mutations
        public async Task<AuthPayload> Login(
            [Service] IAuthService authService,
            string username,
            string password)
        {
            var token = await authService.LoginAsync(username, password);
            if (token == null)
                throw new GraphQLException("Invalid username or password");

            var user = await authService.GetCurrentUserAsync(token);
            return new AuthPayload { Token = token, User = user! };
        }
        // User Mutations
        public async Task<User> CreateUser(
            [Service] ApplicationDbContext context,
            string firstName,
            string lastName,
            string email,
            string phoneNumber,
            string address,
            string? companyName = null,
            UserType userType = UserType.Student)
        {
            // Generate username and password
            var username = GenerateUsername(firstName, lastName);
            var password = GeneratePassword();
            var passwordHash = HashPassword(password);

            var user = new User
            {
                FirstName = firstName,
                LastName = lastName,
                CompanyName = companyName,
                Email = email,
                PhoneNumber = phoneNumber,
                Address = address,
                Username = username,
                PasswordHash = passwordHash,
                UserType = userType,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            context.Users.Add(user);
            await context.SaveChangesAsync();

            // TODO: Send email with credentials
            Console.WriteLine($\"User created - Username: {username}, Password: {password}\");

            return user;
        }

        public async Task<User?> UpdateUser(
            [Service] ApplicationDbContext context,
            int id,
            string? firstName = null,
            string? lastName = null,
            string? email = null,
            string? phoneNumber = null,
            string? address = null,
            string? companyName = null,
            UserType? userType = null,
            bool? isVerified = null)
        {
            var user = await context.Users.FirstOrDefaultAsync(u => u.Id == id);
            if (user == null) return null;

            if (!string.IsNullOrEmpty(firstName)) user.FirstName = firstName;
            if (!string.IsNullOrEmpty(lastName)) user.LastName = lastName;
            if (!string.IsNullOrEmpty(email)) user.Email = email;
            if (!string.IsNullOrEmpty(phoneNumber)) user.PhoneNumber = phoneNumber;
            if (!string.IsNullOrEmpty(address)) user.Address = address;
            if (companyName != null) user.CompanyName = companyName;
            if (userType.HasValue) user.UserType = userType.Value;
            if (isVerified.HasValue) user.IsVerified = isVerified.Value;

            user.UpdatedAt = DateTime.UtcNow;

            await context.SaveChangesAsync();
            return user;
        }

        public async Task<bool> DeleteUser([Service] ApplicationDbContext context, int id)
        {
            var user = await context.Users.FirstOrDefaultAsync(u => u.Id == id);
            if (user == null) return false;

            context.Users.Remove(user);
            await context.SaveChangesAsync();
            return true;
        }

        // Listing Mutations
        public async Task<Listing> CreateListing(
            [Service] ApplicationDbContext context,
            int userId,
            int categoryId,
            string title,
            string description,
            string address,
            string postalCode,
            string city,
            string country,
            decimal monthlyRent,
            DateTime availabilityDate,
            decimal? latitude = null,
            decimal? longitude = null,
            int? surfaceArea = null,
            int? numberOfRooms = null,
            int? floor = null,
            int? numberOfBathrooms = null,
            FurnishingStatus? furnishingStatus = null,
            bool expensesIncluded = false,
            decimal? monthlyExpenses = null,
            bool annualAdjustment = false,
            bool hasTerrace = false,
            bool hasGarden = false,
            bool petsAllowed = false,
            bool isAvailableImmediately = true,
            int? minContractDuration = null,
            string? rules = null,
            string? accessibility = null,
            decimal? securityDeposit = null,
            bool acceptsSwissCaution = false,
            ListingStatus status = ListingStatus.Draft)
        {
            var listing = new Listing
            {
                UserId = userId,
                CategoryId = categoryId,
                Title = title,
                Description = description,
                Address = address,
                PostalCode = postalCode,
                City = city,
                Country = country,
                Latitude = latitude,
                Longitude = longitude,
                SurfaceArea = surfaceArea,
                NumberOfRooms = numberOfRooms,
                Floor = floor,
                NumberOfBathrooms = numberOfBathrooms,
                FurnishingStatus = furnishingStatus,
                MonthlyRent = monthlyRent,
                ExpensesIncluded = expensesIncluded,
                MonthlyExpenses = monthlyExpenses,
                AnnualAdjustment = annualAdjustment,
                HasTerrace = hasTerrace,
                HasGarden = hasGarden,
                PetsAllowed = petsAllowed,
                AvailabilityDate = availabilityDate,
                IsAvailableImmediately = isAvailableImmediately,
                MinContractDuration = minContractDuration,
                Rules = rules,
                Accessibility = accessibility,
                SecurityDeposit = securityDeposit,
                AcceptsSwissCaution = acceptsSwissCaution,
                Status = status,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            context.Listings.Add(listing);
            await context.SaveChangesAsync();
            return listing;
        }

        public async Task<Listing?> UpdateListing(
            [Service] ApplicationDbContext context,
            int id,
            string? title = null,
            string? description = null,
            string? address = null,
            string? postalCode = null,
            string? city = null,
            string? country = null,
            decimal? latitude = null,
            decimal? longitude = null,
            int? surfaceArea = null,
            int? numberOfRooms = null,
            int? floor = null,
            int? numberOfBathrooms = null,
            FurnishingStatus? furnishingStatus = null,
            decimal? monthlyRent = null,
            bool? expensesIncluded = null,
            decimal? monthlyExpenses = null,
            bool? annualAdjustment = null,
            bool? hasTerrace = null,
            bool? hasGarden = null,
            bool? petsAllowed = null,
            DateTime? availabilityDate = null,
            bool? isAvailableImmediately = null,
            int? minContractDuration = null,
            string? rules = null,
            string? accessibility = null,
            decimal? securityDeposit = null,
            bool? acceptsSwissCaution = null,
            ListingStatus? status = null,
            bool? isVerified = null)
        {
            var listing = await context.Listings.FirstOrDefaultAsync(l => l.Id == id);
            if (listing == null) return null;

            if (!string.IsNullOrEmpty(title)) listing.Title = title;
            if (!string.IsNullOrEmpty(description)) listing.Description = description;
            if (!string.IsNullOrEmpty(address)) listing.Address = address;
            if (!string.IsNullOrEmpty(postalCode)) listing.PostalCode = postalCode;
            if (!string.IsNullOrEmpty(city)) listing.City = city;
            if (!string.IsNullOrEmpty(country)) listing.Country = country;
            if (latitude.HasValue) listing.Latitude = latitude;
            if (longitude.HasValue) listing.Longitude = longitude;
            if (surfaceArea.HasValue) listing.SurfaceArea = surfaceArea;
            if (numberOfRooms.HasValue) listing.NumberOfRooms = numberOfRooms;
            if (floor.HasValue) listing.Floor = floor;
            if (numberOfBathrooms.HasValue) listing.NumberOfBathrooms = numberOfBathrooms;
            if (furnishingStatus.HasValue) listing.FurnishingStatus = furnishingStatus;
            if (monthlyRent.HasValue) listing.MonthlyRent = monthlyRent.Value;
            if (expensesIncluded.HasValue) listing.ExpensesIncluded = expensesIncluded.Value;
            if (monthlyExpenses.HasValue) listing.MonthlyExpenses = monthlyExpenses;
            if (annualAdjustment.HasValue) listing.AnnualAdjustment = annualAdjustment.Value;
            if (hasTerrace.HasValue) listing.HasTerrace = hasTerrace.Value;
            if (hasGarden.HasValue) listing.HasGarden = hasGarden.Value;
            if (petsAllowed.HasValue) listing.PetsAllowed = petsAllowed.Value;
            if (availabilityDate.HasValue) listing.AvailabilityDate = availabilityDate.Value;
            if (isAvailableImmediately.HasValue) listing.IsAvailableImmediately = isAvailableImmediately.Value;
            if (minContractDuration.HasValue) listing.MinContractDuration = minContractDuration;
            if (rules != null) listing.Rules = rules;
            if (accessibility != null) listing.Accessibility = accessibility;
            if (securityDeposit.HasValue) listing.SecurityDeposit = securityDeposit;
            if (acceptsSwissCaution.HasValue) listing.AcceptsSwissCaution = acceptsSwissCaution.Value;
            if (status.HasValue) listing.Status = status.Value;
            if (isVerified.HasValue) listing.IsVerified = isVerified.Value;

            listing.UpdatedAt = DateTime.UtcNow;

            await context.SaveChangesAsync();
            return listing;
        }

        public async Task<bool> DeleteListing([Service] ApplicationDbContext context, int id)
        {
            var listing = await context.Listings.FirstOrDefaultAsync(l => l.Id == id);
            if (listing == null) return false;

            context.Listings.Remove(listing);
            await context.SaveChangesAsync();
            return true;
        }

        // Message Mutations
        public async Task<Message> CreateMessage(
            [Service] ApplicationDbContext context,
            int senderId,
            int receiverId,
            string subject,
            string content,
            int? listingId = null)
        {
            var message = new Message
            {
                SenderId = senderId,
                ReceiverId = receiverId,
                ListingId = listingId,
                Subject = subject,
                Content = content,
                CreatedAt = DateTime.UtcNow
            };

            context.Messages.Add(message);
            await context.SaveChangesAsync();
            return message;
        }

        public async Task<Message?> MarkMessageAsRead([Service] ApplicationDbContext context, int id)
        {
            var message = await context.Messages.FirstOrDefaultAsync(m => m.Id == id);
            if (message == null) return null;

            message.IsRead = true;
            await context.SaveChangesAsync();
            return message;
        }

        public async Task<bool> DeleteMessage([Service] ApplicationDbContext context, int id)
        {
            var message = await context.Messages.FirstOrDefaultAsync(m => m.Id == id);
            if (message == null) return false;

            context.Messages.Remove(message);
            await context.SaveChangesAsync();
            return true;
        }

        // Favorite Mutations
        public async Task<Favorite> AddToFavorites(
            [Service] ApplicationDbContext context,
            int userId,
            int listingId)
        {
            var existingFavorite = await context.Favorites
                .FirstOrDefaultAsync(f => f.UserId == userId && f.ListingId == listingId);

            if (existingFavorite != null)
                return existingFavorite;

            var favorite = new Favorite
            {
                UserId = userId,
                ListingId = listingId,
                CreatedAt = DateTime.UtcNow
            };

            context.Favorites.Add(favorite);
            await context.SaveChangesAsync();
            return favorite;
        }

        public async Task<bool> RemoveFromFavorites([Service] ApplicationDbContext context, int userId, int listingId)
        {
            var favorite = await context.Favorites
                .FirstOrDefaultAsync(f => f.UserId == userId && f.ListingId == listingId);

            if (favorite == null) return false;

            context.Favorites.Remove(favorite);
            await context.SaveChangesAsync();
            return true;
        }

        // Helper methods
        private string GenerateUsername(string firstName, string lastName)
        {
            var baseUsername = $\"{firstName.ToLower()}.{lastName.ToLower()}\";
            var random = new Random();
            return $\"{baseUsername}{random.Next(100, 999)}\";
        }

        private string GeneratePassword()
        {
            const string chars = \"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789\";
            var random = new Random();
            return new string(Enumerable.Repeat(chars, 8)
                .Select(s => s[random.Next(s.Length)]).ToArray());
        }

        private string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
            return Convert.ToBase64String(hashedBytes);
        }
    }

    public class AuthPayload
    {
        public string Token { get; set; } = string.Empty;
        public User User { get; set; } = null!;
    }
}