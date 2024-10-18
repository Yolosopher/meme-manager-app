import { useEffect, useMemo, useState } from 'react';
import { useToastController } from '@tamagui/toast';
import authStore from '@/store/authStore';
import request from '@/request';
import { Button, Separator, XStack, YStack } from 'tamagui';
import { Text } from 'tamagui';
import { FlatList, RefreshControl } from 'react-native';
import LikerItem from './LikerItem';

type RenderLikersProps = {
  memeId: number;
};

const RenderLikers = ({ memeId }: RenderLikersProps) => {
  const toast = useToastController();
  const auth = authStore((state) => state.auth!);
  const [refreshing, setRefreshing] = useState<boolean>(true);

  const [likersMap, setLikersMap] = useState<Map<number, IUserSmall[]>>(
    new Map(),
  );
  const [hasNextPage, setHasNextPage] = useState<number>(-1);
  const [total, setTotal] = useState<number>(-1);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const fetchLikers = async (pg: number = 1) => {
    const response = await request<{
      data: IUserSmall[];
      meta: PaginationMeta;
    }>({
      url: `/like/likers/${memeId}${pg > 1 ? `?page=${pg}` : ''}`,
      token: auth?.accessToken,
    });
    if (response.success) {
      const { data, meta } = response.data;
      const { next_page, page } = meta;

      // data handling with map
      const newLikersMap = new Map(likersMap);
      newLikersMap.set(page, data);
      setLikersMap(newLikersMap);

      // pagination stuff
      setHasNextPage(next_page ?? -1);
      setTotal(meta.total);
      setCurrentPage(page);
    } else {
      // toast.show('Failed to get likers', {
      //   duration: 5000,
      //   message:
      //     typeof response.message === 'string'
      //       ? response.message
      //       : response.message.join('\n'),
      // });
    }
    setRefreshing(false);
  };

  const reset = () => {
    setLikersMap(new Map());
    setHasNextPage(-1);
    setTotal(-1);
    setCurrentPage(1);
  };

  useEffect(() => {
    reset();
    fetchLikers();
  }, [memeId]);

  const memoizedLikersArray = useMemo(() => {
    return [...likersMap.values()].reduce((acc, likers) => {
      return [...acc, ...likers];
    }, []);
  }, [likersMap]);

  const handleLoadMore = () => {
    fetchLikers(currentPage + 1);
  };

  return (
    <YStack
      w={'100%'}
      height={'100%'}
      theme={'dark'}
      jc={'center'}
      ai={'center'}
    >
      {total === 0 ? (
        <XStack
          w={'100%'}
          h={'100%'}
          flex={1}
          justifyContent="center"
          alignItems="center"
        >
          <Text
            fontFamily={'AfacadBlack'}
            textTransform="uppercase"
            fontSize={32}
            color={'$red10'}
            flexGrow={0}
            height={50}
          >
            No Likes
          </Text>
        </XStack>
      ) : (
        <FlatList
          scrollEnabled={false}
          contentContainerStyle={{
            paddingBottom: 20,
          }}
          indicatorStyle="white"
          style={{
            gap: 8,
            padding: 10,
            width: '100%',
          }}
          ItemSeparatorComponent={() => <Separator height={20} />}
          ListFooterComponent={
            total > memoizedLikersArray.length && !refreshing ? (
              <Button
                onPress={() => {
                  fetchLikers(currentPage + 1);
                }}
                flexShrink={0}
                height={50}
                my={'$5'}
              >
                Load More
              </Button>
            ) : null
          }
          keyExtractor={(item) => item.id.toString()}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                reset();
                fetchLikers();
              }}
            />
          }
          data={memoizedLikersArray}
          onEndReached={() => {
            if (hasNextPage > 0 && !refreshing) {
              handleLoadMore();
            }
          }}
          renderItem={({ item, index }) => (
            <LikerItem
              key={item.id}
              liker={item}
              last={likersMap.size - 1 === index}
            />
          )}
        />
      )}
    </YStack>
  );
};

export default RenderLikers;
