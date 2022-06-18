import React from 'react';
import { ActionIcon, Avatar, Box, createStyles, Group, Text, UnstyledButton } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import useStore from '../../../store/user.store';
import { ChevronRight } from '../../common/Icons';
import {
  customNavigation,
  cutString,
  getFullUserName,
  userPicture,
} from '../../../utils/utils-func';

const useStyles = createStyles((theme) => ({
  user: {
    display: 'block',
    width: '100%',
    padding: theme.spacing.md,
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
    },
  },
}));

export function NavbarUserButton({ setOpenedDrawer }: any) {
  const { classes } = useStyles();
  const navigate = useNavigate();
  const { user } = useStore((state: any) => state);

  return (
    <UnstyledButton
      className={classes.user}
      onClick={() => {
        setOpenedDrawer(false);
        customNavigation(user?.role, navigate, '/users/' + user.id);
      }}
    >
      <Group position={'apart'}>
        <Group>
          <Avatar radius="xl" src={userPicture(user)} />
          <Box>
            <Text lineClamp={1} size="xs" color="dimmed">
              {cutString(getFullUserName(user), 30)}
            </Text>
          </Box>
          <ActionIcon>
            <ChevronRight size={14} />
          </ActionIcon>
        </Group>
      </Group>
    </UnstyledButton>
  );
}
