using GraphQL.Types;
using HousingAPI.GraphQLModels.Mutations.Inputs;

namespace HousingAPI.GraphQLModels.Mutations.InputTypes
{
    public class CreateSavedSearchInputGraphType : InputObjectGraphType<CreateSavedSearchInput>
    {
        public CreateSavedSearchInputGraphType()
        {
            Name = "CreateSavedSearchInput";
            Description = "Input for creating a saved search";

            Field(x => x.UserId).Description("ID of the user creating the saved search");
            Field(x => x.SearchName).Description("Name for the saved search");
            Field(x => x.SearchCriteria).Description("JSON string containing search criteria");
            Field(x => x.NotificationsEnabled).Description("Whether notifications are enabled for this search");
        }
    }
}