import prisma from '../../prisma/PrismaClient'
import ApiError from '../utils/api-error'
import {UserCreatePayload, UserIdEmail, UserLofinResponse, UserLoginPayload, UserResponse,} from '../types/user.model'
import bcrypt from 'bcryptjs'
import {generateTokens, saveToken} from './token.service'
import {forgotMessage} from '../utils/templates/emailTemplatesForgotPassword'
import {sendEmail} from '../utils/nodemailer'
import {ACTIVATED_STATUS_ENUM, RoleEnum} from '../types/enums'
import {isEmptyObject, isNullOrUndefined} from '../utils/primitive-checks'
import {mailValidator, passwordValidator, UserPayloadValidator} from '../validators/user.validator'
//@ts-ignore
import {nanoid} from 'nanoid'

export enum ROLE {
  USER = 'USER',
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR',
}

export const createUser = async (input: UserCreatePayload | any, profileImage: any): Promise<UserResponse | any> => {
  const accountDataPayload = {
    email: input.email?.trim(),
    firstName: input.firstName?.trim(),
    lastName: input.lastName?.trim(),
    password: input.password?.trim(),
  }

  UserPayloadValidator({
    country: input.country.trim(),
    birthday: input.birthday,
    languages: input.languages,
    gender: input.gender,
    relationshipStatus: input.relationshipStatus,
    accountDataPayload: accountDataPayload,
  })

  await checkUserUniquenessByEmail(accountDataPayload.email)

  const hashedPassword = await bcrypt.hash(accountDataPayload.password, 10)

  const user = await prisma.user.create({
    data: {
      firstName: accountDataPayload.firstName,
      lastName: accountDataPayload.lastName,
      email: accountDataPayload.email,
      password: hashedPassword,
      gender: {
        connect: {
          gender: input.gender,
        },
      },
      birthday: new Date(input.birthday).toISOString(),
      ...(!isNullOrUndefined(input?.relationshipStatus) && !['', 'null'].includes(input?.relationshipStatus)
        ? {
          relationshipStatus: {
            connect: {
              status: input?.relationshipStatus,
            },
          },
        }
        : {}),
      ...(!isNullOrUndefined(profileImage) && !isEmptyObject(profileImage)
        ? {
          picture: {
            connectOrCreate: {
              where: {
                image: profileImage[process.env.NODE_ENV == 'PRODUCTION' ? 'key' : 'filename'],
              },
              create: {
                image: profileImage[process.env.NODE_ENV == 'PRODUCTION' ? 'key' : 'filename'],
              },
            },
          },
          images: {
            connectOrCreate: {
              where: {
                image: profileImage[process.env.NODE_ENV == 'PRODUCTION' ? 'key' : 'filename'],
              },
              create: {
                image: profileImage[process.env.NODE_ENV == 'PRODUCTION' ? 'key' : 'filename'],
              },
            },
          },
        }
        : {}),
      role: {
        connect: {
          role: RoleEnum.USER,
        },
      },
      languages: {
        connect: input?.languages.map((item: any) => ({name: item})),
      },
      country: {
        connect: {
          code: input?.country,
        },
      },
    },
    select: {
      id: true,
      role: {
        select: {
          role: true,
        },
      },
    },
  })

  console.log(user)

  await saveToken(user.id, generateTokens(user).refreshToken)

  return {
    id: user.id,
    role: user.role.role,
    accessToken: generateTokens(user).accessToken,
    refreshToken: generateTokens(user).refreshToken,
  }
}

export const getCurrentUser = async (userId: number): Promise<UserResponse> => {
  if (!isNullOrUndefined(userId)) {
    const user = await prisma.user.findFirst({
      where: {
        id: Number(userId),
      },
      include: {
        role: {
          select: {
            role: true,
          },
        },
        relationshipStatus: {
          select: {
            status: true,
          },
        },
        picture: true,
        country: true,
        languages: true,
        gender: {
          select: {
            gender: true,
          },
        },
        // chats: {
        //   select: {id: true}
        // }
      },
    })

    return {
      ...user,
      role: user?.role.role,
      accessToken: generateTokens(user).accessToken,
      refreshToken: generateTokens(user).refreshToken,
    }
  } else {
    return null
  }

}

const checkUserUniquenessByEmail = async (email: string): Promise<void> => {
  const existingUserByEmail = await prisma.user.findUnique({
    where: {
      email: email,
    },
    select: {
      id: true,
    },
  })

  if (!isNullOrUndefined(existingUserByEmail)) {
    throw new ApiError(422, {message: 'Email has already been taken!'})
  }
}

export const login = async (userPayload: UserLoginPayload): Promise<UserLofinResponse> => {
  const payload = {
    email: userPayload.email.trim(),
    password: userPayload.password.trim(),
  }

  Object.entries(payload).forEach((entry: any) => {
    if (!entry[1]) throw new ApiError(422, {message: entry[0].toUpperCase() + " can't be blank"})
  })

  mailValidator(payload.email)
  passwordValidator(payload.password)

  const user = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      password: true,
      picture: true,
      blockExpiration: true,
      activatedStatus: true,
      role: {
        select: {
          role: true,
        },
      },
    },
  })

  if (!isNullOrUndefined(user)) {
    if (
      user?.activatedStatus.toString() == ACTIVATED_STATUS_ENUM.BLOCKED &&
      new Date() < new Date(user?.blockExpiration)
    ) {
      throw new ApiError(422, {message: 'Account is blocked!'})
    }

    if (user?.activatedStatus == ACTIVATED_STATUS_ENUM.BLOCKED) {
      await prisma.user.update({
        where: {id: user.id},
        data: {
          activatedStatus: ACTIVATED_STATUS_ENUM.ACTIVATED.toString(),
          blockExpiration: null,
        },
      })
    }

    const match = await bcrypt.compare(payload.password, user.password)

    await saveToken(user.id, generateTokens(user).refreshToken)

    if (match) {
      return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role.role,
        picture: user.picture,
        accessToken: generateTokens(user).accessToken,
        refreshToken: generateTokens(user).refreshToken,
      }
    }
  }

  throw new ApiError(403, {message: 'Email or Password is invalid'})
}

export const forgotPassword = async (email: string): Promise<UserIdEmail> => {
  mailValidator(email)

  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
    select: {
      email: true,
      id: true,
    },
  })

  if (isNullOrUndefined(user)) {
    throw new ApiError(404, {message: 'No email could not be send'})
  }

  const resetToken: string = nanoid()

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      resetPasswordToken: resetToken,
      resetPasswordExpire: new Date(Date.now() + 10 * (60 * 1000)),
    },
  })

  const resetUrl = `${process.env.CLIENT_URL}auth/reset-password/${resetToken}`

  const message = forgotMessage(resetUrl, user)

  const result = sendEmail({
    to: user.email,
    subject: 'Password Reset Request',
    text: message,
  })

  if (await result) return user
  return null
}

export const resetPassword = async (password: string, resetToken: string): Promise<UserIdEmail> => {
  passwordValidator(password)

  if (!resetToken) {
    throw new ApiError(400, {message: 'Invalid Request'})
  }

  const user = await prisma.user.findFirst({
    where: {
      AND: [
        {
          resetPasswordToken: resetToken,
        },
        {
          resetPasswordExpire: {
            gt: new Date(Date.now()),
          },
        },
      ],
    },
    select: {
      id: true,
      email: true,
    },
  })

  if (isNullOrUndefined(user)) {
    throw new ApiError(400, {message: 'Invalid Token or expired'})
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpire: null,
    },
  })

  return user
}
