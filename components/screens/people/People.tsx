import { ScrollView, YStack } from 'tamagui';
import SearchPeopleSection from './sections/SearchPeopleSection';
import MyFollowersSection from './sections/MyFollowersSection';
import MyFollowingsSection from './sections/MyFollowingsSection';

const PeoplePage = () => {
  return (
    <ScrollView
      w={'100%'}
      keyboardDismissMode="interactive"
      automaticallyAdjustKeyboardInsets
      nestedScrollEnabled={true}
    >
      <YStack f={1} gap="$8" px="$6" pt="$5" w={'96%'} maxWidth={450}>
        <MyFollowersSection />
        <MyFollowingsSection />
        <SearchPeopleSection />
      </YStack>
    </ScrollView>
  );
};

export default PeoplePage;
