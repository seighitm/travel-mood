import useStore from "../../store/user.store";
import {useQuery} from "react-query";
import {
  apiGetAllProfileVisits,
  apiGetUserById,
  filterUsers,
  getFavorites,
  getUsers,
  getUsersWithAdminRole
} from "./axios";
import chatStore from "../../store/chat.store";
import {useAsyncDebounce} from "react-table";
import {getTripsFiltering} from "../trips/axios";

//##################################################################################
//##################################################################################
export const useGetAllProfileVisits = () => {
  const {user} = useStore((state: any) => state);
  return useQuery(['users', 'profile-visits'], () => apiGetAllProfileVisits(), {
    enabled: !!user
  });
}

//##################################################################################
//##################################################################################
export const useGetUserById = ({id, isEnabled = true}: {
  id: number | string | undefined;
  isEnabled: boolean;
}) => {
  return useQuery(['users', 'one'], () => apiGetUserById(id), {
    enabled: isEnabled,
  });
}

//##################################################################################
//##################################################################################
export const useFilterUser = (payload?: any) => {
  const {socket} = chatStore((state: any) => state);
  const {user} = useStore((state: any) => state);
  return useQuery(['users', 'filter'], () => filterUsers(payload), {
    onSuccess: () => {
      if (!!user) socket.emit('get-online-users');
    },
    select: (data: any) => {
      return data.sort((a: any, b: any) => b.id - a.id)
    }
  });
};

export const useGetAllFavorites = (typeOfFavoriteItem: any) =>
  useQuery(['favorites', 'all', typeOfFavoriteItem], () => getFavorites(typeOfFavoriteItem));

export const useGetUsersByNameOrEmail= (searchField: any) =>
  useQuery(['users', 'byEmailOrName', searchField], () => getUsers({searchField}));

export const useGetUsersWithAdminRole = (
  queryPageIndex: any,
  queryPageSize: any,
  queryPageFilter: any,
  queryPageSortBy: any,
  queryPageOrder: any,
) => {
  const debouncedFetchPaginatedUsers: any = useAsyncDebounce(
    getUsersWithAdminRole,
    300,
  );

  return useQuery(
    [
      'userFiltering',
      queryPageIndex,
      queryPageSize,
      queryPageFilter,
      queryPageSortBy,
      queryPageOrder,
    ],
    () =>
      debouncedFetchPaginatedUsers(queryPageIndex, queryPageSize, queryPageFilter, queryPageSortBy, queryPageOrder,),
    {
      keepPreviousData: true,
      staleTime: Infinity,
      suspense: true,
      cacheTime: 0,
    },
  );
}
