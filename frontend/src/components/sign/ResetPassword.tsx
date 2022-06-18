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
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Key, Lock } from '../common/Icons';
import { useMutateResetPassword } from '../../api/auth/mutations';
import { useForm } from '@mantine/form';

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

const ResetPassword = () => {
  const { resetToken } = useParams();
  const navigate = useNavigate();
  const { classes, theme } = useStyles();
  const { mutate: mutateResetPassword, isLoading: isLoadingResetPassword } =
    useMutateResetPassword();

  const formResetPassword = useForm({
    initialValues: {
      password: '',
    },
    validate: {
      password: (value) => {
        if (value?.trim().length <= 3) return 'Password should have at least 3 letters!';
      },
    },
  });

  const handlerSubmit = (data: { password: string }) => {
    mutateResetPassword({ password: data.password, resetToken });
  };

  return (
    <Group
      position={'center'}
      // className={classes.container}
    >
      <Box style={{ width: '360px' }}>
        <TypographyStylesProvider>
          <Text
            weight={900}
            align="center"
            color={'gray'}
            style={{ fontSize: theme.fontSizes.xl * 2 }}
          >
            Reset Password
          </Text>
        </TypographyStylesProvider>

        <Paper withBorder shadow="md" p={'md'} m={'sm'} radius="md" className={classes.body}>
          <form onSubmit={formResetPassword.onSubmit(handlerSubmit)}>
            <LoadingOverlay visible={isLoadingResetPassword} />
            <TextInput
              mt="xs"
              required
              placeholder="Enter new password"
              label="Password"
              icon={<Lock size={17} />}
              {...formResetPassword.getInputProps('password')}
            />

            <Button leftIcon={<Key />} fullWidth mt="sm" type={'submit'}>
              Save
            </Button>
          </form>
          <Group mt={'xs'} position={'apart'} align={'right'} spacing={5}>
            <Text
              align={'right'}
              weight={500}
              color={'blue'}
              component={Link}
              to={'/auth/login'}
              size="md"
            >
              Login
            </Text>
            <Text
              align={'right'}
              weight={500}
              color={'blue'}
              component={Link}
              to={'/auth/signup'}
              size="md"
            >
              Registration
            </Text>
          </Group>
        </Paper>
      </Box>
    </Group>
  );
};

export default ResetPassword;
