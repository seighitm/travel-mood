import {useQuery} from "react-query";
import {allMessages, getCountOfNonReadMessages} from "./axios";

export const useGetCountOfNonReadMessages = () => {
  return useQuery(['messages', 'non-read'], () => getCountOfNonReadMessages());
};

export const useGetAllChatMessage = (selChat: any) => {
  return useQuery('fetchMessagesChat', () => allMessages(selChat.id), {enabled: false});
};
