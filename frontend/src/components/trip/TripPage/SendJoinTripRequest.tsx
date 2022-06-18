import React from 'react';
import {ActionIcon, Avatar, Box, Button, Group, Modal, ScrollArea, Stack, Text,} from '@mantine/core';
import CustomPaper from '../../common/CustomPaper';
import {useNavigate} from 'react-router-dom';
import {isEmptyArray, isNullOrUndefined} from '../../../utils/primitive-checks';
import {ArrowNarrowRight, Send} from '../../common/Icons';
import {customNavigation, getFullUserName, userPicture} from '../../../utils/utils-func';
import useStore from '../../../store/user.store';
import {useMutateJoinToTrip} from '../../../api/trips/join-requests/mutations';

function SendJoinTripRequest({isOpenedInviteModal, setIsOpenedInviteModal, following, tripId}: any) {
  const {mutate: mutateJoinToTrip, isLoading} = useMutateJoinToTrip();
  const navigate = useNavigate();
  const {user} = useStore((state: any) => state);

  return (
    <Modal
      opened={isOpenedInviteModal}
      onClose={() => setIsOpenedInviteModal(false)}
      centered
      withCloseButton={false}
      styles={{
        modal: {
          paddingTop: '10px!important',
          paddingBottom: '10px!important',
        },
      }}
    >
      {!isNullOrUndefined(following) && !isEmptyArray(following) ? (
        <ScrollArea pr={'md'} offsetScrollbars style={{height: 400}}>
          {following?.map((item: any) => (
            <CustomPaper key={item?.id}>
              <Group pl={'sm'} my={5} noWrap align={'center'} position={'apart'}>
                <Group onClick={() => customNavigation(user?.role, navigate, `/users/${item?.id}`)}>
                  <Avatar
                    style={{cursor: 'pointer'}}
                    size={'md'}
                    radius={'xl'}
                    src={userPicture(item)}
                  />
                  <Box style={{cursor: 'pointer'}}>
                    <Text lineClamp={1}>
                      {getFullUserName(item)}
                    </Text>
                  </Box>
                </Group>
                <Group>
                  <ActionIcon
                    disabled={isLoading}
                    loading={isLoading}
                    mr={'xs'}
                    color={'blue'}
                    variant={'light'}
                    radius={'xl'}
                    onClick={() =>
                      mutateJoinToTrip({
                        tripId,
                        userId: item.id,
                        typeOfRequest: 'SEND',
                      })
                    }
                  >
                    <Send size={18}/>
                  </ActionIcon>
                </Group>
              </Group>
            </CustomPaper>
          ))}
        </ScrollArea>
      ) : (
        <Stack align={'center'}>
          <Text weight={700} style={{fontSize: '20px'}} color="red">
            You have no friends!
          </Text>
          <Button
            variant={'subtle'}
            onClick={() => customNavigation(user?.role, navigate, '/users')}
            rightIcon={<ArrowNarrowRight size={17}/>}
          >
            Add new friends
          </Button>
        </Stack>
      )}
    </Modal>
  );
}

export default SendJoinTripRequest;
