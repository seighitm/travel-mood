import {useQuery} from "react-query";
import {getOneTrip, getTrips, getTripsFiltering, getUserTrips} from "./axios";
import useStore from "../../store/user.store";
import {useAsyncDebounce} from "react-table";
import {useNavigate} from "react-router-dom";
import {apiLogout} from "../auth/axios";

//############################################################################################
//############################################################################################
export const useOneTripsQuery = ({id, onErrorEvent}: { id: string | number | any } | any) => {
  return useQuery(['trips', 'one'], () => getOneTrip(id), {
    onError: async (err: any) => {
      if (err?.response.data.message == 'Trip not found!') onErrorEvent()
    },
  });
};

//############################################################################################
//############################################################################################
export const useTripsQuery = ({filterFields, page, isEnabled = true}: any) =>
  useQuery(['trips', 'all'], () => getTrips({...filterFields, page}), {
    enabled: isEnabled
  });

//############################################################################################
//############################################################################################
export const useGetUserTrips = (status: any) => {
  const {user} = useStore((state: any) => state);
  return useQuery(['userTrips', status], () => getUserTrips(status), {enabled: !!user});
}


export const useTripsFiltering = (
  queryPageIndex: any,
  queryPageSize: any,
  queryPageFilter: any,
  queryPageSortBy: any,
  queryPageOrder: any,
) => {
  const debouncedFetchPaginatedUsers: any = useAsyncDebounce(
    getTripsFiltering,
    300,
  );

  return useQuery(
    [
      'filtering',
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
