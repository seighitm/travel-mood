import prisma from '../../prisma/PrismaClient'
import {isEmptyArray, isEmptyString, isNullOrUndefined} from '../utils/primitive-checks'
import {getUsersQuery} from './article.service'
import {Prisma} from '@prisma/client'
import ApiError from '../utils/api-error'
import {UserSwitchRoleResponse} from "../types/user.model";
import {ROLE} from "./auth.service";
import {emailTemplateBlockAccount} from "../utils/templates/emailTemplateBlockAccount";
import {sendEmail} from "../utils/nodemailer";
import {emailTemplateActivateAccount} from "../utils/templates/emailTemplateActivateAccount";
import IComplaint from "../types/complaints.model";

export const switchRole = async (
  userId: any
): Promise<UserSwitchRoleResponse> => {
  const userDb = await prisma.user.findUnique({
    where: {
      id: Number(userId),
    },
    select: {
      role: {
        select: {
          role: true,
        },
      },
    },
  })

  if (!isNullOrUndefined(userDb) && userDb.role.role == ROLE.ADMIN) {
    throw new ApiError(422, {message: 'The role of the administrator cannot be changed!'})
  }

  return await prisma.user.update({
    where: {
      id: Number(userId),
    },
    data: {
      role: {
        connect: {
          role: userDb.role.role == ROLE.USER ? ROLE.MODERATOR : ROLE.USER,
        },
      },
    },
    include: {
      picture: true,
      role: {
        select: {
          role: true,
        },
      },
    },
  })
}

export const adminUsers = async (
  {sortBy, order, search, limit, page}: any,
  userId: string | number
): Promise<any> => {
  const activePage = (Number(page) - 1) * limit || 0
  const count = await prisma.user.count({
    where: {
      id: {
        not: Number(userId),
      },
    },
  })

  const users = await prisma.user.findMany({
    where: {
      id: {
        not: Number(userId),
      },
      ...(!isNullOrUndefined(search) && !isEmptyString(search)
        ? {
          OR: [
            {
              email: {
                contains: search,
                mode: 'insensitive',
              },
            },
            {
              OR: [
                {
                  firstName: {
                    contains: search?.split(' ')[0],
                    mode: 'insensitive',
                  },
                },
                {
                  firstName: {
                    contains: search?.split(' ')[1] ?? search?.split(' ')[0],
                    mode: 'insensitive',
                  },
                },
              ],
            },
            {
              OR: [
                {
                  lastName: {
                    contains: search?.split(' ')[0],
                    mode: 'insensitive',
                  },
                },
                {
                  lastName: {
                    contains: search?.split(' ')[1] ?? search?.split(' ')[0],
                    mode: 'insensitive',
                  },
                },
              ],
            },
          ],
        }
        : {}),
    },
    select: {
      id: true,
      email: true,
      picture: {
        select: {
          image: true,
        },
      },
      role: {
        select: {
          role: true,
        },
      },
      firstName: true,
      lastName: true,
      activatedStatus: true,
      rating: true,
      _count: {
        select: {
          articles: true,
          trips: true,
        },
      },
    },
    ...(sortBy == 'email' && order != 'none' ? {orderBy: {email: order}} : {}),
    ...(sortBy == 'name' && order != 'none' ? {orderBy: {firstName: order}} : {}),
    ...(sortBy == 'id' && order != 'none' ? {orderBy: {id: order}} : {}),
    ...(sortBy == 'rating' && order != 'none' ? {orderBy: {rating: order}} : {}),
    skip: activePage,
    take: Number(limit),
  })

  return {
    users: users.map((user: any) => ({
      id: user.id,
      name: `${user.firstName}`,
      email: user.email,
      rating: user.rating,
      role: user.role,
      activatedStatus: user.activatedStatus,
      articlesCount: user._count.articles,
      tripsCount: user._count.trips,
    })),
    count: count,
  }
}

export const getAllComplaint = async (
  status: string
): Promise<IComplaint[]> => {
  return await prisma.complaint.findMany({
    ...(status === 'ALL' ? {} : {where: {status: status}}),
    include: {
      user: {
        select: {
          id: true,
          picture: true,
          firstName: true,
          lastName: true,
        },
      },
      profile: {
        select: {
          id: true,
          picture: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  })
}

export const closeComplaint = async (
  complaintId: number | string
): Promise<IComplaint> => {
  const complaint = await prisma.complaint.update({
    where: {
      id: Number(complaintId),
    },
    data: {
      status: 'CLOSED',
    },
    include: {
      user: {
        select: {
          id: true,
          picture: true,
          firstName: true,
          lastName: true,
        },
      },
      profile: {
        select: {
          id: true,
          picture: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  })
  return complaint
}

export const adminArticles = async (
  {search, sortBy, order, limit, page}: any
): Promise<any> => {
  const activePage = (Number(page) - 1) * limit || 0
  const totalArticlesCount = await prisma.article.count({
    where: {
      OR: [
        {
          title: {
            contains: search,
          },
        },
        getUsersQuery(search),
      ],
    },
  })

  const articles = await prisma.article.findMany({
    where: {
      OR: [
        {
          title: {
            contains: search,
            mode: 'insensitive',
          },
        },
        getUsersQuery(search),
      ],
    },
    select: {
      id: true,
      title: true,
      createdAt: true,
      comments: true,
      author: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          picture: true,
        },
      },
      favoritedBy: {
        select: {
          id: true,
        },
      },
    },
    ...(sortBy == 'date' && order != 'none' ? {orderBy: {createdAt: order}} : {}),
    ...(sortBy == 'likes' && order != 'none' ? {orderBy: {favoritedBy: {_count: order}}} : {}),
    ...(sortBy == 'comments' && order != 'none' ? {orderBy: {comments: {_count: order}}} : {}),
    ...(sortBy == 'author' && order != 'none' ? {orderBy: {author: {firstName: order}}} : {}),
    ...(sortBy == 'title' && order != 'none' ? {orderBy: {title: order}} : {}),
    skip: activePage,
    take: Number(limit),
  })

  return {
    articles: articles.map((article) => ({
      id: article.id,
      title: article.title,
      author: article.author.firstName,
      authorId: article.author.id,
      date: article.createdAt,
      likes: article.favoritedBy.length,
      comments: article.comments.length,
    })),
    count: totalArticlesCount,
  }
}

export const blockUserProfile = async (
  profileId: string | number,
  {expiredBlockDate, reason}: any,
  userId: string | number,
  role: string
): Promise<any> => {
  if (!isNullOrUndefined(role) && role !== ROLE.ADMIN) {
    throw new ApiError(422, {message: 'You are not an administrator!'})
  }

  if (!isNullOrUndefined(userId) && userId == profileId) {
    throw new ApiError(422, {message: "You can't block your personal profile!"})
  }

  const user = await prisma.user.findUnique({
    where: {
      id: Number(profileId),
    },
    select: {
      email: true,
      firstName: true,
      role: {
        select: {
          role: true
        }
      }
    }
  })

  if (isNullOrUndefined(user)) {
    throw new ApiError(422, {message: 'User not found!'})
  }

  if (isNullOrUndefined(expiredBlockDate)) {
    throw new ApiError(422, {message: 'You did not enter the date!'})
  }

  if (!isNullOrUndefined(user) && user.role.role == ROLE.ADMIN) {
    throw new ApiError(422, {message: 'Administrator cannot be blocked!'})
  }

  await prisma.user.update({
    where: {id: Number(profileId)},
    data: {
      activatedStatus: 'BLOCKED',
      blockExpiration: new Date(expiredBlockDate),
    },
  })

  const message = emailTemplateBlockAccount(
    user.firstName,
    !isNullOrUndefined(reason) && !isEmptyString(reason) ? reason : ''
  )

  const result = sendEmail({
    to: user.email,
    subject: 'Block account',
    text: message,
  })

  if (await result) return user
  return null
}

export const activateUserProfile = async (profileId: string | number, role: string): Promise<any> => {
  if (!isNullOrUndefined(role) && role !== ROLE.ADMIN) {
    throw new ApiError(422, {message: 'You are not an administrator!'})
  }

  const user = await prisma.user.findUnique({
    where: {
      id: Number(profileId),
    },
  })

  if (isNullOrUndefined(user)) {
    throw new ApiError(422, {message: 'User not found!'})
  }

  await prisma.user.update({
    where: {id: Number(profileId)},
    data: {
      activatedStatus: 'ACTIVATED',
      blockExpiration: null,
    },
  })

  const message = emailTemplateActivateAccount(user.firstName)

  const result = sendEmail({
    to: user.email,
    subject: 'Activate account',
    text: message,
  })

  if (await result) return user
  return null
}

export const adminTrips = async (
  {search, sortBy, order, limit, page}: any
): Promise<any> => {
  const activePage = (Number(page) - 1) * limit || 0
  const totalTripsCount = await prisma.trip.count({
    where: {
      OR: [
        {
          title: {
            contains: search,
          },
        },
        getUsersQueryForTrips(search),
      ],
    },
  })

  const trips = await prisma.trip.findMany({
    where: {
      OR: [
        {
          title: {
            contains: search,
            mode: 'insensitive',
          },
        },
        getUsersQueryForTrips(search),
      ],
    },
    select: {
      id: true,
      title: true,
      createdAt: true,
      comments: {
        select: {
          id: true,
        },
      },
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          picture: true,
        },
      },
      favoritedBy: {
        select: {
          id: true,
        },
      },
    },
    ...(sortBy == 'date' && order != 'none' ? {orderBy: {createdAt: order}} : {}),
    ...(sortBy == 'likes' && order != 'none' ? {orderBy: {favoritedBy: {_count: order}}} : {}),
    ...(sortBy == 'comments' && order != 'none' ? {orderBy: {comments: {_count: order}}} : {}),
    ...(sortBy == 'author' && order != 'none' ? {orderBy: {user: {firstName: order}}} : {}),
    ...(sortBy == 'title' && order != 'none' ? {orderBy: {title: order}} : {}),
    skip: activePage,
    take: Number(limit),
  })
  return {
    trips: trips.map((trip: any) => ({
      ...trip,
      date: trip.createdAt,
      author: `${trip?.user?.firstName}`,
      likes: trip?.favoritedBy.length,
      comments: trip?.comments?.length,
    })),
    count: totalTripsCount,
    tripsOnPageCount: trips.length,
  }
}

export const setTagsStatus = async (
  tagsId: string[] | number[],
  status: string
): Promise<Prisma.BatchPayload> => {
  if (isNullOrUndefined(tagsId) && isEmptyArray(tagsId)) {
    throw new ApiError(422, {message: 'No tags selected!'})
  } else if (isNullOrUndefined(status) && status != 'ACTIVATED' && status != 'BLOCKED') {
    throw new ApiError(422, {message: 'Status not specified!'})
  }

  return await prisma.tag.updateMany({
    where: {
      id: {
        in: tagsId?.map((item: any) => Number(item)),
      },
    },
    data: {
      status: status,
    },
  })
}

export const deleteTags = async (
  tagsName: string[]
): Promise<Prisma.BatchPayload> => {
  return await prisma.tag.deleteMany({
    where: {
      name: {
        in: tagsName,
      },
    },
  })
}

export const getUsersQueryForTrips = (search: string) => {
  return {
    OR: [
      {
        OR: [
          {
            user: {
              firstName: {
                contains: search?.split(' ')[0],
              },
            },
          },
          {
            user: {
              firstName: {
                contains: search?.split(' ')[1] ?? search?.split(' ')[0],
              },
            },
          },
        ],
      },
      {
        OR: [
          {
            user: {
              lastName: {
                contains: search?.split(' ')[0],
              },
            },
          },
          {
            user: {
              lastName: {
                contains: search?.split(' ')[1] ?? search?.split(' ')[0],
              },
            },
          },
        ],
      },
    ],
  }
}
