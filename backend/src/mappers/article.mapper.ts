import {ArticleQueryResponse, ArticleResponse} from '../models/article.model';
import authorMapper from './author.mapper';

export const articleMapper = (article: ArticleQueryResponse, id?: string | number): ArticleResponse => ({
  id: article.id,
  isUpdatedByAdmin: article.isUpdatedByAdmin,
  title: article.title,
  countries: article.countries,
  description: article.description,
  body: article.body,
  primaryImage: article.primaryImage,
  images: article.images,
  comments: article.comments,
  tagList: article.tagList.map(tag => tag.name),
  createdAt: article.createdAt,
  updatedAt: article.updatedAt,
  favoritedBy: article.favoritedBy,
  favorited: article.favoritedBy.some(item => item.id === Number(id)),
  favoritesCount: article.favoritedBy.length,
  author: authorMapper(article.author, id),
});

export const articlesMapper = (article: ArticleQueryResponse, id?: number): ArticleResponse | any => ({
  id: article.id,
  title: article.title,
  isUpdatedByAdmin: article.isUpdatedByAdmin,
  countries: article.countries,
  description: article.description,
  primaryImage: article.primaryImage,
  comments: article.comments,
  tagList: article.tagList.map(tag => tag.name),
  createdAt: article.createdAt,
  updatedAt: article.updatedAt,
  favoritedBy: article.favoritedBy,
  favorited: article.favoritedBy.some(item => item.id === Number(id)),
  favoritesCount: article.favoritedBy.length,
  author: authorMapper(article.author, id),
});

