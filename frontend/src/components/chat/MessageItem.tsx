import React, {Dispatch, memo} from 'react';
import {Avatar, Box, createStyles, Group, Text, Transition, TypographyStylesProvider} from '@mantine/core';
import useStore from '../../store/user.store';
import {useNavigate} from 'react-router-dom';
import {useClickOutside} from '@mantine/hooks';
import {IMessage} from '../../types/IMessage';
import {customNavigation, userPicture} from '../../utils/utils-func';

interface MessageItemComponentProps {
  message: IMessage;
  isRead: boolean;
  selectedMessage: string | number;
  setSelectedMessage: Dispatch<React.SetStateAction<any>>;
}

const useStyles = createStyles((theme) => ({
  messageItem: {
    boxShadow: theme.shadows.xl,
    border: `1px solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[2]
    }`,
    borderRadius: '5px',
    '&:hover': {
      backgroundColor:
        theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[1],
      border: `1px solid ${
        theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[6]
      }`,
    },
  },
  avatar: {
    '&:hover': {
      border: `1px solid ${
        theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[7]
      }`,
    },
  }
}));

const MessageItem = memo(
  ({message, isRead, selectedMessage, setSelectedMessage}: MessageItemComponentProps) => {
    const {user} = useStore((state: any) => state);
    const navigate = useNavigate();
    const {classes} = useStyles();

    const date = new Date(message.createdAt).toISOString().split('T');
    const time = date[1].split(':');
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const ref = useClickOutside(() => setSelectedMessage(-1));

    return (
      <Group
        style={{width: '100%'}}
        noWrap
        position={user.id == message?.user?.id ? 'right' : 'left'}
      >
        <Group
          noWrap
          mb={3}
          align={'flex-start'}
          style={{
            justifyContent: 'flex-end',
            alignSelf: user.id == message?.user?.id ? 'end' : 'start',
            flexDirection: user.id == message?.user?.id ? 'row' : 'row-reverse',
          }}
        >
          <Group
            spacing={3}
            align={user.id == message?.user?.id ? 'flex-end' : 'flex-start'}
            direction={'column'}
            style={{position: 'relative'}}
          >
            <TypographyStylesProvider>
              <Group position={'right'}>
                <Group
                  p={6}
                  mb={5}
                  style={{cursor: 'pointer'}}
                  onClick={() => setSelectedMessage(message.id)}
                  key={message.content + '' + message.userId}
                  className={classes.messageItem}
                  sx={(theme) => ({
                    backgroundColor:
                      theme.colorScheme === 'dark'
                        ? isRead
                          ? theme.colors.dark[7]
                          : theme.colors.dark[3]
                        : isRead
                          ? theme.colors.gray[2]
                          : theme.colors.gray[4],
                  })}
                >
                  <Text style={{width: 'fit-content', overflowWrap: 'anywhere'}} size="xs">
                    {message.content}
                  </Text>
                </Group>
              </Group>
            </TypographyStylesProvider>

            <Transition
              mounted={selectedMessage === message.id}
              timingFunction="ease-out"
              transition="fade"
              duration={1000}
              exitDuration={100}
            >
              {(styles) => (
                <Box ref={ref} style={{...styles}}>
                  <TypographyStylesProvider>
                    <Text size={'xs'}>
                      {days[new Date(message?.createdAt).getDay()] +
                        ' ' +
                        (Number(time[0]) + 3) +
                        ':' +
                        time[1]}
                    </Text>
                  </TypographyStylesProvider>
                </Box>
              )}
            </Transition>
          </Group>

          <Group>
            <TypographyStylesProvider>
              <Avatar
                style={{cursor: 'pointer'}}
                size={20}
                radius="xl"
                onClick={() => customNavigation(user?.role, navigate, '/users/' + message?.user?.id)}
                src={userPicture(message?.user)}
                className={classes.avatar}
              />
            </TypographyStylesProvider>
          </Group>
        </Group>
      </Group>
    );
  }
);

export default MessageItem;
