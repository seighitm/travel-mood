import {Tag} from './tag.model';
import {AuthorQueryResponse, FollowersQueryResponse, Profile} from './user.model';

export interface ArticleCreatePayload {
  title: string;
  oldPrimaryImage?: string;
  countries?: any;
  markers?: any;
  description: string;
  body: string;
  places?: string[],
  destinations?: ReadonlyArray<string>,
  tagList: ReadonlyArray<string>;
  oldImages?: string[],
  isPrimaryImage?: string
}

export interface ArticleFindQuery {
  author?: string;
  tags?: string[];
  destinations?: string;
  favorited?: string;
  offset?: string;
  limit?: string;
  page?: any,
  countries?: string[],
  merkers?: string[],
}

export interface ArticleQueryResponse {
  countries?: any,
  primaryImage?: string,
  title?: string;
  images?: any;
  id: string | number,
  description?: string;
  body?: string;
  comments?: any,
  tagList?: ReadonlyArray<Tag>;
  createdAt?: Date;
  updatedAt?: Date;
  favoritedBy?: ReadonlyArray<FollowersQueryResponse>;
  author?: AuthorQueryResponse;
}

export interface ArticleResponse {
  images: any[];
  primaryImage?: string,
  oldPrimaryImage?: string;
  countries: any,
  title: string;
  id: string | number,
  description: string;
  body: string;
  comments: any,
  tagList: ReadonlyArray<string>;
  createdAt: Date;
  updatedAt: Date;
  favorited: boolean;
  favoritesCount: number;
  author: Profile;
  favoritedBy: any
}

export interface ArticleListResponse {
  articles: ReadonlyArray<ArticleResponse>;
  articlesCount: number;
  totalCount?: number;
}
