import React, {useEffect} from 'react';
import {Avatar, AvatarsGroup, Box, Group, Indicator, Text, TypographyStylesProvider,} from '@mantine/core';
import chatStore from '../../store/chat.store';
import useStore from '../../store/user.store';
import {cutString, userPicture} from '../common/Utils';
import {useMuateteReadMessages} from "../../api/chat/messages/mutations";
import {useMediaQuery} from "@mantine/hooks";
import {Mail, MessageDots} from "../../assets/Icons";

const ChatItem = ({chat, setOpenedDrawer, isDrawer, matches, nonReadMessages}: any) => {
  const matches2 = useMediaQuery('(max-width: 765px)');
  const {user, onlineUsers} = useStore((state: any) => state);
  const {selectedChat, directSetSelectedChat} = chatStore((state: any) => state);

  const {mutate: mutateRead} = useMuateteReadMessages()

  const openChat = async () => {
    if (setOpenedDrawer) {
      setOpenedDrawer(false)
    }
    directSetSelectedChat(chat);
  };

  const checkIfUsersIsOnline = () => {
    for(let i = 0; i< chat?.users.length; i++){
      if(chat.users[i].id != user.id && onlineUsers[chat.users[i].id])
        return true
    }
    return false
  }

  useEffect(() => {
    return () => {
      mutateRead(chat.id)
    };
  }, [selectedChat]);

  return <Box style={{width: '100%'}}>
    <TypographyStylesProvider>
      <Group
        onClick={openChat}
        position={(!matches && !matches2) ? 'center' : 'left'}
        noWrap
        spacing={'xs'}
        pr={'xs'}
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
                : theme.colors.gray[1]),
        })}
      >
        <Indicator
          offset={15}
          style={{cursor: 'pointer'}}
          px={'xs'}
          py={'sm'}
          disabled={nonReadMessages.filter((item: any) => item.chat.id == chat.id).length == 0}
          size={15}
          styles={{indicator: {padding: '0'}}}
          withBorder
          position="top-end"
          color={checkIfUsersIsOnline() ? 'green' : 'pink'}
          label={nonReadMessages.filter((item: any) => item.chat.id == chat.id).length}
        >
          {chat.users?.length == 2
            ? <Avatar
              size={'md'}
              radius="xl"
              src={userPicture(chat.users.find((item: any) => item.id != user.id))}
            />
            : <AvatarsGroup spacing={40} limit={2}>
              {chat.users?.map((item: any) =>
                <Avatar
                  size={'md'}
                  radius="xl"
                  src={userPicture(item)}
                />
              )}
            </AvatarsGroup>
          }
        </Indicator>
        {(isDrawer || matches) &&
          <Box style={{cursor: 'pointer',}}>
            <Group noWrap spacing={10} mt={3}>
              <Mail size={17}/>
              <Text lineClamp={1} size="sm" sx={{textTransform: 'uppercase'}} weight={700}>
                {cutString(chat.chatName, 10)}
              </Text>
            </Group>
            <Group noWrap spacing={10} mt={3}>
              <MessageDots size={17}/>
              <Text size="xs" weight={500} color="dimmed">
                {cutString(chat?.latestMessage?.content, 10)}
              </Text>
            </Group>
          </Box>
        }
      </Group>
    </TypographyStylesProvider>
  </Box>
};

export default ChatItem;
