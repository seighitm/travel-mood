import {Marker} from "@prisma/client";
import prisma from "../../prisma/PrismaClient";

export const getAllMarkers = async (): Promise<{ places: any[], destinations: any[] }> => {
  const places = await prisma.marker.findMany({
    where:{
      trip:{
        isHidden: false
      }
    },
    include: {
      trip: {
        select: {
          id: true,
          description: true
        }
      }
    }
  })

  const destinations = await prisma.countries.findMany({
    include: {
      articles: {
        select: {
          id: true
        }
      },
      trips: {
        select: {
          id: true
        }
      },
      interestedInBy: {
        select: {
          id: true
        }
      },
      visitedBy: {
        select: {
          id: true
        }
      }
    }
  })

  return {
    places,
    destinations
  }
}

export const getMarkerById = async (
  markerId: string | number
): Promise<any> => {
  return await prisma.marker.findUnique({
    where: {
      id: Number(markerId)
    },
    select: {
      trip: {
        select: {
          id: true,
          title: true,
          places: {
            select: {
              id: true,
              description: true,
              lat: true,
              lon: true
            }
          }
        }
      },
    }
  })
}

export const createMarker = async (
  markerPayload: any,
  description: string,
): Promise<Marker> => {
  const cord = markerPayload.split(",")
  return await prisma.marker.upsert({
    where: {
      lat_lon: {
        lon: cord[0],
        lat: cord[1]
      }
    },
    update: {},
    create: {
      lon: cord[0],
      lat: cord[1],
      description: description,
    }
  })
}
