import useStore from '../../store/user.store';
import { useQuery } from 'react-query';
import { apiGetAllProfileVisits, apiGetFavorites, apiGetUserById, apiGetUsers } from './axios';
import chatStore from '../../store/chat.store';
import { isNullOrUndefined } from '../../utils/primitive-checks';

export const useGetAllProfileVisits = () => {
  const { user } = useStore((state: any) => state);
  return useQuery(['users', 'profile-visits'], () => apiGetAllProfileVisits(), {
    enabled: !isNullOrUndefined(user),
  });
};

export const useGetUserById = ({
  id,
  isEnabled = true,
  onErrorEvent,
}: {
  id: number | string | undefined;
  isEnabled: boolean;
  onErrorEvent?: any;
}) => {
  return useQuery(['users', 'one', id], () => apiGetUserById(id), {
    enabled: isEnabled,
    onError: async (err: any) => {
      if (err?.response.data.message == 'User not found!' && onErrorEvent) {
        onErrorEvent();
      }
    },
  });
};

export const useGetUsers = (payload?: any) => {
  const { socket } = chatStore((state: any) => state);
  const { user } = useStore((state: any) => state);
  return useQuery(['users', 'filter'], () => apiGetUsers(payload), {
    onSuccess: () => {
      if (!isNullOrUndefined(user)) {
        socket.emit('get-online-users');
      }
    },
    select: (data: any) => {
      return data?.sort((a: any, b: any) => b.id - a.id);
    },
  });
};

export const useGetAllFavorites = (typeOfFavoriteItem: any) =>
  useQuery(['favorites', 'all', typeOfFavoriteItem], () => apiGetFavorites(typeOfFavoriteItem));

export const useGetUsersByNameOrEmail = (name: any) =>
  useQuery(['users', 'byName'], () => apiGetUsers({ name: name }));
