import React from 'react';
import {ActionIcon, Avatar, createStyles, Group, Text, UnstyledButton,} from '@mantine/core';
import {useNavigate} from 'react-router-dom';
import useStore from '../../../../store/user.store';
import {ChevronRight} from '../../../../assets/Icons';
import {userPicture} from "../../Utils";

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

interface UserButtonProps {
  image: string;
  name: string;
  email: string;
  icon?: React.ReactNode;
  setOpenedDrawer?: any;
}

export function UserButton({
                             image,
                             name,
                             email,
                             icon,
                             setOpenedDrawer,
                             ...others
                           }: UserButtonProps) {
  const {classes} = useStyles();
  const navigate = useNavigate();
  const {user} = useStore((state: any) => state);

  return (
    <UnstyledButton
      className={classes.user}
      {...others}
      onClick={() => {
        setOpenedDrawer(false);
        navigate(`/user/${user.id}`);
      }}
    >
      <Group position={'apart'}>
        <Group>
          <Avatar
            radius="xl"
            src={userPicture(user)}
          />

          <div>
            <Text weight={500}>{user?.name}</Text>
            <Text size="xs" color="dimmed">
              {user?.email}
            </Text>
          </div>
        </Group>
        <ActionIcon>
          <ChevronRight size={14}/>
        </ActionIcon>
      </Group>
    </UnstyledButton>
  );
}
