import UserCard from '@/components/shared/UserCard';
import request from '@/request';
import authStore from '@/store/authStore';
import { useIsFocused } from '@react-navigation/native';
import { useToastController } from '@tamagui/toast';
import { useEffect, useMemo, useState } from 'react';
import { Button, ScrollView, Text, XStack, YStack } from 'tamagui';

const MyFollowingsPage = () => {
  const isFocused = useIsFocused();
  const toast = useToastController();
  const auth = authStore((state) => state.auth);
  const [refreshing, setRefreshing] = useState<boolean>(true);

  const [myFollowings, setMyFollowings] = useState<Map<number, IFollower[]>>(
    new Map(),
  );
  const [hasNextPage, setHasNextPage] = useState<number>(-1);
  const [total, setTotal] = useState<number>(-1);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const fetchFollowings = async (pg: number = 1) => {
    if (!refreshing) {
      setRefreshing(true);
    }
    const response = await request<{
      data: IFollower[];
      meta: PaginationMeta;
    }>({
      url: `/follower/following?per_page=10${pg > 1 ? `&page=${pg}` : ''}`,
      token: auth!.accessToken,
    });
    if (response.success) {
      const { data, meta } = response.data;
      const { next_page, page } = meta;

      // data handling with map
      const newFollowingsMap = new Map(myFollowings);
      newFollowingsMap.set(page, data);
      setMyFollowings(newFollowingsMap);

      // pagination stuff
      setHasNextPage(next_page ?? -1);
      setTotal(meta.total);
      setCurrentPage(page);
    } else {
      toast.show('Failed to get followings', {
        duration: 5000,
        message:
          typeof response.message === 'string'
            ? response.message
            : response.message.join('\n'),
      });
    }
    setRefreshing(false);
  };
  const reset = () => {
    setMyFollowings(new Map());
    setHasNextPage(-1);
    setTotal(-1);
    setCurrentPage(1);
  };

  useEffect(() => {
    if (isFocused) {
      reset();
      fetchFollowings();
    } else {
      reset();
    }
  }, [isFocused]);

  const followingsArr = useMemo(() => {
    return [...myFollowings.values()].reduce((acc, followings) => {
      return [...acc, ...followings];
    }, []);
  }, [myFollowings]);

  const handleLoadMore = () => {
    fetchFollowings(currentPage + 1);
  };

  return (
    <ScrollView w={'100%'} automaticallyAdjustKeyboardInsets>
      <YStack f={1} gap="$8" px="$6" pt="$5" w={'96%'} maxWidth={450}>
        <XStack ai={'center'} jc={'space-between'}>
          <Text
            ff="AfacadBlack"
            fontSize={36}
            tt="uppercase"
            color={'$orange10'}
          >
            People I follow
          </Text>
          {total > -1 && (
            <Text fontSize={20}>
              (Total <Text fontFamily={'AfacadBlack'}>{total}</Text>)
            </Text>
          )}
        </XStack>
        <YStack gap={'$2'}>
          {followingsArr.map(({ email, id, name }) => (
            <UserCard key={id} email={email} name={name} id={id} />
          ))}
        </YStack>
        {hasNextPage > -1 && (
          <Button onPress={handleLoadMore} disabled={refreshing}>
            <Button.Text>Load More</Button.Text>
          </Button>
        )}
      </YStack>
    </ScrollView>
  );
};

export default MyFollowingsPage;
