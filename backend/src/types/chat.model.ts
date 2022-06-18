export interface IChat {
  id: string | number;
  chatName: string;
  isGroupChat: boolean;
  latestMessage: any;
  groupAdmin: any
  users: any;
  receiveUserId?: any;
  newUsers?: any
}

