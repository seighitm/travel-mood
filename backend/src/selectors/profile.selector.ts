import { Prisma } from '@prisma/client';

const profileSelector = Prisma.validator<Prisma.UserSelect>()({
  name: true,
  id: true,
  picture: true,
  followedBy: {
    select: {
      id: true,
      name: true,
      followedBy: true,
      following: true,
      picture: true
    },
  },
});

export default profileSelector;
