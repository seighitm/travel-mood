import React from 'react';
import {Accordion, Button, createStyles, Group, MultiSelect, Select, SimpleGrid,} from '@mantine/core';
import {useGetLanguages} from '../../../api/languages/queries';
import {useGetLocations} from '../../../api/countries/queries';
import {DateRangePicker} from '@mantine/dates';
import {useNavigate} from "react-router-dom";
import {
  CalendarEvent,
  ChevronDown,
  CurrencyDollar,
  GenderBigender,
  Language,
  Map,
  Search,
  Trash
} from "../../../assets/Icons";
import {isEmptyArray, isNullOrUndefined} from "../../../utils/primitive-checks";

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
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,
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

export function SearchTripsComponent({
                                       setActivePage,
                                       refetchDbTrips,
                                       languages,
                                       setLanguages,
                                       destinations,
                                       setDestinations,
                                       sex,
                                       setSex,
                                       date,
                                       setDate,
                                       budget,
                                       setBudget,
                                     }: any) {
  const {classes} = useStyles();
  const {data: dbLanguages} = useGetLanguages({});
  const {data: dbLocations} = useGetLocations({});
  const navigate = useNavigate()

  const handlerFilter = async () => {
    await refetchDbTrips();
  };

  const handlerResetFilter = () => {
    setSex('');
    setLanguages([]);
    setDestinations([]);
    setActivePage(1)
    navigate('/trips/1')
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
          <SimpleGrid mt={10} mb={'lg'} cols={2} spacing={12}>
            <DateRangePicker
              icon={<CalendarEvent size={17}/>}
              placeholder="Select date"
              value={date}
              onChange={setDate}
            />
            <Select
              clearable
              placeholder="Budget"
              onChange={setBudget}
              value={budget}
              icon={<CurrencyDollar size={17}/>}
              data={[
                {value: '0-150', label: '$0 - 150$'},
                {value: '150-500', label: '$150 - 500$'},
                {value: '500-1000', label: '$500 - 1000$'},
                {value: '1000-1500', label: '$1000 - 1500$'},
                {value: '1500-2000', label: '$1500$ - 2000$'},
                {value: '2000', label: '2000$ +'},
              ]}
            />
            <MultiSelect
              searchable
              clearable
              icon={<Map size={17}/>}
              placeholder="Countries"
              value={destinations}
              onChange={setDestinations}
              data={!isNullOrUndefined(dbLocations) && !isEmptyArray(dbLocations)
                ? dbLocations?.map((item: any) => ({
                  value: item.code,
                  label: item.name,
                })) : []
              }
            />
            <MultiSelect
              placeholder="Languages"
              value={languages}
              searchable
              onChange={setLanguages}
              icon={<Language size={17}/>}
              clearable
              data={!isNullOrUndefined(dbLanguages) && !isEmptyArray(dbLanguages)
                ? dbLanguages?.map((item: any) => ({
                  value: item.name,
                  label: item.name,
                })) : []
              }
            />
            <Select
              clearable
              placeholder="Gender"
              value={sex}
              onChange={setSex}
              icon={<GenderBigender size={17}/>}
              data={[
                {value: 'M', label: 'Male'},
                {value: 'F', label: 'Female'},
                {value: 'O', label: 'Other'},
              ]}
            />
          </SimpleGrid>
          <Group position={'right'}>
            <Button leftIcon={<Search size={17}/>}
                    onClick={() => handlerFilter()}
            >
              Find
            </Button>
            <Button leftIcon={<Trash size={17}/>}
                    color="red"
                    onClick={() => {
                      handlerResetFilter()
                    }}
            >
              Reset
            </Button>
          </Group>
        </Accordion.Item>
      </Accordion>
    </div>
  );
}
