import { Button, Text, XStack, YStack } from 'tamagui';
import { RefreshCcw } from '@tamagui/lucide-icons';
import NotificationItem from './NotificationItem';
import { useInAppNotifications } from '@/context/InAppNotificationsProvider';

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
  const { refreshNotifications } = useInAppNotifications();

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

export default RenderNotifications;
