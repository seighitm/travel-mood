import React, {useState} from 'react';
import {Avatar, Divider, Group, Menu, Text, ThemeIcon, UnstyledButton, useMantineTheme,} from '@mantine/core';
import {ChevronRight, Directions, Eye, Heart, Logout, Plane, Settings, Users} from '../common/Icons';
import {useNavigate} from 'react-router-dom';
import useStore from '../../store/user.store';
import {useMutateLogout} from '../../api/auth/mutations';
import {customNavigation, getFullUserName, userPicture} from '../../utils/utils-func';
import ConfirmationModal from '../common/ConfirmationModal';
import {MD_ICON_SIZE} from '../../utils/constants';

export function ProfileAvatar({travelRequestsCounter, guestsCounter}: any) {
  const theme = useMantineTheme();
  const navigate = useNavigate();
  const {user} = useStore((state: any) => state);
  const {mutate: mutateLogout} = useMutateLogout();
  const [isOpenedLogoutConfirmationModal, setOpenedLogoutConfirmationModal] = useState(false);

  const handlerLogout = async () => {
    await mutateLogout();
  };

  return (
    <Group position="center">
      <ConfirmationModal
        openedConfirmationModal={isOpenedLogoutConfirmationModal}
        setOpenedConfirmationModal={setOpenedLogoutConfirmationModal}
        handlerSubmit={handlerLogout}
      />
      <Menu
        withArrow
        size={250}
        placement="end"
        transition="pop"
        styles={(theme) => ({
          itemLabel: {
            width: '100%'
          }
        })}
        control={
          <UnstyledButton>
            <Avatar src={userPicture(user)} color="cyan" radius="xl" size={'sm'}/>
          </UnstyledButton>
        }
      >
        <Menu.Item
          onClick={() => customNavigation(user?.role, navigate, `/users/${user.id}`)}
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
          onClick={() => customNavigation(user?.role, navigate, '/view')}
          icon={<Eye size={MD_ICON_SIZE} color={theme.colors.green[6]}/>}
        >
          <Group position={'apart'} style={{width: '100%'}}>
            Profile view
            {guestsCounter != 0 && (
              <ThemeIcon
                variant={'light'}
                style={{width: '15px', fontWeight: '500'}}
                color={'green'}
              >
                {guestsCounter}
              </ThemeIcon>
            )}
          </Group>
        </Menu.Item>
        <Menu.Item
          onClick={() => customNavigation(user?.role, navigate, '/favorites/trips')}
          icon={<Heart size={MD_ICON_SIZE} color={theme.colors.red[6]}/>}
        >
          Favorites
        </Menu.Item>
        <Menu.Item
          style={{position: 'relative', width: '100%'}}
          onClick={() => customNavigation(user?.role, navigate, '/trip-requests')}
          icon={<Users size={MD_ICON_SIZE} color={theme.colors.yellow[6]}/>}

        >
          <Group position={'apart'} style={{width: '100%'}}>
            <Text>
              Travel requests
            </Text>
            {travelRequestsCounter != 0 && (
              <ThemeIcon
                variant={'light'}
                style={{width: '15px', fontWeight: '500'}}
                color={'yellow'}
              >
                {travelRequestsCounter}
              </ThemeIcon>
            )}
          </Group>
        </Menu.Item>
        <Divider/>

        <Menu.Item
          style={{position: 'relative'}}
          onClick={() => customNavigation(user?.role, navigate, '/articles/add')}
          icon={<Plane size={MD_ICON_SIZE} color={theme.colors.orange[6]}/>}
        >
          New article
        </Menu.Item>

        <Menu.Item
          style={{position: 'relative'}}
          onClick={() => customNavigation(user?.role, navigate, '/trips/add')}
          icon={<Directions size={MD_ICON_SIZE} color={theme.colors.blue[6]}/>}
        >
          New trip
        </Menu.Item>
        <Divider/>
        <Menu.Item
          onClick={() => customNavigation(user?.role, navigate, `/users/${user?.id}/edit`)}
          icon={<Settings size={MD_ICON_SIZE}/>}
        >
          Settings
        </Menu.Item>
        <Menu.Item
          onClick={() => setOpenedLogoutConfirmationModal(true)}
          color="red"
          icon={<Logout size={MD_ICON_SIZE}/>}
        >
          Logout
        </Menu.Item>
      </Menu>
    </Group>
  );
}
