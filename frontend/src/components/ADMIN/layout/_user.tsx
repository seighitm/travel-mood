import React from 'react';
import {ChevronRight, Directions, Heart, Logout, Plane, Settings} from '../../../assets/Icons';
import {
  ActionIcon,
  Avatar,
  Badge,
  Box,
  Divider,
  Group,
  Menu,
  Text,
  UnstyledButton,
  useMantineTheme
} from '@mantine/core';
import {useMutateLogout} from "../../../api/auth/mutations";
import {useNavigate} from "react-router-dom";
import {cutString, userPicture} from "../../common/Utils";
import useStore from "../../../store/user.store";
import {getFullUserName} from "../../../utils/utils-func";
import {EyeOpenIcon, PersonIcon} from "@modulz/radix-icons";

export function User({matches}: any) {
  const theme = useMantineTheme();
  const navigate = useNavigate();
  const {user} = useStore((state: any) => state);

  const {mutate: mutateLogout} = useMutateLogout();

  const handlerLogout = async () => {
    await mutateLogout();
  };

  return (
    <Menu  position="right" placement="end" gutter={0} withArrow control={
      <Box
        style={{width: '100%'}}
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
          <Group style={{width: '100%'}} direction={'column'} spacing={0} position={'center'}>
            <Avatar
              src={userPicture(user)}
              color="cyan"
              radius="xl"
              size={'md'}
            />
            {/*{matches &&*/}
            {/*  <Box>*/}
            {/*    <Text align={'center'} size="sm" weight={500}>*/}
            {/*      {getFullUserName(user)}*/}
            {/*    </Text>*/}
            {/*  </Box>*/}
            {/*}*/}
          </Group>
        </UnstyledButton>
      </Box>
    }>
      <Menu.Item rightSection={<ChevronRight size={14}/>}>
        <Group onClick={() => navigate(`/admin/user/${user.id}`)}>
          <Text weight={500}>{getFullUserName(user)}</Text>
        </Group>
      </Menu.Item>

      <Divider/>
      <Menu.Item
        style={{position: 'relative'}}
        onClick={() => navigate('/admin/view')}
        icon={<EyeOpenIcon color={theme.colors.green[6]}/>}
      >
        {0 != 0 && (
          <Badge
            mr={'md'}
            style={{
              position: 'absolute',
              right: '-7px',
              top: '7px',
              color: theme.colors.green[7],
              backgroundColor:
                theme.colorScheme === 'dark' ? theme.colors.gray[8] : theme.colors.gray[1],
            }}
          >
            {/*{guestsCounter}*/}
          </Badge>
        )}
        Profile view
      </Menu.Item>
      <Menu.Item
        onClick={() => navigate('/admin/favorites/trips')}
        icon={<Heart size={14} color={theme.colors.red[6]}/>}
      >
        Liked posts
      </Menu.Item>
      <Menu.Item
        style={{position: 'relative'}}
        onClick={() => navigate('/admin/trip-requests')}
        icon={<PersonIcon color={theme.colors.yellow[6]}/>}
      >
        Travel requests
        {0 != 0 && (
          <ActionIcon
            size={'sm'}
            mr={'md'}
            style={{
              top: '7px',
              color: theme.colors.yellow[7],
              backgroundColor:
                theme.colorScheme === 'dark' ? theme.colors.gray[8] : theme.colors.gray[1],
              position: 'absolute',
              right: '-7px',
            }}
          >
            {/*{travelRequestsCounter}*/}
          </ActionIcon>
        )}
      </Menu.Item>
      <Divider/>

      <Menu.Label>Settings</Menu.Label>
      <Menu.Item onClick={() => navigate('/admin/edit/profile')} icon={<Settings size={14}/>}>
        Settings
      </Menu.Item>
      <Menu.Item onClick={handlerLogout} color="red" icon={<Logout size={14}/>}>
        Logout
      </Menu.Item>
    </Menu>
  );
}
