import React, {useEffect, useRef, useState} from 'react';
import {ActionIcon, createStyles, Grid, Group, Paper, Textarea} from '@mantine/core';
import {useMutateReadMessages, useMutateSendMessage} from '../../api/chat/messages/mutations';
import chatStore from '../../store/chat.store';
import {getHotkeyHandler, useMediaQuery} from '@mantine/hooks';
import {Send} from '../common/Icons';

interface MessageInputFieldComponentProps {
  scrollToBottom: () => void;
}

const useStyles = createStyles((theme) => ({
  sendButton: {
    border: '2px solid ',
    borderColor:
      theme.colorScheme === 'dark' ? theme.colors.gray[8] : theme.colors.gray[2],
    backgroundColor:
      theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
    '&:hover': {
      backgroundColor:
        theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1],
      border:
        '1px solid ' +
        (theme.colorScheme === 'light' ? theme.colors.gray[5] : theme.colors.gray[7]),
    },
  },
}));

const MessageInputField = ({scrollToBottom}: MessageInputFieldComponentProps) => {
  const ref = useRef<any>();
  const {classes} = useStyles();

  const matches = useMediaQuery('(min-width: 1045px)');
  const matchesMobile = useMediaQuery('(min-width: 475px)');
  const {selectedChat} = chatStore((state: any) => state);

  const [sendButtonHeight, setSendButtonHeight] = useState<any>('44');
  const [newMessage, setNewMessage] = useState<string>('');

  const {mutate: mutateSendMessage, isLoading: isLoadingSendMessage} = useMutateSendMessage(scrollToBottom);
  const {mutate: mutateRead} = useMutateReadMessages();

  const handlerSubmitMessage = (chatId: any) => {
    if (newMessage != '') {
      mutateSendMessage({chatId, newMessage});
      setTimeout(() => scrollToBottom(), 40);
      mutateRead(chatId);
      setNewMessage('');
    }
  };

  useEffect(() => {
    setSendButtonHeight(ref.current?.offsetHeight);
  }, [ref.current?.offsetHeight]);

  return (
    <Paper radius={'md'} style={{width: '100%'}}>
      <Grid grow align={'center'}>
        <Grid.Col p={0} span={!matchesMobile ? 9 : matches ? 11 : 10}>
          <div ref={ref}>
            <Textarea
              onKeyDown={getHotkeyHandler([['Enter', () => handlerSubmitMessage(selectedChat.id)]])}
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
        <Grid.Col span={!matchesMobile ? 3 : matches ? 1 : 2}>
          <Group grow>
            <ActionIcon
              loading={isLoadingSendMessage}
              radius={'sm'}
              onClick={() => handlerSubmitMessage(selectedChat.id)}
              className={classes.sendButton}
              style={{height: sendButtonHeight + 'px'}}
            >
              <Send size={17}/>
            </ActionIcon>
          </Group>
        </Grid.Col>
      </Grid>
    </Paper>
  );
};

export default MessageInputField;
