import React, { useEffect, useState } from 'react';
import { showNotification } from '@mantine/notifications';
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
import { getUsers } from '../../../api/users/axios';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { createNewGroup } from '../../../api/chat/axios';
import { Cross2Icon, StarIcon } from '@modulz/radix-icons';

function GroupChatModal() {
  const queryClient = useQueryClient();

  const [groupChatName, setGroupChatName] = useState<string>('');
  const [selectedUsers, setSelectedUsers] = useState<any>([]);
  const [search, setSearch] = useState('');

  const handleGroup = (user: any) => {
    if (selectedUsers.includes(user)) {
      showNotification({
        title: 'MISA',
        message: 'Hey there, your code is awesome! 🤥',
        color: 'red',
      });
      return;
    }
    setSelectedUsers([...selectedUsers, user]);
  };

  const handleDelete = (delUser: any) => {
    setSelectedUsers(selectedUsers.filter((item: any) => item.id !== delUser.id));
  };

  useEffect(() => {
    refetch();
  }, [search]);

  const { data, isFetching, refetch } = useQuery('fetchUsers', () => getUsers(search), {
    cacheTime: Infinity,
    refetchOnWindowFocus: false,
    // enabled: !search
  });

  const { mutate: mutateCreateGroup } = useMutation(
    'createGroupChat',
    () =>
      createNewGroup({
        users: selectedUsers?.map((item: any, index: any) => item.id),
        name: groupChatName,
      }),
    {
      onSettled: () => {
        queryClient.invalidateQueries('fetchMyChats');
        showNotification({
          title: 'MISA',
          message: 'Hey there, your code is awesome! 🤥',
        });
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

  const handleSubmit = () => {
    if (!groupChatName || !selectedUsers) {
      showNotification({
        title: 'MISA',
        message: 'Hey there, your code is awesome! 🤥',
        color: 'red',
      });
      return;
    }
    mutateCreateGroup();
  };

  const refetchUsers = async () => {
    await refetch();
  };

  return (
    <>
      <TextInput
        label="ChatName"
        description="ChatName"
        value={groupChatName}
        onChange={(e: any) => setGroupChatName(e.target.value)}
      />
      <TextInput
        label="Users"
        description="Users"
        value={search}
        onChange={(e: any) => setSearch(e.target.value)}
      />
      <Button onClick={() => mutateCreateGroup()}>SUBMIT</Button>
      {selectedUsers &&
        selectedUsers.map((user: any) => (
          <Badge
            rightSection={
              <ActionIcon
                onClick={() => handleDelete(user)}
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
      <div>
        <ScrollArea style={{ height: 250, backgroundColor: '#f4e8e8', borderRadius: 5 }}>
          <Group direction="column">
            {search &&
              data &&
              data.map((user: any, index: any) => (
                <div key={user.name + '' + index}>
                  <Group key={user.name + '' + user.id}>
                    <Avatar
                      onClick={() => handleGroup(user)}
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
  );
}

export default GroupChatModal;
