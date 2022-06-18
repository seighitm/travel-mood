import { AuthorQueryResponse, Profile } from './user.model'

export interface CommentResponse {
  id: number
  createdAt?: Date
  updatedAt?: Date
  comment?: string
  user?: Profile
}

export interface CommentQueryResponse {
  id: number
  createdAt: Date
  updatedAt?: Date
  comment: string
  user: AuthorQueryResponse
}

export type CommentListResponse = ReadonlyArray<CommentResponse>
