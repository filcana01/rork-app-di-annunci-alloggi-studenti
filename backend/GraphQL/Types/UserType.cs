using StudentHousingAPI.Models;

namespace StudentHousingAPI.GraphQL.Types
{
    public class UserType : ObjectType<User>
    {
        protected override void Configure(IObjectTypeDescriptor<User> descriptor)
        {
            descriptor.Field(u => u.Id).Type<NonNullType<IdType>>();
            descriptor.Field(u => u.FirstName).Type<NonNullType<StringType>>();
            descriptor.Field(u => u.LastName).Type<NonNullType<StringType>>();
            descriptor.Field(u => u.CompanyName).Type<StringType>();
            descriptor.Field(u => u.Email).Type<NonNullType<StringType>>();
            descriptor.Field(u => u.PhoneNumber).Type<NonNullType<StringType>>();
            descriptor.Field(u => u.Address).Type<NonNullType<StringType>>();
            descriptor.Field(u => u.Username).Type<NonNullType<StringType>>();
            descriptor.Field(u => u.UserType).Type<NonNullType<EnumType<UserType>>>();
            descriptor.Field(u => u.IsVerified).Type<NonNullType<BooleanType>>();
            descriptor.Field(u => u.CreatedAt).Type<NonNullType<DateTimeType>>();
            descriptor.Field(u => u.UpdatedAt).Type<NonNullType<DateTimeType>>();
            
            // Navigation properties
            descriptor.Field(u => u.Listings).Type<ListType<ListingType>>();
            descriptor.Field(u => u.Favorites).Type<ListType<FavoriteType>>();
            descriptor.Field(u => u.SentMessages).Type<ListType<MessageType>>();
            descriptor.Field(u => u.ReceivedMessages).Type<ListType<MessageType>>();
            
            // Hide sensitive fields
            descriptor.Field(u => u.PasswordHash).Ignore();
        }
    }
}