namespace HousingAPI.GraphQLModels.Queries.Inputs
{
    public class SearchInput
    {
        public string? Query { get; set; }
        public string[]? Fields { get; set; }
        public bool? CaseSensitive { get; set; }
        public bool? ExactMatch { get; set; }
    }
}