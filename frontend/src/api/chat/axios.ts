import { $authHost } from '../api';

export const apiGetChats = async () => {
  const { data } = await $authHost.get('/chat');
  return data;
};

export const apiCreatePrivateChat = async (userId: any) => {
  const { data } = await $authHost.post('/chat', { userId });
  return data;
};

export const apiCreateGroupChat = async ({
  users,
  chatName,
}: { users: any; chatName: string } | any) => {
  const { data } = await $authHost.post('/chat/group', { users: users, chatName: chatName });
  return data;
};

export const apiAddUsersToGroupChat = async ({
  chatId,
  usersId,
}: {
  chatId: string | number;
  usersId: string[] | number[];
}) => {
  const { data } = await $authHost.put('/chat/group/users', { chatId: chatId, usersId: usersId });
  return data;
};

export const apiRemoveUsersFromGroup = async ({
  chatId,
  usersId,
}: {
  chatId: string | number;
  usersId: string[] | number[];
}) => {
  const { data } = await $authHost.delete('/chat/group/users', {
    data: { chatId: chatId, usersId: usersId },
  });
  return data;
};

export const apiRenameChatGroup = async ({
  chatId,
  chatName,
}: {
  chatId: string | number;
  chatName: string;
}) => {
  const { data } = await $authHost.put('/chat/group', { chatId: chatId, chatName: chatName });
  return data;
};
