import {$authHost, $host} from "../api";


export const unFavoriteTrip = async ({id}: { id: any }) => {
  const {data} = await $authHost.delete(`trip/${id.id}/favorite`);
  return data;
};

export const favoriteTrip = async ({id}: { id: any }) => {
  const {data} = await $authHost.put(`trip/${id.id}/favorite`);
  return data;
};

export const getOneTrip = async (id: any) => {
  console.log('miiiiiiiiiii')
  console.log(id)
  const {data} = await $authHost.get('trip-one/' + id);
  return data;
};

export const addCommentToTrip = async ({id, comment}: any) => {
  const {data} = await $authHost.post(`trip/${id}/comment`, {comment});
  return data;
};

export const updateTrip = async ({tripId, tripPayload}: { tripId: string; tripPayload: any }) => {
  const {data} = await $authHost.put('trip/' + tripId, tripPayload);
  return data;
};

export const createTrip = async ({tripPayload}: { tripPayload: any }) => {
  const {data} = await $authHost.post('trip', tripPayload);
  return data;
};

export const leaveFromTrip = async ({tripId}: { tripId: any }) => {
  const {data} = await $authHost.delete(`trip/${tripId}/join`);
  return data;
};

export const removeCommentFromTrip = async ({commentId}: { commentId: any }) => {
  const {data} = await $authHost.delete(`trip/${commentId.commentId}/comment`);
  return data;
};

export const deleteTrip = async ({id}: { id: string }) => {
  const {data} = await $authHost.delete('trip/' + id);
  return data;
};

export const joinToTrip = async ({tripId, comment, userId, receiveUserId, typeOfRequest}: {
  tripId: string | number;
  userId: string | number;
  comment?: string;
  receiveUserId?: string | number;
  typeOfRequest: any
}) => {
  const {data} = await $authHost.post(`trip/${tripId}/join`, {
    comment: comment,
    userId: userId,
    receiveUserId: receiveUserId,
    typeOfRequest: typeOfRequest
  });
  return data;
};


export const getTrips = async ({destinations, sex, maxBudget, minBudget, languages, date, budget, page}: any) => {
  console.log({destinations, sex, maxBudget, minBudget, languages, date})
  const {data} = await $authHost.get('trips', {
    params: {
      ...(page
        ? {page: page}
        : {}),
      ...(destinations && destinations?.length > 0
        ? {destinations: destinations}
        : {}),
      ...(sex
        ? {sex: sex}
        : {}),
      ...(languages && languages?.length > 0
        ? {languages: languages}
        : {}),
      ...(budget
        ? {budget: budget}
        : {}),
      ...(date && date?.length == 2
        ? {date: date}
        : {}),
    },
  });
  return data;
};

export const changeJoinRequestStatus = async ({tripRequestId, status}: any) => {
  const {data} = await $authHost.put(`trip/joinRequest/${tripRequestId}/changeStatus`, {
    status: status,
    tripRequestId: tripRequestId
  });
  return data;
};

export const getTripsFiltering = async (
  page: any,
  limit: any,
  search: any,
  sortBy: any,
  order: any,
) => {
  const {data} = await $host.get('/admin/trips', {
    params: {
      page,
      limit,
      ...(search ? {search} : {}),
      ...(sortBy ? {sortBy} : {}),
      ...(order ? {order} : {}),
    },
  });
  return data;
};


export const switchTripHiddenStatus = async (tripId: any) => {
  const {data} = await $authHost.put(`trip/${tripId}/hide/`);
  return data;
};

export const getUserTrips = async (status: string) => {
  const {data} = await $authHost.get('trips/requests', {
    params: {
      ...(status
        ? {status: status}
        : {}),
    },
  });
  return data;
};
