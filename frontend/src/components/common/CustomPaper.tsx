import React from 'react';
import { Paper } from '@mantine/core';

function CustomPaper({ children }: any) {
  return (
    <Paper
      pl={'sm'}
      my={'lg'}
      radius={'md'}
      shadow={'xs'}
      sx={(theme) => ({
        border: '2px solid ',
        borderColor: theme.colorScheme === 'dark' ? theme.colors.gray[8] : theme.colors.gray[1],
        position: 'relative',
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
      })}
    >
      {children}
    </Paper>
  );
}

export default CustomPaper;
