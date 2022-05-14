import React from 'react';
import {ActionIcon, Box, Group, MediaQuery, Navbar, ScrollArea} from "@mantine/core";
import {MainLinks} from "./_mainLinks";
import {User} from "./_user";
import {useMediaQuery} from "@mantine/hooks";

function CustomNavbarAdmin() {
  const matches = useMediaQuery('(min-width: 985px)');

  return (
    <MediaQuery smallerThan="sm" styles={{display: 'none'}}>
      <Navbar p="xs" width={{
        sm: !matches ? 70 : 230,
        lg: 240,
        xl: 240,
        base: 0,
      }}>
        <Navbar.Section grow component={ScrollArea} mx="-xs" px="xs">
          <Box py="md">
            <MainLinks matches={matches}/>
          </Box>
        </Navbar.Section>
        <Navbar.Section>
          <User matches={matches}/>
        </Navbar.Section>
      </Navbar>
    </MediaQuery>
  );
}

export default CustomNavbarAdmin;
