import { useColorScheme } from 'react-native';
import { TamaguiProvider, type TamaguiProviderProps } from 'tamagui';
import { ToastProvider, ToastViewport } from '@tamagui/toast';
import { CurrentToast } from './CurrentToast';
import { config } from '../tamagui.config';
import SocketProvider from '@/context/SocketProvider';
import PushNotificationProvider from '@/context/PushNotificationProvider';
import * as Notifications from 'expo-notifications';
import InAppNotificationsProvider from '@/context/InAppNotificationsProvider';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export function Provider({
  children,
  ...rest
}: Omit<TamaguiProviderProps, 'config'>) {
  const colorScheme = useColorScheme();

  return (
    <TamaguiProvider config={config} defaultTheme={'dark'} {...rest}>
      <ToastProvider
        swipeDirection="horizontal"
        duration={6000}
        native={
          [
            /* uncomment the next line to do native toasts on mobile. NOTE: it'll require you making a dev build and won't work with Expo Go */
            // 'mobile'
          ]
        }
      >
        <SocketProvider>
          <InAppNotificationsProvider>
            <PushNotificationProvider>{children}</PushNotificationProvider>
          </InAppNotificationsProvider>
        </SocketProvider>
        <CurrentToast />
        <ToastViewport top="$8" left={0} right={0} />
      </ToastProvider>
    </TamaguiProvider>
  );
}
