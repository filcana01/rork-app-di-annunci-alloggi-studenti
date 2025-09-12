namespace HousingAPI.Business.Model
{
    public class FavoriteModel
    {
        public long Id { get; set; }

        public long UserId { get; set; }

        public long ListingId { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}