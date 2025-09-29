namespace HousingAPI.GraphQLModels.Mutations.Inputs
{
    public class FavoriteInput
    {
        public long UserId { get; set; }
        public long ListingId { get; set; }
    }
}