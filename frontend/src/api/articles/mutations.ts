import {useMutation, useQueryClient} from 'react-query';
import {showNotification} from '@mantine/notifications';
import {useLocation, useNavigate, useParams} from 'react-router-dom';
import {createArticle, deleteArticle, favoriteArticle, unFavoriteArticle, updateArticle,} from './axios';
import useStore from '../../store/user.store';
import {isNullOrUndefined} from '../../utils/primitive-checks';
import {customNavigation} from '../../utils/utils-func';
import {IArticle} from '../../types/IArticle';
import {IUser} from '../../types/IUser';

export const useMutationDeleteArticle = ({
                                           articlesCount,
                                           setActivePage,
                                           page,
                                           onSuccessEvent,
                                         }: {
  articlesCount?: number;
  setActivePage?: any;
  page?: string | number;
  onSuccessEvent?: any;
}) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();
  return useMutation((id: any) => deleteArticle({id: id}), {
    onSuccess: async (data: any) => {
      const currentLocation = location.pathname.split('/').reverse()[1];
      if (currentLocation == 'articles') {
        await queryClient.invalidateQueries(['articles', 'all']);
        navigate(-1);
      } else if (currentLocation == 'admin') {
        await queryClient.invalidateQueries(['filteringArticlesAdmin']);
      }

      if (page && setActivePage) {
        if (articlesCount == 1) {
          setActivePage((prev: any) => prev - 1);
        }
        const prevAllArticles: IArticle | undefined = queryClient.getQueryData([
          'articles',
          'all',
          page,
        ]);
        if (prevAllArticles) {
          await queryClient.cancelQueries(['articles', 'all', page]);
          prevAllArticles.articles = prevAllArticles?.articles?.filter(
            (item: any) => item.id != data.id
          );
          queryClient.setQueryData(['articles', 'all', page], () => prevAllArticles);
        }
      }

      if (onSuccessEvent) {
        onSuccessEvent();
      }

      showNotification({
        title: 'Successful DELETE',
        message: 'Successful',
      });
    },
    onError: async (err: any) => {
      showNotification({
        title: 'Error DELETE',
        message: err.response?.data?.message,
        color: 'red',
      });
    },
  });
};

export const useMutationFavoriteArticle = ({page}: { page?: string | number }) => {
  const queryClient = useQueryClient();
  const {id} = useParams();
  return useMutation(({id}: { id: string | number }) => favoriteArticle({id: id}), {
    onSuccess: async (data: any) => {
      const prevOneUser: IUser | undefined = queryClient.getQueryData(['users', 'one', id]);
      if (!isNullOrUndefined(prevOneUser) && !isNullOrUndefined(id)) {
        await queryClient.cancelQueries(['users', 'one', id]);
        const findArticleIndex: number | undefined = prevOneUser.articles?.findIndex(
          (item: any) => item.id == data.id
        );
        if (
          !isNullOrUndefined(prevOneUser?.articles) &&
          !isNullOrUndefined(findArticleIndex) &&
          findArticleIndex != -1
        )
          prevOneUser.articles[findArticleIndex] = {
            ...prevOneUser.articles[findArticleIndex],
            favoritedBy: data.favoritedBy,
          };
        queryClient.setQueryData(['users', 'one', id], () => prevOneUser);
      }

      const prevOneArticle: IArticle | undefined = queryClient.getQueryData(['articles', 'one']);
      if (!isNullOrUndefined(prevOneArticle)) {
        await queryClient.cancelQueries(['articles', 'one']);
        prevOneArticle.favoritesCount = data.favoritesCount;
        prevOneArticle.favorited = data.favorited;
        prevOneArticle.favoritedBy = data.favoritedBy;
        queryClient.setQueryData(['articles', 'one'], () => prevOneArticle);
      }

      const prevAllArticles: IArticle | undefined = queryClient.getQueryData([
        'articles',
        'all',
        page,
      ]);
      if (!isNullOrUndefined(prevAllArticles) && !isNullOrUndefined(prevAllArticles?.articles)) {
        await queryClient.cancelQueries(['articles', 'all', page]);
        const findArticleIndex = prevAllArticles.articles.findIndex(
          (item: any) => item.id == data.id
        );
        prevAllArticles.articles[findArticleIndex] = {
          ...prevAllArticles.articles[findArticleIndex],
          favorited: data.favorited,
          favoritesCount: data.favoritesCount,
          favoritedBy: data.favoritedBy,
        };
        queryClient.setQueryData(['articles', 'all', page], () => prevAllArticles);
      }
    },
  });
};

export const useMutationUnFavoriteArticle = ({page}: { page?: string | number }) => {
  const queryClient = useQueryClient();
  const {id} = useParams();
  return useMutation(({id}: { id: string | number }) => unFavoriteArticle({id: id}), {
    onSettled: async (data: any) => {
      const prevOneUser: IUser | undefined = queryClient.getQueryData(['users', 'one', id]);
      if (
        !isNullOrUndefined(prevOneUser) &&
        !isNullOrUndefined(id) &&
        !isNullOrUndefined(prevOneUser?.articles)
      ) {
        await queryClient.cancelQueries(['users', 'one', id]);
        const findArticleIndex = prevOneUser.articles.findIndex((item: any) => item.id == data.id);
        prevOneUser.articles[findArticleIndex] = {
          ...prevOneUser.articles[findArticleIndex],
          favoritedBy: data.favoritedBy,
        };
        queryClient.setQueryData(['users', 'one', id], () => prevOneUser);
      }

      const prevOneArticle: IArticle | undefined = queryClient.getQueryData(['articles', 'one']);
      if (!isNullOrUndefined(prevOneArticle)) {
        await queryClient.cancelQueries(['articles', 'one']);
        prevOneArticle.favoritesCount = data.favoritesCount;
        prevOneArticle.favorited = data.favorited;
        prevOneArticle.favoritedBy = data.favoritedBy;
        queryClient.setQueryData(['articles', 'one'], () => prevOneArticle);
      }

      const prevAllArticles: IArticle | undefined = queryClient.getQueryData([
        'articles',
        'all',
        page,
      ]);
      if (!isNullOrUndefined(prevAllArticles) && !isNullOrUndefined(prevAllArticles?.articles)) {
        await queryClient.cancelQueries(['articles', 'all', page]);
        const findArticleIndex = prevAllArticles.articles.findIndex(
          (item: any) => item.id == data.id
        );
        prevAllArticles.articles[findArticleIndex] = {
          ...prevAllArticles.articles[findArticleIndex],
          favorited: data.favorited,
          favoritesCount: data.favoritesCount,
          favoritedBy: data.favoritedBy,
        };
        queryClient.setQueryData(['articles', 'all', page], () => prevAllArticles);
      }

      const prevAllFavorites: IUser | undefined = await queryClient.getQueryData([
        'favorites',
        'all',
        'articles',
      ]);
      if (!isNullOrUndefined(prevAllFavorites)) {
        await queryClient.cancelQueries(['favorites', 'all', 'articles']);
        prevAllFavorites.favoritedArticle = prevAllFavorites?.favoritedArticle?.filter(
          (item: any) => item.id != data.id
        );
        queryClient.setQueryData(['favorites', 'all', 'articles'], () => prevAllFavorites);
      }
    },
  });
};

export const useMutationAddArticle = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const {user} = useStore((state: any) => state);
  return useMutation((articlePayload: any) => createArticle({articlePayload: articlePayload}), {
    onSuccess: async () => {
      const prevOneArticle: IArticle[] | undefined = queryClient.getQueryData(['articles', 'all']);
      if (prevOneArticle) {
        await queryClient.invalidateQueries(['articles', 'all']);
      }

      showNotification({
        title: 'Successful',
        message: 'Article successful saved!',
        color: 'blue',
      });
      customNavigation(user?.role, navigate, `/articles`);
    },
    onError: async (err: any) => {
      showNotification({
        title: 'Error',
        message: err.response?.data?.message,
        color: 'red',
      });
    },
  });
};

export const useMutationUpdateArticle = ({id}: {
  id: string | number | undefined;
  onSuccessEvent?: () => void;
}) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const {user} = useStore((state: any) => state);
  return useMutation((articlePayload: any) => updateArticle({id, articlePayload}), {
    onSuccess: async (data) => {
      const prevOneArticle: IArticle | undefined = queryClient.getQueryData(['articles', 'one']);
      if (prevOneArticle) {
        await queryClient.invalidateQueries(['articles', 'one']);
      }

      showNotification({
        title: 'Article successful updated!',
        message: undefined,
        color: 'blue',
      });
      customNavigation(user?.role, navigate, `/articles/${data?.id}`);
    },
    onError: async (err: any) => {
      showNotification({
        title: 'Warning!',
        message: err.response?.data?.message,
        color: 'red',
      });
    },
  });
};
