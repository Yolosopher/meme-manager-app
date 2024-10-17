type NotificationType = 'LIKE' | 'FOLLOW';

type INotification = {
  id: number;
  createdAt: Date;
  userId: number;
  fromUserId: number;
  type: NotificationType;
  memeId: number | null;
  read: boolean;
  fromUser: IUserSmall;
  memeImageUrl?: string;
};
