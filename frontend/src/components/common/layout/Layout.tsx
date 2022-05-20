import React, {useEffect, useState} from 'react';
import {AppShell, Container, Drawer} from '@mantine/core';
import chatStore from '../../../store/chat.store';
import useStore from '../../../store/user.store';
import {useGetAllProfileVisits} from '../../../api/users/queries';
import {useGetUserTrips} from '../../../api/trips/queries';
import {CustomHeader} from './CustomHeader';
import {HEADER_LINKS} from '../../../data/Constants';
import CustomNavbar from './Navbar/Navbar';
import {Paperclip} from '../../../assets/Icons';
import CustomAffix from "../Affix";
import {useMediaQuery} from "@mantine/hooks";
import {isNullOrUndefined} from "../../../utils/primitive-checks";

const Layout = ({children}: any) => {
  const {fetchUser, user} = useStore((state: any) => state);
  const {socket} = chatStore((state: any) => state);
  const [openedDrawer, setOpenedDrawer] = useState(false);

  const {data} = useGetAllProfileVisits();
  const {data: userTrips} = useGetUserTrips('ALL');
  const matchesMobile = useMediaQuery('(min-width: 475px)');

  useEffect(() => {
    if (!isNullOrUndefined(socket) && !isNullOrUndefined(user)) {
      fetchUser();
    }
  }, []);

  return <AppShell
    navbarOffsetBreakpoint='sm'
    fixed
    sx={(theme: any) => ({
      background: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
      marginTop: 0,
      minHeight: 0,
    })}
    header={
      <CustomHeader
        openedDrawer={openedDrawer}
        setOpenedDrawer={setOpenedDrawer}
        data={data}
        userTrips={userTrips}
        links={[...HEADER_LINKS]}
      />
    }
  >
    <Drawer
      opened={openedDrawer}
      onClose={() => setOpenedDrawer(false)}
      title={<Paperclip/>}
      padding='xl'
      size='xl'
      transitionTimingFunction='ease'
      zIndex={5}
    >
      <CustomNavbar
        guestsCounter={data?.guests?.filter((item: any) => item.seen == false).length}
        setOpenedDrawer={setOpenedDrawer}
        travelRequestsCounter={
          userTrips?.filter((item: any) => item.status == 'PENDING' || item.status == 'RECEIVED').length
        }
      />
    </Drawer>
    <Container size='xl' p={!matchesMobile ? 0 : undefined} mx={!matchesMobile ? '-8px' : undefined}>
      {children}
      <CustomAffix/>
    </Container>
  </AppShell>
};

export default Layout;
