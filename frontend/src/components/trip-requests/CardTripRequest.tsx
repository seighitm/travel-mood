import React, {useRef, useState} from 'react';
import {Box, Button, Container, Grid, Group, Image, Paper, Spoiler, Text} from '@mantine/core';
import {Link, useNavigate} from 'react-router-dom';
import {useMutateChangeJoinRequestStatus} from '../../api/trips/mutations';
import useStore from '../../store/user.store';
import {userPicture} from "../common/Utils";
import {useMediaQuery} from "@mantine/hooks";
import {isEmptyArray} from "../../utils/primitive-checks";

function CardTripRequest({tripRequest, joinRequestStatus}: any) {
  const navigate = useNavigate();
  const {user} = useStore((state: any) => state);
  const {mutate: mutateChangeRequestStatus} = useMutateChangeJoinRequestStatus();
  const matches = useMediaQuery('(min-width: 568px)');
  const ref = useRef<any>();
  const [imageHeight, setImageHeight] = useState<any>([100, 100])

  return <Container size={'sm'}>
    <Paper
      my={'lg'}
      radius={'md'}
      shadow={'xs'}
      sx={(theme) => ({
        border: '2px solid ',
        borderColor: theme.colorScheme === 'dark' ? theme.colors.gray[8] : theme.colors.gray[0],
        position: 'relative',
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,
      })}
    >
      <Grid columns={24}>
        <Grid.Col style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}
                  xl={6} lg={7} md={8} sm={9}
                  xs={10}>
          <Image
            height={matches ? (imageHeight[0] < 120 ? 120 : 100 + imageHeight[0]) : 120}
            radius="md"
            src={userPicture(user)}
            style={{cursor: 'pointer'}}
            caption={`${user.firstName} ${user.lastName}`}
            onClick={() => navigate('/user/' + tripRequest.user.id)}
          />
        </Grid.Col>
        <Grid.Col xl={18} lg={17} md={16} sm={15} xs={14}>
          <Group py={'sm'} direction={'column'} position={'center'} style={{height: '100%', justifyContent: 'center'}}
                 spacing={2}
                 align="center">
            <Group position={'center'} style={{width: '100%'}}>
              {tripRequest.status == 'RECEIVED'
                ? <>
                  <Box>
                    From: <Button compact variant={'subtle'}> {tripRequest.trip?.user.firstName}</Button>
                  </Box>
                  <Box>
                    To: <Button compact variant={'subtle'}>{tripRequest.user.firstName}</Button>
                  </Box>
                </>
                : tripRequest.status == 'PENDING'
                  ? <>
                    <Box>
                      From: <Button compact variant={'subtle'}>{tripRequest.user.firstName}</Button>
                    </Box>
                    <Box>
                      To: <Button compact variant={'subtle'}>{tripRequest.trip?.user.firstName}</Button>
                    </Box>
                  </>
                  : ''
              }
            </Group>
            <Group position={'center'} style={{width: '100%'}}>
              {tripRequest.status == 'APPROVED' &&
                <>
                  <Box>
                    {tripRequest.trip?.user.id == user.id
                      ? <Group position={'center'}><Button compact variant={'subtle'}>
                        <Text color={'pink'}
                              size={'lg'}
                              weight={900}
                        >
                          {tripRequest.user.firstName.toUpperCase()}
                        </Text>
                      </Button>
                        <Text size={'lg'} weight={500}>
                          join to your trip!
                        </Text>
                      </Group>
                      : <Text size={'xl'} color={'pink'} weight={900}>
                        You Join to Trip!
                      </Text>
                    }
                  </Box>
                </>
              }
            </Group>

            <Button
              my={'md'}
              compact
              variant="subtle"
              component={Link}
              to={'/trip/' + tripRequest.trip.id}
            >
              <Text size={'xl'} weight={'bold'}>
                {tripRequest.trip?.title?.toUpperCase()}
              </Text>
            </Button>
            <Group mr={10}>
              {!isEmptyArray(joinRequestStatus) && ['APPROVED', 'PENDING', 'RECEIVED'].includes(joinRequestStatus[0]) &&
                <Button
                  color={'red'}
                  compact
                  onClick={() => mutateChangeRequestStatus({tripRequestId: tripRequest.id, status: 'CANCELED'})}
                >
                  Decline
                </Button>
              }

              {(joinRequestStatus[0] === 'CANCELED' || joinRequestStatus[0] === 'RECEIVED') &&
                <Button
                  color={'teal'}
                  compact
                  onClick={() => mutateChangeRequestStatus({tripRequestId: tripRequest.id, status: 'APPROVED'})}
                >
                  Approve
                </Button>
              }
            </Group>
            <div ref={ref}>
              <Spoiler
                onMouseUp={() => setImageHeight([imageHeight[1], ref.current?.offsetHeight])}
                style={{display: 'flex', flexDirection: 'column'}}
                maxHeight={0}
                showLabel={'Show comment'}
                hideLabel={'Hide comment'}
              >
                <Text>{tripRequest.comment}</Text>
              </Spoiler>
            </div>
          </Group>
        </Grid.Col>
      </Grid>
    </Paper>
  </Container>
}

export default CardTripRequest;
