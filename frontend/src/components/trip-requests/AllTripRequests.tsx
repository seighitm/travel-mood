import React, {useCallback, useEffect, useState} from 'react';
import {Container, Group} from '@mantine/core';
import {useGetUserTrips} from '../../api/trips/queries';
import TabItemComponent from './TabItemComponent';
import {CustomLoader} from '../common/engine/Routes';
import {useIsFetching, useQueryClient} from "react-query";
import CardTripRequest from "./CardTripRequest";
import useStore from "../../store/user.store";

const AllTripRequests = () => {
  const queryClient = useQueryClient();
  const [joinRequestStatus, setJoinRequestStatus] = useState('PENDING');
  const {data: userTripRequests, refetch: refetchUserTripRequest, isLoading} = useGetUserTrips(joinRequestStatus);
  const [allRequestsCount, setAllRequestsCount] = useState<any>([])

  useEffect(() => {
    setAllRequestsCount(queryClient.getQueryData(['userTrips', 'ALL']))
    refetchUserTripRequest();
  }, [useIsFetching(['userTrips', 'ALL'])])

  useCallback(async () => {
    await refetchUserTripRequest();
  }, [joinRequestStatus]);

  const getCountOfRequestType = (status: any) => {
    return allRequestsCount?.find((request: any) => request.status === status) != undefined
      ? allRequestsCount?.find((request: any) => request.status === status)._count
      : 0
  }
  const {user, onlineUsers} = useStore((state: any) => state);

  console.log(allRequestsCount)

  return (
    <Container>
      <Group style={{width: '100%'}} position={'center'}>
        <Group mb={15} position={'center'}>

          <TabItemComponent
            setJoinRequestStatus={setJoinRequestStatus}
            joinRequestStatus={joinRequestStatus}
            item={'PENDING'}
            count={allRequestsCount?.find((request: any) =>
              (request.status === 'PENDING' && user?.id == request?.userId) ||
              (request.status === 'RECEIVED' && user?.id !== request?.userId)
            )?._count ?? 0}
          />

          <TabItemComponent
            setJoinRequestStatus={setJoinRequestStatus}
            joinRequestStatus={joinRequestStatus}
            item={'APPROVED'}
            count={allRequestsCount?.find((request: any) =>
              (request.status === 'APPROVED' && user?.id == request?.userId) ||
              (request.status === 'APPROVED' && user?.id !== request?.userId)
            )?._count ?? 0 }
          />

          {/*<TabItemComponent*/}
          {/*  setJoinRequestStatus={setJoinRequestStatus}*/}
          {/*  joinRequestStatus={joinRequestStatus}*/}
          {/*  item={'CANCELED'}*/}
          {/*  count={getCountOfRequestType('CANCELED')}*/}
          {/*/>*/}

          <TabItemComponent
            setJoinRequestStatus={setJoinRequestStatus}
            joinRequestStatus={joinRequestStatus}
            item={'RECEIVED'}
            count={allRequestsCount?.find((request: any) => (request.status === 'PENDING' && user?.id !== request?.userId)
              || (request.status === 'RECEIVED' && user?.id == request?.userId)
            )?._count ?? 0}
          />

        </Group>
      </Group>
      {(isLoading && queryClient.getQueryData(['userTrips']) == undefined)
        ? <CustomLoader/>
        : <>
          {userTripRequests?.map((item: any) => (
            <CardTripRequest tripRequest={item} joinRequestStatus={joinRequestStatus}/>
          ))}
        </>
      }
    </Container>
  );
};

export default AllTripRequests;
