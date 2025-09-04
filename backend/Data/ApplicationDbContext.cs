using Microsoft.EntityFrameworkCore;
using StudentHousingAPI.Models;

namespace StudentHousingAPI.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Listing> Listings { get; set; }
        public DbSet<ListingImage> ListingImages { get; set; }
        public DbSet<Favorite> Favorites { get; set; }
        public DbSet<Message> Messages { get; set; }
        public DbSet<SavedSearch> SavedSearches { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // User configuration
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasIndex(e => e.Email).IsUnique();
                entity.HasIndex(e => e.Username).IsUnique();
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETDATE()");
                entity.Property(e => e.UpdatedAt).HasDefaultValueSql("GETDATE()");
            });

            // Listing configuration
            modelBuilder.Entity<Listing>(entity =>
            {
                entity.HasIndex(e => e.Status);
                entity.HasIndex(e => e.CategoryId);
                entity.HasIndex(e => e.City);
                entity.HasIndex(e => e.MonthlyRent);
                entity.HasIndex(e => e.AvailabilityDate);
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETDATE()");
                entity.Property(e => e.UpdatedAt).HasDefaultValueSql("GETDATE()");
                
                entity.HasOne(d => d.User)
                    .WithMany(p => p.Listings)
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.Restrict);
                
                entity.HasOne(d => d.Category)
                    .WithMany(p => p.Listings)
                    .HasForeignKey(d => d.CategoryId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // ListingImage configuration
            modelBuilder.Entity<ListingImage>(entity =>
            {
                entity.HasOne(d => d.Listing)
                    .WithMany(p => p.Images)
                    .HasForeignKey(d => d.ListingId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // Favorite configuration
            modelBuilder.Entity<Favorite>(entity =>
            {
                entity.HasIndex(e => new { e.UserId, e.ListingId }).IsUnique();
                
                entity.HasOne(d => d.User)
                    .WithMany(p => p.Favorites)
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.Restrict);
                
                entity.HasOne(d => d.Listing)
                    .WithMany(p => p.Favorites)
                    .HasForeignKey(d => d.ListingId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // Message configuration
            modelBuilder.Entity<Message>(entity =>
            {
                entity.HasIndex(e => e.ReceiverId);
                entity.HasIndex(e => e.IsRead);
                
                entity.HasOne(d => d.Sender)
                    .WithMany(p => p.SentMessages)
                    .HasForeignKey(d => d.SenderId)
                    .OnDelete(DeleteBehavior.Restrict);
                
                entity.HasOne(d => d.Receiver)
                    .WithMany(p => p.ReceivedMessages)
                    .HasForeignKey(d => d.ReceiverId)
                    .OnDelete(DeleteBehavior.Restrict);
                
                entity.HasOne(d => d.Listing)
                    .WithMany(p => p.Messages)
                    .HasForeignKey(d => d.ListingId)
                    .OnDelete(DeleteBehavior.SetNull);
            });

            // SavedSearch configuration
            modelBuilder.Entity<SavedSearch>(entity =>
            {
                entity.HasOne(d => d.User)
                    .WithMany(p => p.SavedSearches)
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // Category configuration
            modelBuilder.Entity<Category>(entity =>
            {
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETDATE()");
            });

            // Seed data
            modelBuilder.Entity<Category>().HasData(
                new Category { Id = 1, Name = "Camera", NameEn = "Room" },
                new Category { Id = 2, Name = "Appartamento", NameEn = "Apartment" },
                new Category { Id = 3, Name = "Parcheggio", NameEn = "Parking" }
            );
        }
    }
}