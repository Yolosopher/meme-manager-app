import { useMemo } from 'react';
import { ListItemFrame, Text, View, XStack, YStack } from 'tamagui';
import AuthorActions from './author-components/AuthorActions';
import Author from './author-components/Author';
import LikesMenu from './likes/LikesMenu';
import { router } from 'expo-router';
import SizedImage from '@/components/shared/SizedImage';

type MemeItemProps = {
  memeData: IMemeWithLikes;
  auth: AuthResult;
  resetCB: () => void;
};

const MemeItem = ({
  auth,
  memeData: {
    description,
    imageUrl,
    title,
    id,
    authorId,
    author,
    likesCount,
    likes,
  },
  resetCB,
}: MemeItemProps) => {
  const isAuthor = useMemo(() => {
    if (auth.id === authorId) return true;
    return false;
  }, [authorId, auth?.id]);

  return (
    <ListItemFrame
      py={'$2'}
      px={'$2.5'}
      zIndex={1}
      borderRadius={'$4'}
      bg={'$red5'}
      flexDirection="column"
      alignItems="stretch"
      overflow="visible"
      position="relative"
    >
      <XStack
        jc={'flex-end'}
        w="100%"
        justifyContent="space-between"
        ai={'center'}
      >
        <Author name={author.name} email={author.email} id={author.id} />
        {isAuthor && (
          <AuthorActions
            authorId={auth.id}
            accessToken={auth.accessToken}
            memeId={id}
            resetCB={resetCB}
          />
        )}
      </XStack>
      <View
        width={'100%'}
        mt={'$3'}
        onPress={() => {
          router.push(`/(tabs)/memes/${id}`);
        }}
        flexShrink={0}
        borderRadius={'$4'}
        mb={'$2'}
        ov={'hidden'}
      >
        <SizedImage imageUrl={imageUrl} />
      </View>
      <YStack justifyContent="space-between" gap={'$4'}>
        <View>
          <Text fontSize={'$6'} mb={'$1'} fontFamily="AfacadBold">
            {title}
          </Text>
          <Text fontFamily="AfacadLight" fontSize={'$3'}>
            {description}
            {/* {`Lorem ipsum dolor sit amet consectetur adipisicing
            elit. Dicta, rerum nisi. At accusamus ut facere, qui tempora sint?
            Ad officia impedit laudantium dolorum tempora similique!`} */}
          </Text>
        </View>

        <View
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          gap={'$2'}
          px={'$2'}
          py={'$3'}
          borderRadius={'$4'}
          bg={'$black3'}
        >
          <LikesMenu
            authId={auth.id}
            authorId={author.id}
            memeId={id}
            likesCount={likesCount}
            likes={likes}
          />
        </View>
      </YStack>
    </ListItemFrame>
  );
};

export default MemeItem;
