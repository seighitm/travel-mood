import React from 'react';
import {Badge, Box, createStyles, Divider, Navbar, ScrollArea, UnstyledButton,} from '@mantine/core';
import {
  Adjustments,
  Bulb,
  Check,
  Checkbox,
  Compass,
  Directions,
  Eye,
  Heart,
  Logout,
  Pencil,
  Plane,
  Selector,
  Settings,
  User,
} from '../../../../assets/Icons';
import {UserButton} from './UserButton';
import {useNavigate} from 'react-router-dom';
import {HEADER_LINKS} from '../../../../data/Constants';
import {useMutateLogout} from '../../../../api/auth/mutations';

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

  searchCode: {
    fontWeight: 700,
    fontSize: 10,
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0],
    border: `1px solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[2]
    }`,
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

  collectionsHeader: {
    paddingLeft: theme.spacing.md + 2,
    paddingRight: theme.spacing.md,
    marginBottom: 5,
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
}));

const links2 = [
  {icon: Bulb, label: 'Activity', notifications: 3},
  {icon: Checkbox, label: 'Tasks', notifications: 4},
  {icon: User, label: 'Contacts'},
];

const collections = [
  {emoji: '👍', label: 'Sales'},
  {emoji: '🚚', label: 'Deliveries'},
  {emoji: '💸', label: 'Discounts'},
  {emoji: '💰', label: 'Profits'},
  {emoji: '✨', label: 'Reports'},
  {emoji: '🛒', label: 'Orders'},
  {emoji: '📅', label: 'Events'},
  {emoji: '🙈', label: 'Debts'},
  {emoji: '💁‍♀️', label: 'Customers'},
];

const CustomNavbar = ({setOpenedDrawer, links, guestsCounter, travelRequestsCounter}: any) => {
  const {classes, theme, cx} = useStyles();
  const navigate = useNavigate();

  const {mutate: mutateLogout} = useMutateLogout();

  const handlerLogout = async () => {
    await mutateLogout();
  };

  // const items = links.map((link: any) => (
  //     <a
  //         key={link.label}
  //         href={link.link}
  //         className={cx(classes.link, {[classes.linkActive]: active === link.link})}
  //         onClick={(event) => {
  //             event.preventDefault();
  //             navigate(link.link)
  //         }}
  //
  //     >
  //         {link.label}
  //     </a>
  // ));
  // const mainLinks = () => <div></div>
  const mainLinks = links2.map((link: any) => (
    <UnstyledButton key={link.label} className={classes.mainLink}>
      <div className={classes.mainLinkInner}>
        <link.icon size={20} className={classes.mainLinkIcon}/>
        <span>{link.label}</span>
      </div>
      {link.notifications && (
        <Badge size="sm" variant="filled" className={classes.mainLinkBadge}>
          {link.notifications}
        </Badge>
      )}
    </UnstyledButton>
  ));

  const collectionLinks = HEADER_LINKS.map((link: any) => (
    <UnstyledButton
      onClick={(event: any) => {
        event.preventDefault();
        setOpenedDrawer(false);
        navigate(link.link);
      }}
      key={link.label}
      className={classes.mainLink}
    >
      <div className={classes.mainLinkInner}>
        <link.icon size={20} className={classes.mainLinkIcon}/>
        <span>{link.label}</span>
      </div>
      {link.notifications && (
        <Badge size="sm" variant="filled" className={classes.mainLinkBadge}>
          {link.notifications}
        </Badge>
      )}
    </UnstyledButton>
  ));
  //     .map((collection: any) => (
  //     <a
  //         href={collection.link}
  //         onClick={(event) => {
  //             event.preventDefault();
  //             setOpenedDrawer(false)
  //             navigate(collection.link)
  //         }}
  //         key={collection.label}
  //         className={classes.collectionLink}
  //     >
  //         <span style={{marginRight: 9, fontSize: 16}}>{collection.emoji}</span>
  //         {collection.label}
  //     </a>
  // ));

  return (
    <Navbar width={{sm: 300}} p="md" className={classes.navbar}>
      <Navbar.Section grow component={ScrollArea}>
        <Divider
          style={{width: '100%'}}
          label={
            <>
              <Compass size={17}/>
              <Box ml={5}>Explorer:</Box>
            </>
          }
        />

        <div className={classes.collections}>{collectionLinks}</div>

        <Divider
          style={{width: '100%'}}
          label={
            <>
              <Check size={17}/>
              <Box ml={5}>Settings:</Box>
            </>
          }
        />

        <div className={classes.mainLinks}>
          <UnstyledButton
            onClick={() => {
              setOpenedDrawer(false);
              navigate('/view');
            }}
            className={classes.mainLink}
          >
            <div className={classes.mainLinkInner}>
              <Eye color={theme.colors.green[6]} size={20} className={classes.mainLinkIcon}/>
              <span>Profile view</span>
            </div>
            {guestsCounter != 0 && (
              <Badge size="sm" variant="filled" className={classes.mainLinkBadge}>
                {guestsCounter}
              </Badge>
            )}
          </UnstyledButton>

          <UnstyledButton
            onClick={() => {
              setOpenedDrawer(false);
              navigate('/trip-requests');
            }}
            className={classes.mainLink}
          >
            <div className={classes.mainLinkInner}>
              <User color={theme.colors.yellow[6]} size={20} className={classes.mainLinkIcon}/>
              <span>Travel requests</span>
            </div>
            {travelRequestsCounter != 0 && (
              <Badge size="sm" variant="filled" className={classes.mainLinkBadge}>
                {travelRequestsCounter}
              </Badge>
            )}
          </UnstyledButton>

          <UnstyledButton
            onClick={() => {
              setOpenedDrawer(false);
              navigate('/favorites');
            }}
            className={classes.mainLink}
          >
            <div className={classes.mainLinkInner}>
              <Heart color={theme.colors.red[6]} size={20} className={classes.mainLinkIcon}/>
              <span>Liked posts</span>
            </div>
          </UnstyledButton>
        </div>

        <Divider
          style={{width: '100%'}}
          label={
            <>
              <Pencil size={17}/>
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
            className={classes.mainLink}
          >
            <div className={classes.mainLinkInner}>
              <Plane size={20} color={theme.colors.orange[6]} className={classes.mainLinkIcon}/>
              <span>New article</span>
            </div>
          </UnstyledButton>
          <UnstyledButton
            onClick={(event: any) => {
              event.preventDefault();
              setOpenedDrawer(false);
              navigate('/trips/add');
            }}
            className={classes.mainLink}
          >
            <div className={classes.mainLinkInner}>
              <Directions size={20} color={theme.colors.blue[6]} className={classes.mainLinkIcon}/>
              <span>New trip</span>
            </div>
          </UnstyledButton>
        </div>

        <Divider
          style={{width: '100%'}}
          label={
            <>
              <Adjustments size={17}/>
              <Box ml={5}>Menu:</Box>
            </>
          }
        />

        <div className={classes.mainLinks}>
          <UnstyledButton
            onClick={(event: any) => {
              event.preventDefault();
              setOpenedDrawer(false);
              navigate('/edit/profile');
            }}
            className={classes.mainLink}
          >
            <div className={classes.mainLinkInner}>
              <Settings size={20} className={classes.mainLinkIcon}/>
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
              <Logout size={20} className={classes.mainLinkIcon}/>
              <span>Logout</span>
            </div>
          </UnstyledButton>
        </div>
      </Navbar.Section>

      <Navbar.Section className={classes.section}>
        <UserButton
          setOpenedDrawer={setOpenedDrawer}
          image="https://i.imgur.com/fGxgcDF.png"
          name="Bob Rulebreaker"
          email="Product owner"
          icon={<Selector size={14}/>}
        />
      </Navbar.Section>
    </Navbar>
  );
};

export default CustomNavbar;
