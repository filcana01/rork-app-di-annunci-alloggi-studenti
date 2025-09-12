using HousingAPI.Business.Model;

namespace HousingAPI.GraphQLModels.Type
{
    public class UserType : ObjectGraphType<UserModel>
    {
        public UserType()
        {
            Name = nameof(UserModel);
            Field(x => x.Id);
            Field(x => x.FirstName);
            Field(x => x.LastName);
            Field(x => x.CompanyName, nullable: true);
            Field(x => x.CompanyWebsite, nullable: true);
            Field(x => x.Email);
            Field(x => x.PhoneNumber);
            Field(x => x.Address, nullable: true);
            Field(x => x.IsIndividual);
            Field(x => x.IsAgency);
            Field(x => x.IsAdmin);
            Field(x => x.IsVerified);
            Field(x => x.CreatedAt);
            Field(x => x.UpdatedAt);
        }
    }
}