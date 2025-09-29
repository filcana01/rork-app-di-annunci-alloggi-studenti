namespace HousingAPI.GraphQLModels.Mutations.Inputs
{
    public class CreateMessageInput
    {
        public long SenderUserId { get; set; }
        public long ReceiverUserId { get; set; }
        public long ListingId { get; set; }
        public string Content { get; set; } = string.Empty;
    }
}