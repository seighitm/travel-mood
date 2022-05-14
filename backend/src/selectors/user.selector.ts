import {Prisma} from "@prisma/client";

export const userSelector = Prisma.validator<Prisma.UserSelect>()({
  email: true,
  name: true,
  picture: true,
});

export default userSelector;
