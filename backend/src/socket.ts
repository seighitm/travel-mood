import {getProfileViews, getUserById} from './services/user.service'
import server from './server'

const io = require('socket.io')(server, {
  //pingTimeout: 600000,
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:5000/', 'https://admin.socket.io', '*'],
    credentials: true,
  },
})

global.onlineUsers = []
const addUser = (userId: any, socketId: any) => {
  !global.onlineUsers.some((user: any) => user.userId === userId && user.socketId == socketId) &&
  global.onlineUsers.push({userId, socketId})
}

const removeUser = (socketId: any) => {
  global.onlineUsers = global.onlineUsers.filter((user: any) => user.socketId !== socketId)
}

const getUser = (userId: any) => {
  return global.onlineUsers.find((user: any) => user.userId === userId)
}

const allUser = () => {
  return global.onlineUsers.reduce((group: any, product: any) => {
    const {userId} = product
    group[userId] = group[userId] != undefined ? group[userId] : 0
    group[userId] += 1
    return group
  }, {})
}

io.on('connection', (socket: any) => {
  // console.log(allUser())
  // console.log(`All connections: ${Array.from(io.sockets.sockets).map((socket: any) => socket[0])}`)

  let userData: any

  socket.on('setup', async (data: any) => {
    userData = data
    addUser(data?.id, socket.id)

    if (userData) {
      const us = await getUserById(userData?.id)
      const userChats = us?.chats?.map((item: any) => item.id)
      if (userChats) {
        for (let i = 0; i < userChats?.length; i++) {
          socket.join(userChats[i])
        }
      }
    }
    socket.emit('connected', allUser())
    socket.broadcast.emit('connected', allUser())
    console.log('Connected to socket.io')
  })

  socket.on('join chat', (room: any) => {
    socket.join(room)
    console.log('User Joined Room: ' + room)
  })

  socket.on('leave-chat', (room: any) => {
    socket.leave(room)
    console.log('User Leave from Room: ' + room)
  })

  socket.on('get-online-users', () => {
    if (getUser(socket.id)?.userId != undefined) {
      socket.in(getUser(socket.id).userId)
      socket.to(getUser(socket.id).userId)
    } else {
      socket.broadcast.emit('post-online-users', allUser())
    }
  })

  socket.on('disconnect', async () => {
    console.log('USER DISCONNECTED')
    removeUser(socket.id)
    socket.broadcast.emit('disconnected', allUser())
  })

  socket.on('new-message', (newMessageReceived: any) => {
    console.log(newMessageReceived)
    socket.in(newMessageReceived.chat.id).emit('message-received', newMessageReceived)
  })

  socket.on('send-views', async ({userId, guestId}: any) => {
    const userInfo = await getProfileViews(userId)
    const guest = getUser(guestId)
    if (guest) socket.to(guest.socketId).emit('receive-views', userInfo)
  })

  socket.on('post-read-messages', async (chatId: number | string) => {
    const user = global.onlineUsers?.find((item: any) => item.socketId == socket.id)
    if (user)
      for (let i = 0; i < global.onlineUsers.length; i++) {
        if (global.onlineUsers[i].userId == user.userId)
          socket.to(global.onlineUsers[i].socketId).emit('get-read-messages', chatId)
      }
  })

  socket.on('post-reconnect-to-rooms', async (users: any) => {
    if (users)
      for (let i = 0; i < global.onlineUsers.length; i++) {
        if (users?.includes(global.onlineUsers[i]?.userId)) {
          socket.to(global.onlineUsers[i].socketId).emit('get-reconnect-to-rooms')
        }
      }
  })

  socket.on('post-join-room-again', async () => {
    const user = await getUserById(userData.id)
    const aa = user?.chats?.map((item: any) => item.id)

    if (user) for (let i = 0; i < aa?.length; i++) socket.join(aa[i])
  })

  socket.on('send-trip-join-request', async ({receiveUserId}: any) => {
    if (receiveUserId != undefined) {
      if (getUser(receiveUserId) != undefined) {
        socket.to(getUser(receiveUserId).socketId).emit('receive-trip-join-request')
      }
    }
  })
})

export default io
