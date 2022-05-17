import React, {useEffect, useState} from 'react';
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  createStyles,
  Divider,
  Grid,
  Group,
  Image,
  Indicator,
  Paper,
  Text,
  Title,
} from '@mantine/core';
import {useNavigate} from 'react-router-dom';
import {useFollowMutate, useUnFollowMutate} from '../../api/users/mutations';
import useStore from '../../store/user.store';
import StarRatingComponent from './StarRatingComponent';
import {userPicture} from '../common/Utils';
import {useMutateAccessChat} from "../../api/chat/mutations";
import {isEmptyArray, isEmptyString, isNullOrUndefined} from "../../utils/primitive-checks";
import {calculateAge, getFullUserName} from "../../utils/utils-func";
import {CalendarEvent, MessageDots, Pencil, Star, User, World} from "../../assets/Icons";

const UserInfo = ({data, id}: any) => {
  const navigate = useNavigate()
  const {classes, theme} = useStyles();

  const [isOnline, setIsOnline] = useState(false);
  const {user, socket, onlineUsers} = useStore((state: any) => state);

  const {mutate: mutateFollow} = useFollowMutate('follow');
  const {mutate: mutateUnFollow} = useUnFollowMutate('unFollow');
  const {mutate: mutateAccessChat} = useMutateAccessChat();

  console.log(data)

  useEffect(() => {
    if (!isNullOrUndefined(user) && !isNullOrUndefined(socket)) {
      socket.emit('get-online-users');
    }
  }, [user, socket]);

  useEffect(() => {
    if (!isNullOrUndefined(user)) {
      setIsOnline(onlineUsers[data.id])
    }
  }, [onlineUsers]);

  const handlerFullowUser = () => {
    if (!isNullOrUndefined(data?.followedBy?.find((us: any) => us.id == user?.id))) {
      mutateUnFollow(data.id)
    } else {
      mutateFollow(data.id)
    }
  }

  return (
    <Paper
      radius={10}
      className={classes.wrapper}
    >
      <Grid columns={24}>
        <Grid.Col lg={7} xl={7} md={9} sm={10} style={{position: 'relative'}}>
          <Indicator
            size={20}
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
              height={user ? '300px' : '270px'}
              styles={{image: {margin: 0}}}
            />
          </Indicator>
          {!isNullOrUndefined(user) && user?.id != id &&
            <StarRatingComponent dbRating={data.rating} userId={id}/>
          }
        </Grid.Col>
        <Grid.Col lg={17} xl={17} md={15} sm={14}>
          <Group direction="column">
            <Group ml={'md'}>
              <Title order={2} style={{margin: '0'}}>
                {getFullUserName(data)}
              </Title>
            </Group>

            {!isNullOrUndefined(user) && user?.id == id &&
              <Group ml={'md'}>
                <Button
                  pr={'sm'}
                  compact
                  radius={'xl'}
                  variant={'filled'}
                  leftIcon={<Pencil size={17}/>}
                  onClick={() => navigate('/edit/profile')}
                >
                  Edit
                </Button>
              </Group>
            }

            {(!isNullOrUndefined(user) && user?.id != id) &&
              <Group ml={'md'}>
                <Button
                  pr={'sm'}
                  compact
                  radius={'xl'}
                  onClick={() => {
                    mutateAccessChat(id)
                    navigate('/chat/' + id)
                  }}
                  leftIcon={<MessageDots size={17}/>}
                >
                  Chat
                </Button>
                <Button
                  pr={'sm'}
                  variant={'outline'}
                  color="pink"
                  compact
                  radius={'xl'}
                  onClick={handlerFullowUser}
                  leftIcon={<Star
                    size={17}
                    color={theme.colors.red[6]}
                    fill={data?.followedBy?.find((us: any) => us.id == user?.id)
                      ? theme.colors.red[6]
                      : 'none'
                    }
                  />
                  }
                >
                  {data?.followedBy?.find((us: any) => us.id == user?.id) ? 'Unfollow' : 'Follow'}
                </Button>
              </Group>
            }

            {!isNullOrUndefined(data.birthday) &&
              <>
                <Divider style={{width: '100%'}} my="0"/>
                <Group ml={'lg'}>
                  <ActionIcon>
                    <CalendarEvent size={17}/>
                  </ActionIcon>
                  <Group>
                    <Text size="md" weight="bold">
                      Birthday:
                    </Text>
                    <Badge color="orange" variant="outline">
                      {calculateAge(data.birthday)} year
                    </Badge>
                  </Group>
                </Group>
                <Divider style={{width: '100%'}} my="0"/>
              </>
            }

            {!isNullOrUndefined(data?.country) && !isEmptyString(data?.country?.name) &&
              <>
                <Group ml={'lg'}>
                  <Box>
                    <ActionIcon>
                      <World size={17}/>
                    </ActionIcon>
                  </Box>
                  <Box>
                    <Text size="md" weight="bold">
                      Country:
                    </Text>
                  </Box>
                  <Badge variant="outline">
                    {data?.country?.name}
                  </Badge>
                </Group>
                <Divider style={{width: '100%'}} my="0"/>
              </>
            }

            {!isNullOrUndefined(data.gender) &&
              <>
                <Group ml={'lg'}>
                  <Box>
                    <ActionIcon>
                      <User size={17}/>
                    </ActionIcon>
                  </Box>
                  <Box>
                    <Text size="md" weight="bold">
                      Gender:
                    </Text>
                  </Box>
                  <Badge color="cyan" variant="outline">
                    {data.gender.gender}
                  </Badge>
                </Group>
                <Divider style={{width: '100%'}} my="0"/>
              </>
            }

            {!isNullOrUndefined(data?.languages) && !isEmptyArray(data?.languages) &&
              <Group ml={'lg'} mb={'lg'}>
                <ActionIcon>
                  <World size={17}/>
                </ActionIcon>
                <Text size="md" weight="bold">
                  Languages:
                </Text>
                <Group spacing={'xs'}>
                  {data.languages.map((tripData: any) => (
                    <Badge color="pink" variant="outline" key={tripData.name}>
                      {tripData.name}
                    </Badge>
                  ))}
                </Group>
              </Group>
            }
          </Group>
        </Grid.Col>
      </Grid>
    </Paper>
  );
};

const useStyles = createStyles((theme) => ({
  wrapper: {
    border: '2px solid ',
    boxShadow: theme.shadows.lg,
    borderColor: theme.colorScheme === 'dark' ? theme.colors.gray[8] : theme.colors.gray[2],
    position: 'relative',
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,
  },
}));

export default UserInfo;
