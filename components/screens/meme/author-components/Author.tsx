import UserCard from 'components/shared/UserCard';
import { XStack } from 'tamagui';

type AuthorProps = {
  email: string;
  name: string;
  id: number;
};

const Author = ({ email, name, id }: AuthorProps) => {
  return (
    <XStack
      justifyContent="flex-end"
      top={0}
      left={0}
      zIndex={1}
      borderRadius={'$2'}
      backgroundColor={'$red5'}
    >
      <UserCard name={name} email={email} id={id} />
    </XStack>
  );
};

export default Author;
