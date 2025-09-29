using GraphQL.Types;
using HousingAPI.GraphQLModels.Mutations.Inputs;

namespace HousingAPI.GraphQLModels.Mutations.InputTypes
{
    public class FavoriteInputGraphType : InputObjectGraphType<FavoriteInput>
    {
        public FavoriteInputGraphType()
        {
            Name = "FavoriteInput";
            Description = "Input for adding or removing a favorite";

            Field(x => x.UserId).Description("ID of the user");
            Field(x => x.ListingId).Description("ID of the listing to favorite/unfavorite");
        }
    }
}