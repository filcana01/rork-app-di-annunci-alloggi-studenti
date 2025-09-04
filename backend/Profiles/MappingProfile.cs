using AutoMapper;
using StudentHousingAPI.Models;
using StudentHousingAPI.DTOs;

namespace StudentHousingAPI.Profiles
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // User mappings
            CreateMap<User, UserDto>();
            CreateMap<RegisterDto, User>()
                .ForMember(dest => dest.Username, opt => opt.MapFrom(src => GenerateUsername(src.FirstName, src.LastName)))
                .ForMember(dest => dest.PasswordHash, opt => opt.Ignore())
                .ForMember(dest => dest.IsVerified, opt => opt.MapFrom(src => false))
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => DateTime.UtcNow))
                .ForMember(dest => dest.UpdatedAt, opt => opt.MapFrom(src => DateTime.UtcNow));

            CreateMap<UpdateUserDto, User>()
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

            // Category mappings
            CreateMap<Category, CategoryDto>();

            // Listing mappings
            CreateMap<CreateListingDto, Listing>()
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => DateTime.UtcNow))
                .ForMember(dest => dest.UpdatedAt, opt => opt.MapFrom(src => DateTime.UtcNow))
                .ForMember(dest => dest.Images, opt => opt.Ignore());

            CreateMap<UpdateListingDto, Listing>()
                .ForMember(dest => dest.UpdatedAt, opt => opt.MapFrom(src => DateTime.UtcNow))
                .ForMember(dest => dest.Images, opt => opt.Ignore())
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

            CreateMap<Listing, ListingDto>()
                .ForMember(dest => dest.IsFavorite, opt => opt.Ignore());

            // ListingImage mappings
            CreateMap<ListingImage, ListingImageDto>();
        }

        private static string GenerateUsername(string firstName, string lastName)
        {
            var baseUsername = $"{firstName.ToLower()}.{lastName.ToLower()}";
            var random = new Random();
            var suffix = random.Next(1000, 9999);
            return $"{baseUsername}{suffix}";
        }
    }
}