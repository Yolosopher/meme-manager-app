import { create } from 'zustand';

type NotificationStore = {
  notifications: INotification[];
  setNotifications: (notifications: INotification[]) => void;
  markAsReadInState: (id: number) => void;
};

const notificationStore = create<NotificationStore>((set) => ({
  notifications: [],
  setNotifications: (notifications) => set({ notifications }),
  markAsReadInState: (id: number) => {
    set((state) => ({
      notifications: state.notifications.map((notification) => {
        if (notification.id === id) {
          return { ...notification, read: true };
        }
        return notification;
      }),
    }));
  },
}));

export default notificationStore;
