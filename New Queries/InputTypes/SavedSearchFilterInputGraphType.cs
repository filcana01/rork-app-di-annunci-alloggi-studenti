using GraphQL.Types;

namespace HousingAPI.GraphQLModels.Queries.InputTypes
{
    public class SavedSearchFilterInputGraphType : InputObjectGraphType<Inputs.SavedSearchFilterInput>
    {
        public SavedSearchFilterInputGraphType()
        {
            Name = "SavedSearchFilterInput";
            Description = "Input for filtering saved searches";
            
            Field(x => x.UserId, nullable: true)
                .Description("Filter by user ID");
            
            Field(x => x.SearchName, nullable: true)
                .Description("Filter by search name (partial match)");
            
            Field(x => x.SearchCriteria, nullable: true)
                .Description("Filter by search criteria (partial match)");
            
            Field(x => x.IsActive, nullable: true)
                .Description("Filter by active status");
            
            Field(x => x.CreatedAfter, nullable: true)
                .Description("Filter saved searches created after this date");
            
            Field(x => x.CreatedBefore, nullable: true)
                .Description("Filter saved searches created before this date");
        }
    }
}