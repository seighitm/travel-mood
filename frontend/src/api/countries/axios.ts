import {$authHost, $host} from "../api";

export const removeCountries = async ({countries}: any) => {
  const {data} = await $authHost.delete('info/countries', {data: {countries: countries}});
  return data;
};

export const addCountries = async ({countries}: any) => {
  const {data} = await $authHost.post('info/countries', {...countries});
  return data;
};

export const getLocations = async () => {
  const {data} = await $host.get('info/countries');
  return data;
};

export const fetchCountriesJsonData = async (setGeoDate: any) => {
  return await fetch(`${import.meta.env.VITE_API_URL}api/countries-data`)
    .then((response) => response.json())
    .then((data) => {
      console.log(data)
      setGeoDate(data)
    });
};


