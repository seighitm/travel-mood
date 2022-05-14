import { Prisma } from '@prisma/client';

const commentSelector = Prisma.validator<any>()({
  id: true,
  createdAt: true,
  body: true,
  author: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      picture: true,
      gender: true,
    },
  },
});

export default commentSelector;
