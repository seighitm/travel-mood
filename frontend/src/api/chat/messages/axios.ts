import { $authHost } from '../../api';

export const getCountOfNonReadMessages = async () => {
  const { data } = await $authHost.get('/messages/non-read');
  return data;
};

export const allMessages = async (chatId: any, massagesCount?: any) => {
  const { data } = await $authHost.get(`/message/${chatId}`, {
    params: {
      massagesCount: massagesCount,
    },
  });
  return data;
};

export const sendMessage = async ({ content, chatId }: any) => {
  const { data } = await $authHost.post('/message', { content, chatId });
  return data;
};

export const readChatMessages = async (chatId: any) => {
  const { data } = await $authHost.get(`/message/read/${chatId}`);
  return data;
};
