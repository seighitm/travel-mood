import React from 'react';
import {
  ActionIcon,
  Badge,
  Box,
  createStyles,
  Divider,
  Group,
  Image,
  Paper,
  SimpleGrid,
  Spoiler,
  Text,
} from '@mantine/core';
import {isEmptyArray, isEmptyString, isNullOrUndefined} from "../../../utils/primitive-checks";
import {Clipboard, Clock, CurrencyDollar, Discount, Gps, Plane, User, World} from "../../../assets/Icons";
import {getNrOfDayByDateInterval} from '../../../utils/utils-func';

const useStyles = createStyles((theme) => ({
  wrapper: {
    marginTop: theme.spacing.lg,
    borderRadius: theme.radius.md,
    border: '2px solid ',
    boxShadow: theme.shadows.lg,
    borderColor: theme.colorScheme === 'dark' ? theme.colors.gray[8] : theme.colors.gray[2],
    position: 'relative',
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,
  },
}));

const TripContentInfo = React.memo(({trips}: any) => {
  const {classes} = useStyles();

  return <Paper className={classes.wrapper}>
    <Group mt={20} direction={'column'}>
      {!isNullOrUndefined(trips) && !isEmptyArray(trips?.destinations) &&
        <>
          <Group spacing={'sm'} mx={'lg'}>
            {trips.destinations.map((i: any) => (
              <Badge
                color={'teal'}
                key={i.name}
                leftSection={
                  <ActionIcon
                    size="xs"
                    color="blue"
                    radius="xl"
                    variant="transparent"
                  >
                    <Image
                      style={{height: '12px'}}
                      src={`${import.meta.env.VITE_API_URL}uploads/flags/${i.code.toLowerCase()}.svg`}
                      withPlaceholder
                    />
                  </ActionIcon>
                }
              >
                {i.name}
              </Badge>
            ))}
          </Group>
          <Divider style={{width: '100%'}}/>
        </>
      }
      {!isEmptyArray(trips.description) &&
        <>
          <Group mx={'lg'}>
            <ActionIcon>
              <Clipboard size={17}/>
            </ActionIcon>
            <Box>
              <Text size="md" weight="bold">
                Description:
              </Text>
            </Box>
          </Group>
          <Group mx={'xl'}>
            <Spoiler maxHeight={120} showLabel="Show more" hideLabel="Hide">
              <Text size="md">
                {trips.description}
              </Text>
            </Spoiler>
          </Group>
          <Divider style={{width: '100%'}}/>
        </>
      }
      <Group mx={'lg'}>
        <ActionIcon>
          <Clock size={17}/>
        </ActionIcon>
        <Group>
          <Text size="md" weight="bold">
            Date:
          </Text>
          {trips.isAnytime
            ? <Badge>Anytime</Badge>
            : <>
              <Badge>
                <Text size="sm">
                  {new Date(trips.dateFrom).toISOString().split('T')[0]} •••{' '}
                  {new Date(trips.dateTo).toISOString().split('T')[0]}
                </Text>
              </Badge>
              <Text size="sm">
                {getNrOfDayByDateInterval({dateFrom: trips.dateFrom, dateTo: trips.dateTo})}Days
              </Text>
            </>
          }
        </Group>
      </Group>
      <Divider style={{width: '100%'}}/>

      {!isEmptyArray(trips?.languages) &&
        <>
          <Group mx={'lg'}>
            <ActionIcon>
              <World size={17}/>
            </ActionIcon>
            <Group spacing={'sm'}>
              <Text size="md" weight="bold">
                Languages:
              </Text>
              {trips?.languages.map((item: any) => (
                <Badge size="sm" color={'grape'} key={item.name}>
                  <Text size="sm">
                    {item.name}
                  </Text>
                </Badge>
              ))}
            </Group>
          </Group>
          <Divider style={{width: '100%'}}/>
        </>
      }

      {!isEmptyArray(trips?.transports) &&
        <>
          <Group mx={'lg'}>
            <ActionIcon>
              <Plane size={17}/>
            </ActionIcon>
            <Group spacing={'sm'}>
              <Text size="md" weight="bold">
                Transports:
              </Text>
              {trips?.transports.map((item: any) => (
                <Badge color={'red'} key={item.name}>
                  <Text size="sm">{item.name}</Text>
                </Badge>
              ))}
            </Group>
          </Group>
          <Divider style={{width: '100%'}}/>
        </>
      }
    </Group>

    <SimpleGrid
      mt={20}
      mb={'xs'}
      cols={2}
      spacing="lg"
      breakpoints={[
        {maxWidth: 980, cols: 2, spacing: 'md'},
        {maxWidth: 755, cols: 2, spacing: 'sm'},
        {maxWidth: 600, cols: 1, spacing: 'sm'},
      ]}
    >
      {!isNullOrUndefined(trips?.itinerary) && !isEmptyString(trips?.itinerary) &&
        <Group>
          <ActionIcon ml={'lg'}>
            <Gps size={17}/>
          </ActionIcon>
          <Group>
            <Text size="md" weight="bold">
              Itinerary:
            </Text>
            <Badge color={'gray'}>
              <Text size="sm">
                {trips.itinerary}
              </Text>
            </Badge>
          </Group>
          <Divider style={{width: '100%'}}/>
        </Group>
      }

      {!isNullOrUndefined(trips?.budget) && !isEmptyString(trips?.budget) &&
        <Group>
          <ActionIcon ml={'lg'}>
            <CurrencyDollar size={17}/>
          </ActionIcon>
          <Group>
            <Text size="md" weight="bold">
              Budget:{' '}
            </Text>
            <Badge color={'pink'}>
              <Text size="sm">
                {trips?.budget} $
              </Text>
            </Badge>
          </Group>
          <Divider style={{width: '100%'}}/>
        </Group>
      }

      {!isNullOrUndefined(trips.gender) &&
        <Group>
          <ActionIcon ml={'lg'}>
            <User size={17}/>
          </ActionIcon>
          <Group>
            <Text size="md" weight="bold">
              Gender:{' '}
            </Text>
            <Badge color={'violet'}>
              <Text size="sm">
                {trips.gender.gender.split('_').join(' ')}
              </Text>
            </Badge>
          </Group>
          <Divider style={{width: '100%'}}/>
        </Group>
      }

      {!isNullOrUndefined(trips.splitCosts) &&
        <Group>
          <ActionIcon ml={'lg'}>
            <Discount size={17}/>
          </ActionIcon>
          <Group>
            <Text size="md" weight="bold">
              SplitCosts:
            </Text>
            <Badge color={'orange'}>
              <Text size="sm">{trips.splitCosts ? 'Yes' : 'No'}</Text>
            </Badge>
          </Group>
          <Divider style={{width: '100%'}}/>
        </Group>
      }
    </SimpleGrid>
  </Paper>
});

export default TripContentInfo;
