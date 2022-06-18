import React from 'react';
import {
  Badge,
  Box,
  createStyles,
  Divider,
  Drawer,
  Navbar,
  ScrollArea,
  UnstyledButton,
} from '@mantine/core';
import {
  Adjustments,
  Check,
  Compass,
  Directions,
  Eye,
  Heart,
  Logout,
  MessageDots,
  Pencil,
  Plane,
  Settings,
  User,
} from '../../common/Icons';
import { NavbarUserButton } from './NavbarUserButton';
import { useNavigate } from 'react-router-dom';
import { USER_HEADER_LINKS } from '../../../utils/constants';
import { useMutateLogout } from '../../../api/auth/mutations';
import { useGetCountOfNonReadMessages } from '../../../api/chat/messages/queries';
import { isEmptyArray, isNullOrUndefined } from '../../../utils/primitive-checks';
import useStore from '../../../store/user.store';
import { useGetAllProfileVisits } from '../../../api/users/queries';
import { useGetUserTripsRequests } from '../../../api/trips/join-requests/queries';
import AppLogo from '../../common/AppLogo';

const useStyles = createStyles((theme) => ({
  navbar: {
    paddingTop: 0,
    height: 'calc(100% - 45px)',
  },

  section: {
    marginLeft: -theme.spacing.md,
    marginRight: -theme.spacing.md,
    // marginBottom: theme.spacing.md,

    // '&:not(:last-of-type)': {
    //     borderBottom: `1px solid ${
    //         theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
    //     }`,
    // },
  },

  mainLinks: {
    paddingLeft: theme.spacing.md - theme.spacing.xs,
    paddingRight: theme.spacing.md - theme.spacing.xs,
    // paddingBottom: theme.spacing.md,
  },

  mainLink: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    fontSize: theme.fontSizes.xs,
    padding: `8px ${theme.spacing.xs}px`,
    borderRadius: theme.radius.sm,
    fontWeight: 500,
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
      color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    },
  },

  mainLinkInner: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '15px',
    flex: 1,
  },

  mainLinkIcon: {
    marginRight: theme.spacing.sm,
    color: theme.colorScheme === 'dark' ? theme.colors.dark[2] : theme.colors.gray[6],
  },

  mainLinkBadge: {
    padding: 0,
    width: 20,
    height: 20,
    pointerEvents: 'none',
  },

  collections: {
    paddingLeft: theme.spacing.md - 6,
    paddingRight: theme.spacing.md - 6,
    paddingBottom: theme.spacing.md,
  },

  collectionLink: {
    display: 'block',
    padding: `8px ${theme.spacing.xs}px`,
    textDecoration: 'none',
    borderRadius: theme.radius.sm,
    fontSize: theme.fontSizes.xs,
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
    lineHeight: 1,
    fontWeight: 500,

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
      color: theme.colorScheme === 'dark' ? theme.white : theme.black,
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

const CustomNavbar = ({ setOpenedDrawer, openedDrawer }: any) => {
  const { classes, theme, cx } = useStyles();
  const { user } = useStore((state: any) => state);
  const navigate = useNavigate();
  const { data: nonReadMessages } = useGetCountOfNonReadMessages();
  const { data } = useGetAllProfileVisits();
  const { data: userTrips } = useGetUserTripsRequests('ALL');
  const { mutate: mutateLogout } = useMutateLogout();

  const handlerLogout = async () => {
    await mutateLogout();
  };

  const collectionLinks = USER_HEADER_LINKS.map((link: any) => (
    <UnstyledButton
      key={link.label}
      className={cx(classes.mainLink, {
        [classes.linkActive]:
          location?.pathname.split('/')[1] == link?.link?.split('/').reverse()[0],
      })}
      onClick={(event: any) => {
        event.preventDefault();
        setOpenedDrawer(false);
        navigate(link.link);
      }}
    >
      <div className={classes.mainLinkInner}>
        <link.icon color={theme.colors.blue[6]} size={20} className={classes.mainLinkIcon} />
        <span>{link.label}</span>
      </div>
      {link.notifications && (
        <Badge size="sm" variant="filled" className={classes.mainLinkBadge}>
          {link.notifications}
        </Badge>
      )}
    </UnstyledButton>
  ));

  return (
    <Drawer
      opened={openedDrawer}
      onClose={() => setOpenedDrawer(false)}
      title={
        <AppLogo
          onClick={() => {
            navigate('/');
            setOpenedDrawer(false);
          }}
        />
      }
      padding="xl"
      size="xl"
      transitionTimingFunction="ease"
    >
      <Navbar width={{ sm: 300 }} p="md" className={classes.navbar}>
        <Navbar.Section grow component={ScrollArea}>
          <Divider
            style={{ width: '100%' }}
            label={
              <>
                <Compass size={17} />
                <Box ml={5}>Explorer:</Box>
              </>
            }
          />
          <div className={classes.collections}>{collectionLinks}</div>

          {!isNullOrUndefined(user) && (
            <>
              <Divider
                style={{ width: '100%' }}
                label={
                  <>
                    <Check size={17} />
                    <Box ml={5}>Profile:</Box>
                  </>
                }
              />

              <div className={classes.mainLinks}>
                <UnstyledButton
                  className={cx(classes.mainLink, {
                    [classes.linkActive]: location?.pathname.includes('/chat'),
                  })}
                  onClick={() => {
                    setOpenedDrawer(false);
                    navigate('/chat');
                  }}
                >
                  <div className={classes.mainLinkInner}>
                    <MessageDots
                      color={theme.colors.violet[6]}
                      size={20}
                      className={classes.mainLinkIcon}
                    />
                    <span>Chat</span>
                  </div>

                  {!isNullOrUndefined(user) &&
                    !isNullOrUndefined(nonReadMessages) &&
                    !isEmptyArray(nonReadMessages) && (
                      <Badge
                        size="sm"
                        variant="light"
                        color={'violet'}
                        className={classes.mainLinkBadge}
                      >
                        {nonReadMessages.length}
                      </Badge>
                    )}
                </UnstyledButton>

                <UnstyledButton
                  className={cx(classes.mainLink, {
                    [classes.linkActive]: location?.pathname.includes('/view'),
                  })}
                  onClick={() => {
                    setOpenedDrawer(false);
                    navigate('/view');
                  }}
                >
                  <div className={classes.mainLinkInner}>
                    <Eye color={theme.colors.green[6]} size={20} className={classes.mainLinkIcon} />
                    <span>Profile view</span>
                  </div>
                  {data?.guests?.filter((item: any) => item.seen == false).length != 0 && (
                    <Badge
                      size="sm"
                      color={'green'}
                      variant="light"
                      className={classes.mainLinkBadge}
                    >
                      {data?.guests?.filter((item: any) => item.seen == false).length}
                    </Badge>
                  )}
                </UnstyledButton>

                <UnstyledButton
                  className={cx(classes.mainLink, {
                    [classes.linkActive]: location?.pathname.includes('/trip-requests'),
                  })}
                  onClick={() => {
                    setOpenedDrawer(false);
                    navigate('/trip-requests');
                  }}
                >
                  <div className={classes.mainLinkInner}>
                    <User
                      color={theme.colors.yellow[6]}
                      size={20}
                      className={classes.mainLinkIcon}
                    />
                    <span>Travel requests</span>
                  </div>
                  {userTrips?.filter(
                    (item: any) => item.status == 'PENDING' || item.status == 'RECEIVED'
                  ).length != 0 && (
                    <Badge
                      size="sm"
                      color={'yellow'}
                      variant="light"
                      className={classes.mainLinkBadge}
                    >
                      {
                        userTrips?.filter(
                          (item: any) => item.status == 'PENDING' || item.status == 'RECEIVED'
                        ).length
                      }
                    </Badge>
                  )}
                </UnstyledButton>

                <UnstyledButton
                  className={cx(classes.mainLink, {
                    [classes.linkActive]: location?.pathname.includes('/favorites'),
                  })}
                  onClick={() => {
                    setOpenedDrawer(false);
                    navigate('/favorites');
                  }}
                >
                  <div className={classes.mainLinkInner}>
                    <Heart color={theme.colors.red[6]} size={20} className={classes.mainLinkIcon} />
                    <span>Liked posts</span>
                  </div>
                </UnstyledButton>
              </div>
              <Divider
                style={{ width: '100%' }}
                label={
                  <>
                    <Pencil size={17} />
                    <Box ml={5}>Create:</Box>
                  </>
                }
              />
              <div className={classes.mainLinks}>
                <UnstyledButton
                  onClick={(event: any) => {
                    event.preventDefault();
                    setOpenedDrawer(false);
                    navigate('/articles/add');
                  }}
                  className={cx(classes.mainLink, {
                    [classes.linkActive]: location?.pathname.includes('/articles/add'),
                  })}
                >
                  <div className={classes.mainLinkInner}>
                    <Plane
                      size={20}
                      color={theme.colors.orange[6]}
                      className={classes.mainLinkIcon}
                    />
                    <span>New article</span>
                  </div>
                </UnstyledButton>
                <UnstyledButton
                  onClick={(event: any) => {
                    event.preventDefault();
                    setOpenedDrawer(false);
                    navigate('/trips/add');
                  }}
                  className={cx(classes.mainLink, {
                    [classes.linkActive]: location?.pathname.includes('/trips/add'),
                  })}
                >
                  <div className={classes.mainLinkInner}>
                    <Directions
                      size={20}
                      color={theme.colors.blue[6]}
                      className={classes.mainLinkIcon}
                    />
                    <span>New trip</span>
                  </div>
                </UnstyledButton>
              </div>

              <Divider
                style={{ width: '100%' }}
                label={
                  <>
                    <Adjustments size={17} />
                    <Box ml={5}>Menu:</Box>
                  </>
                }
              />

              <div className={classes.mainLinks}>
                <UnstyledButton
                  onClick={(event: any) => {
                    event.preventDefault();
                    setOpenedDrawer(false);
                    navigate(`/users/${user?.id}/edit`);
                  }}
                  className={cx(classes.mainLink, {
                    [classes.linkActive]: location?.pathname.includes(`/users/${user?.id}/edit`),
                  })}
                >
                  <div className={classes.mainLinkInner}>
                    <Settings
                      color={theme.colors.gray[7]}
                      size={20}
                      className={classes.mainLinkIcon}
                    />
                    <span>Settings</span>
                  </div>
                </UnstyledButton>
                <UnstyledButton
                  onClick={async (event: any) => {
                    event.preventDefault();
                    setOpenedDrawer(false);
                    await handlerLogout();
                  }}
                  className={classes.mainLink}
                >
                  <div className={classes.mainLinkInner}>
                    <Logout
                      color={theme.colors.gray[7]}
                      size={20}
                      className={classes.mainLinkIcon}
                    />
                    <span>Logout</span>
                  </div>
                </UnstyledButton>
              </div>
            </>
          )}
        </Navbar.Section>

        {!isNullOrUndefined(user) && (
          <Navbar.Section className={classes.section}>
            <NavbarUserButton setOpenedDrawer={setOpenedDrawer} />
          </Navbar.Section>
        )}
      </Navbar>
    </Drawer>
  );
};

export default CustomNavbar;
