import { IArticle } from './IArticle';

export interface IUser {
  picture: string;
  name: string;
  aboutMe: string;
  images?: any;
  id: number;
  visitedCountries?: any[];
  tripFavoritedBy?: IUser[];
  onlineUsers: any;
  myRatings: any[];
  trips: any[];
  isFollowedByUser: boolean;
  role: any;
  folloers: any[];
  followedBy?: {
    id: string | number;
  }[];
  following: any;
  rating?: string | number | any;
  birthday?: string;
  country?: {
    name: string;
  };
  gender?: {
    gender: string;
  };
  languages?: {
    name: string;
  }[];
  articles?: IArticle[];
  favoritedArticle?: IArticle[];
}
