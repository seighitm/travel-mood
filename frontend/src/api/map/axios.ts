import {$authHost} from "../api";
import {useQuery} from "react-query";

export const fetchGeoJsonData = async (setGeoDate: any) => {
  return await fetch(`${import.meta.env.VITE_API_URL}api/geo-data`)
    .then((response) => response.json())
    .then((data) => setGeoDate(data));
};

export const addPlace = async ({markerPayload}: any) => {
  const {data} = await $authHost.post('/info/markers', markerPayload);
  return data;
};

export const getAllMarkers = async () => {
  const {data} = await $authHost.get('info/markers');
  return data;
};

export const getTripsByMarkerId = async (markerId: any) => {
  console.log(markerId);
  const res = await $authHost.get('/info/markers/' + markerId);
  return res.data;
};