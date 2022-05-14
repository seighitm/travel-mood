import React, {useEffect, useRef, useState} from 'react';
import {
  ActionIcon,
  Badge,
  Button,
  createStyles,
  Grid,
  Group,
  Image,
  Paper,
  Popover,
  SimpleGrid,
  Switch,
  Text,
  TypographyStylesProvider,
  useMantineTheme,
} from '@mantine/core';
import {Pencil1Icon, QuestionMarkCircledIcon,} from '@modulz/radix-icons';
import {Link, useNavigate, useParams} from 'react-router-dom';
import SocialSharButtons from '../../common/SocialShare/SocialSharButtons';
import useStore from '../../../store/user.store';
import {
  useMutateFavoriteTrip,
  useMutateLeaveFromTrip,
  useMutateSwitchTripHiddenStatus,
  useMutateUnFavoriteTrip,
  useMutationDeleteTrip,
} from '../../../api/trips/mutations';
import {userPicture} from "../../common/Utils";
import {useDisclosure} from "@mantine/hooks";
import {BrandFacebook, BrandTwitter, ChevronDown, Pencil, Send, Star, Trash} from "../../../assets/Icons";
import {useGetUserById} from "../../../api/users/queries";
import JoinTripModal from "./JoinTripModal";
import SendJoinTripRequest from "./SendJoinTripRequest";
import {getFullUserName} from "../../../utils/utils-func";
import {isEmptyArray, isNullOrUndefined} from "../../../utils/primitive-checks";

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
  icon: {
    width: '18px',
    height: '18px'
  },
  favoriteComponent: {
    padding: 0,
    width: '18px',
    height: '30px',
    textAlign: 'center',
  }
}));

function TripPageHeader({trips}: any) {
  const {id} = useParams();
  const navigate = useNavigate();
  const theme = useMantineTheme();
  const {classes} = useStyles();
  const {user} = useStore((state: any) => state);
  const faceboocRef: any = useRef<any>();
  const twitterRef: any = useRef<any>();

  const [hiddenStatus, setHiddenStatus] = useState(false);
  const [openedJoinModal, handlersJoinModal] = useDisclosure(false);
  const [openedInviteModal, handlersInviteModal] = useDisclosure(false);
  const [openedPopover, setOpenedPopover] = useState(false);
  const [openedLikesCountPopup, setOpenedLikesCountPopup] = useState(false);

  const onSuccessDeleteEvent = () => navigate('/trips');

  const {data} = useGetUserById({id: user.id, isEnabled: true});
  const {mutate: mutateDeleteTrip} = useMutationDeleteTrip(onSuccessDeleteEvent);
  const {mutate: mutateUnFavorite} = useMutateUnFavoriteTrip();
  const {mutate: mutateFavorite} = useMutateFavoriteTrip();
  const {mutate: mutateLeaveFromTrip} = useMutateLeaveFromTrip();
  const {mutate: mutateSwitchHiddenStatus} = useMutateSwitchTripHiddenStatus();

  const statusCheck = (status: string) => {
    return trips.usersJoinToTrip.find((request: any) => request.status == status && request.userId == user.id) != undefined
  }

  const handlerLeaveFromTrip = () => {
    mutateLeaveFromTrip({tripId: trips.id})
  }

  const handlerFavorite = () => {
    if (trips.tripFavoritedBy?.find((item: any) => item.id == user?.id) === undefined) {
      mutateFavorite({id});
    } else {
      mutateUnFavorite({id});
    }
  };

  useEffect(() => {
    setHiddenStatus(trips.isHidden)
  }, [trips])

  return (
    <Paper className={classes.wrapper}>
      <JoinTripModal
        openedJoinModal={openedJoinModal}
        handlersJoinModal={handlersJoinModal}
        tripId={trips?.id}
        userId={user.id}
      />

      <SendJoinTripRequest
        openedInviteModal={openedInviteModal}
        handlersInviteModal={handlersInviteModal}
        following={data?.following}
        tripId={trips?.id}
      />

      <Grid columns={24}>
        <Grid.Col lg={5} xl={5} md={7} sm={8}>
          <Image
            height={200}
            radius="md"
            src={userPicture(trips?.user?.picture)}
            caption={getFullUserName(trips?.user)}
            onClick={() => navigate(`/user/${trips?.user?.id}`)}
            classNames={{
              root: classes.image,
              caption: classes.imageCaption,
            }}
          />
        </Grid.Col>
        <Grid.Col lg={19} xl={19} md={17} sm={16}>
          <Group position={'apart'}>
            <Text
              mb={0}
              weight={'bold'}
              variant="gradient"
              style={{fontSize: '30px'}}
              gradient={{from: 'indigo', to: 'orange', deg: 15}}
            >
              {trips.title?.toUpperCase()}
            </Text>
            <Group>
              {!isNullOrUndefined(trips) && !isEmptyArray(trips.tripFavoritedBy) &&
                <Popover
                  opened={openedLikesCountPopup}
                  onClose={() => setOpenedLikesCountPopup(false)}
                  target={
                    <ActionIcon
                      size={'md'}
                      color={'pink'}
                      variant={'default'}
                      radius={'xl'}
                      style={{height: '15px'}}
                      onClick={() => setOpenedLikesCountPopup((o) => !o)}
                      className={classes.favoriteComponent}
                    >
                      <ChevronDown/>
                    </ActionIcon>
                  }
                  width={260}
                  position="bottom"
                  withArrow
                >
                  <TypographyStylesProvider>
                    {trips.tripFavoritedBy.map((item: any) =>
                      <Badge fullWidth style={{cursor: 'pointer'}} onClick={() => navigate('/user/' + item.id)}>
                        {getFullUserName(item)}
                      </Badge>
                    )}
                  </TypographyStylesProvider>
                </Popover>
              }
              <Badge
                onClick={() => handlerFavorite()}
                style={{cursor: 'pointer'}}
                variant={"light"}
                color={"gray"}
                px={'xs'}
                size="xl"
                leftSection={
                  <ActionIcon
                    disabled={!user}
                    size={'md'}
                    style={{color: theme.colors.red[7]}}
                    variant={'transparent'}
                  >
                    <Star
                      size={17}
                      color={theme.colors.red[6]}
                      fill={trips.tripFavoritedBy?.find((item: any) => item.id == user?.id) !== undefined
                        ? theme.colors.red[6]
                        : 'none'
                      }
                    />
                  </ActionIcon>
                }
              >
                <Group
                  className={classes.favoriteComponent}
                  position={'center'}
                >
                  <Text color={'gray'}>
                    {!isEmptyArray(trips.tripFavoritedBy) ? trips.tripFavoritedBy.length : '0'}
                  </Text>
                </Group>
              </Badge>
              <Popover
                opened={openedPopover}
                onClose={() => setOpenedPopover(false)}
                position="bottom"
                placement="center"
                withArrow
                trapFocus={false}
                closeOnEscape={false}
                transition="pop-top-left"
                spacing="xs"
                shadow="lg"
                width={150}
                styles={{body: {pointerEvents: 'none'}}}
                target={
                  <ActionIcon
                    radius={'xl'}
                    variant={'light'}
                    color="primary"
                    onMouseEnter={() => setOpenedPopover(true)}
                    onMouseLeave={() => setOpenedPopover(false)}>
                    <QuestionMarkCircledIcon style={{width: '15px', height: '15px'}}/>
                  </ActionIcon>
                }
              >
                <Group spacing={0} align={'center'} direction={'column'}>
                  <Text color="orange" size={'xs'}>
                    PENDING: {trips.usersJoinToTrip.filter((item: any) => item.status == 'PENDING' || item.status == 'RECEIVED').length}
                  </Text>
                  <Text color="green" size={'xs'}>
                    JOINING: {trips.usersJoinToTrip.filter((item: any) => item.status != 'PENDING' && item.status !== 'RECEIVED').length}
                  </Text>
                </Group>
              </Popover>
              {user.id == trips.user.id &&
                <Switch
                  onLabel="ON" offLabel="OFF"
                  checked={hiddenStatus}
                  onChange={(event) => {
                    mutateSwitchHiddenStatus(trips.id)
                    setHiddenStatus(event.currentTarget.checked)
                  }}/>
              }
            </Group>
          </Group>
          <Group mt={'lg'} position="center" direction="column">
            {!isNullOrUndefined(trips) && !isEmptyArray(trips.usersJoinToTrip) &&
              trips.usersJoinToTrip.find((request: any) => request.userId == user.id &&
                (["PENDING", 'APPROVED', 'RECEIVED'].includes(request.status))) !== undefined &&
              <Button
                fullWidth
                color="pink"
                variant={'light'}
                onClick={handlerLeaveFromTrip}
                leftIcon={<Pencil1Icon style={{width: '18px', height: '18px'}}/>}
                styles={{
                  inner: {
                    color: 'teal',
                  },
                }}
              >
                Leave
              </Button>
            }

            {trips.usersJoinToTrip.find((request: any) => request.userId == user.id) == undefined && (user && user?.id != trips.user.id) &&
              <Button
                fullWidth
                color="pink"
                variant={'light'}
                onClick={() => handlersJoinModal.open()}
                leftIcon={<Send size={17}/>}
              >
                Join
              </Button>
            }

            {statusCheck('APPROVED')
              ? <Badge>APPROVED</Badge>
              : statusCheck('CANCELED')
                ? <Badge>CANCELED</Badge>
                : statusCheck('PENDING')
                  ? <Badge>PENDING</Badge>
                  : <></>
            }

            {(!isNullOrUndefined(user) && user?.id == trips.user.id) &&
              <Button
                fullWidth
                color="pink"
                variant={'light'}
                onClick={() => handlersInviteModal.open()}
                leftIcon={<Send size={17}/>}
              >
                Send
              </Button>
            }

            {(!isNullOrUndefined(user) && user?.id == trips.user.id) &&
              <SimpleGrid style={{width: '100%'}} cols={2}>
                <Button
                  fullWidth
                  color="teal"
                  variant={'light'}
                  leftIcon={<Pencil size={17}/>}
                  component={Link}
                  to={'/trip/edit/' + id}
                  styles={{
                    inner: {
                      color: 'teal',
                    },
                  }}
                >
                  Edit
                </Button>
                <Button
                  fullWidth
                  color="red"
                  variant={'light'}
                  leftIcon={<Trash size={17}/>}
                  onClick={() => mutateDeleteTrip(id)}
                  component={Link}
                  to={'/trips/'}
                  styles={{
                    inner: {color: 'red'}
                  }}
                >
                  Delete
                </Button>
              </SimpleGrid>
            }
            <SocialSharButtons faceboocRef={faceboocRef} twitterRef={twitterRef}/>
            <Group style={{width: '100%'}} grow>
              <Button
                variant={'light'}
                onClick={() => faceboocRef.current.click()}
                leftIcon={<BrandTwitter size={17}/>}
              >
                Facebook
              </Button>
              <Button
                variant={'light'}
                onClick={() => twitterRef.current.click()}
                leftIcon={<BrandFacebook size={17}/>}
              >
                twitter
              </Button>
            </Group>
          </Group>
        </Grid.Col>
      </Grid>
    </Paper>
  );
}

export default TripPageHeader;
