import React, {useCallback} from 'react';
import {Button, Grid, Stack, Text, Title} from '@mantine/core';
import chatStore from '../../store/chat.store';
import {useGetAllMyChats} from '../../api/chat/queries';
import {useMediaQuery} from "@mantine/hooks";
import MyChat from "./MyChat";
import ChatBox from "./ChatBox";
import {ChevronRight} from "../../assets/Icons";
import {useNavigate} from "react-router-dom";
import {isEmptyArray, isNullOrUndefined} from "../../utils/primitive-checks";
import ChatDrawer from "./ChatDrawer";

function ChatPage() {
  const navigate = useNavigate();
  const {socket} = chatStore((state: any) => state);
  const matches = useMediaQuery('(min-width: 768px)');
  const {data: dataFetchMyChats, isLoading: isLoadingChats} = useGetAllMyChats();

  useCallback(() => {
    if (!isNullOrUndefined(socket)) {
      socket.emit('get-online-users');
    }
  }, [socket]);

  if (!isLoadingChats && isEmptyArray(dataFetchMyChats))
    return <Stack
      justify={'center'}
      align='center'
      sx={{height: 'calc(100vh - 200px)'}}
    >
      <Title order={2}>
        <Text
          color='blue'
          inherit
          component='span'
        >
          You haven't started any conversations
        </Text>
      </Title>
      <Button
        variant={'subtle'}
        rightIcon={<ChevronRight size={17}/>}
        onClick={() => navigate('/users')}
      >
        Start new conversation
      </Button>
    </Stack>;

  return <>
    {!matches &&
      <ChatDrawer
        dataFetchMyChats={dataFetchMyChats}
        isLoadingChats={isLoadingChats}
      />
    }
    <Grid style={{height: '95%'}} justify='space-between' columns={32}>
      {matches &&
        <Grid.Col xs={0} sm={5} md={8} lg={7} xl={6}>
          <MyChat
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
