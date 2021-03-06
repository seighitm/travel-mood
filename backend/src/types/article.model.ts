import { ArticleImage } from '@prisma/client'
import { AuthorQueryResponse, FollowersQueryResponse, Profile } from './user.model'

interface Article {
  id: number
  title: string
  body: string
  countries: ReadonlyArray<string>
  tagList: ReadonlyArray<string>
  isPrimaryImage: string
  images: ArticleImage[]
  oldImages: string[]
  oldPrimaryImage: any
  createdAt: Date
  updatedAt: Date
  isUpdatedByAdmin: any
  primaryImage: string
  comments: any
  favoritedBy: ReadonlyArray<FollowersQueryResponse>
  author?: AuthorQueryResponse | any
  articles: ReadonlyArray<ArticleResponse>
  articlesCountOnPage: number
  totalCount: number
  editorImages: any
}

export type ArticleCreatePayload = Pick<
  Article,
  'editorImages' | 'title' | 'countries' | 'body' | 'isPrimaryImage' | 'tagList'
>

export type ArticleUpdatePayload = Pick<
  Article,
  'editorImages' | 'title' | 'countries' | 'body' | 'isPrimaryImage' | 'tagList' | 'oldImages' | 'oldPrimaryImage'
>

export type ArticleTitle = Pick<Article, 'title' | 'id' | 'images' | 'author'>

export type ArticleValidatorPayload = Pick<Article, 'title' | 'body'>

export type ArticleListResponse = Pick<Article, 'articles' | 'articlesCountOnPage' | 'totalCount'>

export interface ArticleFindQuery {
  author: string
  tags: string[]
  favorited: string
  offset: string
  limit: string
  page: any
  countries: string[]
  title?: string
}

export interface ArticleQueryResponse {
  countries: any
  primaryImage: string
  isUpdatedByAdmin: any
  title: string
  images?: any
  id: string | number
  body?: string
  comments?: any
  tagList: any[]
  createdAt: Date
  updatedAt: Date
  favoritedBy: ReadonlyArray<FollowersQueryResponse>
  author: AuthorQueryResponse
}

export interface ArticleResponse {
  images?: any[]
  primaryImage: string
  isUpdatedByAdmin: boolean
  oldPrimaryImage?: string
  countries: any
  title: string
  id: string | number
  body?: string
  comments?: any
  tagList: ReadonlyArray<string>
  createdAt: Date
  updatedAt: Date
  favorited: boolean
  favoritesCount: number
  author: Profile
  favoritedBy: any
}
