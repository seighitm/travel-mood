import Routes from './components/common/engine/Routes';
import chatStore from './store/chat.store';
import io from 'socket.io-client';
import React, {useEffect} from 'react';
import {SOCKET_ENDPOINT} from './data/Constants';
import useStore from "./store/user.store";
import {useQueryClient} from "react-query";

function App() {
  const {socket, setSocket, setNotifications} = chatStore((state: any) => state);
  const {user, setOnlineUsers, fetchUser} = useStore((state: any) => state);
  const queryClient = useQueryClient();
  console.log(user)
  console.log(import.meta.env.VITE_API_URL)

  useEffect(() => {
    if (localStorage.getItem('accessToken') || !user) {
      fetchUser()
    }
  }, []);

  useEffect(() => {
    if (socket) {
      socket.emit('setup', user);
      socket.emit('get-online-users')
    }
  }, [socket]);

  useEffect(() => {
    if (user)
      if (socket == null) setSocket(io(SOCKET_ENDPOINT));
  }, [user])

  useEffect(() => {
    if (socket) {
      socket.on('get-reconnect-to-rooms', async () => {
        await queryClient.invalidateQueries('fetchMyChats');
        socket.emit('post-join-room-again')
      });
      socket.on('receive-views', async () => {
        await queryClient.invalidateQueries(['users', 'profile-visits'])
      });
      socket.on('receive-trip-join-request', async () => {
        console.log('receive-trip-join-request')
        if (queryClient.getQueryData(['trips', 'one']))
          await queryClient.invalidateQueries(['trips', 'one']);
        await queryClient.invalidateQueries(['userTrips', 'ALL'])
      });
      socket.on('connected', async (users: any) => {
        console.log('connected');
        setOnlineUsers(users);
        console.log(users)
      });
      socket.on('disconnected', async (users: any) => {
        console.log('disconnected');
        setOnlineUsers(users);
      });
      socket.on('get-reconnect-to-rooms', async () => {
        await queryClient.invalidateQueries('fetchMyChats');
        socket.emit('post-join-room-again')
      });
      socket.on('post-online-users', (users: any) => {
        setOnlineUsers(users);
      });
      socket.on('receive-trip-join-request', async () => {
        console.log('receive-trip-join-request')
        if (queryClient.getQueryData(['trips', 'one']))
          await queryClient.invalidateQueries(['trips', 'one']);
        await queryClient.invalidateQueries(['userTrips', 'ALL']);
      });
      socket.on('message-received', async (newMessageReceived: any) => {
        console.log(newMessageReceived);
        await queryClient.invalidateQueries(['messages', 'non-read']);
        await queryClient.invalidateQueries(['fetchMessagesChat'])
        const notifications = await queryClient.getQueryData(['messages', 'non-read']);
        setNotifications(notifications);
      });
      setTimeout(() => {
        socket.emit('get-online-users');
      }, 1000)
    }
    // return () => {
    //   if (socket !== null) {
    //     socket.off("message-received")
    //     socket.off("post-online-users")
    //     socket.off("receive-trip-join-request")
    //     socket.off("receive-views")
    //   }
    // }
  }, [user, socket])
  return <Routes/>;
}

export default App;
