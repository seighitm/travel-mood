import {useMutation, useQueryClient} from "react-query";
import chatStore from "../../store/chat.store";
import {accessChat, createNewGroup} from "./axios";
import {showNotification} from "@mantine/notifications";

export const useMutateAccessChat = () => {
  const queryClient = useQueryClient();
  const {directSetSelectedChat} = chatStore((state: any) => state);
  return useMutation('accessChat', (userId: any) => accessChat(userId), {
    onSuccess: async (data: any) => {
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

