import prisma from "../../prisma/PrismaClient";
import ApiError from "../utils/api-error";
import {
  CommentResponse,
  JoinRequestPayload,
  JoinRequestResponse,
  Trip,
  TripFavoriteResponse,
  TripFindRequestPayload,
  TripFindResponse
} from "../models/trip.models";
import {isEmptyArray, isNullOrUndefined} from "../utils/primitive-checks";
import {TripPayloadValidator} from "../validators/trip.validators";
import {Prisma} from "@prisma/client";
import {ROLE} from "./auth.service";

const getTripById = async (tripId: string | number) => {
  return await prisma.trip.findUnique({
    where: {
      id: Number(tripId)
    },
    select: {
      id: true,
      isHidden: true,
      user: {
        select: {
          id: true
        }
      },
      usersJoinToTrip: {
        select: {
          user: {
            select: {
              id: true
            }
          }
        }
      }
    }
  })
}

const getCommentById = async (commentId: string | number) => {
  return await prisma.tripComment.findUnique({
    where: {
      id: Number(commentId)
    },
    select: {
      id: true,
      userId: true
    }
  })
}

export const addTripToFavorite = async (
  userId: number,
  tripId: number | string,
): Promise<TripFavoriteResponse> => {
  const trip = await getTripById(tripId)

  if (isNullOrUndefined(trip)) {
    throw new ApiError(422, {message: "Trip not found!"});
  }

  return await prisma.trip.update({
    where: {
      id: Number(tripId),
    },
    data: {
      tripFavoritedBy: {
        connect: {
          id: Number(userId)
        }
      },
    },
    select: {
      id: true,
      tripFavoritedBy: true
    }
  })
}

export const removeTripFromFavorite = async (
  userId: number,
  tripId: number | string,
): Promise<TripFavoriteResponse> => {
  const trip = await getTripById(tripId)

  if (isNullOrUndefined(trip)) {
    throw new ApiError(422, {message: "Trip not found!"});
  }

  return await prisma.trip.update({
    where: {
      id: Number(tripId),
    },
    data: {
      tripFavoritedBy: {
        disconnect: {
          id: Number(userId)
        }
      }
    },
    select: {
      id: true,
      tripFavoritedBy: true
    }
  });
}

export const addCommentToTrip = async (
  userId: number,
  tripId: number | string,
  bodyOfComment: string,
): Promise<any> => {
  const trip = await getTripById(tripId)

  if (isNullOrUndefined(trip)) {
    throw new ApiError(422, {message: "Trip not found!"});
  }

  return await prisma.tripComment.create({
    data: {
      user: {
        connect: {
          id: Number(userId),
        }
      },
      Trip: {
        connect: {
          id: Number(tripId)
        }
      },
      comment: bodyOfComment
    },
    select: {
      id: true,
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          picture: true,
          gender: true
        }
      },
      comment: true,
      tripId: true,
      createdAt: true,
    }
  })
}

export const removeCommentToTrip = async (
  commentId: number | string,
  userId: number,
): Promise<CommentResponse> => {
  const comment = await getCommentById(commentId)

  if (isNullOrUndefined(comment)) {
    throw new ApiError(422, {message: "Comment not found!"});
  } else if (comment.userId != userId) {
    throw new ApiError(404, {message: "You are not the author of the comment!"});
  }

  return await prisma.tripComment.delete({
    where: {
      id: Number(commentId)
    },
    select: {
      id: true
    }
  });
}

export const joinToTrip = async (
  {
    userId,
    comment,
    receiveUserId,
    typeOfRequest
  }: JoinRequestPayload | any,
  tripId: number | string
): Promise<JoinRequestResponse | any> => {
  if (typeOfRequest == 'JOIN') {
    const findJoinRequest = await prisma.userJoinToTrip.findUnique({
      where: {
        userId_tripId: {
          userId: Number(userId),
          tripId: Number(tripId)
        }
      }
    })

    if (findJoinRequest && ['APPROVED', 'PENDING', 'RECEIVED'].includes(findJoinRequest.status)) {
      throw new ApiError(422, {message: "User request is already in pending!"});
    }

    console.log('JOIN')
    console.log(userId)
    console.log(receiveUserId)
    const userJoinToTrip = await prisma.userJoinToTrip.upsert({
      where: {
        userId_tripId: {
          userId: Number(userId),
          tripId: Number(tripId)
        }
      },
      update: {
        status: "PENDING",
        comment: comment
      },
      create: {
        user: {
          connect: {id: Number(userId)}
        },
        trip: {
          connect: {id: Number(tripId)}
        },
        comment: comment,
      },
      select: {
        id: true,
        status: true,
        user: {
          select: {
            id: true
          }
        },
        trip: {
          select: {
            user: {
              select: {
                id: true
              }
            },
            id: true
          }
        }
      }
    })
    return {
      tripId: userJoinToTrip.trip.id,
      receiveUserId: userJoinToTrip.trip.user.id,
      status: userJoinToTrip.status,
      id: userJoinToTrip.id
    }
  } else if (typeOfRequest == 'SEND') {
    console.log('SEND')
    console.log(userId)
    console.log(receiveUserId)
    const findJoinRequest = await prisma.userJoinToTrip.findUnique({
      where: {
        userId_tripId: {
          userId: Number(userId),
          tripId: Number(tripId)
        }
      }
    })

    if (findJoinRequest && ['APPROVED', 'PENDING', 'RECEIVED'].includes(findJoinRequest.status)) {
      throw new ApiError(422, {message: "User request is already in pending!"});
    }

    const userJoinToTrip = await prisma.userJoinToTrip.upsert({
      where: {
        userId_tripId: {
          userId: Number(userId),
          tripId: Number(tripId)
        }
      },
      update: {
        status: "RECEIVED",
      },
      create: {
        user: {
          connect: {id: Number(userId)}
        },
        trip: {
          connect: {id: Number(tripId)}
        },
        status: "RECEIVED",
      },
      select: {
        id: true,
        status: true,
        user: {
          select: {
            id: true
          }
        },
        trip: {
          select: {
            user: {
              select: {
                id: true
              }
            },
            id: true
          }
        }
      }
    })
    return {
      tripId: userJoinToTrip.trip.id,
      receiveUserId: userJoinToTrip.user.id,
      status: userJoinToTrip.status,
      id: userJoinToTrip.id
    }
  } else return

  // if (!isNullOrUndefined(receiveUserId)) {
  //   const userJoinToTrip = await prisma.userJoinToTrip.upsert({
  //     where: {
  //       userId_tripId: {
  //         userId: Number(receiveUserId),
  //         tripId: Number(tripId)
  //       }
  //     },
  //     update: {
  //       status: "RECEIVED"
  //     },
  //     create: {
  //       user: {
  //         connect: {
  //           id: Number(receiveUserId)
  //         }
  //       },
  //       trip: {
  //         connect: {
  //           id: Number(tripId)
  //         }
  //       },
  //       status: "RECEIVED"
  //     },
  //     select: {
  //       id: true,
  //       status: true,
  //       user: {
  //         select: {
  //           id: true
  //         }
  //       },
  //       trip: {
  //         select: {
  //           id: true
  //         }
  //       }
  //     }
  //   })
  //   return {...userJoinToTrip, receiveUserId: receiveUserId}
  // } else {
  //   const userJoinToTrip = await prisma.userJoinToTrip.upsert({
  //     where: {
  //       userId_tripId: {
  //         userId: Number(userId),
  //         tripId: Number(tripId)
  //       }
  //     },
  //     update: {
  //       status: "PENDING",
  //       comment: comment
  //     },
  //     create: {
  //       user: {
  //         connect: {id: Number(userId)}
  //       },
  //       trip: {
  //         connect: {id: Number(tripId)}
  //       },
  //       comment: comment,
  //       // ...(senderId ?
  //       //     {
  //       //       senderOfInvitation: {
  //       //         connect: {
  //       //           id: Number(senderId)
  //       //         }
  //       //       }
  //       //     }
  //       //     : {}
  //       // ),
  //     },
  //     select: {
  //       id: true,
  //       status: true,
  //       user: {
  //         select: {
  //           id: true
  //         }
  //       },
  //       trip: {
  //         select: {
  //           id: true
  //         }
  //       }
  //     }
  //   })
  //   return userJoinToTrip
  // }
}

export const leaveFromTrip = async (
  userId: number,
  tripId: number | string,
): Promise<any> => {
  const userJoinToTrip = await prisma.userJoinToTrip.delete({
    where: {
      userId_tripId: {
        userId: Number(userId),
        tripId: Number(tripId)
      }
    },
    select: {
      trip: {
        select: {
          user: true
        }
      },
      user: {
        select: {
          id: true
        }
      }
    }
  })
  return userJoinToTrip
}

export const createTrip = async (
  userId: number | string,
  {
    countries,
    languages,
    description,
    title,
    date,
    gender,
    markers,
    isAnytime,
    transports,
    isSplitCost,
    itinerary,
    budget
  }: Trip
): Promise<any> => {
  TripPayloadValidator({title, description, languages, countries})

  const trip = await prisma.trip.count({
    where: {
      AND: [
        {
          title: title,
        },
        {
          userId: Number(userId)
        }
      ]
    }
  })

  if (trip != 0) {
    throw new ApiError(404, {message: "You have already created a trip with this title!"});
  }

  return await prisma.trip.create({
    data: {
      user: {
        connect: {
          id: Number(userId)
        }
      },
      budget: budget,
      itinerary: itinerary,
      gender: {
        connect: {
          gender: gender
        }
      },
      description: description,
      title: title,
      splitCosts: isSplitCost,
      isAnytime: Boolean(isAnytime || date[0] == null),
      ...((Boolean(isAnytime) == false && date[0] != null) ? {
        dateFrom: new Date(date[0]).toISOString(),
        dateTo: new Date(date[1]).toISOString(),
      } : {}),
      ...(!isNullOrUndefined(countries) && !isEmptyArray(countries)
        ? {
          destinations: {
            connect: countries.map((item: any) => ({code: item.countryCode}))
          }
        } : []),
      languages: {
        connect: languages.map((item: any) => ({name: item}))
      },
      transports: {
        connectOrCreate: transports.map((item: any) => ({where: {name: item}, create: {name: item}}))
      },
      ...(!isNullOrUndefined(markers) && !isEmptyArray(markers)
        ? {
          places: {
            connectOrCreate: markers.map((item: any) => ({
              where: {
                lat_lon: {
                  lon: item?.place[0].toString(),
                  lat: item?.place[1].toString()
                }
              },
              create: {
                lon: item?.place[0].toString(),
                lat: item?.place[1].toString(),
                description: item.description
              },
            })),
          },
        } : []),
    },
  })
}

export const getTrips = async (
  {
    destinations,
    budget,
    date,
    languages,
    page,
    gender
  }: TripFindRequestPayload,
  userId: number,
  userRole: string
): Promise<TripFindResponse> => {
  const queries: Prisma.TripWhereInput[] = [];
  console.log(destinations)
  // if(findTrip?.user.id != userId || isNullOrUndefined(userId)){
  queries.push({
    isHidden: false
  })
  // }

  if (!isNullOrUndefined(destinations)) {
    queries.push({
        destinations: {
          some: {
            name: {
              in: destinations
            }
          }
        }
      }
    );
  }

  if (!isNullOrUndefined(languages)) {
    queries.push({
      languages: {
        some: {
          name: {
            in: languages
          }
        }
      }
    });
  }

  if (!isNullOrUndefined(gender)) {
    queries.push({
        gender: gender
      }
    );
  }

  if (!isNullOrUndefined(budget)) {
    queries.push({
        budget: {
          equals: budget
        }
      }
    );
  }

  if (!isNullOrUndefined(date) && date.length == 2 && date[0] != 'null') {
    const startDate = new Date(date[0])
    // startDate.setDate(startDate.getDate() + 1)
    startDate.setDate(startDate.getDate())
    startDate.setHours(0)
    startDate.setMinutes(0)
    startDate.setSeconds(0)
    startDate.setMilliseconds(0)

    const endDate = new Date(date[1])
    endDate.setDate(endDate.getDate() - 1)
    endDate.setHours(23)
    endDate.setMinutes(59)
    endDate.setSeconds(59)

    queries.push({
      dateTo: {
        gt: endDate
      },
      dateFrom: {
        lte: startDate
      }
    });
  }

  const activePage = (Number(page) - 1) * 12 || 0
  const totalTripsCount = await prisma.trip.count()

  const trips = await prisma.trip.findMany({
    where: {
      // AND: queries
      OR:[
        {
          AND:[
            {
              isHidden: true,
            },
            {
              usersJoinToTrip:{
                some:{
                  user:{
                    id:{
                      in: userId
                    }
                  }
                }
              }
            }
          ]
        },
        {
          isHidden: false,
        }
      ]
    },
    include: {
      gender: {
        select: {
          gender: true
        }
      },
      places: {
        select: {
          id: true,
        }
      },
      destinations: {
        select: {
          id: true,
          name: true,
          code: true
        }
      },
      transports: {
        select: {
          id: true,
          name: true
        }
      },
      languages: {
        select: {
          id: true,
          name: true
        }
      },
      tripComments: {
        select: {
          id: true
        }
      },
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          picture: true
        }
      },
      tripFavoritedBy: {
        select: {
          id: true,
        }
      }
    },
    orderBy: {
      id: 'desc',
    },
    skip: activePage,
    take: 12,
  })

  console.log(queries)
  console.log(trips)

  return {
    trips: trips,
    totalTripsCount,
    tripsOnPageCount: trips.length
  }
}

const disconnectMarkers = async (tripId: string | number) => {
  await prisma.trip.update({
      where: {
        id: Number(tripId)
      },
      data: {
        places: {
          set: []
        }
      }
    }
  );
}

const disconnectCountries = async (tripId: string | number) => {
  await prisma.trip.update({
    where: {
      id: Number(tripId)
    },
    data: {
      destinations: {
        set: []
      }
    }
  });
}

const disconnectLanguages = async (tripId: string | number) => {
  await prisma.trip.update({
    where: {
      id: Number(tripId)
    },
    data: {
      languages: {
        set: []
      }
    }
  });
}

const removeUnnusedMarkers = async () => {
  const findMarkers = await prisma.marker.findMany({
    select: {
      id: true,
      trip: {
        select: {
          id: true
        }
      }
    },
  });

  const markersToDelete = findMarkers.filter((item: any) => item.trips?.length == 0)

  for (let i = 0; i < markersToDelete.length; i++) {
    await prisma.marker.delete({
      where: {
        id: markersToDelete[i].id
      }
    })
  }
}

export const updateTrip = async (
  userId: number,
  tripId: number | string,
  {
    countries,
    languages,
    description,
    title,
    date,
    destinations,
    gender,
    markers,
    isAnytime,
    transports,
    isSplitCost,
    itinerary,
    budget
  }: Trip
): Promise<{ id: number }> => {
  TripPayloadValidator({title, description, languages, countries})

  await disconnectMarkers(tripId)
  await disconnectCountries(tripId)
  await disconnectLanguages(tripId)

  const newTrip = await prisma.trip.update({
    where: {
      id: Number(tripId),
    },
    data: {
      user: {
        connect: {
          id: Number(userId)
        }
      },
      itinerary: itinerary,
      budget: budget,
      gender: gender,
      description: description,
      title: title,
      splitCosts: isSplitCost,
      isAnytime: Boolean(isAnytime || date?.[0] == null),
      ...((Boolean(isAnytime) == false && date[0] != null) ? {
        dateFrom: new Date(date[0]).toISOString(),
        dateTo: new Date(date[1]).toISOString(),
      } : {
        dateFrom: null,
        dateTo: null
      }),
      destinations: {
        connect: destinations.map((item: any) => ({
          code: item
        }))
      },
      languages: {
        connect: languages.map((item: any) => ({
          name: item
        }))
      },
      transports: {
        connectOrCreate: transports.map((item: any) => ({
          create: {
            name: item
          },
          where: {
            name: item
          }
        }))
      },
      places: {
        connectOrCreate: markers.map((item: any) => ({
              where: {
                lat_lon: {
                  lon: item?.place[0].toString(),
                  lat: item?.place[1].toString()
                }
              },
              create: {
                lon: item?.place[0].toString(),
                lat: item?.place[1].toString(),
                description: item.description
              },
            }
          )
        ),
      },
    },
    select: {
      id: true
    }
  })

  await removeUnnusedMarkers()

  return newTrip
}


export const getOneTrip = async (
  tripId: number | string,
  userId: number
): Promise<Prisma.TripSelect | any> => {
  console.log(tripId)
  const findTrip = await getTripById(tripId)

  const trip = await prisma.trip.findFirst({
    where: {
      id: Number(tripId),
      ...(!isNullOrUndefined(userId) && findTrip?.user.id != userId && findTrip.usersJoinToTrip.find((item: any) => item.user.id == userId) == undefined)
        ? {isHidden: false} : {}
    },
    include: {
      places: {
        select: {
          id: true,
          lat: true,
          lon: true,
          description: true
        }
      },
      destinations: {
        select: {
          id: true,
          name: true,
          code: true
        }
      },
      transports: {
        select: {
          id: true,
          name: true
        }
      },
      languages: {
        select: {
          id: true,
          name: true,
        }
      },
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        }
      },
      tripComments: {
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              picture: true,
              gender: true
            }
          },
        },
        orderBy: {
          id: 'desc'
        }
      },
      gender: {
        select: {
          gender: true
        }
      },
      tripFavoritedBy: {
        select: {
          id: true,
          firstName: true,
          lastName: true
        }
      },
      usersJoinToTrip: true
    }
  })

  console.log(trip)
  //
  if (!trip)
    throw new ApiError(404, {message: "Trip not found!"});

  return trip
}


export const deleteTrip = async (
  tripId: number | string,
  userId: number,
  userRole: ROLE
): Promise<{ id: number }> => {
  const trip = await getTripById(tripId)

  if (isNullOrUndefined(trip))
    throw new ApiError(404, {message: "Trip not found!"});
  else if (trip.user.id != userId && userRole != ROLE.ADMIN)
    throw new ApiError(403, {message: "You are not the author of the trip!"});

  await prisma.trip.delete({
    where: {
      id: Number(tripId)
    },
    select: {
      id: true
    }
  });

  return trip
}


export const filtering = async (
  {
    search,
    sortBy,
    order,
    limit,
    page,
  }: any,
): Promise<TripFindResponse | any> => {
  const activePage = (Number(page) - 1) * limit || 0
  const totalTripsCount = await prisma.trip.count({
    where: {
      OR: [
        {
          title: {
            contains: search
          }
        },
        getUsersQuery(search),
      ]
    }
  })

  const trips = await prisma.trip.findMany({
    where: {
      OR: [
        {
          title: {
            contains: search
          }
        },
        getUsersQuery(search),
      ]
    },
    select: {
      id: true,
      title: true,
      createdAt: true,
      tripComments: {
        select: {
          id: true
        }
      },
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          picture: true
        }
      },
      tripFavoritedBy: {
        select: {
          id: true,
        }
      },
    },
    ...(sortBy == 'date' && order != 'none' ? {orderBy: {createdAt: order}} : {}),
    ...(sortBy == 'likes' && order != 'none' ? {orderBy: {tripFavoritedBy: {_count: order}}} : {}),
    ...(sortBy == 'comments' && order != 'none' ? {orderBy: {tripComments: {_count: order}}} : {}),
    ...(sortBy == 'author' && order != 'none' ? {orderBy: {user: {firstName: order}}} : {}),
    ...(sortBy == 'title' && order != 'none' ? {orderBy: {title: order}} : {}),
    skip: activePage,
    take: Number(limit),
  })
  return {
    trips: trips.map((trip: any) => ({
      ...trip,
      date: trip.createdAt,
      author: `${trip?.user?.firstName} ${trip?.user?.lastName}`,
      likes: trip?.tripFavoritedBy.length,
      comments: trip?.tripComments?.length
    })),
    count: totalTripsCount,
    tripsOnPageCount: trips.length
  }
}


export const getUsersQuery = (search: string) => {
  return {
    OR: [
      {
        OR: [
          {
            user: {
              firstName: {
                contains: search?.split(' ')[0]
              }
            }
          },
          {
            user: {
              firstName: {
                contains: search?.split(' ')[1] ?? search?.split(' ')[0]
              }
            }
          }
        ],
      },
      {
        OR: [
          {
            user: {
              lastName: {
                contains: search?.split(' ')[0]
              }
            }
          },
          {
            user: {
              lastName: {
                contains: search?.split(' ')[1] ?? search?.split(' ')[0]
              }
            }
          }
        ]
      }
    ]
  }
}

export const switchTripHideStatus = async (
  tripId: number | string,
  userId: number,
  userRole: string
): Promise<{ id: number }> => {
  const trip = await getTripById(tripId)

  if (isNullOrUndefined(trip))
    throw new ApiError(404, {message: "Trip not found!"});
  else if (trip.user.id != userId && userRole != ROLE.ADMIN)
    throw new ApiError(403, {message: "You are not the author of the trip!"});

  await prisma.trip.update({
    where: {
      id: Number(tripId)
    },
    data: {
      isHidden: !trip.isHidden
    }
  });

  return trip
}
