import request from '@/request';
import authStore from '@/store/authStore';
import { useToastController } from '@tamagui/toast';
import { useEffect, useState } from 'react';
import { Button, Spinner, Text, XStack, YStack } from 'tamagui';

type TargetProfileActionsProps = {
  targetId: number;
  name: string;
};

const TargetProfileActions = ({
  targetId,
  name,
}: TargetProfileActionsProps) => {
  const toast = useToastController();
  const auth = authStore((state) => state.auth);

  const [followStatus, setFollowStatus] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [firstLoadFinished, setFirstLoadFinished] = useState<boolean>(false);

  const fetchCurrentStatus = async (cb?: () => void) => {
    if (!loading) {
      setLoading(true);
    }
    const response = await request<{ status: boolean }>({
      method: 'GET',
      url: `/follower/status/${targetId}`,
      token: auth!.accessToken,
    });

    if (response.success) {
      setFollowStatus(response.data.status);
    } else {
      toast.show('Failed to fetch follow status', {
        duration: 5000,
        message:
          typeof response.message === 'string'
            ? response.message
            : response.message.join('\n'),
      });
    }
    cb?.();
    setLoading(false);
  };

  const follow = async () => {
    if (!loading) {
      setLoading(true);
    }
    const response = await request<{ status: boolean }>({
      method: 'GET',
      url: `/follower/follow/${targetId}`,
      token: auth!.accessToken,
    });

    if (response.success) {
      setFollowStatus(true);
    } else {
      toast.show('Failed to follow user', {
        duration: 5000,
        message:
          typeof response.message === 'string'
            ? response.message
            : response.message.join('\n'),
      });
    }
    setLoading(false);
  };
  const unfollow = async () => {
    if (!loading) {
      setLoading(true);
    }
    const response = await request<{ status: boolean }>({
      method: 'GET',
      url: `/follower/unfollow/${targetId}`,
      token: auth!.accessToken,
    });

    if (response.success) {
      setFollowStatus(false);
    } else {
      toast.show('Failed to unfollow user', {
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
    fetchCurrentStatus(() => setFirstLoadFinished(true));
  }, [targetId]);

  return (
    <YStack mt="$6" f={1} gap="$8" px="$10" pt="$5" w={'96%'} maxWidth={450}>
      <XStack w={'100%'}>
        <Button
          size={'$4'}
          bg={'$orange10'}
          ai={'center'}
          disabled={loading || !firstLoadFinished}
          onPress={followStatus ? unfollow : follow}
        >
          {loading && (
            <Button.Icon>
              <Spinner />
            </Button.Icon>
          )}
          {firstLoadFinished && (
            <Button.Text pt={'$1.5'} fontSize={20} tt="capitalize">
              {followStatus ? 'Unfollow' : 'Follow'} {name.split(' ')[0]}
            </Button.Text>
          )}
        </Button>
      </XStack>
    </YStack>
  );
};

export default TargetProfileActions;
