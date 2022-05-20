import React, {useEffect, useState} from 'react';
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
import {useFilterUser, useGetUsersByNameOrEmail} from '../../api/users/queries';
import useStore from '../../store/user.store';
import {useGetLanguages} from '../../api/languages/queries';
import {useGetLocations} from '../../api/countries/queries';
import {UserCard} from './UserCart';
import chatStore from '../../store/chat.store';
import {useDebouncedValue} from "@mantine/hooks";
import {ArrowBackUp, ChevronDown, Search} from "../../assets/Icons";
import {getFullUserName} from "../../utils/utils-func";
import { isNullOrUndefined } from '../../utils/primitive-checks';

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
  const {classes} = useStyles();
  const {socket} = chatStore((state: any) => state);
  const {user, onlineUsers} = useStore((state: any) => state);
  const [location, setLocation] = useState<any>([]);
  const [tripTo, setTripTo] = useState<any>([]);
  const [languages, setLanguages] = useState<any>([]);
  const [gender, setGender] = useState<any>('');
  const [age, setAge] = useState<any>('');
  const [name, setName] = useState<string>('');
  const [isOnline, setIsOnline] = useState<boolean>(false);

  const {data: dataLanguages} = useGetLanguages({});
  const {data: dataLocations} = useGetLocations({});

  const [debouncedFirstName] = useDebouncedValue(name, 300);
  const {data: dbUsers} = useGetUsersByNameOrEmail(debouncedFirstName);

  useEffect(() => {
    if (!!user && socket) socket.emit('get-online-users');
  }, [user, socket]);

  const {data: users, refetch: refetchUsers} = useFilterUser({
    age: age,
    name: name,
    sex: gender,
    tripTo: tripTo,
    languages: languages,
    countries: location,
    isOnline: isOnline,
  });

  const handlerFilter = async () => {
    await refetchUsers();
    if (!!user && socket) socket.emit('get-online-users');
  };

  const handlerResetFilter = async () => {
    setGender('');
    setName('');
    setAge('');
    setLanguages([]);
    setLocation([]);
    setTripTo([]);
    await refetchUsers();
  };

  return (
    <div className={classes.wrapper}>
      <Accordion
        iconPosition="right"
        initialItem={-1}
        mb={'md'}
        icon={<ChevronDown size={17}/>}
        classNames={{
          item: classes.item,
          control: classes.control,
          icon: classes.icon,
          contentInner: classes.content,
        }}
      >
        <Accordion.Item label="Filter">
          <Grid>
            <Grid.Col md={6} lg={4}>
              <MultiSelect
                searchable
                placeholder="Countries"
                value={location}
                onChange={setLocation}
                data={dataLocations && dataLocations?.length > 0
                  ? dataLocations.map((item: any) => item.name)
                  : []
                }
              />
            </Grid.Col>

            <Grid.Col md={6} lg={4}>
              <MultiSelect
                placeholder="Travel to..."
                value={tripTo}
                searchable
                onChange={setTripTo}
                data={dataLocations && dataLocations?.length > 0
                  ? dataLocations.map((item: any) => item.name)
                  : []
                }
              />
            </Grid.Col>

            <Grid.Col md={6} lg={4}>
              <MultiSelect
                searchable
                placeholder="Languages"
                value={languages}
                onChange={setLanguages}
                data={dataLanguages?.length > 0
                  ? dataLanguages.map((item: any) => item.name)
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
                data={[
                  {value: 'MALE', label: 'Male'},
                  {value: 'FEMALE', label: 'Female'},
                  {value: 'OTHER', label: 'Other'},
                ]}
              />
            </Grid.Col>

            <Grid.Col md={6} lg={4}>
              <Select
                clearable
                placeholder="Age"
                value={age}
                onChange={setAge}
                data={[
                  {value: '18-24', label: '18-24'},
                  {value: '25-34', label: '25-34'},
                  {value: '35-44', label: '35-44'},
                  {value: '45-54', label: '45-54'},
                  {value: '55-100', label: '55-100'},
                ]}
              />
            </Grid.Col>

            <Grid.Col md={6} lg={4}>
              <Autocomplete
                placeholder="Users"
                value={name}
                onChange={setName}
                data={name && dbUsers ? dbUsers.map((us: any) => (getFullUserName(us))) : []}
              />
            </Grid.Col>
          </Grid>
          {!isNullOrUndefined(user) &&
            <Group mt={'md'} position={'center'} style={{width: '100%'}}>
              <Checkbox
                mb={'lg'}
                label="Online"
                checked={isOnline}
                onChange={(event) => setIsOnline(event.currentTarget.checked)}
              />
            </Group>
          }

          <Group position={'right'}>
            <Button
              leftIcon={<Search size={17}/>}
              onClick={() => handlerFilter()}
            >
              Filter
            </Button>

            <Button
              leftIcon={<ArrowBackUp size={17}/>}
              onClick={() => handlerResetFilter()}
              color="red"
            >
              Reset
            </Button>
          </Group>
        </Accordion.Item>
      </Accordion>
      <Grid>
        {users?.filter((item: any) => item.id != user?.id)?.map((item: any) => (
          <Grid.Col xs={12} sm={6} md={4} lg={3} key={item.id}>
            <UserCard
              role={item.role.role}
              key={item.email}
              name={`${item.firstName} - ${item.lastName}`}
              onlineUsers={onlineUsers}
              id={item.id}
              picture={item.picture}
              isFollowedByUser={item?.followedBy?.find((us: any) => us.id == user?.id)}
            />
          </Grid.Col>
        ))}
      </Grid>
    </div>
  );
}

export default UsersList;
