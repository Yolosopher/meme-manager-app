import { useEffect, useMemo, useState } from 'react';
import { FlatList, RefreshControl } from 'react-native';
import request from 'request';
import {
  Button,
  PortalProvider,
  Separator,
  Text,
  View,
  XStack,
  YStack,
} from 'tamagui';
import MemeItem from './MemeItem';
import { useIsFocused } from '@react-navigation/native';
import authStore from '@/store/authStore';
import { useToastController } from '@tamagui/toast';

type RenderMemesProps = {
  authorId?: number;
};

const RenderMemes = ({ authorId }: RenderMemesProps) => {
  const isFocused = useIsFocused();
  const toast = useToastController();
  const auth = authStore((state) => state.auth!);
  const [refreshing, setRefreshing] = useState<boolean>(true);

  const [memesMap, setMemesMap] = useState<Map<number, IMemeWithLikes[]>>(
    new Map(),
  );
  const [hasNextPage, setHasNextPage] = useState<number>(-1);
  const [total, setTotal] = useState<number>(-1);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const fetchMemes = async (pg: number = 1) => {
    const response = await request<{
      data: IMemeWithLikes[];
      meta: PaginationMeta;
    }>({
      url: `/memes?populate=true&${authorId ? `authorId=${authorId}` : ''}${
        pg > 1 ? `&page=${pg}` : ''
      }`,
      token: auth?.accessToken,
    });
    if (response.success) {
      const { data, meta } = response.data;
      const { next_page, page } = meta;

      // data handling with map
      const newMemesMap = new Map(memesMap);
      newMemesMap.set(page, data);
      setMemesMap(newMemesMap);

      // pagination stuff
      setHasNextPage(next_page ?? -1);
      setTotal(meta.total);
      setCurrentPage(page);
    } else {
      // toast.show('Failed to get memes', {
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
    setMemesMap(new Map());
    setHasNextPage(-1);
    setTotal(-1);
    setCurrentPage(1);
  };

  useEffect(() => {
    if (isFocused) {
      reset();
      fetchMemes();
    } else {
      reset();
    }
  }, [isFocused]);

  const memoizedMemesArray = useMemo(() => {
    return [...memesMap.values()].reduce((acc, memes) => {
      return [...acc, ...memes];
    }, []);
  }, [memesMap]);

  const handleLoadMore = () => {
    fetchMemes(currentPage + 1);
  };

  return (
    <PortalProvider>
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
              {auth.id === authorId
                ? 'You have no memes'
                : 'This user has no memes'}
            </Text>
          </XStack>
        ) : (
          <FlatList
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
              total > memoizedMemesArray.length && !refreshing ? (
                <Button
                  onPress={() => {
                    fetchMemes(currentPage + 1);
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
                  fetchMemes();
                }}
              />
            }
            data={memoizedMemesArray}
            onEndReached={() => {
              if (hasNextPage > 0 && !refreshing) {
                handleLoadMore();
              }
            }}
            renderItem={({ item }) => (
              <MemeItem
                auth={auth}
                key={item.id}
                memeData={item}
                resetCB={reset}
              />
            )}
          />
        )}
      </YStack>
    </PortalProvider>
  );
};

export default RenderMemes;
