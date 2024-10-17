type Role = 'USER' | 'ADMIN';

type FoundUser = {
  id: number;
  email: string;
  name: string;
  role: Role;
};
interface AuthResult extends FoundUser {
  accessToken: string;
}

interface DetailedInfo {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
  role: Role;
  _count: {
    myMemes: number;
    followedBy: number;
    following: number;
  };
}

interface IUserSmall {
  id: number;
  email: string;
  name: string;
}
