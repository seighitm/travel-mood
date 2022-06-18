import { useQuery, useQueryClient } from 'react-query';
import { apiGetCountries, apiGetTransports, getLanguages } from './axios';

export const useGetCountries = ({ isEnabled = true }: { isEnabled?: boolean }) => {
  return useQuery(['countries'], () => apiGetCountries(), {
    enabled: isEnabled,
  });
};

export const useGetLanguages = ({ isEnabled = true }: { isEnabled?: boolean }) => {
  const queryClient = useQueryClient();
  return useQuery(['languages'], () => getLanguages(), {
    enabled: isEnabled,
    select: (data: any) => data.sort((a: any, b: any) => b.id - a.id),
    initialData: () => queryClient.getQueryData(['languages']),
  });
};
export const useGetTransports = ({ isEnabled = true }: { isEnabled?: boolean }) =>
  useQuery(['transports'], () => apiGetTransports(), {
    enabled: isEnabled,
  });
