import prisma from '../../prisma/PrismaClient'
import ApiError from '../utils/api-error'
import {
  JoinRequestPayload,
  JoinRequestResponse,
  Trip,
  TripFavoriteResponse,
  TripFindRequestPayload,
  TripFindResponse,
} from '../types/trip.models'
import {isEmptyArray, isEmptyString, isNullOrUndefined} from '../utils/primitive-checks'
import {TripPayloadValidator} from '../validators/trip.validators'
import {Prisma} from '@prisma/client'
import {ROLE} from './auth.service'

const getTripById = async (
  tripId: string | number
) => {
  return await prisma.trip.findUnique({
    where: {
      id: Number(tripId),
    },
    select: {
      id: true,
      isHidden: true,
      user: {
        select: {
          id: true,
        },
      },
      usersJoinToTrip: {
        select: {
          user: {
            select: {
              id: true,
            },
          },
        },
      },
    },
  })
}

export const addTripToFavorite = async (
  userId: number,
  tripId: number | string
): Promise<TripFavoriteResponse> => {
  const trip = await getTripById(tripId)

  if (isNullOrUndefined(trip)) {
    throw new ApiError(422, {message: 'Trip not found!'})
  }

  return await prisma.trip.update({
    where: {
      id: Number(tripId),
    },
    data: {
      favoritedBy: {
        connect: {
          id: Number(userId),
        },
      },
    },
    select: {
      id: true,
      favoritedBy: true,
    },
  })
}

export const removeTripFromFavorite = async (
  userId: number,
  tripId: number | string
): Promise<TripFavoriteResponse> => {
  const trip = await getTripById(tripId)

  if (isNullOrUndefined(trip)) {
    throw new ApiError(422, {message: 'Trip not found!'})
  }

  return await prisma.trip.update({
    where: {
      id: Number(tripId),
    },
    data: {
      favoritedBy: {
        disconnect: {
          id: Number(userId),
        },
      },
    },
    select: {
      id: true,
      favoritedBy: true,
    },
  })
}

export const joinToTrip = async (
  {userId, comment, receiveUserId, typeOfRequest}: JoinRequestPayload | any,
  tripId: number | string
): Promise<JoinRequestResponse | any> => {
  if (typeOfRequest == 'JOIN') {
    const findJoinRequest = await prisma.userJoinToTrip.findUnique({
      where: {
        userId_tripId: {
          userId: Number(userId),
          tripId: Number(tripId),
        },
      },
    })

    if (findJoinRequest && ['APPROVED', 'PENDING', 'RECEIVED'].includes(findJoinRequest.status)) {
      throw new ApiError(422, {message: 'User request is already in pending!'})
    }

    const userJoinToTrip = await prisma.userJoinToTrip.upsert({
      where: {
        userId_tripId: {
          userId: Number(userId),
          tripId: Number(tripId),
        },
      },
      update: {
        status: 'PENDING',
        comment: comment,
      },
      create: {
        user: {
          connect: {id: Number(userId)},
        },
        trip: {
          connect: {id: Number(tripId)},
        },
        comment: comment,
      },
      select: {
        id: true,
        comment: true,
        userId: true,
        status: true,
        user: {
          select: {
            id: true,
          },
        },
        trip: {
          select: {
            user: {
              select: {
                id: true,
              },
            },
            id: true,
          },
        },
      },
    })
    return {
      userId: userJoinToTrip.userId,
      comment: userJoinToTrip.comment,
      tripId: userJoinToTrip.trip.id,
      receiveUserId: userJoinToTrip.trip.user.id,
      status: userJoinToTrip.status,
      id: userJoinToTrip.id,
    }
  } else if (typeOfRequest == 'SEND') {
    const findJoinRequest = await prisma.userJoinToTrip.findUnique({
      where: {
        userId_tripId: {
          userId: Number(userId),
          tripId: Number(tripId),
        },
      },
    })

    if (findJoinRequest && ['APPROVED', 'PENDING', 'RECEIVED'].includes(findJoinRequest.status)) {
      throw new ApiError(422, {message: 'User request is already in pending!'})
    }

    const userJoinToTrip = await prisma.userJoinToTrip.upsert({
      where: {
        userId_tripId: {
          userId: Number(userId),
          tripId: Number(tripId),
        },
      },
      update: {
        status: 'RECEIVED',
      },
      create: {
        user: {
          connect: {id: Number(userId)},
        },
        trip: {
          connect: {id: Number(tripId)},
        },
        status: 'RECEIVED',
      },
      select: {
        id: true,
        comment: true,
        userId: true,
        status: true,
        user: {
          select: {
            id: true,
          },
        },
        trip: {
          select: {
            user: {
              select: {
                id: true,
              },
            },
            id: true,
          },
        },
      },
    })
    return {
      userId: userJoinToTrip.userId,
      comment: userJoinToTrip.comment,
      tripId: userJoinToTrip.trip.id,
      receiveUserId: userJoinToTrip.user.id,
      status: userJoinToTrip.status,
      id: userJoinToTrip.id,
    }
  } else return
}

export const leaveFromTrip = async (
  userId: number | string,
  tripId: number | string
): Promise<any> => {
  const userJoinToTrip = await prisma.userJoinToTrip.delete({
    where: {
      userId_tripId: {
        userId: Number(userId),
        tripId: Number(tripId),
      },
    },
    select: {
      trip: {
        select: {
          user: true,
        },
      },
      user: {
        select: {
          id: true,
        },
      },
    },
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
    budget,
    maxNrOfPersons,
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
          userId: Number(userId),
        },
      ],
    },
  })

  if (trip != 0) {
    throw new ApiError(404, {message: 'You have already created a trip with this title!'})
  }

  return await prisma.trip.create({
    data: {
      user: {
        connect: {
          id: Number(userId),
        },
      },
      maxNrOfPersons: Number(maxNrOfPersons),
      budget: budget,
      itinerary: itinerary,
      ...(!isNullOrUndefined(gender) && !isEmptyString(gender)
        ? {
          gender: {
            connect: {
              gender: gender,
            },
          },
        }
        : {
          gender: {
            connect: {
              gender: 'ANY',
            },
          },
        }),
      description: description,
      title: title,
      splitCosts: isSplitCost,
      isAnytime: Boolean(isAnytime || date[0] == null),
      ...(Boolean(isAnytime) == false && date[0] != null
        ? {
          dateFrom: new Date(date[0]).toISOString(),
          dateTo: new Date(date[1]).toISOString(),
        }
        : {}),
      ...(!isNullOrUndefined(countries) && !isEmptyArray(countries)
        ? {
          destinations: {
            connect: countries.map((item: any) => ({code: item.countryCode})),
          },
        }
        : []),
      languages: {
        connect: languages.map((item: any) => ({name: item})),
      },
      transports: {
        connectOrCreate: transports.map((item: any) => ({where: {name: item}, create: {name: item}})),
      },
      ...(!isNullOrUndefined(markers) && !isEmptyArray(markers)
        ? {
          places: {
            connectOrCreate: markers.map((item: any) => ({
              where: {
                lat_lon: {
                  lon: item?.place[0].toString(),
                  lat: item?.place[1].toString(),
                },
              },
              create: {
                lon: item?.place[0].toString(),
                lat: item?.place[1].toString(),
                description: item.description,
              },
            })),
          },
        }
        : []),
    },
  })
}

export const getTrips = async (
  {destinations, budget, date, languages, page, gender, title}: TripFindRequestPayload,
  userId: number,
  userRole: string
): Promise<TripFindResponse> => {
  const queries: Prisma.TripWhereInput[] = []

  queries.push({
    isHidden: false,
  })

  if (!isNullOrUndefined(title)) {
    queries.push({
      title: {
        contains: title,
        mode: 'insensitive',
      },
    })
  }

  if (!isNullOrUndefined(destinations)) {
    queries.push({
      destinations: {
        some: {
          code: {
            in: destinations,
          },
        },
      },
    })
  }

  if (!isNullOrUndefined(languages)) {
    queries.push({
      languages: {
        some: {
          name: {
            in: languages,
          },
        },
      },
    })
  }

  if (!isNullOrUndefined(gender) && !isEmptyString(gender)) {
    queries.push({
      gender: {
        gender: gender,
      },
    })
  }

  if (!isNullOrUndefined(budget) && budget != '0') {
    queries.push({
      budget: {
        equals: budget,
      },
    })
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
      OR: [
        {
          dateFrom: {
            lte: startDate,
          },
          dateTo: {
            gte: endDate,
          },
        },

        {
          dateFrom: {
            gte: startDate,
            lte: endDate,
          },
        },

        {
          dateTo: {
            gte: startDate,
            lte: endDate,
          },
        },
      ],
    })
  }

  const activePage = (Number(page) - 1) * 12 || 0
  const totalTripsCount = await prisma.trip.count()

  const trips = await prisma.trip.findMany({
    where: {
      AND: queries,
      OR: [
        {
          AND: [
            {
              isHidden: true,
            },
            {
              usersJoinToTrip: {
                some: {
                  user: {
                    id: {
                      in: userId,
                    },
                  },
                },
              },
            },
          ],
        },
        {
          isHidden: false,
        },
      ],
    },
    include: {
      usersJoinToTrip: true,
      gender: {
        select: {
          gender: true,
        },
      },
      places: {
        select: {
          id: true,
        },
      },
      destinations: {
        select: {
          id: true,
          name: true,
          code: true,
        },
      },
      transports: {
        select: {
          id: true,
          name: true,
        },
      },
      languages: {
        select: {
          id: true,
          name: true,
        },
      },
      comments: {
        select: {
          id: true,
        },
      },
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          picture: true,
        },
      },
      favoritedBy: {
        select: {
          id: true,
        },
      },
    },
    orderBy: {
      id: 'desc',
    },
    skip: activePage,
    take: 12,
  })

  return {
    trips: trips,
    totalTripsCount,
    tripsOnPageCount: trips.length,
  }
}

const disconnectMarkers = async (
  tripId: string | number
) => {
  await prisma.trip.update({
    where: {
      id: Number(tripId),
    },
    data: {
      places: {
        set: [],
      },
    },
  })
}

const disconnectCountries = async (
  tripId: string | number
) => {
  await prisma.trip.update({
    where: {
      id: Number(tripId),
    },
    data: {
      destinations: {
        set: [],
      },
    },
  })
}

const disconnectLanguages = async (
  tripId: string | number
) => {
  await prisma.trip.update({
    where: {
      id: Number(tripId),
    },
    data: {
      languages: {
        set: [],
      },
    },
  })
}

const removeUnusedMarkers = async () => {
  const findMarkers = await prisma.marker.findMany({
    select: {
      id: true,
      trip: {
        select: {
          id: true,
        },
      },
    },
  })

  const markersToDelete = findMarkers.filter((item: any) => item.trips?.length == 0)

  for (let i = 0; i < markersToDelete.length; i++) {
    await prisma.marker.delete({
      where: {
        id: markersToDelete[i].id,
      },
    })
  }
}

export const updateTrip = async (
  userId: number,
  tripId: number | string,
  {
    languages,
    description,
    title,
    date,
    countries,
    gender,
    markers,
    isAnytime,
    transports,
    isSplitCost,
    itinerary,
    budget,
    maxNrOfPersons,
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
          id: Number(userId),
        },
      },
      itinerary: itinerary,
      budget: budget,
      maxNrOfPersons: Number(maxNrOfPersons),
      ...(!isNullOrUndefined(gender) && !isEmptyString(gender)
        ? {
          gender: {
            connect: {
              gender: gender,
            },
          },
        }
        : {
          gender: {
            connect: {
              gender: 'ANY',
            },
          },
        }),
      description: description,
      title: title,
      splitCosts: isSplitCost,
      isAnytime: Boolean(isAnytime || date?.[0] == null),
      ...(Boolean(isAnytime) == false && date[0] != null
        ? {
          dateFrom: new Date(date[0]).toISOString(),
          dateTo: new Date(date[1]).toISOString(),
        }
        : {
          dateFrom: null,
          dateTo: null,
        }),
      ...(!isNullOrUndefined(countries) && !isEmptyArray(countries)
        ? {
          destinations: {
            connect: countries.map((item: any) => ({code: item})),
          },
        }
        : []),
      languages: {
        connect: languages.map((item: any) => ({name: item})),
      },
      transports: {
        connectOrCreate: transports.map((item: any) => ({where: {name: item}, create: {name: item}})),
      },
      ...(!isNullOrUndefined(markers) && !isEmptyArray(markers)
        ? {
          places: {
            connectOrCreate: markers.map((item: any) => ({
              where: {
                lat_lon: {
                  lon: item?.place[0].toString(),
                  lat: item?.place[1].toString(),
                },
              },
              create: {
                lon: item?.place[0].toString(),
                lat: item?.place[1].toString(),
                description: item.description,
              },
            })),
          },
        }
        : []),
    },
    select: {
      id: true,
    },
  })

  if (!isNullOrUndefined(newTrip)){
    await removeUnusedMarkers()
  }

  return newTrip
}

export const getOneTrip = async (tripId: number | string, userId: number): Promise<Prisma.TripSelect | any> => {
  const findTrip = await getTripById(tripId)

  const trip = await prisma.trip.findFirst({
    where: {
      id: Number(tripId),
      ...(!isNullOrUndefined(userId) &&
      findTrip?.user.id != userId &&
      findTrip?.usersJoinToTrip.find((item: any) => item.user.id == userId) == undefined
        ? {isHidden: false}
        : {}),
    },
    include: {
      places: {
        select: {
          id: true,
          lat: true,
          lon: true,
          description: true,
        },
      },
      destinations: {
        select: {
          id: true,
          name: true,
          code: true,
        },
      },
      transports: {
        select: {
          id: true,
          name: true,
        },
      },
      languages: {
        select: {
          id: true,
          name: true,
        },
      },
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          picture: true,
        },
      },
      comments: {
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              picture: true,
              gender: true,
            },
          },
        },
        orderBy: {
          id: 'desc',
        },
      },
      gender: {
        select: {
          gender: true,
        },
      },
      favoritedBy: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
      usersJoinToTrip: true,
    },
  })

  if (isNullOrUndefined(trip)) {
    throw new ApiError(404, {message: 'Trip not found!'})
  }

  return trip
}

export const deleteTrip = async (tripId: number | string, userId: number, userRole: ROLE): Promise<{ id: number }> => {
  const trip = await getTripById(tripId)

  if (isNullOrUndefined(trip)) {
    throw new ApiError(404, {message: 'Trip not found!'})
  } else if (trip.user.id != userId && userRole != ROLE.ADMIN && userRole != ROLE.MODERATOR) {
    throw new ApiError(403, {message: 'You are not the author of the trip!'})
  }

  await prisma.trip.delete({
    where: {
      id: Number(tripId),
    },
    select: {
      id: true,
    },
  })

  return trip
}

export const getUsersQuery = (search: string) => {
  return {
    OR: [
      {
        OR: [
          {
            user: {
              firstName: {
                contains: search?.split(' ')[0],
              },
            },
          },
          {
            user: {
              firstName: {
                contains: search?.split(' ')[1] ?? search?.split(' ')[0],
              },
            },
          },
        ],
      },
      {
        OR: [
          {
            user: {
              lastName: {
                contains: search?.split(' ')[0],
              },
            },
          },
          {
            user: {
              lastName: {
                contains: search?.split(' ')[1] ?? search?.split(' ')[0],
              },
            },
          },
        ],
      },
    ],
  }
}

export const getTripRequests = async (status: string, userId: number) => {
  if (status == 'ALL') {
    const userJoinning = await prisma.userJoinToTrip.groupBy({
      by: ['status', 'userId'],
      where: {
        OR: [
          {
            status: 'APPROVED',
            userId: Number(userId),
          },
          {
            status: {
              in: 'APPROVED',
            },
            trip: {
              user: {
                id: Number(userId),
              },
            },
          },
          {
            status: 'RECEIVED',
            userId: Number(userId),
          },
          {
            status: {
              in: 'RECEIVED',
            },
            trip: {
              user: {
                id: Number(userId),
              },
            },
          },
          {
            status: 'PENDING',
            userId: Number(userId),
          },
          {
            status: 'PENDING',
            trip: {
              user: {
                id: Number(userId),
              },
            },
          },
        ],
      },
      _count: true,
    })
    return userJoinning
  } else if (status == 'INBOX') {
    const receivedRequests = await prisma.userJoinToTrip.findMany({
      where: {
        OR: [
          {
            status: {
              in: 'PENDING',
            },
            trip: {
              user: {
                id: Number(userId),
              },
            },
          },
          {
            status: {
              in: 'RECEIVED',
            },
            user: {
              id: Number(userId),
            },
          },
        ],
      },
      include: {
        user: {
          select: {
            role: {
              select: {
                role: true,
              },
            },
            picture: {
              select: {
                image: true,
              },
            },
            firstName: true,
            lastName: true,
          },
        },
        trip: {
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
          },
        },
      },
    })

    const pendingRequest = await prisma.userJoinToTrip.findMany({
      where: {
        OR: [
          {
            status: {
              in: 'PENDING',
            },
            userId: Number(userId),
          },
          {
            status: {
              in: 'RECEIVED',
            },
            trip: {
              user: {
                id: Number(userId),
              },
            },
          },
        ],
      },
      include: {
        user: {
          select: {
            role: {
              select: {
                role: true,
              },
            },
            picture: {
              select: {
                image: true,
              },
            },
            firstName: true,
            lastName: true,
          },
        },
        trip: {
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
          },
        },
      },
    })
    return [
      ...receivedRequests.map((item: any) => ({
        ...item,
        type: 'R',
      })),
      ...pendingRequest.map((item: any) => ({
        ...item,
        type: 'P',
      })),
    ].sort((a: any, b: any) => b.id - a.id)
  } else if (status == 'PENDING') {
    const userJoinning = await prisma.userJoinToTrip.findMany({
      where: {
        OR: [
          {
            status: {
              in: status,
            },
            userId: Number(userId),
          },
          {
            status: {
              in: 'RECEIVED',
            },
            trip: {
              user: {
                id: Number(userId),
              },
            },
          },
        ],
      },
      include: {
        user: {
          select: {
            role: {
              select: {
                role: true,
              },
            },
            picture: {
              select: {
                image: true,
              },
            },
            firstName: true,
            lastName: true,
          },
        },
        trip: {
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
          },
        },
      },
    })
    return userJoinning.map((item: any) => ({
      ...item,
      type: 'P',
    }))
  } else if (status == 'RECEIVED') {
    const userJoinning = await prisma.userJoinToTrip.findMany({
      where: {
        OR: [
          {
            status: {
              in: 'PENDING',
            },
            trip: {
              user: {
                id: Number(userId),
              },
            },
          },
          {
            status: {
              in: 'RECEIVED',
            },
            user: {
              id: Number(userId),
            },
          },
        ],
      },
      include: {
        user: {
          select: {
            role: {
              select: {
                role: true,
              },
            },
            picture: {
              select: {
                image: true,
              },
            },
            firstName: true,
            lastName: true,
          },
        },
        trip: {
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
          },
        },
      },
    })
    return userJoinning.map((item: any) => ({
      ...item,
      type: 'R',
    }))
  } else if (status == 'APPROVED') {
    const userJoinning = await prisma.userJoinToTrip.findMany({
      where: {
        OR: [
          {
            status: {
              in: 'APPROVED',
            },
            trip: {
              user: {
                id: Number(userId),
              },
            },
          },
          {
            status: {
              in: 'APPROVED',
            },
            user: {
              id: Number(userId),
            },
          },
        ],
      },
      include: {
        user: {
          select: {
            role: {
              select: {
                role: true,
              },
            },
            picture: {
              select: {
                image: true,
              },
            },
            firstName: true,
            lastName: true,
          },
        },
        trip: {
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
          },
        },
      },
    })

    return userJoinning.map((item: any) => ({
      ...item,
      type: 'A',
    }))
  } else return []
}

export const changeJoiningTripStatus = async (tripRequestId: number | string, status: string) => {
  const userJoinning = await prisma.userJoinToTrip.update({
    where: {
      id: Number(tripRequestId),
    },
    data: {
      status: status,
    },
    include: {
      user: true,
      trip: {
        include: {
          user: true,
        },
      },
    },
  })

  return {
    newStatus: status,
    status: userJoinning.status,
    receiveUserId: userJoinning.user.id,
    sendUserId: userJoinning.trip.user.id,
  }
}

export const switchTripHideStatus = async (
  tripId: number | string,
  userId: number,
  userRole: string
): Promise<{ id: number }> => {
  const trip = await getTripById(tripId)

  if (isNullOrUndefined(trip)) throw new ApiError(404, {message: 'Trip not found!'})
  else if (trip.user.id != userId && userRole != ROLE.ADMIN && userRole != ROLE.MODERATOR)
    throw new ApiError(403, {message: 'You are not the author of the trip!'})

  await prisma.trip.update({
    where: {
      id: Number(tripId),
    },
    data: {
      isHidden: !trip.isHidden,
    },
  })

  return trip
}
