import prisma from '../../prisma/PrismaClient'
import { LanguagesResponse } from '../types/language.model'

export const getAllLanguages = async (): Promise<LanguagesResponse[]> => {
  const languages = await prisma.language.findMany({
    select: {
      id: true,
      name: true,
      trip: true,
      users: true,
      _count: true,
    },
    orderBy:{
      id: 'desc'
    }
  })

  return languages.map((language: any) => ({
    id: language.id,
    name: language.name,
    tripCount: language.trip.length,
    userCount: language.users.length,
  }))
}

export const getAllTransports = async (): Promise<any[]> => {
  return await prisma.transport.findMany()
}

export const getAllCountries = async (): Promise<any[]> => {
  return await prisma.country.findMany({
    select: {
      id: true,
      name: true,
      code: true,
      _count: true,
    },
    orderBy:{
      id: 'asc'
    }
  })
}
