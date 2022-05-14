import {$authHost, $host} from "../api";

export const removeLanguages = async ({languages}: any) => {
  const {data} = await $authHost.delete('info/languages', {data: {languages: languages}});
  return data;
};

export const addLanguages = async ({languages}: any) => {
  const {data} = await $authHost.post('info/languages', {languages: languages});
  return data;
};

export const getLanguages = async () => {
  const {data} = await $host.get('info/languages');
  return data;
};

export const fetchLanguagesJsonData = async (setGeoDate: any) => {
  return await fetch(`${import.meta.env.VITE_API_URL}api/languages-data`)
    .then((response) => response.json())
    .then((data) => setGeoDate(data));
};



