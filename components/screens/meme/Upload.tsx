import { useToastController } from '@tamagui/toast';
import Loading from 'components/shared/loader/Loading';
import { useEffect, useRef, useState } from 'react';
import request from 'request';
import { Button, Form, H4, Image, Input, Text, View } from 'tamagui';
import * as ImagePicker from 'expo-image-picker';
import authStore from '@/store/authStore';

const Upload = () => {
  const auth = authStore((state) => state.auth);
  const toast = useToastController();

  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<string[]>([]);

  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  const [image, setImage] = useState<ImagePicker.ImagePickerAsset | null>(null);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };
  const pickImageRef = useRef(null);

  const validate = () => {
    if (!title) {
      setErrors(['Title is required']);
      return false;
    }
    if (!description) {
      setErrors(['Description is required']);
      return false;
    }
    if (!image) {
      setErrors(['Image is required']);
      return false;
    }
    return true;
  };
  const handleSubmit = async () => {
    setLoading(true);

    if (!validate()) {
      setLoading(false);
      return;
    }
    const result = await request<Meme>({
      url: '/memes/base64',
      method: 'POST',
      body: {
        title,
        description,
        fileName: image!.fileName,
        mimeType: image!.mimeType,
        base64String: image!.base64,
      },
      token: auth!.accessToken,
    });

    if (result.success === true) {
      // redirect to meme page
      toast.show('Meme uploaded successfully');
      setTitle('');
      setDescription('');
      setImage(null);
    } else {
      typeof result.message === 'string'
        ? setErrors([result.message])
        : setErrors(result.message as string[]);
    }

    setLoading(false);
  };
  useEffect(() => {
    let timeout: null | NodeJS.Timeout = null;
    if (errors.length) {
      errors.forEach((error) => {
        toast.show(error, {
          duration: 5000,
          burntOptions: {
            preset: 'error',
            from: 'bottom',
          },
        });
      });
      timeout = setTimeout(() => {
        setErrors([]);
      }, 5001);
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [errors]);

  return (
    <Form
      alignItems="center"
      minWidth={300}
      gap="$2"
      onSubmit={handleSubmit}
      backgroundColor="$background"
      borderColor="$borderColor"
      padding="$8"
      justifyContent="center"
      theme={'dark'}
      height={'100%'}
    >
      <Text ff="AfacadBlack" fontSize={40} tt="uppercase" color={'$orange10'}>
        New meme
      </Text>
      <View width={'100%'} gap={'$3'} py={20}>
        <Input
          value={title}
          onChangeText={setTitle}
          placeholder="Title"
          autoCapitalize="words"
          keyboardAppearance="dark"
        />
        <Input
          value={description}
          onChangeText={setDescription}
          placeholder="Description"
          autoCapitalize="words"
          keyboardAppearance="dark"
        />

        <Button onPress={pickImage} ref={pickImageRef}>
          Pick an image from camera roll
        </Button>
        {image && <Image source={{ uri: image.uri, height: 200 }} />}

        <Form.Trigger asChild disabled={loading} bg={'$orange10'}>
          <Button bg="$orange10" icon={loading ? <Loading /> : undefined}>
            Upload new meme
          </Button>
        </Form.Trigger>
      </View>
    </Form>
  );
};

export default Upload;
