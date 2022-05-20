import {$authHost, $host} from "../api";

export const getAllArticle =
  async ({page, tags, author, countries, title}: {
    page?: number | string;
    tags?: string[];
    author?: string;
    countries?: string[];
    title?: string;
  }) => {
    const res = await $authHost.get('articles', {params: {page, tags, author, countries, title}});
    return res.data;
  };

export const deleteArticle =
  async ({id}: { id: string }) => {
    const res = await $authHost.delete('/article/' + id);
    return res.data;
  };

export const favoriteArticle =
  async ({id}: { id: string | number }) => {
    const res = await $authHost.post(`article/${id}/favorite`);
    return res.data;
  };

export const unFavoriteArticle =
  async ({id}: { id: string | number }) => {
    const res = await $authHost.delete(`article/${id}/favorite`);
    return res.data;
  };

export const getOneArticle =
  async ({id}: { id: string | number | undefined }) => {
    const res = await $authHost.get('/article/' + id);
    return res.data;
  };

export const addCommentToArticle =
  async ({id, comment}: { id: string | number; comment: string; }) => {
    const res = await $authHost.post(`article/${id}/comment`, {comment: comment});
    return res.data;
  };

export const removeCommentFromArticle =
  async ({commentId}: { commentId: string | number }) => {
    const res = await $authHost.delete(`article/comment/${commentId}`);
    return res.data;
  };

export const createArticle =
  async ({articlePayload}: any) => {
    const res = await $authHost.post('article', articlePayload);
    return res.data;
  };

export const updateArticle =
  async ({id, articlePayload,}: { id: string | number | undefined; articlePayload: any; }) => {
    const res = await $authHost.put('/article/' + id, articlePayload);
    return res.data;
  };


export const getArticlesFiltering = async (
  page: any,
  limit: any,
  search: any,
  sortBy: any,
  order: any,
) => {
  const {data} = await $authHost.get('/admin/articles',{
    params: {
      page,
      limit,
      ...(search ? { search } : {}),
      ...(sortBy ? { sortBy } : {}),
      ...(order ? { order } : {}),
    },
  } );
  return data;
};
