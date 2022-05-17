import {useMutation, useQueryClient} from "react-query";
import {
  addCommentToTrip,
  changeJoinRequestStatus,
  createTrip,
  deleteTrip,
  favoriteTrip,
  joinToTrip,
  leaveFromTrip,
  removeCommentFromTrip,
  switchTripHiddenStatus,
  unFavoriteTrip,
  updateTrip
} from "./axios";
import {useNavigate} from "react-router-dom";
import chatStore from "../../store/chat.store";
import {showNotification} from "@mantine/notifications";


//############################################################################################
//############################################################################################
export const useMutateAddTrip = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation((tripPayload: any) => createTrip({tripPayload}), {
    onSuccess: async () => {
      showNotification({
        title: 'Trip created successfully!',
        message: undefined,
        color: 'blue',
      });
      await queryClient.invalidateQueries(['trips', 'all'])
      // navigate('/trips');
    },
    onError: (err: any) => {
      showNotification({
        title: 'Error!',
        message: err.response?.data?.message,
        color: 'red',
      });
    }
  });
}

//############################################################################################
//############################################################################################
export const useMutateUnFavoriteTrip = () => {
  const queryClient = useQueryClient();
  return useMutation((id: any) => unFavoriteTrip({id: id}), {
    onSuccess: async (data: any) => {
      const usersAll: any = queryClient.getQueryData(['users', 'one']);
      if (usersAll) {
        await queryClient.cancelQueries(['users', 'one']);
        const findTripById = usersAll.trips.findIndex((item: any) => item.id == data.trip.id)
        if (findTripById != -1) {
          usersAll.trips[findTripById].tripFavoritedBy = data.trip.tripFavoritedBy;
          queryClient.setQueryData(['users', 'one'], () => usersAll);
        }
      }

      const prevOneTrip: any = queryClient.getQueryData(['trips', 'one']);
      if (prevOneTrip) {
        await queryClient.cancelQueries(['trips', 'one']);
        prevOneTrip.tripFavoritedBy = data.trip.tripFavoritedBy;
        queryClient.setQueryData(['trips', 'one'], () => prevOneTrip);
      }

      const prevAllTrips: any = queryClient.getQueryData(['trips', 'all']);
      if (prevAllTrips) {
        await queryClient.cancelQueries(['trips', 'all']);
        const foundTripIndex = prevAllTrips.trips.findIndex((item: any) => item.id == data.trip.id);
        prevAllTrips.trips[foundTripIndex].tripFavoritedBy = data.trip.tripFavoritedBy
        queryClient.setQueryData(['trips', 'all'], () => prevAllTrips);
      }

      const prevAllFavorites: any = queryClient.getQueryData(['favorites', 'all', 'articles']);
      if (prevAllFavorites) {
        await queryClient.invalidateQueries(['favorites', 'all', 'trips']);
      }
    },
  });
};

//############################################################################################
//############################################################################################
export const useMutateFavoriteTrip = () => {
  const queryClient = useQueryClient();
  return useMutation((id: any) => favoriteTrip({id: id}), {
    onSuccess: async (data: any) => {
      const usersAll: any = queryClient.getQueryData(['users', 'one']);
      if (usersAll) {
        await queryClient.cancelQueries(['users', 'one']);
        const findTripById = usersAll.trips.findIndex((item: any) => item.id == data.trip.id)
        console.log(findTripById)
        if (findTripById != -1) {
          usersAll.trips[findTripById].tripFavoritedBy = data.trip.tripFavoritedBy;
          queryClient.setQueryData(['users', 'one'], () => usersAll);
        }
      }

      const prevOneTrip: any = queryClient.getQueryData(['trips', 'one']);
      if (prevOneTrip) {
        await queryClient.cancelQueries(['trips', 'one']);
        prevOneTrip.tripFavoritedBy = data.trip.tripFavoritedBy;
        queryClient.setQueryData(['trips', 'one'], () => prevOneTrip);
      }

      const prevAllTrips: any = queryClient.getQueryData(['trips', 'all']);
      if (prevAllTrips) {
        await queryClient.cancelQueries(['trips', 'all']);
        const foundTripIndex = prevAllTrips.trips.findIndex((item: any) => item.id == data.trip.id);
        prevAllTrips.trips[foundTripIndex].tripFavoritedBy = data.trip.tripFavoritedBy
        queryClient.setQueryData(['trips', 'all'], () => prevAllTrips);
      }
    }
  });
};

//############################################################################################
//############################################################################################
export const useMutationUpdateTrip = (tripId: any) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation(({tripId, tripPayload}: any) => updateTrip({tripId, tripPayload}),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(['trips', 'one'])
        navigate('/trips/' + tripId);
      },
    });
};

//############################################################################################
//############################################################################################
export const useMutateAddCommentToTrip = () => {
  const queryClient = useQueryClient();
  return useMutation(({id, comment}: any) => addCommentToTrip({id, comment}),
    {
      onSuccess: async (data) => {
        const prevOneTrip: any = queryClient.getQueryData(['trips', 'one']);
        if (prevOneTrip) {
          await queryClient.cancelQueries(['trips', 'one']);
          prevOneTrip.tripComments.unshift({...data});
          queryClient.setQueryData(['trips', 'one'], () => prevOneTrip);
        }
      }
    });
};

//############################################################################################
//############################################################################################
export const useMutationRemoveCommentFromTrip = () => {
  const queryClient = useQueryClient();
  return useMutation((commentId: string | number) => removeCommentFromTrip({commentId}),
    {
      onSuccess: async (data: any) => {
        const prevOneTrip: any = queryClient.getQueryData(['trips', 'one']);
        if (prevOneTrip) {
          await queryClient.cancelQueries(['trips', 'one']);
          prevOneTrip.tripComments = [...prevOneTrip.tripComments.filter((item: any) => item.id != data.id)];
          queryClient.setQueryData(['trips', 'one'], () => prevOneTrip);
        }
      }
    }
  );
};

//############################################################################################
//############################################################################################
export const useMutationDeleteTrip = (onSuccessDeleteEvent: any) => {
  const queryClient = useQueryClient();

  return useMutation((id: any) => deleteTrip({id: id}), {
    onSuccess: async () => {

      await queryClient.invalidateQueries(['filtering'])

      if (onSuccessDeleteEvent)
        onSuccessDeleteEvent()
      showNotification({
        title: 'Successful DELETE',
        message: null,
        color: 'blue'
      });
    },
    onError: async (err: any) => {
      showNotification({
        title: 'Error DELETE',
        message: err.response?.data?.message,
        color: 'red',
      });
    },
  });
};

//############################################################################################
//############################################################################################
export const useMutateJoinToTrip = () => {
  const queryClient = useQueryClient();
  const {socket} = chatStore((state: any) => state);

  return useMutation(({tripId, comment, userId, receiveUserId, typeOfRequest}: any) => joinToTrip({
      tripId,
      comment,
      userId,
      receiveUserId,
      typeOfRequest
    }), {
      onSuccess: async (data: any) => {
        console.log(data)
        await queryClient.invalidateQueries(['userTrips', 'ALL']);
        await queryClient.invalidateQueries(['trips', 'one']);

        socket.emit('send-trip-join-request', {receiveUserId: Number(data.receiveUserId)});

        // if (data && data.receiveUserId) {
        // }

        // const prevOneTrip: any = queryClient.getQueryData(['trips', 'one']);
        // if (prevOneTrip
        //   && (prevOneTrip.usersJoinToTrip.find((request: any) => request.userId == data.id) != undefined
        //     || prevOneTrip.usersJoinToTrip?.length == 0)
        // ) {
        //   await queryClient.cancelQueries(['trips', 'one']);
        //   prevOneTrip.usersJoinToTrip.push(data)
        //   queryClient.setQueryData(['trips', 'one'], () => prevOneTrip);
        // }
        // socket.emit('send-trip-join-request', {userId: Number(data.user.id), tripId: Number(data.trip.id)});
      },
      onError: (err: any) => {
        showNotification({
          title: 'Error DELETE',
          color: 'red',
          message: err.response?.data?.message,
        });
      }
    }
  );
};

//############################################################################################
//############################################################################################
export const useMutateLeaveFromTrip = () => {
  const queryClient = useQueryClient();
  const {socket} = chatStore((state: any) => state);
  return useMutation(({tripId}: any) => leaveFromTrip({tripId}),
    {
      onSuccess: async (data: any) => {
        const prevOneTrip: any = queryClient.getQueryData(['trips', 'one']);
        await queryClient.invalidateQueries(['trips', 'one']);
        console.log(data)

        socket.emit("send-trip-join-request", ({tripId: Number(data.trip.id)}));

        await queryClient.invalidateQueries(['userTrips', 'ALL']);

        // if (prevOneTrip) {
        //   await queryClient.cancelQueries(['trips', 'one'])
        //   prevOneTrip.usersJoinToTrip = prevOneTrip.usersJoinToTrip.filter((user: any) => user.userId != data.user.id)
        //   queryClient.setQueryData(['trips', 'one'], () => prevOneTrip)
        // }

      },
    }
  );
};

//############################################################################################
//############################################################################################
export const useMutateChangeJoinRequestStatus = () => {
  const queryClient = useQueryClient();
  const {socket} = chatStore((state: any) => state);
  return useMutation(({tripRequestId, status}: any) => changeJoinRequestStatus({tripRequestId, status}), {
      onSuccess: async (data: any) => {
        console.log(data)
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

        socket.emit('send-trip-join-request', {receiveUserId: Number(data.receiveUserId)});

        // await queryClient.invalidateQueries(['userTrips', 'APPROVED', 'PENDING', 'CANCELED']);

        // const prevOneTrip: any = await queryClient.getQueryData(['trips', 'one']);
        // if (prevOneTrip) {
        //   await queryClient.cancelQueries(['trips', 'one']);
        //   const newComments = prevOneTrip.usersJoinToTrip.findIndex(
        //     (item: any) => item.userId == data.userId && item.tripId == data.tripId
        //   );
        //   prevOneTrip.usersJoinToTrip[newComments] = {...prevOneTrip.usersJoinToTrip[newComments], status: data.status,};
        //   queryClient.setQueryData(['trips', 'one'], () => prevOneTrip);
        // }
        //
        // await queryClient.invalidateQueries(['CANCELED', 'APPROVED', 'PENDING', 'CANCELED']);

        // await queryClient.invalidateQueries([
        //   'userTrips',
        //   data.status.toString() == 'APPROVED'
        //     ? 'CANCELED'
        //     : data.status.toString() == 'CANCELED'
        //       ? 'APPROVED'
        //       : '',
        // ]);
        // await queryClient.invalidateQueries(['PENDING', 'APPROVED', 'RECEIVED', 'CANCELED']);
        // socket.emit('send-trip-join-request', {tripRequestId: Number(data.id)});
      },
      onError: (err: any) => {
        showNotification({
          title: 'Error DELETE',
          color: 'red',
          message: err.response?.data?.message,
        });
      }
    }
  );
};


//############################################################################################
//############################################################################################

export const useMutateSwitchTripHiddenStatus = () => {
  const queryClient = useQueryClient();
  const {socket} = chatStore((state: any) => state);
  return useMutation((tripId: any) => switchTripHiddenStatus(tripId),
    {
      onSuccess: async (data: any) => {
        const prevOneTrip: any = queryClient.getQueryData(['trips', 'one']);
        await queryClient.invalidateQueries(['trips', 'one']);
        console.log(data)
        console.log(prevOneTrip)

        // if (prevOneTrip) {
        //   await queryClient.cancelQueries(['trips', 'one'])
        //   prevOneTrip.usersJoinToTrip = prevOneTrip.usersJoinToTrip.filter((user: any) => user.userId != data.user.id)
        //   queryClient.setQueryData(['trips', 'one'], () => prevOneTrip)
        // }

      },
    }
  );
};

//############################################################################################
//############################################################################################

//############################################################################################
//############################################################################################

//############################################################################################
//############################################################################################

//############################################################################################
//############################################################################################

//############################################################################################
//############################################################################################

//############################################################################################
//############################################################################################

//############################################################################################
//############################################################################################
