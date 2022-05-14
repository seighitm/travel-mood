import prisma from "../../prisma/PrismaClient";
import {Prisma} from "@prisma/client";
import {isEmptyArray, isNullOrUndefined} from "../utils/primitive-checks";
import {TagsResponse} from "../models/tag.model";

export const getTags = async (query: { tagName: string } & any): Promise<TagsResponse[]> => {
  const queries: Array<Prisma.TagWhereInput> = [];

  if (!isNullOrUndefined(query.tagName) && !isEmptyArray(query.tagName)) {
    queries.push({
      name: {
        contains: query.tagName
      }
    });
  }

  return await prisma.tag.findMany({
    where: {
      AND: queries
    },
    select: {
      id: true,
      name: true,
      _count: true
    },
    orderBy: {
      articles: {
        _count: 'desc',
      },
    },
  });
};


export const getOneTag = async (tageName: string): Promise<{ id: number }> => {
  return await prisma.tag.findUnique({
    where: {
      name: tageName
    },
    select: {
      id: true,
    },
  });

};

export const deleteTag = async (tagsName: string[]): Promise<Prisma.BatchPayload> => {
  return await prisma.tag.deleteMany({
    where: {
      name: {
        in: tagsName
      }
    }
  });
};

