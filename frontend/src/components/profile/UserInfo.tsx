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
  Indicator,
  Paper,
  Spoiler,
  Text,
  Title,
} from '@mantine/core';
import {useNavigate} from 'react-router-dom';
import {useFollowMutate, useUnFollowMutate} from '../../api/users/mutations';
import useStore from '../../store/user.store';
import StarRatingComponent from './StarRatingComponent';
import {useMutateAccessChat} from '../../api/chat/mutations';
import {isEmptyArray, isEmptyString, isNullOrUndefined} from '../../utils/primitive-checks';
import {calculateAge, customNavigation, getFullUserName, userPicture,} from '../../utils/utils-func';
import {
  CalendarEvent,
  FileAlert,
  InfoCircle,
  Language,
  MessageDots,
  Pencil,
  Star,
  User,
  World,
} from '../common/Icons';
import ModalComplaint from './ModalComplaint';
import {IUser} from '../../types/IUser';
import {ROLE} from '../../types/enums';

const useStyles = createStyles((theme) => ({
  wrapper: {
    border: '2px solid ',
    boxShadow: theme.shadows.lg,
    borderColor: theme.colorScheme === 'dark' ? theme.colors.gray[8] : theme.colors.gray[2],
    position: 'relative',
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,
  },
}));

interface UserInfoComponentProps {
  data: IUser;
  id: string | number | undefined;
}

const UserInfo = ({data, id}: UserInfoComponentProps) => {
  const navigate = useNavigate();
  const {classes, theme} = useStyles();

  const [isOnline, setIsOnline] = useState(false);
  const {user, socket, onlineUsers} = useStore((state: any) => state);

  const {mutate: mutateFollow} = useFollowMutate();
  const {mutate: mutateUnFollow} = useUnFollowMutate();
  const {mutate: mutateAccessChat} = useMutateAccessChat();
  const [isOpenedComplaintModal, setIsOpenedComplaintModal] = useState(false);

  useEffect(() => {
    if (!isNullOrUndefined(user) && !isNullOrUndefined(socket)) {
      socket.emit('get-online-users');
    }
  }, [user, socket]);

  useEffect(() => {
    if (!isNullOrUndefined(user)) {
      setIsOnline(onlineUsers[data.id]);
    }
  }, [onlineUsers]);

  const handlerFullowUser = () => {
    if (!isNullOrUndefined(data?.followedBy?.find((us: any) => us.id == user?.id))) {
      mutateUnFollow(data.id);
    } else {
      mutateFollow(data.id);
    }
  };

  return (
    <Paper radius={10} className={classes.wrapper}>
      {!isNullOrUndefined(user) && user?.id != id && (
        <ModalComplaint
          profileId={id}
          setIsOpenedComplaintModal={setIsOpenedComplaintModal}
          isOpenedComplaintModal={isOpenedComplaintModal}
        />
      )}
      <Grid columns={24}>
        <Grid.Col lg={7} xl={7} md={9} sm={10} style={{position: 'relative'}}>
          <Indicator
            size={20}
            styles={{
              indicator: {
                padding: '0px 5px',
              },
            }}
            color={isOnline ? 'green' : 'pink'}
            label={isOnline ? 'online' : 'offline'}
            withBorder
            disabled={isNullOrUndefined(user)}
            position="bottom-center"
          >
            <Image
              px={10}
              m={0}
              pt={7}
              radius="md"
              src={userPicture(data)}
              height={
                !isNullOrUndefined(data?.aboutMe) && !isEmptyString(data?.aboutMe)
                  ? '320px'
                  : '270px'
              }
              styles={{image: {margin: 0}}}
              withPlaceholder
            />
          </Indicator>
          {!isNullOrUndefined(user) && user?.id != id && (
            <StarRatingComponent
              dbRating={data?.rating}
              userId={id}
              countOfRatings={data?.myRatings.length}
            />
          )}
        </Grid.Col>
        <Grid.Col lg={17} xl={17} md={15} sm={14}>
          <Group mt={'xs'} direction="column" spacing={'xs'}>
            <Group style={{width: '90%'}} ml={'md'} position={'apart'}>
              <Title order={2} style={{margin: '0'}}>
                {getFullUserName(data)}
              </Title>
              {data?.role.role == ROLE.ADMIN && <Badge size={'lg'}>ADMIN</Badge>}
              {!isNullOrUndefined(user) && user?.id == id && (
                <Group ml={'md'}>
                  <Button
                    pr={'sm'}
                    compact
                    radius={'xl'}
                    variant={'filled'}
                    leftIcon={<Pencil size={17}/>}
                    onClick={() =>
                      navigate(
                        user?.role == ROLE.ADMIN ? `/admin/users/${id}/edit` : `/users/${id}/edit`
                      )
                    }
                  >
                    Edit
                  </Button>
                </Group>
              )}

              {!isNullOrUndefined(user) && user?.id != id && (
                <Group ml={'md'}>
                  {user?.role !== ROLE.ADMIN && data?.role.role != ROLE.ADMIN && (
                    <Button
                      pr={'sm'}
                      compact
                      color={'green'}
                      radius={'xl'}
                      onClick={() => {
                        setIsOpenedComplaintModal(true);
                      }}
                      leftIcon={<FileAlert size={17}/>}
                    >
                      Complaint
                    </Button>
                  )}

                  <Button
                    pr={'sm'}
                    compact
                    radius={'xl'}
                    onClick={() => {
                      mutateAccessChat(id);
                      customNavigation(user?.role, navigate, '/chat/' + id);
                    }}
                    leftIcon={<MessageDots size={17}/>}
                  >
                    Chat
                  </Button>
                  <Button
                    pr={'sm'}
                    variant={
                      data?.followedBy?.find((us: any) => us.id == user?.id) ? 'filled' : 'outline'
                    }
                    color="pink"
                    compact
                    radius={'xl'}
                    onClick={handlerFullowUser}
                    leftIcon={
                      <Star
                        size={17}
                        color={
                          data?.followedBy?.find((us: any) => us.id == user?.id)
                            ? 'white'
                            : theme.colors.pink[6]
                        }
                      />
                    }
                  >
                    {data?.followedBy?.find((us: any) => us.id == user?.id) ? 'Unfollow' : 'Follow'}
                    {data?.followedBy?.length ? ` (${data?.followedBy.length})` : ''}
                  </Button>
                </Group>
              )}
            </Group>

            {!isNullOrUndefined(data?.birthday) && (
              <>
                <Divider style={{width: '100%'}} my="0"/>
                <Group spacing={'xs'} ml={'lg'}>
                  <Group>
                    <ActionIcon>
                      <CalendarEvent size={17}/>
                    </ActionIcon>
                    <Text size="md" weight="bold">
                      Birthday:
                    </Text>
                  </Group>
                  <Group>
                    <Badge color="orange" variant="outline">
                      {calculateAge(data.birthday)} year
                    </Badge>
                  </Group>
                </Group>
                <Divider style={{width: '100%'}} my="0"/>
              </>
            )}

            {!isNullOrUndefined(data?.country) && !isEmptyString(data?.country?.name) && (
              <>
                <Group spacing={'xs'} ml={'lg'}>
                  <Group>
                    <ActionIcon>
                      <World size={17}/>
                    </ActionIcon>
                    <Text size="md" weight="bold">
                      Country:
                    </Text>
                  </Group>
                  <Badge variant="outline">{data?.country?.name}</Badge>
                </Group>
                <Divider style={{width: '100%'}} my="0"/>
              </>
            )}

            {!isNullOrUndefined(data.gender) && (
              <>
                <Group spacing={'xs'} ml={'lg'}>
                  <Group>
                    <ActionIcon>
                      <User size={17}/>
                    </ActionIcon>
                    <Text size="md" weight="bold">
                      Gender:
                    </Text>
                  </Group>
                  <Badge color="cyan" variant="outline">
                    {data.gender.gender}
                  </Badge>
                </Group>
                <Divider style={{width: '100%'}} my="0"/>
              </>
            )}

            {/*{!isNullOrUndefined(data?.visitedCountries) &&*/}
            {/*  <>*/}
            {/*    <Group ml={'lg'}>*/}
            {/*      <Box>*/}
            {/*        <ActionIcon>*/}
            {/*          <MapPin size={17}/>*/}
            {/*        </ActionIcon>*/}
            {/*      </Box>*/}
            {/*      <Box>*/}
            {/*        <Text size="md" weight="bold">*/}
            {/*          Visited countries:*/}
            {/*        </Text>*/}
            {/*      </Box>*/}
            {/*      <Badge color="violet" variant="outline">*/}
            {/*        {data?.visitedCountries?.length}*/}
            {/*      </Badge>*/}
            {/*    </Group>*/}
            {/*    <Divider style={{width: '100%'}} my="0"/>*/}
            {/*  </>*/}
            {/*}*/}

            {!isNullOrUndefined(data?.languages) && !isEmptyArray(data?.languages) && (
              <>
                <Group spacing={'xs'} ml={'lg'}>
                  <Group>
                    <ActionIcon>
                      <Language size={17}/>
                    </ActionIcon>
                    <Text size="md" weight="bold">
                      Languages:
                    </Text>
                  </Group>
                  <Group spacing={'xs'}>
                    {data.languages.map((tripData: any) => (
                      <Badge color="pink" variant="outline" key={tripData.name}>
                        {tripData.name}
                      </Badge>
                    ))}
                  </Group>
                </Group>
                <Divider style={{width: '100%'}} my="0"/>
              </>
            )}

            {!isNullOrUndefined(data?.aboutMe) && !isEmptyString(data?.aboutMe) && (
              <Spoiler
                style={{display: 'flex', flexDirection: 'column'}}
                maxHeight={80}
                m={0}
                p={0}
                mb={'xs'}
                showLabel="Show more"
                hideLabel="Hide"
              >
                <Group spacing={0} pr={'xl'} ml={'lg'}>
                  <Group>
                    <ActionIcon>
                      <InfoCircle size={17}/>
                    </ActionIcon>
                    <Text size="md" weight="bold">
                      About me:
                    </Text>
                  </Group>
                  <Text ml={40} size="md">
                    {data?.aboutMe}
                  </Text>
                </Group>
              </Spoiler>
            )}
          </Group>
        </Grid.Col>
      </Grid>
    </Paper>
  );
};

export default UserInfo;
