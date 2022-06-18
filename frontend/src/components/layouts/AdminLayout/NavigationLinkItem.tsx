import React from 'react';
import { createStyles, Group, Indicator, Text, ThemeIcon, UnstyledButton } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import {
  Eye,
  Heart,
  InfoCircle,
  Language,
  Logout,
  Map,
  MessageDots,
  News,
  PlaneDeparture,
  Settings,
  Tags,
  User,
  Users,
  World,
} from '../../common/Icons';
import { useMediaQuery } from '@mantine/hooks';
import { useMutateLogout } from '../../../api/auth/mutations';
import { useGetCountOfNonReadMessages } from '../../../api/chat/messages/queries';
import { useGetAllComplaints } from '../../../api/admin/queries';
import useStore from '../../../store/user.store';
import { ROLE } from '../../../types/enums';

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
    width: '100%',
    padding: theme.spacing.xs,
    borderRadius: theme.radius.sm,
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
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

export function NavbarLinks({ setOpenedDrawer }: any) {
  const navigate = useNavigate();
  const matchesDesktop = useMediaQuery('(min-width: 985px)');
  const matchesMobile = useMediaQuery('(max-width: 767px)');
  const { classes, cx } = useStyles();
  const { data: nonReadMessages } = useGetCountOfNonReadMessages();
  const { data: complaints } = useGetAllComplaints('ACTIVE');

  return (
    <>
      <UnstyledButton
        onClick={() => {
          if (setOpenedDrawer) setOpenedDrawer(false);
          navigate('/admin/complaints');
        }}
        className={cx(classes.link, {
          [classes.linkActive]: location?.pathname.includes('complaints'),
        })}
      >
        <Group>
          <Indicator
            color={'pink'}
            size={13}
            withBorder
            position="top-end"
            styles={{ indicator: { padding: '0' } }}
            disabled={complaints?.length == 0}
            label={complaints?.length}
          >
            <ThemeIcon color={'grape'} variant="light">
              <InfoCircle size={20} />
            </ThemeIcon>
          </Indicator>
          {(matchesDesktop || (matchesMobile && !matchesDesktop)) && (
            <Text size="sm">Complaints</Text>
          )}
        </Group>
      </UnstyledButton>

      {navbarLinkItems.map((link: any) => (
        <UnstyledButton
          onClick={() => {
            if (setOpenedDrawer) setOpenedDrawer(false);
            navigate(link.link);
          }}
          className={cx(classes.link, {
            [classes.linkActive]: location?.pathname === link.link.toLowerCase(),
          })}
        >
          <Group>
            <ThemeIcon color={link.color} variant="light">
              <link.icon size={20} />
            </ThemeIcon>
            {(matchesDesktop || (matchesMobile && !matchesDesktop)) && (
              <Text size="sm">{link.label}</Text>
            )}
          </Group>
        </UnstyledButton>
      ))}
      <UnstyledButton
        className={cx(classes.link, { [classes.linkActive]: location?.pathname.includes('chat') })}
        onClick={() => {
          if (setOpenedDrawer) {
            setOpenedDrawer(false);
          }
          navigate('/admin/chat');
        }}
      >
        <Group>
          <Indicator
            color={'pink'}
            size={13}
            withBorder
            position="top-end"
            styles={{ indicator: { padding: '0' } }}
            disabled={nonReadMessages?.length == 0}
            label={nonReadMessages?.length}
          >
            <ThemeIcon color={'blue'} variant="light">
              <MessageDots size={20} />
            </ThemeIcon>
          </Indicator>
          {(matchesDesktop || (matchesMobile && !matchesDesktop)) && <Text size="sm">Chat</Text>}
        </Group>
      </UnstyledButton>
    </>
  );
}

export function DrawerLinks({ setOpenedDrawer }: any) {
  const navigate = useNavigate();
  const matchesDesktop = useMediaQuery('(min-width: 985px)');
  const matchesMobile = useMediaQuery('(max-width: 767px)');
  const { classes, cx } = useStyles();
  const { mutate: mutateLogout } = useMutateLogout();
  const { user } = useStore((state: any) => state);

  const links = drawerLinkItems.map((item: any) => ({
    ...item,
    link:
      item.link == '/admin/edit/profile'
        ? (user?.role == ROLE.ADMIN ? '/admin' : '') + `/users/${user?.id}/edit`
        : item.link,
  }));

  return (
    <>
      {links.map((link: any) => (
        <UnstyledButton
          key={link.label}
          onClick={() => {
            setOpenedDrawer(false);
            navigate(link.link);
          }}
          className={cx(classes.link, {
            [classes.linkActive]: location?.pathname === link.link.toLowerCase(),
          })}

          // className={cx(classes.link, {[classes.linkActive]: location?.pathname.split('/')[2] === link?.link?.split('/')[2].toLowerCase()})}
          // className={cx(classes.link, {[classes.linkActive]: location?.pathname.includes(link?.link?.split('/').reverse()[0])})}
        >
          <Group>
            <ThemeIcon color={link.color} variant="light">
              <link.icon size={20} />
            </ThemeIcon>
            {(matchesDesktop || (matchesMobile && !matchesDesktop)) && (
              <Text size="sm">{link.label}</Text>
            )}
          </Group>
        </UnstyledButton>
      ))}
      <UnstyledButton
        onClick={() => {
          mutateLogout();
          setOpenedDrawer(false);
        }}
        className={cx(classes.link)}
      >
        <Group>
          <ThemeIcon color={'red'} variant="light">
            <Logout size={20} />
          </ThemeIcon>
          {(matchesDesktop || (matchesMobile && !matchesDesktop)) && <Text size="sm">Logout</Text>}
        </Group>
      </UnstyledButton>
    </>
  );
}

const drawerLinkItems = [
  {
    icon: Eye,
    color: 'blue',
    label: 'Profile view',
    link: '/admin/view',
  },
  {
    icon: Heart,
    color: 'teal',
    label: 'Liked posts',
    link: '/admin/favorites/trips',
  },
  {
    icon: User,
    color: 'grape',
    label: 'Travel requests',
    link: '/admin/trip-requests',
  },
  {
    icon: Settings,
    color: 'blue',
    label: 'Settings',
    link: '/admin/edit/profile',
  },
];

const navbarLinkItems = [
  {
    icon: News,
    color: 'blue',
    label: 'Articles',
    link: '/admin/articles',
  },
  {
    icon: PlaneDeparture,
    color: 'teal',
    label: 'Trips',
    link: '/admin/trips',
  },
  {
    icon: User,
    color: 'violet',
    label: 'Users',
    link: '/admin/users',
  },
  {
    icon: Map,
    color: 'grape',
    label: 'Map',
    link: '/admin/map',
  },
  {
    icon: Tags,
    color: 'grape',
    label: 'Tags',
    link: '/admin/tags',
  },
  {
    icon: Language,
    color: 'teal',
    label: 'Languages',
    link: '/admin/languages',
  },
  {
    icon: World,
    color: 'violet',
    label: 'Countries',
    link: '/admin/countries',
  },
];
