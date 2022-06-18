import { CommentQueryResponse, CommentResponse } from '../types/comment.model'

const commentMapper = (comment: CommentQueryResponse): CommentResponse => ({
  id: comment.id,
  createdAt: comment.createdAt,
  comment: comment.comment,
  user: {
    id: comment.user.id,
    firstName: comment.user.firstName,
    lastName: comment.user.lastName,
    gender: comment.user.gender,
    picture: comment.user.picture,
  },
})

export default commentMapper
