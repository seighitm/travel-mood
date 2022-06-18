import useStore from '../../../store/user.store';
import { useQuery } from 'react-query';
import { apiGetUserTripsRequests } from './fetch';
import { isNullOrUndefined } from '../../../utils/primitive-checks';

export const useGetUserTripsRequests = (status: any) => {
  const { user } = useStore((state: any) => state);
  return useQuery(['userTrips', status], () => apiGetUserTripsRequests(status), {
    enabled: !isNullOrUndefined(user),
  });
};
