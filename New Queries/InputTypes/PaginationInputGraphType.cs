using GraphQL.Types;

namespace HousingAPI.GraphQLModels.Queries.InputTypes
{
    public class PaginationInputGraphType : InputObjectGraphType<Inputs.PaginationInput>
    {
        public PaginationInputGraphType()
        {
            Name = "PaginationInput";
            Description = "Input for pagination parameters";
            
            Field(x => x.Skip, nullable: true)
                .Description("Number of records to skip");
            
            Field(x => x.Take, nullable: true)
                .Description("Number of records to take");
            
            Field(x => x.OrderBy, nullable: true)
                .Description("Field to order by");
            
            Field(x => x.Descending, nullable: true)
                .Description("Whether to order in descending order");
        }
    }
}