import {CommentQueryResponse, CommentResponse} from '../models/comment.model';

const commentMapper = (comment: CommentQueryResponse): CommentResponse => ({
  id: comment.id,
  createdAt: comment.createdAt,
  body: comment.body,
  author: {
    id: comment.author.id,
    firstName: comment.author.firstName,
    lastName: comment.author.lastName,
    gender: comment.author.gender,
    picture: comment.author.picture,
  }
});

export default commentMapper;
