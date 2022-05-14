import {useQuery} from "react-query";
import {getLocations} from "./axios";

export const useGetLocations = ({isEnabled = true}: { isEnabled?: boolean }) => {
  return useQuery(['countries'], () => getLocations(), {
    enabled: isEnabled,
  });
}

