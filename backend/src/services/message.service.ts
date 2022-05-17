import prisma from "../../prisma/PrismaClient";
import ApiError from "../utils/api-error";

export const readMessages = async (
  firstMessageId: number | string,
  chatId: number | string,
  userId: number | string,
): Promise<any> => {
  if (firstMessageId) {
    const messages = await prisma.message.findMany({
      where: {
        id: {
          gt: Number(firstMessageId)
        },
        chat: {
          id: Number(chatId)
        }
      },
      select: {
        id: true
      }
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
                id: Number(userId)
              }
            }
          }
        })
    }
    return messages
  }
  return []
}

export const getNonReadMessages = async (
  userId: number | string,
): Promise<any> => {
  const messages = await prisma.message.findMany({
    where: {
      user: {
        id: {
          not: Number(userId)
        }
      },
      chat: {
        users: {
          some: {
            id: Number(userId)
          }
        }
      },
      readBy: {
        none: {
          id: Number(userId)
        }
      }
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
          lastName: true
        }
      }
    }
  })
  return messages
}

// export const getMessagesByChatId = async (
//   chatId: number | string,
//   userId: number | string,
//   page: any
// ): Promise<any> => {
//   console.log(page)
//   const totalTripsCount = await prisma.trip.count()
//   console.log('==============')
//   console.log(page)
//
//
//   const messagesCount = await prisma.message.count({
//     where:{
//       chat: {
//         id: Number(chatId)
//       }
//     }
//   })
//   console.log(messagesCount)
//   console.log(Math.ceil(messagesCount / 12))
//   const activePage = messagesCount- (Number(page)) * 12 || 0
//   console.log(activePage)
//   console.log('==============')
//   const messages = await prisma.message.findMany({
//     orderBy: {
//       id: 'asc'
//     },
//     where: {
//       chat: {
//         id: Number(chatId)
//       }
//     },
//     include: {
//       chat: {
//         select: {
//           id: true,
//         }
//       },
//       user: true,
//       lastChatMessage: true
//     },
//     skip: (page - 1) * 12,
//     take: 12,
//   })
//
//   // if (messages[messages.length - 1]) {
//   //   for (let i = 0; i < messages.length; i++)
//   //     await prisma.message.update({
//   //         where: {
//   //           id: messages[i].id,
//   //         },
//   //         data: {
//   //           readBy: {
//   //             connect: {
//   //               id: Number(userId)
//   //             }
//   //           }
//   //         },
//   //       }
//   //     )
//   // }
//
//   console.log(messages)
//   console.log('_________________')
//   console.log('_________________')
//   return {page: page, messages: messages}
// }

export const getMessagesByChatId = async (
  chatId: number | string,
  userId: number | string,
  massagesCount: number | string | any
): Promise<any> => {
  console.log(massagesCount)

  const startMessage = await prisma.message.findMany({
    where: {
      chat: {
        id: Number(chatId)
      }
    },
    // orderBy: {
    //   id: 'desc',
    // },
    // orderBy: {
    //   id: 'desc',
    // },
    // cursor: {
    //   id: massagesCount ? startMessage[0].id - Number(massagesCount) : startMessage[0].id,
    // },
    skip: massagesCount ? Number(massagesCount) - 15 : 0,
    take: -15
  })

  // console.log(startMessage[0].id)
  // console.log(startMessage[startMessage.length - 1].id)

  const messages = await prisma.message.findMany({
    where: {
      chat: {
        id: Number(chatId)
      }
    },
    include: {
      chat: {
        select: {
          id: true,
        }
      },
      user: true,
      lastChatMessage: true
    },
    skip: massagesCount ? Number(massagesCount) - 15 : 0,
    take: -15
  })

  // if (messages[messages.length - 1]) {
  //   for (let i = 0; i < messages.length; i++)
  //     await prisma.message.update({
  //       where: {
  //         id: messages[i].id,
  //       },
  //       data: {
  //         readBy: {
  //           connect: {
  //             id: Number(userId)
  //           }
  //         }
  //       }
  //     })
  // }
  return messages
}

export const getMessageById = async (
  messageId: number | string,
): Promise<any> => {
  const message = await prisma.message.findUnique({
    where: {id: Number(messageId)}
  })
  return message
}

export const createNewMessage = async (
  content: string,
  chatId: number | string,
  userId: number | string,
): Promise<any> => {
  if (!content || !chatId) {
    throw new ApiError(400, {message: "Invalid data passed into request"});
  }

  const message = await prisma.message.create({
    data: {
      user: {
        connect: {
          id: Number(userId)
        }
      },
      content,
      chat: {
        connect: {
          id: Number(chatId)
        }
      },
      readBy: {
        connect: {
          id: Number(userId)
        }
      },
    },
    select: {
      id: true,
      content: true,
      readBy: true,
      lastChatMessage: true,
      chatId: true,
      createdAt: true,
      user: true,
      chat: {
        include: {
          users: true
        }
      }
    }
  })

  await prisma.chat.update({
    where: {
      id: Number(chatId)
    },
    data: {
      latestMessage: {
        connect: {
          id: message.id
        }
      }
    },
    select: {
      messages: true
    }
  });

  // if (message.chat.users) {
  //   for (let i = 0; i < message.chat.users.length; i++) {
  //     if (message.chat.users[i].id != Number(userId))
  //       await prisma.messageNotification.create({
  //         data: {
  //           messageId: message.id,
  //           userId: message.chat.users[i].id,
  //           chatId: Number(chatId)
  //         }
  //       })
  //   }
  // }

  return message
}

export const other_ReadMessage = async (
  chatId: number | string,
  userId: number | string,
): Promise<any> => {
  console.log('++++++++++++++++++++++++')
  console.log('++++++++++++++++++++++++')
  const messages = await prisma.message.findMany({
    where: {
      chat: {
        id: Number(chatId),
      },
      readBy: {
        none: {
          id: Number(userId)
        }
      }
    },
    select: {
      id: true,
      readBy: true,
    }
  })

  console.log(messages.length)
  console.log(messages)

  if (messages[messages.length - 1]) {
    for (let i = 0; i < messages.length; i++)
      await prisma.message.update({
        where: {
          id: messages[i].id
        },
        data: {
          readBy: {
            connect: {
              id: Number(userId)
            }
          }
        }
      })
  }
  return messages
}
