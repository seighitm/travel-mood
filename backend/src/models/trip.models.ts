import {Prisma} from "@prisma/client";

export interface Trip {
  id: number,
  tripFavoritedBy: any,
  countries: string[],
  languages: string[],
  description: string,
  title: string,
  isAnytime: boolean | string,
  date: string[],
  budget: string,
  itinerary: string,
  gender: any,
  isSplitCost: boolean,
  destinations: {countryCode: string, countryName: string}[] & string,
  transports: string[],
  markers: any[],
  page: number | string,
}

export type TripFindRequestPayload = Pick<Trip, 'page' | 'destinations'| 'budget'| 'date'| 'languages'| 'gender'>;


export type TripFavoriteResponse = Pick<Trip, 'id' | 'tripFavoritedBy'>;

export type TripValidatorPayload = Pick<Trip, 'title' | 'description' | 'languages' | 'countries'>;

export interface TripFindResponse {
  trips: Prisma.TripSelect[] | any,
  totalTripsCount: number,
  tripsOnPageCount: number
}


interface TripComment {
  id: number,
}

export type CommentResponse = Pick<TripComment, 'id'>;

interface JoinTripRequests {
  id: number,
  status: string,
  receiveUserId?: string | number
  userId: number,
  comment: string,
  user: { id: number },
  trip: { id: number },
}

export type JoinRequestResponse = Pick<JoinTripRequests, 'id' | 'status' | 'receiveUserId' | 'user' | 'trip'>;
export type JoinRequestPayload = Pick<JoinTripRequests, 'userId' | 'comment' | 'receiveUserId'>;
