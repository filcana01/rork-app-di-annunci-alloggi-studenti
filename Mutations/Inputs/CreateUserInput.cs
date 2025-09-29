namespace HousingAPI.GraphQLModels.Mutations.Inputs
{
    public class CreateUserInput
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string? CompanyName { get; set; }
        public string? CompanyWebsite { get; set; }
        public string Email { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string? Address { get; set; }
        public bool IsIndividual { get; set; } = false;
        public bool IsAgency { get; set; } = false;
    }
}