import { Prisma } from '@prisma/client'

export const articleSelector = Prisma.validator<Prisma.ArticleSelect>()({
  id: true,
  title: true,
  isUpdatedByAdmin: true,
  countries: true,
  body: true,
  createdAt: true,
  updatedAt: true,
  images: true,
  primaryImage: true,
  comments: {
    orderBy: {
      id: 'desc',
    },
    select: {
      user: {
        select: {
          firstName: true,
          lastName: true,
          picture: true,
          id: true,
          gender: true,
          followedBy: true,
        },
      },
      id: true,
      comment: true,
      createdAt: true,
      updatedAt: true,
    },
  },
  tagList: {
    select: {
      name: true,
    },
  },
  favoritedBy: {
    include: {
      picture: {
        select: {
          image: true,
        },
      },
    },
  },
  author: {
    select: {
      id: true,
      picture: true,
      followedBy: true,
      gender: true,
      firstName: true,
      lastName: true,
    },
  },
  _count: {
    select: {
      favoritedBy: true,
    },
  },
})

export const articlesSelector = Prisma.validator<Prisma.ArticleSelect>()({
  id: true,
  title: true,
  isUpdatedByAdmin: true,
  countries: true,
  createdAt: true,
  updatedAt: true,
  primaryImage: true,
  comments: {
    select: {
      id: true,
    },
  },
  tagList: {
    select: {
      name: true,
      status: true,
    },
  },
  favoritedBy: true,
  author: {
    select: {
      id: true,
      picture: true,
      followedBy: true,
      gender: true,
      firstName: true,
      lastName: true,
    },
  },
  _count: {
    select: {
      favoritedBy: true,
    },
  },
})
