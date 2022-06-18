import { IUser } from './IUser';
import { IComment } from './IComment';

export interface IArticle {
  user: IUser;
  id: number;
  title: string;
  description: string;
  comments: IComment[];
  countries: {
    name: string;
    code: string;
  }[];
  languages: {
    name: string;
  }[];
  favorited: boolean;
  isUpdatedByAdmin: boolean;
  favoritedBy: any[];
  createdAt: string;
  author: {
    id: string;
  };
  tagList: {
    name: string;
  }[];
  picture: {
    image: string;
  };
  articles?: IArticle[];
  favoritesCount?: number | string;
}
