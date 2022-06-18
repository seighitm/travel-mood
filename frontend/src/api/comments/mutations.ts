import { useMutation, useQueryClient } from 'react-query';
import { addComment, editComment, removeComment } from './axios';
import { useLocation } from 'react-router-dom';
import { showNotification } from '@mantine/notifications';
import { ITrip } from '../../types/ITrip';
import { IArticle } from '../../types/IArticle';

export const useMutateAddComment = () => {
  const queryClient = useQueryClient();
  const location = useLocation();

  return useMutation(({ id, comment, postType }: any) => addComment({ id, comment, postType }), {
    onSuccess: async (data: any) => {
      if (location?.pathname.includes('trips')) {
        const prevOneTrip: ITrip | undefined = queryClient.getQueryData(['trips', 'one']);
        if (prevOneTrip) {
          await queryClient.cancelQueries(['trips', 'one']);
          prevOneTrip.comments.unshift({ ...data });
          queryClient.setQueryData(['trips', 'one'], () => prevOneTrip);
        }
      } else if (location?.pathname.includes('articles')) {
        const prevOneArticle: IArticle | undefined = queryClient.getQueryData(['articles', 'one']);
        if (prevOneArticle) {
          await queryClient.cancelQueries(['articles', 'one']);
          prevOneArticle.comments.unshift({ ...data, author: { ...data.author } });
          queryClient.setQueryData(['articles', 'one'], () => prevOneArticle);
        }
      }

      showNotification({
        title: 'Comment has been added!',
        message: undefined,
      });
    },
  });
};

export const useMutationEditComment = (onSuccessEvent: () => void) => {
  const queryClient = useQueryClient();
  const location = useLocation();

  return useMutation(
    ({ id, comment }: { id: string | number; comment: string }) =>
      editComment({
        id,
        comment: comment,
      }),
    {
      onSuccess: async (data: any) => {
        if (onSuccessEvent) {
          onSuccessEvent();
        }

        if (location?.pathname.includes('articles')) {
          const prevOneArticle: IArticle | undefined = queryClient.getQueryData([
            'articles',
            'one',
          ]);
          if (prevOneArticle) {
            await queryClient.cancelQueries(['articles', 'one']);
            let foundIndex = prevOneArticle?.comments.findIndex(
              (comment: any) => comment.id == data.id
            );
            prevOneArticle.comments[foundIndex] = {
              ...prevOneArticle.comments[foundIndex],
              ...data,
            };
            queryClient.setQueryData(['articles', 'one'], () => prevOneArticle);
          }
        } else if (location?.pathname.includes('trips')) {
          const prevOneArticle: ITrip | undefined = queryClient.getQueryData(['trips', 'one']);
          if (prevOneArticle) {
            await queryClient.cancelQueries(['trips', 'one']);
            let foundIndex = prevOneArticle?.comments.findIndex(
              (comment: any) => comment.id == data.id
            );
            prevOneArticle.comments[foundIndex] = {
              ...prevOneArticle.comments[foundIndex],
              ...data,
            };
            queryClient.setQueryData(['trips', 'one'], () => prevOneArticle);
          }
        }

        showNotification({
          title: 'Comment has been updated!',
          message: undefined,
        });
      },
    }
  );
};

export const useMutationRemoveComment = () => {
  const queryClient = useQueryClient();
  const location = useLocation();
  return useMutation(
    ({ commentId, postType }: { commentId: number | string; postType: string }) =>
      removeComment({ commentId, postType }),
    {
      onSuccess: async (data: any) => {
        if (location?.pathname.includes('articles')) {
          const prevOneArticle: IArticle | undefined = queryClient.getQueryData([
            'articles',
            'one',
          ]);
          if (prevOneArticle) {
            await queryClient.cancelQueries(['articles', 'one']);
            const newComments = prevOneArticle.comments.filter((item: any) => item.id != data?.id);
            prevOneArticle.comments = [...newComments];
            queryClient.setQueryData(['articles', 'one'], () => prevOneArticle);
          }
        } else if (location?.pathname.includes('trips')) {
          const prevOneTrip: ITrip | undefined = queryClient.getQueryData(['trips', 'one']);
          if (prevOneTrip) {
            await queryClient.cancelQueries(['trips', 'one']);
            prevOneTrip.comments = [
              ...prevOneTrip.comments.filter((item: any) => item.id != data.id),
            ];
            queryClient.setQueryData(['trips', 'one'], () => prevOneTrip);
          }
        }

        showNotification({
          title: 'Comment has been deleted!',
          message: undefined,
        });
      },
    }
  );
};
