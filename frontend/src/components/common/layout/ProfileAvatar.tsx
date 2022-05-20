import React from 'react';
import {ActionIcon, Avatar, Badge, Divider, Group, Menu, Text, UnstyledButton, useMantineTheme,} from '@mantine/core';
import {ChevronRight, Directions, Eye, Heart, Logout, Plane, Settings, User} from '../../../assets/Icons';
import {useNavigate} from 'react-router-dom';
import useStore from '../../../store/user.store';
import {useMutateLogout} from '../../../api/auth/mutations';
import {userPicture} from "../Utils";
import {getFullUserName} from "../../../utils/utils-func";

export function ProfileAvatar({travelRequestsCounter, guestsCounter}: any) {
  const theme = useMantineTheme();
  const navigate = useNavigate();
  const {user} = useStore((state: any) => state);
  const {mutate: mutateLogout} = useMutateLogout();

  const handlerLogout = async () => {
    await mutateLogout();
  };

  return (
    <Group position="center">
      <Menu
        withArrow
        size={250}
        placement="end"
        transition="pop"
        control={
          <UnstyledButton>
            <Avatar
              src={userPicture(user)}
              color="cyan"
              radius="xl"
              size={'sm'}
            />
          </UnstyledButton>
        }
      >
        <Menu.Item
          onClick={() => navigate(`/user/${user.id}`)}
          rightSection={<ChevronRight size={14}/>}
        >
          <Group>
            <Text lineClamp={2} weight={500}>
              {getFullUserName(user)}
            </Text>
          </Group>
        </Menu.Item>

        <Divider/>
        <Menu.Item
          style={{position: 'relative'}}
          onClick={() => navigate('/view')}
          icon={<Eye color={theme.colors.green[6]}/>}
        >
          {guestsCounter != 0 && (
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
              {guestsCounter}
            </Badge>
          )}
          Profile view
        </Menu.Item>
        <Menu.Item
          onClick={() => navigate('/favorites/trips')}
          icon={<Heart size={14} color={theme.colors.red[6]}/>}
        >
          Liked posts
        </Menu.Item>
        <Menu.Item
          style={{position: 'relative'}}
          onClick={() => navigate('/trip-requests')}
          icon={<User color={theme.colors.yellow[6]}/>}
        >
          Travel requests
          {travelRequestsCounter != 0 && (
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
              {travelRequestsCounter}
            </ActionIcon>
          )}
        </Menu.Item>
        <Divider/>

        <Menu.Item
          style={{position: 'relative'}}
          onClick={() => navigate('/articles/add')}
          icon={<Plane size={14} color={theme.colors.orange[6]}/>}
        >
          New article
        </Menu.Item>

        <Menu.Item
          style={{position: 'relative'}}
          onClick={() => navigate('/trips/add')}
          icon={<Directions size={14} color={theme.colors.blue[6]}/>}
        >
          New trip
        </Menu.Item>
        <Divider/>
        <Menu.Item onClick={() => navigate('/edit/profile')} icon={<Settings size={14}/>}>
          Settings
        </Menu.Item>
        <Menu.Item onClick={handlerLogout} color="red" icon={<Logout size={14}/>}>
          Logout
        </Menu.Item>
      </Menu>
    </Group>
  );
}
