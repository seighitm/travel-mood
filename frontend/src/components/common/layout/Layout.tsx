import React, {useEffect, useState} from 'react';
import {AppShell, Container, Drawer} from '@mantine/core';
import chatStore from '../../../store/chat.store';
import {useQueryClient} from 'react-query';
import useStore from '../../../store/user.store';
import {useGetAllProfileVisits} from '../../../api/users/queries';
import {useGetUserTrips} from '../../../api/trips/queries';
import {HeaderComponent} from './HeaderComponent';
import {HEADER_LINKS} from '../../../data/Constants';
import CustomNavbar from './Navbar/Navbar';
import {Paperclip} from '../../../assets/Icons';
import CustomAffix from "../Affix";
import {useMediaQuery} from "@mantine/hooks";

const Layout = ({children}: any) => {
  const {fetchUser, user, onlineUsers, setOnlineUsers} = useStore((state: any) => state);
  const {socket, setNotifications} = chatStore((state: any) => state);
  const queryClient = useQueryClient();

  const [openedDrawer, setOpenedDrawer] = useState(false);

  const {data, refetch} = useGetAllProfileVisits();
  const {data: userTrips, refetch: refetchUserTrips} = useGetUserTrips('ALL');

  useEffect(() => {
    if (!!socket)
      fetchUser();
  }, []);

  // let location = useLocation();
  // useEffect(() => {
  //   if (user && onlineUsers.find((item: any) => item.userId == user.id) != undefined) {
  //     socket.emit('setup', user);
  //   }
  // }, [location]);
  const {setSocket} = chatStore((state: any) => state);

  useEffect(() => {
    if (socket) {
      // socket.emit('setup', user);

      // if (socket && socket?._callbacks['$receive-views'] == undefined)
      // socket.on('receive-views', async () => {
      //   await refetch();
      // });


      // if (socket?._callbacks['$message-received'] == undefined)
      // socket.on('message-received', async (newMessageReceived: any) => {
      //   console.log(newMessageReceived);
      //   console.log('MIASA')
      //
      //
      //   // if (window.location.href.split("/").reverse()[0] !== "chat")
      //   await queryClient.invalidateQueries(['messages', 'non-read']);
      //   // await queryClient.invalidateQueries(['notifications', 'all']);
      //   await queryClient.invalidateQueries(['fetchMessagesChat'])
      //   const notifications = await queryClient.getQueryData(['messages', 'non-read']);
      //   setNotifications(notifications);
      // });
    }
  }, [user]);
  const matchesMobile = useMediaQuery('(min-width: 475px)');

  return (
    <>
      {/*      <Button onClick={() => socket.on("get-online-users")}>
        Click
      </Button>*/}
      <AppShell
        navbarOffsetBreakpoint='sm'
        fixed
        sx={(theme: any) => ({
          background: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
          marginTop: 0,
          minHeight: 0,
        })}
        header={
          <HeaderComponent
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
            travelRequestsCounter={
              userTrips?.filter(
                (item: any) => item.status == 'PENDING' || item.status == 'RECEIVED',
              ).length
            }
            guestsCounter={data?.guests?.filter((item: any) => item.seen == false).length}
            links={{...HEADER_LINKS}}
            setOpenedDrawer={setOpenedDrawer}
          />
        </Drawer>
        <Container size='xl' p={!matchesMobile ? 0 : undefined} mx={!matchesMobile ? '-8px' : undefined}>
          {children}
          <CustomAffix/>
        </Container>
      </AppShell>
    </>
  );
};

export default Layout;
