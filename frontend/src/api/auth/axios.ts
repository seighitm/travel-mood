import { $authHost, $host } from '../api';
import useStore from '../../store/user.store';
import { IUser } from '../../types/IUser';

export const apiSignIn = async (payload: IUser) => {
  const { data } = await $host.post('auth/login', { user: payload });
  return data;
};

export const apiSignUp = async (payload: IUser) => {
  const { data } = await $host.post('auth/register', payload);
  return data;
};

export const apiLogout = async () => {
  const { data } = await $host.get('auth/logout');
  useStore.setState({ user: null });
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  return data;
};

export const apiForgotPassword = async (email: string) => {
  const { data } = await $host.post(`auth/forgot-password`, { email: email });
  return data;
};

export const apiResetPassword = async ({
  password,
  resetToken,
}: {
  password: string;
  resetToken: string | undefined;
}) => {
  const { data } = await $host.post(`auth/reset-password`, {
    password: password,
    resetToken: resetToken,
  });
  return data;
};

export const apiUserMe = async () => {
  const { data } = await $authHost.get('auth/me');
  return data;
};
