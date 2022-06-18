import React, { useEffect, useState } from 'react';
import {
  Accordion,
  Autocomplete,
  Button,
  Checkbox,
  createStyles,
  Grid,
  Group,
  MultiSelect,
  Select,
} from '@mantine/core';
import { useGetUsers, useGetUsersByNameOrEmail } from '../../api/users/queries';
import useStore from '../../store/user.store';
import { useGetCountries, useGetLanguages } from '../../api/info/queries';
import { UserCard } from './UserCart';
import chatStore from '../../store/chat.store';
import { useDebouncedValue } from '@mantine/hooks';
import { ArrowBackUp, ChevronDown, Search } from '../common/Icons';
import { getFullUserName } from '../../utils/utils-func';
import { isEmptyArray, isEmptyString, isNullOrUndefined } from '../../utils/primitive-checks';
import { USER_GENDER } from '../../utils/constants';
import { useQueryClient } from 'react-query';
import UserCardSkeleton from './UserCardSkeleton';

const useStyles = createStyles((theme, _params, getRef) => {
  const icon = getRef('control');
  return {
    wrapper: {
      marginBottom: theme.spacing.md,
    },
    title: {
      color: theme.white,
      fontSize: 52,
      fontFamily: `Greycliff CF, ${theme.fontFamily}`,
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

function UsersList() {
  const { classes } = useStyles();
  const { socket } = chatStore((state: any) => state);
  const { user, onlineUsers } = useStore((state: any) => state);
  const [location, setLocation] = useState<any>([]);
  const [tripTo, setTripTo] = useState<any>([]);
  const [languages, setLanguages] = useState<any>([]);
  const [gender, setGender] = useState<any>('');
  const [age, setAge] = useState<string | null>('');
  const [name, setName] = useState<string>('');
  const [isOnline, setIsOnline] = useState<boolean | undefined>(undefined);

  const { data: dataLanguages } = useGetLanguages({});
  const { data: dataLocations } = useGetCountries({});
  const queryClient = useQueryClient();

  const [debouncedFirstName] = useDebouncedValue(name, 300);
  const { data: dbUsers, isFetching: isFetchingDbTrips } =
    useGetUsersByNameOrEmail(debouncedFirstName);

  useEffect(() => {
    if (!isNullOrUndefined(user) && socket) {
      socket.emit('get-online-users');
    }
  }, [user, socket]);

  const { data: users, refetch: refetchUsers } = useGetUsers({
    age: age,
    name: name,
    gender: gender,
    tripTo: tripTo,
    languages: languages,
    countries: location,
    isOnline: isOnline,
  });

  const handlerFilter = async () => {
    await refetchUsers();
    if (!isNullOrUndefined(user) && socket) {
      socket.emit('get-online-users');
    }
  };

  const handlerResetFilter = async () => {
    setGender('');
    setName('');
    setAge('');
    setLanguages([]);
    setLocation([]);
    setTripTo([]);
    setIsOnline(false);
    setTimeout(() => refetchUsers(), 4);
  };

  return (
    <div className={classes.wrapper}>
      <Accordion
        iconPosition="right"
        initialItem={-1}
        mb={'md'}
        icon={<ChevronDown size={17} />}
        classNames={{
          item: classes.item,
          control: classes.control,
          icon: classes.icon,
          contentInner: classes.content,
        }}
      >
        <Accordion.Item label="Filter">
          {!isNullOrUndefined(user) && (
            <Group position={'center'} style={{ width: '100%' }}>
              <Checkbox
                mb={'lg'}
                label="Online"
                checked={isOnline}
                onChange={(event) => setIsOnline(event.currentTarget.checked)}
              />
            </Group>
          )}
          <Grid>
            <Grid.Col md={6} lg={4}>
              <MultiSelect
                searchable
                clearable
                placeholder="Countries"
                value={location}
                onChange={setLocation}
                data={
                  dataLocations && dataLocations?.length > 0
                    ? dataLocations.map((item: any) => item.name)
                    : []
                }
              />
            </Grid.Col>

            <Grid.Col md={6} lg={4}>
              <MultiSelect
                clearable
                placeholder="Travel to..."
                value={tripTo}
                searchable
                onChange={setTripTo}
                data={
                  dataLocations && dataLocations?.length > 0
                    ? dataLocations.map((item: any) => item.name)
                    : []
                }
              />
            </Grid.Col>

            <Grid.Col md={6} lg={4}>
              <MultiSelect
                clearable
                searchable
                placeholder="Languages"
                value={languages}
                onChange={setLanguages}
                data={dataLanguages?.length > 0 ? dataLanguages.map((item: any) => item.name) : []}
              />
            </Grid.Col>

            <Grid.Col md={6} lg={4}>
              <Select
                clearable
                placeholder="Gender"
                value={gender}
                onChange={setGender}
                data={USER_GENDER}
              />
            </Grid.Col>

            <Grid.Col md={6} lg={4}>
              <Select
                clearable
                placeholder="Age"
                value={age}
                onChange={setAge}
                data={[
                  { value: '18-24', label: '18-24' },
                  { value: '25-34', label: '25-34' },
                  { value: '35-44', label: '35-44' },
                  { value: '45-54', label: '45-54' },
                  { value: '55-100', label: '55-100' },
                ]}
              />
            </Grid.Col>

            <Grid.Col md={6} lg={4}>
              <Autocomplete
                placeholder="Users"
                value={name}
                onChange={setName}
                data={
                  !isEmptyString(name) && !isNullOrUndefined(dbUsers)
                    ? dbUsers.map((us: any) => getFullUserName(us))
                    : []
                }
              />
            </Grid.Col>
            <Grid.Col md={6} lg={4}>
              <Group grow position={'right'}>
                <Button leftIcon={<Search size={17} />} onClick={() => handlerFilter()}>
                  Filter
                </Button>

                <Button
                  leftIcon={<ArrowBackUp size={17} />}
                  onClick={() => handlerResetFilter()}
                  variant={'light'}
                  color="red"
                >
                  Reset
                </Button>
              </Group>
            </Grid.Col>
          </Grid>
        </Accordion.Item>
      </Accordion>

      {isFetchingDbTrips && isNullOrUndefined(queryClient.getQueryData(['users', 'all'])) ? (
        <UserCardSkeleton />
      ) : (
        <>
          {!isNullOrUndefined(users) && !isEmptyArray(users) && (
            <Grid>
              {users
                ?.filter((item: any) => item.id != user?.id)
                ?.map((item: any) => (
                  <Grid.Col xs={12} sm={6} md={4} lg={3} key={item.id}>
                    <UserCard
                      folloers={item.followedBy}
                      role={item.role.role}
                      key={item.email}
                      gender={item?.gender}
                      name={getFullUserName(item)}
                      onlineUsers={onlineUsers}
                      id={item.id}
                      picture={item.picture}
                      isFollowedByUser={item?.followedBy?.find((us: any) => us.id == user?.id)}
                    />
                  </Grid.Col>
                ))}
            </Grid>
          )}
        </>
      )}
    </div>
  );
}

export default UsersList;
