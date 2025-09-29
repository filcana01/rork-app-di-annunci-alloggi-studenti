namespace HousingAPI.GraphQLModels.Queries.Inputs
{
    public class PaginationInput
    {
        public int? Skip { get; set; }
        public int? Take { get; set; }
        public string? OrderBy { get; set; }
        public bool? Descending { get; set; }
    }
}