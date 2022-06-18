import { $authHost } from '../api';

export const apiGetTags = async ({ tagName, showBlocked = false }: any) => {
  const { data } = await $authHost.get('/tags', {
    params: {
      ...(tagName ? { tagName: tagName } : {}),
      ...(showBlocked != undefined ? { showBlocked: showBlocked } : {}),
    },
  });
  return data;
};

export const apiDeleteTag = async ({ tags }: any) => {
  const { data } = await $authHost.delete('/tags', { data: tags });
  return data;
};

export const apiSetTagsStatus = async ({ tagsId, status }: any) => {
  const { data } = await $authHost.put(`/tags/${status}`, { tagsId: tagsId });
  return data;
};
