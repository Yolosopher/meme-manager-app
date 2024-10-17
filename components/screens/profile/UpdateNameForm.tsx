import Loading from '@/components/shared/loader/Loading';
import request from '@/request';
import authStore from '@/store/authStore';
import { useToastController } from '@tamagui/toast';
import { useState } from 'react';
import { Button, Form, Input, Text, YStack } from 'tamagui';

const UpdateNameForm = () => {
  const toast = useToastController();
  const { auth, setAuth } = authStore();
  const [newName, setNewName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const validate = () => {
    if (!newName) {
      toast.show('Name is required');
      return false;
    }
    if (newName.length < 3) {
      toast.show('Name must be at least 3 characters');
      return false;
    }
    return true;
  };

  const handleNameChange = async () => {
    setLoading(true);

    const validateResult = validate();
    if (!validateResult) {
      setLoading(false);
      return;
    }
    const response = await request<AuthResult>({
      url: '/auth',
      method: 'PUT',
      body: {
        name: newName,
      },
      token: auth?.accessToken,
    });

    if (response.success) {
      toast.show('Name updated successfully');
      setAuth(response.data);
    } else {
      // handle error
      toast.show('Failed to update name', {
        duration: 5000,
        message:
          typeof response.message === 'string'
            ? response.message
            : response.message.join('\n'),
      });
    }
    setLoading(false);
  };

  return (
    <YStack f={1} gap="$8" px="$10" pt="$5" w={'96%'} maxWidth={450}>
      <Form onSubmit={handleNameChange} gap="$2" w="100%">
        <Text
          color={'$orange10'}
          fontFamily={'AfacadBlack'}
          fontSize={32}
          tt={'uppercase'}
        >
          Change Name
        </Text>

        <Input
          value={newName}
          onChangeText={setNewName}
          // accessibilityLanguage="en"
        />

        <Form.Trigger asChild disabled={loading} bg={'$orange10'}>
          <Button icon={loading ? <Loading /> : undefined}>Update</Button>
        </Form.Trigger>
      </Form>
    </YStack>
  );
};

export default UpdateNameForm;
