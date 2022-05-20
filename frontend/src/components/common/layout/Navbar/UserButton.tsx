import React from 'react';
import {ActionIcon, Avatar, createStyles, Group, Text, UnstyledButton,} from '@mantine/core';
import {useNavigate} from 'react-router-dom';
import useStore from '../../../../store/user.store';
import {ChevronRight} from '../../../../assets/Icons';
import {userPicture} from "../../Utils";
import {getFullUserName} from "../../../../utils/utils-func";

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

export function UserButton({setOpenedDrawer}: any) {
  const {classes} = useStyles();
  const navigate = useNavigate();
  const {user} = useStore((state: any) => state);

  return (
    <UnstyledButton
      className={classes.user}
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
            <Text size="xs" color="dimmed">
              {getFullUserName(user)}
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
