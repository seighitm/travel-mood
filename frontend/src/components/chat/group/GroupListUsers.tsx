import React from 'react';
import { Avatar, Badge, Group, Space } from '@mantine/core';
import { StarIcon } from '@modulz/radix-icons';

function GroupListUsers({ users }: any) {
  return (
    <>
      {users &&
        users.map((user: any, index: any) => (
          <div key={user.name + '' + index}>
            <Group key={user.name + '' + user.id}>
              <Avatar color="blue" radius="xl">
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
    </>
  );
}

export default GroupListUsers;
