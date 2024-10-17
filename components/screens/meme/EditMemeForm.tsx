import authStore from '@/store/authStore';
import { useToastController } from '@tamagui/toast';
import Loading from 'components/shared/loader/Loading';
import { useEffect, useState } from 'react';
import request from 'request';
import { Button, Form, Input } from 'tamagui';

type EditMemeFormProps = {
  oldTitle: string;
  oldDescription: string;
  memeId: string;
  cb: () => void;
};

const EditMemeForm = ({
  memeId,
  oldTitle,
  oldDescription,
  cb,
}: EditMemeFormProps) => {
  const auth = authStore((state) => state.auth);
  const toast = useToastController();

  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<string[]>([]);

  const [title, setTitle] = useState<string>(oldTitle);
  const [description, setDescription] = useState<string>(oldDescription);

  const validate = () => {
    if (!title) {
      setErrors(['Title is required']);
      return false;
    }
    if (!description) {
      setErrors(['Description is required']);
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    setLoading(true);

    if (!validate()) {
      throw new Error('Validation failed');
    }
    const result = await request<Meme>({
      url: `/memes/${memeId}`,
      method: 'PUT',
      body: {
        title,
        description,
      },
      token: auth!.accessToken,
    });

    if (result.success === true) {
      // redirect to meme page
      toast.show('Meme data updated successfully');
    } else {
      typeof result.message === 'string'
        ? setErrors([result.message])
        : setErrors(result.message as string[]);
    }
    cb();
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
      gap="$2"
      onSubmit={handleSubmit}
      bg="$black1"
      padding="$8"
      w={'100%'}
      theme={'dark'}
      borderWidth={1}
      borderRadius="$4"
      borderColor="$borderColor"
    >
      <Input
        value={title}
        onChangeText={setTitle}
        placeholder="Title"
        autoCapitalize="words"
        keyboardAppearance="dark"
        w={'100%'}
      />
      <Input
        value={description}
        onChangeText={setDescription}
        placeholder="Description"
        autoCapitalize="words"
        keyboardAppearance="dark"
        w={'100%'}
      />
      <Form.Trigger asChild disabled={loading} w={'100%'} bg={'$orange10'}>
        <Button icon={loading ? <Loading /> : undefined}>Update</Button>
      </Form.Trigger>
    </Form>
  );
};

export default EditMemeForm;
