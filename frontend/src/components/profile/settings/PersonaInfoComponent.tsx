import React, {useEffect, useState} from 'react';
import {ActionIcon, Box, Group, MultiSelect, Paper, Select, TextInput, useMantineTheme} from '@mantine/core';
import {DatePicker} from '@mantine/dates';
import {useForm} from '@mantine/form';
import {useMutateUserProfileUpdateGeneralInfo} from '../../../api/users/mutations';
import {useGetLanguages} from '../../../api/languages/queries';
import {useGetLocations} from '../../../api/countries/queries';
import useStore from '../../../store/user.store';
import {GlobeIcon} from "@modulz/radix-icons";
import {CalendarEvent, Check, GenderBigender, Language, Pencil, User, X} from "../../../assets/Icons";
import dayjs from "dayjs";

const PersonaInfoComponent = React.memo(() => {
  const theme = useMantineTheme()
  const {user} = useStore((state: any) => state);
  const [editModePersonalData, setEditModePersonalData] = useState(true);
  const {mutate: mutateUpdateUserGeneralInfo} = useMutateUserProfileUpdateGeneralInfo();
  const {data: dbLanguages} = useGetLanguages({});
  const {data: dbLocations} = useGetLocations({});

  const formProfile = useForm({
    initialValues: {
      firstName: user?.firstName,
      lastName: user?.lastName,
      country: user?.country?.code,
      gender: user?.gender?.gender,
      birthday: user?.birthday != 'null' && user?.birthday != null ? new Date(user?.birthday) : null,
      languages: user?.languages?.map((item: any) => item.name),
    },
    validate: {
      languages: (value) => {
        if (value.length == 0) return 'Language is empty. Please select min 1!'
      },
      firstName: (value) => {
        if (value?.trim().length <= 3) return 'FirstName should have at least 3 letters!'
      },
      lastName: (value) => {
        if (value?.trim().length <= 3) return 'LastName should have at least 3 letters!'
      }
    },
  });

  const handlerResetForm = () => {
    formProfile.reset();
    setEditModePersonalData(true);
  };

  useEffect(() => {
    resetForm()
  }, [user])

  const resetForm = () => {
    formProfile.setFieldValue('birthday', user?.birthday != 'null' && user?.birthday != null ? new Date(user?.birthday) : null)
    formProfile.setFieldValue('country', user?.country?.code)
    formProfile.setFieldValue('languages', user?.languages?.map((item: any) => item.name))
    formProfile.setFieldValue('lastName', user?.lastName)
    formProfile.setFieldValue('firstName', user?.firstName)
    formProfile.setFieldValue('gender', user?.gender?.gender)
  }

  useEffect(() => {
    handlerResetForm();
  }, []);

  const handlerSubmitProfileInfo = (data: any) => {
    mutateUpdateUserGeneralInfo({...data});
    setEditModePersonalData(true);
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
        <Box pb={theme.spacing.lg * 2} style={{position: 'relative'}}>
          <Group position={'apart'} style={{position: 'absolute', width: '100%'}}>
            {editModePersonalData
              ? <ActionIcon
                onClick={() => setEditModePersonalData(false)}
                radius="xl"
                variant="filled"
                color={'blue'}
              >
                <Pencil size={15}/>
              </ActionIcon>
              : <>
                <ActionIcon onClick={handlerResetForm} radius="xl" variant="filled" color={'red'}>
                  <X size={15}/>
                </ActionIcon>
                <ActionIcon
                  type={'submit'}
                  onClick={() => setEditModePersonalData(false)}
                  radius="xl"
                  variant="filled"
                  color={'green'}
                >
                  <Check size={15}/>
                </ActionIcon>
              </>
            }
          </Group>
        </Box>

        <Group grow align={'flex-start'}>
          <TextInput
            required
            label="First name"
            placeholder="Your first name"
            disabled={editModePersonalData}
            icon={<User size={15}/>}
            {...formProfile.getInputProps('firstName')}
          />

          <TextInput
            required
            label="Last name"
            placeholder="Your last name"
            disabled={editModePersonalData}
            icon={<User size={15}/>}
            {...formProfile.getInputProps('lastName')}
          />
        </Group>

        <DatePicker
          label="Birthday"
          placeholder="Select date"
          maxDate={dayjs(new Date()).toDate()}
          icon={<CalendarEvent size={15}/>}
          disabled={editModePersonalData}
          {...formProfile.getInputProps('birthday')}
        />

        <Select
          label="Sex"
          placeholder="Select sex"
          icon={<GenderBigender size={15}/>}
          clearable
          disabled={editModePersonalData}
          {...formProfile.getInputProps('gender')}
          data={[
            {value: 'FEMALE', label: 'Female'},
            {value: 'MALE', label: 'Male'},
            {value: 'OTHER', label: 'Other'},
          ]}
        />

        <MultiSelect
          searchable
          label="Languages"
          placeholder="Select languages"
          clearable={!editModePersonalData}
          icon={<Language size={15}/>}
          disabled={editModePersonalData}
          {...formProfile.getInputProps('languages')}
          data={dbLanguages && dbLanguages?.length > 0
            ? dbLanguages?.map((item: any) => ({
              value: item.name,
              label: item.name,
            }))
            : []
          }
        />

        <Select
          data={dbLocations && dbLocations?.length > 0
            ? dbLocations?.map((item: any) => ({
              value: item.code,
              label: item.name,
            }))
            : []
          }
          clearable={!editModePersonalData}
          searchable
          label="Country"
          placeholder="Country"
          icon={<GlobeIcon style={{width: '14px', height: '14px'}}/>}
          disabled={editModePersonalData}
          {...formProfile.getInputProps('country')}
          nothingFound="Nobody here"
        />
      </form>
    </Paper>
  );
});

export default PersonaInfoComponent;
