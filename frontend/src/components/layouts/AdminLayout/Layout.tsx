import React, { useState } from 'react';
import {
  AppShell,
  Box,
  Container,
  Divider,
  Drawer,
  Group,
  MediaQuery,
  Navbar,
  ScrollArea,
} from '@mantine/core';
import AdminCustomHeader from './AdminCustomHeader';
import AppLogo from '../../common/AppLogo';
import { DrawerLinks, NavbarLinks } from './NavigationLinkItem';
import { Cub, User } from '../../common/Icons';
import { NavbarUserButton } from '../UserLayout/NavbarUserButton';
import { useMediaQuery } from '@mantine/hooks';
import { useNavigate } from 'react-router-dom';
import { LG_ICON_SIZE, MD_ICON_SIZE } from '../../../utils/constants';

const AdminLayout = ({ children }: any) => {
  const [openedDrawer, setOpenedDrawer] = useState(false);
  const matchesMobile = useMediaQuery('(min-width: 475px)');
  const navigate = useNavigate();
  const matches = useMediaQuery('(min-width: 985px)');

  return (
    <AppShell
      fixed
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      navbar={
        <MediaQuery smallerThan="sm" styles={{ display: 'none' }}>
          <Navbar
            p="xs"
            width={{
              sm: !matches ? 70 : 180,
              lg: 180,
              xl: 180,
              base: 0,
            }}
          >
            <Navbar.Section grow component={ScrollArea} mx="-xs" px="xs">
              <Box py="md">
                <NavbarLinks matches={matches} />
              </Box>
            </Navbar.Section>
          </Navbar>
        </MediaQuery>
      }
      header={<AdminCustomHeader openedDrawer={openedDrawer} setOpenedDrawer={setOpenedDrawer} />}
      styles={(theme) => ({
        main: {
          background: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
        },
      })}
    >
      <Drawer
        opened={openedDrawer}
        onClose={() => setOpenedDrawer(false)}
        padding="xl"
        size="xl"
        transitionTimingFunction="ease"
        title={
          <AppLogo
            onClick={() => {
              navigate('/');
              setOpenedDrawer(false);
            }}
          />
        }
      >
        <Navbar p="md" style={{ height: 'calc(100% - 45px)' }}>
          <Navbar.Section grow component={ScrollArea}>
            <Divider
              mb={'xs'}
              labelPosition="left"
              style={{ width: '100%' }}
              label={
                <Group>
                  <Cub size={LG_ICON_SIZE} />
                  Application
                </Group>
              }
            />
            <NavbarLinks setOpenedDrawer={setOpenedDrawer} />
            <Divider
              mt={'sm'}
              mb={'xs'}
              labelPosition="left"
              style={{ width: '100%' }}
              label={
                <Group>
                  <User size={LG_ICON_SIZE} />
                  Profile
                </Group>
              }
            />
            <DrawerLinks openedDrawer={openedDrawer} setOpenedDrawer={setOpenedDrawer} />
          </Navbar.Section>
          <Navbar.Section>
            <NavbarUserButton setOpenedDrawer={setOpenedDrawer} />
          </Navbar.Section>
        </Navbar>
      </Drawer>
      <Container
        size="xl"
        p={!matchesMobile ? 0 : undefined}
        mx={!matchesMobile ? '-8px' : undefined}
        style={
          location?.pathname.includes('auth')
            ? {
                position: 'relative',
                top: '50%',
                transform: 'translateY(-50%)',
              }
            : {}
        }
      >
        {children}
      </Container>
    </AppShell>
  );
};

export default AdminLayout;
