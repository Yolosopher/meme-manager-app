import { Redirect, Tabs } from 'expo-router';
import { useTheme } from 'tamagui';
import { LogIn, UserPlus } from '@tamagui/lucide-icons';
import authStore from '@/store/authStore';

const AuthLayout = () => {
  const auth = authStore((state) => state.auth);
  const theme = useTheme();

  if (auth) {
    return <Redirect href="/(tabs)/memes" />;
  }
  return (
    <Tabs
      screenOptions={{
        headerShown: false,

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
        tabBarStyle: {
          height: 70,
          paddingTop: 10,
          paddingBottom: 20,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Login',
          tabBarIcon: ({ color }) => <LogIn color={color} />,
        }}
      />
      <Tabs.Screen
        name="register"
        options={{
          title: 'Register',
          tabBarIcon: ({ color }) => <UserPlus color={color} />,
        }}
      />
    </Tabs>
  );
};

export default AuthLayout;
