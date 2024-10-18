import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import notificationStore from '@/store/notificationStore';
import { SocketContext } from './SocketProvider';
import authStore from '@/store/authStore';
import { RenderNotifications } from '@/components/shared/notifications/RenderNotifications';
import ModalSlideUp from '@/components/shared/sheet/ModalSlideUp';
import { Button, PortalProvider } from 'tamagui';
import { Bell, BellDot } from '@tamagui/lucide-icons';

const activeNotifStyles = { backgroundColor: '$orange10', color: '$black1' };

type InAppNotificationContextType = {
  closeNotifications: () => void;
  openNotifications: () => void;
  markAsRead: (id: number) => void;
  refreshNotifications: () => void;
  dot: boolean;
};

const InAppNotificationsContext =
  createContext<InAppNotificationContextType | null>(null);

interface InAppNotificationProviderProps {
  children: React.ReactNode;
}

export const useInAppNotifications = (): InAppNotificationContextType => {
  const context = useContext(InAppNotificationsContext);
  if (!context) {
    throw new Error(
      'useInAppNotifications must be used within a InAppNotificationsProvider',
    );
  }

  return context as InAppNotificationContextType;
};

const InAppNotificationsProvider = ({
  children,
}: InAppNotificationProviderProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const { setNotifications, markAsReadInState, notifications } =
    notificationStore();
  const { emitEvent, subscribeToEvent, unsubscribeFromEvent, isConnected } =
    useContext(SocketContext);
  const auth = authStore((state) => state.auth);

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
    console.log('initin notifications....');
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
      }}
    >
      <Button style={dot ? activeNotifStyles : undefined}>
        <Button.Icon>
          {dot ? <BellDot size={16} /> : <Bell size={16} />}
        </Button.Icon>
      </Button>
      <PortalProvider shouldAddRootHost>
        <ModalSlideUp
          open={open}
          setOpen={setOpen}
          modalContent={
            <RenderNotifications
              notifications={sortedNotifications}
              qty={qty}
              isEmpty={isEmpty}
              closeNotifications={closeNotifications}
            />
          }
        />
      </PortalProvider>
      {children}
    </InAppNotificationsContext.Provider>
  );
};

export default InAppNotificationsProvider;
