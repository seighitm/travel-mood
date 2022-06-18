import React from 'react';
import {AppShell, Button, Container, createStyles, Group, Text, Title, TypographyStylesProvider} from '@mantine/core';
import {Link} from 'react-router-dom';

const useStyles = createStyles((theme) => ({
  root: {
    background: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.light,
    // paddingTop: 80,
    // paddingBottom: 80,

    height: '100%'
  },
  container: {
    position: 'relative',
    top: '50%',
    transform: 'translateY(-50%)',
    [theme.fn.smallerThan(475)]: {
      padding: '0px',
      marginRight: '-8px',
      marginLeft: '-8px',
    },
  },

  label: {
    textAlign: 'center',
    fontWeight: 900,
    fontSize: 220,
    lineHeight: 1,
    marginBottom: theme.spacing.xl * 1.5,
    // color: theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2],

    [theme.fn.smallerThan('sm')]: {
      fontSize: 120,
    },
  },

  title: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    textAlign: 'center',
    fontWeight: 900,
    fontSize: 38,

    [theme.fn.smallerThan('sm')]: {
      fontSize: 32,
    },
  },

  description: {
    maxWidth: 500,
    margin: 'auto',
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.xl * 1.5,
  },
}));

const NotFoundTitle = () => {
  const {classes, cx} = useStyles();
  return (
    <AppShell
      fixed
      styles={(theme) => ({
        main: {
          background: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
        },
      })}
    >
      <Container
        size="xl"
        className={cx(classes.container)}
      >
        <TypographyStylesProvider>
          <div className={classes.label}>404</div>
          <Title className={classes.title}>You have found a secret place.</Title>
          <Text color="dimmed" size="lg" align="center" className={classes.description}>
            Unfortunately, this is only a 404 page. You may have mistyped the address, or the page has
            been moved to another URL.
          </Text>
          <Group position="center">
            <Button variant="subtle" size="md" component={Link} to={`/`}>
              Take me back to home page
            </Button>
          </Group>
        </TypographyStylesProvider>
      </Container>
    </AppShell>
  );
};

export default NotFoundTitle;
