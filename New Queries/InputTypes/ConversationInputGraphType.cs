using GraphQL.Types;

namespace HousingAPI.GraphQLModels.Queries.InputTypes
{
    public class ConversationInputGraphType : InputObjectGraphType<Inputs.ConversationInput>
    {
        public ConversationInputGraphType()
        {
            Name = "ConversationInput";
            Description = "Input for retrieving conversation messages";
            
            Field(x => x.SenderId)
                .Description("ID of the message sender");
            
            Field(x => x.ReceiverId)
                .Description("ID of the message receiver");
            
            Field(x => x.ListingId)
                .Description("ID of the related listing");
            
            Field(x => x.IncludeRead, nullable: true)
                .Description("Whether to include read messages");
            
            Field(x => x.IncludeUnread, nullable: true)
                .Description("Whether to include unread messages");
        }
    }
}