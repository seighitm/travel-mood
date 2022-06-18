import { $host } from '../api';

export const apiGetCountries = async () => {
  const { data } = await $host.get('info/countries');
  return data;
};

export const getLanguages = async () => {
  const { data } = await $host.get('info/languages');
  return data;
};
export const apiGetTransports = async () => {
  const { data } = await $host.get('info/transports');
  return data;
};
