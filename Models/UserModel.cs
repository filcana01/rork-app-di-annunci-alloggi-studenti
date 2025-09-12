namespace HousingAPI.Business.Model
{
    public class UserModel
    {
        public long Id { get; set; }

        public string FirstName { get; set; } = string.Empty;

        public string LastName { get; set; } = string.Empty;

        public string? CompanyName { get; set; }

        public string? CompanyWebsite { get; set; }

        public string Email { get; set; } = string.Empty;

        public string PhoneNumber { get; set; } = string.Empty;

        public string? Address { get; set; }

        public bool IsIndividual { get; set; } = false;

        public bool IsAgency { get; set; } = false;

        public bool IsAdmin { get; set; } = false;

        public bool IsVerified { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}