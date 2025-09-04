using StudentHousingAPI.Models;

namespace StudentHousingAPI.GraphQL.Types
{
    public class ListingImageType : ObjectType<ListingImage>
    {
        protected override void Configure(IObjectTypeDescriptor<ListingImage> descriptor)
        {
            descriptor.Field(i => i.Id).Type<NonNullType<IdType>>();
            descriptor.Field(i => i.ListingId).Type<NonNullType<IntType>>();
            descriptor.Field(i => i.ImageUrl).Type<NonNullType<StringType>>();
            descriptor.Field(i => i.IsPrimary).Type<NonNullType<BooleanType>>();
            descriptor.Field(i => i.OrderIndex).Type<NonNullType<IntType>>();
            descriptor.Field(i => i.CreatedAt).Type<NonNullType<DateTimeType>>();
            
            // Navigation properties
            descriptor.Field(i => i.Listing).Type<ListingType>();
        }
    }
}