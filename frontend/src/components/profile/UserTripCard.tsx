import React, {useState} from 'react';
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Collapse,
  createStyles,
  Divider,
  Group,
  Image,
  Text,
  useMantineTheme,
} from '@mantine/core';
import {
  ArrowDownIcon,
  ArrowUpIcon,
  BackpackIcon,
  LetterCaseCapitalizeIcon,
  LightningBoltIcon,
  PersonIcon
} from '@modulz/radix-icons';
import {useLocation, useNavigate} from 'react-router-dom';
import useStore from "../../store/user.store";
import {useMutateFavoriteTrip, useMutateUnFavoriteTrip} from "../../api/trips/mutations";
import CustomPaper from "../common/CustomPaper";
import {Star} from "../../assets/Icons";
import {isNullOrUndefined} from "../../utils/primitive-checks";


const useStyles = createStyles((theme) => ({
  wrapper: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing.xl,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
    border: `1px solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[3]
    }`,

    [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
      flexDirection: 'column',
      padding: theme.spacing.xl,
    },
  },

  body: {
    paddingLeft: theme.spacing.lg,
    marginTop: theme.spacing.xl,
    [`@media (max-width: ${theme.breakpoints.md}px)`]: {
      paddingLeft: 0,
      marginTop: theme.spacing.xs,
    },
  },

  title: {
    cursor: 'pointer',
    color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    lineHeight: 1,
    marginBottom: theme.spacing.md,
  },

  image: {
    marginTop: '12px',
    marginRight: '12px'
  },

  imageCaption: {
    caption: {
      margin: 0,
      '&:hover': {
        color: 'blue',
        weight: '900px',
      },
    },
  },

  badgeItem: {
    marginBottom: theme.spacing.xs,
    color: theme.colorScheme === 'dark' ? 'dark' : 'gray'
  },

  icon: {
    width: '14px',
    height: '14px'
  },
}));

const UserTripCard = React.memo(({trip}: any) => {
  const {user} = useStore((state: any) => state);
  const navigate = useNavigate();
  const {classes} = useStyles();
  const theme = useMantineTheme();
  let location = useLocation();
  const {mutate: mutateUnFavorite, isLoading: isLoadingUF} = useMutateUnFavoriteTrip();
  const {mutate: mutateFavorite, isLoading: isLoadingFF} = useMutateFavoriteTrip();

  const handlerFavorite = (trip: any) => {
    if (trip.tripFavoritedBy?.find((item: any) => item.id == user?.id) === undefined)
      mutateFavorite({id: trip.id});
    else
      mutateUnFavorite({id: trip.id});
  };

  const [opened, setOpen] = useState(false);
  return <Box key={trip.id}>
    <CustomPaper style={{position: 'relative'}}>
      {/*{location.pathname === '/trips' &&*/}
      <Group position={'apart'}>
        <Text onClick={() => navigate('/trip/' + trip.id)}
              mb={0}
              weight={'bold'}
              variant="gradient"
              style={{fontSize: '30px', cursor: 'pointer'}}
              gradient={{from: 'indigo', to: 'orange', deg: 15}}
        >
          {trip.title?.toUpperCase().slice(0, 17) +
            (trip.title?.toUpperCase().length >= 17 ? '...' : '')}
        </Text>
        <Badge
          style={{cursor: 'pointer'}}
          variant={"light"}
          color={"gray"}
          px={'xs'}
          size="xl"
          leftSection={
            <ActionIcon
              radius={'xl'}
              size={'md'}
              onClick={() => handlerFavorite(trip)}
              color={theme.colors.red[7]}
              variant={'transparent'}
              disabled={isLoadingUF || isLoadingFF || !user}
              loading={isLoadingUF || isLoadingFF}
            >
              <Star
                size={17}
                color={isNullOrUndefined(user) ? 'gray' : theme.colors.red[6]}
                fill={trip.tripFavoritedBy?.find((item: any) => item.id == user?.id) !== undefined
                  ? theme.colors.red[6]
                  : 'none'
                }/>
            </ActionIcon>
          }
        >
          <Group
            position={'center'}
            p={0}
            style={{
              color:
                trip.tripFavoritedBy?.find((item: any) => item.id == user?.id) ===
                undefined
                  ? theme.colors.gray[5]
                  : theme.colors.red[5],
              width: '18px',
              height: '30px',
              textAlign: 'center',
            }}
          >
            {trip.tripFavoritedBy.length ? trip.tripFavoritedBy.length : '0'}
          </Group>
        </Badge>
      </Group>
      {/*}*/}
      <Box className={classes.body}>
        <Divider
          style={{width: '100%'}}
          my={'xs'}
          label={
            <>
              <LightningBoltIcon className={classes.icon}/>
              <Box ml={5}>Details:</Box>
            </>
          }
        />
        {trip?.languages?.map((item: any) =>
          <Badge
            className={classes.badgeItem}
            mr={'xs'}
            color={'green'}
            key={item.name}
            leftSection={
              <ActionIcon size="xs" color="blue" radius="xl" variant="transparent">
                <LetterCaseCapitalizeIcon className={classes.icon}/>
              </ActionIcon>
            }
          >
            Language: {item.name}
          </Badge>
        )}
        <Group spacing={0}>
          <Badge
            className={classes.badgeItem}
            mr={'xs'}
            leftSection={
              <ActionIcon size="xs" color="blue" radius="xl" variant="transparent">
                <PersonIcon/>
              </ActionIcon>
            }
          >
            Sex: {trip.sex == 'f' ? 'Male' : 'Female'}
          </Badge>
          <Badge
            className={classes.badgeItem}
            mr={'md'}
            leftSection={
              <ActionIcon size="xs" color="blue" radius="xl" variant="transparent">
                <BackpackIcon/>
              </ActionIcon>
            }
          >
            Budget: {trip.budget} $
          </Badge>
        </Group>
        <Divider
          style={{width: '100%'}}
          my={'xs'}
          label={
            <>
              <LightningBoltIcon className={classes.icon}/>
              <Box ml={5}>Description:</Box>
            </>
          }
        />
        <Text weight={500} size="lg" mb={5} lineClamp={3}>
          {trip.description}
        </Text>
        <Divider
          style={{width: '100%'}}
          my={'xs'}
          label={
            <>
              <LightningBoltIcon className={classes.icon}/>
              <Box ml={5}>Countries:</Box>
            </>
          }
        />
        <Group mb={'sm'} mt={5} position={'left'}>
          <Button
            compact
            variant={'subtle'}
            color={'blue'}
            onClick={() => setOpen((o) => !o)}
            leftIcon={
              opened ? <ArrowUpIcon/> : <ArrowDownIcon/>
            }
          >
            {opened ? 'Hide' : 'Show countries'}
          </Button>
          <Collapse style={{width: '100%'}} in={opened}>
            {trip?.destinations?.map((i: any) => (
              <Badge
                className={classes.badgeItem}
                mr={'md'}
                key={i.name}
                leftSection={
                  <ActionIcon
                    size="xs"
                    color="blue"
                    radius="xl"
                    variant="transparent"
                  >
                    <Image
                      width={15}
                      withPlaceholder
                      styles={() => ({image: {marginBottom: '0px!important'}})}
                      src={`${import.meta.env.VITE_API_URL}uploads/flags/${i.code.toLowerCase()}.svg`}
                    />
                  </ActionIcon>
                }
              >
                {i.name}
              </Badge>
            ))}
          </Collapse>
        </Group>

      </Box>
    </CustomPaper>
  </Box>
});

const CountriesListSection = (
  {
    destinations
  }
    : any) => {
  const {classes} = useStyles();
  return <>

  </>
}

export default UserTripCard;
