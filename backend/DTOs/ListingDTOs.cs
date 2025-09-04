using System.ComponentModel.DataAnnotations;

namespace StudentHousingAPI.DTOs
{
    // Listing DTOs
    public class CreateListingDto
    {
        [Required]
        public int CategoryId { get; set; }
        
        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;
        
        [Required]
        public string Description { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(500)]
        public string Address { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(10)]
        public string PostalCode { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(100)]
        public string City { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(100)]
        public string Country { get; set; } = string.Empty;
        
        public decimal? Latitude { get; set; }
        public decimal? Longitude { get; set; }
        public int? SurfaceArea { get; set; }
        public int? NumberOfRooms { get; set; }
        public int? Floor { get; set; }
        public int? NumberOfBathrooms { get; set; }
        public int? FurnishingStatus { get; set; }
        
        [Required]
        [Range(0, double.MaxValue)]
        public decimal MonthlyRent { get; set; }
        
        public bool ExpensesIncluded { get; set; } = false;
        
        [Range(0, double.MaxValue)]
        public decimal? MonthlyExpenses { get; set; }
        
        public bool AnnualAdjustment { get; set; } = false;
        public bool HasTerrace { get; set; } = false;
        public bool HasGarden { get; set; } = false;
        public bool PetsAllowed { get; set; } = false;
        
        [Required]
        public DateTime AvailabilityDate { get; set; }
        
        public bool IsAvailableImmediately { get; set; } = true;
        
        [Range(1, 120)]
        public int? MinContractDuration { get; set; }
        
        public string? Rules { get; set; }
        public string? Accessibility { get; set; }
        
        [Range(0, double.MaxValue)]
        public decimal? SecurityDeposit { get; set; }
        
        public bool AcceptsSwissCaution { get; set; } = false;
        public List<string> ImageUrls { get; set; } = new List<string>();
    }

    public class UpdateListingDto
    {
        public int? CategoryId { get; set; }
        
        [MaxLength(200)]
        public string? Title { get; set; }
        
        public string? Description { get; set; }
        
        [MaxLength(500)]
        public string? Address { get; set; }
        
        [MaxLength(10)]
        public string? PostalCode { get; set; }
        
        [MaxLength(100)]
        public string? City { get; set; }
        
        [MaxLength(100)]
        public string? Country { get; set; }
        
        public decimal? Latitude { get; set; }
        public decimal? Longitude { get; set; }
        public int? SurfaceArea { get; set; }
        public int? NumberOfRooms { get; set; }
        public int? Floor { get; set; }
        public int? NumberOfBathrooms { get; set; }
        public int? FurnishingStatus { get; set; }
        
        [Range(0, double.MaxValue)]
        public decimal? MonthlyRent { get; set; }
        
        public bool? ExpensesIncluded { get; set; }
        
        [Range(0, double.MaxValue)]
        public decimal? MonthlyExpenses { get; set; }
        
        public bool? AnnualAdjustment { get; set; }
        public bool? HasTerrace { get; set; }
        public bool? HasGarden { get; set; }
        public bool? PetsAllowed { get; set; }
        public DateTime? AvailabilityDate { get; set; }
        public bool? IsAvailableImmediately { get; set; }
        
        [Range(1, 120)]
        public int? MinContractDuration { get; set; }
        
        public string? Rules { get; set; }
        public string? Accessibility { get; set; }
        
        [Range(0, double.MaxValue)]
        public decimal? SecurityDeposit { get; set; }
        
        public bool? AcceptsSwissCaution { get; set; }
        public List<string>? ImageUrls { get; set; }
    }

    public class ListingDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int CategoryId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string PostalCode { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string Country { get; set; } = string.Empty;
        public decimal? Latitude { get; set; }
        public decimal? Longitude { get; set; }
        public int? SurfaceArea { get; set; }
        public int? NumberOfRooms { get; set; }
        public int? Floor { get; set; }
        public int? NumberOfBathrooms { get; set; }
        public int? FurnishingStatus { get; set; }
        public decimal MonthlyRent { get; set; }
        public bool ExpensesIncluded { get; set; }
        public decimal? MonthlyExpenses { get; set; }
        public bool AnnualAdjustment { get; set; }
        public bool HasTerrace { get; set; }
        public bool HasGarden { get; set; }
        public bool PetsAllowed { get; set; }
        public DateTime AvailabilityDate { get; set; }
        public bool IsAvailableImmediately { get; set; }
        public int? MinContractDuration { get; set; }
        public string? Rules { get; set; }
        public string? Accessibility { get; set; }
        public decimal? SecurityDeposit { get; set; }
        public bool AcceptsSwissCaution { get; set; }
        public int Status { get; set; }
        public bool IsVerified { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        
        // Navigation properties
        public UserDto User { get; set; } = null!;
        public CategoryDto Category { get; set; } = null!;
        public List<ListingImageDto> Images { get; set; } = new List<ListingImageDto>();
        public bool IsFavorite { get; set; } = false;
    }

    public class ListingImageDto
    {
        public int Id { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
        public bool IsPrimary { get; set; }
        public int OrderIndex { get; set; }
    }

    public class CategoryDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string NameEn { get; set; } = string.Empty;
    }

    // Search and Filter DTOs
    public class ListingSearchDto
    {
        public string? SearchTerm { get; set; }
        public int? CategoryId { get; set; }
        public string? City { get; set; }
        public decimal? MinRent { get; set; }
        public decimal? MaxRent { get; set; }
        public int? MinRooms { get; set; }
        public int? MaxRooms { get; set; }
        public int? MinSurfaceArea { get; set; }
        public int? MaxSurfaceArea { get; set; }
        public int? FurnishingStatus { get; set; }
        public bool? HasTerrace { get; set; }
        public bool? HasGarden { get; set; }
        public bool? PetsAllowed { get; set; }
        public DateTime? AvailableFrom { get; set; }
        public DateTime? AvailableTo { get; set; }
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 20;
        public string SortBy { get; set; } = "CreatedAt";
        public string SortOrder { get; set; } = "desc";
    }

    public class PagedResultDto<T>
    {
        public List<T> Items { get; set; } = new List<T>();
        public int TotalCount { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
        public int TotalPages { get; set; }
        public bool HasNextPage { get; set; }
        public bool HasPreviousPage { get; set; }
    }
}