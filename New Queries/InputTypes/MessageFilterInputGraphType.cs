using GraphQL.Types;

namespace HousingAPI.GraphQLModels.Queries.InputTypes
{
    public class MessageFilterInputGraphType : InputObjectGraphType<Inputs.MessageFilterInput>
    {
        public MessageFilterInputGraphType()
        {
            Name = "MessageFilterInput";
            Description = "Input for filtering messages";
            
            Field(x => x.SenderId, nullable: true)
                .Description("Filter by sender ID");
            
            Field(x => x.ReceiverId, nullable: true)
                .Description("Filter by receiver ID");
            
            Field(x => x.ListingId, nullable: true)
                .Description("Filter by listing ID");
            
            Field(x => x.Content, nullable: true)
                .Description("Filter by message content (partial match)");
            
            Field(x => x.IsRead, nullable: true)
                .Description("Filter by read status");
            
            Field(x => x.SentAfter, nullable: true)
                .Description("Filter messages sent after this date");
            
            Field(x => x.SentBefore, nullable: true)
                .Description("Filter messages sent before this date");
        }
    }
}