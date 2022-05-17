import React, {useCallback} from 'react';
import {Button, Grid, Stack, Text, Title} from '@mantine/core';
import chatStore from '../../store/chat.store';
import {useGetAllMyChats} from '../../api/chat/queries';
import {useDisclosure, useMediaQuery} from "@mantine/hooks";
import MyChat from "./MyChat";
import ChatBox from "./ChatBox";
import {ChevronRight, CirclePlus, MessageDots} from "../../assets/Icons";
import {useNavigate} from "react-router-dom";
import {isEmptyArray, isNullOrUndefined} from "../../utils/primitive-checks";
import ChatDrawer from "./ChatDrawer";
import ModalCreateGroupChat from "./modals/ModalCreateGroupChat";

function ChatPage() {
  const navigate = useNavigate();
  const {socket} = chatStore((state: any) => state);
  const matches = useMediaQuery('(min-width: 769px)');
  const {data: dataFetchMyChats, isLoading: isLoadingChats} = useGetAllMyChats();
  const [openedCreateChatGroupModal, handlersCreateChatGroupModal] = useDisclosure(false);

  useCallback(() => {
    if (!isNullOrUndefined(socket)) {
      socket.emit('get-online-users');
    }
  }, [socket]);

  if (!isLoadingChats && isEmptyArray(dataFetchMyChats))
    return <>
      <ModalCreateGroupChat
        openedCreateChatGroupModal={openedCreateChatGroupModal}
        handlersCreateChatGroupModal={handlersCreateChatGroupModal}
      />
      <Stack
        justify={'center'}
        align='center'
        sx={{height: 'calc(100vh - 200px)'}}
      >
        <Title align={'center'} order={2}>
          <Text
            align={'center'}
            color='blue'
            inherit
            component='span'
          >
            You haven't started any conversations
          </Text>
        </Title>
        <Button
          color={'gray'}
          variant={'outline'}
          rightIcon={<MessageDots size={17}/>}
          onClick={() => navigate('/users')}
        >
          Start new conversation
        </Button>
        <Button
          color={'blue'}
          variant={'subtle'}
          rightIcon={<CirclePlus size={17}/>}
          onClick={() => handlersCreateChatGroupModal.open()}
        >
          Create new Group
        </Button>
      </Stack>
    </>

  return <>
    <ModalCreateGroupChat
      openedCreateChatGroupModal={openedCreateChatGroupModal}
      handlersCreateChatGroupModal={handlersCreateChatGroupModal}
    />
    {!matches &&
      <ChatDrawer
        openedCreateChatGroupModal={openedCreateChatGroupModal}
        handlersCreateChatGroupModal={handlersCreateChatGroupModal}
        dataFetchMyChats={dataFetchMyChats}
        isLoadingChats={isLoadingChats}
      />
    }
    <Grid style={{height: '95%'}} justify='space-between' columns={32}>
      {matches &&
        <Grid.Col xs={0} sm={5} md={8} lg={7} xl={6}>
          <MyChat
            openedCreateChatGroupModal={openedCreateChatGroupModal}
            handlersCreateChatGroupModal={handlersCreateChatGroupModal}
            dataFetchMyChats={dataFetchMyChats}
            isLoadingChats={isLoadingChats}
          />
        </Grid.Col>
      }
      <Grid.Col xs={32} sm={27} md={24} lg={25} xl={26}>
        <ChatBox/>
      </Grid.Col>
    </Grid>
  </>
}

export default ChatPage;
