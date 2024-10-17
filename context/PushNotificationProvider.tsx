import { registerForPushNotificationsAsync } from '@/utils/registerForPushNotificationsAsync';
import * as Notifications from 'expo-notifications';
import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface NotificationContextType {
  expoPushToken: string | null;
  lastNotificationId: number | null;
  error: Error | null;
}
const LAST_PUSH_NOTIFICATION_ID = 'lastPushNotificationId';
const NotificationContext = createContext<NotificationContextType | null>(null);

export const usePushNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      'usePushNotification must be used within a NotificationProvider',
    );
  }

  return context as NotificationContextType;
};

interface NotificationProviderProps {
  children: React.ReactNode;
}

const PushNotificationProvider = ({ children }: NotificationProviderProps) => {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [lastNotificationId, setLastNotificationId] = useState<number | null>(
    null,
  );
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    registerForPushNotificationsAsync().then(
      (token) => setExpoPushToken(token),
      (err) => setError(err),
    );

    const checkInitialNotification = async () => {
      const lastNotificationResponse =
        await Notifications.getLastNotificationResponseAsync();
      if (lastNotificationResponse) {
        // console.log(
        //   'Notification clicked while app was killed:',
        //   JSON.stringify(
        //     lastNotificationResponse.notification.request.content.data,
        //     null,
        //     2,
        //   ),
        // );
        const data = lastNotificationResponse.notification.request.content.data;
        if (data && data.notificationId) {
          const findInAsyncStorage = await AsyncStorage.getItem(
            LAST_PUSH_NOTIFICATION_ID,
          );
          if (!findInAsyncStorage) {
            await AsyncStorage.setItem(
              LAST_PUSH_NOTIFICATION_ID,
              data.notificationId.toString(),
            );
            setLastNotificationId(data.notificationId);
          } else if (findInAsyncStorage !== data.notificationId.toString()) {
            await AsyncStorage.setItem(
              LAST_PUSH_NOTIFICATION_ID,
              data.notificationId.toString(),
            );
            setLastNotificationId(data.notificationId);
          }
        }

        // Handle the notification click data from app being opened
      }
    };
    checkInitialNotification();
  }, []);

  return (
    <NotificationContext.Provider
      value={{ expoPushToken, lastNotificationId, error }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export default PushNotificationProvider;
