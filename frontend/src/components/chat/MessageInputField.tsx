import React, {useEffect, useRef, useState} from 'react';
import {ActionIcon, Grid, Group, Paper, Textarea} from '@mantine/core';
import {useGetAllChatMessage} from '../../api/chat/messages/queries';
import {useMuateteReadMessages, useMutateSendMessage} from '../../api/chat/messages/mutations';
import chatStore from '../../store/chat.store';
import {PaperPlaneIcon} from "@modulz/radix-icons";
import {useMediaQuery} from "@mantine/hooks";

const MessageInputField = ({scrollToBottom}: any) => {
  const [newMessage, setNewMessage] = useState<string>('');
  const {selectedChat} = chatStore((state: any) => state);
  const {mutate: mutateSendMessage} = useMutateSendMessage(scrollToBottom);
  const {mutate: mutateRead} = useMuateteReadMessages()
  const {data: messages} = useGetAllChatMessage(selectedChat);

  const handlerSubmitMessage = (chatId: any) => {
    mutateSendMessage({chatId, newMessage});
    setTimeout(() => scrollToBottom(), 40)
    mutateRead(chatId)
  };
  const ref = useRef<any>();
  const matches = useMediaQuery('(min-width: 1045px)');
  const matchesMobile = useMediaQuery('(min-width: 475px)');
  console.log(ref.current?.offsetHeight)

  const [sendButtonHeight, setSendButtonHeight] = useState<any>('44')

  useEffect(() => {
    setSendButtonHeight(ref.current?.offsetHeight)
  }, [ref.current?.offsetHeight])

  return (
    <Paper
      radius={'md'}
      style={{width: '100%'}}
    >
      <Grid grow align={'center'}>
        <Grid.Col p={0} span={!matchesMobile
          ? 9
          : matches ? 11 : 10
        }>
          <div ref={ref}>
            <Textarea
              ml={5}
              minRows={1}
              maxRows={2}
              autosize
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Message"
            />
          </div>
        </Grid.Col>
        <Grid.Col span={!matchesMobile
          ? 3
          : matches ? 1 : 2
        }>
          <Group grow>
            <ActionIcon
              radius={'sm'}
              // size={'xl'}
              onClick={() => {
                handlerSubmitMessage(selectedChat.id);
              }}
              sx={(theme) => ({
                height: sendButtonHeight + 'px',
                // maxHeight: '50px',
                // border: '2px solid ',
                // borderColor: theme.colorScheme === 'dark' ? theme.colors.gray[8] : theme.colors.gray[2],
                backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
                '&:hover': {
                  backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1],
                  border: '1px solid ' + (theme.colorScheme === 'light' ? theme.colors.gray[5] : theme.colors.gray[7]),
                }
              })}
            >
              <PaperPlaneIcon style={{width: '17px', height: '17px'}}/>
            </ActionIcon>
          </Group>
        </Grid.Col>
      </Grid>
    </Paper>
  );
};

export default MessageInputField;
