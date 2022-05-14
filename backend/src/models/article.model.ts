import {ArticleImage} from '@prisma/client';
import {Tag} from './tag.model';
import {AuthorQueryResponse, FollowersQueryResponse, Profile} from './user.model';

interface Article {
  id: number,
  title: string;
  description: string;
  body: string;
  countries: ReadonlyArray<string>;
  tagList: ReadonlyArray<string>;
  isPrimaryImage: string,
  images: ArticleImage[];
  oldImages: string[];
  oldPrimaryImage: any;
  createdAt: Date;
  updatedAt: Date;
  primaryImage: string,
  comments: any,
  favoritedBy: ReadonlyArray<FollowersQueryResponse>;
  author: AuthorQueryResponse;
  articles: ReadonlyArray<ArticleResponse>;
  articlesCountOnPage: number;
  totalCount: number;
}

export type ArticleCreatePayload = Pick<Article, 'title' | 'countries' | 'description' | 'body' | 'isPrimaryImage' | 'tagList'>;

export type ArticleUpdatePayload = Pick<Article, 'title' | 'countries' | 'description' | 'body' | 'isPrimaryImage' | 'tagList' | 'oldImages' | 'oldPrimaryImage'>

export type ArticleTitle = Pick<Article, 'title' | 'id' | 'images'>;

export type ArticleValidatorPayload = Pick<Article, 'title' | 'countries' | 'description' | 'body'>;

export type ArticleListResponse = Pick<Article, 'articles' | 'articlesCountOnPage' | 'totalCount'>;

export interface ArticleFindQuery {
  author: string;
  tags: string[];
  favorited: string;
  offset: string;
  limit: string;
  page: any,
  countries: string[],
}

export interface ArticleQueryResponse {
  countries: any,
  primaryImage: string,
  isUpdatedByAdmin: boolean,
  title: string;
  images?: any;
  id: string | number,
  description: string;
  body?: string;
  comments?: any,
  tagList: ReadonlyArray<Tag> | { name: string }[];
  createdAt: Date;
  updatedAt: Date;
  favoritedBy: ReadonlyArray<FollowersQueryResponse>;
  author: AuthorQueryResponse;
}

export interface ArticleResponse {
  images?: any[];
  primaryImage: string,
  oldPrimaryImage?: string;
  countries: any,
  title: string;
  id: string | number,
  description: string;
  body?: string;
  comments?: any,
  tagList: ReadonlyArray<string>;
  createdAt: Date;
  updatedAt: Date;
  favorited: boolean;
  favoritesCount: number;
  author: Profile;
  favoritedBy: any
}

