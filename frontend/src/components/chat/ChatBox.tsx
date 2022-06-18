import React, {useEffect, useRef, useState} from 'react';
import chatStore from '../../store/chat.store';
import {Box, Button, Divider, Group, LoadingOverlay, ScrollArea, Stack} from '@mantine/core';
import {useIsFetching, useQueryClient} from 'react-query';
import {useGetAllChatMessage} from '../../api/chat/messages/queries';
import MessageItem from './MessageItem';
import MessageInputField from './MessageInputField';
import {CalendarEvent, InfoCircle, MessageDots, Refresh, Settings} from '../common/Icons';
import {isEmptyArray, isNullOrUndefined} from '../../utils/primitive-checks';
import {allMessages} from '../../api/chat/messages/axios';
import ModalChatParticipants from './modals/ModalChatParticipants';
import ModalAdminGroupChat from './modals/ModalAdminGroupChat';
import {useGetAllMyChats} from '../../api/chat/queries';
import useStore from '../../store/user.store';
import {dateFormattedToIsoString} from '../../utils/utils-func';
import {IMessage} from "../../types/IMessage";

export const MessageDivider = ({messages, index}: any) => {
  return (
    <>
      {index != 0 &&
        // index != messages?.length - 1 &&
        dateFormattedToIsoString(messages[index]?.createdAt) !=
        dateFormattedToIsoString(messages[index - 1]?.createdAt) && (
          <Divider
            label={
              <Group>
                <CalendarEvent size={17}/>
                {dateFormattedToIsoString(messages[index]?.createdAt)}
              </Group>
            }
            my={'lg'}
            labelPosition="center"
            style={{width: '100%'}}
          />
        )}
    </>
  );
};

let selChat: any;

const ChatBox = () => {
  const viewport: any = useRef<HTMLDivElement>();
  const queryClient = useQueryClient();
  const {user} = useStore((state: any) => state);
  const {selectedChat, notifications, setOpenedChatDrawer} = chatStore((state: any) => state);

  const [isOpenedChatDetailsModal, setIsOpenedChatDetailsModal] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<any>(-1);
  const [isVisibleLoadMoreButton, setIsVisibleLoadMoreButton] = useState(false);
  const [isLoadingMoreMessages, setIsLoadingMoreMessages] = useState<boolean>(false);

  const scrollToBottom = () => viewport?.current?.scrollTo({top: viewport.current.scrollHeight, behavior: 'smooth'});
  const {
    data: messages,
    refetch: refetchMessages,
    isFetching: isFetchingMessages,
  } = useGetAllChatMessage(selectedChat);
  const isLoading = useIsFetching('fetchMessagesChat');
  const {data: dataFetchMyChats} = useGetAllMyChats();

  const checkIsRead = (notificationDate: any, messageDate: any) => {
    if (!notificationDate) return true;
    return (new Date(notificationDate) > new Date(messageDate))
  };

  useEffect(() => {
    selChat = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    if (!isLoading) setTimeout(() => scrollToBottom(), 10);
  }, [notifications]);

  useEffect(() => {
    if (!isLoading) {
      scrollToBottom();
    }
  }, [isLoading]);

  useEffect(() => {
    selChat = selectedChat;
    refetchMessages();
  }, [selectedChat, selChat]);

  useEffect(() => {
    const cachedMessages: IMessage[] | undefined = queryClient.getQueryData(['fetchMessagesChat', selectedChat.id])
    if (!isNullOrUndefined(cachedMessages) && cachedMessages?.length >= 10)
      setIsVisibleLoadMoreButton(true);
    return () => {
      setIsVisibleLoadMoreButton(false);
    }
  }, [messages]);

  const fc = async () => {
    let prevAllMessages: any = await queryClient.getQueryData([
      'fetchMessagesChat',
      selectedChat.id,
    ]);
    setIsLoadingMoreMessages(true);
    const newLoadMessages = await allMessages(selectedChat.id, prevAllMessages?.length + 15);
    if (newLoadMessages.length < 15) setIsVisibleLoadMoreButton(false);
    if (prevAllMessages) {
      await queryClient.cancelQueries(['fetchMessagesChat', selectedChat.id]);
      prevAllMessages = [...newLoadMessages, ...prevAllMessages];
      queryClient.setQueryData(['fetchMessagesChat', selectedChat.id], () => prevAllMessages);
    }
    setIsLoadingMoreMessages(false);
  };
  const getChatById = (chatId: number | string) =>
    dataFetchMyChats?.find((chat: any) => chat.id == chatId);

  return (
    <>
      {getChatById(selChat?.id)?.isGroupChat &&
      getChatById(selChat?.id)?.groupAdmin.id == user.id ? (
        <ModalAdminGroupChat
          isOpenedChatDetailsModal={isOpenedChatDetailsModal}
          setIsOpenedChatDetailsModal={setIsOpenedChatDetailsModal}
          chat={getChatById(selectedChat.id)}
        />
      ) : (
        <ModalChatParticipants
          isOpenedChatDetailsModal={isOpenedChatDetailsModal}
          setIsOpenedChatDetailsModal={setIsOpenedChatDetailsModal}
          chat={getChatById(selectedChat.id)}
        />
      )}
      <Group style={{height: '86vh'}} grow direction={'row'}>
        {selectedChat.id != -1 ? (
          <>
            <ScrollArea
              viewportRef={viewport}
              offsetScrollbars
              px={'xl'}
              sx={(theme: any) => ({
                border: '2px solid ',
                width: '100%',
                height: 'calc(100vh - 170px)',
                boxShadow: theme.shadows.lg,
                borderColor:
                  theme.colorScheme === 'dark' ? theme.colors.gray[8] : theme.colors.gray[2],
                backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,
                borderRadius: theme.radius.md,
              })}
            >
              <Group position={'center'}>
                <Button
                  style={{
                    position: 'absolute',
                    left: '71%',
                    top: '-3px',
                    zIndex: '15',
                    borderRadius: '0 0 20px 20px ',
                  }}
                  variant={'filled'}
                  compact
                  disabled={isLoadingMoreMessages}
                  onClick={() => setIsOpenedChatDetailsModal(true)}
                  size={'sm'}
                >
                  {getChatById(selChat?.id)?.isGroupChat &&
                  getChatById(selChat?.id)?.groupAdmin.id == user.id ? (
                    <Settings size={15}/>
                  ) : (
                    <InfoCircle size={15}/>
                  )}
                </Button>
              </Group>
              {isVisibleLoadMoreButton &&
                !isEmptyArray(queryClient.getQueryData(['fetchMessagesChat', selectedChat.id])) && (
                  <Group position={'center'}>
                    <Button
                      compact
                      disabled={isLoadingMoreMessages}
                      onClick={() => fc()}
                      size={'sm'}
                      style={{borderRadius: '0 0 20px 20px '}}
                      variant={'filled'}
                    >
                      <Refresh/>
                    </Button>
                  </Group>
                )}

              <LoadingOverlay
                visible={
                  (isFetchingMessages &&
                    isEmptyArray(
                      queryClient.getQueryData(['fetchMessagesChat', selectedChat.id])
                    )) ||
                  isLoadingMoreMessages
                }
              />

              <Box mt={'md'} mb={40}>
                {messages &&
                  messages.map((item: any, index: number) => (
                    <Box key={item?.id}>
                      <MessageDivider messages={messages} index={index}/>
                      <MessageItem
                        selectedMessage={selectedMessage}
                        setSelectedMessage={setSelectedMessage}
                        key={item?.id}
                        message={item}
                        isRead={
                          notifications
                            ? checkIsRead(notifications[0]?.createdAt, item.createdAt)
                            : false
                        }
                      />
                    </Box>
                  ))}
              </Box>
            </ScrollArea>
            <MessageInputField scrollToBottom={scrollToBottom}/>
          </>
        ) : !isEmptyArray(queryClient.getQueryData(['chats'])) ? (
          <Group
            position={'center'}
            pl={'sm'}
            sx={(theme) => ({
              borderRadius: theme.radius.md,
              width: '100%',
              height: '86vh',
              border: '2px solid ',
              borderColor:
                theme.colorScheme === 'dark' ? theme.colors.gray[8] : theme.colors.gray[2],
              position: 'relative',
              backgroundColor:
                theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
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
        ) : (
          <Stack style={{width: '100%', height: '70vh'}} justify={'center'} align={'center'}>
            <Button
              size={'xl'}
              variant={'subtle'}
              onClick={() => setOpenedChatDrawer(true)}
              rightIcon={<MessageDots size={17}/>}
            >
              Select chat
            </Button>
          </Stack>
        )}
      </Group>
    </>
  );
};

export default ChatBox;
