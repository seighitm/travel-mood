import { useMutation, useQueryClient } from 'react-query';
import {
  apiCreateTrip,
  apiDeleteTrip,
  apiFavoriteTrip,
  apiSwitchTripHiddenStatus,
  apiUnFavoriteTrip,
  apiUpdateTrip,
} from './axios';
import { useNavigate, useParams } from 'react-router-dom';
import { showNotification } from '@mantine/notifications';
import useStore from '../../store/user.store';
import { isNullOrUndefined } from '../../utils/primitive-checks';
import { ITrip } from '../../types/ITrip';
import { customNavigation } from '../../utils/utils-func';
import { IUser } from '../../types/IUser';
import { ROLE } from '../../types/enums';

export const useMutateAddTrip = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { user } = useStore((state: any) => state);
  return useMutation((tripPayload: any) => apiCreateTrip({ tripPayload }), {
    onSuccess: async () => {
      showNotification({
        title: 'Trip created successfully!',
        message: undefined,
      });

      const prevAllTrips: ITrip[] | undefined = await queryClient.getQueryData(['trips', 'all']);
      if (prevAllTrips) {
        await queryClient.invalidateQueries(['trips', 'all']);
      }
      if (!isNullOrUndefined(user)) {
        customNavigation(user?.role, navigate, `/trips`);
      }
    },
    onError: (err: any) => {
      showNotification({
        title: 'Error!',
        message: err.response?.data?.message,
        color: 'red',
      });
    },
  });
};

export const useMutateUnFavoriteTrip = () => {
  const queryClient = useQueryClient();
  const { id } = useParams();
  const { user } = useStore((state: any) => state);

  return useMutation((id: any) => apiUnFavoriteTrip({ id: id }), {
    onSuccess: async (data: any) => {
      const prevAllUsers: IUser | undefined = queryClient.getQueryData([
        'users',
        'one',
        id?.toString(),
      ]);
      if (!isNullOrUndefined(prevAllUsers)) {
        await queryClient.cancelQueries(['users', 'one', id?.toString()]);
        const findTripById = prevAllUsers.trips.findIndex((item: any) => item.id == data.trip?.id);
        if (findTripById != -1) {
          prevAllUsers.trips[findTripById].favoritedBy = data.trip.favoritedBy;
          queryClient.setQueryData(['users', 'one', id?.toString()], () => prevAllUsers);
        }
      }

      const prevOneTrip: ITrip | undefined = queryClient.getQueryData(['trips', 'one']);
      if (!isNullOrUndefined(prevOneTrip)) {
        await queryClient.cancelQueries(['trips', 'one']);
        prevOneTrip.favoritedBy = data.trip.favoritedBy;
        queryClient.setQueryData(['trips', 'one'], () => prevOneTrip);
      }

      const prevAllTrips: ITrip | undefined = queryClient.getQueryData(['trips', 'all']);
      if (prevAllTrips) {
        await queryClient.cancelQueries(['trips', 'all']);
        const foundTripIndex = prevAllTrips.trips?.findIndex(
          (item: any) => item.id == data.trip.id
        );
        prevAllTrips.trips[foundTripIndex].favoritedBy = data.trip.favoritedBy;
        queryClient.setQueryData(['trips', 'all'], () => prevAllTrips);
      }

      const prevAllFavorites: IUser | undefined = await queryClient.getQueryData([
        'favorites',
        'all',
        'trips',
      ]);
      if (!isNullOrUndefined(prevAllFavorites)) {
        await queryClient.cancelQueries(['favorites', 'all', 'trips']);
        prevAllFavorites.tripFavoritedBy = prevAllFavorites?.tripFavoritedBy?.filter(
          (item: any) => item.id != data.trip.id
        );
        queryClient.setQueryData(['favorites', 'all', 'trips'], () => prevAllFavorites);
      }
    },
  });
};

export const useMutateFavoriteTrip = () => {
  const queryClient = useQueryClient();
  const { id } = useParams();
  return useMutation((id: any) => apiFavoriteTrip({ id: id }), {
    onSuccess: async (data: any) => {
      const usersAll: IUser | undefined = queryClient.getQueryData(['users', 'one', id]);
      if (!isNullOrUndefined(usersAll)) {
        await queryClient.cancelQueries(['users', 'one', id]);
        const findTripById: number = usersAll.trips.findIndex(
          (item: any) => item.id == data.trip.id
        );
        if (!isNullOrUndefined(findTripById) && findTripById != -1) {
          usersAll.trips[findTripById].favoritedBy = data.trip.favoritedBy;
          queryClient.setQueryData(['users', 'one', id], () => usersAll);
        }
      }

      const prevOneTrip: ITrip | undefined = queryClient.getQueryData(['trips', 'one']);
      if (!isNullOrUndefined(prevOneTrip)) {
        await queryClient.cancelQueries(['trips', 'one']);
        prevOneTrip.favoritedBy = data.trip.favoritedBy;
        queryClient.setQueryData(['trips', 'one'], () => prevOneTrip);
      }

      const prevAllTrips: ITrip | undefined = queryClient.getQueryData(['trips', 'all']);
      if (!isNullOrUndefined(isNullOrUndefined)) {
        await queryClient.cancelQueries(['trips', 'all']);
        const foundTripIndex: number | undefined = prevAllTrips?.trips.findIndex(
          (item: any) => item.id == data.trip.id
        );
        if (
          !isNullOrUndefined(foundTripIndex) &&
          foundTripIndex != -1 &&
          !isNullOrUndefined(prevAllTrips)
        ) {
          prevAllTrips.trips[foundTripIndex].favoritedBy = data.trip.favoritedBy;
          queryClient.setQueryData(['trips', 'all'], () => prevAllTrips);
        }
      }
    },
  });
};

export const useMutationUpdateTrip = (tripId: any) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { user } = useStore((state: any) => state);
  return useMutation(({ tripId, tripPayload }: any) => apiUpdateTrip({ tripId, tripPayload }), {
    onSuccess: async () => {
      const prevOneTrip: ITrip | undefined = await queryClient.getQueryData(['trips', 'one']);
      if (!isNullOrUndefined(prevOneTrip)) {
        await queryClient.invalidateQueries(['trips', 'one']);
      }

      if (!isNullOrUndefined(user)) {
        customNavigation(user?.role, navigate, `/trips/${tripId}`);
      }
    },
    onError: async (err: any) => {
      showNotification({
        title: 'Error update',
        message: err.response?.data?.message,
        color: 'red',
      });
    },
  });
};

export const useMutationDeleteTrip = () => {
  const queryClient = useQueryClient();
  const { user } = useStore((state: any) => state);
  const navigate = useNavigate();
  return useMutation((id: number | string | undefined) => apiDeleteTrip({ id: id }), {
    onSuccess: async () => {
      if (!isNullOrUndefined(user) && user.role == ROLE.ADMIN) {
        await queryClient.invalidateQueries(['admin_trips']);
      } else if (!isNullOrUndefined(user) && user.role != ROLE.ADMIN) {
        navigate('/trips');
      }

      showNotification({
        title: 'Successful DELETE',
        message: null,
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

export const useMutateSwitchTripHiddenStatus = () => {
  return useMutation((tripId: number | string) => apiSwitchTripHiddenStatus(tripId), {
    onSuccess: async (data: any) => {
      showNotification({
        title: data?.isHidden == false ? 'Trip is hidden!' : 'Trip is public!',
        message: undefined,
      });
    },
  });
};
