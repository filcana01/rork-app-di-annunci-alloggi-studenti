using StudentHousingAPI.Models;

namespace StudentHousingAPI.GraphQL.Types
{
    public class FavoriteType : ObjectType<Favorite>
    {
        protected override void Configure(IObjectTypeDescriptor<Favorite> descriptor)
        {
            descriptor.Field(f => f.Id).Type<NonNullType<IdType>>();
            descriptor.Field(f => f.UserId).Type<NonNullType<IntType>>();
            descriptor.Field(f => f.ListingId).Type<NonNullType<IntType>>();
            descriptor.Field(f => f.CreatedAt).Type<NonNullType<DateTimeType>>();
            
            // Navigation properties
            descriptor.Field(f => f.User).Type<UserType>();
            descriptor.Field(f => f.Listing).Type<ListingType>();
        }
    }
}