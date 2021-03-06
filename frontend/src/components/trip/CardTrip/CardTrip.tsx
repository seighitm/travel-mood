import React from 'react';
import {ActionIcon, Badge, Box, createStyles, Divider, Grid, Group, Image, Spoiler, Text,} from '@mantine/core';
import {Link, useNavigate} from 'react-router-dom';
import useStore from '../../../store/user.store';
import {useMutateFavoriteTrip, useMutateUnFavoriteTrip} from '../../../api/trips/mutations';
import CustomPaper from '../../common/CustomPaper';
import {
  ArrowDown,
  ArrowUp,
  CalendarEvent,
  Clipboard,
  CurrencyDollar,
  GenderBigender,
  InfoCircle,
  Language,
  Map,
  Users,
} from '../../common/Icons';
import {
  customNavigation,
  cutString,
  dateFormattedToIsoString,
  getFullUserName,
  userPicture,
} from '../../../utils/utils-func';
import {isEmptyArray, isNullOrUndefined} from '../../../utils/primitive-checks';
import {ITrip} from '../../../types/ITrip';
import FavoriteStarButton from '../../common/FavoriteStarButton';
import {ROLE} from '../../../types/enums';

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
    fontSize: '35px',
  },

  image: {
    marginTop: '12px',
    marginRight: '12px',
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
    color: theme.colorScheme === 'dark' ? 'dark' : 'gray',
  },

  icon: {
    width: '14px',
    height: '14px',
  },
}));

interface CardTripComponentProps {
  trip: ITrip;
}

const CardTrip = React.memo(({trip}: CardTripComponentProps) => {
  const {user} = useStore((state: any) => state);
  const navigate = useNavigate();
  const {classes} = useStyles();

  const {mutate: mutateUnFavorite, isLoading: isLoadingUF} = useMutateUnFavoriteTrip();
  const {mutate: mutateFavorite, isLoading: isLoadingFF} = useMutateFavoriteTrip();

  const handlerFavorite = (trip: any) => {
    if (trip.favoritedBy?.find((item: { id: number }) => item.id == user?.id) === undefined) {
      mutateFavorite({id: trip.id});
    } else {
      mutateUnFavorite({id: trip.id});
    }
  };

  const isFavoriteTrip =
    trip.favoritedBy?.find((item: { id: string }) => item.id == user?.id) !== undefined;

  return (
    <Box key={trip.id}>
      <CustomPaper>
        <Grid columns={24}>
          {/*{(location?.pathname.split('/').reverse()[0] == 'trips'*/}
          {/*    || user.id != trip?.user.id) &&*/}
          <Grid.Col lg={5} xl={5} md={7} sm={8} style={{position: 'relative'}}>
            <Image
              withPlaceholder
              alt={'Trip image'}
              height={'240px'}
              radius="md"
              src={userPicture(trip.user)}
              caption={getFullUserName(trip?.user)}
              style={{cursor: 'pointer'}}
              onClick={() => customNavigation(user?.role, navigate, `/users/${trip.user.id}`)}
              classNames={{
                root: classes.image,
                caption: classes.imageCaption,
              }}
            />
          </Grid.Col>
          {/*}*/}
          {/*{...((!isNullOrUndefined(user)) ? {lg: 19, xl: 19, md: 17, sm: 16} : {})}*/}
          <Grid.Col lg={19} xl={19} md={17} sm={16} style={{position: 'relative'}}>
            <Box className={classes.body}>
              <Group mt={0} position={'apart'} align="center" spacing={0}>
                <Text
                  className={classes.title}
                  mt="xs"
                  lineClamp={1}
                  component={Link}
                  to={`${user?.role == ROLE.ADMIN ? '/admin' : ''}/trips/${trip.id}`}
                  size={'lg'}
                  weight={700}
                  variant="gradient"
                  gradient={{from: 'indigo', to: 'orange', deg: 15}}
                >
                  {cutString(trip.title?.toUpperCase(), 17)}
                </Text>
                <Group mt={'xs'} align={'center'}>
                  {!isNullOrUndefined(trip?.gender?.gender) && (
                    <Badge
                      variant={
                        trip?.usersJoinToTrip?.filter((item: any) => item.status == 'APPROVED')
                          .length == trip?.maxNrOfPersons
                          ? 'filled'
                          : 'outline'
                      }
                      color={
                        trip?.usersJoinToTrip?.filter((item: any) => item.status == 'APPROVED')
                          .length == trip?.maxNrOfPersons
                          ? 'red'
                          : 'green'
                      }
                    >
                      {trip?.usersJoinToTrip?.filter((item: any) => item.status == 'APPROVED')
                        .length
                        ? 'FULL'
                        : 'AVAILABLE'}
                    </Badge>
                  )}
                  <FavoriteStarButton
                    isLoadingUF={isLoadingUF}
                    isLoadingFF={isLoadingFF}
                    isFavorite={isFavoriteTrip}
                    favoriteByList={trip.favoritedBy}
                    handlerFavoriteArticle={() => handlerFavorite(trip)}
                  />
                </Group>
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
              {!isNullOrUndefined(trip) && !isEmptyArray(trip?.languages) && (
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
                    {trip?.languages?.map((item: any) => (
                      <Badge
                        variant={'outline'}
                        color={'orange'}
                        className={classes.badgeItem}
                        mb={'0'}
                        key={item.name}
                        leftSection={
                          <ActionIcon size="xs" radius="xl" variant="transparent">
                            <Language size={17}/>
                          </ActionIcon>
                        }
                      >
                        {item.name}
                      </Badge>
                    ))}
                  </Group>
                </Spoiler>
              )}

              <Spoiler
                pr={'md'}
                style={{display: 'flex'}}
                maxHeight={25}
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
                  {!isNullOrUndefined(trip?.gender?.gender) && (
                    <Badge
                      m={0}
                      variant={'outline'}
                      color={
                        trip?.usersJoinToTrip?.filter((item: any) => item.status == 'APPROVED')
                          .length == trip?.maxNrOfPersons
                          ? 'red'
                          : 'green'
                      }
                      className={classes.badgeItem}
                      mr={'xs'}
                      leftSection={
                        <ActionIcon size="xs" radius="xl" variant="transparent">
                          <Users size={17}/>
                        </ActionIcon>
                      }
                    >
                      {
                        trip?.usersJoinToTrip?.filter((item: any) => item.status == 'APPROVED')
                          .length
                      }{' '}
                      / {trip?.maxNrOfPersons}
                    </Badge>
                  )}

                  {!isNullOrUndefined(trip?.dateFrom) && (
                    <Badge
                      m={0}
                      variant={'outline'}
                      color="violet"
                      className={classes.badgeItem}
                      mr={'xs'}
                      leftSection={
                        <ActionIcon size="xs" radius="xl" variant="transparent">
                          <CalendarEvent size={17}/>
                        </ActionIcon>
                      }
                    >
                      {dateFormattedToIsoString(
                        new Date(trip?.dateFrom).setDate(new Date(trip?.dateFrom).getDate() + 1)
                      ).toString()}
                      {' | '}
                      {dateFormattedToIsoString(
                        new Date(trip?.dateTo).setDate(new Date(trip?.dateTo).getDate() + 1)
                      ).toString()}
                    </Badge>
                  )}

                  {!isNullOrUndefined(trip?.gender?.gender) && (
                    <Badge
                      m={0}
                      variant={'outline'}
                      color="pink"
                      className={classes.badgeItem}
                      mr={'xs'}
                      leftSection={
                        <ActionIcon size="xs" radius="xl" variant="transparent">
                          <GenderBigender size={17}/>
                        </ActionIcon>
                      }
                    >
                      {trip.gender.gender.split('_').join(' ')}
                    </Badge>
                  )}

                  {!isNullOrUndefined(trip?.budget) && (
                    <Badge
                      m={0}
                      variant={'outline'}
                      className={classes.badgeItem}
                      mr={'md'}
                      leftSection={
                        <ActionIcon size="xs" color="blue" radius="xl" variant="transparent">
                          <CurrencyDollar size={17}/>
                        </ActionIcon>
                      }
                    >
                      {trip.budget} $
                    </Badge>
                  )}
                </Group>
              </Spoiler>

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
              <Text size="lg" mb={5} lineClamp={3}>
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

              {!isEmptyArray(trip?.destinations) && (
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
                          <ActionIcon size="xs" color="blue" radius="xl" variant="transparent">
                            <Image
                              width={15}
                              withPlaceholder
                              styles={() => ({image: {marginBottom: '0px!important'}})}
                              src={`${
                                import.meta.env.VITE_API_URL
                              }uploads/flags/${i.code.toLowerCase()}.svg`}
                            />
                          </ActionIcon>
                        }
                      >
                        {i.name}
                      </Badge>
                    ))}
                  </Group>
                </Spoiler>
              )}
            </Box>
          </Grid.Col>
        </Grid>
      </CustomPaper>
    </Box>
  );
});

export default CardTrip;
