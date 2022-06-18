import React, { Dispatch, SetStateAction } from 'react';
import { Button, Group, MultiSelect, Select } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import {
  ArrowNarrowLeft,
  CalendarEvent,
  Check,
  GenderBigender,
  Language,
  MapPin,
  User,
} from '../common/Icons';
import { useGetCountries, useGetLanguages } from '../../api/info/queries';
import dayjs from 'dayjs';
import { RELATIONSHIP_STATUS, USER_GENDER } from '../../utils/constants';

interface PersonalInfoComponentProps {
  form: any;
  handleSubmit: (data: any) => void;
  setStateRegistration: Dispatch<SetStateAction<string>>;
}

const PersonalInfo = ({ form, handleSubmit, setStateRegistration }: PersonalInfoComponentProps) => {
  const { data: dbLanguages } = useGetLanguages({});
  const { data: dbLocations } = useGetCountries({});

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <DatePicker
        clearable
        mb={'xs'}
        label="Birthday"
        placeholder="Select date"
        icon={<CalendarEvent size={20} />}
        maxDate={dayjs(new Date()).toDate()}
        {...form.getInputProps('birthday')}
      />

      <Select
        clearable
        mb={'xs'}
        label="Gender"
        icon={<GenderBigender size={20} />}
        placeholder="Select gender"
        {...form.getInputProps('gender')}
        data={USER_GENDER}
      />

      <MultiSelect
        mb={'xs'}
        clearable
        searchable
        label="Languages"
        placeholder="Select languages"
        nothingFound="Nothing found"
        icon={<Language size={20} />}
        {...form.getInputProps('languages')}
        data={
          dbLanguages && dbLanguages?.length != 0
            ? dbLanguages?.map((item: any) => ({ value: item.name, label: item.name }))
            : []
        }
      />

      <Select
        mb={'xs'}
        clearable
        searchable
        label="Country"
        placeholder="Select country"
        nothingFound="Nothing found"
        icon={<MapPin size={20} />}
        {...form.getInputProps('country')}
        data={
          dbLocations && dbLocations?.length != 0
            ? dbLocations?.map((item: any) => ({ value: item.code, label: item.name }))
            : []
        }
      />

      <Select
        clearable
        mb={'xs'}
        icon={<User size={20} />}
        label="Relationship status"
        placeholder="Select status"
        {...form.getInputProps('relationshipStatus')}
        data={RELATIONSHIP_STATUS}
      />

      <Group mt={'xs'} position="center">
        <Button
          leftIcon={<ArrowNarrowLeft />}
          variant="default"
          onClick={() => setStateRegistration('account-info')}
        >
          Back
        </Button>
        <Button type="submit" rightIcon={<Check size={15} />}>
          Register
        </Button>
      </Group>
    </form>
  );
};

export default PersonalInfo;
