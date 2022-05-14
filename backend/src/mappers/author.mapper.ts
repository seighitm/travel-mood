import { AuthorQueryResponse, Profile } from '../models/user.model';

const authorMapper = (author: AuthorQueryResponse, userId?: string | number): Profile => ({
  id: author.id,
  name: author.name,
  picture: author.picture,
  firstName: author.firstName,
  lastName: author.lastName,
  sex: author.sex,
  following: author.followedBy.some(follow => follow.id === userId),
});

export default authorMapper;
