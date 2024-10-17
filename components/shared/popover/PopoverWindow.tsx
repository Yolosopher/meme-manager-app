import { useState } from 'react';
import {
  Adapt,
  Button,
  Input,
  Label,
  Popover,
  PopoverProps,
  PortalProvider,
  XStack,
  YStack,
} from 'tamagui';

const PopoverWindow = ({
  Icon,
  Name,
  content,
  ...props
}: Exclude<PopoverProps, 'open' | 'onOpenChange'> & {
  Icon?: any;
  Name?: string;
  content?: React.ReactNode;
}) => {
  return (
    <PortalProvider>
      <Popover allowFlip {...props}>
        <Popover.Trigger asChild>
          <Button icon={Icon} />
        </Popover.Trigger>
        <Adapt when="sm" platform="touch">
          <Popover.Sheet modal dismissOnSnapToBottom>
            <Popover.Sheet.Frame top={'100%'} padding="$4" height={200}>
              <Adapt.Contents />
            </Popover.Sheet.Frame>
            <Popover.Sheet.Overlay
              animation="lazy"
              enterStyle={{ opacity: 0 }}
              exitStyle={{ opacity: 0 }}
            />
          </Popover.Sheet>
        </Adapt>
        <Popover.Content
          zIndex={3}
          height={200}
          borderWidth={1}
          borderColor="$borderColor"
          enterStyle={{ y: -10, opacity: 0 }}
          exitStyle={{ y: -10, opacity: 0 }}
          elevate
          animation={[
            'quick',
            {
              opacity: {
                overshootClamping: true,
              },
            },
          ]}
        >
          <Popover.Arrow borderWidth={1} borderColor="$borderColor" />
          <YStack>{content}</YStack>
        </Popover.Content>
      </Popover>
    </PortalProvider>
  );
};

export default PopoverWindow;
