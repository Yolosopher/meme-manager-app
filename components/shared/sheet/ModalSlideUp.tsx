import { ChevronDown } from '@tamagui/lucide-icons';
import { Sheet } from '@tamagui/sheet';
import { useState } from 'react';

import { Button, YStack } from 'tamagui';

type ModalSlideUpProps = {
  triggerButtonProps?: React.ComponentProps<typeof Button>;
  triggerButtonContent?: React.ReactNode;
  modalContent: React.ReactNode;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const ModalSlideUp = ({
  triggerButtonContent,
  triggerButtonProps,
  modalContent,
  open,
  setOpen,
}: ModalSlideUpProps) => {
  const [position, setPosition] = useState<number>(0);

  return (
    <>
      {triggerButtonContent && (
        <Button {...triggerButtonProps} onPress={() => setOpen((prev) => true)}>
          {triggerButtonContent}
        </Button>
      )}
      <Sheet
        forceRemoveScrollEnabled={open}
        modal={true}
        open={open}
        onOpenChange={setOpen}
        snapPoints={[90]}
        snapPointsMode={'percent'}
        dismissOnSnapToBottom
        position={position}
        onPositionChange={setPosition}
        zIndex={100_000}
        animation="medium"
      >
        <Sheet.Overlay
          animation="medium"
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />

        <Sheet.Handle />
        <Sheet.Frame theme="dark" w={'100%'} alignItems="center">
          <Sheet.ScrollView w={'100%'}>
            <YStack p="$5" gap="$8" w={'100%'} pb="$8">
              <Button
                size="$5"
                circular
                alignSelf="center"
                icon={ChevronDown}
                onPress={() => setOpen(false)}
              />
              {modalContent}
            </YStack>
          </Sheet.ScrollView>
        </Sheet.Frame>
      </Sheet>
    </>
  );
};
export default ModalSlideUp;
