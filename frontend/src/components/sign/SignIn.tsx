import React from 'react';
import {
  Anchor,
  Box,
  Button,
  createStyles,
  Group,
  LoadingOverlay,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  TypographyStylesProvider,
} from '@mantine/core';
import {useForm} from '@mantine/form';
import {useNavigate} from 'react-router-dom';
import {useMutateSignIn} from '../../api/auth/mutations';
import {At, Key, Lock} from '../../assets/Icons';
import {isValidEmail} from "../../utils/utils-func";

const useStyles = createStyles((theme) => ({
  container: {
    height: 'calc(100vh - 120px)',
  },
  body: {
    position: 'relative',
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
  },
  themeIcon: {
    position: 'absolute',
    top: 0,
    right: 0
  },
}));

const SignIn = () => {
  const navigate = useNavigate();
  const {mutate: mutateLogin, isLoading: isLoadingLoginMutation} = useMutateSignIn();
  const {classes, theme} = useStyles();

  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },
    validate: {
      password: (value) => {
        if (value?.trim().length <= 8) return 'Password should have at least 8 letters!'
      },
      email: (value) => {
        if (!isValidEmail(value)) return 'Invalid email!'
      },
    }
  });

  const handleSubmit = async (data: any) => {
    await mutateLogin(data);
  };

  return (
    <Group position={'center'}
           className={classes.container}
    >
      <Box style={{width: '360px'}}>
        <TypographyStylesProvider>
          <Text
            weight={900}
            align="center"
            style={{fontSize: theme.fontSizes.xl * 2}}
          >
            Welcome back!
          </Text>
        </TypographyStylesProvider>
        <Text
          color="dimmed"
          size="sm"
          align="center"
          mt={5}
        >
          Do not have an account yet?{' '}
          <Anchor<'a'>
            href="#"
            size="sm"
            onClick={() => navigate('/auth/signup')}
          >
            Create account
          </Anchor>
        </Text>

        <Paper
          withBorder
          shadow="md"
          p={'md'}
          m={'sm'}
          radius="md"
          className={classes.body}
        >
          <LoadingOverlay visible={isLoadingLoginMutation}/>
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <TextInput
              mt="md"
              required
              placeholder="Your email"
              label="Email"
              icon={<At size={17}/>}
              {...form.getInputProps('email')}
            />
            <PasswordInput
              mt="md"
              required
              placeholder="Password"
              label="Password"
              icon={<Lock size={17}/>}
              {...form.getInputProps('password')}
            />
            <Group position="right" mt="md">
              <Anchor<'a'>
                href="#"
                size="sm"
                onClick={(event) => {
                  navigate('/auth/forgot-password')
                  event.preventDefault()
                }}
              >
                Forgot password?
              </Anchor>
            </Group>
            <Button
              leftIcon={<Key/>}
              fullWidth
              mt="xl"
              type="submit"
            >
              Sign in
            </Button>
          </form>
        </Paper>
      </Box>
    </Group>
  );
};

export default SignIn;
