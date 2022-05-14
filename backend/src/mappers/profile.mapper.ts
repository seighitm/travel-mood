import {Profile, User} from '../models/user.model';
import {ProfileResponse} from "../models/profile.model";

const profileMapper = (profile: ProfileResponse, userId: number): Profile => ({
  name: profile.name,
  id: profile.id,
  picture: profile.picture,
  following: userId
    ? profile?.followedBy.some(
      (followingUser: Pick<User, 'id'>) => followingUser.id === userId,
    )
    : false,
});

export default profileMapper;
