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
  Text,
  Tooltip,
  UnstyledButton,
} from '@mantine/core';
import {ChevronDown, ChevronLeft, Key, Mail, MessageDots, User} from '../../../assets/Icons';
import {useLocation, useNavigate} from 'react-router-dom';
import chatStore from '../../../store/chat.store';
import useStore from "../../../store/user.store";
import {useGetCountOfNonReadMessages} from "../../../api/chat/messages/queries";
import {useMediaQuery} from "@mantine/hooks";
import {isEmptyArray, isNullOrUndefined} from "../../../utils/primitive-checks";
import {useQueryClient} from "react-query";
import {cutString} from "../Utils";
import {ProfileAvatar} from "./ProfileAvatar";
import ToggleTheme from "../ToggleTheme";

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

export function CustomHeader({
                               links,
                               data,
                               userTrips,
                               setOpenedDrawer,
                               openedDrawer,
                             }: any) {
  const location = useLocation()
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const {classes, theme, cx} = useStyles();
  const matches = useMediaQuery('(min-width: 768px)');

  const {user} = useStore((state: any) => state);
  const {directSetSelectedChat, selectedChat, setOpenedChatDrawer} = chatStore((state: any) => state);
  const [active, setActive] = useState(links[0].link);
  const {data: nonReadMessages} = useGetCountOfNonReadMessages();

  let auxChats: any, auxChatId: any;
  const menuIconColor = theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 5 : 6];
  const requests = userTrips?.find((request: any) => (request.status === 'PENDING' || request.status === 'RECEIVED'));

  useEffect(() => {
    setActive('/' + window.location.href.split('/').reverse()[0]);
  }, []);

  const items = links.map((link: any) => (
    <a
      key={link.label}
      href={link.link}
      className={cx(classes.link, {[classes.linkActive]: active === link.link && location?.pathname.includes(link.link)})}
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
    <Header height={60} mb={120}>
      <Container className={classes.header}>
        <Group className={classes.profileAvatar} spacing={50}>
          <UnstyledButton onClick={() => navigate('/')}>
            <Text
              component="span"
              align="center"
              variant="gradient"
              gradient={{from: 'indigo', to: 'cyan', deg: 45}}
              weight={700}
              style={{fontFamily: 'Greycliff CF, sans-serif', fontSize: '30px'}}
            >
              explore
            </Text>
          </UnstyledButton>
        </Group>
        <Group>
          <Group>
            <Burger
              opened={openedDrawer}
              onClick={() => setOpenedDrawer(!openedDrawer)}
              className={classes.burger}
              size="sm"
            />
          </Group>
          {!openedDrawer && (location.pathname != '/' && !isNaN(Number(location.pathname.split('/').reverse()[0]))) &&
            <Button
              leftIcon={<ChevronLeft size={15}/>}
              variant={'outline'}
              size={'md'}
              compact onClick={() => navigate(-1)}
            >
              Back
            </Button>
          }
        </Group>
        {!matches && selectedChat?.id != -1 && !isEmptyArray(queryClient.getQueryData('fetchMyChats')) &&
          <Button
            variant={'outline'}
            rightIcon={<MessageDots size={13}/>}
            compact
            onClick={() => setOpenedChatDrawer(true)}
          >
            Chats
          </Button>
        }
        <Group spacing={5} className={classes.links}>
          {items}
          <>
            {!isNullOrUndefined(user) &&
              <Group spacing={0}>
                <a
                  href={'/chat'}
                  style={{borderRadius: `5px ${!user ? '5px 5px' : '0px 0px'} 5px`}}
                  className={cx(classes.link, {[classes.linkActive]: active === '/chat' && location.pathname?.split('/').includes('chat')})}
                  onClick={(event) => {
                    event.preventDefault();
                    setActive('/chat');
                    navigate('/chat');
                  }}
                >
                  Chat
                </a>
                <Box mr={16} sx={{position: 'relative'}}>
                  {!isNullOrUndefined(user) && !isNullOrUndefined(nonReadMessages) && !isEmptyArray(nonReadMessages) &&
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
                                auxChatId = auxChats?.map((item: any) => item.id);
                                navigate(`/chat`);
                                directSetSelectedChat(item?.chat);
                              }}
                              key={item?.message?.id}
                              icon={<Mail size={16} color={menuIconColor}/>}
                            >
                              {cutString(item?.message?.content)}
                            </Menu.Item>
                          )}
                        </ScrollArea>
                      </Menu>
                    </Indicator>
                  }
                </Box>
              </Group>
            }
          </>
        </Group>
        <Group>
          <div className={classes.profileAvatar}>
            {!isNullOrUndefined(user) &&
              <ProfileAvatar
                guestsCounter={data?.guests?.filter((item: any) => item.seen == false).length}
                travelRequestsCounter={requests != undefined ? requests._count : 0}
              />
            }
          </div>
          {isNullOrUndefined(user) &&
            <Button
              rightIcon={<Key size={17}/>}
              variant={'light'}
              compact
              onClick={() => navigate('/auth/login')}
              size={'md'}
            >
              Login
            </Button>
          }
          <ToggleTheme/>
        </Group>
      </Container>
    </Header>
  );
}
