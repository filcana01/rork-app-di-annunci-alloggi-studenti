using Microsoft.EntityFrameworkCore;
using StudentHousingAPI.Data;
using StudentHousingAPI.DTOs;
using StudentHousingAPI.Models;
using AutoMapper;

namespace StudentHousingAPI.Services
{
    public interface IListingService
    {
        Task<PagedResultDto<ListingDto>> GetListingsAsync(ListingSearchDto searchDto, int? currentUserId = null);
        Task<ListingDto?> GetListingByIdAsync(int id, int? currentUserId = null);
        Task<ListingDto> CreateListingAsync(CreateListingDto createDto, int userId);
        Task<ListingDto?> UpdateListingAsync(int id, UpdateListingDto updateDto, int userId);
        Task<bool> DeleteListingAsync(int id, int userId);
        Task<List<ListingDto>> GetUserListingsAsync(int userId);
        Task<bool> ToggleFavoriteAsync(int listingId, int userId);
        Task<List<ListingDto>> GetUserFavoritesAsync(int userId);
    }

    public class ListingService : IListingService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public ListingService(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<PagedResultDto<ListingDto>> GetListingsAsync(ListingSearchDto searchDto, int? currentUserId = null)
        {
            var query = _context.Listings
                .Include(l => l.User)
                .Include(l => l.Category)
                .Include(l => l.Images)
                .Where(l => l.Status == ListingStatus.Active && l.IsVerified);

            // Apply filters
            if (!string.IsNullOrEmpty(searchDto.SearchTerm))
            {
                query = query.Where(l => l.Title.Contains(searchDto.SearchTerm) || 
                                       l.Description.Contains(searchDto.SearchTerm) ||
                                       l.City.Contains(searchDto.SearchTerm));
            }

            if (searchDto.CategoryId.HasValue)
            {
                query = query.Where(l => l.CategoryId == searchDto.CategoryId.Value);
            }

            if (!string.IsNullOrEmpty(searchDto.City))
            {
                query = query.Where(l => l.City.Contains(searchDto.City));
            }

            if (searchDto.MinRent.HasValue)
            {
                query = query.Where(l => l.MonthlyRent >= searchDto.MinRent.Value);
            }

            if (searchDto.MaxRent.HasValue)
            {
                query = query.Where(l => l.MonthlyRent <= searchDto.MaxRent.Value);
            }

            if (searchDto.MinRooms.HasValue)
            {
                query = query.Where(l => l.NumberOfRooms >= searchDto.MinRooms.Value);
            }

            if (searchDto.MaxRooms.HasValue)
            {
                query = query.Where(l => l.NumberOfRooms <= searchDto.MaxRooms.Value);
            }

            if (searchDto.MinSurfaceArea.HasValue)
            {
                query = query.Where(l => l.SurfaceArea >= searchDto.MinSurfaceArea.Value);
            }

            if (searchDto.MaxSurfaceArea.HasValue)
            {
                query = query.Where(l => l.SurfaceArea <= searchDto.MaxSurfaceArea.Value);
            }

            if (searchDto.FurnishingStatus.HasValue)
            {
                query = query.Where(l => l.FurnishingStatus == (FurnishingStatus)searchDto.FurnishingStatus.Value);
            }

            if (searchDto.HasTerrace.HasValue)
            {
                query = query.Where(l => l.HasTerrace == searchDto.HasTerrace.Value);
            }

            if (searchDto.HasGarden.HasValue)
            {
                query = query.Where(l => l.HasGarden == searchDto.HasGarden.Value);
            }

            if (searchDto.PetsAllowed.HasValue)
            {
                query = query.Where(l => l.PetsAllowed == searchDto.PetsAllowed.Value);
            }

            if (searchDto.AvailableFrom.HasValue)
            {
                query = query.Where(l => l.AvailabilityDate >= searchDto.AvailableFrom.Value);
            }

            if (searchDto.AvailableTo.HasValue)
            {
                query = query.Where(l => l.AvailabilityDate <= searchDto.AvailableTo.Value);
            }

            // Apply sorting
            query = searchDto.SortBy.ToLower() switch
            {
                "rent" => searchDto.SortOrder.ToLower() == "asc" ? 
                    query.OrderBy(l => l.MonthlyRent) : query.OrderByDescending(l => l.MonthlyRent),
                "createdat" => searchDto.SortOrder.ToLower() == "asc" ? 
                    query.OrderBy(l => l.CreatedAt) : query.OrderByDescending(l => l.CreatedAt),
                "city" => searchDto.SortOrder.ToLower() == "asc" ? 
                    query.OrderBy(l => l.City) : query.OrderByDescending(l => l.City),
                _ => query.OrderByDescending(l => l.CreatedAt)
            };

            var totalCount = await query.CountAsync();
            var totalPages = (int)Math.Ceiling(totalCount / (double)searchDto.PageSize);

            var listings = await query
                .Skip((searchDto.Page - 1) * searchDto.PageSize)
                .Take(searchDto.PageSize)
                .ToListAsync();

            var listingDtos = _mapper.Map<List<ListingDto>>(listings);

            // Check favorites if user is authenticated
            if (currentUserId.HasValue)
            {
                var favoriteListingIds = await _context.Favorites
                    .Where(f => f.UserId == currentUserId.Value)
                    .Select(f => f.ListingId)
                    .ToListAsync();

                foreach (var listing in listingDtos)
                {
                    listing.IsFavorite = favoriteListingIds.Contains(listing.Id);
                }
            }

            return new PagedResultDto<ListingDto>
            {
                Items = listingDtos,
                TotalCount = totalCount,
                Page = searchDto.Page,
                PageSize = searchDto.PageSize,
                TotalPages = totalPages,
                HasNextPage = searchDto.Page < totalPages,
                HasPreviousPage = searchDto.Page > 1
            };
        }

        public async Task<ListingDto?> GetListingByIdAsync(int id, int? currentUserId = null)
        {
            var listing = await _context.Listings
                .Include(l => l.User)
                .Include(l => l.Category)
                .Include(l => l.Images)
                .FirstOrDefaultAsync(l => l.Id == id);

            if (listing == null) return null;

            var listingDto = _mapper.Map<ListingDto>(listing);

            // Check if it's a favorite
            if (currentUserId.HasValue)
            {
                listingDto.IsFavorite = await _context.Favorites
                    .AnyAsync(f => f.UserId == currentUserId.Value && f.ListingId == id);
            }

            return listingDto;
        }

        public async Task<ListingDto> CreateListingAsync(CreateListingDto createDto, int userId)
        {
            var listing = _mapper.Map<Listing>(createDto);
            listing.UserId = userId;
            listing.Status = ListingStatus.Draft;

            _context.Listings.Add(listing);
            await _context.SaveChangesAsync();

            // Add images
            if (createDto.ImageUrls.Any())
            {
                var images = createDto.ImageUrls.Select((url, index) => new ListingImage
                {
                    ListingId = listing.Id,
                    ImageUrl = url,
                    IsPrimary = index == 0,
                    OrderIndex = index
                }).ToList();

                _context.ListingImages.AddRange(images);
                await _context.SaveChangesAsync();
            }

            return await GetListingByIdAsync(listing.Id) ?? throw new InvalidOperationException("Failed to retrieve created listing");
        }

        public async Task<ListingDto?> UpdateListingAsync(int id, UpdateListingDto updateDto, int userId)
        {
            var listing = await _context.Listings
                .Include(l => l.Images)
                .FirstOrDefaultAsync(l => l.Id == id && l.UserId == userId);

            if (listing == null) return null;

            _mapper.Map(updateDto, listing);
            listing.UpdatedAt = DateTime.UtcNow;

            // Update images if provided
            if (updateDto.ImageUrls != null)
            {
                // Remove existing images
                _context.ListingImages.RemoveRange(listing.Images);

                // Add new images
                var images = updateDto.ImageUrls.Select((url, index) => new ListingImage
                {
                    ListingId = listing.Id,
                    ImageUrl = url,
                    IsPrimary = index == 0,
                    OrderIndex = index
                }).ToList();

                _context.ListingImages.AddRange(images);
            }

            await _context.SaveChangesAsync();

            return await GetListingByIdAsync(listing.Id);
        }

        public async Task<bool> DeleteListingAsync(int id, int userId)
        {
            var listing = await _context.Listings
                .FirstOrDefaultAsync(l => l.Id == id && l.UserId == userId);

            if (listing == null) return false;

            _context.Listings.Remove(listing);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<List<ListingDto>> GetUserListingsAsync(int userId)
        {
            var listings = await _context.Listings
                .Include(l => l.User)
                .Include(l => l.Category)
                .Include(l => l.Images)
                .Where(l => l.UserId == userId)
                .OrderByDescending(l => l.CreatedAt)
                .ToListAsync();

            return _mapper.Map<List<ListingDto>>(listings);
        }

        public async Task<bool> ToggleFavoriteAsync(int listingId, int userId)
        {
            var existingFavorite = await _context.Favorites
                .FirstOrDefaultAsync(f => f.ListingId == listingId && f.UserId == userId);

            if (existingFavorite != null)
            {
                _context.Favorites.Remove(existingFavorite);
                await _context.SaveChangesAsync();
                return false; // Removed from favorites
            }
            else
            {
                var favorite = new Favorite
                {
                    ListingId = listingId,
                    UserId = userId
                };

                _context.Favorites.Add(favorite);
                await _context.SaveChangesAsync();
                return true; // Added to favorites
            }
        }

        public async Task<List<ListingDto>> GetUserFavoritesAsync(int userId)
        {
            var favorites = await _context.Favorites
                .Include(f => f.Listing)
                    .ThenInclude(l => l.User)
                .Include(f => f.Listing)
                    .ThenInclude(l => l.Category)
                .Include(f => f.Listing)
                    .ThenInclude(l => l.Images)
                .Where(f => f.UserId == userId)
                .Select(f => f.Listing)
                .ToListAsync();

            var listingDtos = _mapper.Map<List<ListingDto>>(favorites);
            
            // Mark all as favorites
            foreach (var listing in listingDtos)
            {
                listing.IsFavorite = true;
            }

            return listingDtos;
        }
    }
}