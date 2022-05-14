import React, {useState} from 'react';
import {Anchor, createStyles, Group, LoadingOverlay, Paper, Text,} from '@mantine/core';
import AccountInfo from './AccountInfo';
import PersonalInfo from './PersonalInfo';
import {useMutateSignUp} from '../../api/auth/mutations';
import {useForm} from '@mantine/form';
import {useNavigate} from 'react-router-dom';
import {GENDER, RELATIONSHIP_STATUS} from "../../types/enums";

const useStyles = createStyles((theme) => ({
  container: {
    height: '87vh',
  },
  body: {
    width: '420px',
    position: 'relative',
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
  },
  themeIcon: {
    position: 'absolute',
    top: 0,
    right: 0
  },
}));

const SignUp = () => {
  const {classes} = useStyles();
  const navigate = useNavigate();
  const [stateRegistration, setStateRegistration] = useState('account-info');
  const {mutate: mutateRegistration, isLoading: isLoadingRegistrationMutation} = useMutateSignUp();
  const [profileImage, setProfileImage] = useState<any>();

  const accountInfoForm = useForm({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    },
    validate: {
      password: (value) => {
        if (value?.trim().length <= 8) return 'Password should have at least 8 letters!'
      },
      lastName: (value) => {
        if (value?.trim().length <= 2) return 'Last name should have at least 2 letters!'
      },
      firstName: (value) => {
        if (value?.trim().length <= 2) return 'First name should have at least 2 letters!'
      },
      email: (value) => {
        if (!(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value)))
          return 'Invalid email!'
      },
    }
  });

  const personalInfoForm = useForm({
    initialValues: {
      country: '',
      gender: '',
      relationshipStatus: '',
      birthday: new Date(),
      languages: [],
    },
    validate: {
      gender: (value) => {
        if (!(value in GENDER)) return 'Invalid gender format!'
      },
      languages: (value) => {
        if (value.length == 0) return 'Add at least one language!'
      },
      country: (value) => {
        if (value == '' || value == null) return 'You did not indicate the country!'
      },
      relationshipStatus: (value) => {
        if (!(value in RELATIONSHIP_STATUS)) return 'Invalid relationship status format!'
      },
    }
  });

  const handleSubmit = (data: any) => {
    const formData = new FormData();
    const obj = {...data, ...accountInfoForm.values, birthday: new Date(data.birthday),};
    Object.entries(obj).forEach((entry: any) => entry[0] != 'languages' && formData.append(entry[0], entry[1]));
    data.languages.forEach((lang: any) => formData.append('languages[]', lang));
    formData.append('image', profileImage);
    mutateRegistration(formData);
  };

  return (
    <Group
      position={'center'}
      className={classes.container}
    >
      <Paper
        withBorder
        shadow="md"
        p={'md'}
        m={'sm'}
        radius="md"
        className={classes.body}
      >
        <LoadingOverlay visible={isLoadingRegistrationMutation}/>
        {stateRegistration == 'account-info'
          ? <AccountInfo
            form={accountInfoForm}
            setProfileImage={setProfileImage}
            profileImage={profileImage}
            setStateRegistration={setStateRegistration}
          />
          : <PersonalInfo
            form={personalInfoForm}
            handleSubmit={handleSubmit}
            setStateRegistration={setStateRegistration}
          />
        }
        <Group
          mt={'sm'}
          position={'right'}
        >
          <Text
            color="dimmed"
            size="md"
            align="center"
            mt={5}
          >
            Have an account?{' '}
            <Anchor<'a'>
              href="#"
              size="md"
              weight={700}
              onClick={() => navigate('/auth/login')}
            >
              Login
            </Anchor>
          </Text>
        </Group>
      </Paper>
    </Group>
  );
};

export default SignUp;
