import {useMutation, useQueryClient} from 'react-query';
import {apiCloseComplaint, apiSwitchUserRole, apiUserAccountActivate, apiUserAccountBlock,} from './axios';
import {showNotification} from '@mantine/notifications';

export const useMutateCloseComplaint = () => {
  const queryClient = useQueryClient();
  return useMutation((complaintId: string | number) => apiCloseComplaint(complaintId), {
    onSuccess: async () => {
      await queryClient.invalidateQueries(['complaints']);
    },
    onError: (err: any) => {
      showNotification({
        title: 'Error!',
        message: err.response?.data?.message,
        color: 'red',
      });
    },
  });
};

export const useUserAccountActivate = () => {
  const queryClient = useQueryClient();
  return useMutation(({userId}: any) => apiUserAccountActivate({userId}), {
    onSettled: async () => {
      await queryClient.invalidateQueries(['admin_users']);
    },
  });
};

export const useUserAccountBlock = (onSuccessEvent?: () => void) => {
  const queryClient = useQueryClient();
  return useMutation(
    ({userId, expiredBlockDate, reason}: any) =>
      apiUserAccountBlock({
        userId,
        expiredBlockDate,
        reason,
      }),
    {
      onSuccess: async () => {
        if (onSuccessEvent) {
          onSuccessEvent();
        }
        await queryClient.invalidateQueries(['admin_users']);
      },
      onError: (err: any) => {
        showNotification({
          title: 'Error',
          message: err.response?.data?.message,
          color: 'red',
        });
      }
    }
  );
};

export const useMutateSwitchUserRole = () => {
  const queryClient = useQueryClient();
  return useMutation(({userId}: any) => apiSwitchUserRole({userId}), {
    onSuccess: async (data: any) => {
      await queryClient.invalidateQueries(['admin_users']);
    },
    onError: (err: any) => {
      showNotification({
        title: 'Error',
        message: err.response?.data?.message,
        color: 'red',
      });
    }
  });
};
