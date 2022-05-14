import React, {useEffect, useState} from 'react';
import {AppShell, Burger, Drawer, Header, MediaQuery, useMantineTheme,} from '@mantine/core';
import {Brand} from "./_brand";
import {Paperclip} from "../../../assets/Icons";
import CustomNavbarAdmin from "./CustomNavbar";
import {HEADER_LINKS} from "../../../data/Constants";
import CustomNavbar from "../../common/layout/Navbar/Navbar";
import useStore from "../../../store/user.store";
import chatStore from "../../../store/chat.store";
import {useQueryClient} from "react-query";

const AdminLayout = ({children}: any) => {
  const theme = useMantineTheme();
  const [openedDrawer, setOpenedDrawer] = useState(false);
  const {user, setOnlineUsers} = useStore((state: any) => state);
  const {socket, setNotifications} = chatStore((state: any) => state);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!!user && socket) {
      socket.emit('setup', user);

      if (socket?._callbacks['$post-online-users'] == undefined)
        socket.on('post-online-users', (users: any) => {
          setOnlineUsers(users);
        });

      if (socket?._callbacks['$connected'] == undefined)
        socket.on('connected', async (users: any) => {
          console.log('connected');
          setOnlineUsers(users);
        });

      if (socket?._callbacks['$disconnected'] == undefined)
        socket.on('disconnected', async (users: any) => {
          console.log('disconnected');
          setOnlineUsers(users);
        });

      if (socket?._callbacks['$message-received'] == undefined)
        socket.on('message-received', async (newMessageReceived: any) => {
          console.log(newMessageReceived);
          // if (window.location.href.split("/").reverse()[0] !== "chat")
          await queryClient.invalidateQueries(['notifications', 'all']);
          const notifications = await queryClient.getQueryData(['notifications', 'all']);
          setNotifications(notifications);
        });
    }
  }, [user]);

  return (
    <AppShell
      styles={{
        main: {
          background: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
        },
      }}
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      fixed
      navbar={
        <CustomNavbarAdmin/>
      }
      header={
        <Header height={70} p="md">
          <div style={{display: 'flex', alignItems: 'center', height: '100%'}}>
            <MediaQuery largerThan="sm" styles={{display: 'none'}}>
              <Burger
                opened={openedDrawer}
                onClick={() => setOpenedDrawer((o) => !o)}
                size="sm"
                color={theme.colors.gray[6]}
                mr="xl"
              />
            </MediaQuery>
            <Brand/>
          </div>
        </Header>
      }
    >
      <Drawer
        opened={openedDrawer}
        onClose={() => setOpenedDrawer(false)}
        title={<Paperclip/>}
        padding='xl'
        size='xl'
        transitionTimingFunction='ease'
      >
        <CustomNavbar
          travelRequestsCounter={0}
          guestsCounter={0}
          links={{...HEADER_LINKS}}
          setOpenedDrawer={setOpenedDrawer}
        />
      </Drawer>
      {children}
    </AppShell>
  );
}

export default AdminLayout
