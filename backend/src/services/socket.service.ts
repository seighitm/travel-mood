import prisma from "../../prisma/PrismaClient";

let onlineUsers = [];

const addUniqueUser = (userId, socketId) => {
  if (userId) {
    !onlineUsers.some((user) => user.userId === userId) &&
    onlineUsers.push({userId, socketId});
  }
};

const getUserOnline = (userId) => {
  return onlineUsers.find((user) => user.userId === userId);
};

const removeUserOnline = (socketId) => {
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};
//
// export const setUserOnlineStatus = async (status: any, userId: any) => {
//   try {
//     await prisma.onlineStatus.update({
//         where: {
//           userId: Number(userId)
//         },
//         data: {
//           status: status,
//         },
//       }
//     )
//   } catch (error) {
//     console.log(error)
//   }
// }

export const findUser = async (userId: any) => {
  try {
    return await prisma.user.findUnique({
      where: {
        id: userId
      },
      include: {
        following: {
          select: {
            id: true
          }
        },
        followedBy: {
          select: {
            id: true
          }
        },
        // onlineStatus: {
        //   select: {
        //     status: true
        //   }
        // }
      }
    })
  } catch (error) {
    console.log(error)
  }
}


/*
const users = [];

const addUser = ({id, name, room})=>{
  name=name.trim().toLowerCase();
  room=room.trim().toLowerCase();

  const existingUserCheck = users.find((user)=>user.room === room && user.name === name);
  if(existingUserCheck){
    return {error:'Username is already taken'};
  }

  const user = {id, name, room};
  users.push(user);

  return {user};
}

const removeUser = (id)=>{
  const index = users.findIndex((user)=>user.id===id);
  if(index !== -1){
    return users.splice(index,1)[0];
  }
}

const getUser = (id)=>{
  return users.find((user)=>user.id === id)
}

const getUsersOfRoom = (room)=> users.filter((user)=>user.room === room);

module.exports = {addUser, removeUser, getUser, getUsersOfRoom};

 */
