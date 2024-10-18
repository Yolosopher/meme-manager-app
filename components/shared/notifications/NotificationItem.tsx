import { Image, Text, View, XStack, YStack } from 'tamagui';
import UserCard from '../UserCard';
import { router } from 'expo-router';
import authStore from '@/store/authStore';
import { Bell, BellDot, ThumbsUp } from '@tamagui/lucide-icons';
import moment from 'moment';
import { placeholderImage } from '@/constants/PlaceholderImage';
import { usePushNotification } from '@/context/PushNotificationProvider';
import { useEffect } from 'react';
import { useInAppNotifications } from '@/context/InAppNotificationsProvider';

type NotificationItemProps = {
  notification: INotification;
  last?: boolean;
  cb?: () => void;
};

const NotificationItem = ({
  notification: {
    createdAt,
    fromUser,
    fromUserId,
    id,
    memeId,
    read,
    type,
    userId,
    memeImageUrl,
  },
  last,
  cb,
}: NotificationItemProps) => {
  const { lastNotificationId } = usePushNotification();
  const { markAsRead } = useInAppNotifications();

  const handlePress = () => {
    if (!read) {
      markAsRead(id);
    }

    if (memeId) {
      router.push(`/(tabs)/memes/${memeId}`);
    } else {
      router.push(`/(tabs)/people/${fromUser.id}`);
    }
    cb?.();
  };

  useEffect(() => {
    if (!lastNotificationId) {
      return;
    }
    if (lastNotificationId === id) {
      handlePress();
    }
  }, [lastNotificationId]);
  const message = type === 'LIKE' ? 'liked your meme' : 'followed you';
  return (
    <XStack
      borderBottomColor={!last ? '$borderColor' : '$colorTransparent'}
      borderBottomWidth={1}
      theme={'dark'}
      w={'100%'}
      onPress={handlePress}
      opacity={read ? 0.5 : 1}
      jc={'space-between'}
      ai={'center'}
      px="$4"
      gap="$2"
      pos="relative"
      minHeight={80}
    >
      <YStack py="$2" gap="$2" jc={'space-between'} bg={'$green0'}>
        <XStack gap="$4">
          <View
            w="$6"
            h="$6"
            borderRadius={'$4'}
            jc={'center'}
            ai={'center'}
            ov={'hidden'}
            borderColor={'$borderColor'}
            borderWidth={1}
          >
            {memeId ? (
              <Image
                source={{ uri: memeImageUrl }}
                defaultSource={{ uri: placeholderImage }}
                maskMode="contain"
                height={'100%'}
                width={'100%'}
              />
            ) : !read ? (
              <BellDot color={'$white1'} pt={2} />
            ) : (
              <Bell color={'$white1'} pt={2} />
            )}
          </View>
          <XStack gap="$1.5" ai="center" alignSelf="flex-start">
            <UserCard
              email={fromUser.email}
              name={fromUser.name}
              textColor="$orange10"
              size={14}
            />
            <Text mt={0.5} fontFamily={'AfacadLight'} fontSize={14}>
              {message}
            </Text>
          </XStack>
        </XStack>
      </YStack>
      <Text
        bottom={'$2'}
        left={100}
        pos="absolute"
        color={read ? '$gray7' : '$white1'}
      >
        {moment(createdAt).fromNow()}
      </Text>
    </XStack>
  );
};

export default NotificationItem;
