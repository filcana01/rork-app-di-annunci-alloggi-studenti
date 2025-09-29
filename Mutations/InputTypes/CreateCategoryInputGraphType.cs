using GraphQL.Types;
using HousingAPI.GraphQLModels.Mutations.Inputs;

namespace HousingAPI.GraphQLModels.Mutations.InputTypes
{
    public class CreateCategoryInputGraphType : InputObjectGraphType<CreateCategoryInput>
    {
        public CreateCategoryInputGraphType()
        {
            Name = "CreateCategoryInput";
            Description = "Input for creating a new category";

            Field(x => x.NameIt).Description("Category name in Italian");
            Field(x => x.NameEn).Description("Category name in English");
        }
    }
}