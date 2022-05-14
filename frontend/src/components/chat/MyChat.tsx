import React, {useEffect} from 'react';
import {ActionIcon, Button, Group, ScrollArea} from '@mantine/core';
import ChatItem from './ChatItem';
import {CustomLoader} from '../common/CustomLoader';
import {useDisclosure, useMediaQuery} from "@mantine/hooks";
import {InfoCircle, Users} from "../../assets/Icons";
import {useQueryClient} from "react-query";
import {useGetCountOfNonReadMessages} from "../../api/chat/messages/queries";
import chatStore from "../../store/chat.store";
import ModalChatParticipants from "./modals/ModalChatParticipants";
import ModalCreateGroupChat from "./modals/ModalCreateGroupChat";

const MyChat = ({dataFetchMyChats, isLoadingChats, setOpenedDrawer, isDrawer}: any) => {
  const queryClient = useQueryClient();
  const matches = useMediaQuery('(min-width: 1000px)');
  const {selectedChat} = chatStore((state: any) => state);

  const [openedCreateChatGroupModal, handlersCreateChatGroupModal] = useDisclosure(false);
  const [openedChatDetailsModal, handlersChatDetailsModal] = useDisclosure(false);

  const {data: nonReadMessages} = useGetCountOfNonReadMessages();

  useEffect(() => {
    queryClient.invalidateQueries(['messages', 'non-read']);
  }, [])

  if (isLoadingChats) return <CustomLoader/>;

  return <>
    <ModalChatParticipants
      openedChatDetailsModal={openedChatDetailsModal}
      handlersChatDetailsModal={handlersChatDetailsModal}
      chat={dataFetchMyChats.find((chat: any) => chat.id == selectedChat.id)}
    />

    <ModalCreateGroupChat
      openedCreateChatGroupModal={openedCreateChatGroupModal}
      handlersCreateChatGroupModal={handlersCreateChatGroupModal}
    />

    <Group
      mb={'sm'}
      style={{width: '100%'}}
      position={'apart'}
      align={'center'}
    >
      <Button
        style={{width: selectedChat?.id != -1 ? '80%' : '100%'}}
        leftIcon={<Users size={15}/>}
        onClick={() => handlersCreateChatGroupModal.open()}
      >
        New group chat
      </Button>
      {selectedChat.id != -1 &&
        <ActionIcon
          style={{width: '8%'}}
          onClick={() => handlersChatDetailsModal.open()}
        >
          <InfoCircle size={17}/>
        </ActionIcon>
      }
    </Group>
    <ScrollArea
      scrollHideDelay={0}
      offsetScrollbars
      styles={{
        root: {
          height: 'calc(100vh - 160px)',
          width: 'auto',
          borderRadius: 0
        },
        // viewport: (!matches && !isDrawer) ? {
        //   'div:first-of-type': {
        //     minWidth: 'inherit!important',
        //   }
        // } : {}
      }}
    >
      <Group direction='column' style={{height: '11%', width: '100%'}}>
        {dataFetchMyChats && dataFetchMyChats.map((chat: any) =>
          <ChatItem
            nonReadMessages={nonReadMessages}
            setOpenedDrawer={setOpenedDrawer}
            key={chat.id}
            chat={chat}
            isDrawer={isDrawer}
            matches={matches}
          />
        )}
      </Group>
    </ScrollArea>
  </>
}

export default MyChat;
