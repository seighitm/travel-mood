import React from 'react';
import {
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
import { useForm } from '@mantine/form';
import { Link } from 'react-router-dom';
import { useMutateSignIn } from '../../api/auth/mutations';
import { At, Lock } from '../common/Icons';
import { isValidEmail } from '../../utils/utils-func';

const useStyles = createStyles((theme) => ({
  container: {
    height: 'calc(100vh - 120px)',
  },
  body: {
    position: 'relative',
    border: '2px solid ',
    borderColor: theme.colorScheme === 'dark' ? theme.colors.gray[8] : theme.colors.gray[2],
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
  },
  themeIcon: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
}));

const SignIn = () => {
  const { mutate: mutateLogin, isLoading: isLoadingLoginMutation } = useMutateSignIn();
  const { classes, theme } = useStyles();

  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },
    validate: {
      password: (value) => {
        if (value?.trim().length < 8) return 'Password should have at least 8 letters!';
      },
      email: (value) => {
        if (!isValidEmail(value.trim())) return 'Invalid email!';
      },
    },
  });

  const handleSubmit = async (data: any) => {
    await mutateLogin(data);
  };

  return (
    <Group position={'center'}>
      <Box style={{ width: '360px' }}>
        <TypographyStylesProvider>
          <Text
            weight={900}
            color={'gray'}
            align="center"
            style={{ fontSize: theme.fontSizes.xl * 2 }}
          >
            Welcome back!
          </Text>
        </TypographyStylesProvider>
        <Text color="dimmed" size="md" align="center" mt={'xs'}>
          Do not have an account yet?{' '}
          <Text weight={500} color={'blue'} component={Link} to={'/auth/signup'} size="md">
            Create account
          </Text>
        </Text>

        <Paper withBorder shadow="md" p={'md'} m={'sm'} radius="md" className={classes.body}>
          <LoadingOverlay visible={isLoadingLoginMutation} />
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <TextInput
              mt="xs"
              required
              placeholder="Enter email"
              label="Email"
              icon={<At size={17} />}
              {...form.getInputProps('email')}
            />
            <PasswordInput
              mt="xs"
              required
              placeholder="Enter password"
              label="Password"
              icon={<Lock size={17} />}
              {...form.getInputProps('password')}
            />
            <Group position="right" mt="md">
              <Text
                weight={500}
                color={'blue'}
                component={Link}
                to={'/auth/forgot-password'}
                size="sm"
              >
                Forgot password?
              </Text>
            </Group>
            <Button fullWidth mt="xs" type="submit">
              Sign in
            </Button>
          </form>
        </Paper>
      </Box>
    </Group>
  );
};

export default SignIn;
