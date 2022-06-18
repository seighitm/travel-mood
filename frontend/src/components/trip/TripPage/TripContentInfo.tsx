import React from 'react';
import {
  ActionIcon,
  Badge,
  createStyles,
  Divider,
  Group,
  Image,
  Paper,
  SimpleGrid,
  Text,
} from '@mantine/core';
import { isEmptyArray, isEmptyString, isNullOrUndefined } from '../../../utils/primitive-checks';
import {
  Clock,
  CurrencyDollar,
  Discount,
  Gps,
  Language,
  Plane,
  User,
  World,
} from '../../common/Icons';
import { dateFormattedToIsoString, getNrOfDayByDateInterval } from '../../../utils/utils-func';
import { ITrip } from '../../../types/ITrip';

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

interface TripContentInfoComponentProps {
  trip: ITrip;
}

const TripContentInfo = React.memo(({ trip }: TripContentInfoComponentProps) => {
  const { classes } = useStyles();
  return (
    <Paper className={classes.wrapper}>
      <Group spacing={'xs'} mt={20} direction={'column'}>
        {!isNullOrUndefined(trip) && !isEmptyArray(trip?.destinations) && (
          <>
            <Group spacing={'xs'} mx={'lg'}>
              <Group spacing={'xs'}>
                <ActionIcon>
                  <World size={17} />
                </ActionIcon>
                <Text size="md" weight="bold">
                  Countries:
                </Text>
              </Group>
              {trip?.destinations.map((i: any) => (
                <Badge
                  styles={{ inner: { fontSize: '14px' } }}
                  color={'teal'}
                  key={i.name}
                  leftSection={
                    <ActionIcon size="xs" color="blue" radius="xl" variant="transparent">
                      <Image
                        style={{ height: '12px' }}
                        src={`${
                          import.meta.env.VITE_API_URL
                        }uploads/flags/${i.code.toLowerCase()}.svg`}
                        withPlaceholder
                      />
                    </ActionIcon>
                  }
                >
                  {i.name}
                </Badge>
              ))}
            </Group>
            <Divider style={{ width: '100%' }} />
          </>
        )}
        {!isEmptyArray(trip?.languages) && (
          <>
            <Group mx={'lg'}>
              <Group spacing={'xs'}>
                <ActionIcon>
                  <Language size={17} />
                </ActionIcon>
                <Text size="md" weight="bold">
                  Languages:
                </Text>
                {trip?.languages.map((item: any) => (
                  <Badge styles={{ inner: { fontSize: '14px' } }} color={'grape'} key={item.name}>
                    {item.name}
                  </Badge>
                ))}
              </Group>
            </Group>
            <Divider style={{ width: '100%' }} />
          </>
        )}

        {!isEmptyArray(trip?.transports) && (
          <>
            <Group mx={'lg'}>
              <ActionIcon>
                <Plane size={17} />
              </ActionIcon>
              <Group spacing={'xs'}>
                <Text size="md" weight="bold">
                  Transports:
                </Text>
                {trip?.transports.map((item: any) => (
                  <Badge styles={{ inner: { fontSize: '14px' } }} color={'red'} key={item.name}>
                    {item.name}
                  </Badge>
                ))}
              </Group>
            </Group>
            <Divider style={{ width: '100%' }} />
          </>
        )}
      </Group>

      <SimpleGrid
        mt={'xs'}
        cols={2}
        spacing={'xs'}
        breakpoints={[
          { maxWidth: 980, cols: 2, spacing: 'md' },
          { maxWidth: 755, cols: 2, spacing: 'sm' },
          { maxWidth: 600, cols: 1, spacing: 'sm' },
        ]}
      >
        {!isNullOrUndefined(trip?.itinerary) && !isEmptyString(trip?.itinerary) && (
          <Group spacing={'xs'}>
            <ActionIcon ml={'lg'}>
              <Gps size={17} />
            </ActionIcon>
            <Group spacing={'xs'}>
              <Text size="md" weight="bold">
                Itinerary:
              </Text>
              <Badge styles={{ inner: { fontSize: '14px' } }} color={'gray'}>
                {trip?.itinerary}
              </Badge>
            </Group>
            <Divider style={{ width: '100%' }} />
          </Group>
        )}

        {!isNullOrUndefined(trip?.budget) && !isEmptyString(trip?.budget) && (
          <Group spacing={'xs'}>
            <ActionIcon ml={'lg'}>
              <CurrencyDollar size={17} />
            </ActionIcon>
            <Group>
              <Text size="md" weight="bold">
                Budget:{' '}
              </Text>
              <Badge styles={{ inner: { fontSize: '14px' } }} color={'pink'}>
                {trip?.budget} $
              </Badge>
            </Group>
            <Divider style={{ width: '100%' }} />
          </Group>
        )}

        {!isNullOrUndefined(trip?.maxNrOfPersons) && !isEmptyString(trip?.maxNrOfPersons) && (
          <Group spacing={'xs'}>
            <ActionIcon ml={'lg'}>
              <CurrencyDollar size={17} />
            </ActionIcon>
            <Group>
              <Text size="md" weight="bold">
                Persons:{' '}
              </Text>
              <Badge
                styles={{ inner: { fontSize: '14px' } }}
                color={
                  trip?.usersJoinToTrip?.filter((item: any) => item.status == 'APPROVED').length ==
                  trip?.maxNrOfPersons
                    ? 'pink'
                    : 'green'
                }
                variant={
                  trip?.usersJoinToTrip?.filter((item: any) => item.status == 'APPROVED').length ==
                  trip?.maxNrOfPersons
                    ? 'filled'
                    : 'light'
                }
              >
                {trip?.usersJoinToTrip?.filter((item: any) => item.status == 'APPROVED').length} /{' '}
                {trip?.maxNrOfPersons}
              </Badge>
            </Group>
            <Divider style={{ width: '100%' }} />
          </Group>
        )}

        {!isNullOrUndefined(trip?.splitCosts) && (
          <Group spacing={'xs'}>
            <ActionIcon ml={'lg'}>
              <Discount size={17} />
            </ActionIcon>
            <Group>
              <Text size="md" weight="bold">
                SplitCosts:
              </Text>
              <Badge styles={{ inner: { fontSize: '14px' } }} color={'orange'}>
                {trip?.splitCosts ? 'Yes' : 'No'}
              </Badge>
            </Group>
            <Divider style={{ width: '100%' }} />
          </Group>
        )}

        {!isNullOrUndefined(trip?.gender) && (
          <Group spacing={'xs'}>
            <Group>
              <ActionIcon ml={'lg'}>
                <User size={17} />
              </ActionIcon>
              <Text mr={'xs'} size="md" weight="bold">
                Preferred gender:{' '}
              </Text>
            </Group>
            <Group>
              <Badge styles={{ inner: { fontSize: '14px' } }} color={'violet'}>
                {trip?.gender.gender.split('_').join(' ')}
              </Badge>
            </Group>
            <Divider style={{ width: '100%' }} />
          </Group>
        )}

        <Group spacing={'xs'}>
          <Group>
            <ActionIcon ml={'lg'}>
              <Clock size={17} />
            </ActionIcon>
            <Text mr={'xs'} size="md" weight="bold">
              Date:
            </Text>
          </Group>
          <Group>
            {trip?.isAnytime ? (
              <Badge styles={{ inner: { fontSize: '14px' } }}>Anytime</Badge>
            ) : (
              <>
                <Badge styles={{ inner: { fontSize: '14px' } }}>
                  {dateFormattedToIsoString(trip?.dateFrom)} •••{' '}
                  {dateFormattedToIsoString(trip?.dateTo)}
                </Badge>
                <Text size="sm">
                  ({getNrOfDayByDateInterval({ dateFrom: trip?.dateFrom, dateTo: trip?.dateTo })}{' '}
                  Days)
                </Text>
              </>
            )}
          </Group>
          <Divider style={{ width: '100%' }} />
        </Group>
      </SimpleGrid>
    </Paper>
  );
});

export default TripContentInfo;
