import ProfilePage from '@/components/screens/profile/Profile';
import { useLocalSearchParams } from 'expo-router';

const PersonScreen = () => {
  const { id } = useLocalSearchParams();
  return <ProfilePage targetId={+id} />;
};

export default PersonScreen;
