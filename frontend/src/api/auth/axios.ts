import {$authHost, $host} from "../api";
import useStore from "../../store/user.store";

export const apiSignIn = async (payload: any) => {
  const {data} = await $host.post('auth/login', {user: payload});
  return data;
};

export const apiSignUp = async (payload: any) => {
  const {data} = await $host.post('auth/register', payload);
  return data;
};

export const apiLogout = async () => {
  useStore.setState({user: null});
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  const {data} = await $host.get('auth/logout');
  return data;
};

export const apiForgotPassword = async (email: string) => {
  const {data} = await $host.post(`auth/forgot-password`, {email: email});
  return data;
};

export const apiResetPassword = async ({password, resetToken}: any) => {
  const {data} = await $host.post(`auth/reset-password`, {password: password, resetToken: resetToken});
  return data;
};

export const apiUserMe = async () => {
  const {data} = await $authHost.get('auth/me');
  return data;
};
