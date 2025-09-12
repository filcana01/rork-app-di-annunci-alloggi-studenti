using HousingAPI.Business.Model;

namespace HousingAPI.GraphQLModels.Type
{
    public class FavoriteType : ObjectGraphType<FavoriteModel>
    {
        public FavoriteType()
        {
            Name = nameof(FavoriteModel);
            Field(x => x.Id);
            Field(x => x.UserId);
            Field(x => x.ListingId);
            Field(x => x.CreatedAt);
        }
    }
}