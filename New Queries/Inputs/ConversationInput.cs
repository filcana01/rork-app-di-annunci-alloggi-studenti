namespace HousingAPI.GraphQLModels.Queries.Inputs
{
    public class ConversationInput
    {
        public long SenderId { get; set; }
        public long ReceiverId { get; set; }
        public long ListingId { get; set; }
        public bool? IncludeRead { get; set; }
        public bool? IncludeUnread { get; set; }
    }
}