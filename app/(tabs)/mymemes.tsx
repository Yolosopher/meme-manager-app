import RenderMemes from '@/components/screens/meme/RenderMemes';
import authStore from '@/store/authStore';

const MyMemesScreen = () => {
  const auth = authStore((state) => state.auth!);
  return <RenderMemes authorId={auth.id} />;
};

export default MyMemesScreen;
