import { useMutation, useQueryClient } from 'react-query';
import chatStore from '../../../store/chat.store';
import useStore from '../../../store/user.store';
import { readChatMessages, sendMessage } from './axios';
import { IMessage } from '../../../types/IMessage';
import { isEmptyArray, isNullOrUndefined } from '../../../utils/primitive-checks';
import { IChat } from '../../../types/IChat';

export const useMutateSendMessage = (scrollToBottom: any) => {
  const queryClient = useQueryClient();
  const { socket } = chatStore((state: any) => state);
  const { user } = useStore((state: any) => state);
  return useMutation(
    ({ chatId, newMessage }: any) => sendMessage({ content: newMessage, chatId: chatId }),
    {
      onSuccess: async (data: any) => {
        const prevAllMessages: IMessage[] | undefined = await queryClient.getQueryData([
          'fetchMessagesChat',
          data.chatId,
        ]);
        if (!isNullOrUndefined(prevAllMessages)) {
          await queryClient.cancelQueries(['fetchMessagesChat', data.chatId]);
          prevAllMessages.push(data);
          queryClient.setQueryData(['fetchMessagesChat', data.chatId], () => prevAllMessages);
        }

        const prevAllChats: IChat[] | undefined = await queryClient.getQueryData(['chats']);
        if (!isNullOrUndefined(prevAllChats)) {
          await queryClient.cancelQueries(['chats']);
          let foundIndex = prevAllChats.findIndex((chat: any) => chat.id == data.chat.id);
          prevAllChats[foundIndex].latestMessage = { ...data };
          queryClient.setQueryData(['chats'], () => prevAllChats);
        }

        data.sender = user?.id;
        socket.emit('new-message', data);

        const prevAllNotifications: IMessage[] | undefined = await queryClient.getQueryData([
          'messages',
          'non-read',
        ]);
        if (!isNullOrUndefined(prevAllNotifications)) {
          await queryClient.invalidateQueries(['messages', 'non-read']);
        }
        scrollToBottom();
      },
    }
  );
};

export const useMutateReadMessages = () => {
  const queryClient = useQueryClient();
  const { socket } = chatStore((state: any) => state);
  const { setNotifications } = chatStore((state: any) => state);
  return useMutation((chatId: any) => readChatMessages(chatId), {
    onSuccess: async (data: any) => {
      const prevAllNotifications: IMessage[] | undefined = await queryClient.getQueryData([
        'messages',
        'non-read',
      ]);
      if (!isNullOrUndefined(prevAllNotifications)) {
        await queryClient.invalidateQueries(['messages', 'non-read']);
      }
      if (!isNullOrUndefined(data) && !isEmptyArray(data)) {
        socket.emit('post-read-messages', data[0]?.chatId);
      }
      setNotifications(
        prevAllNotifications?.filter((notification) => notification.chat?.id != data[0]?.chatId)
      );
    },
  });
};
