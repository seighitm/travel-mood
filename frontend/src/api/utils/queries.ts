import {useQuery} from "react-query";
import {getTransports} from "./axios";

export const useGetTransports = ({isEnabled = true}: { isEnabled?: boolean }) =>
  useQuery(['transports'], () => getTransports(), {
    cacheTime: Infinity,
    refetchOnWindowFocus: false,
    enabled: isEnabled,
  });
