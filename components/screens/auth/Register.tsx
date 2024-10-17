import Loading from 'components/shared/loader/Loading';
import { useEffect, useState } from 'react';
import { Button, Form, Input, ScrollView, Text, View } from 'tamagui';
import { useToastController } from '@tamagui/toast';
import request from 'request';
import { router } from 'expo-router';

const Register = () => {
  const toast = useToastController();

  const [loading, setLoading] = useState<boolean>(false);

  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleSubmit = async () => {
    setLoading(true);

    const response = await request<boolean>({
      url: '/auth/register',
      method: 'POST',
      body: {
        email,
        name,
        password,
      },
    });
    const emailDefault = email;
    if (response.success === true) {
      setName('');
      setEmail('');
      setPassword('');

      // redirect to login page
      router.push(`/(auth)?email=${emailDefault}`);
    } else {
      toast.show('Failed to login', {
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
    <ScrollView
      keyboardDismissMode="interactive"
      automaticallyAdjustContentInsets
      contentContainerStyle={{
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
      }}
    >
      <Form
        alignItems="center"
        minWidth={300}
        gap="$2"
        w={'96%'}
        flexGrow={0}
        onSubmit={handleSubmit}
        borderWidth={1}
        borderRadius="$4"
        backgroundColor="$background"
        borderColor="$borderColor"
        padding="$8"
        justifyContent="center"
        theme={'dark'}
      >
        <Text fontSize={40} fontFamily={'AfacadBlack'} tt={'uppercase'}>
          Sign Up
        </Text>
        <View width={'100%'} gap={'$2'}>
          <Input
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Input
            value={name}
            onChangeText={setName}
            placeholder="Name"
            autoCapitalize="none"
          />
          <Input
            value={password}
            onChangeText={setPassword}
            placeholder="******"
            secureTextEntry
            autoCapitalize="none"
          />
          <Form.Trigger asChild disabled={loading} bg={'$green10'}>
            <Button icon={loading ? <Loading /> : undefined}>
              <Text fontFamily={'AfacadBlack'} tt={'uppercase'}>
                Create Account
              </Text>
            </Button>
          </Form.Trigger>
        </View>
      </Form>
    </ScrollView>
  );
};

export default Register;
