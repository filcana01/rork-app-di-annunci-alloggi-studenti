namespace HousingAPI.GraphQLModels.Mutations.Inputs
{
    public class CreateListingImageInput
    {
        public long ListingId { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
        public bool IsPrimary { get; set; } = false;
        public int OrderIndex { get; set; } = 0;
    }
}