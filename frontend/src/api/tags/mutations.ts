import { useMutation, useQueryClient } from 'react-query';
import { showNotification } from '@mantine/notifications';
import { apiDeleteTag, apiSetTagsStatus } from './axios';

export const useDeleteTag = (onSuccessEvent: any) => {
  const queryClient = useQueryClient();
  return useMutation((tags: any) => apiDeleteTag({ tags: tags }), {
    onSuccess: async () => {
      const prevAllCountries = await queryClient.getQueryData(['tags', 'all']);
      if (prevAllCountries) {
        await queryClient.invalidateQueries(['tags', 'all']);
      }

      if (onSuccessEvent) {
        onSuccessEvent();
      }

      showNotification({
        title: 'Tags successful deleted!',
        message: '',
      });
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

export const useSetTagsStatus = (onSuccessEvent?: any) => {
  const queryClient = useQueryClient();
  return useMutation(({ tagsId, status }: any) => apiSetTagsStatus({ tagsId, status }), {
    onSuccess: async () => {
      await queryClient.invalidateQueries(['tags', 'all']);
      if (onSuccessEvent) {
        onSuccessEvent();
      }

      showNotification({
        title: 'Status has been changed!',
        message: '',
      });
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
