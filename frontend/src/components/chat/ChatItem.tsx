import React, {Dispatch, useEffect} from 'react';
import {
  Avatar,
  AvatarsGroup,
  Badge,
  Box,
  Center,
  Group,
  Indicator,
  RingProgress,
  Text,
  Tooltip,
  TypographyStylesProvider,
} from '@mantine/core';
import chatStore from '../../store/chat.store';
import useStore from '../../store/user.store';
import {useMutateReadMessages} from '../../api/chat/messages/mutations';
import {useMediaQuery} from '@mantine/hooks';
import {Mail, MessageDots} from '../common/Icons';
import {IChat} from '../../types/IChat';
import {cutString, userPicture} from '../../utils/utils-func';

interface ChatItemComponentProps {
  chat: IChat;
  isDrawer?: boolean;
  matches: boolean;
  nonReadMessages: any;
  setOpenedDrawer?: Dispatch<React.SetStateAction<any>>;
}

const ChatItem = ({
                    chat,
                    setOpenedDrawer,
                    isDrawer,
                    matches,
                    nonReadMessages,
                  }: ChatItemComponentProps) => {
  const matchesMobile = useMediaQuery('(max-width: 765px)');
  const {user, onlineUsers} = useStore((state: any) => state);
  const {selectedChat, directSetSelectedChat} = chatStore((state: any) => state);

  const {mutate: mutateRead} = useMutateReadMessages();

  const openChat = async () => {
    if (setOpenedDrawer) {
      setOpenedDrawer(false);
    }
    directSetSelectedChat(chat);
  };

  const checkIfUsersIsOnline = () => {
    for (let i = 0; i < chat?.users.length; i++) {
      if (chat.users[i].id != user.id && onlineUsers[chat.users[i].id]) return true;
    }
    return false;
  };

  useEffect(() => {
    if (chat.id == selectedChat.id) {
      setTimeout(() => {
        mutateRead(chat.id);
      }, 3000);
    }
  }, [selectedChat]);

  return (
    <Box style={{width: '100%'}}>
      <TypographyStylesProvider>
        <Group
          px={5}
          spacing={(matches && chat.users?.length == 2) ? 'md' : 0}
          onClick={openChat}
          position={!matches && !matchesMobile ? 'center' : 'left'}
          noWrap
          direction={!(isDrawer || matches) ? 'column' : 'row'}
          sx={(theme) => ({
            width: !matches ? 'fill-content' : '100%',
            borderRadius: 5,
            cursor: 'pointer',
            backgroundColor:
              theme.colorScheme === 'dark'
                ? selectedChat?.id == chat?.id
                  ? theme.colors.dark[9]
                  : theme.colors.dark[5]
                : selectedChat?.id == chat?.id
                  ? theme.colors.gray[2]
                  : theme.white,
            border:
              `solid 2px` +
              (selectedChat.id == chat.id
                ? theme.colorScheme === 'dark'
                  ? theme.colors.gray[7]
                  : theme.colors.gray[5]
                : theme.colorScheme === 'dark'
                  ? theme.colors.dark[6]
                  : theme.colors.gray[2]),
          })}
        >
          <Indicator
            offset={chat?.users?.length == 2 ? 10 : 5}
            style={{cursor: 'pointer'}}
            disabled={
              selectedChat?.id == chat.id ||
              nonReadMessages?.filter((item: any) => item.chat.id == chat.id).length == 0
            }
            size={15}
            styles={{indicator: {padding: '0'}}}
            withBorder
            position="top-end"
            label={nonReadMessages?.filter((item: any) => item.chat.id == chat.id).length}
          >
            {chat.users?.length == 2 ? (
              <RingProgress
                thickness={5}
                size={55}
                roundCaps
                sections={[
                  {
                    value: 100,
                    color: checkIfUsersIsOnline() ? 'green' : 'red',
                  },
                ]}
                label={
                  <Center style={{position: 'relative'}}>
                    <Avatar
                      size={'md'}
                      radius="xl"
                      src={userPicture(chat.users.find((item: any) => item.id != user.id))}
                    />
                  </Center>
                }
              />

            ) : (
              <AvatarsGroup py={'xs'} spacing={40} limit={2}>
                {[...chat.users, user]?.map((item: any) => (
                  <Avatar size={'md'} radius="xl" src={userPicture(item)}/>
                ))}
              </AvatarsGroup>
            )}
          </Indicator>
          {(isDrawer || matches) && (
            <Box style={{cursor: 'pointer', width: '100%'}} pl={'xs'}>
              <Group noWrap spacing={10} mt={3}>
                <Mail size={17}/>
                {/*<Badge style={{width: 'auto'}} variant={'outline'} size={'sm'} py={0}>*/}
                <Text lineClamp={1} size="sm" sx={{textTransform: 'uppercase'}} weight={700}>
                  {/*{cutString(chat.chatName, 10)}*/}
                  {cutString(chat.chatName, 10)}
                </Text>
                {/*</Badge>*/}
              </Group>
              <Group noWrap spacing={10} mt={3}>
                <MessageDots size={17}/>
                <Text size="xs" weight={500} color="dimmed">
                  {cutString(chat?.latestMessage?.content, 10)}
                </Text>
              </Group>
            </Box>
          )}
          {!(isDrawer || matches) &&
            <Tooltip
              mb={5} py={0} my={0}
              position="bottom"
              placement="center"
              label={chat.chatName}
              withArrow
            >
              <Badge color={'gray'}>{cutString(chat.chatName, 10)}</Badge>
            </Tooltip>
          }
        </Group>
      </TypographyStylesProvider>
    </Box>
  );
};

export default ChatItem;
