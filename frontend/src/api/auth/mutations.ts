import useStore from '../../store/user.store';
import { useNavigate } from 'react-router-dom';
import { useMutation } from 'react-query';
import { showNotification } from '@mantine/notifications';
import { apiForgotPassword, apiLogout, apiResetPassword, apiSignIn, apiSignUp } from './axios';
import { IUser } from '../../types/IUser';
import { customNavigation } from '../../utils/utils-func';
import { ROLE } from '../../types/enums';

export const useMutateSignIn = () => {
  const navigate = useNavigate();
  const { setUser } = useStore((state: any) => state);
  return useMutation((payload: IUser) => apiSignIn(payload), {
    onSuccess: async (data: any) => {
      setUser(data);
      showNotification({
        title: 'Welcome!',
        message: undefined,
      });
      if (data.role == ROLE.ADMIN) navigate('/admin/users');
      else navigate('/');
    },
    onError: async (err: any) => {
      showNotification({
        title: 'Error!',
        message: err.response?.data?.message,
        color: 'red',
      });
    },
  });
};

export const useMutateSignUp = () => {
  const navigate = useNavigate();
  return useMutation((payload: any) => apiSignUp(payload), {
    onSuccess: async () => {
      showNotification({
        title: 'Successful registration!',
        message: '',
      });
      navigate('/auth/login');
    },
    onError: async (err: any) => {
      showNotification({
        title: 'Error!',
        message: err.response?.data?.message,
        color: 'red',
      });
    },
  });
};

export const useMutateLogout = () => {
  const navigate = useNavigate();
  return useMutation(() => apiLogout(), {
    onSuccess: async () => {
      navigate('/auth/login');
    },
    onError: async (err: any) => {
      showNotification({
        title: 'Error!',
        message: err.response?.data?.message,
        color: 'red',
      });
    },
  });
};

export const useMutateForgotPassword = (onSuccessEvent: () => void) => {
  return useMutation(async (email: string) => await apiForgotPassword(email), {
    onSuccess: async (data: any) => {
      onSuccessEvent();
      showNotification({
        title: 'Successful!',
        message: `An email has been sent to ${data.email} with further instructions.`,
        color: 'blue',
      });
    },
    onError: async (err: any) => {
      showNotification({
        title: 'Error!',
        message: err.response?.data?.message,
        color: 'red',
      });
    },
  });
};

export const useMutateResetPassword = () => {
  const navigate = useNavigate();
  return useMutation(
    async ({ password, resetToken }: { password: string; resetToken: string | undefined }) =>
      await apiResetPassword({ password, resetToken }),
    {
      onSuccess: async (data: any) => {
        showNotification({
          title: 'Password successfully reset!',
          message: '',
          color: 'blue',
        });
        navigate('/auth/login');
      },
      onError: async (err: any) => {
        showNotification({
          title: 'Error!',
          message: err.response?.data?.message,
          color: 'red',
        });
      },
    }
  );
};
