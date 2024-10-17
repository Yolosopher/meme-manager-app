import { Settings } from '@tamagui/lucide-icons';
import { useToastController } from '@tamagui/toast';
import { router } from 'expo-router';
import request from 'request';
import { Button, Text, XStack } from 'tamagui';

type AuthorActionsProps = {
  memeId: number;
  authorId: number;
  accessToken: string;
  resetCB: () => void;
  showDelete?: boolean;
};

const AuthorActions = ({
  accessToken,
  authorId,
  memeId,
  resetCB,
  showDelete,
}: AuthorActionsProps) => {
  const toast = useToastController();

  const deleteMeme = async () => {
    const response = await request({
      url: `/memes/${memeId}`,
      method: 'DELETE',
      token: accessToken,
    });

    if (response.success) {
      toast.show('Meme deleted successfully', {
        duration: 5000,
      });
      resetCB();
    } else {
      // handle error
      toast.show('Failed to delete meme', {
        duration: 5000,
        message:
          typeof response.message === 'string'
            ? response.message
            : response.message.join('\n'),
      });
    }
  };

  return showDelete ? (
    <Button width={'$7'} height={'$3'} bg={'$red10'} onPress={deleteMeme}>
      <Text>Delete</Text>
    </Button>
  ) : (
    <Button
      size={'$3'}
      bg={'$background'}
      onPress={() => router.push(`/memes/${memeId}`)}
    >
      <Button.Icon>
        <Settings />
      </Button.Icon>
    </Button>
  );
};

export default AuthorActions;
