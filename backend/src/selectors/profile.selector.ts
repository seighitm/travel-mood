import { Prisma } from '@prisma/client'

const profileSelector = Prisma.validator<Prisma.UserSelect>()({
  id: true,
  picture: true,
  firstName: true,
  lastName: true,
  followedBy: {
    select: {
      id: true,
      followedBy: true,
      following: true,
      picture: true,
    },
  },
})

export default profileSelector
