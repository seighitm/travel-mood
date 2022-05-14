import React, { useEffect, useState } from 'react';
import chatStore from '../../../store/chat.store';
import {
  ActionIcon,
  Avatar,
  Badge,
  Button,
  Group,
  ScrollArea,
  Space,
  TextInput,
} from '@mantine/core';
import { Cross2Icon, StarIcon } from '@modulz/radix-icons';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { addUserFromGroup, removeUserFromGroup, renameGroup } from '../../../api/chat/axios';
import { showNotification } from '@mantine/notifications';
import { getUsers } from '../../../api/users/axios';

function UpdateGroupChatModal() {
  const { selectedChat, directSetSelectedChat } = chatStore((state: any) => state);

  const [groupChatName, setGroupChatName] = useState('');

  const handlerUpdateName = () => {};

  const queryClient = useQueryClient();
  const { mutate: mutateUpdateGroup } = useMutation(
    'updateChatName',
    () => renameGroup({ chatId: selectedChat.id, chatName: groupChatName }),
    {
      onSettled: (data) => {
        queryClient.invalidateQueries('fetchMyChats');
        showNotification({
          title: 'MISA',
          message: 'Hey there, your code is awesome! 🤥',
        });
        directSetSelectedChat(data);
      },
      onError: (data) => {
        showNotification({
          title: 'MISA',
          message: 'Hey there, your code is awesome! 🤥',
          color: 'red',
        });
      },
    }
  );

  const { mutate: mutateDeleteUser } = useMutation(
    'removeUserFromGroup',
    (userId: any) => removeUserFromGroup({ chatId: selectedChat.id, userId }),
    {
      onSettled: (data) => {
        queryClient.invalidateQueries('fetchMyChats');
        showNotification({
          title: 'MISA',
          message: 'Hey there, your code is awesome! 🤥',
        });
        directSetSelectedChat(data);
      },
      onError: () => {
        showNotification({
          title: 'MISA',
          message: 'Hey there, your code is awesome! 🤥',
          color: 'red',
        });
      },
    }
  );

  const [search, setSearch] = useState('');

  const { data, isFetching, refetch } = useQuery('fetchUsers', () => getUsers(search), {
    cacheTime: Infinity,
    refetchOnWindowFocus: false,
    enabled: !!search,
  });

  useEffect(() => {
    refetch();
  }, [search]);

  const { mutate: mutateAddUser } = useMutation(
    'addUserFromGroup',
    (userId: any) => addUserFromGroup({ chatId: selectedChat.id, userId }),
    {
      onSettled: (data) => {
        queryClient.invalidateQueries('fetchMyChats');
        showNotification({
          title: 'MISA',
          message: 'Hey there, your code is awesome! 🤥',
        });
        directSetSelectedChat(data);
      },
      onError: () => {
        showNotification({
          title: 'MISA',
          message: 'Hey there, your code is awesome! 🤥',
          color: 'red',
        });
      },
    }
  );

  return (
    <>
      {selectedChat && (
        <>
          <div>{selectedChat.chatName}</div>
          <TextInput
            label="ChatName"
            value={groupChatName}
            onChange={(e: any) => setGroupChatName(e.target.value)}
          />
          <Button onClick={() => mutateUpdateGroup()}>UPDATE</Button>
          {selectedChat &&
            selectedChat.users.map((user: any, index: any) => (
              <Badge
                rightSection={
                  <ActionIcon
                    onClick={() => mutateDeleteUser(user.id)}
                    size="xs"
                    color="blue"
                    radius="xl"
                    variant="transparent"
                  >
                    <Cross2Icon style={{ width: 10, height: 10 }} />
                  </ActionIcon>
                }
              >
                {user.name}
              </Badge>
            ))}
          <TextInput
            label="Users"
            description="Users"
            value={search}
            onChange={(e: any) => setSearch(e.target.value)}
          />
          <div>
            <ScrollArea style={{ height: 250, backgroundColor: '#f4e8e8', borderRadius: 5 }}>
              <Group direction="column">
                {search &&
                  data &&
                  data.map((user: any, index: any) => (
                    <div key={user.name + '' + index}>
                      <Group key={user.name + '' + user.id}>
                        <Avatar
                          onClick={() => mutateAddUser(user.id)}
                          src={'https://source.unsplash.com/random/300x300'}
                          color="blue"
                          radius="xl"
                        >
                          <StarIcon />
                        </Avatar>
                        <Group direction="column">
                          <Badge color={'red'}>{user.email}</Badge>
                          <Badge color={'green'}>{user.name}</Badge>
                        </Group>
                      </Group>
                      <Space h="md" />
                    </div>
                  ))}
              </Group>
            </ScrollArea>
          </div>
        </>
      )}
    </>
  );
}

export default UpdateGroupChatModal;
