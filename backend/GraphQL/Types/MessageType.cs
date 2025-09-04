using StudentHousingAPI.Models;

namespace StudentHousingAPI.GraphQL.Types
{
    public class MessageType : ObjectType<Message>
    {
        protected override void Configure(IObjectTypeDescriptor<Message> descriptor)
        {
            descriptor.Field(m => m.Id).Type<NonNullType<IdType>>();
            descriptor.Field(m => m.SenderId).Type<NonNullType<IntType>>();
            descriptor.Field(m => m.ReceiverId).Type<NonNullType<IntType>>();
            descriptor.Field(m => m.ListingId).Type<IntType>();
            descriptor.Field(m => m.Subject).Type<NonNullType<StringType>>();
            descriptor.Field(m => m.Content).Type<NonNullType<StringType>>();
            descriptor.Field(m => m.IsRead).Type<NonNullType<BooleanType>>();
            descriptor.Field(m => m.CreatedAt).Type<NonNullType<DateTimeType>>();
            
            // Navigation properties
            descriptor.Field(m => m.Sender).Type<UserType>();
            descriptor.Field(m => m.Receiver).Type<UserType>();
            descriptor.Field(m => m.Listing).Type<ListingType>();
        }
    }
}