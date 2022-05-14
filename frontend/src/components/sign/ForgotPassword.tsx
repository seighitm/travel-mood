import React from 'react';
import {
  Anchor,
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
import {useNavigate} from 'react-router-dom';
import {At, Key} from '../../assets/Icons';
import {useMutateForgotPassword} from "../../api/auth/mutations";
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

const ForgotPassword = () => {
  const navigate = useNavigate();
  const {classes, theme} = useStyles();

  const onSuccessEvent = () => navigate('/auth/verify')
  const {mutate: mutateForgotPassword, isLoading: isLoadingForgotPassword} = useMutateForgotPassword(onSuccessEvent)
  const handlerSubmit = (data: { email: string }) => {
    mutateForgotPassword(data.email)
  }

  const formForgotPassword = useForm({
    initialValues: {
      email: '',
    },
    validate: {
      email: (value) => {
        if (!(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value)))
          return 'Invalid email!'
      },
    },
  });

  return <Group
    position={'center'}
    className={classes.container}
  >
    <Box style={{width: '360px'}}>
      <TypographyStylesProvider>
        <Text
          weight={900}
          align="center"
          style={{fontSize: theme.fontSizes.md * 2}}
        >
          Forgot Password
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
        <form onSubmit={formForgotPassword.onSubmit(handlerSubmit)}>
          <LoadingOverlay visible={isLoadingForgotPassword}/>
          <TextInput
            mt="md"
            required
            placeholder="Enter you email"
            label="Email"
            icon={<At size={17}/>}
            {...formForgotPassword.getInputProps('email')}
          />

          <Button
            leftIcon={<Key size={17}/>}
            fullWidth
            mt="xl"
            type={'submit'}
          >
            Send link
          </Button>
        </form>
        <Group mt={'xs'} position={'apart'} align={'right'} spacing={5}>
          <Anchor<'a'>
            align={'right'}
            href="#"
            size="md"
            onClick={(event) => {
              event.preventDefault()
              navigate('/auth/login')
            }}
          >
            Login
          </Anchor>
          <Anchor<'a'>
            align={'right'}
            href="#"
            size="md"
            onClick={(event) => {
              event.preventDefault()
              navigate('/auth/signup')
            }}
          >
            Registration
          </Anchor>
        </Group>
      </Paper>
    </Box>
  </Group>
};

export default ForgotPassword;
