using GraphQL.Types;
using HousingAPI.GraphQLModels.Mutations.Inputs;

namespace HousingAPI.GraphQLModels.Mutations.InputTypes
{
    public class UpdateUserInputGraphType : InputObjectGraphType<UpdateUserInput>
    {
        public UpdateUserInputGraphType()
        {
            Name = "UpdateUserInput";
            Description = "Input for updating an existing user";

            Field(x => x.Id).Description("User ID to update");
            Field(x => x.FirstName, nullable: true).Description("User's first name");
            Field(x => x.LastName, nullable: true).Description("User's last name");
            Field(x => x.CompanyName, nullable: true).Description("Company name");
            Field(x => x.CompanyWebsite, nullable: true).Description("Company website");
            Field(x => x.Email, nullable: true).Description("User's email address");
            Field(x => x.PhoneNumber, nullable: true).Description("User's phone number");
            Field(x => x.Address, nullable: true).Description("User's address");
            Field(x => x.IsIndividual, nullable: true).Description("Whether the user is an individual");
            Field(x => x.IsAgency, nullable: true).Description("Whether the user is an agency");
            Field(x => x.IsVerified, nullable: true).Description("Whether the user is verified");
        }
    }
}