import {useMutation, useQueryClient} from 'react-query';
import {showNotification} from '@mantine/notifications';
import {useNavigate} from 'react-router-dom';
import {
  addCommentToArticle,
  createArticle,
  deleteArticle,
  favoriteArticle,
  removeCommentFromArticle,
  unFavoriteArticle,
  updateArticle
} from "./axios";

//##############################################################################
//##############################################################################
export const useMutationDeleteArticle =
  ({articlesCount, setActivePage, page, onSuccessEvent}: {
    articlesCount?: number;
    setActivePage?: any;
    page?: string | number;
    onSuccessEvent?: any
  }) => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    return useMutation((id: any) => deleteArticle({id: id}), {
      onSuccess: async (data: any) => {
        if (window.location.href.split('/').reverse()[1] == 'articles') {
          await queryClient.invalidateQueries(['articles', 'all']);
          navigate(-1)
        } else if(window.location.href.split('/').reverse()[1] == 'admin') {
          await queryClient.invalidateQueries(['filteringArticlesAdmin']);
        }

        if (page && setActivePage) {
          if (articlesCount == 1) {
            setActivePage((prev: any) => prev - 1);
          }
          const prevAllArticles: any = queryClient.getQueryData(['articles', 'all', page]);
          if (prevAllArticles) {
            await queryClient.cancelQueries(['articles', 'all', page]);
            const array = prevAllArticles?.articles?.filter((item: any) => item.id != data.id);
            prevAllArticles.articles = [...array];
            queryClient.setQueryData(['articles', 'all', page], () => prevAllArticles);
          }
        }

        const prev: any = queryClient.getQueryData(['users', 'one']);
        if (prev) {
          await queryClient.cancelQueries(['users', 'one']);
          const array = prev?.articles.filter((item: any) => item.id != data.id);
          prev.articles = [...array];
          queryClient.setQueryData(['users', 'one'], () => prev);
        }

        if (onSuccessEvent)
          onSuccessEvent()

        showNotification({
          title: 'Successful DELETE',
          message: 'Successful',
        });
      },
        onError: async (err: any) => {
          showNotification({
            title: 'Error DELETE',
            color: 'red',
            message: err.response?.data?.message,
          });
        },
      });
  }
    ;


//##############################################################################
//##############################################################################
    export const useMutationFavoriteArticle =
      ({page}: { page?: string | number }) => {
        const queryClient = useQueryClient();
        return useMutation(({id}: { id: string | number }) => favoriteArticle({id: id}),
          {
            onSuccess: async (data: any) => {
              const prevOneArticle: any = queryClient.getQueryData(['articles', 'one']);
              if (prevOneArticle) {
                await queryClient.cancelQueries(['articles', 'one']);
                prevOneArticle.favoritesCount = data.favoritesCount;
                prevOneArticle.favorited = data.favorited;
                prevOneArticle.favoritedBy = data.favoritedBy;
                queryClient.setQueryData(['articles', 'one'], () => prevOneArticle);
              }

              const prevAllArticles: any = queryClient.getQueryData(['articles', 'all', page]);
              if (prevAllArticles) {
                await queryClient.cancelQueries(['articles', 'all', page]);
                const findArticleIndex = prevAllArticles.articles.findIndex(
                  (item: any) => item.id == data.id
                );
                prevAllArticles.articles[findArticleIndex] = {
                  ...prevAllArticles.articles[findArticleIndex],
                  favorited: data.favorited,
                  favoritesCount: data.favoritesCount,
                  favoritedBy: data.favoritedBy
                };
                queryClient.setQueryData(['articles', 'all', page], () => prevAllArticles);
              }
            }
          }
        );
      };

//##############################################################################
//##############################################################################
    export const useMutationUnFavoriteArticle =
      ({page}: { page?: string | number }) => {
        const queryClient = useQueryClient();
        return useMutation(({id}: { id: string | number }) => unFavoriteArticle({id: id}),
          {
            onSettled: async (data: any) => {
              const prevOneArticle: any = queryClient.getQueryData(['articles', 'one']);
              if (prevOneArticle) {
                await queryClient.cancelQueries(['articles', 'one']);
                prevOneArticle.favoritesCount = data.favoritesCount;
                prevOneArticle.favorited = data.favorited;
                prevOneArticle.favoritedBy = data.favoritedBy;
                queryClient.setQueryData(['articles', 'one'], () => prevOneArticle);
              }

              const prevAllArticles: any = queryClient.getQueryData(['articles', 'all', page]);
              if (prevAllArticles) {
                await queryClient.cancelQueries(['articles', 'all', page]);
                const findArticleIndex = prevAllArticles.articles.findIndex(
                  (item: any) => item.id == data.id
                );
                prevAllArticles.articles[findArticleIndex] = {
                  ...prevAllArticles.articles[findArticleIndex],
                  favorited: data.favorited,
                  favoritesCount: data.favoritesCount,
                  favoritedBy: data.favoritedBy
                };
                queryClient.setQueryData(['articles', 'all', page], () => prevAllArticles);
              }

              const prevAllFavorites: any = queryClient.getQueryData(['favorites', 'all', 'articles']);
              if (prevAllFavorites) {
                await queryClient.invalidateQueries(['favorites', 'all', 'articles']);
              }
            },
          }
        );
      };

//##############################################################################
//##############################################################################
    export const useMutationAddCommentToArticle = () => {
      const queryClient = useQueryClient();
      return useMutation(({id, comment}: any) => addCommentToArticle({id, comment: comment}),
        {
          onSuccess: async (data) => {
            await queryClient.cancelQueries(['articles', 'one']);
            const prev: any = queryClient.getQueryData(['articles', 'one']);
            prev.comments.unshift({...data, author: {...data.author},});
            queryClient.setQueryData(['articles', 'one'], () => prev);
          },
        }
      );
    };

//##############################################################################
//##############################################################################
    export const useMutationRemoveCommentFromArticle = () => {
      const queryClient = useQueryClient();
      return useMutation(({commentId}: { commentId: number | string }) => removeCommentFromArticle({commentId}),
        {
          onSuccess: async (data) => {
            await queryClient.cancelQueries(['articles', 'one']);
            const prev: any = queryClient.getQueryData(['articles', 'one']);
            console.log(data)
            console.log(prev)
            const newComments = prev.comments.filter((item: any) => item.id != data.id);
            prev.comments = [...newComments];
            queryClient.setQueryData(['articles', 'one'], () => prev);
          }
        }
      );
    };

//##############################################################################
//##############################################################################
    export const useAddArticle = ({onSuccessEvent}: any) => {
      const queryClient = useQueryClient();
      return useMutation((articlePayload: any) => createArticle({articlePayload: articlePayload}),
        {
          onSuccess: async (data: any) => {
            await onSuccessEvent()
            await queryClient.invalidateQueries(['articles', 'all'])
            showNotification({
              title: 'Successful',
              message: 'Article successful saved!',
              color: 'blue',
            });
            // navigate('/articles');
          },
          onError: async (err: any) => {
            showNotification({
              title: 'Error',
              message: err.response?.data?.message,
              color: 'red',
            });
          },
        }
      );
    };

//##############################################################################
//##############################################################################
    export const useMutationUpdateArticle = ({
                                               id,
                                               onSuccessEvent
                                             }: { id: string | number | undefined, onSuccessEvent: any }) => {
      const navigate = useNavigate();
      const queryClient = useQueryClient();
      return useMutation((articlePayload: any) => updateArticle({id, articlePayload}),
        {
          onSuccess: async (data) => {
            await onSuccessEvent()
            showNotification({
              title: 'Article successful updated!!',
              message: undefined,
              color: 'blue',
            });
            await queryClient.invalidateQueries(['articles', 'one']);
            // navigate('/articles/' + data.id);
          },
          onError: async (err: any) => {
            showNotification({
              title: 'Warning!',
              message: err.response?.data?.message,
              color: 'red',
            });
          }
        }
      );
    };
