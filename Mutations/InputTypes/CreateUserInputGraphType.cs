using GraphQL.Types;
using HousingAPI.GraphQLModels.Mutations.Inputs;

namespace HousingAPI.GraphQLModels.Mutations.InputTypes
{
    public class CreateUserInputGraphType : InputObjectGraphType<CreateUserInput>
    {
        public CreateUserInputGraphType()
        {
            Name = "CreateUserInput";
            Description = "Input for creating a new user";

            Field(x => x.FirstName).Description("User's first name");
            Field(x => x.LastName).Description("User's last name");
            Field(x => x.CompanyName, nullable: true).Description("Company name (optional)");
            Field(x => x.CompanyWebsite, nullable: true).Description("Company website (optional)");
            Field(x => x.Email).Description("User's email address");
            Field(x => x.PhoneNumber).Description("User's phone number");
            Field(x => x.Address, nullable: true).Description("User's address (optional)");
            Field(x => x.IsIndividual).Description("Whether the user is an individual");
            Field(x => x.IsAgency).Description("Whether the user is an agency");
        }
    }
}