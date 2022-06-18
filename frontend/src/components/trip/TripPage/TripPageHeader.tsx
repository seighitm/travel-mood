import React, {useEffect, useState} from 'react';
import {
  ActionIcon,
  Badge,
  Button,
  createStyles,
  Divider,
  Grid,
  Group,
  Image,
  Paper,
  Popover,
  SimpleGrid,
  Spoiler,
  Switch,
  Text,
  useMantineTheme,
} from '@mantine/core';
import {useNavigate, useParams} from 'react-router-dom';
import useStore from '../../../store/user.store';
import {
  useMutateFavoriteTrip,
  useMutateSwitchTripHiddenStatus,
  useMutateUnFavoriteTrip,
  useMutationDeleteTrip,
} from '../../../api/trips/mutations';
import {useMediaQuery} from '@mantine/hooks';
import {InfoCircle, Pencil, Send, Stars, Trash, Users} from '../../common/Icons';
import {useGetUserById} from '../../../api/users/queries';
import JoinTripModal from './JoinTripModal';
import SendJoinTripRequest from './SendJoinTripRequest';
import {customNavigation, dateFormattedToIsoString, getFullUserName, userPicture,} from '../../../utils/utils-func';
import {isEmptyArray, isNullOrUndefined} from '../../../utils/primitive-checks';
import {ROLE} from '../../../types/enums';
import SocialSharButtons from '../../common/social-share/SocialSharButtons';
import {ITrip} from '../../../types/ITrip';
import PostFavoriteBy from '../../common/PostFavoriteBy';
import {useMutateChangeJoinRequestStatus, useMutateLeaveFromTrip,} from '../../../api/trips/join-requests/mutations';
import FavoriteStarButton from '../../common/FavoriteStarButton';
import ConfirmationModal from "../../common/ConfirmationModal";

const useStyles = createStyles((theme) => ({
  wrapper: {
    padding: theme.spacing.sm,
    borderRadius: theme.radius.md,
    border: '2px solid ',
    boxShadow: theme.shadows.lg,
    borderColor: theme.colorScheme === 'dark' ? theme.colors.gray[8] : theme.colors.gray[2],
    position: 'relative',
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,
  },
  image: {
    cursor: 'pointer',
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
  icon: {
    width: '18px',
    height: '18px',
  },
}));

interface TripPageHeaderComponentProps {
  trip: ITrip;
}

function TripPageHeader({trip}: TripPageHeaderComponentProps) {
  const {id} = useParams();
  const navigate = useNavigate();
  const theme = useMantineTheme();
  const {classes} = useStyles();
  const {user} = useStore((state: any) => state);
  const mobile = useMediaQuery('(min-width: 530px)');

  const [hiddenStatus, setHiddenStatus] = useState(false);
  const [isOpenedJoinModal, setIsOpenedJoinModal] = useState(false);
  const [isOpenedInviteModal, setIsOpenedInviteModal] = useState(false);
  const [openedPopover, setOpenedPopover] = useState(false);
  const [openedConfirmationModal, setOpenedConfirmationModal] = useState(false);

  const {data} = useGetUserById({id: user?.id, isEnabled: true});
  const {mutate: mutateDeleteTrip} = useMutationDeleteTrip();
  const {mutate: mutateUnFavorite, isLoading: isLoadingUF} = useMutateUnFavoriteTrip();
  const {mutate: mutateFavorite, isLoading: isLoadingFF} = useMutateFavoriteTrip();
  const {mutate: mutateLeaveFromTrip} = useMutateLeaveFromTrip();
  const {mutate: mutateSwitchHiddenStatus, isLoading: isLoadingHide} = useMutateSwitchTripHiddenStatus();
  const {mutate: mutateChangeRequestStatus} = useMutateChangeJoinRequestStatus();

  const statusCheck = (status: string) => {
    if (!isNullOrUndefined(user)) {
      return (
        trip?.usersJoinToTrip.find(
          (request: any) => request.status == status && request.userId == user.id
        ) != undefined
      );
    }
    return false;
  };

  const handlerLeaveFromTrip = () => {
    mutateLeaveFromTrip({tripId: trip?.id});
  };

  const handlerFavorite = () => {
    if (trip?.favoritedBy?.find((item: any) => item.id == user?.id) === undefined) {
      mutateFavorite({id});
    } else {
      mutateUnFavorite({id});
    }
  };

  useEffect(() => {
    setHiddenStatus(trip?.isHidden);
  }, [trip]);

  const isFavoriteTrip =
    trip.favoritedBy?.find((item: { id: string }) => item.id == user?.id) !== undefined;

  return (
    <Paper className={classes.wrapper}>
      <ConfirmationModal
        openedConfirmationModal={openedConfirmationModal}
        setOpenedConfirmationModal={setOpenedConfirmationModal}
        handlerSubmit={() => mutateDeleteTrip(id)}
      />
      {!isNullOrUndefined(user) && (
        <>
          <JoinTripModal
            isOpenedJoinModal={isOpenedJoinModal}
            setIsOpenedJoinModal={setIsOpenedJoinModal}
            tripId={trip?.id}
            userId={user?.id}
            receiveUserId={trip?.user.id}
          />

          <SendJoinTripRequest
            isOpenedInviteModal={isOpenedInviteModal}
            setIsOpenedInviteModal={setIsOpenedInviteModal}
            following={data?.following}
            tripId={trip?.id}
          />
        </>
      )}

      <Grid columns={24}>
        <Grid.Col lg={5} xl={5} md={7} sm={8}>
          <Image
            height={!isNullOrUndefined(user) ? 220 : 180}
            radius="md"
            src={userPicture(trip?.user)}
            caption={getFullUserName(trip?.user)}
            onClick={() => customNavigation(user?.role, navigate, `/users/${trip.user.id}`)}
            classNames={{
              root: classes.image,
              caption: classes.imageCaption,
            }}
          />
        </Grid.Col>
        <Grid.Col lg={19} xl={19} md={17} sm={16}>
          <Group position={mobile ? 'apart' : 'center'}>
            <Text
              mb={0}
              weight={'bold'}
              variant="gradient"
              style={{fontSize: '30px'}}
              gradient={{from: 'indigo', to: 'orange', deg: 15}}
            >
              {trip?.title?.toUpperCase()}
            </Text>
            <Group position={mobile ? 'apart' : 'center'}>
              <Badge
                variant={
                  trip?.usersJoinToTrip?.filter((item: any) => item.status == 'APPROVED').length ==
                  trip?.maxNrOfPersons
                    ? 'filled'
                    : 'light'
                }
                color={
                  trip?.usersJoinToTrip.filter((item: any) => item.status == 'APPROVED').length ==
                  trip?.maxNrOfPersons
                    ? 'pink'
                    : 'green'
                }
              >
                {trip?.usersJoinToTrip.filter((item: any) => item.status == 'APPROVED').length ==
                trip?.maxNrOfPersons
                  ? 'Full'
                  : 'Available'}
              </Badge>
              <Badge color={'gray'} variant={'light'}>
                {dateFormattedToIsoString(trip?.updatedAt)}
              </Badge>
              {!isNullOrUndefined(trip) && !isEmptyArray(trip?.favoritedBy) && (
                <PostFavoriteBy favoriteList={trip?.favoritedBy}/>
              )}

              <SocialSharButtons url={'/trips/' + id}/>

              <FavoriteStarButton
                isLoadingUF={isLoadingUF}
                isLoadingFF={isLoadingFF}
                isFavorite={isFavoriteTrip}
                favoriteByList={trip.favoritedBy}
                handlerFavoriteArticle={handlerFavorite}
              />

              <Popover
                opened={openedPopover}
                onClose={() => setOpenedPopover(false)}
                position="bottom"
                placement="start"
                trapFocus={false}
                closeOnEscape={false}
                transition="pop-top-left"
                spacing="xs"
                shadow="lg"
                width={100}
                styles={{body: {pointerEvents: 'none', borderColor: theme.colors.gray[6]}}}
                target={
                  <ActionIcon
                    size={25}
                    radius={'xl'}
                    variant={'light'}
                    color="primary"
                    onMouseEnter={() => setOpenedPopover(true)}
                    onMouseLeave={() => setOpenedPopover(false)}
                  >
                    <Users size={17}/>
                  </ActionIcon>
                }
              >
                <Group spacing={0} align={'center'} direction={'column'}>
                  <Text color="orange" size={'xs'}>
                    PENDING:{' '}
                    {
                      trip?.usersJoinToTrip.filter(
                        (item: any) => item.status == 'PENDING' || item.status == 'RECEIVED'
                      ).length
                    }
                  </Text>
                  <Text color="green" size={'xs'}>
                    JOINING:{' '}
                    {
                      trip?.usersJoinToTrip.filter(
                        (item: any) =>
                          item.status != 'PENDING' &&
                          item.status !== 'RECEIVED' &&
                          item.status !== 'CANCELED'
                      ).length
                    }
                  </Text>
                </Group>
              </Popover>

              {statusCheck('APPROVED') ? (
                <Badge color={'pink'} variant={'outline'}>
                  APPROVED
                </Badge>
              ) : statusCheck('CANCELED') ? (
                <Badge color={'pink'} variant={'outline'}>
                  CANCELED
                </Badge>
              ) : statusCheck('PENDING') ? (
                <Badge color={'pink'} variant={'outline'}>
                  PENDING
                </Badge>
              ) : statusCheck('RECEIVED') ? (
                <Badge color={'pink'} variant={'outline'}>
                  RECEIVED
                </Badge>
              ) : (
                <></>
              )}

              {!isNullOrUndefined(user) && user?.id == trip?.user.id && (
                <Switch
                  disabled={isLoadingHide}
                  size={'md'}
                  onLabel="ON"
                  offLabel="HIDE"
                  checked={hiddenStatus}
                  onChange={(event) => {
                    mutateSwitchHiddenStatus(trip?.id);
                    setHiddenStatus(event.currentTarget.checked);
                  }}
                />
              )}
            </Group>
          </Group>

          <Group mt={'lg'} position="center" direction="column">
            {!isNullOrUndefined(user) &&
              trip?.usersJoinToTrip.find(
                (request: any) => request.userId == user.id && request.status == 'RECEIVED'
              ) !== undefined && (
                <Button
                  fullWidth
                  color="pink"
                  variant={'light'}
                  onClick={() =>
                    mutateChangeRequestStatus({
                      tripRequestId: trip?.usersJoinToTrip?.find(
                        (request: any) =>
                          request?.userId == user?.id && request?.status == 'RECEIVED'
                      )?.id,
                      status: 'APPROVED',
                    })
                  }
                  leftIcon={<Send size={17}/>}
                >
                  Accept
                </Button>
              )}

            {!isNullOrUndefined(user) &&
              !isNullOrUndefined(trip) &&
              !isEmptyArray(trip?.usersJoinToTrip) &&
              trip?.usersJoinToTrip.find(
                (request: any) =>
                  request.userId == user.id &&
                  ['PENDING', 'APPROVED', 'RECEIVED'].includes(request.status)
              ) !== undefined && (
                <Button
                  variant={'outline'}
                  fullWidth
                  color="red"
                  onClick={handlerLeaveFromTrip}
                  leftIcon={<Send size={17}/>}
                >
                  Leave
                </Button>
              )}

            {!isNullOrUndefined(user) &&
              trip?.usersJoinToTrip.find((request: any) => request.userId == user.id) ==
              undefined &&
              user &&
              user?.id != trip?.user.id &&
              trip?.usersJoinToTrip?.filter((item: any) => item.status == 'APPROVED').length <
              Number(trip?.maxNrOfPersons) && (
                <Button
                  fullWidth
                  color="pink"
                  variant={'light'}
                  onClick={() => setIsOpenedJoinModal(true)}
                  leftIcon={<Send size={17}/>}
                >
                  Join
                </Button>
              )}

            {!isNullOrUndefined(user) &&
              user?.id == trip?.user.id &&
              trip?.usersJoinToTrip?.filter((item: any) => item.status == 'APPROVED').length <
              Number(trip?.maxNrOfPersons) && (
                <Button
                  fullWidth
                  color="pink"
                  variant={'light'}
                  onClick={() => setIsOpenedInviteModal(true)}
                  leftIcon={<Send size={17}/>}
                >
                  Send
                </Button>
              )}

            {((!isNullOrUndefined(user) && user?.id == trip?.user.id) ||
              user?.role == ROLE.ADMIN ||
              user?.role == ROLE.MODERATOR) && (
              <SimpleGrid style={{width: '100%'}} cols={2}>
                <Button
                  fullWidth
                  color="teal"
                  variant={'light'}
                  leftIcon={<Pencil size={17}/>}
                  onClick={() =>
                    navigate(`${user?.role == ROLE.ADMIN ? '/admin' : ''}/trips/${id}/edit`)
                  }
                >
                  Edit
                </Button>
                <Button
                  fullWidth
                  color="red"
                  variant={'light'}
                  leftIcon={<Trash size={17}/>}
                  onClick={() => setOpenedConfirmationModal(true)}
                >
                  Delete
                </Button>
              </SimpleGrid>
            )}
          </Group>

          {!isEmptyArray(trip?.description) && (
            <>
              <Divider
                mt={'md'}
                label={
                  <Group>
                    <InfoCircle size={20}/>
                    Description
                  </Group>
                }
                labelPosition="left"
                style={{width: '100%'}}
              />
              <Group mx={'xl'}>
                <Spoiler maxHeight={50} showLabel="Show more" hideLabel="Hide">
                  <Text size="md">{trip?.description}</Text>
                </Spoiler>
              </Group>
            </>
          )}
        </Grid.Col>
      </Grid>
    </Paper>
  );
}

export default TripPageHeader;
