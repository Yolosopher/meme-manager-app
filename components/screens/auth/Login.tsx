import Loading from 'components/shared/loader/Loading';
import { useEffect, useState } from 'react';
import { Button, Form, Input, ScrollView, Text, View } from 'tamagui';
import { useToastController } from '@tamagui/toast';
import request from 'request';
import useAuthStore from 'hooks/useAuthStore';
import { usePushNotification } from '@/context/PushNotificationProvider';

const Login = ({ emailDefault }: { emailDefault?: string }) => {
  const { expoPushToken, error } = usePushNotification();
  const { login } = useAuthStore();
  const toast = useToastController();

  const [loading, setLoading] = useState<boolean>(false);

  const [email, setEmail] = useState<string>(emailDefault || '');
  const [password, setPassword] = useState<string>('');

  useEffect(() => {
    if (emailDefault) {
      toast.show('Registered successfully, please login', {
        duration: 5000,
        viewportName: 'bottom',
      });
    }
  }, [emailDefault]);

  const handleSubmit = async () => {
    setLoading(true);

    const response = await request<AuthResult>({
      url: '/auth/login',
      method: 'POST',
      body: {
        email,
        password,
        pushToken: expoPushToken,
      },
    });

    if (response.success === true) {
      login(response.data);
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

  if (error) {
    return <Text w={'100%'}>{error.message}</Text>;
  }
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
        borderColor="$borderColor"
        backgroundColor="$background"
        padding="$8"
        justifyContent="center"
        alignContent="center"
        theme={'dark'}
      >
        <Text fontSize={40} fontFamily={'AfacadBlack'} tt={'uppercase'}>
          Sign In
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
            value={password}
            onChangeText={setPassword}
            placeholder="******"
            secureTextEntry
            autoCapitalize="none"
          />

          <Form.Trigger asChild disabled={loading} bg={'$orange10'}>
            <Button icon={loading ? <Loading /> : undefined}>
              <Text fontFamily={'AfacadBlack'} tt={'uppercase'}>
                Login
              </Text>
            </Button>
          </Form.Trigger>
        </View>
      </Form>
    </ScrollView>
  );
};

export default Login;
