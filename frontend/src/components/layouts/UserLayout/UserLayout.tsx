import React, { useEffect, useState } from 'react';
import { AppShell, Container, createStyles } from '@mantine/core';
import chatStore from '../../../store/chat.store';
import useStore from '../../../store/user.store';
import { CustomHeader } from './CustomHeader';
import CustomNavbar from './CustomDrawer';
import CustomAffix from '../../common/Affix';
import { isNullOrUndefined } from '../../../utils/primitive-checks';
import { useLocation, useNavigate } from 'react-router-dom';

const useStyles = createStyles((theme) => ({
  layout: {
    background: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
    marginTop: 0,
    minHeight: 0,
  },
  authContainer: {
    position: 'relative',
    top: '50%',
    transform: 'translateY(-50%)',
  },
  container: {
    [theme.fn.smallerThan(475)]: {
      padding: '0px',
      marginRight: '-8px',
      marginLeft: '-8px',
    },
  },
}));

const UserLayout = ({ children }: any) => {
  const { classes, cx } = useStyles();
  const { fetchUser, user } = useStore((state: any) => state);
  const { socket } = chatStore((state: any) => state);
  const [openedDrawer, setOpenedDrawer] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (!isNullOrUndefined(socket) && !isNullOrUndefined(user)) {
      fetchUser();
    }
  }, []);

  return (
    <AppShell
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      fixed
      className={classes.layout}
      header={<CustomHeader openedDrawer={openedDrawer} setOpenedDrawer={setOpenedDrawer} />}
    >
      <CustomNavbar openedDrawer={openedDrawer} setOpenedDrawer={setOpenedDrawer} />
      <Container
        size="xl"
        className={cx(classes.container, {
          [classes.authContainer]: location?.pathname.includes('auth'),
        })}
      >
        {children}
        <CustomAffix />
      </Container>
    </AppShell>
  );
};

export default UserLayout;
