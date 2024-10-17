type Meme = {
  id: number;
  createdAt: Date | string;
  updatedAt: Date | string;
  authorId: number;
  title: string;
  description: string;
  imageName: string;
  likesCount: number;
};

interface IMeme extends Meme {
  imageUrl: string;
  author: IUserSmall;
}

interface ILiker {
  user: IUserSmall;
}

interface IMemeWithLikes extends IMeme {
  likes: ILiker[];
}
