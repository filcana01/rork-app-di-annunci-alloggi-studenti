using HousingAPI.Business.Model;

namespace HousingAPI.GraphQLModels.Type
{
    public class ListingImageType : ObjectGraphType<ListingImageModel>
    {
        public ListingImageType()
        {
            Name = nameof(ListingImageModel);
            Field(x => x.Id);
            Field(x => x.ListingId);
            Field(x => x.ImageUrl);
            Field(x => x.IsPrimary);
            Field(x => x.OrderIndex);
            Field(x => x.CreatedAt);
        }
    }
}