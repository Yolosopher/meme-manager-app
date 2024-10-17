import MemePage from '@/components/screens/meme/MemePage';
import { useLocalSearchParams } from 'expo-router';

const MemeScreen = () => {
  const { id } = useLocalSearchParams();
  return <MemePage memeId={id as string} />;
};

export default MemeScreen;
