using GraphQL.Types;
using HousingAPI.GraphQLModels.Mutations.Inputs;

namespace HousingAPI.GraphQLModels.Mutations.InputTypes
{
    public class CreateMessageInputGraphType : InputObjectGraphType<CreateMessageInput>
    {
        public CreateMessageInputGraphType()
        {
            Name = "CreateMessageInput";
            Description = "Input for creating a new message";

            Field(x => x.SenderUserId).Description("ID of the user sending the message");
            Field(x => x.ReceiverUserId).Description("ID of the user receiving the message");
            Field(x => x.ListingId).Description("ID of the listing the message is about");
            Field(x => x.Content).Description("Message content");
        }
    }
}