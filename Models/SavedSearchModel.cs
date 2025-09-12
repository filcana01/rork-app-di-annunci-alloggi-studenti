namespace HousingAPI.Business.Model
{
    public class SavedSearchModel
    {
        public long Id { get; set; }

        public long UserId { get; set; }

        public string SearchName { get; set; } = string.Empty;

        public string SearchCriteria { get; set; } = string.Empty; // JSON con i filtri

        public bool NotificationsEnabled { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}