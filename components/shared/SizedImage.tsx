import { placeholderImage } from '@/constants/PlaceholderImage';
import { useEffect, useState } from 'react';
import { Image } from 'tamagui';

type SizedImageProps = {
  imageUrl: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
};

const SizedImage = ({ imageUrl, objectFit }: SizedImageProps) => {
  const [aspect, setAspect] = useState<string>(`3 / 2`);

  useEffect(() => {
    Image.getSize(imageUrl, (w, h) => {
      setAspect(`${w} / ${h}`);
    });
  }, [imageUrl]);

  return (
    <Image
      source={{ uri: imageUrl }}
      defaultSource={{ uri: placeholderImage }}
      objectFit={objectFit || 'contain'}
      aspectRatio={aspect}
    />
  );
};

export default SizedImage;
