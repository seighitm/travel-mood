import React, {Dispatch, useState} from 'react';
import {Accordion, Button, createStyles, Grid, Group, MultiSelect, Select, TextInput,} from '@mantine/core';
import {useGetCountries, useGetLanguages} from '../../../api/info/queries';
import {DateRangePicker} from '@mantine/dates';
import {
  CalendarEvent,
  ChevronDown,
  CurrencyDollar,
  GenderBigender,
  Language,
  Map,
  Search,
  Trash,
} from '../../common/Icons';
import {isEmptyArray, isNullOrUndefined} from '../../../utils/primitive-checks';
import {getHotkeyHandler} from '@mantine/hooks';
import {useTripsQuery} from '../../../api/trips/queries';
import {BUDGET, TRIP_GENDER} from '../../../utils/constants';

const useStyles = createStyles((theme, _params, getRef) => {
  const icon = getRef('control');
  return {
    wrapper: {
      borderRadius: theme.radius.md,
      marginBottom: theme.spacing.md,
      border: '2px solid ',
      borderColor: theme.colorScheme === 'dark' ? theme.colors.gray[8] : theme.colors.gray[0],
    },
    item: {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
      borderBottom: 0,
      borderRadius: theme.radius.md,
      boxShadow: theme.shadows.xs,
    },
    control: {
      fontSize: theme.fontSizes.lg,
      padding: `${theme.spacing.xs}px ${theme.spacing.xl}px`,
      '&:hover': {
        backgroundColor: 'transparent',
      },
    },
    content: {
      paddingLeft: theme.spacing.xl,
      lineHeight: 1.6,
    },
    icon: {
      ref: icon,
      marginLeft: theme.spacing.md,
    },
    gradient: {
      backgroundImage: `radial-gradient(${theme.colors[theme.primaryColor][6]} 0%, ${
        theme.colors[theme.primaryColor][5]
      } 100%)`,
    },
  };
});

interface SearchTripsComponentProps {
  activePage: number;
  setActivePage: Dispatch<React.SetStateAction<number>>;
}

export function FilterBarTrips({activePage, setActivePage}: SearchTripsComponentProps) {
  const {classes} = useStyles();
  const [languages, setLanguages] = useState<string[]>([]);
  const [destinations, setDestinations] = useState<string[]>([]);
  const [gender, setGender] = useState<string | null>('');
  const [date, setDate] = useState<any>(null);
  const [budget, setBudget] = useState<string | undefined | null>('0');
  const [title, setTitle] = useState<string>('');

  const {data: dbLanguages} = useGetLanguages({});
  const {data: dbLocations} = useGetCountries({});
  const {refetch: refetchDbTrips} = useTripsQuery({
    filterFields: {
      destinations: destinations,
      languages: languages,
      gender: gender,
      date: date,
      budget: budget,
      title: title,
    },
    page: activePage,
  });

  const handlerFilter = async () => {
    await refetchDbTrips();
  };

  const handlerResetFilter = () => {
    setGender('');
    setLanguages([]);
    setDestinations([]);
    setDate([]);
    setActivePage(1);
    setTimeout(() => refetchDbTrips(), 5);
  };

  return (
    <div className={classes.wrapper}>
      <Accordion
        iconPosition="right"
        initialItem={-1}
        icon={<ChevronDown size={17}/>}
        classNames={{
          item: classes.item,
          control: classes.control,
          icon: classes.icon,
          contentInner: classes.content,
        }}
      >
        <Accordion.Item label="Filter">
          <TextInput
            onKeyDown={getHotkeyHandler([['Enter', handlerFilter]])}
            mb={'sm'}
            icon={<Search size={15}/>}
            value={title}
            onChange={({currentTarget}: any) => setTitle(currentTarget.value)}
            placeholder="Title"
          />
          <Grid>
            <Grid.Col md={6} lg={4}>
              <DateRangePicker
                icon={<CalendarEvent size={17}/>}
                placeholder="Select date"
                value={date}
                onChange={setDate}
              />
            </Grid.Col>

            <Grid.Col md={6} lg={4}>
              <Select
                clearable
                placeholder="Budget"
                onChange={setBudget}
                value={budget}
                icon={<CurrencyDollar size={17}/>}
                data={BUDGET}
              />
            </Grid.Col>

            <Grid.Col md={6} lg={4}>
              <MultiSelect
                searchable
                clearable
                icon={<Map size={17}/>}
                placeholder="Countries"
                value={destinations}
                onChange={setDestinations}
                data={
                  !isNullOrUndefined(dbLocations) && !isEmptyArray(dbLocations)
                    ? dbLocations?.map((item: any) => ({
                      value: item.code,
                      label: item.name,
                    }))
                    : []
                }
              />
            </Grid.Col>

            <Grid.Col md={6} lg={4}>
              <MultiSelect
                placeholder="Languages"
                value={languages}
                searchable
                onChange={setLanguages}
                icon={<Language size={17}/>}
                clearable
                data={
                  !isNullOrUndefined(dbLanguages) && !isEmptyArray(dbLanguages)
                    ? dbLanguages?.map((item: any) => ({
                      value: item.name,
                      label: item.name,
                    }))
                    : []
                }
              />
            </Grid.Col>

            <Grid.Col md={6} lg={4}>
              <Select
                clearable
                placeholder="Gender"
                value={gender}
                onChange={setGender}
                icon={<GenderBigender size={17}/>}
                data={TRIP_GENDER}
              />
            </Grid.Col>
            <Grid.Col md={6} lg={4}>
              <Group grow position={'right'}>
                <Button leftIcon={<Search size={17}/>} onClick={() => handlerFilter()}>
                  Find
                </Button>
                <Button
                  leftIcon={<Trash size={17}/>}
                  color="red"
                  variant={'light'}
                  onClick={() => {
                    handlerResetFilter();
                  }}
                >
                  Reset
                </Button>
              </Group>
            </Grid.Col>
          </Grid>
        </Accordion.Item>
      </Accordion>
    </div>
  );
}
