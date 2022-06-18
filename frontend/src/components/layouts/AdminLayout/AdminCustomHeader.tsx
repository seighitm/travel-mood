import React from 'react';
import { Burger, Button, createStyles, Group, Header, MediaQuery } from '@mantine/core';
import ToggleTheme from '../../common/ToggleTheme';
import AppLogo from '../../common/AppLogo';
import { ArrowNarrowLeft, MessageDots } from '../../common/Icons';
import chatStore from '../../../store/chat.store';
import { isEmptyArray, isNullOrUndefined } from '../../../utils/primitive-checks';
import { useQueryClient } from 'react-query';
import { useMediaQuery } from '@mantine/hooks';
import { useNavigate } from 'react-router-dom';
import { ProfileAvatar } from '../ProfileAvatar';
import { useGetAllProfileVisits } from '../../../api/users/queries';
import useStore from '../../../store/user.store';
import { useGetUserTripsRequests } from '../../../api/trips/join-requests/queries';
import { MD_ICON_SIZE } from '../../../utils/constants';

const useStyles = createStyles((theme) => ({
  profileAvatar: {
    [theme.fn.smallerThan('sm')]: {
      display: 'none',
    },
  },
}));

function AdminCustomHeader({ openedDrawer, setOpenedDrawer }: any) {
  const { setOpenedChatDrawer } = chatStore((state: any) => state);
  const queryClient = useQueryClient();
  const matches = useMediaQuery('(min-width: 768px)');
  const navigate = useNavigate();
  const { data } = useGetAllProfileVisits();
  const { data: userTrips } = useGetUserTripsRequests('ALL');
  const requests = userTrips?.find(
    (request: any) => request.status === 'PENDING' || request.status === 'RECEIVED'
  );
  const { classes } = useStyles();
  const { user } = useStore((state: any) => state);

  return (
    <Header height={60} px={'xl'}>
      <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
        <Group position="apart" style={{ width: '100%' }}>
          <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
            <Burger
              opened={openedDrawer}
              onClick={() => setOpenedDrawer((o: boolean) => !o)}
              size="sm"
              color={'gray'}
              mr="xl"
            />
          </MediaQuery>

          <MediaQuery smallerThan="sm" styles={{ display: 'none' }}>
            <div>
              <AppLogo onClick={() => navigate('/admin')} />
            </div>
          </MediaQuery>

          {!openedDrawer && location.pathname.split('/')?.length > 3 && (
            <Button
              leftIcon={<ArrowNarrowLeft size={MD_ICON_SIZE} />}
              variant={'subtle'}
              size={'sm'}
              compact
              onClick={() => {
                navigate(-1);
                // const loc: any = location.pathname.split('/');
                // loc.pop();
                // navigate(loc?.join('/'));
              }}
            >
              Back
            </Button>
          )}
          {!matches &&
            !isEmptyArray(queryClient.getQueryData(['chat'])) &&
            location.pathname?.split('/')[2] == 'chat' && (
              <Button
                variant={'outline'}
                rightIcon={<MessageDots size={13} />}
                compact
                onClick={() => setOpenedChatDrawer(true)}
              >
                Chats
              </Button>
            )}
          <Group spacing={40}>
            <div className={classes.profileAvatar}>
              {!isNullOrUndefined(user) && (
                <ProfileAvatar
                  guestsCounter={data?.guests?.filter((item: any) => item.seen == false).length}
                  travelRequestsCounter={requests != undefined ? requests._count : 0}
                />
              )}
            </div>
            <ToggleTheme />
          </Group>
        </Group>
      </div>
    </Header>
  );
}

export default AdminCustomHeader;
