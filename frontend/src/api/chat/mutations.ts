import { useMutation, useQueryClient } from 'react-query';
import chatStore from '../../store/chat.store';
import {
  apiCreatePrivateChat,
  apiAddUsersToGroupChat,
  apiCreateGroupChat,
  apiRemoveUsersFromGroup,
  apiRenameChatGroup,
} from './axios';
import { showNotification } from '@mantine/notifications';
import useStore from '../../store/user.store';
import { customNavigation } from '../../utils/utils-func';
import { useNavigate } from 'react-router-dom';

export const useMutateAccessChat = () => {
  const queryClient = useQueryClient();
  const { socket } = chatStore((state: any) => state);
  const { user } = useStore((state: any) => state);
  const navigate = useNavigate();
  const { directSetSelectedChat } = chatStore((state: any) => state);
  return useMutation(
    'accessChat',
    (userId: number | string | undefined) => apiCreatePrivateChat(userId),
    {
      onSuccess: async (data: any) => {
        socket.emit('join chat', data.id);
        socket.emit(
          'post-reconnect-to-rooms',
          data?.users?.map((item: any) => item.id)
        );
        await queryClient.invalidateQueries(['chats']);
        await queryClient.invalidateQueries(['messages', 'non-read']);
        directSetSelectedChat(data);
        customNavigation(user?.role, navigate, '/chat');
      },
    }
  );
};

export const useMutateCreateGroupChat = (onSuccessEvent?: () => void) => {
  const queryClient = useQueryClient();
  const { socket } = chatStore((state: any) => state);
  return useMutation(({ users, chatName }: any) => apiCreateGroupChat({ users, chatName }), {
    onSuccess: async (data: any) => {
      socket.emit('join chat', data.id);
      socket.emit(
        'post-reconnect-to-rooms',
        data?.users?.map((item: any) => item.id)
      );
      await queryClient.invalidateQueries(['chats']);

      if (onSuccessEvent) {
        onSuccessEvent();
      }

      showNotification({
        title: 'Chat has been created!',
        message: undefined,
      });
    },
    onError: (err: any) => {
      showNotification({
        title: 'Error!',
        message: err?.response?.data?.message,
        color: 'red',
      });
    },
  });
};

export const useMutateAddUsersToGroupChat = () => {
  const queryClient = useQueryClient();
  const { socket } = chatStore((state: any) => state);
  const { directSetSelectedChat } = chatStore((state: any) => state);
  return useMutation(
    'accessChat',
    ({ chatId, usersId }: any) => apiAddUsersToGroupChat({ chatId, usersId }),
    {
      onSuccess: async (data: any) => {
        socket.emit(
          'post-reconnect-to-rooms',
          data.newUsers?.map((item: any) => item)
        );
        await queryClient.invalidateQueries(['chats']);
        await queryClient.invalidateQueries(['messages', 'non-read']);
        directSetSelectedChat(data);
      },
    }
  );
};

export const useMutateRemoveUsersFromGroupChat = (onSuccessEvent: any) => {
  const queryClient = useQueryClient();
  const { socket } = chatStore((state: any) => state);
  const { directSetSelectedChat } = chatStore((state: any) => state);
  return useMutation(
    'accessChat',
    ({ chatId, usersId }: any) => apiRemoveUsersFromGroup({ chatId, usersId }),
    {
      onSuccess: async (data: any) => {
        socket.emit(
          'post-reconnect-to-rooms',
          data?.newUsers?.map((item: any) => item)
        );
        await queryClient.invalidateQueries(['chats']);
        await queryClient.invalidateQueries(['messages', 'non-read']);
        if (onSuccessEvent) {
          onSuccessEvent();
        }
        directSetSelectedChat(data);
      },
    }
  );
};

export const useMutateUpdateGroupChatName = (onSuccessEvent?: any) => {
  const queryClient = useQueryClient();
  const { directSetSelectedChat } = chatStore((state: any) => state);
  return useMutation(
    'accessChat',
    ({ chatId, chatName }: any) => apiRenameChatGroup({ chatId, chatName }),
    {
      onSuccess: async (data: any) => {
        await queryClient.invalidateQueries(['chats']);
        await queryClient.invalidateQueries(['messages', 'non-read']);

        if (onSuccessEvent) {
          onSuccessEvent();
        }

        directSetSelectedChat(data);
      },
      onError: (err: any) => {
        showNotification({
          title: 'Error',
          message: err.response?.data?.message,
          color: 'red',
        });
      },
    }
  );
};
