import React from 'react';
import {
  Button,
  Container,
  createStyles,
  Group,
  Image,
  List,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';
import { Check, Map, User } from './Icons';
import { useNavigate } from 'react-router-dom';
import useStore from '../../store/user.store';
import { useMediaQuery } from '@mantine/hooks';
import { customNavigation } from '../../utils/utils-func';

const useStyles = createStyles((theme) => ({
  inner: {
    display: 'flex',
    paddingTop: theme.spacing.xl * 2,
    paddingBottom: theme.spacing.xl * 1,
    justifyContent: 'center',
    [theme.fn.smallerThan('md')]: {
      paddingTop: theme.spacing.xl,
      paddingBottom: theme.spacing.xl,
      flexDirection: 'column-reverse',
    },
  },

  content: {
    maxWidth: 480,
    marginRight: theme.spacing.xl * 3,

    [theme.fn.smallerThan('md')]: {
      maxWidth: '100%',
      marginRight: 0,
    },
  },

  title: {
    color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    fontSize: 44,
    lineHeight: 1.2,
    fontWeight: 900,

    [theme.fn.smallerThan('xs')]: {
      fontSize: 28,
    },
  },

  control: {
    [theme.fn.smallerThan('xs')]: {
      flex: 1,
    },
  },

  image: {
    flex: 1,
    marginBottom: '25px',
  },

  highlight: {
    position: 'relative',
    backgroundColor:
      theme.colorScheme === 'dark'
        ? theme.fn.rgba(theme.colors[theme.primaryColor][6], 0.55)
        : theme.colors[theme.primaryColor][0],
    borderRadius: theme.radius.sm,
    padding: '4px 12px',
  },

  appLogo: {
    backgroundImage: 'linear-gradient(15deg, #4c6ef5 0%, #fd7e14 100%)',
    '-webkit-background-clip': 'text',
    '-webkit-text-fill-color': 'transparent',
    fontWeight: 700,
    padding: '0px',
  },
}));

const HeroBullets = () => {
  const { classes, cx } = useStyles();
  const navigate = useNavigate();
  const { user } = useStore((state: any) => state);
  const mobile = useMediaQuery('(min-width: 768px)');
  const tablet = useMediaQuery('(min-width: 993px)');

  return (
    <div>
      <Container size={'lg'}>
        <div className={classes.inner}>
          <div className={classes.content}>
            <Title className={classes.title}>
              <span className={classes.highlight}>Traveling</span>
              <br /> should be easy
            </Title>
            <Text color="dimmed" mt="md">
              Don’t like spending hours researching before traveling somewhere new? That’s what
              <span className={cx(classes.highlight, classes.appLogo)}> travel mood </span> are for!
              We connect travelers all over the world who don't want to travel alone anymore! Find a
              true travel companion for your next trip or find your next unique trip experience with
              like-minded Travel Mates!
              {/*Make special travel memories with Travel Buddy, an app specially made for travelers. Meet local*/}
              {/*travelers from your desired destination, chat with them to know the*/}
              {/*place, & plan unique trips.*/}
            </Text>
            <List
              mt={10}
              spacing="sm"
              size="sm"
              icon={
                <ThemeIcon size={20} radius="xl">
                  <Check size={12} />
                </ThemeIcon>
              }
            >
              <List.Item>
                <b>Safety</b> – Rate a traveler, review them, report a troublemaker. Our app has
                some of the most robust safety features amongst all travel apps.
              </List.Item>
              <List.Item>
                <b>Travel Feed</b> – Get inspired to travel when you are on the feed by seeing
                articles from fellow travelers. Post your own story. Ask about a destination or look
                for travel buddies for your next destination.
              </List.Item>
              <List.Item>
                <b>Location Based Search</b> – Find any place that you dream and see posts for that
                destination.
              </List.Item>
              <List.Item>
                <b>Chat</b> – Send and receive messages to an unlimited number of users in an easy
                way through a chat
              </List.Item>
            </List>

            <Group mt={30}>
              <Button
                leftIcon={<Map size={20} />}
                onClick={() => customNavigation(user?.role, navigate, `/trips`)}
                radius="xl"
                size="md"
                className={classes.control}
              >
                Find trip
              </Button>
              <Button
                leftIcon={<User size={20} />}
                onClick={() => customNavigation(user?.role, navigate, `/users`)}
                variant="default"
                radius="xl"
                size="md"
                className={classes.control}
              >
                Find user
              </Button>
            </Group>
          </div>
          <Image
            height={!mobile ? 300 : !tablet ? 300 : ''}
            src={`${import.meta.env.VITE_API_URL}uploads/site/hero.svg`}
            className={classes.image}
          />
        </div>
      </Container>
    </div>
  );
};

export default HeroBullets;
