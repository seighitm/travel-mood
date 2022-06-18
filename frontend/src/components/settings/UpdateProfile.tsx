import React from 'react';
import {Avatar, AvatarsGroup, Button, Group, Paper, Text} from '@mantine/core';
import useStore from '../../store/user.store';
import AccountInfoComponent from './AccountInfoComponent';
import PersonaInfoComponent from './PersonaInfoComponent';
import {CustomLoader} from '../common/CustomLoader';
import {useGetUserById} from '../../api/users/queries';
import {useNavigate} from 'react-router-dom';
import {getFullUserName} from '../../utils/utils-func';
import {Photo} from '../common/Icons';

function UpdateProfile() {
  const navigate = useNavigate();
  const {user} = useStore((state: any) => state);
  const {data, isFetching} = useGetUserById({id: user.id, isEnabled: true});
  if (isFetching) return <CustomLoader/>;

  return (
    <>
      <Paper
        radius={10}
        px={'lg'}
        py={'xs'}
        mb={'xl'}
        shadow={'sm'}
        sx={(theme) => ({
          border: '2px solid ',
          borderColor: theme.colorScheme === 'dark' ? theme.colors.gray[8] : theme.colors.gray[2],
          position: 'relative',
          backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
        })}
      >
        <Group position={'apart'}>
          <Group align={'flex-end'} direction={'column'} style={{position: 'relative'}}>
            {data &&
              <AvatarsGroup size="lg" py={'xs'} spacing={40} limit={3}>
                {data?.images.map((item: any) => (
                  <Avatar size="xl" radius="xl" src={`${import.meta.env.VITE_STORE_AWS}${item.image}`}/>
                ))}
              </AvatarsGroup>
            }
          </Group>
          <Text
            weight={500}
            size={'xl'}
            sx={(theme) => ({
              [theme.fn.smallerThan('sm')]: {
                display: 'none',
              }
            })}
          >
            {getFullUserName(user)}
          </Text>
          <Button
            variant={'light'}
            leftIcon={<Photo size={18}/>}
            onClick={() =>
              navigate(`${user.role == 'ADMIN' ? '/admin' : ''}/users/${data.id}/images`)
            }
          >
            Show all images
          </Button>
        </Group>
      </Paper>
      <AccountInfoComponent/>
      <PersonaInfoComponent/>
    </>
  );
}

export default UpdateProfile;
