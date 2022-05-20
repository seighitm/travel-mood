import React, {useState} from 'react';
import {
  ActionIcon,
  AppShell, Box,
  Burger,
  Drawer,
  Group,
  Header,
  MediaQuery,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';
import {MoonStars, Paperclip, Sun} from "../../../assets/Icons";
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

  // useEffect(() => {
  //   if (!!user && socket) {
  //     socket.emit('setup', user);
  //
  //     if (socket?._callbacks['$post-online-users'] == undefined)
  //       socket.on('post-online-users', (users: any) => {
  //         setOnlineUsers(users);
  //       });
  //
  //     if (socket?._callbacks['$connected'] == undefined)
  //       socket.on('connected', async (users: any) => {
  //         console.log('connected');
  //         setOnlineUsers(users);
  //       });
  //
  //     if (socket?._callbacks['$disconnected'] == undefined)
  //       socket.on('disconnected', async (users: any) => {
  //         console.log('disconnected');
  //         setOnlineUsers(users);
  //       });
  //
  //     if (socket?._callbacks['$message-received'] == undefined)
  //       socket.on('message-received', async (newMessageReceived: any) => {
  //         console.log(newMessageReceived);
  //         // if (window.location.href.split("/").reverse()[0] !== "chat")
  //         await queryClient.invalidateQueries(['notifications', 'all']);
  //         const notifications = await queryClient.getQueryData(['notifications', 'all']);
  //         setNotifications(notifications);
  //       });
  //   }
  // }, [user]);
  const {colorScheme, toggleColorScheme} = useMantineColorScheme();

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
        <Header height={60}  px={'xl'}>
          <div style={{display: 'flex', alignItems: 'center', height: '100%'}}>
            <Group position="apart" style={{width: '100%'}}>
              <MediaQuery largerThan="sm" styles={{display: 'none'}}>
                <Burger
                  opened={openedDrawer}
                  onClick={() => setOpenedDrawer((o) => !o)}
                  size="sm"
                  color={theme.colors.gray[6]}
                  mr="xl"
                />
              </MediaQuery>
              <MediaQuery smallerThan="sm" styles={{display: 'none'}}>
                <Box></Box>
              </MediaQuery>
              <ActionIcon variant="default" onClick={() => toggleColorScheme()} size={30}>
                {colorScheme === 'dark' ? <Sun size={16}/> : <MoonStars size={16}/>}
              </ActionIcon>
            </Group>
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
