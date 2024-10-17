import { SocketContext } from '@/context/SocketProvider';
import { useContext, useEffect } from 'react';
import notificationStore from 'store/notificationStore';
import useNotifications from './useNotifications';

const useInitNotifications = () => {
  const { refreshNotifications } = useNotifications();

  const { subscribeToEvent, unsubscribeFromEvent, isConnected } =
    useContext(SocketContext);

  const { setNotifications } = notificationStore();

  useEffect(() => {
    if (isConnected) {
      subscribeToEvent<INotification[]>('notifications', (data) => {
        setNotifications(data);
      });
      subscribeToEvent<INotification>('new_notification', (data) => {
        refreshNotifications();
      });
    }

    return () => {
      unsubscribeFromEvent('notifications');
      unsubscribeFromEvent('new_notification');
    };
  }, []);

  return null;
};

export default useInitNotifications;
