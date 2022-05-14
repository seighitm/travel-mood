import useStore from "../../store/user.store";
import {useNavigate} from "react-router-dom";
import {useMutation} from "react-query";
import {showNotification} from "@mantine/notifications";
import {apiForgotPassword, apiLogout, apiResetPassword, apiSignIn, apiSignUp} from "./axios";
import {ROLE} from "../../types/enums";

export const useMutateSignIn = () => {
  const navigate = useNavigate();
  const {setUser} = useStore((state: any) => state);

  return useMutation((payload: any) => apiSignIn(payload), {
    onSuccess: async (data: any) => {
      setUser(data);
      if (data?.role == ROLE.USER) navigate('/');
      else if (data?.role == ROLE.ADMIN) navigate('/admin');
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
        title: 'Successful registration !',
        message: '',
        color: 'blue'
      });
      // navigate('/auth/login');
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
  const {setUser} = useStore((state: any) => state);

  return useMutation(() => apiLogout(), {
    onSuccess: async () => {
      setUser(null);
      showNotification({
        title: 'Default notification',
        message: 'Hey there, your code is awesome! 🤥',
      });
      navigate('/auth/login');
    },
    onError: async (err: any) => {
      showNotification({
        title: 'Default notification',
        message: err.response?.data?.message,
        color: 'red',
      });
    },
  });
};

export const useMutateForgotPassword = (onSuccessEvent: any) => {
  return useMutation(async (email: string) => await apiForgotPassword(email),
    {
      onSuccess: async (data: any) => {
        onSuccessEvent()
        showNotification({
          title: 'Successful!',
          message: `An email has been sent to ${data.email} with further instructions.`,
          color: 'blue'
        });
      },
      onError: async (err: any) => {
        showNotification({
          title: 'Warning!',
          message: err.response?.data?.message,
          color: 'red'
        });
      }
    },
  );
};

export const useMutateResetPassword = () => {
  const navigate = useNavigate();
  return useMutation(async ({password, resetToken}: any) => await apiResetPassword({password, resetToken}),
    {
      onSuccess: async (data: any) => {
        showNotification({
          title: 'Password successfully reset!',
          message: '',
          color: 'blue'
        });
        navigate('/auth/login')
      },
      onError: async (err: any) => {
        showNotification({
          title: 'Default notification',
          message: err.response?.data?.message,
          color: 'red'
        });
      }
    },
  );
};
