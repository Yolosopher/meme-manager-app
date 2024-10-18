import UserCard from 'components/shared/UserCard';
import { XStack } from 'tamagui';

type AuthorProps = {
  email: string;
  name: string;
  id: number;
  bgColor?: string;
  p?: string | number;
};

const Author = ({ email, name, id, bgColor, p }: AuthorProps) => {
  return (
    <XStack
      justifyContent="flex-end"
      top={0}
      left={0}
      zIndex={1}
      borderRadius={'$2'}
      backgroundColor={bgColor || '$red5'}
      padding={p || 0}
    >
      <UserCard name={name} email={email} id={id} />
    </XStack>
  );
};

export default Author;
