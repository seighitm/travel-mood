import { Group, Loader } from '@mantine/core';
import React from 'react';

export const CustomLoader = () => (
  <Group
    position={'center'}
    sx={(theme) => ({
      background: theme.colorScheme == 'dark' ? theme.colors.dark[7] : theme.colors.light,
    })}
    style={{
      display: 'flex',
      marginLeft: 'auto',
      marginRight: 'auto',
      minWidth: '84px',
      height: '100vh',
      width: '100%',
    }}
  >
    <Loader
      style={{
        display: 'flex',
        marginLeft: 'auto',
        marginRight: 'auto',
        minWidth: '84px',
        height: '100vh',
      }}
    />
  </Group>
);
