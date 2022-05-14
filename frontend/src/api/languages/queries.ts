import {useQuery, useQueryClient} from "react-query";
import {getLanguages} from "./axios";

export const useGetLanguages = ({isEnabled = true}: { isEnabled?: boolean }) => {
  const queryClient = useQueryClient();
  return useQuery(['languages'], () => getLanguages(), {
    enabled: isEnabled,
    select: (data: any) => data.sort((a: any, b: any) => b.id - a.id),
    initialData: () => queryClient.getQueryData(['languages']),
  })
};
