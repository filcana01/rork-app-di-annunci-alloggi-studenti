namespace HousingAPI.Business.Model
{
    public class MessageModel
    {
        public long Id { get; set; }

        public long SenderUserId { get; set; }

        public long ReceiverUserId { get; set; }

        public long ListingId { get; set; }

        public string Content { get; set; } = string.Empty;

        public bool IsRead { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}