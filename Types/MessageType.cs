using HousingAPI.Business.Model;

namespace HousingAPI.GraphQLModels.Type
{
    public class MessageType : ObjectGraphType<MessageModel>
    {
        public MessageType()
        {
            Name = nameof(MessageModel);
            Field(x => x.Id);
            Field(x => x.SenderUserId);
            Field(x => x.ReceiverUserId);
            Field(x => x.ListingId);
            Field(x => x.Content);
            Field(x => x.IsRead);
            Field(x => x.CreatedAt);
        }
    }
}