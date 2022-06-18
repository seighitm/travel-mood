import { ColorScheme, ColorSchemeProvider, MantineProvider } from '@mantine/core';
import { NotificationsProvider, showNotification } from '@mantine/notifications';
import { useHotkeys, useLocalStorageValue } from '@mantine/hooks';
import React from 'react';
import { QueryCache, QueryClient, QueryClientProvider } from 'react-query';
import { apiLogout } from '../../api/auth/axios';
import { ReactQueryDevtools } from 'react-query/devtools';

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: async (err: any) => {
      if (err?.response.data.message == 'User is blocked!') {
        showNotification({
          title: 'Error',
          message: err.response?.data?.message,
          color: 'red',
        });
        await apiLogout();
      }
    },
  }),
  defaultOptions: {
    queries: {
      retry: 0,
      refetchOnWindowFocus: false,
      onError: async (err: any) => {
        if (err?.response.data.message == 'User is blocked!') {
          showNotification({
            title: 'Error',
            message: err.response?.data?.message,
            color: 'red',
          });
          await apiLogout();
        }
      },
    },
    mutations: {
      retry: 0,
    },
  },
});

export default function Providers({ children }: any) {
  const [colorScheme, setColorScheme] = useLocalStorageValue<ColorScheme>({
    key: 'mantine-color-scheme',
    defaultValue: 'light',
  });

  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

  useHotkeys([['ctrl+j', () => toggleColorScheme()]]);

  return (
    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
      <MantineProvider
        theme={{ colorScheme }}
        styles={{
          Indicator: () => ({
            indicator: {
              zIndex: 5,
              padding: '0',
            },
          }),
          // @ts-ignore
          LoadingOverlay: () => ({
            root: {
              zIndex: '5!important',
            },
          }),
          // @ts-ignore
          Skeleton: () => ({
            root: {
              zIndex: '5!important',
            },
          }),
        }}
      >
        <NotificationsProvider>
          <QueryClientProvider client={queryClient}>
            {children}
            {/*<ReactQueryDevtools initialIsOpen={false}/>*/}
          </QueryClientProvider>
        </NotificationsProvider>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}
