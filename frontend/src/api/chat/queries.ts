import { useQuery } from 'react-query';
import { apiGetChats } from './axios';

export const useGetAllMyChats = () => useQuery(['chats'], () => apiGetChats());
