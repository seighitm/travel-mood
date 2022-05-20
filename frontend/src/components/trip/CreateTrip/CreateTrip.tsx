import React, {useMemo, useState} from 'react';
import {
  Badge,
  Box,
  Button,
  Checkbox,
  Container,
  Divider,
  Grid,
  Group,
  LoadingOverlay,
  MultiSelect,
  Select,
  Textarea,
  TextInput,
  ThemeIcon,
} from '@mantine/core';
import {DateRangePicker} from '@mantine/dates';
import {useMutateAddTrip} from '../../../api/trips/mutations';
import CreateTripMap from '../../maps/CreateTripMap';
import {useForm} from '@mantine/form';
import {
  CalendarEvent,
  Check,
  CurrencyDollar,
  DeviceFloppy,
  Language,
  Plane,
  User,
  World,
  X,
} from '../../../assets/Icons';
import {useGetTransports} from '../../../api/utils/queries';
import {useGetLanguages} from '../../../api/languages/queries';
import {isEmptyArray, isEmptyString, isNullOrUndefined} from "../../../utils/primitive-checks";
import dayjs from "dayjs";
import {useMediaQuery} from "@mantine/hooks";

function CreateTrip() {
  const [destinations, setDestinations] = useState<any>([]);
  const [markers, setMarkers] = useState<any[]>([]);
  const [mapError, setMapError] = useState<any>('')

  const {data: dbLanguages} = useGetLanguages({});
  const {data: dbTransports} = useGetTransports({});
  const {mutate: mutateAddTrip, isLoading: isLoadingMutateAddTrip} = useMutateAddTrip();

  const form = useForm({
    initialValues: {
      title: "",
      description: "",
      gender: '',
      date: [],
      languages: [],
      transports: [],
      itinerary: '',
      budget: null,
      isSplitCost: false,
      isAnytime: false,
    },
    validate: {
      title: (value) => (value.length <= 8 ? 'Title should have at least 8 letters' : null),
      description: (value) => (value.length <= 8 ? 'Description should have at least 8 letters' : null),
      languages: (value) => (value.length == 0 ? 'Add at least one language!' : null),
      transports: (value) => (value.length == 0 ? 'Add at least one transport!' : null),
      budget: (value) => ((value && value < 0) ? 'Invalid budget!' : null),
      itinerary: (value) => (isEmptyString(value) ? 'You did not specify the type of itinerary!' : null),
    },
  });

  const handleSubmit = (data: any) => {
    if (destinations.length == 0 || markers.length == 0) {
      setMapError('Indicate at least one country and one marker!')
    } else {
      setMapError('')
      mutateAddTrip({...data, markers: markers, countries: destinations});
    }
  };

  const matches = useMediaQuery('(max-width: 900px)');

  return <Container size={matches ? 'xl' : 'md'}>
    <Box style={{position: 'relative'}}>
      <LoadingOverlay visible={isLoadingMutateAddTrip}/>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput placeholder="Enter title..." label="Title" {...form.getInputProps('title')} />
        <Textarea
          placeholder="Enter description..."
          label="Description"
          autosize
          minRows={2}
          maxRows={4}
          {...form.getInputProps('description')}
        />

        <Grid grow justify="space-between" align="flex-end">
          <Grid.Col xs={12} sm={9} md={10} xl={10} lg={10}>
            <DateRangePicker
              minDate={dayjs(new Date()).toDate()}
              disabled={form.getInputProps('isAnytime').value}
              label="Date"
              icon={<CalendarEvent size={17}/>}
              placeholder="Select date"
              {...form.getInputProps('date')}
            />
          </Grid.Col>

          <Grid.Col xs={12} sm={3} md={2} xl={2} lg={2}>
            <Checkbox
              mb={7}
              label="Anytime"
              checked={form.getInputProps('isAnytime').value}
              {...form.getInputProps('isAnytime')}
            />
          </Grid.Col>
        </Grid>

        <Select
          label="Gender"
          placeholder="Gender"
          icon={<User size={17}/>}
          {...form.getInputProps('gender')}
          data={[
            {value: 'MALE', label: 'Male'},
            {value: 'FEMALE', label: 'Female'},
            {value: 'MALE_GROUP', label: 'Male Group'},
            {value: 'FEMALE_GROUP', label: 'Female Group'},
            {value: 'ANY', label: 'Any'}
          ]}
        />

        <MultiSelect
          icon={<Language size={17}/>}
          label="Languages"
          placeholder="Select languages"
          searchable
          {...form.getInputProps('languages')}
          data={!isNullOrUndefined(dbLanguages) && !isEmptyArray(dbLanguages)
            ? dbLanguages?.map((item: any) => ({
              value: item.name,
              label: item.name,
            })) : []
          }
        />

        <MultiSelect
          icon={<Plane size={17}/>}
          label="Transports"
          placeholder="Select transports"
          searchable
          data={[{value: 'CAR', label: 'Car'}, {value: 'PLANE', label: 'Plane'}]}
          {...form.getInputProps('transports')}
        />

        <Select
          icon={<World size={17}/>}
          placeholder="Select itinerary"
          label="Select itinerary ..."
          {...form.getInputProps('itinerary')}
          data={[
            {value: 'FIXED', label: 'Fixed'},
            {value: 'FLEXIBLE', label: 'Flexible'},
          ]}
        />

        <Select
          clearable
          placeholder="Budget"
          label="Budget ($)"
          mb={'lg'}
          icon={<CurrencyDollar size={17}/>}
          {...form.getInputProps('budget')}
          data={[
            {value: '0-150', label: '$0 - 150$'},
            {value: '150-500', label: '$150 - 500$'},
            {value: '500-1000', label: '$500 - 1000$'},
            {value: '1000-1500', label: '$1000 - 1500$'},
            {value: '1500-2000', label: '$1500$ - 2000$'},
            {value: '2000', label: '2000$ +'},
          ]}
        />

        <Checkbox
          mb={'lg'}
          label="Split costs"
          checked={form.getInputProps('isSplitCost').value}
          {...form.getInputProps('isSplitCost')}
        />

        {useMemo(() =>
          <CreateTripMap
            destinations={destinations}
            setDestinations={setDestinations}
            allMarkers={markers}
            setAllMarkers={setMarkers}
          />, [destinations, markers])}


        {!isEmptyString(mapError) &&
          <Group mt={'sm'} position={'center'}>
            <Badge color={'red'}>
              {mapError}
            </Badge>
          </Group>
        }

        <Divider
          my={'lg'}
          labelPosition="center"
          style={{width: '100%'}}
          label={(Object.keys(form.errors).length !== 0 || mapError != '')
            ? <ThemeIcon variant={'light'} color={'red'}><X size={17}/></ThemeIcon>
            : <ThemeIcon variant={'light'} color={'blue'}><Check size={17}/></ThemeIcon>
          }
        />

        <Group mb={'lg'} position="center">
          <Button color="blue" type="submit" rightIcon={<DeviceFloppy size={17}/>}>
            Create
          </Button>
        </Group>
      </form>
    </Box>
  </Container>
}

export default CreateTrip;
