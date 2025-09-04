// Esempio di Controller .NET per l'API
// File: Controllers/ListingsController.cs

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StudentHousingAPI.Data;
using StudentHousingAPI.Models;

[ApiController]
[Route("api/[controller]")]
public class ListingsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ListingsController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: api/listings
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Listing>>> GetListings(
        [FromQuery] string? category = null,
        [FromQuery] decimal? minPrice = null,
        [FromQuery] decimal? maxPrice = null,
        [FromQuery] string? city = null)
    {
        var query = _context.Listings.AsQueryable();

        if (!string.IsNullOrEmpty(category))
            query = query.Where(l => l.Category == category);

        if (minPrice.HasValue)
            query = query.Where(l => l.MonthlyRent >= minPrice);

        if (maxPrice.HasValue)
            query = query.Where(l => l.MonthlyRent <= maxPrice);

        if (!string.IsNullOrEmpty(city))
            query = query.Where(l => l.Address.City.Contains(city));

        return await query.Include(l => l.User).ToListAsync();
    }

    // GET: api/listings/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Listing>> GetListing(string id)
    {
        var listing = await _context.Listings
            .Include(l => l.User)
            .FirstOrDefaultAsync(l => l.Id == id);

        if (listing == null)
            return NotFound();

        return listing;
    }

    // POST: api/listings
    [HttpPost]
    public async Task<ActionResult<Listing>> CreateListing(CreateListingDto dto)
    {
        var listing = new Listing
        {
            Id = Guid.NewGuid().ToString(),
            UserId = dto.UserId,
            Category = dto.Category,
            Title = dto.Title,
            Description = dto.Description,
            // ... map other properties
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            Status = "pending"
        };

        _context.Listings.Add(listing);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetListing), new { id = listing.Id }, listing);
    }

    // PUT: api/listings/5
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateListing(string id, UpdateListingDto dto)
    {
        var listing = await _context.Listings.FindAsync(id);
        if (listing == null)
            return NotFound();

        // Update properties
        listing.Title = dto.Title ?? listing.Title;
        listing.Description = dto.Description ?? listing.Description;
        // ... update other properties
        listing.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    // DELETE: api/listings/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteListing(string id)
    {
        var listing = await _context.Listings.FindAsync(id);
        if (listing == null)
            return NotFound();

        _context.Listings.Remove(listing);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}