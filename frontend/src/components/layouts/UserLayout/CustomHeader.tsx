import React, { useEffect, useState } from 'react';
import {
  ActionIcon,
  Avatar,
  Box,
  Burger,
  Button,
  Container,
  createStyles,
  Group,
  Header,
  Indicator,
  MediaQuery,
  Menu,
  ScrollArea,
  Text,
  UnstyledButton,
} from '@mantine/core';
import { ArrowNarrowLeft, CalendarEvent, ChevronDown, MessageDots } from '../../common/Icons';
import { useLocation, useNavigate } from 'react-router-dom';
import chatStore from '../../../store/chat.store';
import useStore from '../../../store/user.store';
import { useGetCountOfNonReadMessages } from '../../../api/chat/messages/queries';
import { useMediaQuery } from '@mantine/hooks';
import { isEmptyArray, isNullOrUndefined } from '../../../utils/primitive-checks';
import { useQueryClient } from 'react-query';
import { ProfileAvatar } from '../ProfileAvatar';
import ToggleTheme from '../../common/ToggleTheme';
import { useGetAllProfileVisits } from '../../../api/users/queries';
import { USER_HEADER_LINKS } from '../../../utils/constants';
import AppLogo from '../../common/AppLogo';
import { dateFullFormattedToIsoString, userPicture } from '../../../utils/utils-func';
import { useGetUserTripsRequests } from '../../../api/trips/join-requests/queries';

const useStyles = createStyles((theme) => ({
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100%',
  },

  links: {
    [theme.fn.smallerThan('sm')]: {
      display: 'none',
    },
  },

  profileAvatar: {
    [theme.fn.smallerThan('sm')]: {
      display: 'none',
    },
  },

  burger: {
    [theme.fn.largerThan('sm')]: {
      display: 'none',
    },
  },

  link: {
    display: 'block',
    lineHeight: 1,
    padding: '8px 12px',
    borderRadius: theme.radius.sm,
    textDecoration: 'none',
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
    },
  },

  linkActive: {
    '&, &:hover': {
      backgroundColor:
        theme.colorScheme === 'dark'
          ? theme.fn.rgba(theme.colors[theme.primaryColor][9], 0.25)
          : theme.colors[theme.primaryColor][0],
      color: theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 3 : 7],
    },
  },
}));

export function CustomHeader({ setOpenedDrawer, openedDrawer }: any) {
  const location = useLocation();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { classes, theme, cx } = useStyles();
  const matches = useMediaQuery('(min-width: 768px)');
  const { data } = useGetAllProfileVisits();
  const { data: userTrips } = useGetUserTripsRequests('ALL');

  const { user } = useStore((state: any) => state);
  const { directSetSelectedChat, selectedChat, setOpenedChatDrawer } = chatStore(
    (state: any) => state
  );
  const { data: nonReadMessages } = useGetCountOfNonReadMessages();
  const [active, setActive] = useState(USER_HEADER_LINKS[0].link);

  let auxChats: any, auxChatId: any;
  const requests = userTrips?.find(
    (request: any) => request.status === 'PENDING' || request.status === 'RECEIVED'
  );

  useEffect(() => {
    setActive('/' + window.location.href.split('/').reverse()[0]);
  }, []);

  const items = USER_HEADER_LINKS.map((link: any) => (
    <a
      key={link.label}
      href={link.link}
      className={cx(classes.link, {
        [classes.linkActive]:
          active === link.link && location?.pathname.split('/')[1] === link.label?.toLowerCase(),
      })}
      onClick={(event) => {
        event.preventDefault();
        setActive(link.link);
        navigate(link.link);
      }}
    >
      {link.label}
    </a>
  ));

  return (
    <Header height={60}>
      <Container className={classes.header}>
        <MediaQuery smallerThan="sm" styles={{ display: 'none' }}>
          <UnstyledButton onClick={() => navigate('/')}>
            <AppLogo />
          </UnstyledButton>
        </MediaQuery>
        <Group>
          <Group>
            <Burger
              opened={openedDrawer}
              onClick={() => setOpenedDrawer(!openedDrawer)}
              className={classes.burger}
              size="sm"
            />
          </Group>
          {!openedDrawer &&
            !location.pathname?.includes('auth') &&
            location.pathname.split('/')?.length > 2 && (
              <Button
                leftIcon={<ArrowNarrowLeft size={15} />}
                variant={'subtle'}
                size={'sm'}
                compact
                onClick={() => {
                  navigate(-1);
                  // if(location.pathname.includes('favorites')){
                  // }
                  // const path: any = location.pathname.split('/').pop()
                  // navigate(path?.join('/'))
                }}
              >
                Back
              </Button>
            )}
        </Group>
        {!matches &&
          // && selectedChat?.id != -1
          !isEmptyArray(queryClient.getQueryData(['chat'])) &&
          location.pathname?.split('/')[1] == 'chat' && (
            <Button
              variant={'outline'}
              rightIcon={<MessageDots size={13} />}
              compact
              onClick={() => setOpenedChatDrawer(true)}
            >
              Chats
            </Button>
          )}
        <Group spacing={5} className={classes.links}>
          {items}
          <>
            {!isNullOrUndefined(user) && (
              <Group spacing={0}>
                <a
                  href={'/chat'}
                  style={{ borderRadius: `5px ${!user ? '5px 5px' : '0px 0px'} 5px` }}
                  className={cx(classes.link, {
                    [classes.linkActive]:
                      active === '/chat' && location.pathname?.split('/').includes('chat'),
                  })}
                  onClick={(event) => {
                    event.preventDefault();
                    setActive('/chat');
                    navigate('/chat');
                  }}
                >
                  Chat
                </a>
                <Box mr={16} sx={{ position: 'relative' }}>
                  {!isNullOrUndefined(user) &&
                    !isNullOrUndefined(nonReadMessages) &&
                    !isEmptyArray(nonReadMessages) && (
                      <Indicator
                        color={'pink'}
                        size={15}
                        withBorder
                        position="top-end"
                        styles={{ indicator: { padding: '0' } }}
                        label={nonReadMessages.length}
                      >
                        <Menu
                          opened={user}
                          transition="pop"
                          placement="end"
                          size={'xl'}
                          control={
                            <ActionIcon
                              p={0}
                              className={cx(classes.link, {
                                [classes.linkActive]: active === '/chat',
                              })}
                              color={theme.primaryColor}
                              style={{ height: '30px', borderRadius: '0 5px 5px 0' }}
                            >
                              <ChevronDown size={16} />
                            </ActionIcon>
                          }
                        >
                          <ScrollArea style={{ height: 250 }} scrollbarSize={2}>
                            {nonReadMessages.map((item: any) => (
                              <Menu.Item
                                key={item?.message?.id}
                                icon={<Avatar m={0} size={'xs'} src={userPicture(item.user)} />}
                                onClick={() => {
                                  auxChats = nonReadMessages?.map((item: any) => item.chat);
                                  auxChatId = auxChats?.map((item: any) => item.id);
                                  navigate(`/chat`);
                                  directSetSelectedChat(item?.chat);
                                }}
                              >
                                <Text lineClamp={1}>{item?.content}</Text>
                                <Text align="center" color="gray" size={'xs'} lineClamp={1}>
                                  <CalendarEvent size={13} />{' '}
                                  {dateFullFormattedToIsoString(item?.createdAt)}
                                </Text>
                              </Menu.Item>
                            ))}
                          </ScrollArea>
                        </Menu>
                      </Indicator>
                    )}
                </Box>
              </Group>
            )}
          </>
        </Group>
        <Group>
          <div className={classes.profileAvatar}>
            {!isNullOrUndefined(user) && (
              <ProfileAvatar
                guestsCounter={data?.guests?.filter((item: any) => item.seen == false).length}
                travelRequestsCounter={!isNullOrUndefined(userTrips) ? userTrips?.length : 0}
              />
            )}
          </div>
          {isNullOrUndefined(user) && (
            <Button
              variant={'light'}
              compact
              size={'md'}
              onClick={() => {
                navigate('/auth/login');
                setOpenedDrawer(false);
              }}
            >
              Login
            </Button>
          )}
          <ToggleTheme />
        </Group>
      </Container>
    </Header>
  );
}
