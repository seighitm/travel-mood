import React, {Dispatch, useEffect, useState} from 'react';
import {Button, Group, ScrollArea} from '@mantine/core';
import ChatItem from './ChatItem';
import {CustomLoader} from '../common/CustomLoader';
import {useMediaQuery} from '@mantine/hooks';
import {CirclePlus, Users} from '../common/Icons';
import {useQueryClient} from 'react-query';
import {useGetCountOfNonReadMessages} from '../../api/chat/messages/queries';
import chatStore from '../../store/chat.store';
import ModalChatParticipants from './modals/ModalChatParticipants';
import ModalAdminGroupChat from './modals/ModalAdminGroupChat';
import useStore from '../../store/user.store';
import {IChat} from '../../types/IChat';

interface MyChatComponentProps {
  isDrawer?: boolean;
  isLoadingChats: boolean;
  dataFetchMyChats: IChat[];
  setOpenedDrawer?: any;
  setIsOpenedCreateChatGroupModal: any
}

const MyChat = ({
                  dataFetchMyChats,
                  isLoadingChats,
                  setOpenedDrawer,
                  isDrawer,
                  setIsOpenedCreateChatGroupModal,
                }: MyChatComponentProps) => {
  const queryClient = useQueryClient();
  const matches = useMediaQuery('(min-width: 993px)');
  const {selectedChat} = chatStore((state: any) => state);
  const {user} = useStore((state: any) => state);
  const matches2 = useMediaQuery('(min-width: 769px)');
  const [isOpenedChatDetailsModal, setIsOpenedChatDetailsModal] = useState(false);
  const {data: nonReadMessages} = useGetCountOfNonReadMessages();

  useEffect(() => {
    if (queryClient.getQueryData(['messages', 'non-read']) != undefined) {
      queryClient.invalidateQueries(['messages', 'non-read']);
    }
  }, []);

  const getChatById = (chatId: number | string) =>
    dataFetchMyChats?.find((chat: any) => chat.id == chatId);

  if (isLoadingChats)
    return <CustomLoader/>;

  return (
    <>
      {getChatById(selectedChat.id)?.groupAdmin.id != user.id ? (
        <ModalChatParticipants
          isOpenedChatDetailsModal={isOpenedChatDetailsModal}
          setIsOpenedChatDetailsModal={setIsOpenedChatDetailsModal}
          chat={getChatById(selectedChat.id)}
        />
      ) : (
        <ModalAdminGroupChat
          isOpenedChatDetailsModal={isOpenedChatDetailsModal}
          setIsOpenedChatDetailsModal={setIsOpenedChatDetailsModal}
          chat={getChatById(selectedChat.id)}
        />
      )}

      <Group mb={'sm'} style={{width: '100%'}} position={'apart'} align={'center'}>
        {matches || (isDrawer && !matches2) ? (
          <Button
            fullWidth
            leftIcon={<CirclePlus size={20}/>}
            onClick={() => {
              if (setOpenedDrawer) {
                setOpenedDrawer(false);
              }
              setIsOpenedCreateChatGroupModal(true);
            }}
          >
            New group chat
          </Button>
        ) : (
          <Group style={{width: '100%'}}>
            <Button
              fullWidth
              onClick={() => {
                if (setOpenedDrawer) {
                  setOpenedDrawer(false);
                }
                setIsOpenedCreateChatGroupModal(true);
              }}
            >
              <CirclePlus size={20}/>
            </Button>
          </Group>
        )}
      </Group>
      <ScrollArea
        offsetScrollbars
        scrollHideDelay={0}
        styles={{
          root: {
            height: 'calc(100vh - 200px)',
            width: 'auto',
            borderRadius: 0,
          },
        }}
      >
        <Group direction="column" style={{height: '11%', width: '100%'}}>
          {dataFetchMyChats &&
            dataFetchMyChats.map((chat: any) => (
              <ChatItem
                nonReadMessages={nonReadMessages}
                setOpenedDrawer={setOpenedDrawer}
                key={chat.id}
                chat={chat}
                isDrawer={isDrawer}
                matches={matches}
              />
            ))}
        </Group>
      </ScrollArea>
    </>
  );
};

export default MyChat;
