import { AuthorQueryResponse, Profile } from '../models/user.model';

const authorMapper = (author: AuthorQueryResponse, userId?: string | number): Profile => ({
  id: author.id,
  picture: author.picture,
  firstName: author.firstName,
  lastName: author.lastName,
  gender: author.gender,
  following: author.followedBy.some(follow => follow.id === userId),
});

export default authorMapper;
