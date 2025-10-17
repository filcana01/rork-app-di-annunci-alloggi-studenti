import { useQuery, useMutation } from '@apollo/client';
import { GET_MESSAGES, GET_CONVERSATIONS } from '@/graphql/queries';
import { CREATE_MESSAGE, DELETE_MESSAGE } from '@/graphql/mutations';

export function useMessages(filter) {
  const { data, loading, error, refetch } = useQuery(GET_MESSAGES, {
    variables: { filter },
    skip: !filter,
    pollInterval: 5000,
  });

  return {
    messages: data?.messages || [],
    loading,
    error,
    refetch,
  };
}

export function useConversations(userId) {
  const { data, loading, error, refetch } = useQuery(GET_CONVERSATIONS, {
    variables: { input: { userId: parseInt(userId) } },
    skip: !userId,
    pollInterval: 10000,
  });

  return {
    conversations: data?.conversations || [],
    loading,
    error,
    refetch,
  };
}

export function useSendMessage() {
  const [createMessageMutation, { loading, error }] = useMutation(CREATE_MESSAGE, {
    refetchQueries: [GET_MESSAGES, GET_CONVERSATIONS],
  });

  const sendMessage = async (input) => {
    try {
      const { data } = await createMessageMutation({
        variables: {
          input: {
            content: input.content,
            senderId: parseInt(input.senderId),
            receiverId: parseInt(input.receiverId),
            listingId: input.listingId ? parseInt(input.listingId) : null,
          },
        },
      });
      return { success: true, message: data.createMessage };
    } catch (err) {
      console.error('Error sending message:', err);
      return { success: false, error: err.message };
    }
  };

  return { sendMessage, loading, error };
}

export function useDeleteMessage() {
  const [deleteMessageMutation, { loading, error }] = useMutation(DELETE_MESSAGE, {
    refetchQueries: [GET_MESSAGES],
  });

  const deleteMessage = async (id) => {
    try {
      await deleteMessageMutation({
        variables: { input: { id: parseInt(id) } },
      });
      return { success: true };
    } catch (err) {
      console.error('Error deleting message:', err);
      return { success: false, error: err.message };
    }
  };

  return { deleteMessage, loading, error };
}
