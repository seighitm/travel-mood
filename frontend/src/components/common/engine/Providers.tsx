import {ColorScheme, ColorSchemeProvider, MantineProvider} from '@mantine/core';
import {NotificationsProvider} from '@mantine/notifications';
import {useHotkeys, useLocalStorageValue} from '@mantine/hooks';
// import HelmetMetaData from '../../trip/TripPage/SocialShare/HelmetMetaData';
import React from 'react';
import {ReactQueryDevtools} from 'react-query/devtools';
import {QueryCache, QueryClient, QueryClientProvider} from 'react-query';

const queryClient = new QueryClient({
  // defaultOptions: {
  //   queries: {
  //     cacheTime: Infinity,
  //     refetchOnWindowFocus: false,
  //     keepPreviousData: true,
  //   },
  // },
  queryCache: new QueryCache({
    onError: (error: any) => {
      console.log(error)
    },
  }),
  defaultOptions: {
    queries: {
      retry: 0,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
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
