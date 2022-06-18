import { $authHost } from '../api';

export const addComment = async ({ id, comment, postType }: any) => {
  const { data } = await $authHost.post(`${postType}/comment/${id}/`, { comment });
  return data;
};

export const editComment = async ({ id, comment }: { id: string | number; comment: string }) => {
  const { data } = await $authHost.put(`comment/${id}/edit`, { comment: comment });
  return data;
};

export const removeComment = async ({ commentId, postType }: any) => {
  const { data } = await $authHost.delete(`${postType}/comment/${commentId}/`);
  return data;
};
