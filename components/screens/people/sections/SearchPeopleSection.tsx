import Loading from '@/components/shared/loader/Loading';
import UserCard from '@/components/shared/UserCard';
import request from '@/request';
import authStore from '@/store/authStore';
import { Search, SearchX } from '@tamagui/lucide-icons';
import { useToastController } from '@tamagui/toast';
import { useMemo, useState } from 'react';

import { Button, Form, Input, Text, View, XStack, YStack } from 'tamagui';

const SearchPeopleSection = () => {
  const auth = authStore((state) => state.auth);
  const toast = useToastController();

  const [refreshing, setRefreshing] = useState<boolean>(false);

  const [search, setSearch] = useState<string>('');
  const [searchedUsersMap, setSearchedUsersMap] = useState<
    Map<number, FoundUser[]>
  >(new Map());
  const [hasNextPage, setHasNextPage] = useState<number>(-1);
  const [total, setTotal] = useState<number>(-1);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const handleSearch = async (pg: number = 1) => {
    if (search.length < 3) {
      toast.show('Search query must be at least 3 characters', {
        duration: 5000,
      });
      return;
    }
    if (!refreshing) {
      setRefreshing(true);
    }
    const url = `/users?per_page=10&search=${search}${
      pg > 1 ? `&page=${pg}` : ''
    }`;
    const response = await request<{
      data: FoundUser[];
      meta: PaginationMeta;
    }>({
      url,
      token: auth!.accessToken,
    });
    if (response.success) {
      const { data, meta } = response.data;
      const { next_page, page } = meta;

      // data handling with map
      const newSearchedUsersMap = new Map(searchedUsersMap);
      newSearchedUsersMap.set(page, data);
      setSearchedUsersMap(newSearchedUsersMap);

      // pagination stuff
      setHasNextPage(next_page ?? -1);
      setTotal(meta.total);
      setCurrentPage(page);
    } else {
      toast.show('Failed to get searched users ', {
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
    setSearch('');
    setSearchedUsersMap(new Map());
    setHasNextPage(-1);
    setTotal(-1);
    setCurrentPage(1);
  };

  const searchResultArr = useMemo(() => {
    return [...searchedUsersMap.values()].reduce((acc, searchedUsers) => {
      return [...acc, ...searchedUsers];
    }, []);
  }, [searchedUsersMap]);

  const handleLoadMore = () => {
    handleSearch(currentPage + 1);
  };

  return (
    <YStack gap="$4" w="100%" h="100%">
      <Form w={'100%'} onSubmit={handleSearch} gap="$2" width="100%">
        <XStack ai={'center'} jc={'space-between'} mt={'$6'}>
          <Text
            ff="AfacadBlack"
            fontSize={40}
            tt="uppercase"
            pb={'$1'}
            color={'$orange10'}
          >
            Search people
          </Text>
          <Button
            size={'$2'}
            bg="$red10"
            onPress={() => {
              if (search.length > 0) {
                reset();
              }
            }}
          >
            <Button.Icon>
              <SearchX size={18} color={'$black1'} />
            </Button.Icon>
          </Button>
        </XStack>
        <XStack gap="$2" ai={'center'}>
          <Input
            flex={1}
            value={search}
            onChangeText={(text) => setSearch(text.toLowerCase())}
            returnKeyType="search"
            onSubmitEditing={() => handleSearch(1)}
            placeholder="Search people"
            enablesReturnKeyAutomatically
          />

          <Form.Trigger asChild disabled={refreshing} bg={'$orange10'}>
            <Button gap={0} icon={refreshing ? <Loading /> : undefined}>
              <Button.Icon>
                <Search size={16} />
              </Button.Icon>
              <Button.Text>
                <Text fontFamily={'AfacadBlack'} fontSize={15}>
                  Search
                </Text>
              </Button.Text>
            </Button>
          </Form.Trigger>
        </XStack>
      </Form>
      <View w={'100%'} minHeight={100} pb={'$4'}>
        {total === 0 ? (
          <YStack
            flex={1}
            ai={'center'}
            jc={'center'}
            bg={'$red6'}
            br={'$4'}
            p={'$2'}
          >
            <Text fontFamily={'AfacadBlack'} fontSize={30}>
              No users found!
            </Text>
          </YStack>
        ) : (
          <YStack gap={'$2'}>
            {searchResultArr.map(({ email, id, name }) => (
              <UserCard key={id} email={email} name={name} id={id} />
            ))}
            {hasNextPage > -1 && (
              <Button onPress={handleLoadMore} disabled={refreshing}>
                <Button.Text>Load More</Button.Text>
              </Button>
            )}
          </YStack>
        )}
      </View>
    </YStack>
  );
};

export default SearchPeopleSection;
