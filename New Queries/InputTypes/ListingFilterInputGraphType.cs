using GraphQL.Types;

namespace HousingAPI.GraphQLModels.Queries.InputTypes
{
    public class ListingFilterInputGraphType : InputObjectGraphType<Inputs.ListingFilterInput>
    {
        public ListingFilterInputGraphType()
        {
            Name = "ListingFilterInput";
            Description = "Input for filtering listings";
            
            Field(x => x.CategoryId, nullable: true)
                .Description("Filter by category ID");
            
            Field(x => x.UserId, nullable: true)
                .Description("Filter by user ID");
            
            Field(x => x.Title, nullable: true)
                .Description("Filter by title (partial match)");
            
            Field(x => x.Description, nullable: true)
                .Description("Filter by description (partial match)");
            
            Field(x => x.MinPrice, nullable: true)
                .Description("Minimum price filter");
            
            Field(x => x.MaxPrice, nullable: true)
                .Description("Maximum price filter");
            
            Field(x => x.Location, nullable: true)
                .Description("Filter by location (partial match)");
            
            Field(x => x.IsActive, nullable: true)
                .Description("Filter by active status");
            
            Field(x => x.CreatedAfter, nullable: true)
                .Description("Filter listings created after this date");
            
            Field(x => x.CreatedBefore, nullable: true)
                .Description("Filter listings created before this date");
        }
    }
}