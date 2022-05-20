import {useMutation, useQueryClient} from "react-query";
import chatStore from "../../../store/chat.store";
import useStore from "../../../store/user.store";
import {readChatMessages, sendMessage} from "./axios";

export const useMutateSendMessage = (scrollToBottom: any) => {
  const queryClient = useQueryClient();
  const {socket} = chatStore((state: any) => state);
  const {user} = useStore((state: any) => state);
  return useMutation(({chatId, newMessage}: any) => sendMessage({content: newMessage, chatId: chatId}),
    {
      onSuccess: async (data: any) => {
        const prevAllMessages: any = await queryClient.getQueryData(['fetchMessagesChat', data.chatId]);
        if (prevAllMessages) {
          await queryClient.cancelQueries(['fetchMessagesChat', data.chatId]);
          prevAllMessages.push(data);
          queryClient.setQueryData(['fetchMessagesChat', data.chatId], () => prevAllMessages);
        }
        await queryClient.invalidateQueries(['messages', 'non-read']);

        const prevAllChats: any = await queryClient.getQueryData('fetchMyChats');
        if (prevAllChats) {
          await queryClient.cancelQueries('fetchMyChats');
          let foundIndex = prevAllChats.findIndex((chat: any) => chat.id == data.chat.id);
          prevAllChats[foundIndex].latestMessage = {...data};
          queryClient.setQueryData('fetchMyChats', () => prevAllChats);
        }

        data.sender = user.id;
        socket.emit('new-message', data);
        await queryClient.invalidateQueries(['messages', 'non-read']);
        scrollToBottom();
      }
    }
  );
};

export const useMuateteReadMessages = () => {
  const queryClient = useQueryClient();
  const {setNotifications} = chatStore((state: any) => state);
  return useMutation((chatId: any) => readChatMessages(chatId), {
    onSuccess: async (data: any) => {
      await queryClient.invalidateQueries(['messages', 'non-read'])
      const notifications = await queryClient.getQueryData(['messages', 'non-read']);
      setNotifications(notifications);
    }
  });
};
