import prisma from '../../prisma/PrismaClient'
import {Prisma} from '@prisma/client'
import {generateTokens, saveToken} from './token.service'
import ApiError from '../utils/api-error'
import bcrypt from 'bcryptjs'
import {
  Profile,
  UserId,
  UserUpdateGeneralInfoPayload,
  UserUpdateGeneralInfoResponse,
  UserUpdateMap,
  UserUpdatePersonalInfoPayload,
} from '../types/user.model'
import {isEmptyArray, isEmptyString, isNullOrUndefined, isShortStringThan} from '../utils/primitive-checks'
import {UserPayloadValidator} from '../validators/user.validator'
import fs from 'fs-extra'
import path from 'path'
import profileSelector from "../selectors/profile.selector";
import profileMapper from "../mappers/profile.mapper";

const removeUnusedImages = async (imagesToRemove: any[]) => {
  if (!isNullOrUndefined(imagesToRemove) && !isEmptyArray(imagesToRemove)) {
    if (process.env.NODE_ENV !== 'PRODUCTION')
      for (let i = 0; i < imagesToRemove.length; i++) {
        fs.remove(path.resolve(__dirname, '..', 'uploads', imagesToRemove[i].image), (err) => {
          if (err) console.log(err)
          console.log('File deleted successfully!')
        })
        //
        // s3.deleteObject({ Bucket: process.env.AWS_BUCKET_NAME, Key: imagesToRemove[0].image }, (err, data) => {
        //   if (err) console.log(err, err.stack)
        //   else console.log('delete', data)
        // })
      }
  }
  for (let i = 0; i < imagesToRemove.length; i++) {
    await prisma.userImage.delete({
      where: {image: imagesToRemove[i].image},
    })
  }
}

export const updateUserMap = async (
  userId: number,
  {interestedInCountries, visitedCountries}: UserUpdateMap
): Promise<UserId> => {
  return await prisma.user.update({
    where: {
      id: Number(userId),
    },
    data: {
      interestedInCountries: {
        set: interestedInCountries.map((item: any) => ({code: item})),
      },
      visitedCountries: {
        connect: visitedCountries.map((item: any) => ({code: item})),
      },
    },
    select: {
      id: true,
    },
  })
}

export const updateUserPersonalInfo = async (
  userId: number,
  {email, password, oldPassword}: UserUpdatePersonalInfoPayload
): Promise<any> => {
  if (isNullOrUndefined(password)) {
    throw new ApiError(404, {message: 'You did not enter your password!'})
  } else if (!isNullOrUndefined(password) && isShortStringThan(password, 8)) {
    throw new ApiError(404, {message: 'Password should have at least 8 letters!'})
  }

  if (isNullOrUndefined(oldPassword)) {
    throw new ApiError(404, {message: 'You did not enter your old password!'})
  } else if (!isNullOrUndefined(oldPassword) && isShortStringThan(oldPassword, 8)) {
    throw new ApiError(404, {message: 'Password should have at least 8 letters!'})
  }

  const userInfo = await prisma.user.findUnique({
    where: {
      id: Number(userId),
    },
    select: {
      password: true,
    },
  })

  if (!bcrypt.compareSync(oldPassword, userInfo.password)) {
    throw new ApiError(404, {message: 'The old password is incorrect!'})
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await prisma.user.update({
    where: {
      id: Number(userId),
    },
    data: {
      email,
      password: hashedPassword,
    },
    select: {
      id: true,
      role: {
        select: {
          role: true,
        },
      },
    },
  })

  await saveToken(user.id, generateTokens(user).refreshToken)

  return {
    ...user,
    role: user.role.role,
    accessToken: generateTokens(user).accessToken,
    refreshToken: generateTokens(user).refreshToken,
  }
}

export const updateUserGeneralInfo = async (
  userId: number,
  {
    firstName,
    lastName,
    country,
    birthday,
    languages,
    gender,
    aboutMe,
    relationshipStatus,
  }: UserUpdateGeneralInfoPayload
): Promise<UserUpdateGeneralInfoResponse> => {
  UserPayloadValidator({
    gender,
    birthday,
    languages,
    country,
    accountDataPayload: {
      firstName: firstName?.trim(),
      lastName: lastName?.trim(),
    },
  })

  const user = await prisma.user.update({
    where: {
      id: Number(userId),
    },
    data: {
      firstName,
      lastName,
      ...(!isNullOrUndefined(gender)
        ? {
          gender: {
            connect: {
              gender: gender,
            },
          },
        }
        : {}),
      aboutMe: aboutMe,
      relationshipStatus: {
        connect: {
          status: relationshipStatus,
        },
      },
      ...(!isNullOrUndefined(birthday) ? {birthday: birthday} : {birthday: null}),
      ...(!isNullOrUndefined(country)
        ? {
          country: {
            connect: {
              code: country,
            },
          },
        }
        : {
          country: {
            disconnect: true,
          },
        }),
      languages: {
        set: languages.map((language: string) => ({
          name: language,
        })),
      },
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      birthday: true,
      gender: true,
      role: {
        select: {
          role: true,
        },
      },
    },
  })

  await saveToken(user.id, generateTokens(user).refreshToken)

  return {
    ...user,
    role: user.role.role,
    accessToken: generateTokens(user).accessToken,
    refreshToken: generateTokens(user).refreshToken,
  }
}

export const updateUserImages = async (userId: number, {oldImages, profileImage}: any, files: any): Promise<any> => {
  const dbUser = await prisma.user.findUnique({
    where: {
      id: Number(userId),
    },
    select: {
      picture: true,
      images: {
        select: {
          image: true,
        },
      },
    },
  })

  if (!isNullOrUndefined(dbUser)) {
    if (!isNullOrUndefined(oldImages) && !isEmptyArray(oldImages)) {
      const imagesToRemove: Array<any> = dbUser?.images?.filter((item: any) => !oldImages?.includes(item.image))
      await removeUnusedImages(imagesToRemove)
    } else {
      await removeUnusedImages(dbUser?.images)
    }
  }

  const user = await prisma.user.update({
    where: {id: Number(userId)},
    data: {
      ...(profileImage != 'null' && profileImage != null && oldImages && oldImages?.includes(profileImage)
        ? {
          picture: {
            connect: {
              image: profileImage,
            },
          },
        }
        : {
          picture: {
            disconnect: true,
          },
        }),
      ...(!isNullOrUndefined(files) && !isEmptyArray(files)
        ? {
          images: {
            create: files?.map((imageName: any) => ({
              image: imageName[process.env.NODE_ENV == 'PRODUCTION' ? 'key' : 'filename'],
            })),
          },
        }
        : {
          images: {
            set: dbUser?.images
              ?.filter((item: any) => oldImages?.includes(item.image))
              .map((image: any) => ({image: image.image})),
          },
        }),
    },
    select: Prisma.validator<Prisma.UserSelect>()({
      id: true,
      email: true,
      picture: true,
      images: true,
      role: {
        select: {
          role: true,
        },
      },
    }),
  })

  return {
    ...user,
    accessToken: generateTokens(user).accessToken,
    refreshToken: generateTokens(user).refreshToken,
  }
}

export const addInterestedVisitedCountries = async (userId: string | number, payload: any): Promise<any> => {
  await prisma.user.update({
    where: {id: Number(userId)},
    data: {
      ...(payload.interestedInCountries
        ? {
          interestedInCountries: {
            set: [],
          },
        }
        : {}),
      ...(payload.visitedCountries
        ? {
          visitedCountries: {
            set: [],
          },
        }
        : {}),
    },
  })

  return await prisma.user.update({
    where: {id: Number(userId)},
    data: {
      ...(!isNullOrUndefined(payload.interestedInCountries)
        ? {
          interestedInCountries: {
            connect: payload.interestedInCountries.map((item: any) => ({where: {code: item}})),
          },
        }
        : {}),
      ...(!isNullOrUndefined(payload.visitedCountries)
        ? {
          visitedCountries: {
            connect: payload.visitedCountries.map((item: any) => ({where: {code: item}})),
          },
        }
        : {}),
    },
  })
}

export const checkUserProfileViews = async (userId: string | number): Promise<any> => {
  const viewsCount = await prisma.profileViews.count({
    where: {
      guestId: Number(userId),
      seen: false,
    }
  })

  if (viewsCount == 0) {
    return []
  }

  return await prisma.profileViews.updateMany({
    where: {
      guestId: Number(userId),
    },
    data: {
      seen: true,
    },
  })
}

export const createProfileView = async (userId: number | string, guestId: number | string): Promise<void> => {
  if (Number(guestId) != Number(userId))
    await prisma.profileViews.upsert({
      where: {
        guestId_userId: {
          userId: Number(userId),
          guestId: Number(guestId),
        },
      },
      update: {
        seen: false,
        createdAt: new Date(),
      },
      create: {
        user: {
          connect: {id: Number(userId)},
        },
        guest: {
          connect: {id: Number(guestId)},
        },
      },
    })
}

export const getProfileViews = async (userId: string | number): Promise<any> => {
  return await prisma.user.findUnique({
    where: {id: Number(userId)},
    select: {
      id: true,
      picture: true,
      guests: {
        select: {
          user: {
            include: {
              picture: true,
            },
          },
          createdAt: true,
          seen: true,
        },
        orderBy: {createdAt: 'desc'},
      },
      pofilesVisit: {
        select: {
          user: true,
          createdAt: true,
        },
        orderBy: {createdAt: 'asc'},
      },
    },
  })
}

export const getUserById = async (userId: string | number): Promise<any> => {
  const user = await prisma.user.findUnique({
    where: {
      id: Number(userId),
    },
    include: {
      role: {
        select: {
          role: true,
        },
      },
      country: true,
      relationshipStatus: {
        select: {
          status: true,
        },
      },
      followedBy: true,
      following: {
        include: {
          picture: true,
        },
      },
      languages: true,
      favoritedArticle: true,
      images: true,
      picture: {
        select: {
          image: true,
          caption: true,
        },
      },
      gender: {
        select: {
          gender: true,
        },
      },
      myRatings: true,
      chats: {
        select: {
          id: true,
        },
      },
      trips: {
        include: {
          user: {
            include: {
              picture: {
                select: {
                  image: true,
                },
              },
            },
          },
          gender: {
            select: {
              gender: true,
            },
          },
          places: true,
          destinations: true,
          languages: true,
          favoritedBy: {
            include: {
              picture: {
                select: {
                  image: true,
                },
              },
            },
          },
          usersJoinToTrip: {
            include: {
              user: true,
            },
          },
        },
      },
      articles: {
        include: {
          favoritedBy: {
            include: {
              picture: {
                select: {
                  image: true,
                },
              },
            },
          },
          countries: true,
          author: true,
        },
      },
      visitedCountries: true,
      interestedInCountries: true,
    },
  })

  if (isNullOrUndefined(user)) throw new ApiError(404, {message: 'User not found!'})

  return user
}

export const fullSearchUsers = async (query: any): Promise<any> => {
  const users = await prisma.user.findMany({
    where: {
      ...(!isNullOrUndefined(query?.name) && !isEmptyString(query?.name)
        ? {
          OR: [
            {
              AND: [
                {firstName: {equals: query.name?.split(' ')[0]}},
                {lastName: {startsWith: query.name?.split(' ')[1]}},
              ],
            },
            {firstName: {contains: query.name}},
            {lastName: {contains: query.name}},
          ],
        }
        : {}),
      ...(!isNullOrUndefined(query?.isOnline) && query?.isOnline != 'false'
        ? {
          id: {
            in: global.onlineUsers?.map((item: any) => (item.userId != undefined ? item.userId : -1)),
          },
        }
        : {}),
      ...(!isNullOrUndefined(query?.languages) && !isEmptyArray(query?.languages)
        ? {
          languages: {
            some: {
              name: {
                in: query?.languages,
              },
            },
          },
        }
        : {}),
      ...(!isNullOrUndefined(query?.gender)
        ? {
          gender: {
            gender: {
              equals: query.gender,
            },
          },
        }
        : {}),
      ...(!isNullOrUndefined(query?.countries) && !isEmptyArray(query?.countries)
        ? {
          country: {
            name: {
              in: query.countries,
            },
          },
        }
        : {}),
      ...(!isNullOrUndefined(query?.tripTo)
        ? {
          trips: {
            some: {
              destinations: {
                some: {
                  name: {
                    in: query?.tripTo,
                  },
                },
              },
            },
          },
        }
        : {}),
    },
    select: {
      followedBy: {
        select: {
          id: true,
        },
      },
      following: {
        select: {
          id: true,
        },
      },
      favoritedArticle: {
        select: {
          id: true,
        },
      },
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
      trips: {
        select: {
          destinations: true,
        },
      },
      articles: {
        select: {
          countries: true,
        },
      },
      gender: {
        select: {
          gender: true,
        },
      },
      firstName: true,
      lastName: true,
      id: true,
      birthday: true,
      activatedStatus: true,
      rating: true,
      country: {
        select: {
          name: true,
        },
      },
    },
  })

  if (!isNullOrUndefined(query.age)) {
    const ageMinMax = query.age.split('-')
    return users.filter(
      (item: any) =>
        Math.floor((new Date().getTime() - new Date(item.birthday).getTime()) / (1000 * 60 * 60 * 24 * 365)) >
        Number(ageMinMax[0]) &&
        Math.floor((new Date().getTime() - new Date(item.birthday).getTime()) / (1000 * 60 * 60 * 24 * 365)) <
        Number(ageMinMax[1])
    )
  }

  return users
}

export const getAllFavoriteItems = async (favoriteType: string, userId: number): Promise<any> => {
  const articleSelector = {
    favoritedArticle: {
      include: {
        tagList: {
          select: {
            name: true,
          },
        },
        favoritedBy: {
          select: {
            id: true,
          },
        },
        author: {
          include: {
            picture: {
              select: {
                image: true,
              },
            },
          },
        },
      },
    },
  }

  const tripSelector = {
    tripFavoritedBy: {
      include: {
        favoritedBy: true,
        destinations: true,
        gender: true,
        languages: true,
        user: {
          include: {
            picture: {
              select: {
                image: true,
              },
            },
          },
        },
      },
    },
  }

  const userSelector = {
    followedBy: true,
    following: {
      include: {
        role: true,
        picture: {
          select: {
            image: true,
          },
        },
      },
    },
  }

  return await prisma.user.findUnique({
    where: {
      id: Number(userId),
    },
    select: {
      firstName: true,
      lastName: true,
      ...(favoriteType == 'users'
        ? userSelector
        : favoriteType == 'articles'
          ? articleSelector
          : favoriteType == 'trips'
            ? tripSelector
            : {...userSelector, ...articleSelector, ...tripSelector}),
    },
  })
}

export const addImageCaption = async (
  userId: string | number,
  imageId: string | number,
  caption: any
): Promise<any> => {
  if (isNullOrUndefined(imageId)) {
    throw new ApiError(404, {message: 'Image error!'})
  } else if (isNullOrUndefined(caption)) {
    throw new ApiError(404, {message: 'You did not enter image caption!'})
  }

  const image = await prisma.userImage.findUnique({
    where: {
      id: Number(imageId),
    },
  })

  if (isNullOrUndefined(image)) {
    throw new ApiError(404, {message: 'Image not found!'})
  }

  await prisma.userImage.update({
    where: {
      id: Number(imageId),
    },
    data: {
      caption: caption,
    },
  })
  return image
}

//#############################################################################3
//#############################################################################3
//RAU
//#############################################################################3
//#############################################################################3

export const addNewProfileVisit = async (userId: string | number, profileId: any): Promise<any> => {
  const profileView = await prisma.profileViews.upsert({
    where: {
      guestId_userId: {
        userId: Number(profileId),
        guestId: Number(userId),
      },
    },
    create: {
      guestId: Number(userId),
      userId: Number(profileId),
    },
    update: {
      guestId: Number(userId),
      userId: Number(profileId),
      seen: false,
    },
  })
  return profileView
}
export const followUser = async (
  userId: any,
  ownerUserId: number
): Promise<Profile> => {
  if (!isNullOrUndefined(userId)) {
    const findUser = await prisma.user.findUnique({
      where: {
        id: Number(userId)
      }
    })

    if (isNullOrUndefined(findUser)) {
      throw new ApiError(404, {message: 'User not found!'})
    }
  }

  const profile = await prisma.user.update({
    where: {
      id: Number(userId),
    },
    data: {
      followedBy: {
        connect: {
          id: Number(ownerUserId),
        },
      },
    },
    select: profileSelector,
  })

  return profileMapper(profile, ownerUserId)
}
export const unfollowUser = async (
  userId: any,
  ownerUserId: number
): Promise<Profile> => {
  if (!isNullOrUndefined(userId)) {
    const findUser = await prisma.user.findUnique({
      where: {
        id: Number(userId)
      }
    })

    if (isNullOrUndefined(findUser)) {
      throw new ApiError(404, {message: 'User not found!'})
    }
  }

  const profile = await prisma.user.update({
    where: {
      id: Number(userId),
    },
    data: {
      followedBy: {
        disconnect: {
          id: Number(ownerUserId),
        },
      },
    },
    select: profileSelector,
  })

  return profileMapper(profile, ownerUserId)
}
export const setUserRating = async (
  profileId: string | number,
  rating: string | number,
  userId: string | number
): Promise<any> => {
  const profileRating = await prisma.userRatings.upsert({
    where: {
      profileId_userId: {
        profileId: Number(profileId),
        userId: Number(userId),
      },
    },
    update: {
      rating: Number(rating),
    },
    create: {
      rating: Number(rating),
      profileId: Number(profileId),
      userId: Number(userId),
    },
  })

  const userRatings = await prisma.userRatings.findMany({
    where: {
      profileId: Number(profileId),
    },
  })

  const arr = Object.values(userRatings)
  const sum: any = (prev: any, cur: any) => ({rating: prev.rating + cur.rating})
  const avg = arr.reduce(sum).rating / arr.length

  const user = await prisma.user.update({
    where: {
      id: Number(profileId),
    },
    data: {
      rating: avg,
    },
    select: {
      myRatings: true,
    },
  })

  return {
    avgRating: Math.floor(avg),
    myRatings: user.myRatings,
    ...profileRating,
  }
}
export const sendComplaint = async (
  userId: number,
  profileId: string,
  reason: string,
  image: any
): Promise<any> => {
  if (isNullOrUndefined(userId)) {
    throw new ApiError(404, {message: 'User ID is not defined!'})
  } else if (isNullOrUndefined(reason)) {
    throw new ApiError(404, {message: 'Reason is not send!'})
  } else if (isEmptyString(reason)) {
    throw new ApiError(404, {message: 'Reason is empty!'})
  }

  const complaint = await prisma.complaint.create({
    data: {
      user: {
        connect: {
          id: Number(userId),
        },
      },
      profile: {
        connect: {
          id: Number(profileId),
        },
      },
      reason: reason,
      ...(image
        ? {
          image: image.filename,
        }
        : {}),
    },
  })
  return complaint
}
