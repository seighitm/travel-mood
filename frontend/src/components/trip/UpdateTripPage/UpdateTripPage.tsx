import React, { useEffect, useState } from 'react';
import {
  Badge,
  Box,
  Button,
  Checkbox,
  Divider,
  Grid,
  Group,
  MultiSelect,
  NumberInput,
  Select,
  Textarea,
  TextInput,
  ThemeIcon,
} from '@mantine/core';
import { DateRangePicker } from '@mantine/dates';
import { useOneTripsQuery } from '../../../api/trips/queries';
import { useMutationUpdateTrip } from '../../../api/trips/mutations';
import { useParams } from 'react-router-dom';
import { CustomLoader } from '../../common/CustomLoader';
import { useForm } from '@mantine/form';
import {
  ArrowUp,
  CalendarEvent,
  Check,
  DeviceFloppy,
  Language,
  Plane,
  User,
  World,
  X,
} from '../../common/Icons';
import CreateTripMap from '../../maps/CreateTripMap';
import { useGetLanguages, useGetTransports } from '../../../api/info/queries';
import CreateUpdateTripForm from '../Forms/CreateUpdateForm';
import { BUDGET, ITINERARY, TRIP_GENDER_FEMALE, TRIP_GENDER_MALE } from '../../../utils/constants';

function UpdateTripPage() {
  const { id } = useParams();

  const [destinations, setDestinations] = useState<string[]>([]);
  const [markers, setMarkers] = useState<any[]>([]);
  const [mapError, setMapError] = useState<any>('');

  const {
    mutate: mutateUpdate,
    isLoading: isLoadingUpdateTrip,
    isError,
  } = useMutationUpdateTrip(id);
  const { data: dbTrip, isFetching: isFetchingDbTrip } = useOneTripsQuery({ id });
  const { data: dbLanguages } = useGetLanguages({});
  const { data: dbTransports } = useGetTransports({});

  const form = useForm({ ...CreateUpdateTripForm });

  useEffect(() => {
    if (dbTrip) {
      if (dbTrip.dateFrom != null) {
        // @ts-ignore
        form.setFieldValue('date', [new Date(dbTrip.dateFrom), new Date(dbTrip.dateTo)]);
      }
      form.setFieldValue('title', dbTrip.title);
      form.setFieldValue('description', dbTrip.description);
      form.setFieldValue('gender', dbTrip?.gender?.gender);
      form.setFieldValue('isAnytime', dbTrip.isAnytime);
      form.setFieldValue(
        'languages',
        dbTrip?.languages?.map((item: any) => item.name)
      );
      form.setFieldValue(
        'transports',
        dbTrip?.transports?.map((item: any) => item.name)
      );
      form.setFieldValue('itinerary', dbTrip.itinerary);
      form.setFieldValue('budget', dbTrip.budget);
      form.setFieldValue('isSplitCost', dbTrip.splitCosts);
      form.setFieldValue('maxNrOfPersons', dbTrip.maxNrOfPersons);

      setDestinations(
        dbTrip?.destinations?.map((item: any) => ({
          countryCode: item.code,
          countryName: item.name,
        }))
      );
      setMarkers(
        dbTrip?.places?.map((item: any) => ({
          place: [Number(item.lon), Number(item.lat)],
          description: item.description,
        }))
      );
    }
  }, [dbTrip]);

  const handleSubmit = (data: any) => {
    if (destinations.length == 0 || markers.length == 0) {
      setMapError('Indicate at least one country!');
    } else {
      setMapError('');
      mutateUpdate({
        tripId: id,
        tripPayload: {
          ...data,
          markers: markers,
          countries: destinations.map((item: any) => item.countryCode),
        },
      });
    }
  };

  if (isFetchingDbTrip) return <CustomLoader />;

  return (
    <>
      <Box style={{ position: 'relative' }}>
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
                icon={<CalendarEvent size={17} />}
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

          <NumberInput
            icon={<ArrowUp size={17} />}
            label="Number of persons"
            placeholder="Number of persons"
            max={100}
            min={1}
            {...form.getInputProps('maxNrOfPersons')}
          />

          <Select
            label="Gender"
            defaultValue={form.getInputProps('gender').value}
            placeholder="Gender"
            icon={<User size={17} />}
            data={form.values.maxNrOfPersons == '1' ? TRIP_GENDER_MALE : TRIP_GENDER_FEMALE}
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
            icon={<Language size={17} />}
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
            icon={<Plane size={17} />}
            placeholder="Select transports"
            searchable
            {...form.getInputProps('transports')}
            defaultValue={dbTrip?.transports?.map((item: any) => item.name)}
          />

          <Select
            icon={<World size={17} />}
            defaultValue={dbTrip.itinerary}
            placeholder="Select itinerary"
            label="Select itinerary ..."
            {...form.getInputProps('itinerary')}
            data={ITINERARY}
          />

          <Select
            clearable
            placeholder="Budget"
            label="Budget ($)"
            mb={'lg'}
            data={BUDGET}
            {...form.getInputProps('budget')}
          />

          <Checkbox
            mb={'lg'}
            label="Split costs"
            checked={form.getInputProps('isSplitCost').value}
            {...form.getInputProps('isSplitCost')}
          />

          <CreateTripMap
            setDestinations={setDestinations}
            allMarkers={markers}
            setAllMarkers={setMarkers}
          />

          {mapError != '' && (
            <Group mt={'sm'} position={'center'}>
              <Badge color={'red'}>{mapError}</Badge>
            </Group>
          )}

          <Divider
            label={
              Object.keys(form.errors).length !== 0 ? (
                <ThemeIcon variant={'light'} color={'red'}>
                  <X size={15} />
                </ThemeIcon>
              ) : (
                <ThemeIcon variant={'light'} color={'blue'}>
                  <Check size={15} />
                </ThemeIcon>
              )
            }
            color={Object.keys(form.errors).length !== 0 ? 'red' : 'gray'}
            labelPosition="center"
            mt={'lg'}
            mb={'lg'}
            style={{ width: '100%' }}
          />

          <Group mb={'xl'} position="center">
            <Button
              loading={isLoadingUpdateTrip}
              leftIcon={<DeviceFloppy size={17} />}
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
  );
}

export default UpdateTripPage;
