import { $authHost } from '../api';

export const apiGetAllMarkers = async () => {
  const { data } = await $authHost.get('info/markers');
  return data;
};

export const apiGetTripsByMarkerId = async (markerId: any) => {
  const { data } = await $authHost.get(`/info/markers/${markerId}`);
  return data;
};

export const apiFetchGeoJsonData = async (setGeoDate: any) => {
  return await fetch(`${import.meta.env.VITE_API_URL}api/geo-data`)
    .then((response) => response.json())
    .then((data) => setGeoDate(data));
};
