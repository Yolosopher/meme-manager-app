import Loading from '@/components/shared/loader/Loading';
import request from '@/request';
import authStore from '@/store/authStore';
import { useToastController } from '@tamagui/toast';
import { useEffect, useState } from 'react';
import { ScrollView, Text, View, XStack, YStack } from 'tamagui';
import moment from 'moment';
import UpdateNameForm from './UpdateNameForm';
import TargetProfileActions from './TargetProfileActions';
import { RefreshControl } from 'react-native';
import { NativeStackNavigationOptions } from 'react-native-screens/lib/typescript/native-stack/types';
import { useNavigation } from 'expo-router';
import { useIsFocused } from '@react-navigation/native';

type ProfilePageProps = {
  targetId?: number;
};

const ProfilePage = ({ targetId }: ProfilePageProps) => {
  const isFocused = useIsFocused();
  const { setOptions } = useNavigation();
  const toast = useToastController();
  const auth = authStore((state) => state.auth);

  const [refreshing, setRefreshing] = useState<boolean>(true);
  const [detailedInfo, setDetailedInfo] = useState<DetailedInfo | null>(null);

  const getDetailedInfo = async () => {
    if (!refreshing) {
      setRefreshing(true);
    }
    const response = await request<DetailedInfo>({
      url: `/users/detailed${targetId ? `/${targetId}` : ''}`,
      token: auth?.accessToken,
    });

    if (response.success) {
      setDetailedInfo(response.data);
    } else {
      // handle error
      toast.show('Failed to get user details', {
        duration: 5000,
        message:
          typeof response.message === 'string'
            ? response.message
            : response.message.join('\n'),
      });
    }
    setRefreshing(false);
  };

  useEffect(() => {
    getDetailedInfo();
  }, [isFocused, auth?.name, targetId]);

  useEffect(() => {
    if (detailedInfo) {
      setOptions({
        headerTitle: detailedInfo.name,
      } as NativeStackNavigationOptions);
    }
  }, [detailedInfo?.name]);

  return !detailedInfo || refreshing ? (
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
      w={'100%'}
      automaticallyAdjustKeyboardInsets
      refreshControl={<RefreshControl refreshing={refreshing} />}
    >
      <YStack f={1} gap="$8" px="$10" pt="$5" w={'96%'} maxWidth={450}>
        <Text
          fontFamily={'AfacadBlack'}
          fontSize={48}
          color={'$red11'}
          textTransform="uppercase"
        >
          {detailedInfo.name}
        </Text>
        <YStack w={'100%'}>
          <XStack gap={'$1'} w={'100%'}>
            <Text fontFamily={'AfacadBlack'} fontSize={20}>
              Email:
            </Text>
            <Text fontFamily={'AfacadLight'} fontSize={20}>
              {detailedInfo.email}
            </Text>
          </XStack>
          <XStack gap={'$1'} w={'100%'}>
            <Text fontFamily={'AfacadBlack'} fontSize={20}>
              Role:
            </Text>
            <Text fontFamily={'AfacadLight'} fontSize={20}>
              {detailedInfo.role}
            </Text>
          </XStack>
        </YStack>
        <YStack w={'100%'} gap="$1">
          <XStack w={'100%'} gap="$1">
            <Text fontFamily={'AfacadBlack'} fontSize={20}>
              Memes:
            </Text>
            <Text fontFamily={'AfacadLight'} fontSize={20}>
              {detailedInfo._count.myMemes}
            </Text>
          </XStack>
        </YStack>
        <XStack w={'100%'} gap="$1" justifyContent="space-between">
          <XStack gap={'$1'}>
            <Text fontFamily={'AfacadBlack'} fontSize={20}>
              Followers:
            </Text>
            <Text fontFamily={'AfacadLight'} fontSize={20}>
              {detailedInfo._count.followedBy}
            </Text>
          </XStack>
          <XStack gap={'$1'}>
            <Text fontFamily={'AfacadBlack'} fontSize={20}>
              Following:
            </Text>
            <Text fontFamily={'AfacadLight'} fontSize={20}>
              {detailedInfo._count.following}
            </Text>
          </XStack>
        </XStack>
        <YStack w={'100%'} gap="$1">
          <XStack w={'100%'} gap="$1">
            <Text fontFamily={'AfacadBlack'} fontSize={20}>
              Joined:
            </Text>
            <Text fontFamily={'AfacadLight'} fontSize={20}>
              {moment(new Date(detailedInfo.createdAt)).fromNow()}
            </Text>
          </XStack>
        </YStack>
      </YStack>
      {targetId ? (
        <TargetProfileActions
          name={detailedInfo.name}
          targetId={detailedInfo.id}
        />
      ) : (
        <UpdateNameForm />
      )}
    </ScrollView>
  );
};

export default ProfilePage;
