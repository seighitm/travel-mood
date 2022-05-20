import React from 'react';
import {Avatar, Badge, Button, Group, Indicator, Paper, SimpleGrid, Text, UnstyledButton,} from '@mantine/core';
import {useMutateAccessChat} from '../../api/chat/mutations';
import useStore from '../../store/user.store';
import {useNavigate} from 'react-router-dom';
import {userPicture} from "../common/Utils";
import {useFollowMutate, useUnFollowMutate} from "../../api/users/mutations";
import {MessageDots, Star} from "../../assets/Icons";
import {isNullOrUndefined} from "../../utils/primitive-checks";

interface UserCardComponentProps {
  picture: string;
  name: string;
  id: number;
  onlineUsers: any
  isFollowedByUser: boolean;
  role: string;
}

export function UserCard({role, picture, name, id, isFollowedByUser, onlineUsers}: UserCardComponentProps) {
  const navigate = useNavigate();

  console.log(role)

  const {user} = useStore((state: any) => state);
  const {mutate: mutateAccessChat} = useMutateAccessChat();

  const {mutate: mutateFollow} = useFollowMutate('follow');
  const {mutate: mutateUnFollow} = useUnFollowMutate('unFollow');

  const handlerFollower = (id: number) => {
    if (isFollowedByUser) {
      mutateUnFollow(id);
    } else {
      mutateFollow(id);
    }
  };

  const handlerAccessChat = () => {
    navigate('/chat/' + id)
    mutateAccessChat(id)
  }

  return (
    <Paper
      radius="md"
      withBorder
      p="lg"
      sx={(theme) => ({
        position: 'relative',
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
      })}
    >
      {!isNullOrUndefined(role) && role == 'ADMIN' &&
        <Badge style={{position: 'absolute'}} size={'lg'} color="pink">
          {role}
        </Badge>
      }
      <Group position="center">
        <Indicator
          size={20}
          disabled={!user}
          withBorder
          position="bottom-center"
          color={(onlineUsers[id] && onlineUsers[id] != undefined) ? 'green' : 'pink'}
          label={(onlineUsers[id] && onlineUsers[id] != undefined) ? 'online' : 'offline'}
        >
          <Avatar
            src={userPicture({picture})}
            size={100}
            radius={120}
            mx="auto"
          />
        </Indicator>
      </Group>
      <Group position={'center'}>
        <UnstyledButton>
          <Text
            onClick={() => navigate('/user/' + id)}
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

      {user &&
        <SimpleGrid mt={'sm'} cols={2}>
          <Button
            compact
            variant={'subtle'}
            onClick={handlerAccessChat}
            leftIcon={<MessageDots size={15}/>}
          >
            Chat
          </Button>

          <Button
            color={'pink'}
            compact
            variant={isFollowedByUser ? 'outline' : 'subtle'}
            onClick={() => handlerFollower(id)}
            leftIcon={<Star size={15} fill={isFollowedByUser ? 'red' : 'none'}/>}
          >
            {isFollowedByUser ? 'UnFollow' : 'Follow'}
          </Button>
        </SimpleGrid>
      }
    </Paper>
  );
}

