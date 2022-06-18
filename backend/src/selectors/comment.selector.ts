import { Prisma } from '@prisma/client'

const commentSelector = Prisma.validator<Prisma.PostCommentSelect>()({
  id: true,
  createdAt: true,
  updatedAt: true,
  comment: true,
  user: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      picture: true,
      gender: true,
    },
  },
})

export default commentSelector
