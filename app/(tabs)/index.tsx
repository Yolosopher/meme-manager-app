import ProfilePage from '@/components/screens/profile/Profile';
import ModalSlideUp from '@/components/shared/sheet/ModalSlideUp';
import { Text, YStack } from 'tamagui';

export default function ProfileScreen() {
  return <ProfilePage />;
}

// <YStack w={'100%'} h="100%">
//   <ModalSlideUp
//     triggerButtonContent={<Text>Heya</Text>}
//     modalContent={<Text>huhuhu</Text>}
//   />
// </YStack>
