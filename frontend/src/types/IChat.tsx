import { IMessage } from './IMessage';
import { IUser } from './IUser';

export interface IChat {
  id: string | number;
  chatName: string;
  isGroupChat: boolean;
  latestMessage: IMessage;
  groupAdmin: {
    id: string;
  };
  users: IUser[];
}
