import {Profile} from "../models/user.model";
import prisma from "../../prisma/PrismaClient";
import profileSelector from "../selectors/profile.selector";
import ApiError from "../utils/api-error";
import profileMapper from "../mappers/profile.mapper";

export const getProfile = async (
  userId: number | string,
  ownerId: number,
): Promise<Profile> => {
  const profile = await prisma.user.findUnique({
    where: {
      id: Number(userId),
    },
    select: profileSelector,
  });

  if (!profile) {
    throw new ApiError(404, {});
  }

  return profileMapper(profile, ownerId);
};

export const followUser = async (userId: any, ownerUserId: number): Promise<Profile> => {
  // const id = await findUserIdByName(username);

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
  });

  return profileMapper(profile, ownerUserId);
};

export const unfollowUser = async (userId: any, ownerUserId: number): Promise<Profile> => {
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
  });

  return profileMapper(profile, ownerUserId);
};

export const setUserRating =
  async (profileId: any, rating: any, userId: any): Promise<any> => {
    const profileRating = await prisma.userRatings.upsert({
      where: {
        profileId_userId: {
          profileId: Number(profileId),
          userId: userId
        }
      },
      update: {
        rating: Number(rating),
      },
      create: {
        rating: Number(rating),
        profileId: Number(profileId),
        userId: userId
      }
    });

    const userRatings = await prisma.userRatings.findMany({
      where: {
        profileId: Number(profileId)
      }
    })

    const arr = Object.values(userRatings);
    const sum: any = (prev, cur) => ({rating: prev.rating + cur.rating});
    const avg = arr.reduce(sum).rating / arr.length;

    await prisma.user.update({
      where: {
        id: Number(profileId)
      },
      data: {
        rating: avg
      }
    })

    return Math.floor(avg);
  };

