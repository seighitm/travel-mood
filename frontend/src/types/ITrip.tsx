import { IComment } from './IComment';

export interface ITrip {
  favoritedBy: {
    id: string;
  }[];
  id: string;
  maxNrOfPersons?: string | number;
  currentNrOfPersons?: string | number;
  user: {
    id: number | string;
  };
  title: string;
  languages: {
    name: string;
  }[];
  gender: {
    gender: string;
  };
  budget: string;
  description: string;
  comments: IComment[];
  destinations: {
    name: string;
  }[];
  usersJoinToTrip: {
    status: string;
    userId: string | number;
    id: string | number;
  }[];
  isHidden: boolean;
  updatedAt: Date | string;
  dateFrom: string;
  dateTo: string;
  isAnytime: boolean;
  transports: {
    name: string;
  }[];
  itinerary: string;
  splitCosts: boolean;
  trips: ITrip[];
}
