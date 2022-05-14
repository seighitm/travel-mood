import create from 'zustand';
import {devtools} from 'zustand/middleware';
import {fetchChats} from '../api/chat/axios';

const chatStore = create<any>(
  devtools((set, get) => ({
    isOpenChatDrawer: false,
    chats: [] as any,
    chat: null,
    selectedChat: {id: -1, users: []},
    isLoadingChats: false,
    isSuccessChats: false,
    isErrorChats: false,
    socket: null,
    notifications: [],
    setNotifications: (notifications: any) => {
      set(() => ({notifications: notifications}));
    },
    setOpenedChatDrawer: (isOpened: boolean) => {
      set(() => ({isOpenChatDrawer: isOpened}))
    },
    setSocket: (socket: any) => {
      set(() => ({socket: socket}));
    },
    getChats: async () => {
      set(() => ({isLoadingChats: true}));
      try {
        const response: any = await fetchChats();
        set(() => ({chats: response, isLoadingChats: false, isSuccessChats: true}));
      } catch (e: any) {
        set(() => ({isError: true, isLoadingChats: false}));
        console.log('Error', e.response.data);
      }
    },
    getOneChat: async (id: any) => {
      set(() => ({isLoadingChats: true}));
      const chat = get().chats.filter((item: any) => item.id === id);
      set(() => ({chat: chat ? chat[0] : {}, isLoadingChats: false}));
    },
    // setSelectedChat: async (userId: number | string) => {
    //     set(() => ({isLoadingChats: true}))
    //     try {
    //         const response: any = await accessChat(userId)
    //         console.log(response)
    //         console.log(get().chats)
    //         const chat = get().chats.find((item: any) => item.id === response.id)
    //         // console.log({chats: [...get().chats, chat]})
    //         console.log(chat)
    //         // if (!chat && get().chats[0] != undefined)
    //         //     set((state: any) => ({chats: [...state.chats, chat]}))
    //         set(() => ({selectedChat: response, isLoadingChats: false, isSuccessChats: true}))
    //     } catch (e: any) {
    //         set(() => ({isError: true, isLoadingChats: false}))
    //         console.log('Error', e.response.data);
    //     }
    // },
    directSetSelectedChat: (chat: any) => {
      set(() => ({selectedChat: chat}));
    },
  }))
);

export default chatStore;
