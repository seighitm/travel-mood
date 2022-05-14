import {getProfileViews, getUserById} from "./services/user.service";
import prisma from "../prisma/PrismaClient";

const {server} = require("./server");
const {instrument} = require("@socket.io/admin-ui");

const io = require("socket.io")(server, {
  //pingTimeout: 600000,
  cors: {
    origin: ["http://localhost:3000", 'http://localhost:5000/', "https://admin.socket.io", "*"],
    credentials: true
  },
});

instrument(io, {auth: false});

global.onlineUsers = [];
const addUser = (userId: any, socketId: any) => {
  !global.onlineUsers.some((user: any) => user.userId === userId
    && user.socketId == socketId
  )
  && global.onlineUsers.push({userId, socketId});
};

const removeUser = (socketId) => {
  global.onlineUsers = global.onlineUsers.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return global.onlineUsers.find((user) => user.userId === userId);
};

const allUser = () => {
  return global.onlineUsers.reduce((group, product) => {
    const {userId} = product;
    group[userId] = group[userId] != undefined ? group[userId] : 0;
    group[userId] += 1;
    return group;
  }, {})
}

io.on("connection", (socket) => {
  console.log("Connected to socket.io");
  let userData;

  socket.on("setup", async (data: any) => {
    userData = data;
    addUser(data.id, socket.id)
  console.log(userData)
    socket.broadcast.emit("connected", allUser())
    console.log(allUser())
    if (userData) {
      const us = (await getUserById(userData?.id))
      const userChats = us?.chats?.map((item: any) => item.id)
      if (userChats)
        for (let i = 0; i < userChats?.length; i++)
          socket.join(userChats[i])
    }
    setTimeout(() => {
      socket.emit("connected", allUser())
      socket.emit("post-online-users", allUser())
    }, 1000)
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });

  socket.on("get-online-users", () => {
    if (getUser(socket.id)?.userId != undefined) {
      socket.in(getUser(socket.id).userId)
      socket.to(getUser(socket.id).userId)
    } else {
      socket.broadcast.emit("post-online-users", allUser())
    }
  });

  socket.on("disconnect", async (room) => {
    console.log("USER DISCONNECTED")
    // socket.leave(userData?.id);
    // socket.leaveAll();
    //#############################################
    //#############################################
    // console.log(userData)
    // if (global.onlineUsers?.find((item: any) => item.socketId == socket.id)?.userId != undefined) {
    //   const us = (await getUserById(global.onlineUsers?.find((item: any) => item.socketId == socket.id)?.userId))
    //   const aa = us?.chats?.map((item: any) => item.id)
    //   console.log('-----------------------')
    //   console.log(us?.chats?.map((item: any) => item.id))
    //   console.log('-----------------------')
    //
    //   if (aa) {
    //     for (let i = 0; i < aa?.length; i++) {
    //       socket.leave(aa[i])
    //     }
    //   }
    // }

    //#############################################
    //#############################################

    removeUser(socket.id);
    socket.broadcast.emit("disconnected", allUser())

    // for (let i = 0; i < global.onlineUsers.length; i++) {
    //   socket.to(global.onlineUsers[i].socketId).emit("disconnected", allUser());
    // }


    // socket.emit(users)
    //
    // if (userData?.id) {
    //   const dbUser = await findUser(userData?.id)
    //   if (dbUser) {
    //     const user = getUser(dbUser?.id)
    //     let follower = null
    //     for (let i = 0; i < dbUser.followedBy.length; i++) {
    //       if (userData?.id != dbUser.followedBy[i].id) {
    //         follower = getUser(dbUser.followedBy[i].id)
    //         if (follower)
    //           socket.to(follower.socketId).emit("disconnected", user)
    //       }
    //     }
    //   }
    // }
  })

  socket.on("new-message", (newMessageReceived) => {
    let chat = newMessageReceived?.chat;
    socket.in(newMessageReceived.chat.id).emit("message-received", newMessageReceived);
    if (chat?.users?.length === 0)
      return console.log("chat.users not defined");

    // chat.users.forEach((user) => {
    //   console.log(newMessageReceived?.sender)
    //   if (user.id != newMessageReceived?.sender && getUser(user.id)) {
    //     socket.in(getUser(user.id)?.socketId).emit("message-received", newMessageReceived);
    //   }
    // });
  });

  socket.off("setup", async () => {
    console.log("USER DISCONNECTED");

    removeUser(socket.id);

    socket.broadcast.emit("disconnected", allUser())

    // if (userData?.id) {
    //   const dbUser = await findUser(userData?.id)
    //   if (dbUser) {
    //     const user = getUser(dbUser?.id)
    //     let follower = null
    //     for (let i = 0; i < dbUser.followedBy.length; i++) {
    //       if (userData?.id != dbUser.followedBy[i].id) {
    //         follower = getUser(dbUser.followedBy[i].id)
    //         if (follower)
    //           socket.to(follower.socketId).emit("disconnected", user)
    //       }
    //     }
    //   }
    // }
  });

  socket.on("send-views", async ({userId, guestId}) => {
    const userInfo = getProfileViews(userId)
    const guest = getUser(guestId)
    if (guest) socket.to(guest.socketId).emit("receive-views", userInfo)
  });

  socket.on("post-reconnect-to-rooms", async (users: any) => {
    if (users)
      for (let i = 0; i < global.onlineUsers.length; i++) {
        if (users?.includes(global.onlineUsers[i]?.userId)) {
          socket.to(global.onlineUsers[i].socketId).emit("get-reconnect-to-rooms")
        }
      }

    // console.log(socket.id)
    // console.log(userData)
    // console.log(allUser())
    // const us = (await getUserById(userData.id))
    // const aa = userData?.chats?.map((item: any) => item.id)
    // console.log('-----------------------')
    // console.log(us?.chats?.map((item: any) => item.id))
    // console.log('-----------------------')

    // if (aa) {
    //   for (let i = 0; i < aa?.length; i++) {
    //     // console.log(aa[i], '5')
    //     socket.join(aa[i])
    //   }
    // }

  });

  socket.on("post-join-room-again", async () => {
    const user = await getUserById(userData.id)
    const aa = user?.chats?.map((item: any) => item.id)

    if (user)
      for (let i = 0; i < aa?.length; i++)
        socket.join(aa[i])

    // console.log(users)
    // console.log(global.onlineUsers)
    //
    // if (users)
    //   for (let i = 0; i < global.onlineUsers.length; i++) {
    //     if (users?.includes(global.onlineUsers[i]?.userId)) {
    //       socket.to(global.onlineUsers[i].socketId).emit("get-reconnect-to-rooms")
    //     }
    //   }

    // console.log(socket.id)
    // console.log(userData)
    // console.log(allUser())
    // const us = (await getUserById(userData.id))
    // const aa = userData?.chats?.map((item: any) => item.id)
    // console.log('-----------------------')
    // console.log(us?.chats?.map((item: any) => item.id))
    // console.log('-----------------------')

    // if (aa) {
    //   for (let i = 0; i < aa?.length; i++) {
    //     // console.log(aa[i], '5')
    //     socket.join(aa[i])
    //   }
    // }

  });

  socket.on("send-trip-join-request", async ({userId, senderId, tripId, tripRequestId, receiveUserId}: any) => {
    // socket.broadcast().emit("receive-trip-join-request")
    // console.log('$$$$$$$$$$$$$$$$$$$$$$')
    // console.log(userId)
    // console.log(tripId)
    // console.log(receiveUserId)
    // console.log('$$$$$$$$$$$$$$$$$$$$$$')
    // socket.emit("receive-trip-join-request")

    // if (senderId) {
    //   if (getUser(userId)) {
    //     socket.to(getUser(userId).socketId).emit("receive-trip-join-request")
    //   }
    // } else {

    if (receiveUserId != undefined) {
      if (getUser(receiveUserId)) {
        socket.to(getUser(receiveUserId).socketId).emit("receive-trip-join-request")
      }
    } else if (tripRequestId) {
      const user = await prisma.userJoinToTrip.findUnique({
        where: {
          id: Number(tripRequestId)
        },
        select: {
          userId: true
        }
      })
      if (user && getUser(user?.userId)) {
        socket.to(getUser(user?.userId).socketId).emit("receive-trip-join-request")
      }
    } else if (!userId) {
      const user = await prisma.trip.findUnique({
        where: {
          id: Number(tripId)
        },
        select: {
          userId: true,
        }
      })
      if (user && getUser(user?.userId)) {
        socket.to(getUser(user?.userId).socketId).emit("receive-trip-join-request")
      }
    } else {
      const user = await prisma.userJoinToTrip.findFirst({
        where: {
          user: {
            id: Number(userId)
          },
          trip: {
            id: Number(tripId)
          }
        },
        select: {
          trip: {
            select: {
              userId: true
            }
          }
        }
      })
      if (user && getUser(user?.trip?.userId)) {
        socket.to(getUser(user?.trip?.userId).socketId).emit("receive-trip-join-request")
      }
    }
  });
});

module.exports = io;
