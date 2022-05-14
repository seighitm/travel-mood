import React, {useState} from 'react';
import {
  Anchor,
  Box,
  Button,
  createStyles,
  Group, LoadingOverlay,
  Paper,
  Text,
  TextInput,
  TypographyStylesProvider,
} from '@mantine/core';
import {useNavigate, useParams} from 'react-router-dom';
import {Key, Lock} from '../../assets/Icons';
import {useMutateResetPassword} from "../../api/auth/mutations";
import {useForm} from "@mantine/form";

const useStyles = createStyles((theme) => ({
  container: {
    height: '100vh',
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,
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

const ResetPassword = () => {
  const {resetToken} = useParams()
  const navigate = useNavigate();
  const {classes, theme} = useStyles();
  const {mutate: mutateResetPassword, isLoading: isLoadingResetPassword} = useMutateResetPassword()

  const formResetPassword = useForm({
    initialValues: {
      password: '',
    },
    validate: {
      password: (value) => {
        if (value?.trim().length <= 3) return 'Password should have at least 3 letters!'
      },
    },
  });

  const handlerSubmit = (data: {password: string}) => {
    mutateResetPassword({password: data.password, resetToken})
  }

  return <Group
    position={'center'}
    className={classes.container}
  >
    <Box style={{width: '360px'}}>
      <TypographyStylesProvider>
        <Text
          weight={900}
          align="center"
          style={{fontSize: theme.fontSizes.xl * 2}}
        >
          Reset Password!
        </Text>
      </TypographyStylesProvider>

      <Paper
        withBorder
        shadow="md"
        p={'md'}
        m={'sm'}
        radius="md"
        className={classes.body}
      >
        <form  onSubmit={formResetPassword.onSubmit(handlerSubmit)}>
          <LoadingOverlay visible={isLoadingResetPassword}/>
          <TextInput
            mt="md"
            required
            placeholder="New Password"
            label="Password"
            icon={<Lock size={17}/>}
            {...formResetPassword.getInputProps('password')}
          />

          <Button
            leftIcon={<Key/>}
            fullWidth
            mt="xl"
            type={'submit'}
          >
            Save
          </Button>
        </form>
        <Group mt={'xs'} position={'apart'} align={'right'} spacing={5}>
          <Anchor<'a'>
            align={'right'}
            href="#"
            size="sm"
            onClick={(event) => {
              navigate('/auth/login')
              event.preventDefault()
            }}
          >
            Login
          </Anchor>
          <Anchor<'a'>
            align={'right'}
            href="#"
            size="sm"
            onClick={(event) => {
              navigate('/auth/signup')
              event.preventDefault()
            }}
          >
            Registration
          </Anchor>
        </Group>
      </Paper>
    </Box>
  </Group>
};

export default ResetPassword;
