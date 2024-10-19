import MemePage from '@/components/screens/meme/MemePage';
import { useLocalSearchParams } from 'expo-router';
import { PortalProvider } from 'tamagui';

const MemeScreen = () => {
  const { id } = useLocalSearchParams();
  return (
    <PortalProvider>
      <MemePage memeId={id as string} />
    </PortalProvider>
  );
};

export default MemeScreen;
