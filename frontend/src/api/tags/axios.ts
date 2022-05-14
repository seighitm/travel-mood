import {$authHost} from "../api";

export const getTags = async ({name}: any) => {
  const {data} = await $authHost.get('/tags', {
    params: {...(name ? {name: name} : {})}
  });
  return data;
};

export const deleteTag = async ({tags}: any) => {
  const {data} = await $authHost.delete('/tags', {data: tags});
  return data;
};
