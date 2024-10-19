import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import notificationStore from '@/store/notificationStore';
import { SocketContext } from './SocketProvider';
import authStore from '@/store/authStore';
import { PortalHost, PortalProvider } from 'tamagui';
import NotificationsModal from '@/components/shared/sheet/NotificationsModal';

export type InAppNotificationContextType = {
  closeNotifications: () => void;
  openNotifications: () => void;
  markAsRead: (id: number) => void;
  refreshNotifications: () => void;
  dot: boolean;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isEmpty: boolean;
  sortedNotifications: INotification[];
  qty: number;
};

export const InAppNotificationsContext =
  createContext<InAppNotificationContextType | null>(null);

export interface InAppNotificationProviderProps {
  children: React.ReactNode;
}

const InAppNotificationsProvider = ({
  children,
}: InAppNotificationProviderProps) => {
  const auth = authStore((state) => state.auth);
  const [open, setOpen] = useState<boolean>(false);
  const { setNotifications, markAsReadInState, notifications } =
    notificationStore();
  const { emitEvent, subscribeToEvent, unsubscribeFromEvent, isConnected } =
    useContext(SocketContext);

  // helpers

  const refreshNotifications = () => {
    emitEvent('fetch_notifications', { token: auth!.accessToken });
  };

  const markAsRead = (id: number) => {
    emitEvent('mark_as_read', {
      token: auth!.accessToken,
      data: { notificationId: id },
    });
    markAsReadInState(id);
  };

  const closeNotifications = () => {
    setOpen(false);
  };

  const openNotifications = () => {
    setOpen(true);
  };
  // initialize
  useEffect(() => {
    // console.log('initin notifications....');
    if (isConnected) {
      subscribeToEvent<INotification[]>('notifications', (data) => {
        setNotifications(data);
      });
      subscribeToEvent<INotification>('new_notification', (data) => {
        refreshNotifications();
      });
    } else {
      unsubscribeFromEvent('notifications');
      unsubscribeFromEvent('new_notification');
    }

    return () => {
      unsubscribeFromEvent('notifications');
      unsubscribeFromEvent('new_notification');
    };
  }, [isConnected]);

  useEffect(() => {
    if (open) {
      refreshNotifications();
    }
  }, [open]);

  const { qty, dot, sortedNotifications, isEmpty } = useMemo(() => {
    const qty = notifications.length;
    const nonReadNotifQty = notifications.filter((n) => !n.read).length;
    return {
      isEmpty: qty === 0,
      qty,
      dot: nonReadNotifQty > 0,
      sortedNotifications: notifications.sort((a, b) => {
        if (a.read === b.read) {
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        }

        return a.read ? 1 : -1;
      }),
    };
  }, [notifications]);

  return (
    <InAppNotificationsContext.Provider
      value={{
        closeNotifications,
        openNotifications,
        markAsRead,
        refreshNotifications,
        dot,
        open,
        setOpen,
        isEmpty,
        sortedNotifications,
        qty,
      }}
    >
      <NotificationsModal />
      {children}
    </InAppNotificationsContext.Provider>
  );
};

export const useInAppNotifications = (): InAppNotificationContextType => {
  const context = useContext(InAppNotificationsContext);
  if (!context) {
    throw new Error(
      'useInAppNotifications must be used within a InAppNotificationsProvider',
    );
  }

  return context as InAppNotificationContextType;
};

export default InAppNotificationsProvider;
