import prisma from '../../prisma/PrismaClient'
import ApiError from '../utils/api-error'
import {isNullOrUndefined} from "../utils/primitive-checks";

export const getNonReadMessages = async (
  userId: number | string
): Promise<any> => {
  if (isNullOrUndefined(userId)) {
    throw new ApiError(400, {message: 'User Id param not sent with request!'})
  }

  const messages = await prisma.message.findMany({
    where: {
      user: {
        id: {
          not: Number(userId),
        },
      },
      chat: {
        users: {
          some: {
            id: Number(userId),
          },
        },
      },
      readBy: {
        none: {
          id: Number(userId),
        },
      },
    },
    select: {
      id: true,
      chat: true,
      content: true,
      createdAt: true,
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          picture: {
            select: {
              image: true,
            },
          },
        },
      },
    },
  })
  return messages
}

export const getMessagesByChatId = async (
  chatId: number | string,
  userId: number | string,
  massagesCount: number | string | any
): Promise<any> => {
  const messages = await prisma.message.findMany({
    where: {
      chat: {
        id: Number(chatId),
      },
    },
    include: {
      chat: {
        select: {
          id: true,
        },
      },
      user: {
        select: {
          firstName: true,
          lastName: true,
          id: true,
          role: true,
          picture: {
            select: {
              id: true,
              image: true,
            },
          },
        },
      },
      lastChatMessage: true,
    },
    skip: massagesCount ? Number(massagesCount) - 15 : 0,
    take: -15,
  })

  return messages
}

export const createNewMessage = async (
  content: string,
  chatId: number | string,
  userId: number | string
): Promise<any> => {
  if (isNullOrUndefined(content) || isNullOrUndefined(chatId)) {
    throw new ApiError(400, {message: 'Invalid data passed into request!'})
  }

  const message = await prisma.message.create({
    data: {
      user: {
        connect: {
          id: Number(userId),
        },
      },
      content,
      chat: {
        connect: {
          id: Number(chatId),
        },
      },
      readBy: {
        connect: {
          id: Number(userId),
        },
      },
    },
    select: {
      id: true,
      content: true,
      readBy: true,
      lastChatMessage: true,
      chatId: true,
      createdAt: true,
      user: {
        select: {
          firstName: true,
          lastName: true,
          id: true,
          role: true,
          picture: {
            select: {
              id: true,
              image: true,
            },
          },
        },
      },
      chat: {
        include: {
          users: true,
        },
      },
    },
  })

  await prisma.chat.update({
    where: {
      id: Number(chatId),
    },
    data: {
      latestMessage: {
        connect: {
          id: message.id,
        },
      },
    },
    select: {
      messages: true,
    },
  })

  return message
}

export const readMessages = async (
  chatId: number | string,
  userId: number | string
): Promise<any> => {
  const messages = await prisma.message.findMany({
    where: {
      chat: {
        id: Number(chatId),
      },
      readBy: {
        none: {
          id: Number(userId),
        },
      },
    },
    select: {
      chatId: true,
      id: true,
      readBy: true,
    },
  })

  if (messages[messages.length - 1]) {
    for (let i = 0; i < messages.length; i++)
      await prisma.message.update({
        where: {
          id: messages[i].id,
        },
        data: {
          readBy: {
            connect: {
              id: Number(userId),
            },
          },
        },
      })
  }
  return messages
}
