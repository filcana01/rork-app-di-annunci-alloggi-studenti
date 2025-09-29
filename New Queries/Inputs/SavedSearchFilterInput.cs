namespace HousingAPI.GraphQLModels.Queries.Inputs
{
    public class SavedSearchFilterInput
    {
        public long? UserId { get; set; }
        public string? SearchName { get; set; }
        public string? SearchCriteria { get; set; }
        public bool? IsActive { get; set; }
        public DateTime? CreatedAfter { get; set; }
        public DateTime? CreatedBefore { get; set; }
    }
}