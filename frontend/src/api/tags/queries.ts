import { useQuery } from 'react-query';
import { apiGetTags } from './axios';

export const useTagsQuery = ({
  tagName,
  showBlocked,
}: {
  tagName?: string;
  showBlocked?: boolean;
}) =>
  useQuery(['tags', 'all', showBlocked], () =>
    apiGetTags({ tagName: tagName, showBlocked: showBlocked })
  );
