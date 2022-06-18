import { useQuery, useQueryClient } from 'react-query';
import { getAllArticle, getOneArticle } from './axios';
import { customNavigation } from '../../utils/utils-func';
import useStore from '../../store/user.store';
import { useNavigate } from 'react-router-dom';

export const useGetAllArticles = ({ page = 1, tags, author, countries, title }: any) =>
  useQuery(
    ['articles', 'all', page],
    async () =>
      await getAllArticle({
        page: page,
        tags: tags,
        author: author,
        countries: countries,
        title: title,
      })
  );

export const useOneArticleQuery = ({ id }: { id: string | number | undefined }) => {
  const queryClient = useQueryClient();
  const { user } = useStore((state: any) => state);
  const navigate = useNavigate();
  return useQuery(['articles', 'one'], () => getOneArticle({ id: id }), {
    initialData: () => {
      return queryClient.getQueryData(['articles', 'one']);
    },
    onError: async (err: any) => {
      if (err?.response.data.message == 'Article not found!') {
        customNavigation(user?.role, navigate, '/articles');
      }
    },
  });
};
