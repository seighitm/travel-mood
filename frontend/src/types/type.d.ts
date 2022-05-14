interface InfoProps {
  userId: string;
  username: string;
  phone: string;
  desc: string;
}

interface MenuProps {
  id: string;
  path: string;
  title: string;
}

type RolesProps = 1 | 2 | 3;

interface UserProps {
  username: string;
  password: string;
  phone: string;
  roles: RolesProps[];
  token: string;
}

export type StateProps = {
  user?: any | null;
  onlineUsers?: any[];
  setOnlineUsers?: (id: any) => void;
  list?: any[];
  isLoading?: boolean;
  login?: (val: any) => void;
  setUser?: (val: string) => void;
  setLoading?: (val: boolean) => void;
  getList?: () => void;
  removeList?: (id: string) => void;
  editList?: (params: any) => void;
  addList?: (params: any) => void;
  setEditItem?: (params: any) => void;
  articles?: any[];
  setArticles?: (params: any) => void;
};
