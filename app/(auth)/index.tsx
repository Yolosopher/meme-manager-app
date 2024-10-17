import Login from 'components/screens/auth/Login';
import { useLocalSearchParams } from 'expo-router';

const LoginScreen = () => {
  const { email } = useLocalSearchParams();
  return <Login emailDefault={email as string} />;
};

export default LoginScreen;
