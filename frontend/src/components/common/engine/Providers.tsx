import {ColorScheme, ColorSchemeProvider, MantineProvider} from '@mantine/core';
import {NotificationsProvider, showNotification} from '@mantine/notifications';
import {useHotkeys, useLocalStorageValue} from '@mantine/hooks';
// import HelmetMetaData from '../../trip/TripPage/SocialShare/HelmetMetaData';
import React from 'react';
import {ReactQueryDevtools} from 'react-query/devtools';
import {QueryCache, QueryClient, QueryClientProvider} from 'react-query';
// import HelmetMetaData from "../SocialShare/HelmetMetaData";

const queryClient = new QueryClient({
  // defaultOptions: {
  //   queries: {
  //     cacheTime: Infinity,
  //     refetchOnWindowFocus: false,
  //     keepPreviousData: true,
  //   },
  // },
  queryCache: new QueryCache({
    onError: (err: any) => {
      console.log(err)
    },
  }),
  defaultOptions: {
    queries: {
      retry: 0,
      refetchOnWindowFocus: false,
      onError: (err: any) => {
        showNotification({
          title: 'Error',
          message: err.response?.data?.message,
          color: 'red',
        });
      },
    },
    mutations: {
      retry: 0,
      onError: (err: any) => {
        showNotification({
          title: 'Error',
          message: err.response?.data?.message,
          color: 'red',
        });
      },
    }
  }
});

export default function Providers({children}: any) {
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
        theme={{colorScheme}}
        styles={{
          Indicator: () => ({
            indicator: {
              zIndex: 5
            }
          }),
          // @ts-ignore
          LoadingOverlay: () => ({
            root: {
              zIndex: '5!important'
            }
          }),
          // @ts-ignore
          Skeleton: () => ({
            root: {
              zIndex: '5!important'
            }
          }),
        }}
      >
        <NotificationsProvider>
          <QueryClientProvider client={queryClient}>
            {/*<HelmetMetaData/>*/}
            {children}
            <ReactQueryDevtools initialIsOpen={false}/>
          </QueryClientProvider>
        </NotificationsProvider>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}
