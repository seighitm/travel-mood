import {useQuery} from "react-query";
import {getTags} from "./axios";

export const useTagsQuery = ({tagName}: { tagName?: string }) =>
  useQuery(['tags', 'all'], () => getTags({name: tagName}));
