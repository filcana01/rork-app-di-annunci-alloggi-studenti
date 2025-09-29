namespace HousingAPI.GraphQLModels.Mutations.Inputs
{
    public class CreateSavedSearchInput
    {
        public long UserId { get; set; }
        public string SearchName { get; set; } = string.Empty;
        public string SearchCriteria { get; set; } = string.Empty;
        public bool NotificationsEnabled { get; set; } = true;
    }
}