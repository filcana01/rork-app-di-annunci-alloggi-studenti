namespace HousingAPI.GraphQLModels.Queries.Inputs
{
    public class ListingFilterInput
    {
        public long? CategoryId { get; set; }
        public long? UserId { get; set; }
        public string? Title { get; set; }
        public string? Description { get; set; }
        public decimal? MinPrice { get; set; }
        public decimal? MaxPrice { get; set; }
        public string? Location { get; set; }
        public bool? IsActive { get; set; }
        public DateTime? CreatedAfter { get; set; }
        public DateTime? CreatedBefore { get; set; }
    }
}