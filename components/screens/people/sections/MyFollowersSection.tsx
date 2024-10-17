import Loading from '@/components/shared/loader/Loading';
import UserCard from '@/components/shared/UserCard';
import request from '@/request';
import authStore from '@/store/authStore';
import { RefreshCcw } from '@tamagui/lucide-icons';
import { useToastController } from '@tamagui/toast';
import { Link } from 'expo-router';
import { useEffect, useState } from 'react';
import { RefreshControl } from 'react-native';
import { Button, ScrollView, Text, View, XStack, YStack } from 'tamagui';

const MyFollowersSection = () => {
  const toast = useToastController();
  const auth = authStore((state) => state.auth);
  const [refreshing, setRefreshing] = useState<boolean>(true);

  const [myFollowers, setMyFollowers] = useState<IFollower[]>([]);
  const [hasNextPage, setHasNextPage] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(-1);

  const fetchFollowers = async () => {
    if (!refreshing) {
      setRefreshing(true);
    }
    const response = await request<{
      data: IFollower[];
      meta: PaginationMeta;
    }>({
      url: `/follower/followers?per_page=5`,
      token: auth!.accessToken,
    });
    if (response.success) {
      const { data, meta } = response.data;
      const { next_page } = meta;
      setMyFollowers(data);
      setHasNextPage(!!next_page);
      setTotal(meta.total);
    } else {
      toast.show('Failed to get followers', {
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
    fetchFollowers();
  }, []);

  return (
    <YStack gap="$4" w="100%">
      <XStack gap="$2" ai={'center'} jc={'space-between'}>
        <Text ff="AfacadBlack" fontSize={36} tt="uppercase" color={'$orange10'}>
          My Followers
        </Text>
        <Button size={'$3'} onPress={fetchFollowers}>
          <Button.Icon>
            <RefreshCcw size={14} />
          </Button.Icon>
        </Button>
      </XStack>
      <ScrollView w={'100%'}>
        {refreshing ? (
          <View
            height={'100%'}
            width={'100%'}
            justifyContent="center"
            alignItems="center"
          >
            <Loading />
          </View>
        ) : (
          <YStack w={'100%'} gap="$3">
            {myFollowers.map(({ email, id, name }) => (
              <UserCard key={id} email={email} name={name} id={id} />
            ))}
            {hasNextPage && (
              <Link asChild href={`/(tabs)/people/myfollowers`}>
                <Button>
                  <Button.Text>See every follower ({total})</Button.Text>
                </Button>
              </Link>
            )}
          </YStack>
        )}
      </ScrollView>
    </YStack>
  );
};

export default MyFollowersSection;
