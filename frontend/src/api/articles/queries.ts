import {useQuery, useQueryClient} from "react-query";
import {getAllArticle, getArticlesFiltering, getOneArticle} from "./axios";
import {getTripsFiltering} from "../trips/axios";
import {useAsyncDebounce} from "react-table";

//##############################################################################
//##############################################################################
export const useGetAllArticles = ({page, tags, author, countries}: any) =>
  useQuery(['articles', 'all', page],
    async () => await getAllArticle({page: page, tags: tags, author: author, countries: countries})
  );

//##############################################################################
//##############################################################################
export const useOneArticleQuery = ({id,}: { id: string | number | undefined; }) => {
  const queryClient = useQueryClient();
  return useQuery(['articles', 'one'], () => getOneArticle({id: id}), {
    initialData: () => {
      return queryClient.getQueryData(['articles', 'one'])
    },
  })
};



export const useArticlesFiltering = (
  queryPageIndex: any,
  queryPageSize: any,
  queryPageFilter: any,
  queryPageSortBy: any,
  queryPageOrder: any,
) => {
  const debouncedFetchPaginatedUsers: any = useAsyncDebounce(
    getArticlesFiltering,
    300,
  );

  return useQuery(
    [
      'filteringArticlesAdmin',
      queryPageIndex,
      queryPageSize,
      queryPageFilter,
      queryPageSortBy,
      queryPageOrder,
    ],
    () =>
      debouncedFetchPaginatedUsers(queryPageIndex, queryPageSize, queryPageFilter, queryPageSortBy, queryPageOrder,),
    {
      keepPreviousData: true,
      staleTime: Infinity,
      suspense: true,
      cacheTime: 0,
    },
  );
}
