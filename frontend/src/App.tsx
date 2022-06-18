import Routes from './components/common/routes/Routes';
import chatStore from './store/chat.store';
import React, {useEffect} from 'react';
import useStore from './store/user.store';
import {useQueryClient} from 'react-query';
import {useMutateReadMessages} from './api/chat/messages/mutations';
import {isNullOrUndefined} from './utils/primitive-checks';

let currentChat: any = null;

function App({socketIo}: any) {
  const {socket, selectedChat, setSocket, setNotifications} = chatStore((state: any) => state);
  const {user, setOnlineUsers, setIsLoadingUser, fetchUser} = useStore((state: any) => state);
  const queryClient = useQueryClient();
  const {mutate: mutateRead} = useMutateReadMessages();

  useEffect(() => {
    if (!isNullOrUndefined(user)) {
      setSocket(socketIo);
    }
  }, [socketIo, user]);

  useEffect(() => {
    currentChat = selectedChat.id;
  }, [selectedChat]);

  useEffect(() => {
    if (localStorage.getItem('accessToken') && isNullOrUndefined(user)) {
      fetchUser();
    } else {
      setIsLoadingUser(false)
    }
  }, []);

  useEffect(() => {
    if (!isNullOrUndefined(socket)) {
      socket.emit('setup', user);
      socket.emit('get-online-users');
    }
  }, [socket]);

  useEffect(() => {
    if (!isNullOrUndefined(user) && !isNullOrUndefined(socket)) {
      socket.on('get-reconnect-to-rooms', async () => {
        await queryClient.invalidateQueries(['chats']);
        socket.emit('post-join-room-again');
      });
      socket.on('receive-views', async () => {
        console.log('receive-views');
        await queryClient.invalidateQueries(['users', 'profile-visits']);
      });
      socket.on('receive-trip-join-request', async () => {
        console.log('receive-trip-join-request');
        if (queryClient.getQueryData(['trips', 'one']))
          await queryClient.invalidateQueries(['trips', 'one']);
        await queryClient.invalidateQueries(['userTrips', 'ALL']);
      });
      socket.on('connected', async (users: any) => {
        console.log('connected');
        setOnlineUsers(users);
        console.log(users);
      });
      socket.on('disconnected', async (users: any) => {
        console.log('disconnected');
        setOnlineUsers(users);
      });
      socket.on('post-online-users', (users: any) => {
        setOnlineUsers(users);
      });
      socket.on('receive-trip-join-request', async () => {
        console.log('receive-trip-join-request');
        if (queryClient.getQueryData(['trips', 'one']))
          await queryClient.invalidateQueries(['trips', 'one']);
        await queryClient.invalidateQueries(['userTrips', 'ALL']);
      });
      socket.on('get-read-messages', async (chatId: any) => {
        console.log('get-read-messages');
        mutateRead(chatId);
      });
      if (socket?._callbacks['$message-received'] == undefined)
        socket.on('message-received', async (newMessageReceived: any) => {
          console.log(newMessageReceived);
          const prevAllMessages = await queryClient.getQueryData([
            'fetchMessagesChat',
            newMessageReceived.chat.id,
          ]);
          if (prevAllMessages) {
            await queryClient.cancelQueries(['fetchMessagesChat', newMessageReceived.chat.id]);
            const prevMessages: any = queryClient.getQueryData([
              'fetchMessagesChat',
              newMessageReceived.chat.id,
            ]);
            prevMessages.push({...newMessageReceived, readBy: []});
            queryClient.setQueryData(
              ['fetchMessagesChat', newMessageReceived.chat.id],
              () => prevMessages
            );
          }
          const prevAllChats: any = queryClient.getQueryData(['chats']);
          if (prevAllChats) {
            await queryClient.cancelQueries(['chats']);
            let foundIndex = prevAllChats.findIndex(
              (chat: any) => chat.id == newMessageReceived.chat.id
            );
            prevAllChats[foundIndex].latestMessage = {...newMessageReceived};
            // if (selectedChat.id != newMessageReceived.chat.id)
            prevAllChats[foundIndex].countNonReadmessages += 1;
            queryClient.setQueryData(['chats'], () => prevAllChats);
          }
          await queryClient.invalidateQueries(['messages', 'non-read']);
          const notifications = await queryClient.getQueryData(['messages', 'non-read']);
          setNotifications(notifications);
          if (newMessageReceived?.chat.id == currentChat) {
            setTimeout(() => {
              mutateRead(newMessageReceived?.chat.id);
            }, 1000);
          }
        });
      setTimeout(() => {
        socket.emit('get-online-users');
      }, 1000);
    }
    // return () => {
    //   if (socket !== null) {
    //     socket.off('message-received');
    //     socket.off('post-online-users');
    //     socket.off('receive-trip-join-request');
    //     socket.off('receive-views');
    //   }
    // };
  }, [user, socket]);

  return <Routes/>;
}

export default App;
