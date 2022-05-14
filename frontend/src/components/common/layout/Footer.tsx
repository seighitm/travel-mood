import React from 'react';
import { ActionIcon, Container, createStyles, Group, Paper } from '@mantine/core';
import { FigmaLogoIcon, GitHubLogoIcon, RocketIcon, TwitterLogoIcon } from '@modulz/radix-icons';

const useStyles = createStyles((theme) => ({
  inner: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    // paddingTop: theme.spacing.md,
    // paddingBottom: theme.spacing.md,

    [theme.fn.smallerThan('xs')]: {
      flexDirection: 'column',
    },
  },

  links: {
    [theme.fn.smallerThan('xs')]: {
      marginTop: theme.spacing.md,
    },
  },
}));

export function CustomFooter() {
  const { classes } = useStyles();
  // <Footer height={45} p={5}>

  return (
    <Paper
      shadow={'lg'}
      radius={0}
      sx={(theme) => ({
        width: '100%',
        borderTop: '2px solid ',
        borderColor: theme.colorScheme === 'dark' ? theme.colors.gray[8] : theme.colors.gray[2],
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
      })}
    >
      <Container className={classes.inner}>
        <ActionIcon size='lg'>
          <RocketIcon />
        </ActionIcon>
        <Group spacing={0} className={classes.links} position='right' noWrap>
          <ActionIcon size='lg'>
            <TwitterLogoIcon />
          </ActionIcon>
          <ActionIcon size='lg'>
            <GitHubLogoIcon />
          </ActionIcon>
          <ActionIcon size='lg'>
            <FigmaLogoIcon />
          </ActionIcon>
        </Group>
      </Container>
    </Paper>
  );
}
