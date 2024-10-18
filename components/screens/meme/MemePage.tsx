import Loading from 'components/shared/loader/Loading';
import request from 'request';
import { useEffect, useMemo, useState } from 'react';
import { useToastController } from '@tamagui/toast';
import { ScrollView, Text, View, XStack, YStack } from 'tamagui';
import { NativeStackNavigationOptions } from 'react-native-screens/lib/typescript/native-stack/types';
import EditMemeForm from './EditMemeForm';
import authStore from '@/store/authStore';
import SizedImage from '@/components/shared/SizedImage';
import LikesMenu from './likes/LikesMenu';
import { router, useNavigation } from 'expo-router';
import { useIsFocused } from '@react-navigation/native';
import Author from './author-components/Author';
import AuthorActions from './author-components/AuthorActions';

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

  const isAuthor = useMemo(() => {
    if (memeData && auth) {
      if (auth.id === memeData.authorId) return true;
    }
    return false;
  }, [memeData?.authorId, auth?.id]);

  return !memeData || !auth || loading ? (
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
        <XStack
          jc={'flex-end'}
          w="100%"
          justifyContent="space-between"
          ai={'center'}
        >
          <Author
            name={memeData.author.name}
            email={memeData.author.email}
            id={memeData.authorId}
            p={'$2'}
          />
          {isAuthor && (
            <AuthorActions
              authorId={memeData.author.id}
              accessToken={auth.accessToken}
              memeId={memeData.id}
              resetCB={() => router.back()}
              showDelete
            />
          )}
        </XStack>
        <View borderRadius={'$4'} ov={'hidden'}>
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
