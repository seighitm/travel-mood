import React from 'react';
import {Avatar, Badge, Button, Group, Indicator, Paper, SimpleGrid, Text, UnstyledButton,} from '@mantine/core';
import {useMutateAccessChat} from '../../api/chat/mutations';
import useStore from '../../store/user.store';
import {useNavigate} from 'react-router-dom';
import {useFollowMutate, useUnFollowMutate} from '../../api/users/mutations';
import {MessageDots, Star} from '../common/Icons';
import {isNullOrUndefined} from '../../utils/primitive-checks';
import {IUser} from '../../types/IUser';
import {customNavigation, userPicture} from '../../utils/utils-func';

export function UserCard({
                           role,
                           picture,
                           name,
                           id,
                           isFollowedByUser,
                           onlineUsers,
                           folloers,
                           gender,
                         }: IUser | any) {
  const navigate = useNavigate();

  const {user} = useStore((state: any) => state);
  const {mutate: mutateAccessChat} = useMutateAccessChat();

  const {mutate: mutateFollow, isLoading: isLoadingFollow} = useFollowMutate();
  const {mutate: mutateUnFollow, isLoading: isLoadingUnFollow} = useUnFollowMutate();

  const handlerFollower = (id: number) => {
    if (isFollowedByUser) {
      mutateUnFollow(id);
    } else {
      mutateFollow(id);
    }
  };

  const handlerAccessChat = () => {
    customNavigation(user?.role, navigate, '/chat/' + id);
    mutateAccessChat(id);
  };

  return (
    <Paper
      radius="md"
      withBorder
      shadow={'sm'}
      p="lg"
      sx={(theme) => ({
        border:
          '1px solid ' +
          (theme.colorScheme === 'light' ? theme.colors.gray[4] : theme.colors.gray[7]),
        position: 'relative',
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
      })}
    >
      {!isNullOrUndefined(role) && role == 'ADMIN' && (
        <Badge style={{position: 'absolute'}} size={'lg'} color="blue">
          {role}
        </Badge>
      )}
      <Group position="center">
        <Indicator
          size={20}
          disabled={!user}
          withBorder
          styles={{
            indicator: {
              padding: '0px 5px',
            },
          }}
          position="bottom-center"
          color={onlineUsers[id] && onlineUsers[id] != undefined ? 'green' : 'pink'}
          label={onlineUsers[id] && onlineUsers[id] != undefined ? 'online' : 'offline'}
        >
          <Avatar
            src={userPicture({gender, picture})}
            onClick={() => customNavigation(user?.role, navigate, '/users/' + id)}
            style={{cursor: 'pointer'}}
            size={100}
            radius={120}
            mx="auto"
          />
        </Indicator>
      </Group>
      <Group position={'center'}>
        <UnstyledButton>
          <Text
            onClick={() => customNavigation(user?.role, navigate, '/users/' + id)}
            align="center"
            size="lg"
            weight={500}
            mt="md"
            lineClamp={1}
          >
            {name}
          </Text>
        </UnstyledButton>
      </Group>

      {user && (
        <SimpleGrid spacing={'xs'} mt={'sm'} cols={2}>
          <Button
            compact
            variant={'subtle'}
            onClick={handlerAccessChat}
            leftIcon={<MessageDots size={15}/>}
          >
            Chat
          </Button>

          <Button
            loading={isLoadingFollow || isLoadingUnFollow}
            color={'pink'}
            compact
            variant={isFollowedByUser ? 'outline' : 'subtle'}
            onClick={() => handlerFollower(id)}
            leftIcon={<Star size={15} fill={isFollowedByUser ? 'red' : 'none'}/>}
          >
            {isFollowedByUser ? 'UnFollow' : 'Follow'}{' '}
            {folloers.length != 0 ? '(' + folloers.length + ')' : ''}
          </Button>
        </SimpleGrid>
      )}
    </Paper>
  );
}
