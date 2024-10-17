import Loading from 'components/shared/loader/Loading';
import request from 'request';
import { useEffect, useState } from 'react';
import { useToastController } from '@tamagui/toast';
import { ScrollView, Text, View, YStack } from 'tamagui';
import { NativeStackNavigationOptions } from 'react-native-screens/lib/typescript/native-stack/types';
import EditMemeForm from './EditMemeForm';
import authStore from '@/store/authStore';
import SizedImage from '@/components/shared/SizedImage';
import LikesMenu from './likes/LikesMenu';
import { useNavigation } from 'expo-router';
import { useIsFocused } from '@react-navigation/native';

type MemePageProps = {
  memeId: string;
};

const MemePage = ({ memeId }: MemePageProps) => {
  const isFocused = useIsFocused();
  const { setOptions } = useNavigation();
  const toast = useToastController();
  const auth = authStore((state) => state.auth);
  const [memeData, setMemeData] = useState<IMemeWithLikes | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const getMemeData = async (memeId: string) => {
    if (!loading) {
      setLoading(true);
    }

    const resposne = await request<IMemeWithLikes>({
      url: `/memes/${memeId}?populate=true`,
      token: auth!.accessToken,
    });

    if (resposne.success) {
      setMemeData(resposne.data);
    } else {
      // handle error
      toast.show('Failed to fetch meme data', {
        type: 'error',
        duration: 5000,
        message:
          typeof resposne.message === 'string'
            ? resposne.message
            : resposne.message.join('\n'),
      });
    }

    setLoading(false);
  };

  useEffect(() => {
    getMemeData(memeId);
  }, [isFocused]);

  useEffect(() => {
    if (memeData) {
      setOptions({
        headerTitle: memeData.title,
      } as NativeStackNavigationOptions);
    }
  }, [memeData?.title]);

  return !memeData || loading ? (
    <View
      height={'100%'}
      width={'100%'}
      justifyContent="center"
      alignItems="center"
    >
      <Loading />
    </View>
  ) : (
    <ScrollView
      automaticallyAdjustKeyboardInsets
      keyboardDismissMode="interactive"
      w="100%"
    >
      <YStack p={'$4'} gap={'$4'}>
        <View borderRadius={'$4'}>
          <SizedImage imageUrl={memeData.imageUrl} objectFit="contain" />
        </View>
        <Text fontFamily={'AfacadBlack'} fontSize={30}>
          {memeData.title}
        </Text>
        <Text fontFamily={'AfacadLight'} fontSize={22}>
          {memeData.description}
        </Text>
        <View
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          gap={'$2'}
          px={'$3'}
          py={'$3'}
          borderRadius={'$4'}
          bg={'$red3'}
        >
          <LikesMenu
            authId={auth!.id}
            authorId={memeData.authorId}
            memeId={memeData.id}
            likesCount={memeData.likesCount}
            likes={memeData.likes}
          />
        </View>
        {memeData.authorId === auth?.id && (
          <EditMemeForm
            memeId={memeId}
            oldTitle={memeData.title}
            oldDescription={memeData.description}
            cb={() => getMemeData(memeId)}
          />
        )}
      </YStack>
    </ScrollView>
  );
};

export default MemePage;
