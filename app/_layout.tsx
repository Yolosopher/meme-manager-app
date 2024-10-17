import '../tamagui-web.css';

import { useContext, useEffect, useState } from 'react';
import { AppStateStatus, StatusBar } from 'react-native';
import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
import { Provider } from './Provider';
import useAuthStore from 'hooks/useAuthStore';
import { SocketContext } from '@/context/SocketProvider';
import authStore from '@/store/authStore';
import { AppState } from 'react-native';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { authenticate, authLoading, auth } = useAuthStore();
  const [afacadLoaded, afacadError] = useFonts({
    Afacad: require('../assets/fonts/afacad/AfacadFlux-Medium.ttf'),
    AfacadBold: require('../assets/fonts/afacad/AfacadFlux-Bold.ttf'),
    AfacadLight: require('../assets/fonts/afacad/AfacadFlux-Light.ttf'),
    AfacadBlack: require('../assets/fonts/afacad/AfacadFlux-Black.ttf'),
  });

  useEffect(() => {
    authenticate();
  }, []);

  // useEffect(() => {
  //   console.log(
  //     moment().format('HH:mm:ss:ms'),
  //     'auth updated to',
  //     auth ? auth.id : null,
  //   );
  // }, [auth]);

  useEffect(() => {
    if ((afacadLoaded || afacadError) && !authLoading) {
      // Hide the splash screen after the fonts have loaded (or an error was returned) and the UI is ready.
      SplashScreen.hideAsync();
    }
  }, [afacadLoaded, afacadError, authLoading]);

  if ((!afacadLoaded && !afacadError) || authLoading) {
    return null;
  }

  return (
    <Providers>
      <RootLayoutNav />
    </Providers>
  );
}

const Providers = ({ children }: { children: React.ReactNode }) => {
  return <Provider>{children}</Provider>;
};

function RootLayoutNav() {
  const [appState, setAppState] = useState<
    'active' | 'background' | 'inactive' | 'unknown' | 'extension'
  >(AppState.currentState);
  const auth = authStore((state) => state.auth);

  // appstate
  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      setAppState(nextAppState);
    };

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    return () => {
      subscription.remove();
    };
  }, []);

  // init socket
  const {
    connectSocket,
    disconnectSocket,
    subscribeToEvent,
    unsubscribeFromEvent,
  } = useContext(SocketContext);

  useEffect(() => {
    if (!connectSocket) {
      return;
    }
    if (auth && appState === 'active') {
      connectSocket(auth.accessToken);
      subscribeToEvent('exception', (data) => {
        console.log('exception', data);
      });
    } else {
      disconnectSocket();
    }

    return () => {
      unsubscribeFromEvent('exception');
      disconnectSocket();
    };
  }, [auth, appState]);

  return (
    <ThemeProvider value={DarkTheme}>
      <StatusBar barStyle={'light-content'} />
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(auth)" />
      </Stack>
    </ThemeProvider>
  );
}
