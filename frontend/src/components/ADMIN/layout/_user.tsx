import React from 'react';
import {ChevronLeft, ChevronRight, Logout, Settings} from '../../../assets/Icons';
import {Avatar, Box, Group, Menu, Text, UnstyledButton, useMantineTheme} from '@mantine/core';
import {useMutateLogout} from "../../../api/auth/mutations";
import {useNavigate} from "react-router-dom";
import {userPicture} from "../../common/Utils";
import useStore from "../../../store/user.store";

export function User({matches}: any) {
  const theme = useMantineTheme();
  const navigate = useNavigate();
  const { user } = useStore((state: any) => state);

  const { mutate: mutateLogout } = useMutateLogout();

  const handlerLogout = async () => {
    await mutateLogout();
  };

  return (
    <Menu style={{width: '100%'}} position="right" placement="end" gutter={0} withArrow control={
      <Box
        sx={{
          paddingTop: theme.spacing.sm,
          borderTop: `1px solid ${
            theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]
          }`
        }}
      >
        <UnstyledButton
          sx={{
            display: 'block',
            width: '100%',
            padding: theme.spacing.xs,
            borderRadius: theme.radius.sm,
            color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,

            '&:hover': {
              backgroundColor:
                theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
            },
          }}
        >
          <Group spacing={0}>
            <Avatar
              src={userPicture(user)}
              color="cyan"
              radius="xl"
              size={'sm'}
            >
              MS
            </Avatar>
            {matches &&
              <>
                <Box sx={{flex: 1}}>
                  <Text size="sm" weight={500}>
                    Amy Horsefighter
                  </Text>
                  <Text color="dimmed" size="xs">
                    ahorsefighter@gmail.com
                  </Text>
                </Box>

                {theme.dir === 'ltr' ? <ChevronRight size={18}/> : <ChevronLeft size={18}/>}
              </>
            }

          </Group>
        </UnstyledButton>
      </Box>
    }>
      <Menu.Label>Settings</Menu.Label>
      <Menu.Item onClick={() => navigate('/edit/profile')} icon={<Settings size={14} />}>
        Settings
      </Menu.Item>
      <Menu.Item onClick={handlerLogout} color="red" icon={<Logout size={14} />}>
        Logout
      </Menu.Item>
    </Menu>
  );
}
