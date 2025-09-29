namespace HousingAPI.GraphQLModels.Mutations.Inputs
{
    public class UpdateUserInput
    {
        public long Id { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? CompanyName { get; set; }
        public string? CompanyWebsite { get; set; }
        public string? Email { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Address { get; set; }
        public bool? IsIndividual { get; set; }
        public bool? IsAgency { get; set; }
        public bool? IsVerified { get; set; }
    }
}