import { useQuery } from 'react-query';
import { apiGetAllMarkers, apiGetTripsByMarkerId } from './axios';

export const useGetAllMarkers = () => useQuery(['markers', 'all'], () => apiGetAllMarkers());

export const useGetTripsByMarkerId = (markerId: any) =>
  useQuery(['trips', 'by-marker-id', markerId], () => apiGetTripsByMarkerId(markerId), {
    enabled: false,
  });
