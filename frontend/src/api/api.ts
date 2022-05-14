import axios from 'axios';
import {useNavigate} from "react-router-dom";

const $host = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}api/`,
});

const $authHost = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}api/`,
});

const authInterceptor = (config: any) => {
  config.headers.authorization = `Bearer ${localStorage.getItem('accessToken')}`;

  return config;
};

$authHost.interceptors.request.use(authInterceptor);

$authHost.interceptors.response.use(
  (config: any) => {
    return config;
  },
  async (error: any) => {
    const originalRequest = error.config;
    // const navigate = useNavigate()
    if (error.response.status == 401 && error.config && !error.config._isRetry) {
      originalRequest._isRetry = true;
      // if (window.location.href.split('/').reverse()[0] != 'login')
      try {
        const localRefreshToken = localStorage.getItem('refreshToken');
        const response = await $host.post<any>(`${import.meta.env.VITE_API_URL}api/refresh`, {
          localRefreshToken: localRefreshToken,
        });
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        return $authHost.request(originalRequest);
      } catch (e) {
        // window.location.assign('auth/login');
        // navigate('auth/login')
        console.log('No authorized');
      }
    }
    throw error;
  }
);

export {$host, $authHost};
