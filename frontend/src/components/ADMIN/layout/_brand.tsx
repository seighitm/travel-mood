import React from 'react';
import { Group, ActionIcon, useMantineColorScheme, Box } from '@mantine/core';
import { Sun, MoonStars } from '../../../assets/Icons';
import { Logo } from './_logo';

export function Brand() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  return (
    <Group
      sx={(theme) => ({
        width: '100%',
        paddingLeft: theme.spacing.xs,
        // paddingRight: theme.spacing.xs,
        // paddingBottom: theme.spacing.lg,
        // borderBottom: `1px solid ${
        //   theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]
        // }`,
      })}
    >
      <Group position="apart" style={{width: '100%'}}>
        <Logo colorScheme={colorScheme} />
        <ActionIcon variant="default" onClick={() => toggleColorScheme()} size={30}>
          {colorScheme === 'dark' ? <Sun size={16} /> : <MoonStars size={16} />}
        </ActionIcon>
      </Group>
    </Group>
  );
}
