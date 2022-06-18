import { useMutation, useQueryClient } from 'react-query';
import chatStore from '../../../store/chat.store';
import { apiChangeJoinRequestStatus, apiJoinToTrip, apiLeaveFromTrip } from './fetch';
import { showNotification } from '@mantine/notifications';

export const useMutateJoinToTrip = () => {
  const queryClient = useQueryClient();
  const { socket } = chatStore((state: any) => state);
  return useMutation(
    ({ tripId, comment, userId, receiveUserId, typeOfRequest }: any) =>
      apiJoinToTrip({
        tripId,
        comment,
        userId,
        receiveUserId,
        typeOfRequest,
      }),
    {
      onSuccess: async (data: any) => {
        await queryClient.invalidateQueries(['userTrips', 'ALL']);
        const prevOneTrip: any = queryClient.getQueryData(['trips', 'one']);
        if (
          prevOneTrip
          // && (prevOneTrip.usersJoinToTrip.find((request: any) => request.userId == data.id) != undefined
          //   || prevOneTrip.usersJoinToTrip?.length == 0)
        ) {
          await queryClient.cancelQueries(['trips', 'one']);
          prevOneTrip.usersJoinToTrip.push(data);
          queryClient.setQueryData(['trips', 'one'], () => prevOneTrip);
        }

        socket.emit('send-trip-join-request', { receiveUserId: Number(data.receiveUserId) });

        showNotification({
          title: 'Request was sent successfully!',
          message: undefined,
        });
      },
      onError: (err: any) => {
        showNotification({
          title: 'Error send request!',
          message: err.response?.data?.message,
          color: 'red',
        });
      },
    }
  );
};
export const useMutateLeaveFromTrip = () => {
  const queryClient = useQueryClient();
  const { socket } = chatStore((state: any) => state);
  return useMutation(({ tripId }: any) => apiLeaveFromTrip({ tripId }), {
    onSuccess: async (data: any) => {
      const prevOneTrip: any = queryClient.getQueryData(['trips', 'one']);
      if (prevOneTrip) {
        await queryClient.cancelQueries(['trips', 'one']);
        prevOneTrip.usersJoinToTrip = prevOneTrip.usersJoinToTrip.filter(
          (user: any) => user.userId != data?.user.id
        );
        queryClient.setQueryData(['trips', 'one'], () => prevOneTrip);
      }
      socket.emit('send-trip-join-request', { receiveUserId: Number(data.trip?.user.id) });
      await queryClient.invalidateQueries(['userTrips', 'ALL']);
    },
  });
};
export const useMutateChangeJoinRequestStatus = () => {
  const queryClient = useQueryClient();
  const { socket } = chatStore((state: any) => state);
  return useMutation(
    ({ tripRequestId, status }: { tripRequestId: string | number | undefined; status: string }) =>
      apiChangeJoinRequestStatus({
        tripRequestId,
        status,
      }),
    {
      onSuccess: async (data: any) => {
        if (data.status === 'APPROVED') {
          await queryClient.invalidateQueries(['userTrips', 'PENDING']);
          await queryClient.invalidateQueries(['userTrips', 'CANCELED']);
          await queryClient.invalidateQueries(['userTrips', 'RECEIVED']);
        } else if (data.status === 'CANCELED') {
          await queryClient.invalidateQueries(['userTrips', 'PENDING']);
          await queryClient.invalidateQueries(['userTrips', 'APPROVED']);
          await queryClient.invalidateQueries(['userTrips', 'RECEIVED']);
        }

        await queryClient.invalidateQueries(['trips', 'one']);
        await queryClient.invalidateQueries(['userTrips', 'ALL']);

        socket.emit('send-trip-join-request', { receiveUserId: Number(data.receiveUserId) });
        socket.emit('send-trip-join-request', { receiveUserId: Number(data.sendUserId) });
      },
      onError: (err: any) => {
        showNotification({
          title: 'Error!',
          message: err.response?.data?.message,
          color: 'red',
        });
      },
    }
  );
};
