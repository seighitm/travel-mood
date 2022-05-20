import {useQuery} from "react-query";
import {getAllMarkers, getTripsByMarkerId, osmSearch} from "./axios";

export const useGetAllMarkers = () => useQuery(['markers', 'all'], () => getAllMarkers());

export const useGetTripsByMarkerId = (markerId: any) =>
  useQuery(['trips', 'by-marker-id', markerId], () => getTripsByMarkerId(markerId), {
    enabled: false,
  });


export const useGetOsm = () =>
  useQuery(['misa'], (markerId: any) => osmSearch(markerId), {});
