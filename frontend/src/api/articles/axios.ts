import {$authHost} from '../api';
import {isEmptyArray, isEmptyString, isNullOrUndefined} from "../../utils/primitive-checks";

export const getAllArticle = async ({
                                      page = 1,
                                      tags,
                                      author,
                                      countries,
                                      title,
                                    }: {
  page: number | string;
  tags?: string[];
  author?: string;
  countries?: string[];
  title?: string;
}) => {
  const {data} = await $authHost.get('/articles', {
    params: {
      page: page <= 0 ? 1 : page,
      ...(
        (!isNullOrUndefined(tags) && !isEmptyArray(tags))
          ? {tags: tags}
          : {}
      ),
      ...(
        (!isNullOrUndefined(author) && !isEmptyString(author))
          ? {author: author}
          : {}
      ),
      ...(
        (!isNullOrUndefined(countries) && !isEmptyArray(countries))
          ? {countries: countries}
          : {}
      ),
      ...(
        (!isNullOrUndefined(author) && !isEmptyString(author))
          ? {title: title}
          : {}
      ),
    },
  });
  return data;
};

export const deleteArticle = async ({id}: { id: string }) => {
  const {data} = await $authHost.delete(`/article/${id}`);
  return data;
};

export const favoriteArticle = async ({id}: { id: string | number }) => {
  const {data} = await $authHost.post(`article/${id}/favorite`);
  return data;
};

export const unFavoriteArticle = async ({id}: { id: string | number }) => {
  const {data} = await $authHost.delete(`article/${id}/favorite`);
  return data;
};

export const getOneArticle = async ({id}: { id: string | number | undefined }) => {
  const {data} = await $authHost.get(`/article/${id}`);
  return data;
};

export const createArticle = async ({articlePayload}: { articlePayload: any }) => {
  const {data} = await $authHost.post('article', articlePayload);
  return data;
};

export const updateArticle = async ({
                                      id,
                                      articlePayload,
                                    }: {
  id: string | number | undefined;
  articlePayload: any;
}) => {
  const {data} = await $authHost.put(`/article/${id}`, articlePayload);
  return data;
};
