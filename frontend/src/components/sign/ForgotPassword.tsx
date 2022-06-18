import React from 'react';
import {
  Box,
  Button,
  createStyles,
  Group,
  LoadingOverlay,
  Paper,
  Text,
  TextInput,
  TypographyStylesProvider,
} from '@mantine/core';
import { Link, useNavigate } from 'react-router-dom';
import { At } from '../common/Icons';
import { useMutateForgotPassword } from '../../api/auth/mutations';
import { useForm } from '@mantine/form';
import { isValidEmail } from '../../utils/utils-func';

const useStyles = createStyles((theme) => ({
  container: {
    height: '100vh',
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,
  },

  body: {
    position: 'relative',
    borderColor: theme.colorScheme === 'dark' ? theme.colors.gray[8] : theme.colors.gray[3],
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
  },

  themeIcon: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
}));

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { classes, theme } = useStyles();

  const onSuccessEvent = () => navigate('/auth/verify');
  const { mutate: mutateForgotPassword, isLoading: isLoadingForgotPassword } =
    useMutateForgotPassword(onSuccessEvent);
  const handlerSubmit = (data: { email: string }) => {
    mutateForgotPassword(data.email);
  };

  const formForgotPassword = useForm({
    initialValues: {
      email: '',
    },
    validate: {
      email: (value) => {
        if (!isValidEmail(value?.trim())) return 'Invalid email!';
      },
    },
  });

  return (
    <Group position={'center'}>
      <Box style={{ width: '360px' }}>
        <TypographyStylesProvider>
          <Text
            weight={900}
            color={'gray'}
            align="center"
            style={{ fontSize: theme.fontSizes.md * 2 }}
          >
            Forgot Password
          </Text>
        </TypographyStylesProvider>

        <Paper withBorder shadow="md" p={'md'} m={'sm'} radius="md" className={classes.body}>
          <form onSubmit={formForgotPassword.onSubmit(handlerSubmit)}>
            <LoadingOverlay visible={isLoadingForgotPassword} />
            <TextInput
              mt={'xs'}
              required
              placeholder="Enter you email"
              label="Email"
              icon={<At size={17} />}
              {...formForgotPassword.getInputProps('email')}
            />

            <Button fullWidth mt="md" type={'submit'}>
              Send link
            </Button>
          </form>
          <Group mt={'xs'} position={'apart'} align={'right'} spacing={5}>
            <Text
              align={'right'}
              weight={500}
              color={'blue'}
              component={Link}
              to={'/auth/login'}
              size="sm"
            >
              Login
            </Text>
            <Text
              align={'right'}
              weight={500}
              color={'blue'}
              component={Link}
              to={'/auth/signup'}
              size="sm"
            >
              Registration
            </Text>
          </Group>
        </Paper>
      </Box>
    </Group>
  );
};

export default ForgotPassword;
