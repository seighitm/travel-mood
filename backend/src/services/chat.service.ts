import {ArticleResponse} from "../models/article.model";
import ApiError from "../utils/api-error";
import prisma from "../../prisma/PrismaClient";
import {isEmptyArray, isNullOrUndefined} from "../utils/primitive-checks";
import {other_ReadMessage} from "./message.service";

export const findChatByQuery = async (
  chatPayload: any,
  userId: number
): Promise<any> => {
  return await prisma.chat.findFirst({
    where: {
      AND: [
        {isGroupChat: false},
        {users: {some: {id: {equals: Number(userId)}}}},
        {users: {some: {id: {equals: Number(chatPayload.userId)}}}}
      ]
    },
    select: {
      id: true,
      users: true,
      chatName: true,
      isGroupChat: true,
      groupAdmin: true,
      latestMessage: true
    }
  })
}

export const accessChat = async (
  chatPayload: any,
  userId: number,
): Promise<ArticleResponse> => {
  if (!chatPayload?.userId) {
    throw new ApiError(422, {message: "Person ID can't be blank"});
  }

  if (!userId) {
    throw new ApiError(400, {message: "UserId param not sent with request"});
  }

  const chat = await findChatByQuery(chatPayload, userId)

  if (chat) return {...chat, receiveUserId: chatPayload.userId}
  else return {...(await createChat(chatPayload, userId)), receiveUserId: chatPayload.userId}
};

export const getMyChats = async (
  userId: number,
): Promise<any> => {
  if (!userId) {
    throw new ApiError(400, {errors: {title: ["UserId param not sent with request"]}});
  }

  const chats = await prisma.chat.findMany({
    where: {
      users: {
        some: {
          id: {
            equals: Number(userId)
          }
        }
      }
    },
    orderBy: {
      id: 'asc'
    },
    select: {
      id: true,
      users: {
        include: {
          picture: true
        }
      },
      chatName: true,
      isGroupChat: true,
      groupAdmin: {
        select: {
          id: true
        }
      },
      latestMessage: true,
    }
  })

  // const ch = chats.map((item: any) => ({...item, chatName: item.users.find((u: any) => u.id != userId).firstName()}))

  for (let i = 0; i < chats.length; i++) {
    if (chats[i].isGroupChat == false)
      for (let j = 0; j < chats[i].users.length; j++) {
        if (chats[i].users[j].id != userId) {
          chats[i].chatName = chats[i].users[j].firstName
        }
      }
  }

  return chats
};

export const createChat = async (
  chatPayload: any,
  userId: number,
): Promise<any> => {
  const chat = await prisma.chat.create({
    data: {
      chatName: 'chatName',
      isGroupChat: false,
      users: {
        connect: [
          {id: Number(userId)},
          {id: Number(chatPayload.userId)}
        ],
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
      latestMessage: true
    }
  })
  return chat
}

export const createGroupChat = async (
  users: any[],
  chatName: string,
  userId: number,
): Promise<any> => {
  if (!userId) {
    throw new ApiError(400, {message: "UserId param not sent with request"});
  }

  if (!chatName) {
    throw new ApiError(400, {message: "ChatName can't be blank"});
  }

  if (!users) {
    throw new ApiError(400, {message: "USERS field can't be blank"});
  }

  if (users.length < 2) {
    throw new ApiError(400, {message: "More than 2 users are required to form a group chat"});
  }

  users.push(userId);

  return await prisma.chat.create({
    data: {
      chatName: chatName,
      isGroupChat: true,
      users: {connect: users?.map(item => ({id: item})) || []},
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
      latestMessage: true
    }
  })
};

export const updateGroupChatName = async (
  chatName: string,
  chatId: number,
  userId: number,
): Promise<any> => {
  if (!userId) {
    throw new ApiError(400, {message: "UserId param not sent with request"});
  }

  if (!chatName) {
    throw new ApiError(400, {message: "ChatName can't be blank"});
  }

  const chat = await prisma.chat.findFirst({
    where:{
      id: Number(chatId),
      groupAdmin:{
        id: Number(userId)
      }
    },
    select:{
      id: true
    }
  })

  if (isNullOrUndefined(chat)) {
    throw new ApiError(400, {message: "You not Admin of this chat!"});
  }

  return await prisma.chat.update({
    where: {
      id: chatId
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
    }
  })
};

export const deleteGroupChat = async (
  chatId: number,
  userId: number,
): Promise<any> => {
  if (!userId) {
    throw new ApiError(400, {message: "UserId param not sent with request"});
  }

  const chatUsers = await prisma.chat.findUnique({
    where: {id: chatId},
    select: {users: true}
  })

  const newUsers: any = chatUsers?.users
    ?.filter(item => item.id !== userId)
    .map((user: any) => ({id: user.id}))

  return await prisma.chat.update({
    where: {
      id: chatId
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
      latestMessage: true
    }
  })
};

export const addUsersToGroupChat = async (
  {
    chatId,
    usersId,
  }: any
): Promise<any> => {
  if (isNullOrUndefined(usersId) || isEmptyArray(usersId)) {
    throw new ApiError(400, {message: "UserId param not sent with request"});
  }

  const chatUsers = await prisma.chat.findMany({
    where: {
      id: chatId
    },
    select: {
      id: true,
    }
  })

  if (!chatUsers) {
    throw new ApiError(400, {message: "Chat not found!"});
  }

  const chat = await prisma.chat.update({
    where: {
      id: chatId
    },
    data: {
      users: {
        connect: usersId.map((usId: any) => ({id: usId})),
      },
    },
    select: {
      id: true,
      users: true,
      chatName: true,
      isGroupChat: true,
      groupAdmin: true,
      latestMessage: true
    }
  })

  for (let i = 0; i < usersId.length; i++)
    await other_ReadMessage(chatId, usersId[i])

  return {
    ...chat,
    newUsers: usersId
  }
};


// #################################################3
// #################################################3
// #################################################3


export const removeUsersFromGroupChat = async (
  {
    chatId,
    usersId,
  }: any
): Promise<any> => {
  if (isNullOrUndefined(usersId) || isEmptyArray(usersId)) {
    throw new ApiError(400, {message: "UserId param not sent with request"});
  }

  const chatUsers = await prisma.chat.findMany({
    where: {
      id: chatId
    },
    select: {
      id: true,
    }
  })

  if (!chatUsers) {
    throw new ApiError(400, {message: "Chat not found!"});
  }

  const chat = await prisma.chat.update({
    where: {
      id: chatId
    },
    data: {
      users: {
        disconnect: usersId.map((usId: any) => ({id: usId})),
      },
    },
    select: {
      id: true,
      users: true,
      chatName: true,
      isGroupChat: true,
      groupAdmin: true,
      latestMessage: true
    }
  })

  return {
    ...chat,
    newUsers: usersId
  }
};






// #################################################3
// #################################################3
// #################################################3


export const getChats = async (
  userId: number,
): Promise<ArticleResponse> => {
  if (!userId) {
    throw new ApiError(400, {message: "UserId param not sent with request"});
  }

  const chats = await getMyChats(userId)

  // if (chats) {
  //   for (let i = 0; i < chats.length; i++) {
  //     let c = 0;
  //     for (let j = 0; j < chats[i].messageNotification.length; j++) {
  //       if (chats[i].messageNotification[j].userId == userId) {
  //         c += 1
  //       }
  //     }
  //     // @ts-ignore
  //     chats[i].countNonReadmessages = c
  //   }
  // }
  return chats
};
