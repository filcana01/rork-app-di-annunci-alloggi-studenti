namespace HousingAPI.GraphQLModels.Queries.Inputs
{
    public class MessageFilterInput
    {
        public long? SenderId { get; set; }
        public long? ReceiverId { get; set; }
        public long? ListingId { get; set; }
        public string? Content { get; set; }
        public bool? IsRead { get; set; }
        public DateTime? SentAfter { get; set; }
        public DateTime? SentBefore { get; set; }
    }
}