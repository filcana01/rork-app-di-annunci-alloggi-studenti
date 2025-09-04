using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StudentHousingAPI.DTOs;
using StudentHousingAPI.Services;
using System.Security.Claims;

namespace StudentHousingAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ListingsController : ControllerBase
    {
        private readonly IListingService _listingService;

        public ListingsController(IListingService listingService)
        {
            _listingService = listingService;
        }

        private int? GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return int.TryParse(userIdClaim, out var userId) ? userId : null;
        }

        [HttpGet]
        public async Task<ActionResult<PagedResultDto<ListingDto>>> GetListings([FromQuery] ListingSearchDto searchDto)
        {
            try
            {
                var currentUserId = GetCurrentUserId();
                var result = await _listingService.GetListingsAsync(searchDto, currentUserId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving listings", error = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ListingDto>> GetListing(int id)
        {
            try
            {
                var currentUserId = GetCurrentUserId();
                var listing = await _listingService.GetListingByIdAsync(id, currentUserId);
                
                if (listing == null)
                {
                    return NotFound(new { message = "Listing not found" });
                }

                return Ok(listing);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving the listing", error = ex.Message });
            }
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult<ListingDto>> CreateListing([FromBody] CreateListingDto createDto)
        {
            try
            {
                var currentUserId = GetCurrentUserId();
                if (!currentUserId.HasValue)
                {
                    return Unauthorized(new { message = "User not authenticated" });
                }

                var listing = await _listingService.CreateListingAsync(createDto, currentUserId.Value);
                return CreatedAtAction(nameof(GetListing), new { id = listing.Id }, listing);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while creating the listing", error = ex.Message });
            }
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<ActionResult<ListingDto>> UpdateListing(int id, [FromBody] UpdateListingDto updateDto)
        {
            try
            {
                var currentUserId = GetCurrentUserId();
                if (!currentUserId.HasValue)
                {
                    return Unauthorized(new { message = "User not authenticated" });
                }

                var listing = await _listingService.UpdateListingAsync(id, updateDto, currentUserId.Value);
                
                if (listing == null)
                {
                    return NotFound(new { message = "Listing not found or you don't have permission to update it" });
                }

                return Ok(listing);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while updating the listing", error = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<ActionResult> DeleteListing(int id)
        {
            try
            {
                var currentUserId = GetCurrentUserId();
                if (!currentUserId.HasValue)
                {
                    return Unauthorized(new { message = "User not authenticated" });
                }

                var success = await _listingService.DeleteListingAsync(id, currentUserId.Value);
                
                if (!success)
                {
                    return NotFound(new { message = "Listing not found or you don't have permission to delete it" });
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while deleting the listing", error = ex.Message });
            }
        }

        [HttpGet("my-listings")]
        [Authorize]
        public async Task<ActionResult<List<ListingDto>>> GetMyListings()
        {
            try
            {
                var currentUserId = GetCurrentUserId();
                if (!currentUserId.HasValue)
                {
                    return Unauthorized(new { message = "User not authenticated" });
                }

                var listings = await _listingService.GetUserListingsAsync(currentUserId.Value);
                return Ok(listings);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving your listings", error = ex.Message });
            }
        }

        [HttpPost("{id}/favorite")]
        [Authorize]
        public async Task<ActionResult> ToggleFavorite(int id)
        {
            try
            {
                var currentUserId = GetCurrentUserId();
                if (!currentUserId.HasValue)
                {
                    return Unauthorized(new { message = "User not authenticated" });
                }

                var isAdded = await _listingService.ToggleFavoriteAsync(id, currentUserId.Value);
                
                return Ok(new { 
                    message = isAdded ? "Added to favorites" : "Removed from favorites",
                    isFavorite = isAdded 
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while updating favorites", error = ex.Message });
            }
        }

        [HttpGet("favorites")]
        [Authorize]
        public async Task<ActionResult<List<ListingDto>>> GetFavorites()
        {
            try
            {
                var currentUserId = GetCurrentUserId();
                if (!currentUserId.HasValue)
                {
                    return Unauthorized(new { message = "User not authenticated" });
                }

                var favorites = await _listingService.GetUserFavoritesAsync(currentUserId.Value);
                return Ok(favorites);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving favorites", error = ex.Message });
            }
        }
    }
}