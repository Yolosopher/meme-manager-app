import { Redirect, router, Tabs } from 'expo-router';
import {
  Button,
  PortalProvider,
  ScrollView,
  useTheme,
  View,
  XStack,
} from 'tamagui';
import {
  Bell,
  BellDot,
  CircleUserRound,
  Laugh,
  LogOut,
  Rss,
  StepBack,
  Upload,
  UserPlus2,
} from '@tamagui/lucide-icons';
import useAuthStore from 'hooks/useAuthStore';
import UserCard from 'components/shared/UserCard';
import LogoutButton from '@/components/shared/LogoutButton';
import { useInAppNotifications } from '@/context/InAppNotificationsProvider';

export default function TabLayout() {
  const theme = useTheme();
  const { auth, logout } = useAuthStore();
  const { openNotifications, dot } = useInAppNotifications();
  if (!auth) {
    return <Redirect href="/(auth)" />;
  }
  return (
    <Tabs
      backBehavior="history"
      initialRouteName="memes/index"
      screenOptions={{
        tabBarActiveTintColor: theme.red10.val,
        headerTintColor: theme.white1.val,
        tabBarAllowFontScaling: false,
        tabBarLabelStyle: {
          fontFamily: 'AfacadBlack',
        },
        headerTitleStyle: {
          fontFamily: 'AfacadBlack',
          textTransform: 'capitalize',
          letterSpacing: -0.5,
        },
        headerStyle: {},
        headerLeftContainerStyle: {
          backgroundColor: theme.blue10.val,
          // maxHeight: 20,
          // flexGrow: 0,
        },
        headerRightContainerStyle: {
          // maxHeight: 20,
          // flexGrow: 0,
          backgroundColor: theme.red10.val,
        },
        tabBarStyle: {
          height: 70,
          paddingTop: 10,
          paddingBottom: 20,
        },
        headerRight: () => (
          <Button onPress={openNotifications}>
            <Button.Icon>
              {dot ? <BellDot size={16} /> : <Bell size={16} />}
            </Button.Icon>
          </Button>
        ),
      }}
    >
      <Tabs.Screen
        name="memes/index"
        options={{
          headerTitle: 'Latest Memes',
          title: 'Latest',
          tabBarIcon: ({ color }) => <Rss color={color} />,
        }}
      />
      <Tabs.Screen
        name="mymemes"
        options={{
          headerTitle: 'My memes',
          title: 'My Memes',
          tabBarIcon: ({ color }) => <Laugh color={color} />,
        }}
      />
      <Tabs.Screen
        name="upload"
        options={{
          headerTitle: 'Upload new Meme',
          title: 'Upload',
          tabBarIcon: ({ color }) => <Upload color={color} />,
        }}
      />
      <Tabs.Screen
        name="people/index"
        key={'People'}
        options={{
          headerTitle: 'Follows',
          title: 'Follows',
          tabBarIcon: ({ color }) => <UserPlus2 color={color} />,
        }}
      />
      <Tabs.Screen
        name="index"
        key={'profile'}
        options={{
          headerTitle: auth
            ? () => <UserCard email={auth.email} name={auth.name} />
            : undefined,
          title: 'Profile',
          tabBarIcon: ({ color }) => <CircleUserRound color={color} />,
          headerRight: () => (
            <XStack ai={'center'} gap="$2" mr={'$2'}>
              <LogoutButton logoutHandler={logout}>
                <Button color={'$red10'} bg={theme.red4.val}>
                  <Button.Icon>
                    <LogOut size={16} />
                  </Button.Icon>
                </Button>
              </LogoutButton>
            </XStack>
          ),
        }}
      />
      <Tabs.Screen
        name="memes/[id]/index"
        options={{
          href: null,
          headerTitle: '',
          headerLeft: () => (
            <Button
              color={theme.gray10.val}
              size={'$3.5'}
              onPress={() => router.back()}
              ml={'$2'}
            >
              <Button.Icon>
                <StepBack size={16} />
              </Button.Icon>
            </Button>
          ),
        }}
      />
      <Tabs.Screen
        name="people/[id]/index"
        options={{
          href: null,
          headerTitle: '',
          headerLeft: () => (
            <Button
              color={theme.gray10.val}
              size={'$3.5'}
              onPress={() => router.back()}
              ml={'$2'}
            >
              <Button.Icon>
                <StepBack size={16} />
              </Button.Icon>
            </Button>
          ),
        }}
      />
      <Tabs.Screen
        name="people/myfollowers"
        options={{
          href: null,
          headerTitle: '',
          headerLeft: () => (
            <Button
              color={theme.gray10.val}
              // bg={theme.red4.val}
              size={'$3.5'}
              onPress={() => router.back()}
              ml={'$2'}
            >
              <Button.Icon>
                <StepBack size={16} />
              </Button.Icon>
            </Button>
          ),
        }}
      />
      <Tabs.Screen
        name="people/myfollowings"
        options={{
          href: null,
          headerTitle: '',
          headerLeft: () => (
            <Button
              color={theme.gray10.val}
              // bg={theme.red4.val}
              size={'$3.5'}
              onPress={() => router.back()}
              ml={'$2'}
            >
              <Button.Icon>
                <StepBack size={16} />
              </Button.Icon>
            </Button>
          ),
        }}
      />
    </Tabs>
  );
}
