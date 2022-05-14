import {useQuery} from "react-query";
import {getAllMarkers, getTripsByMarkerId} from "./axios";

export const useGetAllMarkers = () => useQuery(['markers', 'all'], () => getAllMarkers());

export const useGetTripsByMarkerId = (markerId: any) =>
  useQuery(['trips', 'by-marker-id', markerId], () => getTripsByMarkerId(markerId), {
    enabled: false,
  });
