using GraphQL.Types;
using HousingAPI.GraphQLModels.Mutations.Inputs;

namespace HousingAPI.GraphQLModels.Mutations.InputTypes
{
    public class DeleteInputGraphType : InputObjectGraphType<DeleteInput>
    {
        public DeleteInputGraphType()
        {
            Name = "DeleteInput";
            Description = "Input for deleting an entity by ID";

            Field(x => x.Id).Description("ID of the entity to delete");
        }
    }
}