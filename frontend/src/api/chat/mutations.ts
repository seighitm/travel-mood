import {useMutation, useQueryClient} from "react-query";
import chatStore from "../../store/chat.store";
import {accessChat, addUsersToGroup, createNewGroup, removeUsersFromGroup, renameGroup} from "./axios";
import {showNotification} from "@mantine/notifications";
import useStore from "../../store/user.store";

export const useMutateAccessChat = () => {
  const queryClient = useQueryClient();
  const {user} = useStore((state: any) => state);
  const {socket} = chatStore((state: any) => state);
  const {directSetSelectedChat} = chatStore((state: any) => state);
  return useMutation('accessChat', (userId: any) => accessChat(userId), {
    onSuccess: async (data: any) => {
      socket.emit("join chat", data.id)
      socket.emit("post-reconnect-to-rooms", data?.users?.map((item: any) => item.id))
      await queryClient.invalidateQueries('fetchMyChats');
      await queryClient.invalidateQueries(['messages', 'non-read']);
      directSetSelectedChat(data);
    },
  });
};

export const useMutateCreateGroupChat = () => {
  const queryClient = useQueryClient();
  const {socket} = chatStore((state: any) => state);
  return useMutation(({users, chatName}: any) => createNewGroup({users, chatName}), {
      onSuccess: async (data: any) => {
        socket.emit("join chat", data.id)
        socket.emit("post-reconnect-to-rooms", data?.users?.map((item: any) => item.id))
        await queryClient.invalidateQueries('fetchMyChats');
        showNotification({
          title: 'Success!',
          message: undefined,
        });
      },
      onError: () => {
        showNotification({
          title: 'Error!',
          message: '',
          color: 'red',
        });
      },
    }
  );
};

export const useMutateAddUsersToGroupChat = () => {
  const queryClient = useQueryClient();
  const {user} = useStore((state: any) => state);
  const {socket} = chatStore((state: any) => state);
  const {directSetSelectedChat} = chatStore((state: any) => state);
  return useMutation('accessChat', ({chatId, usersId}: any) => addUsersToGroup({chatId, usersId}), {
    onSuccess: async (data: any) => {
      socket.emit("post-reconnect-to-rooms", data.newUsers?.map((item: any) => item))

      // for (let i = 0; i < data.newUsers.length; i++) {
      //   socket.emit("join chat", data.newUsers[i])
      // }
      // socket.emit("post-reconnect-to-rooms", data?.users?.map((item: any) => item.id))
      await queryClient.invalidateQueries('fetchMyChats');
      await queryClient.invalidateQueries(['messages', 'non-read']);
      directSetSelectedChat(data);
    },
  });
};

export const useMutateRemoveUsersFromGroupChat = (onSuccessEvent: any) => {
  const queryClient = useQueryClient();
  const {user} = useStore((state: any) => state);
  const {socket} = chatStore((state: any) => state);
  const {directSetSelectedChat} = chatStore((state: any) => state);
  return useMutation('accessChat', ({chatId, usersId}: any) => removeUsersFromGroup({chatId, usersId}), {
    onSuccess: async (data: any) => {
      socket.emit("post-reconnect-to-rooms", data.newUsers?.map((item: any) => item))
      await queryClient.invalidateQueries('fetchMyChats');
      await queryClient.invalidateQueries(['messages', 'non-read']);
      if (onSuccessEvent) onSuccessEvent()
      directSetSelectedChat(data);
    },
  });
};

export const useMutateUpdateGroupChatName = (onSuccessEvent?: any) => {
  const queryClient = useQueryClient();
  const {directSetSelectedChat} = chatStore((state: any) => state);
  return useMutation('accessChat', ({chatId, chatName}: any) => renameGroup({chatId, chatName}), {
    onSuccess: async (data: any) => {
      await queryClient.invalidateQueries('fetchMyChats');
      await queryClient.invalidateQueries(['messages', 'non-read']);
      if (onSuccessEvent) onSuccessEvent()
      directSetSelectedChat(data);
    },
    onError: (err: any) => {
      showNotification({
        title: 'Error',
        message: err.response?.data?.message,
        color: 'red',
      });
    },
  });
};
