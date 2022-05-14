import create from 'zustand';
import { StateProps } from '../types/type';
import { devtools } from 'zustand/middleware';

const articlesStore = create<StateProps>(
  devtools((set, get) => ({
    articles: [],
    setArticles: (articles: any) => {
      set((state) => ({ articles }));
    },
    getOneArticle: (id: number | string) => {
      return get()?.articles?.find((item: any) => item.slug == id);
    },
    createArticles: (payload: any[]) =>
      set((state: any) => ({
        ...state.articles,
        articles: [payload, ...state.articles],
      })),
  }))
);

export default articlesStore;
