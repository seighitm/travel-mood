import ApiError from '../utils/api-error'
import prisma from '../../prisma/PrismaClient'
import {isEmptyArray, isEmptyString, isNullOrUndefined} from '../utils/primitive-checks'
import {readMessages} from './message.service'
import {IChat} from "../types/chat.model";
import {nanoid} from "nanoid";

export const findChatByQuery = async (
  chatPayload: any,
  userId: number
): Promise<IChat> => {
  return await prisma.chat.findFirst({
    where: {
      AND: [
        {isGroupChat: false},
        {users: {some: {id: {equals: Number(userId)}}}},
        {users: {some: {id: {equals: Number(chatPayload.userId)}}}},
      ],
    },
    select: {
      id: true,
      users: true,
      chatName: true,
      isGroupChat: true,
      groupAdmin: true,
      latestMessage: true,
    },
  })
}

export const accessChat = async (
  chatPayload: any,
  userId: number
): Promise<IChat> => {
  if (isNullOrUndefined(chatPayload?.userId)) {
    throw new ApiError(422, {message: "Person ID can't be blank"})
  }

  if (isNullOrUndefined(userId)) {
    throw new ApiError(400, {message: 'UserId param not sent with request'})
  }

  const chat = await findChatByQuery(chatPayload, userId)

  if (!isNullOrUndefined(chat)) {
    return {...chat, receiveUserId: chatPayload.userId}
  } else {
    return {...(await createChat(chatPayload, userId)), receiveUserId: chatPayload.userId}
  }
}

export const getMyChats = async (
  userId: number
): Promise<IChat[]> => {
  if (isNullOrUndefined(userId)) {
    throw new ApiError(400, {message: 'UserId param not sent with request'})
  }

  const chats = await prisma.chat.findMany({
    where: {
      users: {
        some: {
          id: {
            equals: Number(userId),
          },
        },
      },
    },
    orderBy: {
      id: 'asc',
    },
    select: {
      id: true,
      users: {
        include: {
          picture: true,
        },
      },
      chatName: true,
      isGroupChat: true,
      groupAdmin: {
        select: {
          id: true,
        },
      },
      latestMessage: true,
    },
  })

  for (let i = 0; i < chats.length; i++) {
    if (chats[i].isGroupChat == false)
      for (let j = 0; j < chats[i].users.length; j++) {
        if (chats[i].users[j].id != userId) {
          chats[i].chatName = chats[i].users[j].firstName
        }
      }
  }

  return chats
}

export const createChat = async (
  chatPayload: any,
  userId: number | string
): Promise<any> => {
  const chat = await prisma.chat.create({
    data: {
      chatName: nanoid(6),
      isGroupChat: false,
      users: {
        connect: [{id: Number(userId)}, {id: Number(chatPayload.userId)}],
      },
      groupAdmin: {
        connect: {
          id: Number(userId),
        },
      },
    },
    select: {
      id: true,
      users: true,
      chatName: true,
      isGroupChat: true,
      groupAdmin: true,
      latestMessage: true,
    },
  })
  return chat
}

export const createGroupChat = async (
  users: string[] | number[] | any,
  chatName: string,
  userId: number | string
): Promise<IChat> => {
  if (isNullOrUndefined(userId)) {
    throw new ApiError(400, {message: 'User Id param not sent with request'})
  }

  if (isNullOrUndefined(chatName) || isEmptyString(chatName)) {
    throw new ApiError(400, {message: "Chat name can't be blank"})
  }

  if (isNullOrUndefined(users)) {
    throw new ApiError(400, {message: "USERS field can't be blank"})
  }

  if (users.length < 1) {
    throw new ApiError(400, {message: 'More than 1 users are required to form a group chat'})
  }

  users.push(userId)

  return await prisma.chat.create({
    data: {
      chatName: chatName,
      isGroupChat: true,
      users: {connect: users?.map((item) => ({id: item})) || []},
      groupAdmin: {
        connect: {
          id: Number(userId),
        },
      },
    },
    select: {
      id: true,
      users: true,
      chatName: true,
      isGroupChat: true,
      groupAdmin: true,
      latestMessage: true,
    },
  })
}

export const updateGroupChatName = async (
  chatName: string,
  chatId: number,
  userId: number
): Promise<IChat> => {
  if (isNullOrUndefined(userId)) {
    throw new ApiError(400, {message: 'User Id param not sent with request'})
  }

  if (isNullOrUndefined(chatName) || isEmptyString(chatName)) {
    throw new ApiError(400, {message: "Chat name can't be blank"})
  }

  const chat = await prisma.chat.findFirst({
    where: {
      id: Number(chatId),
      groupAdmin: {
        id: Number(userId),
      },
    },
    select: {
      id: true,
    },
  })

  if (isNullOrUndefined(chat)) {
    throw new ApiError(400, {message: 'You not Admin of this chat!'})
  }

  return await prisma.chat.update({
    where: {
      id: chatId,
    },
    data: {
      chatName,
    },
    select: {
      id: true,
      users: true,
      chatName: true,
      isGroupChat: true,
      groupAdmin: true,
      latestMessage: true,
    },
  })
}

export const deleteGroupChat = async (
  chatId: number,
  userId: number
): Promise<IChat> => {
  if (isNullOrUndefined(userId)) {
    throw new ApiError(400, {message: 'User Id param not sent with request'})
  }

  const chatUsers = await prisma.chat.findUnique({
    where: {id: chatId},
    select: {users: true},
  })

  const newUsers: any = chatUsers?.users?.filter((item) => item.id !== userId).map((user: any) => ({id: user.id}))

  return await prisma.chat.update({
    where: {
      id: chatId,
    },
    data: {
      users: {set: newUsers || []},
    },
    select: {
      id: true,
      users: true,
      chatName: true,
      isGroupChat: true,
      groupAdmin: true,
      latestMessage: true,
    },
  })
}

export const addUsersToGroupChat = async (
  {chatId, usersId}: { chatId: string | number, usersId: string[] | number[] }
): Promise<IChat> => {
  if (isNullOrUndefined(usersId) || isEmptyArray(usersId)) {
    throw new ApiError(400, {message: 'UserId param not sent with request'})
  }

  const chatUsers = await prisma.chat.findMany({
    where: {
      id: Number(chatId),
    },
    select: {
      id: true,
    },
  })

  if (isNullOrUndefined(chatUsers)) {
    throw new ApiError(400, {message: 'Chat not found!'})
  }

  const chat = await prisma.chat.update({
    where: {
      id: Number(chatId),
    },
    data: {
      users: {
        connect: usersId.map((usId: any) => ({id: Number(usId)})),
      },
    },
    select: {
      id: true,
      users: true,
      chatName: true,
      isGroupChat: true,
      groupAdmin: true,
      latestMessage: true,
    },
  })

  for (let i = 0; i < usersId.length; i++) {
    await readMessages(chatId, usersId[i])
  }

  return {
    ...chat,
    newUsers: usersId,
  }
}

export const removeUsersFromGroupChat = async (
  {chatId, usersId}: { chatId: string | number, usersId: string[] | number[] }
): Promise<IChat> => {
  if (isNullOrUndefined(usersId) || isEmptyArray(usersId)) {
    throw new ApiError(400, {message: 'UserId param not sent with request'})
  }

  const chatUsers = await prisma.chat.findMany({
    where: {
      id: Number(chatId),
    },
    select: {
      id: true,
    },
  })

  if (!chatUsers) {
    throw new ApiError(400, {message: 'Chat not found!'})
  }

  const chat = await prisma.chat.update({
    where: {
      id: Number(chatId),
    },
    data: {
      users: {
        disconnect: usersId.map((usId: any) => ({id: Number(usId)})),
      },
    },
    select: {
      id: true,
      users: true,
      chatName: true,
      isGroupChat: true,
      groupAdmin: true,
      latestMessage: true,
    },
  })

  return {
    ...chat,
    newUsers: usersId,
  }
}
