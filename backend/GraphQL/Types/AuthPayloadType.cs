using StudentHousingAPI.GraphQL.Mutations;

namespace StudentHousingAPI.GraphQL.Types
{
    public class AuthPayloadType : ObjectType<AuthPayload>
    {
        protected override void Configure(IObjectTypeDescriptor<AuthPayload> descriptor)
        {
            descriptor.Field(a => a.Token).Type<NonNullType<StringType>>();
            descriptor.Field(a => a.User).Type<NonNullType<UserType>>();
        }
    }
}