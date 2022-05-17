import React, {useEffect} from 'react';
import {Button, Text, Group, RingProgress, ScrollArea} from '@mantine/core';
import ChatItem from './ChatItem';
import {CustomLoader} from '../common/CustomLoader';
import {useDisclosure, useMediaQuery} from "@mantine/hooks";
import {InfoCircle, Users} from "../../assets/Icons";
import {useQueryClient} from "react-query";
import {useGetCountOfNonReadMessages} from "../../api/chat/messages/queries";
import chatStore from "../../store/chat.store";
import ModalChatParticipants from "./modals/ModalChatParticipants";
import ModalAdminGroupChat from "./modals/ModalAdminGroupChat";
import useStore from "../../store/user.store";

const MyChat = ({
                  dataFetchMyChats,
                  isLoadingChats,
                  setOpenedDrawer,
                  isDrawer,
                  openedCreateChatGroupModal,
                  handlersCreateChatGroupModal
                }: any) => {
  const queryClient = useQueryClient();

  const matches = useMediaQuery('(min-width: 1000px)');
  const {selectedChat} = chatStore((state: any) => state);
  const {user, setOnlineUsers, fetchUser} = useStore((state: any) => state);

  const [openedChatDetailsModal, handlersChatDetailsModal] = useDisclosure(false);

  const {data: nonReadMessages} = useGetCountOfNonReadMessages();

  useEffect(() => {
    queryClient.invalidateQueries(['messages', 'non-read']);
  }, [])

  const getChatById = (chatId: number | string) => dataFetchMyChats?.find((chat: any) => chat.id == chatId)
  // console.log(getChatById(selectedChat.id)?.groupAdmin.id)
  // console.log(user?.id)
  const matches2 = useMediaQuery('(min-width: 769px)');


  if (isLoadingChats) return <CustomLoader/>;

  return <>
    <RingProgress
      label={
        <Text size="xs" align="center">
          Application data usage
        </Text>
      }
      sections={[
        { value: 40, color: 'cyan' },
        { value: 15, color: 'orange' },
        { value: 15, color: 'grape' },
      ]}
    />
    {getChatById(selectedChat.id)?.groupAdmin.id != user.id
      ? <ModalChatParticipants
        openedChatDetailsModal={openedChatDetailsModal}
        handlersChatDetailsModal={handlersChatDetailsModal}
        chat={getChatById(selectedChat.id)}
      />
      : <ModalAdminGroupChat
        openedChatDetailsModal={openedChatDetailsModal}
        handlersChatDetailsModal={handlersChatDetailsModal}
        chat={getChatById(selectedChat.id)}
      />
    }

    <Group
      mb={'sm'}
      style={{width: '100%'}}
      position={'apart'}
      align={'center'}
    >
      {(matches || (isDrawer && !matches2))
        ? <Button
          fullWidth
          // style={{width: selectedChat?.id != -1 ? '80%' : '100%'}}
          leftIcon={<Users size={15}/>}
          onClick={() => {
            if (setOpenedDrawer) setOpenedDrawer(false)
            handlersCreateChatGroupModal.open()
          }}
        >
          New group chat
        </Button>
        : <Group style={{width: '100%'}}>
          <Button fullWidth onClick={() => {
            if (setOpenedDrawer) setOpenedDrawer(false)
            handlersCreateChatGroupModal.open()
          }}>
            <Users size={20}/>
          </Button>
        </Group>
      }

      {selectedChat.id != -1 &&
        <>
          {(matches || (isDrawer && !matches2))
            ? <Button
              fullWidth
              // style={{width: selectedChat?.id != -1 ? '80%' : '100%'}}
              variant={'outline'} color={'pink'} leftIcon={<InfoCircle size={20}/>}
              onClick={() => {
                // if (setOpenedDrawer) setOpenedDrawer(false)
                handlersChatDetailsModal.open()
              }}
            >
              Details of current chat
            </Button>
            : <Group style={{width: '100%'}}>
              <Button fullWidth
                      variant={'outline'} color={'pink'}
                      onClick={() => {
                        // if (setOpenedDrawer) setOpenedDrawer(false)
                        handlersChatDetailsModal.open()
                      }}
              >
                <InfoCircle size={20}/>
              </Button>
            </Group>
          }
        </>
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
