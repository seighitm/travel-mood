import {$authHost} from "../api";

export const fetchChats = async () => {
  const {data} = await $authHost.get('/chat');
  return data;
};

export const accessChat = async (userId: any) => {
  const {data} = await $authHost.post('/chat', {userId});
  return data;
};

export const createNewGroup = async ({users, chatName}: { users: any; chatName: string } | any) => {
  const {data} = await $authHost.post('/chat/group', {users: users, chatName: chatName});
  return data;
};

export const addUserFromGroup = async ({chatId, userId,}: {
  chatId: string | number;
  userId: string | number;
}) => {
  const {data} = await $authHost.put('/chat/groupadd', {chatId: chatId, userId: userId});
  return data;
};

export const renameGroup = async ({chatId, chatName}: {
  chatId: string | number;
  chatName: string;
}) => {
  const {data} = await $authHost.put('/chat/group', {chatId: chatId, chatName: chatName});
  return data;
};

export const removeUserFromGroup = async ({chatId, userId,}: {
  chatId: string | number;
  userId: string | number;
}) => {
  const {data} = await $authHost.delete('/chat/group', {data: {chatId: chatId, userId: userId}});
  return data;
};
