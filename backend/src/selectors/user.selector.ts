import { Prisma } from '@prisma/client'

export const userSelector = Prisma.validator<Prisma.UserSelect>()({
  email: true,
  firstName: true,
  lastName: true,
  picture: true,
})

export default userSelector
