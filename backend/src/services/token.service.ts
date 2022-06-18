import jwt from 'jsonwebtoken'
import {User} from '../types/user.model'
import prisma from '../../prisma/PrismaClient'
import {GenerateTokenResponse, SaveTokenResponse} from '../types/token.model'
import ApiError from '../utils/api-error'

const dotenv = require('dotenv')
dotenv.config()

export const saveToken = async (
  userId: number,
  refreshToken: string
): Promise<SaveTokenResponse> => {
  return await prisma.refreshToken.upsert({
    where: {
      userId: userId,
    },
    update: {
      token: refreshToken,
    },
    create: {
      userId: userId,
      token: refreshToken,
    },
    select: {
      token: true,
      userId: true,
    },
  })
}

export const generateTokens = (
  user: Partial<User>
): GenerateTokenResponse => {
  const accessToken = jwt.sign({...user, role: user?.role.role}, process.env.ACCESS_TOKEN, {expiresIn: '60d'})
  const refreshToken = jwt.sign({...user, role: user?.role.role}, process.env.REFRESH_TOKEN, {expiresIn: '60d'})
  return {
    accessToken,
    refreshToken,
  }
}

export const validateAccessToken = (
  token: string
): any => {
  try {
    return jwt.verify(token, process.env.ACCESS_TOKEN)
  } catch (e) {
    console.log(e)
    return null
  }
}

export const validateRefreshToken = (token: any) => {
  try {
    return jwt.verify(token, process.env.REFRESH_TOKEN)
  } catch (e) {
    console.log(e)
    return null
  }
}

export const refreshTokenService = async (
  refreshToken: string
) => {
  if (!refreshToken) {
    throw new ApiError(404, {message: 'Error refresh token!'})
  }

  const userData: any = validateRefreshToken(refreshToken)

  const tokenFromDb = await prisma.refreshToken.findUnique({
    where: {token: refreshToken},
  })

  if (!userData || !tokenFromDb) {
    throw new ApiError(404, {message: 'Error refresh token!'})
  }

  const user = await prisma.user.findUnique({
    where: {id: userData.id},
    select: {
      id: true,
      email: true,
      password: true,
      picture: true,
      role: {
        select: {
          role: true,
        },
      },
    },
  })

  const tokens: { accessToken: string; refreshToken: string } = generateTokens(user)

  await saveToken(user.id, tokens.refreshToken)

  return {...tokens, user}
}

export const removeToken = async (refreshToken: string) => {
  return await prisma.refreshToken.delete({where: {token: refreshToken}})
}

export const findToken = async (refreshToken: string) => {
  return await prisma.refreshToken.findUnique({where: {token: refreshToken}})
}
