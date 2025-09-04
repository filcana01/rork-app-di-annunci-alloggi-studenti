using StudentHousingAPI.Models;

namespace StudentHousingAPI.GraphQL.Types
{
    public class CategoryType : ObjectType<Category>
    {
        protected override void Configure(IObjectTypeDescriptor<Category> descriptor)
        {
            descriptor.Field(c => c.Id).Type<NonNullType<IdType>>();
            descriptor.Field(c => c.Name).Type<NonNullType<StringType>>();
            descriptor.Field(c => c.NameEn).Type<NonNullType<StringType>>();
            descriptor.Field(c => c.CreatedAt).Type<NonNullType<DateTimeType>>();
            
            // Navigation properties
            descriptor.Field(c => c.Listings).Type<ListType<ListingType>>();
        }
    }
}