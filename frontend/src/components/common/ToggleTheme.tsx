import React from 'react';
import { ActionIcon, Group, useMantineColorScheme } from '@mantine/core';
import { MoonStars, Sun } from './Icons';
import { XL_ICON_SIZE } from '../../utils/constants';

const ToggleTheme = () => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  return (
    <Group position="center">
      <ActionIcon
        radius={'xl'}
        onClick={() => toggleColorScheme()}
        sx={(theme) => ({
          backgroundColor:
            theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
          color: theme.colorScheme === 'dark' ? theme.colors.yellow[4] : theme.colors.blue[6],
        })}
      >
        {colorScheme === 'dark' ? <Sun size={XL_ICON_SIZE} /> : <MoonStars size={XL_ICON_SIZE} />}
      </ActionIcon>
    </Group>
  );
};

export default ToggleTheme;
