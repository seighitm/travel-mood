import React from 'react';
import {Button, Group, MultiSelect, Select} from '@mantine/core';
import {DatePicker} from '@mantine/dates';
import {ArrowNarrowLeft, CalendarEvent, Check, GenderBigender, Language, MapPin, User} from '../../assets/Icons';
import {useGetLanguages} from '../../api/languages/queries';
import {useGetLocations} from '../../api/countries/queries';
import dayjs from 'dayjs';

const PersonalInfo = ({form, handleSubmit, setStateRegistration}: any) => {
  const {data: dbLanguages} = useGetLanguages({});
  const {data: dbLocations} = useGetLocations({});
  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <DatePicker
        mb={'xs'}
        label="Birthday"
        placeholder="Select date"
        icon={<CalendarEvent size={20}/>}
        maxDate={dayjs(new Date()).toDate()}
        {...form.getInputProps('birthday')}
      />

      <Select
        mb={'xs'}
        label="Gender"
        icon={<GenderBigender size={20}/>}
        placeholder="Select gender"
        {...form.getInputProps('gender')}
        data={[
          {value: 'FEMALE', label: 'Female'},
          {value: 'MALE', label: 'Male'},
          {value: 'OTHER', label: 'Other'},
        ]}
      />

      <Select
        mb={'xs'}
        icon={<User size={20}/>}
        label="Relationship status"
        placeholder="Select status"
        {...form.getInputProps('relationshipStatus')}
        data={[
          {value: 'SINGLE', label: 'Single'},
          {value: 'IN_RELATION', label: 'In a relationship'},
        ]}
      />

      <MultiSelect
        mb={'xs'}
        clearable
        searchable
        label="Languages"
        placeholder="Select languages"
        nothingFound="Nothing found"
        icon={<Language size={20}/>}
        {...form.getInputProps('languages')}
        data={dbLanguages && dbLanguages?.length != 0
          ? dbLanguages?.map((item: any) => ({value: item.name, label: item.name}))
          : []
        }
      />

      <Select
        mb={'xs'}
        clearable
        searchable
        label="Country"
        placeholder="Country"
        nothingFound="Nothing found"
        icon={<MapPin size={20}/>}
        {...form.getInputProps('country')}
        data={dbLocations && dbLocations?.length != 0
          ? dbLocations?.map((item: any) => ({value: item.code, label: item.name}))
          : []
        }
      />

      <Group position="center">
        <Button
          leftIcon={<ArrowNarrowLeft/>}
          variant="default"
          onClick={() => setStateRegistration('account-info')}
        >
          Back
        </Button>
        <Button
          type="submit"
          rightIcon={<Check size={15}/>}
        >
          Register
        </Button>
      </Group>
    </form>
  );
};

export default PersonalInfo;
