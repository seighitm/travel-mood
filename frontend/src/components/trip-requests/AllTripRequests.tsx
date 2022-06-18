import React, {useCallback, useEffect, useState} from 'react';
import {Container, Group} from '@mantine/core';
import TabItemComponent from './TabItemComponent';
import {CustomLoader} from '../common/CustomLoader';
import {useIsFetching, useQueryClient} from 'react-query';
import CardTripRequest from './CardTripRequest';
import useStore from '../../store/user.store';
import InboxButton from './InboxButton';
import {useGetUserTripsRequests} from '../../api/trips/join-requests/queries';

const AllTripRequests = () => {
  const queryClient = useQueryClient();
  const [joinRequestStatus, setJoinRequestStatus] = useState('INBOX');
  const {
    data: userTripRequests,
    refetch: refetchUserTripRequest,
    isLoading,
  } = useGetUserTripsRequests(joinRequestStatus);
  const [allRequestsCount, setAllRequestsCount] = useState<any>([]);

  console.log(queryClient.getQueryData(['userTrips', 'ALL']))

  useEffect(() => {
    setAllRequestsCount(queryClient.getQueryData(['userTrips', 'ALL']));
    refetchUserTripRequest();
  }, [useIsFetching(['userTrips', 'ALL'])]);

  useCallback(async () => {
    await refetchUserTripRequest();
  }, [joinRequestStatus]);

  const {user} = useStore((state: any) => state);

  return (
    <Container>
      <Group style={{width: '100%'}} position={'center'}>
        <Group mb={15} position={'center'}>
          <TabItemComponent
            setJoinRequestStatus={setJoinRequestStatus}
            joinRequestStatus={joinRequestStatus}
            item={'APPROVED'}
            count={
              allRequestsCount?.find(
                (request: any) =>
                  (request.status === 'APPROVED' && user?.id == request?.userId) ||
                  (request.status === 'APPROVED' && user?.id !== request?.userId)
              )?._count ?? 0
            }
          />

          <InboxButton
            setJoinRequestStatus={setJoinRequestStatus}
            joinRequestStatus={joinRequestStatus}
            allRequestsCount={allRequestsCount}
            countReceived={
              allRequestsCount?.filter(
                (request: any) =>
                  (request.status === 'PENDING' && user?.id != request?.userId) ||
                  (request.status === 'RECEIVED' && user?.id == request?.userId)
              )?.length ?? 0
            }
            countPending={
              allRequestsCount?.filter(
                (request: any) =>
                  (request.status === 'PENDING' && user?.id == request?.userId) ||
                  (request.status === 'RECEIVED' && user?.id != request?.userId)
              )?.length ?? 0
            }
          />
        </Group>
      </Group>
      {isLoading && queryClient.getQueryData(['userTrips']) == undefined ? (
        <CustomLoader/>
      ) : (
        <>
          {userTripRequests?.map((item: any) => (
            <CardTripRequest tripRequest={item} joinRequestStatus={joinRequestStatus}/>
          ))}
        </>
      )}
    </Container>
  );
};

export default AllTripRequests;
