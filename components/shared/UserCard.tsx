import { router } from 'expo-router';
import { getAvatarUrl } from 'lib/avatarUrl';
import { Card, Circle, Image, Text } from 'tamagui';

type UserCardProps = {
  email: string;
  name: string;
  style?: React.CSSProperties;
  textColor?: string;
  fontFamily?: string;
  size?: number;
};

const UserCard = ({
  email,
  name,
  id,
  style,
  textColor,
  fontFamily,
  size,
}: UserCardProps & { id?: number }) => {
  const avatarUrl = getAvatarUrl(email);
  return (
    <Card
      flexDirection="row"
      gap="$2"
      alignItems="flex-start"
      style={style}
      height={'$3'}
      ai={'center'}
      backgroundColor={'$colorTransparent'}
      onPress={id ? () => router.push(`/(tabs)/people/${id}`) : null}
    >
      <Circle overflow="hidden" size={'$2'} aspectRatio={'1/1'}>
        <Image
          width={'100%'}
          height={'100%'}
          source={{ uri: avatarUrl }}
          objectFit="cover"
        />
      </Circle>
      <Text
        fontFamily={'AfacadBlack'}
        color={textColor || '$color'}
        fontSize={size || 20}
      >
        {name}
      </Text>
    </Card>
  );
};

export default UserCard;
