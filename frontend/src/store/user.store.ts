import create from 'zustand';
import { apiUserMe } from '../api/auth/axios';

const useStore = create<any>((set) => ({
  user: null,
  onlineUsers: [],
  editorContent: '',
  isLoadingUser: true,
  setEditorContent: (content: any) => {
    set(() => ({ editorContent: content }));
  },
  setOnlineUsers: (users: any) => {
    set(() => ({ onlineUsers: users }));
  },
  setIsLoadingUser: (state: any) => {
    set(() => ({ isLoadingUser: state }));
  },
  setUser: (user: any) => {
    if (!user) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    } else if (user && user.accessToken) {
      localStorage.setItem('accessToken', user.accessToken);
      localStorage.setItem('refreshToken', user.refreshToken);
    }
    set(() => ({ user: user }));
  },
  fetchUser: async () => {
    set(() => ({ isLoadingUser: true }));
    try {
      const data: any = await apiUserMe();
      set(() => ({ user: data }));
      set(() => ({ isLoadingUser: false }));
    } catch {
      set(() => ({ isLoadingUser: false }));
    } finally {
      set(() => ({ isLoadingUser: false }));
    }
  },
}));

export default useStore;
