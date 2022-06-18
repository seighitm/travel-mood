import { $authHost } from '../../api';

export const apiLeaveFromTrip = async ({ tripId }: { tripId: any }) => {
  const { data } = await $authHost.delete(`trip/${tripId}/join`);
  return data;
};
export const apiJoinToTrip = async ({
  tripId,
  comment,
  userId,
  receiveUserId,
  typeOfRequest,
}: {
  tripId: string | number;
  userId: string | number;
  comment?: string;
  receiveUserId?: string | number;
  typeOfRequest: any;
}) => {
  const { data } = await $authHost.post(`trip/${tripId}/join`, {
    comment: comment,
    userId: userId,
    receiveUserId: receiveUserId,
    typeOfRequest: typeOfRequest,
  });
  return data;
};
export const apiChangeJoinRequestStatus = async ({ tripRequestId, status }: any) => {
  const { data } = await $authHost.put(`trip/request/${tripRequestId}/changeStatus`, {
    status: status,
    tripRequestId: tripRequestId,
  });
  return data;
};
export const apiGetUserTripsRequests = async (status: string) => {
  const { data } = await $authHost.get('trips/requests', {
    params: {
      ...(status ? { status: status } : {}),
    },
  });
  return data;
};
