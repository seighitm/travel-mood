import { IUser } from './IUser';
import { IChat } from './IChat';

export interface IMessage {
  createdAt: string;
  user: IUser;
  content: string;
  userId: string;
  id: string;
  chat?: IChat;
}
