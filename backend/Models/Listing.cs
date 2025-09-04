using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StudentHousingAPI.Models
{
    public class Listing
    {
        public int Id { get; set; }
        
        [Required]
        public int UserId { get; set; }
        
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
        
        [Column(TypeName = "decimal(10,8)")]
        public decimal? Latitude { get; set; }
        
        [Column(TypeName = "decimal(11,8)")]
        public decimal? Longitude { get; set; }
        
        public int? SurfaceArea { get; set; }
        public int? NumberOfRooms { get; set; }
        public int? Floor { get; set; }
        public int? NumberOfBathrooms { get; set; }
        public FurnishingStatus? FurnishingStatus { get; set; }
        
        [Required]
        [Column(TypeName = "decimal(10,2)")]
        public decimal MonthlyRent { get; set; }
        
        public bool ExpensesIncluded { get; set; } = false;
        
        [Column(TypeName = "decimal(10,2)")]
        public decimal? MonthlyExpenses { get; set; }
        
        public bool AnnualAdjustment { get; set; } = false;
        public bool HasTerrace { get; set; } = false;
        public bool HasGarden { get; set; } = false;
        public bool PetsAllowed { get; set; } = false;
        
        [Required]
        public DateTime AvailabilityDate { get; set; }
        
        public bool IsAvailableImmediately { get; set; } = true;
        public int? MinContractDuration { get; set; }
        public string? Rules { get; set; }
        public string? Accessibility { get; set; }
        
        [Column(TypeName = "decimal(10,2)")]
        public decimal? SecurityDeposit { get; set; }
        
        public bool AcceptsSwissCaution { get; set; } = false;
        public ListingStatus Status { get; set; } = ListingStatus.Draft;
        public bool IsVerified { get; set; } = false;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        
        // Navigation properties
        [ForeignKey("UserId")]
        public virtual User User { get; set; } = null!;
        
        [ForeignKey("CategoryId")]
        public virtual Category Category { get; set; } = null!;
        
        public virtual ICollection<ListingImage> Images { get; set; } = new List<ListingImage>();
        public virtual ICollection<Favorite> Favorites { get; set; } = new List<Favorite>();
        public virtual ICollection<Message> Messages { get; set; } = new List<Message>();
    }

    public enum FurnishingStatus
    {
        Unfurnished = 0,
        PartiallyFurnished = 1,
        Furnished = 2
    }

    public enum ListingStatus
    {
        Draft = 0,
        Active = 1,
        Expired = 2,
        Archived = 3
    }
}