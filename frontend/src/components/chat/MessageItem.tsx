import React from 'react';
import {Avatar, Box, Group, Text, Transition, TypographyStylesProvider} from '@mantine/core';
import useStore from '../../store/user.store';
import {useNavigate} from 'react-router-dom';
import {useClickOutside} from '@mantine/hooks';
import {userPicture} from "../common/Utils";

function MessageItem({message, isRead, selectedMessage, setSelectedMessage}: any) {
  const {user} = useStore((state: any) => state);
  const navigate = useNavigate();
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
        style={{
          justifyContent: 'flex-end',
          alignSelf: user.id == message?.user?.id ? 'end' : 'start',
          flexDirection: user.id == message?.user?.id ? 'row' : 'row-reverse',
        }}
      >
        <Group
          spacing={3}
          align={'end'}
          direction={'column'}
          style={{position: 'relative'}}
        >
          <TypographyStylesProvider>
            <Group position={'right'}>
              <Group
                position={'right'}
                px={'sm'}
                py={7}
                style={{cursor: 'pointer'}}
                onClick={() => setSelectedMessage(message.id)}
                key={message.content + '' + message.userId}
                sx={(theme) => ({
                  // width: '88%',
                  backgroundColor:
                    theme.colorScheme === 'dark'
                      ? isRead
                        ? theme.colors.dark[7]
                        : theme.colors.dark[3]
                      : isRead
                        ? theme.colors.gray[2]
                        : theme.colors.gray[4],
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
                })}
              >
                <Text style={{width: 'fit-content', overflowWrap: 'anywhere'}} size='xs'>{message.content}</Text>
              </Group>
            </Group>
          </TypographyStylesProvider>

          <Transition
            mounted={selectedMessage === message.id}
            timingFunction='ease-out'
            transition={{
              in: {
                opacity: 1,
                transform: 'scaleY(1)',
                transitionDuration: '500ms',
                transitionDelay: '0s',
                animationDelay: '0s',
                msTransitionDelay: '0s',
              },
              out: {
                opacity: 0,
                transform: 'scaleY(0)',
                transitionDuration: '300ms',
                // position: 'absolute',
                // transform: 'scaleY(0)',
                // transitionDuration: '0s',
                // animationDuration: "0s",
                // msTransitionDuration: '0s',
                // transitionDelay: '0s',
                // animationDelay: '0s',
                // msTransitionDelay: '0s'
              },
              common: {transformOrigin: 'top'},
              transitionProperty: 'transform, opacity',
            }}
          >
            {(styles) => (
              <Box ref={ref} style={{...styles}}>
                <TypographyStylesProvider>
                  <Text size={'xs'}>
                    {days[new Date(message?.createdAt).getDay()] + ' ' + time[0] + ':' + time[1]}
                  </Text>
                </TypographyStylesProvider>
              </Box>
            )}
          </Transition>
        </Group>

        <Box>
          <TypographyStylesProvider>
            <Avatar
              style={{cursor: 'pointer'}}
              size={20}
              radius='xl'
              onClick={() => navigate('user/' + message?.user?.id)}
              src={userPicture(message?.user)}
              sx={(theme) => ({
                '&:hover': {
                  border: `1px solid ${
                    theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[7]
                  }`,
                },
              })}
            />
          </TypographyStylesProvider>
        </Box>
      </Group>
    </Group>
  );
}

export default MessageItem;
