import {$authHost} from "../../api";

export const getCountOfNonReadMessages = async () => {
  const {data} = await $authHost.get('/messages/non-read');
  return data;
};

export const allMessages = async (chatId: any) => {
  const res = await $authHost.get('/message/' + chatId);
  return res.data;
};

export const sendMessage = async ({content, chatId}: any) => {
  const {data} = await $authHost.post('/message', {content, chatId});
  return data;
};

export const getOneMessage = async (id: string | number) => {
  const {data} = await $authHost.get('/message/single/' + id);
  return data;
};

export const readChatMessages = async (chatId: any) => {
  const {data} = await $authHost.get('/message/read/' + chatId);
  return data;
};

export const readMessages = async ({firstMessageId, chatId}: any) => {
  const {data} = await $authHost.put('/messages/read', {firstMessageId, chatId});
  return data;
};
