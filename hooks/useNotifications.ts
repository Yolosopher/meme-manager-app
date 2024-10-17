import { SocketContext } from '@/context/SocketProvider';
import { useContext } from 'react';
import authStore from 'store/authStore';
import notificationStore from 'store/notificationStore';

const useNotifications = () => {
  const auth = authStore((state) => state.auth);

  const { emitEvent } = useContext(SocketContext);

  const { markAsReadInState } = notificationStore();

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

  return { refreshNotifications, markAsRead };
};

export default useNotifications;
