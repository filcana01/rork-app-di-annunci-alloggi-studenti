namespace HousingAPI.Business.Model
{
    public class ListingImageModel
    {
        public long Id { get; set; }

        public long ListingId { get; set; }

        public string ImageUrl { get; set; } = string.Empty;

        public bool IsPrimary { get; set; } = false;

        public int OrderIndex { get; set; } = 0;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}