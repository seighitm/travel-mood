import { IUser } from './IUser';

export interface IComment {
  id: number;
  createdAt: Date;
  updatedAt?: Date;
  comment: string;
  user: IUser;
}
