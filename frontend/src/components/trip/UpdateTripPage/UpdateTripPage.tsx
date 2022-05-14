import React, {useEffect, useState} from 'react';
import {
  Badge,
  Box,
  Button,
  Checkbox,
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
import {useOneTripsQuery} from '../../../api/trips/queries';
import {useMutationUpdateTrip} from '../../../api/trips/mutations';
import {useParams} from 'react-router-dom';
import {CustomLoader} from '../../common/CustomLoader';
import {useForm} from '@mantine/form';
import {CalendarEvent, DeviceFloppy, Language, Plane, User, World,} from '../../../assets/Icons';
import {useGetTransports} from '../../../api/utils/queries';
import {useGetLanguages} from '../../../api/languages/queries';
import CreateTripMap from "../../maps/CreateTripMap";
import {CheckIcon, Cross2Icon} from "@modulz/radix-icons";

function UpdateTripPage() {
  const {id} = useParams();

  const [destinations, setDestinations] = useState<string[]>([]);
  const [markers, setMarkers] = useState<any[]>([]);
  const [mapError, setMapError] = useState<any>('')

  const {mutate: mutateUpdate, isLoading: isLoadingUpdateTrip} = useMutationUpdateTrip(id);
  const {data: dbTrip, isFetching: isFetchingDbTrip} = useOneTripsQuery({id});
  const {data: dbLanguages} = useGetLanguages({});
  const {data: dbTransports} = useGetTransports({});

  const form = useForm({
    initialValues: {
      date: [null, null],
      title: '',
      description: '',
      gender: '',
      languages: '',
      transports: '',
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
      budget: (value) => ((value && value < 0) ? 'Invalid budget!' : null)
    },
  });

  useEffect(() => {
    if (dbTrip) {
      if (dbTrip.dateFrom != null) { // @ts-ignore
        form.setFieldValue('date', [new Date(dbTrip.dateFrom), new Date(dbTrip.dateto)]);
      }
      form.setFieldValue('title', dbTrip.title);
      form.setFieldValue('description', dbTrip.description);
      form.setFieldValue('gender', dbTrip.sex);
      form.setFieldValue('isAnytime', dbTrip.isAnytime);
      form.setFieldValue('languages', dbTrip?.languages?.map((item: any) => item.name));
      form.setFieldValue('transports', dbTrip?.transports?.map((item: any) => item.name));
      form.setFieldValue('itinerary', dbTrip.itinerary);
      form.setFieldValue('budget', dbTrip.budget);
      form.setFieldValue('isSplitCost', dbTrip.splitCosts);

      setDestinations(dbTrip?.destinations?.map((item: any) => ({countryCode: item.code, countryName: item.name})));
      setMarkers(
        dbTrip?.places?.map((item: any) => ({
          place: [Number(item.lon), Number(item.lat)],
          description: item.description,
        }))
      )
    }
  }, [dbTrip]);

  const handleSubmit = (data: any) => {
    if (destinations.length == 0 || markers.length == 0) {
      setMapError('Indicate at least one country and one marker!')
    } else {
      setMapError('')
      mutateUpdate({
        tripId: id,
        tripPayload: {
          ...data,
          markers: markers,
          destinations: destinations.map((item: any) => item.countryCode)
        },
      })
    }
  };

  if (isFetchingDbTrip)
    return <CustomLoader/>;

  return <>
    <Box style={{position: 'relative'}}>
      <LoadingOverlay visible={isLoadingUpdateTrip}/>
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

        <Grid justify="space-between" align="flex-end">
          <Grid.Col xs={12} sm={9} md={9} xl={9} lg={10}>
            <DateRangePicker
              disabled={form.getInputProps('isAnytime').value}
              label="Date"
              icon={<CalendarEvent size={17}/>}
              placeholder="Pick dates range"
              {...form.getInputProps('date')}
            />
          </Grid.Col>
          <Grid.Col xs={12} sm={3} md={3} xl={3} lg={2}>
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
          defaultValue={form.getInputProps('gender').value}
          placeholder="Gender"
          icon={<User size={17}/>}
          data={[
            {value: 'm', label: 'Male'},
            {value: 'f', label: 'Female'},
            {value: 'mg', label: 'Male Group'},
            {value: 'fg', label: 'Female Group'},
            {value: 'fg', label: 'Any'}
          ]}
          {...form.getInputProps('gender')}
        />

        <MultiSelect
          label="Languages"
          data={
            dbLanguages?.length > 0
              ? dbLanguages?.map((item: any) => ({
                value: item.name,
                label: item.name,
              }))
              : []
          }
          icon={<Language size={17}/>}
          defaultValue={form.getInputProps('languages').value}
          placeholder="Select languages"
          searchable
          {...form.getInputProps('languages')}
        />

        <MultiSelect
          label="Transports"
          data={
            dbTransports?.length > 0
              ? dbTransports?.map((item: any) => ({
                value: item.name,
                label: item.name,
              }))
              : []
          }
          icon={<Plane size={17}/>}
          placeholder="Select transports"
          searchable
          {...form.getInputProps('transports')}
          defaultValue={dbTrip?.transports?.map((item: any) => item.name)}
        />

        <Select
          icon={<World size={17}/>}
          defaultValue={dbTrip.itinerary}
          placeholder="Select itinerary"
          label="Select itinerary ..."
          {...form.getInputProps('itinerary')}
          data={[
            {value: 'Fixed', label: 'Fixed'},
            {value: 'Flexible', label: 'Flexible'},
          ]}
        />

        <Select
          clearable
          placeholder="Budget"
          label="Budget ($)"
          mb={'lg'}
          data={[
            {value: '0-150', label: '$0 - 150$'},
            {value: '150-500', label: '$150 - 500$'},
            {value: '500-1000', label: '$500 - 1000$'},
            {value: '1000-1500', label: '$1000 - 1500$'},
            {value: '1500-2000', label: '$1500$ - 2000$'},
            {value: '2000', label: '2000$ +'},
          ]}
          {...form.getInputProps('budget')}
        />

        <Checkbox
          mb={'lg'}
          label="Split costs"
          checked={form.getInputProps('isSplitCost').value}
          {...form.getInputProps('isSplitCost')}
        />

        <CreateTripMap
          destinations={destinations}
          setDestinations={setDestinations}
          allMarkers={markers}
          setAllMarkers={setMarkers}
        />

        {mapError != '' &&
          <Group mt={'sm'} position={'center'}>
            <Badge color={'red'}>
              {mapError}
            </Badge>
          </Group>
        }

        <Divider
          label={(Object.keys(form.errors).length !== 0)
            ? <ThemeIcon variant={'light'} color={'red'}><Cross2Icon/></ThemeIcon>
            : <ThemeIcon variant={'light'} color={'blue'}><CheckIcon/></ThemeIcon>
          }
          color={(Object.keys(form.errors).length !== 0)
            ? 'red'
            : 'gray'
          }
          labelPosition="center"
          mt={'lg'}
          mb={'lg'}
          style={{width: '100%'}}
        />

        <Group mb={'xl'} position="center">
          <Button
            leftIcon={<DeviceFloppy size={17}/>}
            fullWidth
            disabled={isLoadingUpdateTrip}
            color="blue"
            type="submit"
          >
            Update
          </Button>
        </Group>
      </form>
    </Box>
  </>
}

export default UpdateTripPage;
