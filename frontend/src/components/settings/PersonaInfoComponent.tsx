import React, { useEffect, useState } from 'react';
import {
  ActionIcon,
  Box,
  Group,
  MultiSelect,
  Paper,
  Select,
  Textarea,
  TextInput,
  useMantineTheme,
} from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { useMutateUserProfileUpdateGeneralInfo } from '../../api/users/mutations';
import { useGetCountries, useGetLanguages } from '../../api/info/queries';
import useStore from '../../store/user.store';
import {
  CalendarEvent,
  Check,
  GenderBigender,
  Language,
  Pencil,
  User,
  World,
  X,
} from '../common/Icons';
import dayjs from 'dayjs';
import { RELATIONSHIP_STATUS, USER_GENDER } from '../../utils/constants';

const PersonaInfoComponent = React.memo(() => {
  const theme = useMantineTheme();
  const { user } = useStore((state: any) => state);
  const [editModePersonalData, setEditModePersonalData] = useState(true);
  const { mutate: mutateUpdateUserGeneralInfo } = useMutateUserProfileUpdateGeneralInfo(() => {
    setEditModePersonalData(true);
  });
  const { data: dbLanguages } = useGetLanguages({});
  const { data: dbLocations } = useGetCountries({});

  const formProfile = useForm({
    initialValues: {
      firstName: user?.firstName,
      lastName: user?.lastName,
      country: user?.country?.code,
      gender: user?.gender?.gender,
      birthday:
        user?.birthday != 'null' && user?.birthday != null ? new Date(user?.birthday) : null,
      languages: user?.languages?.map((item: any) => item.name),
      relationshipStatus: user?.relationshipStatus?.status,
      aboutMe: user?.aboutMe,
    },
    validate: {
      languages: (value) => (value.length == 0 ? 'Language is empty. Please select min 1!' : null),
      firstName: (value) =>
        value?.trim().length < 2 ? 'First name should have at least 2 letters!' : null,
      lastName: (value) =>
        value?.trim().length < 2 ? 'Last name should have at least 2 letters!' : null,
      aboutMe: (value) =>
        value?.trim().length > 500 ? 'Description must not be longer than 500 characters!' : null,
    },
  });

  const handlerResetForm = () => {
    formProfile.reset();
    setEditModePersonalData(true);
  };

  useEffect(() => {
    resetForm();
  }, [user]);

  const resetForm = () => {
    formProfile.setFieldValue(
      'birthday',
      user?.birthday != 'null' && user?.birthday != null ? new Date(user?.birthday) : null
    );
    formProfile.setFieldValue('country', user?.country?.code);
    formProfile.setFieldValue(
      'languages',
      user?.languages?.map((item: any) => item.name)
    );
    formProfile.setFieldValue('lastName', user?.lastName);
    formProfile.setFieldValue('firstName', user?.firstName);
    formProfile.setFieldValue('gender', user?.gender?.gender);
    formProfile.setFieldValue('aboutMe', user?.aboutMe);
    formProfile.setFieldValue('relationshipStatus', user?.relationshipStatus?.status);
  };

  useEffect(() => {
    handlerResetForm();
  }, []);

  const handlerSubmitProfileInfo = (data: any) => {
    mutateUpdateUserGeneralInfo({ ...data });
  };

  return (
    <Paper
      radius={10}
      p={'lg'}
      shadow={'lg'}
      sx={(theme) => ({
        border: '2px solid ',
        borderColor: theme.colorScheme === 'dark' ? theme.colors.gray[8] : theme.colors.gray[2],
        position: 'relative',
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
      })}
    >
      <form onSubmit={formProfile.onSubmit(handlerSubmitProfileInfo)}>
        <Box style={{ position: 'relative' }}>
          <Group position={'center'} style={{ width: '100%' }}>
            {editModePersonalData ? (
              <Group position={'center'} style={{ width: '100%' }}>
                <ActionIcon
                  onClick={() => setEditModePersonalData(false)}
                  radius="xl"
                  variant="transparent"
                  color={'blue'}
                >
                  <Pencil size={20} />
                </ActionIcon>
              </Group>
            ) : (
              <>
                <ActionIcon
                  type={'submit'}
                  onClick={() => setEditModePersonalData(false)}
                  radius="xl"
                  variant="outline"
                  color={'green'}
                >
                  <Check size={20} />
                </ActionIcon>
                <ActionIcon onClick={handlerResetForm} radius="xl" variant="outline" color={'red'}>
                  <X size={20} />
                </ActionIcon>
              </>
            )}
          </Group>
        </Box>

        <Group mt="xs" grow align={'flex-start'}>
          <TextInput
            required
            label="First name"
            placeholder="Enter first name"
            disabled={editModePersonalData}
            icon={<User size={15} />}
            {...formProfile.getInputProps('firstName')}
          />

          <TextInput
            required
            label="Last name"
            placeholder="Enter last name"
            disabled={editModePersonalData}
            icon={<User size={15} />}
            {...formProfile.getInputProps('lastName')}
          />
        </Group>

        <DatePicker
          required
          mt="xs"
          label="Birthday"
          placeholder="Select date"
          maxDate={dayjs(new Date().setFullYear(new Date().getFullYear() - 10)).toDate()}
          icon={<CalendarEvent size={15} />}
          disabled={editModePersonalData}
          {...formProfile.getInputProps('birthday')}
        />

        <Select
          required
          mt="xs"
          label="Gender"
          placeholder="Select gender"
          icon={<GenderBigender size={15} />}
          disabled={editModePersonalData}
          {...formProfile.getInputProps('gender')}
          data={USER_GENDER}
        />

        <MultiSelect
          mt="xs"
          required
          searchable
          label="Languages"
          placeholder="Select languages"
          clearable={!editModePersonalData}
          icon={<Language size={15} />}
          disabled={editModePersonalData}
          {...formProfile.getInputProps('languages')}
          data={
            dbLanguages && dbLanguages?.length > 0
              ? dbLanguages?.map((item: any) => ({
                  value: item.name,
                  label: item.name,
                }))
              : []
          }
        />

        <Select
          required
          mt="xs"
          data={
            dbLocations && dbLocations?.length > 0
              ? dbLocations?.map((item: any) => ({
                  value: item.code,
                  label: item.name,
                }))
              : []
          }
          clearable={!editModePersonalData}
          searchable
          label="Country"
          placeholder="Select country"
          icon={<World size={15} />}
          disabled={editModePersonalData}
          {...formProfile.getInputProps('country')}
          nothingFound="Nobody here"
        />

        <Select
          mb={'xs'}
          icon={<User size={20} />}
          label="Relationship status"
          placeholder="Select status"
          disabled={editModePersonalData}
          {...formProfile.getInputProps('relationshipStatus')}
          data={RELATIONSHIP_STATUS}
        />

        <Textarea
          mt="xs"
          {...formProfile.getInputProps('aboutMe')}
          label="About me"
          placeholder="About me"
          autosize
          minRows={3}
          maxRows={5}
          disabled={editModePersonalData}
        />
      </form>
    </Paper>
  );
});
export default PersonaInfoComponent;
