import React, { useMemo, useState } from 'react';
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
  NumberInput,
  Select,
  Textarea,
  TextInput,
  ThemeIcon,
} from '@mantine/core';
import { DateRangePicker } from '@mantine/dates';
import { useMutateAddTrip } from '../../../api/trips/mutations';
import CreateTripMap from '../../maps/CreateTripMap';
import { useForm } from '@mantine/form';
import {
  ArrowUp,
  CalendarEvent,
  Check,
  CurrencyDollar,
  DeviceFloppy,
  Language,
  Plane,
  User,
  World,
  X,
} from '../../common/Icons';
import { isEmptyArray, isEmptyString, isNullOrUndefined } from '../../../utils/primitive-checks';
import dayjs from 'dayjs';
import { useMediaQuery } from '@mantine/hooks';
import { capitalizeFirstLetter } from '../../../utils/utils-func';
import { useGetLanguages, useGetTransports } from '../../../api/info/queries';
import { BUDGET, ITINERARY, TRIP_GENDER_FEMALE, TRIP_GENDER_MALE } from '../../../utils/constants';
import CreateUpdateTripForm from '../Forms/CreateUpdateForm';

function CreateTrip() {
  const [destinations, setDestinations] = useState<any[]>([]);
  const [markers, setMarkers] = useState<any[]>([]);
  const [mapError, setMapError] = useState<string>('');
  const matches = useMediaQuery('(max-width: 900px)');

  const { data: dbLanguages } = useGetLanguages({});
  const { data: dbTransports } = useGetTransports({});
  const { mutate: mutateAddTrip, isLoading: isLoadingMutateAddTrip } = useMutateAddTrip();

  const form = useForm({ ...CreateUpdateTripForm });

  const handleSubmit = (data: any) => {
    if (destinations.length == 0 || markers.length == 0) {
      setMapError('Indicate at least one country!');
    } else {
      setMapError('');
      mutateAddTrip({ ...data, markers: markers, countries: destinations });
    }
  };

  return (
    <Container size={matches ? 'xl' : 'md'}>
      <Box style={{ position: 'relative' }}>
        <LoadingOverlay visible={isLoadingMutateAddTrip} />
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput placeholder="Enter title" label="Title" {...form.getInputProps('title')} />
          <Textarea
            placeholder="Enter description"
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
                icon={<CalendarEvent size={17} />}
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

          <NumberInput
            icon={<ArrowUp size={17} />}
            label="Number of persons"
            placeholder="Enter max number of persons"
            max={100}
            min={1}
            {...form.getInputProps('maxNrOfPersons')}
          />

          <Select
            disabled={form.values.maxNrOfPersons == '' || form.values.maxNrOfPersons == undefined}
            label="Gender"
            placeholder="Select gender"
            icon={<User size={17} />}
            {...form.getInputProps('gender')}
            data={form.values.maxNrOfPersons == '1' ? TRIP_GENDER_MALE : TRIP_GENDER_FEMALE}
          />

          <MultiSelect
            icon={<Language size={17} />}
            label="Languages"
            placeholder="Select languages"
            searchable
            {...form.getInputProps('languages')}
            data={
              !isNullOrUndefined(dbLanguages) && !isEmptyArray(dbLanguages)
                ? dbLanguages?.map((item: any) => ({
                    value: item.name,
                    label: item.name,
                  }))
                : []
            }
          />

          <MultiSelect
            icon={<Plane size={17} />}
            label="Transports"
            placeholder="Select transports"
            searchable
            {...form.getInputProps('transports')}
            data={
              !isNullOrUndefined(dbTransports) && !isEmptyArray(dbTransports)
                ? dbTransports?.map((item: any) => ({
                    value: item.name,
                    label: capitalizeFirstLetter(item?.name.toLowerCase()),
                  }))
                : []
            }
          />

          <Select
            icon={<World size={17} />}
            placeholder="Select itinerary"
            label="Select itinerary"
            {...form.getInputProps('itinerary')}
            data={ITINERARY}
          />

          <Select
            clearable
            placeholder="Select budget"
            label="Budget ($)"
            mb={'lg'}
            icon={<CurrencyDollar size={17} />}
            {...form.getInputProps('budget')}
            data={BUDGET}
          />

          <Checkbox
            mb={'lg'}
            label="Split costs"
            checked={form.getInputProps('isSplitCost').value}
            {...form.getInputProps('isSplitCost')}
          />

          {useMemo(
            () => (
              <CreateTripMap
                setDestinations={setDestinations}
                allMarkers={markers}
                setAllMarkers={setMarkers}
              />
            ),
            [destinations, markers]
          )}

          {!isEmptyString(mapError) && (
            <Group mt={'sm'} position={'center'}>
              <Badge color={'red'}>{mapError}</Badge>
            </Group>
          )}

          <Divider
            my={'lg'}
            labelPosition="center"
            style={{ width: '100%' }}
            label={
              Object.keys(form.errors).length !== 0 || mapError != '' ? (
                <ThemeIcon variant={'light'} color={'red'}>
                  <X size={17} />
                </ThemeIcon>
              ) : (
                <ThemeIcon variant={'light'} color={'blue'}>
                  <Check size={17} />
                </ThemeIcon>
              )
            }
          />

          <Group mb={'lg'} position="center">
            <Button color="blue" type="submit" rightIcon={<DeviceFloppy size={17} />}>
              Create
            </Button>
          </Group>
        </form>
      </Box>
    </Container>
  );
}

export default CreateTrip;
