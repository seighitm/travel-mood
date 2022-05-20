import React from 'react';
import {ActionIcon, Group, useMantineColorScheme} from '@mantine/core';
import {MoonIcon, SunIcon} from "@modulz/radix-icons";

function ToggleTheme() {
  const {colorScheme, toggleColorScheme} = useMantineColorScheme();
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
        {colorScheme === 'dark'
          ? <SunIcon style={{width: '20px', height: '20px'}}/>
          : <MoonIcon style={{width: '20px', height: '20px'}}/>}
      </ActionIcon>
    </Group>
  );
}

export default ToggleTheme;
