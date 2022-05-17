import {Profile, User} from '../models/user.model';
import {ProfileResponse} from "../models/profile.model";

const profileMapper = (profile: ProfileResponse, userId: number): Profile => ({
  id: profile.id,
  picture: profile.picture,
  firstName: profile.firstName,
  lastName: profile.lastName,
  following: userId
    ? profile?.followedBy.some(
      (followingUser: Pick<User, 'id'>) => followingUser.id === userId,
    )
    : false,
});

export default profileMapper;
