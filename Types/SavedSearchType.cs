using HousingAPI.Business.Model;

namespace HousingAPI.GraphQLModels.Type
{
    public class SavedSearchType : ObjectGraphType<SavedSearchModel>
    {
        public SavedSearchType()
        {
            Name = nameof(SavedSearchModel);
            Field(x => x.Id);
            Field(x => x.UserId);
            Field(x => x.SearchName);
            Field(x => x.SearchCriteria);
            Field(x => x.NotificationsEnabled);
            Field(x => x.CreatedAt);
        }
    }
}