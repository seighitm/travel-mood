import { useQuery } from 'react-query';
import {
  apiGetAllComplaints,
  getArticlesForAdmin,
  getTripsForAdmin,
  getUsersWithAdminRole,
} from './axios';
import { useAsyncDebounce } from 'react-table';

export const useGetAllComplaints = (status: string) =>
  useQuery(['complaints', status], () => apiGetAllComplaints(status));

export const useGetUsersWithAdminRole = (
  queryPageIndex: any,
  queryPageSize: any,
  queryPageFilter: any,
  queryPageSortBy: any,
  queryPageOrder: any
) => {
  const debouncedFetchPaginatedUsers: any = useAsyncDebounce(getUsersWithAdminRole, 300);

  return useQuery(
    [
      'admin_users',
      queryPageIndex,
      queryPageSize,
      queryPageFilter != undefined ? queryPageFilter?.toLowerCase() : queryPageFilter,
      queryPageSortBy,
      queryPageOrder,
    ],
    () =>
      debouncedFetchPaginatedUsers(
        queryPageIndex,
        queryPageSize,
        queryPageFilter != undefined ? queryPageFilter?.toLowerCase() : queryPageFilter,
        queryPageSortBy,
        queryPageOrder
      ),
    {
      keepPreviousData: true,
      staleTime: Infinity,
      suspense: true,
      cacheTime: 0,
    }
  );
};

export const useGetArticlesForAdmin = (
  queryPageIndex: any,
  queryPageSize: any,
  queryPageFilter: any,
  queryPageSortBy: any,
  queryPageOrder: any
) => {
  const debouncedFetchPaginatedUsers: any = useAsyncDebounce(getArticlesForAdmin, 300);

  return useQuery(
    [
      'filteringArticlesAdmin',
      queryPageIndex,
      queryPageSize,
      queryPageFilter != undefined ? queryPageFilter?.toLowerCase() : queryPageFilter,
      queryPageSortBy,
      queryPageOrder,
    ],
    () =>
      debouncedFetchPaginatedUsers(
        queryPageIndex,
        queryPageSize,
        queryPageFilter != undefined ? queryPageFilter?.toLowerCase() : queryPageFilter,
        queryPageSortBy,
        queryPageOrder
      ),
    {
      keepPreviousData: true,
      staleTime: Infinity,
      suspense: true,
      cacheTime: 0,
    }
  );
};

export const useGetTripsForAdmin = (
  queryPageIndex: any,
  queryPageSize: any,
  queryPageFilter: any,
  queryPageSortBy: any,
  queryPageOrder: any
) => {
  const debouncedFetchPaginatedUsers: any = useAsyncDebounce(getTripsForAdmin, 300);

  return useQuery(
    [
      'admin_trips',
      queryPageIndex,
      queryPageSize,
      queryPageFilter != undefined ? queryPageFilter?.toLowerCase() : queryPageFilter,
      queryPageSortBy,
      queryPageOrder,
    ],
    () =>
      debouncedFetchPaginatedUsers(
        queryPageIndex,
        queryPageSize,
        queryPageFilter != undefined ? queryPageFilter?.toLowerCase() : queryPageFilter,
        queryPageSortBy,
        queryPageOrder
      ),
    {
      keepPreviousData: true,
      staleTime: Infinity,
      suspense: true,
      cacheTime: 0,
    }
  );
};
