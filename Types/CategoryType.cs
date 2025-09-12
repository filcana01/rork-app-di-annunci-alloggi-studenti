using HousingAPI.Business.Model;

namespace HousingAPI.GraphQLModels.Type
{
    public class CategoryType : ObjectGraphType<CategoryModel>
    {
        public CategoryType()
        {
            Name = nameof(CategoryModel);
            Field(x => x.Id);
            Field(x => x.NameIt);
            Field(x => x.NameEn);
            Field(x => x.CreatedAt);
        }
    }
}