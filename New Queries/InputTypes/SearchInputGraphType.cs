using GraphQL.Types;

namespace HousingAPI.GraphQLModels.Queries.InputTypes
{
    public class SearchInputGraphType : InputObjectGraphType<Inputs.SearchInput>
    {
        public SearchInputGraphType()
        {
            Name = "SearchInput";
            Description = "Input for search functionality";
            
            Field(x => x.Query, nullable: true)
                .Description("Search query string");
            
            Field<ListGraphType<StringGraphType>>("fields")
                .Description("Fields to search in")
                .Resolve(context => context.Source.Fields);
            
            Field(x => x.CaseSensitive, nullable: true)
                .Description("Whether search should be case sensitive");
            
            Field(x => x.ExactMatch, nullable: true)
                .Description("Whether to perform exact match search");
        }
    }
}