import prisma from "../../prisma/PrismaClient";
import {LanguagesResponse} from "../models/language.model";
import {Prisma} from "@prisma/client";

export const getAllLanguages = async (): Promise<LanguagesResponse[]> => {
  const languages = await prisma.language.findMany({
    select: {
      id: true,
      name: true,
      trip: true,
      users: true,
      _count: true
    }
  })

  return languages.map((language: any) => ({
    id: language.id,
    name: language.name,
    tripCount: language.trip.length,
    userCount: language.users.length,
  }));
};

export const getAllTransports = async (): Promise<any[]> => {
  return await prisma.transport.findMany()
};

export const getAllCountries = async (): Promise<any[]> => {
  return await prisma.countries.findMany({
    select: {
      id: true,
      name: true,
      code: true,
      _count: true
    }
  })
};

export const addNewLanguage = async (
  languagePayload: string[]
): Promise<Prisma.BatchPayload> => {
  return await prisma.language.createMany({
    data: languagePayload.map((language: any) => ({
      name: language
    })),
    skipDuplicates: true
  })
};

export const deleteLanguages = async (
  languagePayload: string[]
): Promise<Prisma.BatchPayload> => {
  return await prisma.language.deleteMany({
    where: {
      name: {
        in: languagePayload
      }
    }
  })
};

export const addNewCountry = async (
  countryPayload: { Code: string, Name: string }[]
): Promise<Prisma.BatchPayload> => {
  return await prisma.countries.createMany({
    data: countryPayload.map((country: any) => ({
      name: country.Name,
      code: country.Code
    })),
    skipDuplicates: true
  })
};

export const deleteCountries = async (
  countryPayload: string[]
): Promise<Prisma.BatchPayload> => {
  return await prisma.countries.deleteMany({
    where: {
      name: {
        in: countryPayload
      }
    }
  })
};
