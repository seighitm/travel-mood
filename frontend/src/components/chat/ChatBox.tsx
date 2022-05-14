import React, {useEffect, useRef, useState} from 'react';
import chatStore from '../../store/chat.store';
import {Box, Button, Divider, Group, LoadingOverlay, Paper, ScrollArea, Stack} from '@mantine/core';
import {useIsFetching, useQueryClient} from 'react-query';
import {useGetAllChatMessage} from '../../api/chat/messages/queries';
import MessageItem from './MessageItem';
import MessageInputField from './MessageInputField';
import {Check, MessageDots} from "../../assets/Icons";
import {isEmptyArray} from "../../utils/primitive-checks";

export const MessageDivider = ({messages, index}: any) => {
  return <>
    {index != 0 &&
      index != messages?.length - 1 &&
      new Date(messages[index]?.createdAt).toISOString().split('T')[0] !=
      new Date(messages[index - 1]?.createdAt).toISOString().split('T')[0] && (
        <Divider
          label={
            <Group>
              <Check size={17}/>
              {new Date(messages[index]?.createdAt).toISOString().split('T')[0]}
            </Group>
          }
          labelPosition="center"
          mt={'lg'}
          mb={'lg'}
          style={{width: '100%'}}
        />
      )}
  </>
};

let selChat: any;

const ChatBox = () => {
  const viewport: any = useRef<HTMLDivElement>();
  const queryClient = useQueryClient();
  const {socket, selectedChat, notifications, setOpenedChatDrawer} = chatStore((state: any) => state);
  const [selectedMessage, setSelectedMessage] = useState<any>(-1);

  const scrollToBottom = () => viewport?.current?.scrollTo({top: viewport.current.scrollHeight, behavior: 'smooth'});
  const {data: messages, refetch: refetchMessages, isFetching: isFetchingMessages}
    = useGetAllChatMessage(selectedChat);
  const isLoading = useIsFetching('fetchMessagesChat');

  const initSocket = async () => {
    // if (socket?._callbacks['$message-received'] == undefined)
    socket.on('message-received', async (newMessageRecieved: any) => {
      if (selChat.id == newMessageRecieved.chat.id) {
        const prevAllMessages = await queryClient.getQueryData('fetchMessagesChat');
        if (prevAllMessages) {
          await queryClient.cancelQueries('fetchMessagesChat');
          const prevMessages: any = queryClient.getQueryData('fetchMessagesChat');
          prevMessages.push({...newMessageRecieved, readBy: []});
          queryClient.setQueryData('fetchMessagesChat', () => prevMessages);
        }
      } else {
        await refetchMessages();
      }

      scrollToBottom();

      const prevAllChats: any = queryClient.getQueryData('fetchMyChats');
      if (prevAllChats) {
        await queryClient.cancelQueries('fetchMyChats');
        let foundIndex = prevAllChats.findIndex((chat: any) => chat.id == newMessageRecieved.chat.id);
        prevAllChats[foundIndex].latestMessage = {...newMessageRecieved};
        if (selChat.id != newMessageRecieved.chat.id)
          prevAllChats[foundIndex].countNonReadmessages += 1;
        queryClient.setQueryData('fetchMyChats', () => prevAllChats);
      }
      setTimeout(() => scrollToBottom(), 200)
    });
    setTimeout(() => scrollToBottom(), 200)
  };

  const checkIsRead = (notificationDate: any, messageDate: any) => {
    if (!notificationDate) return true;
    const x = new Date(notificationDate).toISOString().split('T');
    const y = new Date(messageDate).toISOString().split('T');
    return x[1] > y[1];
  };

  useEffect(() => {
    initSocket();
  }, []);

  useEffect(() => {
    if (!isLoading) scrollToBottom();
  }, [isLoading]);

  useEffect(() => {
    selChat = selectedChat;
    refetchMessages();
    scrollToBottom();
  }, [selectedChat, selChat]);

  return (
    <Group style={{height: '87vh'}} grow direction={'row'}>
      {selectedChat.id != -1
        ? <>
          <ScrollArea
            viewportRef={viewport}
            offsetScrollbars
            pt={'sm'}
            px={'xl'}
            sx={(theme: any) => ({
              border: '2px solid ',
              width: '100%',
              height: 'calc(100vh - 190px)',
              boxShadow: theme.shadows.lg,
              borderColor: theme.colorScheme === 'dark' ? theme.colors.gray[8] : theme.colors.gray[2],
              backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,
              borderRadius: theme.radius.md,
            })}
          >
            <LoadingOverlay visible={isFetchingMessages}/>
            <Box mb={40}>
              {messages && messages.map((item: any, index: number) => (
                <Box key={item.createdAt}>
                  <MessageDivider messages={messages} index={index}/>
                  <MessageItem
                    selectedMessage={selectedMessage}
                    setSelectedMessage={setSelectedMessage}
                    key={item?.id}
                    message={item}
                    isRead={notifications ? checkIsRead(notifications[0]?.createdAt, item.createdAt) : false}
                  />
                </Box>
              ))}
            </Box>
          </ScrollArea>
          <MessageInputField
            selectedMessage={selectedMessage}
            setSelectedMessage={setSelectedMessage}
            scrollToBottom={scrollToBottom}
          />
        </>
        : !isEmptyArray(queryClient.getQueryData('fetchMyChats'))
          ? <Group
            position={'center'}
            pl={'sm'}
            sx={(theme) => ({
              borderRadius: theme.radius.md,
              width:'100%',
              height: '87vh',
              border: '2px solid ',
              borderColor: theme.colorScheme === 'dark' ? theme.colors.gray[8] : theme.colors.gray[2],
              position: 'relative',
              backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
            })}
          >
            <Button
              size={'xl'}
              compact
              variant={'subtle'}
              onClick={() => setOpenedChatDrawer(true)}
              rightIcon={<MessageDots size={17}/>}
            >
              Select chat
            </Button>
          </Group>
          : <Stack style={{width: '100%', height: '70vh'}} justify={'center'} align={'center'}>
            <Button
              size={'xl'}
              variant={'subtle'}
              onClick={() => setOpenedChatDrawer(true)}
              rightIcon={<MessageDots size={17}/>}
            >
              Select chat
            </Button>
          </Stack>
      }
    </Group>
  );
}

export default ChatBox;
