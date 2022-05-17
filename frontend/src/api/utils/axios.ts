import {$authHost, $host} from "../api";

export const getTransports = async () => {
  const res = await $host.get('info/transports');
  return res.data;
};

export const removeFiles = async (files: any) => {
  const {data} = await $authHost.delete('files/remove', {data: {files: files}});
  return data;
}

