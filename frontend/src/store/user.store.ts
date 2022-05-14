import create from 'zustand';
import { StateProps } from '../types/type';
import { apiUserMe } from '../api/auth/axios';

const useStore = create<StateProps | any>((set) => ({
  user: null,
  onlineUsers: [],
  editorContent: '',
  setEditorContent: (content: any) => {
    set(() => ({ editorContent: content }));
  },
  setOnlineUsers: (users: any) => {
    set(() => ({ onlineUsers: users }));
  },
  setUser: (user: any) => {
    if(!user){
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }else if (user && user.accessToken) {
      localStorage.setItem('accessToken', user.accessToken);
      localStorage.setItem('refreshToken', user.refreshToken);
    }
    set(() => ({ user: user }));
  },
  fetchUser: async () => {
    console.log(window.location)
    const data: any = await apiUserMe();
    set(() => ({ user: data }));
  },
}));

export default useStore;
