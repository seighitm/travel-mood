import React, { useState } from 'react';
import { createStyles, Group, LoadingOverlay, Paper, Text } from '@mantine/core';
import AccountInfo from './AccountInfo';
import PersonalInfo from './PersonalInfo';
import { useMutateSignUp } from '../../api/auth/mutations';
import { useForm } from '@mantine/form';
import { Link } from 'react-router-dom';
import { GENDER, RELATIONSHIP_STATUS } from '../../types/enums';
import { calculateAge, isValidEmail } from '../../utils/utils-func';
import { isEmptyArray, isEmptyString, isNullOrUndefined } from '../../utils/primitive-checks';

const useStyles = createStyles((theme) => ({
  container: {
    height: '87vh',
  },
  body: {
    width: '420px',
    position: 'relative',
    border: '2px solid ',
    borderColor: theme.colorScheme === 'dark' ? theme.colors.gray[8] : theme.colors.gray[3],
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
  },
  themeIcon: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
}));

const SignUp = () => {
  const { classes } = useStyles();
  const [stateRegistration, setStateRegistration] = useState('account-info');
  const { mutate: mutateRegistration, isLoading: isLoadingRegistrationMutation } =
    useMutateSignUp();
  const [profileImage, setProfileImage] = useState<any>();

  const accountInfoForm = useForm({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    },
    validate: {
      password: (value) =>
        value?.trim().length < 8 ? 'Password should have at least 8 letters!' : null,
      firstName: (value) =>
        value?.trim().length < 2 ? 'First name should have at least 2 letters!' : null,
      lastName: (value) =>
        value?.trim().length < 2 ? 'Last name should have at least 2 letters!' : null,
      email: (value) => (!isValidEmail(value?.trim()) ? 'Invalid email!' : null),
    },
  });

  const personalInfoForm = useForm({
    initialValues: {
      country: '',
      gender: '',
      relationshipStatus: '',
      birthday: null,
      languages: [],
    },
    validate: {
      birthday: (value) =>
        isNullOrUndefined(value)
          ? 'Date is required!'
          : calculateAge(value) < 18
          ? 'You have to be at least 18 to use travel mood!'
          : null,
      gender: (value) =>
        isEmptyString(value)
          ? 'Gender is required!'
          : !(value in GENDER)
          ? 'Invalid gender format!'
          : null,
      languages: (value) => (isEmptyArray(value) ? 'Languages are required!' : null),
      country: (value) =>
        isNullOrUndefined(value) || isEmptyString(value) ? 'Country is required!' : null,
      relationshipStatus: (value) =>
        !isEmptyString(value) && !(value in RELATIONSHIP_STATUS)
          ? 'Invalid relationship status format!'
          : null,
    },
  });

  const handleSubmit = (data: any) => {
    const formData = new FormData();
    const obj = { ...data, ...accountInfoForm.values };
    Object.entries(obj).forEach(
      (entry: any) => entry[0] != 'languages' && formData.append(entry[0], entry[1])
    );
    data.languages.forEach((lang: any) => formData.append('languages[]', lang));
    formData.append('image', profileImage);
    mutateRegistration(formData);
  };

  return (
    <Group
      position={'center'}
      // className={classes.container}
    >
      <Paper withBorder shadow="md" p={'md'} m={'sm'} radius="md" className={classes.body}>
        <LoadingOverlay visible={isLoadingRegistrationMutation} />
        {stateRegistration == 'account-info' ? (
          <AccountInfo
            form={accountInfoForm}
            setProfileImage={setProfileImage}
            profileImage={profileImage}
            setStateRegistration={setStateRegistration}
          />
        ) : (
          <PersonalInfo
            form={personalInfoForm}
            handleSubmit={handleSubmit}
            setStateRegistration={setStateRegistration}
          />
        )}
        <Group mt={'xs'} position={'right'}>
          <Text color="dimmed" size="md" align="center" mt={5}>
            Have an account?{' '}
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
          </Text>
        </Group>
      </Paper>
    </Group>
  );
};

export default SignUp;
