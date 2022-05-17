import Routes from './components/common/engine/Routes';
import chatStore from './store/chat.store';
import React, {useEffect} from 'react';
import useStore from "./store/user.store";
import {useQueryClient} from "react-query";
import {useLocation} from "react-router-dom";

function App({socketIo}: any) {
  const {socket, selectedChat, setSocket, setNotifications} = chatStore((state: any) => state);
  const {user, setOnlineUsers, fetchUser} = useStore((state: any) => state);
  const queryClient = useQueryClient();
  console.log(user)
  console.log(import.meta.env.VITE_API_URL)

  useEffect(() => {
    if (user)
      setSocket(socketIo)
    // if (socket == null) setSocket(io(SOCKET_ENDPOINT, {
    //   // reconnection: true,
    //   // reconnectionDelay: 1000,
    //   // reconnectionDelayMax : 5000,
    //   // reconnectionAttempts: 99999
    // }));
  }, [socketIo, user])

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
  const location = useLocation()
  console.log(location)
  console.log(socket)
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
        socket.emit('leave-chat')
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

      if (socket?._callbacks['$message-received'] == undefined)
        socket.on('message-received', async (newMessageReceived: any) => {

          const prevAllMessages = await queryClient.getQueryData(['fetchMessagesChat', newMessageReceived.chat.id]);
          if (prevAllMessages) {
            await queryClient.cancelQueries(['fetchMessagesChat', newMessageReceived.chat.id]);
            const prevMessages: any = queryClient.getQueryData(['fetchMessagesChat', newMessageReceived.chat.id]);
            prevMessages.push({...newMessageReceived, readBy: []});
            queryClient.setQueryData(['fetchMessagesChat', newMessageReceived.chat.id], () => prevMessages);
          }

          const prevAllChats: any = queryClient.getQueryData('fetchMyChats');
          if (prevAllChats) {
            await queryClient.cancelQueries('fetchMyChats');
            let foundIndex = prevAllChats.findIndex((chat: any) => chat.id == newMessageReceived.chat.id);
            prevAllChats[foundIndex].latestMessage = {...newMessageReceived};
            // if (selectedChat.id != newMessageReceived.chat.id)
            prevAllChats[foundIndex].countNonReadmessages += 1;
            queryClient.setQueryData('fetchMyChats', () => prevAllChats);
          }

          await queryClient.invalidateQueries(['messages', 'non-read']);
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
