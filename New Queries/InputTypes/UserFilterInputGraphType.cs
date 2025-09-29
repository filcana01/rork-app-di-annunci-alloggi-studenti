using GraphQL.Types;

namespace HousingAPI.GraphQLModels.Queries.InputTypes
{
    public class UserFilterInputGraphType : InputObjectGraphType<Inputs.UserFilterInput>
    {
        public UserFilterInputGraphType()
        {
            Name = "UserFilterInput";
            Description = "Input for filtering users";
            
            Field(x => x.Email, nullable: true)
                .Description("Filter by email (partial match)");
            
            Field(x => x.FirstName, nullable: true)
                .Description("Filter by first name (partial match)");
            
            Field(x => x.LastName, nullable: true)
                .Description("Filter by last name (partial match)");
            
            Field(x => x.PhoneNumber, nullable: true)
                .Description("Filter by phone number (partial match)");
            
            Field(x => x.IsActive, nullable: true)
                .Description("Filter by active status");
            
            Field(x => x.CreatedAfter, nullable: true)
                .Description("Filter users created after this date");
            
            Field(x => x.CreatedBefore, nullable: true)
                .Description("Filter users created before this date");
        }
    }
}