import { Button, Text, XStack, YStack } from 'tamagui';
import ModalSlideUp from '../sheet/ModalSlideUp';
import { Bell, BellDot, RefreshCcw } from '@tamagui/lucide-icons';
import notificationStore from '@/store/notificationStore';
import NotificationItem from './NotificationItem';
import { useEffect, useMemo, useState } from 'react';
import useNotifications from '@/hooks/useNotifications';

type RenderNotificationsProps = {
  notifications: INotification[];
  qty: number;
  isEmpty: boolean;
  closeNotifications: () => void;
};

export const RenderNotifications = ({
  notifications,
  qty,
  closeNotifications,
  isEmpty,
}: RenderNotificationsProps) => {
  const { refreshNotifications } = useNotifications();

  return (
    <>
      <XStack w="100%" jc={'flex-end'}>
        <Button
          size={'$3'}
          onPress={refreshNotifications}
          pos={'absolute'}
          top={-20}
          right={0}
        >
          <Button.Icon>
            <RefreshCcw size={14} />
          </Button.Icon>
          <Text pt={0.5} fontFamily={'AfacadBlack'}>
            Refresh
          </Text>
        </Button>
      </XStack>
      <YStack
        w={'100%'}
        gap={'$2'}
        borderWidth={1}
        borderRadius="$4"
        backgroundColor="$background"
        borderColor={!isEmpty ? '$borderColor' : '$transparent'}
        flexShrink={0}
      >
        {isEmpty ? (
          <YStack ai={'center'} jc={'center'} py="$20" gap="$8" w={'100%'}>
            <Text
              fontFamily={'AfacadBold'}
              tt={'uppercase'}
              fontSize={50}
              color={'$orange9'}
              textAlign="center"
            >
              No Notifications
            </Text>
          </YStack>
        ) : (
          notifications.map((notification, index) => {
            return (
              <NotificationItem
                key={notification.id}
                notification={notification}
                last={index === qty - 1}
                cb={closeNotifications}
              />
            );
          })
        )}
      </YStack>
    </>
  );
};

const Notifications = ({
  notifications,
  open,
  setOpen,
  closeNotifications,
}: {
  notifications: INotification[];
  open: boolean;
  setOpen: (open: boolean) => void;
  closeNotifications: () => void;
}) => {
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

  const activeNotifStyles = { backgroundColor: '$orange10', color: '$black1' };
  return (
    <ModalSlideUp
      open={open}
      setOpen={setOpen}
      triggerButtonProps={dot ? activeNotifStyles : undefined}
      triggerButtonContent={
        <Button asChild>
          <Button.Icon>
            {dot ? <BellDot size={16} /> : <Bell size={16} />}
          </Button.Icon>
        </Button>
      }
      modalContent={
        <RenderNotifications
          notifications={sortedNotifications}
          qty={qty}
          isEmpty={isEmpty}
          closeNotifications={closeNotifications}
        />
      }
    />
  );
};

export default Notifications;
