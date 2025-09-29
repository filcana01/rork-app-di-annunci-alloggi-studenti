namespace HousingAPI.GraphQLModels.Mutations.Inputs
{
    public class UpdateListingInput
    {
        public long Id { get; set; }
        public string? Title { get; set; }
        public string? Description { get; set; }
        public string? Address { get; set; }
        public string? PostalCode { get; set; }
        public string? City { get; set; }
        public string? Country { get; set; }
        public decimal? Latitude { get; set; }
        public decimal? Longitude { get; set; }
        public int? SurfaceArea { get; set; }
        public int? NumberOfRooms { get; set; }
        public int? Floor { get; set; }
        public int? NumberOfBathrooms { get; set; }
        public int? FurnishingStatus { get; set; }
        public decimal? MonthlyRent { get; set; }
        public bool? ExpensesIncluded { get; set; }
        public decimal? MonthlyExpenses { get; set; }
        public bool? AnnualAdjustment { get; set; }
        public bool? HasTerrace { get; set; }
        public bool? HasGarden { get; set; }
        public bool? HasPool { get; set; }
        public bool? PetsAllowed { get; set; }
        public DateTime? AvailabilityDate { get; set; }
        public bool? IsAvailableImmediately { get; set; }
        public int? MinContractDuration { get; set; }
        public string? Rules { get; set; }
        public bool? HasElevator { get; set; }
        public bool? HasRampAccess { get; set; }
        public decimal? SecurityDeposit { get; set; }
        public bool? AcceptsSwissCaution { get; set; }
        public int? Status { get; set; }
    }
}