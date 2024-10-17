import UserCard from '@/components/shared/UserCard';
import { XStack } from 'tamagui';

type LikerItemProps = {
  liker: IUserSmall;
  last?: boolean;
};

const LikerItem = ({ liker: { email, id, name }, last }: LikerItemProps) => {
  return (
    <XStack
      borderBottomColor={!last ? '$borderColor' : '$colorTransparent'}
      borderBottomWidth={1}
      theme={'dark'}
      w={'100%'}
    >
      <UserCard email={email} name={name} textColor="$orange10" size={14} />
    </XStack>
  );
};

export default LikerItem;
