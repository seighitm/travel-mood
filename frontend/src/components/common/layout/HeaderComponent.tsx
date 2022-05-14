import React, {useEffect, useState} from 'react';
import {
  ActionIcon,
  Box,
  Burger,
  Button,
  Container,
  createStyles,
  Group,
  Header,
  Indicator,
  Menu,
  ScrollArea,
  Tooltip,
} from '@mantine/core';
import {ChevronDown, ChevronLeft, Mail, MessageDots, User} from '../../../assets/Icons';

import {GlobeIcon} from '@modulz/radix-icons';
import {ProfileAvatar} from './ProfileAvatar';
import {useLocation, useNavigate} from 'react-router-dom';
import ToggleTheme from '../ToggleTheme';
// import {useMutateReadNotifications, useNotificationsQuery} from '../../../api/notifications.api';
import chatStore from '../../../store/chat.store';
import useStore from "../../../store/user.store";
import {useGetCountOfNonReadMessages} from "../../../api/chat/messages/queries";
import {useMediaQuery} from "@mantine/hooks";
import {isEmptyArray} from "../../../utils/primitive-checks";
import {useQueryClient} from "react-query";

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

interface HeaderSimpleProps {
  links: { link: string; label: string }[];
}

export function HeaderComponent({
                                  links,
                                  data,
                                  userTrips,
                                  setOpenedDrawer,
                                  openedDrawer,
                                }: HeaderSimpleProps | any) {
  const [active, setActive] = useState(links[0].link);
  const {classes, theme, cx} = useStyles();
  const navigate = useNavigate();
  const menuIconColor = theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 5 : 6];
  let auxChats: any, auxChatId: any;
  const {notifications} = chatStore((state: any) => state);
  const {user} = useStore((state: any) => state);

  useEffect(() => {
    setActive('/' + window.location.href.split('/').reverse()[0]);
  }, []);

  const location = useLocation()

  const {directSetSelectedChat, selectedChat, setOpenedChatDrawer} = chatStore((state: any) => state);

  const matches = useMediaQuery('(min-width: 768px)');


  const items = links.map((link: any) => (
    <a
      key={link.label}
      href={link.link}
      className={cx(classes.link, {[classes.linkActive]: active === link.link})}
      onClick={(event) => {
        event.preventDefault();
        setActive(link.link);
        navigate(link.link);
      }}
    >
      {link.label}
    </a>
  ));

  // const {mutate: mutateRead} = useMutation("readNotift",
  //     (chats: any) => readChatNotifications(chats), {
  //         onSettled: async () => {
  //             await refetchNotifications()
  //         },
  //         onSuccess: () => {
  //             setNotifications(notifications.filter((item: any) => item.chat.id != auxChatId))
  //         }
  //     });

  const requests = userTrips?.find((request: any) => (request.status === 'PENDING' || request.status === 'RECEIVED'));
  // const {mutate: mutateRead} = useMutateReadNotifications();
  // const {data: dbNotifications} = useNotificationsQuery('all');
  const {data: nonReadMessages} = useGetCountOfNonReadMessages();
  console.log(location)
  const queryClient = useQueryClient();

  console.log(nonReadMessages)
  return (
    <Header height={60} mb={120}>
      <Container className={classes.header}>
        <Burger
          opened={openedDrawer}
          onClick={() => setOpenedDrawer(!openedDrawer)}
          className={classes.burger}
          size="sm"
        />
        <Group spacing={50}>
          <ActionIcon className={classes.profileAvatar} onClick={() => navigate('/')}>
            <GlobeIcon style={{width: '20px', height: '20px'}}/>
          </ActionIcon>
          {(location.pathname != '/' && !isNaN(Number(location.pathname.split('/').reverse()[0]))) &&
            <Button leftIcon={<ChevronLeft size={13}/>} compact onClick={() => navigate(-1)}>
              Back
            </Button>
          }
        </Group>
          {!matches && selectedChat.id != -1 && !isEmptyArray(queryClient.getQueryData('fetchMyChats')) &&
            <Button variant={'outline'} rightIcon={<MessageDots size={13}/>} compact onClick={() => setOpenedChatDrawer(true)}>
              Chats
            </Button>
          }
        <Group spacing={5} className={classes.links}>
          {items}
          <Group spacing={0}>
            <a
              href={'/chat'}
              style={{borderRadius: `5px ${!user ? '5px 5px' : '0px 0px'} 5px`}}
              className={cx(classes.link, {[classes.linkActive]: active === '/chat' && location.pathname == '/chat'})}
              onClick={(event) => {
                event.preventDefault();
                setActive('/chat');
                navigate('/chat');
              }}
            >
              Chat
            </a>
            <Box mr={16} sx={{position: 'relative'}}>
              {user && nonReadMessages && nonReadMessages?.length != 0 &&
                <Indicator
                  color={'pink'}
                  size={15}
                  withBorder
                  position="top-end"
                  styles={{indicator: {padding: '0'}}}
                  label={nonReadMessages.length}
                >
                  <Menu
                    opened={user}
                    transition="pop"
                    placement="end"
                    control={
                      <ActionIcon
                        p={0}
                        className={cx(classes.link, {[classes.linkActive]: active === '/chat'})}
                        color={theme.primaryColor}
                        style={{height: '30px', borderRadius: '0 5px 5px 0'}}
                      >
                        <ChevronDown size={16}/>
                      </ActionIcon>
                    }
                  >
                    <ScrollArea style={{height: 250}} scrollbarSize={2}>
                      {nonReadMessages.map((item: any) =>
                        <Menu.Item
                          rightSection={
                            <Tooltip label={item.user.name} color="cyan" position="bottom" withArrow>
                              <User size={16} color={menuIconColor}/>
                            </Tooltip>
                          }
                          onClick={() => {
                            auxChats = nonReadMessages?.map((item: any) => item.chat);
                            auxChatId = auxChats?.map((it2: any) => it2.id);
                            navigate('/chat');
                            directSetSelectedChat(item?.chat);
                          }}
                          key={item?.message?.id}
                          icon={<Mail size={16} color={menuIconColor}/>}
                        >
                          {item?.message?.content?.slice(0, 15) + '...'}
                        </Menu.Item>
                      )}
                    </ScrollArea>
                  </Menu>
                </Indicator>
              }
            </Box>
          </Group>
        </Group>
        <Group>
          <div className={classes.profileAvatar}>
            {!!user
              ? <ProfileAvatar
                guestsCounter={data?.guests?.filter((item: any) => item.seen == false).length}
                travelRequestsCounter={requests != undefined ? requests._count : 0}
              />
              : <Button onClick={() => navigate('/auth/login')}>
                Login
              </Button>
            }
          </div>
          <ToggleTheme/>
        </Group>
      </Container>
    </Header>
  );
}
