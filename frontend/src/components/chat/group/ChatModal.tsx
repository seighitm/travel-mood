import React, { useState } from 'react';
import { showNotification } from '@mantine/notifications';
import { getUsers } from '../../../api/users/axios';
import { Avatar, Badge, Button, Group, Skeleton, Space, TextInput } from '@mantine/core';
import { StarIcon } from '@modulz/radix-icons';
import chatStore from '../../../store/chat.store';
import { useMutation, useQueryClient } from 'react-query';
import { accessChat } from '../../../api/chat/axios';

function ChatModal() {
  const queryClient = useQueryClient();

  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const { directSetSelectedChat } = chatStore((state: any) => state);

  const handlerSearch = async () => {
    if (!search) {
      showNotification({
        title: 'MISA',
        message: 'Hey there, your code is awesome! 🤥',
        color: 'red',
      });
      return;
    }
    try {
      setLoading(true);
      const data = await getUsers(search);
      setLoading(false);
      setSearchResult(data);
    } catch (err) {
      showNotification({
        title: 'MISA',
        message: 'Hey there, your code is awesome! 🤥',
        color: 'red',
      });
    }
  };

  const { mutate: mutateFavorite, data } = useMutation(
    'accessChat',
    (userId: any) => accessChat(userId),
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
    <div>
      <Group>
        <TextInput
          label="Search"
          description="Search input"
          value={search}
          onChange={(e: any) => setSearch(e.target.value)}
        />
        <Button onClick={handlerSearch}>SEARCH</Button>
      </Group>
      {loading ? (
        <>
          <Skeleton mt={6} height={8} radius="xl" />
          <Skeleton mt={6} height={8} radius="xl" />
          <Skeleton mt={6} height={8} radius="xl" />
          <Skeleton mt={6} height={8} radius="xl" />
          <Skeleton mt={6} height={8} radius="xl" />
          <Skeleton mt={6} height={8} radius="xl" />
          <Skeleton mt={6} height={8} radius="xl" />
        </>
      ) : (
        <Group direction="column">
          {searchResult &&
            searchResult.map((user: any, index: any) => (
              <div key={user.name + '' + index}>
                <Group key={user.name + '' + user.id}>
                  <Avatar onClick={() => mutateFavorite(user.id)} color="blue" radius="xl">
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
      )}
    </div>
  );
}

export default ChatModal;
