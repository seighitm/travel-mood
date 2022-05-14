import React from 'react';
import {Avatar, Button, Group, Paper} from '@mantine/core';
import useStore from '../../../store/user.store';
import AccountInfoComponent from './AccountInfoComponent';
import PersonaInfoComponent from './PersonaInfoComponent';
import {CustomLoader} from '../../common/CustomLoader';
import {useGetUserById} from '../../../api/users/queries';
import {useNavigate} from 'react-router-dom';
import {userPicture} from "../../common/Utils";

function UpdateProfile() {
  const navigate = useNavigate();
  const {user} = useStore((state: any) => state);
  const {data, isFetching} = useGetUserById({id: user.id, isEnabled: true});

  if (isFetching) return <CustomLoader/>;

  return <>
    <Paper
      radius={10}
      p={'lg'}
      mb={'xl'}
      shadow={'lg'}
      sx={(theme) => ({
        border: '2px solid ',
        borderColor: theme.colorScheme === 'dark' ? theme.colors.gray[8] : theme.colors.gray[2],
        position: 'relative',
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
      })}
    >
      <Group position={'apart'}>
        <Group
          align={'flex-end'}
          direction={'column'}
          style={{position: 'relative'}}
        >
          {data &&
            <Avatar
              color={'blue'}
              size='lg'
              radius={50}
              src={userPicture(data)}
            />
          }
        </Group>
        <Button onClick={() => navigate('/user/' + data.id + '/images')}>
          Show all images
        </Button>
      </Group>
    </Paper>
    <AccountInfoComponent/>
    <PersonaInfoComponent/>
  </>
}

export default UpdateProfile;
