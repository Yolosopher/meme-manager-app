import { useInAppNotifications } from '@/context/InAppNotificationsProvider';
import RenderNotifications from '../notifications/RenderNotifications';
import ModalSlideUp from './ModalSlideUp';

const NotificationsModal = () => {
  const {
    closeNotifications,
    open,
    setOpen,
    sortedNotifications,
    qty,
    isEmpty,
    refreshNotifications,
    markAsRead,
  } = useInAppNotifications();
  return (
    <ModalSlideUp
      open={open}
      setOpen={setOpen}
      modalContent={
        <RenderNotifications
          notifications={sortedNotifications}
          qty={qty}
          isEmpty={isEmpty}
          closeNotifications={closeNotifications}
          refreshNotifications={refreshNotifications}
          markAsRead={markAsRead}
        />
      }
    />
  );
};

export default NotificationsModal;
