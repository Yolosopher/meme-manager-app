import { AlertDialog, Button, XStack, YStack } from 'tamagui';

type ConfirmationProps = {
  triggerContent: React.ReactNode;
  title: string;
  description: string;
  onConfirm: () => Promise<void> | void;
};

const Confirmation = ({
  description,
  title,
  triggerContent,
  onConfirm,
}: ConfirmationProps) => {
  return (
    <AlertDialog>
      <AlertDialog.Trigger asChild>{triggerContent}</AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Overlay
          key="overlay"
          animation="quick"
          opacity={0.8}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <AlertDialog.Content
          bordered
          elevate
          key="content"
          animation={[
            'quick',
            {
              opacity: {
                overshootClamping: true,
              },
            },
          ]}
          enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
          exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
          x={0}
          scale={1}
          opacity={1}
          y={0}
          minHeight={200}
          width={'90%'}
        >
          <YStack height={200} width={'100%'}>
            <YStack flex={1} width={'100%'}>
              <AlertDialog.Title fontSize={40} textTransform="uppercase">
                {title}
              </AlertDialog.Title>
              <AlertDialog.Description>{description}</AlertDialog.Description>
            </YStack>

            <XStack gap="$3" justifyContent="flex-end">
              <AlertDialog.Cancel asChild>
                <Button>Cancel</Button>
              </AlertDialog.Cancel>
              <AlertDialog.Action asChild>
                <Button theme="red" onPress={onConfirm}>
                  Confirm
                </Button>
              </AlertDialog.Action>
            </XStack>
          </YStack>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog>
  );
};

export default Confirmation;
