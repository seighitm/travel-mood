import {useQuery} from "react-query";
import {fetchChats} from "./axios";

export const useGetAllMyChats = () =>
  useQuery('fetchMyChats', () => fetchChats());

