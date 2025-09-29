using GraphQL.Types;
using HousingAPI.GraphQLModels.Mutations.Inputs;

namespace HousingAPI.GraphQLModels.Mutations.InputTypes
{
    public class CreateListingImageInputGraphType : InputObjectGraphType<CreateListingImageInput>
    {
        public CreateListingImageInputGraphType()
        {
            Name = "CreateListingImageInput";
            Description = "Input for adding an image to a listing";

            Field(x => x.ListingId).Description("ID of the listing");
            Field(x => x.ImageUrl).Description("URL of the image");
            Field(x => x.IsPrimary).Description("Whether this is the primary image");
            Field(x => x.OrderIndex).Description("Order index for image display");
        }
    }
}