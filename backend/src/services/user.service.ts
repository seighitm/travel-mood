import prisma from "../../prisma/PrismaClient";
import fs from "fs-extra";
import path from "path";
import {Prisma} from "@prisma/client";
import {generateTokens, saveToken} from "./token.service";
import ApiError from "../utils/api-error";
import bcrypt from "bcryptjs";
import {
  UserId,
  UserUpdateGeneralInfoPayload,
  UserUpdateGeneralInfoResponse,
  UserUpdateMap,
  UserUpdatePersonalInfoPayload
} from "../models/user.model";
import {isEmptyArray, isEmptyString, isNullOrUndefined, isShortStringThan} from "../utils/primitive-checks";
import {UserPayloadValidator} from "../validators/user.validator";

const removeUnusedImages = async (imagesToRemove: any[]) => {
  if (!isNullOrUndefined(imagesToRemove) && !isEmptyArray(imagesToRemove)) {
    for (let i = 0; i < imagesToRemove.length; i++)
      fs.remove(path.resolve(__dirname, '..', 'uploads', imagesToRemove[i].image), (err) => {
        if (err) console.log(err);
        console.log('File deleted successfully!');
      })
  }

  for (let i = 0; i < imagesToRemove.length; i++) {
    await prisma.userImage.delete({
      where: {image: imagesToRemove[i].image},
    });
  }
}

export const updateUserMap = async (
  userId: number,
  {
    interestedInCountries,
    visitedCountries
  }: UserUpdateMap,
): Promise<UserId> => {

  return await prisma.user.update({
    where: {
      id: Number(userId)
    },
    data: {
      interestedInCountries: {
        set: interestedInCountries.map((item: any) => ({code: item}))
      },
      visitedCountries: {
        connect: visitedCountries.map((item: any) => ({code: item}))
      }
    },
    select: {
      id: true
    }
  });
};

export const updateUserPersonalInfo = async (
  userId: number,
  {
    email,
    password,
    oldPassword
  }: UserUpdatePersonalInfoPayload,
): Promise<any> => {

  if (isNullOrUndefined(password)) {
    throw new ApiError(404, {message: 'You did not enter your password!'});
  } else if (!isNullOrUndefined(password) && isShortStringThan(password, 8)) {
    throw new ApiError(404, {message: 'Password should have at least 8 letters!'});
  }

  if (isNullOrUndefined(oldPassword)) {
    throw new ApiError(404, {message: 'You did not enter your old password!'});
  } else if (!isNullOrUndefined(oldPassword) && isShortStringThan(oldPassword, 8)) {
    throw new ApiError(404, {message: 'Password should have at least 8 letters!'});
  }

  const userInfo = await prisma.user.findUnique({
    where: {
      id: Number(userId)
    },
    select: {
      password: true
    },
  });

  if (!bcrypt.compareSync(oldPassword, userInfo.password)) {
    throw new ApiError(404, {message: 'The old password is incorrect!'});
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.update({
    where: {
      id: Number(userId)
    },
    data: {
      email,
      password: hashedPassword,
    },
    select: {
      id: true,
      role: {
        select: {
          role: true
        }
      }
    }
  });

  await saveToken(user.id, generateTokens(user).refreshToken);

  return {
    ...user,
    role: user.role.role,
    accessToken: generateTokens(user).accessToken,
    refreshToken: generateTokens(user).refreshToken,
  };
};

export const updateUserGeneralInfo = async (
  userId: number,
  {
    firstName,
    lastName,
    country,
    birthday,
    languages,
    gender,
  }: UserUpdateGeneralInfoPayload,
): Promise<UserUpdateGeneralInfoResponse> => {
  UserPayloadValidator({gender, birthday, languages})

  const user = await prisma.user.update({
    where: {
      id: Number(userId)
    },
    data: {
      firstName,
      lastName,
      ...(!isNullOrUndefined(gender)
          ? {
            gender: {
              connect: {
                gender: gender
              }
            }
          } : {}
      ),
      ...(!isNullOrUndefined(birthday)
          ? {birthday: birthday}
          : {birthday: null}
      ),
      ...(!isNullOrUndefined(country)
          ? {
            country: {
              connect: {
                code: country
              }
            },
          }
          : {
            country: {
              disconnect: true
            }
          }
      ),
      languages: {
        set: languages.map((language: string) => ({
          name: language
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
          role: true
        }
      }
    },
  });

  await saveToken(user.id, generateTokens(user).refreshToken);

  return {
    ...user,
    role: user.role.role,
    accessToken: generateTokens(user).accessToken,
    refreshToken: generateTokens(user).refreshToken,
  };
};

export const updateUserImages = async (
  userId: number,
  {
    oldImages,
    profileImage,
  }: any,
  files: any
): Promise<any> => {
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
  });

  if (!isNullOrUndefined(dbUser)) {
    if (!isNullOrUndefined(oldImages) && !isEmptyArray(oldImages)) {
      const imagesToRemove: Array<any> = dbUser?.images?.filter((item: any) => !oldImages?.includes(item.image));
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
                image: profileImage
              }
            }
          }
          : {
            picture: {
              disconnect: true
            }
          }
      ),
      ...(!isNullOrUndefined(files) && !isEmptyArray(files)
          ? {
            images: {
              create: files?.map((imageName: any) => ({
                image: imageName.filename
              }))
            }
          } : {
            images: {
              set: dbUser?.images
                ?.filter((item: any) => oldImages?.includes(item.image))
                .map((image: any) => ({image: image.image}))
            }
          }
      ),
    },
    select: Prisma.validator<Prisma.UserSelect>()({
      id: true,
      email: true,
      name: true,
      picture: true,
      images: true,
      role: {
        select: {
          role: true
        }
      }
    }),
  });

  return {
    ...user,
    accessToken: generateTokens(user).accessToken,
    refreshToken: generateTokens(user).refreshToken,
  };
};

export const addInterestedVisitedCountries = async (
  userId: string | number,
  payload: any,
): Promise<any> => {
  await prisma.user.update({
    where: {id: Number(userId)},
    data: {
      ...(payload.interestedInCountries
          ? {
            interestedInCountries: {
              set: []
            }
          } : {}
      ),
      ...(payload.visitedCountries
          ? {
            visitedCountries: {
              set: []
            }
          } : {}
      )
    }
  })

  return await prisma.user.update({
    where: {id: Number(userId)},
    data: {
      ...(!isNullOrUndefined(payload.interestedInCountries)
          ? {
            interestedInCountries: {
              connect: payload.interestedInCountries.map((item: any) => ({where: {code: item}}))
            },
          } : {}
      ),
      ...(!isNullOrUndefined(payload.visitedCountries)
          ? {
            visitedCountries: {
              connect: payload.visitedCountries.map((item: any) => ({where: {code: item}}))
            }
          } : {}
      )
    }
  })
};

export const checkUserProfileViews = async (
  userId: string | number
): Promise<any> => {
  return await prisma.profileViews.updateMany({
    where: {
      guestId: Number(userId)
    },
    data: {
      seen: true
    }
  })
};

export const blockUserProfile = async (
  userId: string | number,
  expiredBlockDate: string
): Promise<any> => {
  return await prisma.user.update({
    where: {id: Number(userId)},
    data: {
      activatedStatus: 'BLOCKED',
      blockExpiration: new Date(expiredBlockDate)
    }
  })
};

export const activateUserProfile = async (
  userId: string | number
): Promise<any> => {
  return await prisma.user.update({
    where: {id: Number(userId)},
    data: {
      activatedStatus: 'ACTIVATED',
      blockExpiration: null
    }
  })
};

export const getUsersByNameOrEmail = async (
  searchField: any,
): Promise<any> => {
  if (!isNullOrUndefined(searchField) && !isEmptyString(searchField))
    return await prisma.user.findMany({
        where: {
          OR: [
            {
              OR: [
                {firstName: {contains: searchField?.split(' ')[0]}},
                {firstName: {contains: searchField?.split(' ')[1]}}
              ],
            },
            {
              OR: [
                {lastName: {contains: searchField?.split(' ')[0]}},
                {lastName: {contains: searchField?.split(' ')[1]}}
              ]
            }
          ]
        },
        select: {
          id: true,
          followedBy: true,
          following: true,
          firstName: true,
          lastName: true,
          email: true,
          picture: true,
          favoritedArticle: true
        },
      }
    )
  else
    return []
};

export const createProfileView = async (
  userId: number | string,
  guestId: number | string
): Promise<void> => {
  if (Number(guestId) != Number(userId))
    await prisma.profileViews.upsert({
      where: {
        guestId_userId: {
          userId: Number(userId),
          guestId: Number(guestId)
        }
      },
      update: {
        createdAt: new Date().toISOString(),
        seen: false
      },
      create: {
        user: {
          connect: {id: Number(userId)}
        },
        guest: {
          connect: {id: Number(guestId)}
        }
      }
    })
};

export const getProfileViews = async (
  userId: string | number,
): Promise<any> => {
  return await prisma.user.findUnique({
    where: {id: Number(userId)},
    select: {
      id: true,
      picture: true,
      guests: {
        select: {
          user: {
            include: {
              picture: true
            }
          },
          createdAt: true,
          seen: true,
        },
        orderBy: {createdAt: 'desc'}
      },
      pofilesVisit: {
        select: {
          user: true,
          createdAt: true
        },
        orderBy: {id: 'asc'}
      }
    },
  })
};

export const getUserById = async (
  userId: string | number,
): Promise<any> => {
  return await prisma.user.findUnique({
      where: {
        id: Number(userId)
      },
      include: {
        country: true,
        followedBy: true,
        following: {
          include: {
            picture: true
          }
        },
        languages: true,
        favoritedArticle: true,
        images: true,
        picture: true,
        gender: {
          select: {
            gender: true
          }
        },
        chats: {
          select: {
            id: true
          }
        },
        trips: {
          include: {
            user: {
              include: {
                picture: true
              }
            },
            places: true,
            destinations: true,
            languages: true,
            tripFavoritedBy: true,
            usersJoinToTrip: {
              include: {
                user: true
              }
            }
          }
        },
        articles: {
          include: {
            favoritedBy: true,
            countries: true,
            author: true
          }
        },
        visitedCountries: true,
        interestedInCountries: true
      }
    }
  )
};

export const fullSearchUsers = async (
  query: any,
): Promise<any> => {
  const users = await prisma.user.findMany({
    where: {
      ...(!isNullOrUndefined(query?.name) && !isEmptyString(query?.name)
          ? {
            OR: [
              {
                OR: [
                  {firstName: {contains: query.name?.split(' ')[0]}},
                  {firstName: {contains: query.name?.split(' ')[1]}}
                ],
              },
              {
                OR: [
                  {lastName: {contains: query.name?.split(' ')[0]}},
                  {lastName: {contains: query.name?.split(' ')[1]}}
                ]
              }
            ]
          }
          : {}
      ),
      ...(!isNullOrUndefined(query?.isOnline)
          ? {
            id: {
              in: global.onlineUsers?.map((item: any) => item.userId != undefined ? item.userId : -1)
            }
          } : {}
      ),
      ...(!isNullOrUndefined(query?.languages) && !isEmptyArray(query?.languages)
          ? {
            languages: {
              some: {
                name: {
                  in: query?.languages
                }
              }
            }
          }
          : {}
      ),
      ...(!isNullOrUndefined(query?.gender)
          ? {
            sex: {
              equals: query.sex
            }
          } : {}
      ),
      ...(!isNullOrUndefined(query?.countries) && !isEmptyArray(query?.countries)
          ? {
            country: {
              name: {
                in: query.countries
              }
            }
          } : {}
      ),
      ...(!isNullOrUndefined(query?.tripTo)
          ? {
            trips: {
              some: {
                destinations: {
                  some: {
                    name: {
                      in: query?.tripTo
                    }
                  }
                }
              }
            }
          } : {}
      ),
    },
    select: {
      followedBy: {
        select: {
          id: true
        }
      },
      following: {
        select: {
          id: true
        }
      },
      favoritedArticle: {
        select: {
          id: true
        }
      },
      picture: {
        select: {
          image: true
        }
      },
      role: {
        select: {
          role: true
        }
      },
      trips: {
        select: {
          destinations: true
        }
      },
      articles: {
        select: {
          countries: true
        }
      },
      firstName: true,
      lastName: true,
      id: true,
      birthday: true,
      activatedStatus: true,
      rating: true,
      country: {
        select: {
          name: true
        }
      }
    },
  })

  if (!isNullOrUndefined(query.age)) {
    const ageMinMax = query.age.split('-')
    return users
      .filter((item: any) =>
        Math.floor((new Date().getTime() - new Date(item.birthday).getTime()) / (1000 * 60 * 60 * 24 * 365)) > Number(ageMinMax[0]) &&
        Math.floor((new Date().getTime() - new Date(item.birthday).getTime()) / (1000 * 60 * 60 * 24 * 365)) < Number(ageMinMax[1])
      )
  }

  return users
};


export const getAllFavoriteItems = async (
  favoriteType: string,
  userId: number
): Promise<any> => {
  const articleSelector = {
    favoritedArticle: {
      include: {
        tagList: {
          select: {
            name: true
          }
        },
        favoritedBy: {
          select: {
            id: true
          }
        },
        author: true,
      }
    },
  }

  const tripSelector = {
    tripFavoritedBy: {
      include: {
        tripFavoritedBy: true,
        destinations: true,
        user: true
      }
    },
  }

  const userSelector = {
    followedBy: true,
    following: true,
  }

  return await prisma.user.findUnique({
      where: {
        id: Number(userId)
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
                : {...userSelector, ...articleSelector, ...tripSelector}
        )
      }
    }
  )
};


export const admin_users = async (
  {
    sortBy,
    order,
    search,
    limit,
    page
  }: any
): Promise<any> => {
  const activePage = (Number(page) - 1) * limit || 0

  console.log({
    sortBy,
    order,
    search,
    limit,
    page
  })

  const count = await prisma.user.count()

  const users = await prisma.user.findMany({
    ...(search! !== '' && search! !== undefined
      ? {
        where: {
          OR: [
            {
              email: {
                contains: search
              }
            },
            {
              OR: [
                {
                  firstName: {
                    contains: search?.split(' ')[0]
                  }
                },
                {
                  firstName: {
                    contains: search?.split(' ')[1] ?? search?.split(' ')[0]
                  }
                }
              ],
            },
            {
              OR: [
                {
                  lastName: {
                    contains: search?.split(' ')[0]
                  }
                },
                {
                  lastName: {
                    contains: search?.split(' ')[1] ?? search?.split(' ')[0]
                  }
                }
              ]
            }
          ]
        },
      }
      : {}),
    select: {
      id: true,
      email: true,
      picture: {
        select: {
          image: true
        }
      },
      role: {
        select: {
          role: true
        }
      },
      firstName: true,
      lastName: true,
      activatedStatus: true,
      rating: true,
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
      name: user.firstName,
      email: user.email,
      rating: user.rating,
      role: user.role,
      activatedStatus: user.activatedStatus
    })),
    count: count
  }
};


//#############################################################################3
//#############################################################################3
//RAU
//#############################################################################3
//#############################################################################3


export const addNewProfileVisit = async (
  userId: string | number,
  profileId: any,
): Promise<any> => {
  const profileView = await prisma.profileViews.upsert({
    where: {
      guestId_userId: {
        userId: Number(profileId),
        guestId: Number(userId)
      }
    },
    create: {
      guestId: Number(userId),
      userId: Number(profileId)
    },
    update: {
      createdAt: new Date(),
      guestId: Number(userId),
      userId: Number(profileId),
      seen: false
    }
  })
  return profileView;
};
