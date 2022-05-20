import React from 'react';
import {
  ActionIcon,
  Badge,
  Box,
  createStyles,
  Divider,
  Grid,
  Group,
  Image,
  Spoiler,
  Text,
  Title,
  useMantineTheme,
} from '@mantine/core';
import {useNavigate} from 'react-router-dom';
import useStore from '../../../store/user.store';
import {useMutateFavoriteTrip, useMutateUnFavoriteTrip} from '../../../api/trips/mutations';
import {cutString, userPicture} from "../../common/Utils";
import CustomPaper from "../../common/CustomPaper";
import {
  ArrowDown,
  ArrowUp,
  Clipboard,
  CurrencyDollar,
  InfoCircle,
  Language,
  Map,
  Star,
  User
} from "../../../assets/Icons";
import {getFullUserName} from "../../../utils/utils-func";
import {isEmptyArray, isNullOrUndefined} from "../../../utils/primitive-checks";

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

const CardTrip = React.memo(({trip}: any) => {
  const {user} = useStore((state: any) => state);
  const navigate = useNavigate();
  const {classes} = useStyles();
  const theme = useMantineTheme();

  const {mutate: mutateUnFavorite, isLoading: isLoadingUF} = useMutateUnFavoriteTrip();
  const {mutate: mutateFavorite, isLoading: isLoadingFF} = useMutateFavoriteTrip();

  const handlerFavorite = (trip: any) => {
    if (trip.tripFavoritedBy?.find((item: any) => item.id == user?.id) === undefined) {
      mutateFavorite({id: trip.id});
    } else {
      mutateUnFavorite({id: trip.id});
    }
  };

  const isFavoritedTrip = trip.tripFavoritedBy?.find((item: any) => item.id == user?.id) !== undefined

  return <Box key={trip.id}>
    <CustomPaper>
      <Grid columns={24}>
        <Grid.Col lg={5} xl={5} md={7} sm={8} style={{position: 'relative'}}>
          <Image
            withPlaceholder
            alt={'Trip image'}
            height={'240px'}
            radius="md"
            src={userPicture(trip.user)}
            caption={getFullUserName(trip?.user)}
            style={{cursor: 'pointer'}}
            onClick={() => navigate(`/user/${trip.user.id}`)}
            classNames={{
              root: classes.image,
              caption: classes.imageCaption,
            }}
          />
        </Grid.Col>
        <Grid.Col lg={19} xl={19} md={17} sm={16} style={{position: 'relative'}}>
          <Box className={classes.body}>
            <Group position={'apart'} align="center" spacing={0}>
              <Title onClick={() => navigate('/trip/' + trip.id)} className={classes.title}>
                {cutString(trip.title?.toUpperCase(), 17)}
              </Title>
              <Badge
                mr={'md'}
                variant="light"
                color="gray"
                px={'sm'}
                size="xl"
                style={{cursor: 'pointer'}}
                leftSection={
                  <ActionIcon
                    size={20}
                    radius={'xl'}
                    onClick={() => handlerFavorite(trip)}
                    color={theme.colors.red[7]}
                    variant={'transparent'}
                    disabled={isLoadingUF || isLoadingFF || !user}
                    loading={isLoadingUF || isLoadingFF}
                  >
                    <Star
                      size={17}
                      color={isNullOrUndefined(user) ? 'gray' : theme.colors.red[6]}
                      fill={isFavoritedTrip ? theme.colors.red[6] : 'none'}
                    />
                  </ActionIcon>
                }
              >
                <Group
                  position={'center'}
                  p={0}
                  align={'center'}
                  style={{
                    width: '18px',
                    height: '30px',
                    color: isFavoritedTrip ? theme.colors.red[5] : theme.colors.gray[5]
                  }}
                >
                  {!isEmptyArray(trip.tripFavoritedBy) ? trip.tripFavoritedBy.length : '0'}
                </Group>
              </Badge>
            </Group>
            <Divider
              style={{width: '100%'}}
              my={'xs'}
              label={
                <>
                  <InfoCircle size={17}/>
                  <Box ml={5}>Details:</Box>
                </>
              }
            />
            {!isNullOrUndefined(trip) && !isEmptyArray(trip?.languages) &&
              <Spoiler
                pr={'md'}
                style={{display: 'flex'}}
                maxHeight={23}
                mb={10}
                showLabel={
                  <ActionIcon variant={'light'} radius={'xl'}>
                    <ArrowDown size={17}/>
                  </ActionIcon>
                }
                hideLabel={
                  <ActionIcon variant={'light'} radius={'xl'}>
                    <ArrowUp size={17}/>
                  </ActionIcon>
                }
              >
                <Group spacing={'xs'}>
                  {trip?.languages?.map((item: any) =>
                    <Badge
                      variant={'outline'}
                      color={'green'}
                      key={item.name}
                      leftSection={
                        <ActionIcon size="xs" color="blue" radius="xl" variant="transparent">
                          <Language size={17}/>
                        </ActionIcon>
                      }
                    >
                      {item.name}
                    </Badge>
                  )}
                </Group>
              </Spoiler>
            }

            <Group spacing={0}>
              {!isNullOrUndefined(trip?.gender?.gender) &&
                <Badge
                  variant={'outline'}
                  color="pink"
                  className={classes.badgeItem}
                  mr={'xs'}
                  leftSection={
                    <ActionIcon size="xs" radius="xl" variant="transparent">
                      <User size={17}/>
                    </ActionIcon>
                  }
                >
                  Sex: {trip.gender.gender.split('_').join(' ')}
                </Badge>
              }

              {!isNullOrUndefined(trip.budget) &&
                <Badge
                  variant={'outline'}
                  className={classes.badgeItem}
                  mr={'md'}
                  leftSection={
                    <ActionIcon size="xs" color="blue" radius="xl" variant="transparent">
                      <CurrencyDollar size={17}/>
                    </ActionIcon>
                  }
                >
                  Budget: {trip.budget} $
                </Badge>
              }
            </Group>

            <Divider
              style={{width: '100%'}}
              my={'xs'}
              label={
                <>
                  <Clipboard size={17}/>
                  <Box ml={5}>Description:</Box>
                </>
              }
            />
            <Text weight={500} size="lg" mb={5} lineClamp={3}>
              {trip?.description}
            </Text>

            <Divider
              style={{width: '100%'}}
              my={'xs'}
              label={
                <>
                  <Map size={17}/>
                  <Box ml={5}>Countries:</Box>
                </>
              }
            />

            {!isEmptyArray(trip?.destinations) &&
              <Spoiler
                pr={'md'}
                style={{display: 'flex'}}
                maxHeight={30}
                mb={10}
                showLabel={
                  <ActionIcon variant={'light'} radius={'xl'}>
                    <ArrowDown size={17}/>
                  </ActionIcon>
                }
                hideLabel={
                  <ActionIcon variant={'light'} radius={'xl'}>
                    <ArrowUp size={17}/>
                  </ActionIcon>
                }
              >
                <Group spacing={5} mt={5} position={'left'}>
                  {trip?.destinations?.map((i: any) => (
                    <Badge
                      className={classes.badgeItem}
                      mr={'md'}
                      variant={'outline'}
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
                </Group>
              </Spoiler>
            }
          </Box>
        </Grid.Col>
      </Grid>
    </CustomPaper>
  </Box>
});

export default CardTrip;
