import { useQuery } from 'react-query';
import { allMessages, getCountOfNonReadMessages } from './axios';
import useStore from '../../../store/user.store';
import { isNullOrUndefined } from '../../../utils/primitive-checks';

export const useGetCountOfNonReadMessages = () => {
  const { user } = useStore((state: any) => state);
  return useQuery(['messages', 'non-read'], () => getCountOfNonReadMessages(), {
    enabled: !isNullOrUndefined(user),
  });
};

export const useGetAllChatMessage = (selChat: any) => {
  return useQuery(['fetchMessagesChat', selChat.id], () => allMessages(selChat.id), {
    enabled: false,
  });
};
