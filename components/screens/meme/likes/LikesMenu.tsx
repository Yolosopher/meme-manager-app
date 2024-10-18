import ModalSlideUp from '@/components/shared/sheet/ModalSlideUp';
import request from '@/request';
import authStore from '@/store/authStore';
import { Heart, ThumbsUp } from '@tamagui/lucide-icons';
import { useToastController } from '@tamagui/toast';
import { useEffect, useState } from 'react';
import { Button, Text, useTheme, View, XStack, YStack } from 'tamagui';
import RenderLikers from './RenderLikers';

type LikesMenuProps = {
  likesCount: number;
  memeId: number;
  authorId: number;
  authId: number;
  likes: ILiker[];
};

const LikesMenu = ({
  authId,
  authorId,
  likesCount,
  memeId,
  likes,
}: LikesMenuProps) => {
  const [openLikes, setOpenLikes] = useState<boolean>(false);
  const auth = authStore((state) => state.auth);
  const toast = useToastController();
  const theme = useTheme();
  const [haveILiked, setHaveILiked] = useState<boolean>(false);
  const [likesCountState, setLikesCountState] = useState<number>(likesCount);
  const [loading, setLoading] = useState<boolean>(true);

  const getLikeStatus = async () => {
    if (!loading) {
      setLoading(true);
    }
    const response = await request<{ isLiked: boolean; likesCount: number }>({
      method: 'GET',
      url: `/like/status/${memeId}`,
      token: auth!.accessToken,
    });
    if (response.success) {
      setHaveILiked(response.data.isLiked);
      setLikesCountState(response.data.likesCount);
    } else {
      // toast.show('Failed to get like status', {
      //   duration: 5000,
      //   message:
      //     typeof response.message === 'string'
      //       ? response.message
      //       : response.message.join('\n'),
      // });
    }
    setLoading(false);
  };

  const toggleLike = async () => {
    if (!loading) {
      setLoading(true);
    }
    const response = await request<{ isLiked: boolean; likesCount: number }>({
      method: 'GET',
      url: `/like/toggle/${memeId}`,
      token: auth!.accessToken,
    });

    if (response.success) {
      setHaveILiked(response.data.isLiked);
      setLikesCountState(response.data.likesCount);
    } else {
      toast.show('Failed to like/unlike meme', {
        duration: 5000,
        message:
          typeof response.message === 'string'
            ? response.message
            : response.message.join('\n'),
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    getLikeStatus();
  }, []);
  return (
    <XStack w="100%" gap={'$2'} jc="space-between" ai="center">
      <View height={50} ac={'center'} jc={'center'}>
        <ModalSlideUp
          open={openLikes}
          setOpen={setOpenLikes}
          triggerButtonProps={{
            variant: 'outlined',
            size: '$1',
            gap: '$0',
            borderRadius: '$0',
            borderWidth: '$0',
            disabled: loading,
            color: '$black1',
          }}
          triggerButtonContent={
            <Button asChild>
              <XStack>
                <XStack ai={'center'} gap={6}>
                  <Text
                    mt={3}
                    tt={'uppercase'}
                    lineHeight={22}
                    fontSize={22}
                    fontFamily={'AfacadBlack'}
                    textDecorationLine="underline"
                  >
                    Likes:
                  </Text>
                  <Text
                    fontFamily={'AfacadBlack'}
                    lineHeight={28}
                    fontSize={28}
                    color={'$red11'}
                  >
                    {likesCountState}
                  </Text>
                </XStack>
              </XStack>
            </Button>
          }
          modalContent={openLikes && <RenderLikers memeId={memeId} />}
        />
      </View>
      <Button
        gap={0}
        disabled={loading}
        onPress={toggleLike}
        bg={haveILiked ? '$red8' : '$white1'}
        width={110}
        borderWidth={2}
        jc={'flex-start'}
        pressStyle={{
          borderColor: theme.red8.val,
          backgroundColor: theme.red8.val,
        }}
      >
        <Button.Icon>
          <ThumbsUp
            color={haveILiked ? '$white8' : '$red11'}
            size={18}
            // fill={haveILiked ? theme$white8.val : 'transparent'}
          />
        </Button.Icon>
        <Text fontSize={18} color={haveILiked ? '$white8' : '$red11'}>
          {haveILiked ? 'Liked' : 'Like'}
        </Text>
      </Button>
    </XStack>
  );
};

export default LikesMenu;
