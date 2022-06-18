import { useQuery } from 'react-query';
import { apiGetOneTrip, apiGetTrips } from './axios';
import { customNavigation } from '../../utils/utils-func';
import { useNavigate } from 'react-router-dom';
import useStore from '../../store/user.store';

export const useOneTripsQuery = ({ id }: { id: string | number | any } | any) => {
  const navigate = useNavigate();
  const { user } = useStore((state: any) => state);
  return useQuery(['trips', 'one'], () => apiGetOneTrip(id), {
    onError: async (err: any) => {
      if (err?.response.data.message == 'Trip not found!') {
        customNavigation(user?.role, navigate, `/trips`);
      }
    },
  });
};

export const useTripsQuery = ({ filterFields, page, isEnabled = true }: any) =>
  useQuery(['trips', 'all'], () => apiGetTrips({ ...filterFields, page }), {
    enabled: isEnabled,
  });
