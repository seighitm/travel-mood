import React, { useRef, useState } from 'react';
import {
  Badge,
  Box,
  Button,
  Container,
  Grid,
  Group,
  Image,
  Paper,
  Spoiler,
  Text,
} from '@mantine/core';
import { Link, useNavigate } from 'react-router-dom';
import useStore from '../../store/user.store';
import { useMediaQuery } from '@mantine/hooks';
import { isEmptyArray } from '../../utils/primitive-checks';
import { ROLE } from '../../types/enums';
import { customNavigation, userPicture } from '../../utils/utils-func';
import { Check, X } from '../common/Icons';
import { useMutateChangeJoinRequestStatus } from '../../api/trips/join-requests/mutations';

interface CardTripComponentProps {
  tripRequest: {
    status: string;
    type?: string;
    user: any;
    trip: any;
    id: number;
    comment: string;
  };
  joinRequestStatus: string;
}

function CardTripRequest({ tripRequest, joinRequestStatus }: CardTripComponentProps | any) {
  const navigate = useNavigate();
  const { user } = useStore((state: any) => state);
  const { mutate: mutateChangeRequestStatus } = useMutateChangeJoinRequestStatus();
  const matches = useMediaQuery('(min-width: 568px)');
  const ref = useRef<any>();
  const [imageHeight, setImageHeight] = useState<any>([100, 121]);

  return (
    <Container size={'sm'}>
      <Paper
        my={'lg'}
        px={'xs'}
        radius={'md'}
        withBorder
        shadow={'sm'}
        sx={(theme) => ({
          border: '2px solid ',
          borderColor: theme.colorScheme === 'dark' ? theme.colors.gray[8] : theme.colors.gray[2],
          position: 'relative',
          backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,
        })}
      >
        <Grid columns={24}>
          <Grid.Col
            // style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}
            xl={6}
            lg={7}
            md={8}
            sm={9}
            xs={10}
          >
            <Image
              mt={'xs'}
              height={matches ? (imageHeight[0] < 120 ? 120 : 100 + imageHeight[0]) : 120}
              radius="md"
              src={userPicture(
                tripRequest.trip.user?.id !== user?.id ? tripRequest.trip.user : tripRequest?.user
              )}
              style={{ cursor: 'pointer' }}
              caption={`${user.firstName} ${user.lastName}`}
              onClick={() =>
                customNavigation(
                  user?.role,
                  navigate,
                  '/users/' +
                    (tripRequest.type == 'R' ? tripRequest.trip.user.id : tripRequest?.userId)
                )
              }
            />
          </Grid.Col>
          <Grid.Col xl={18} lg={17} md={16} sm={15} xs={14}>
            <Group
              py={'sm'}
              direction={'column'}
              position={'center'}
              style={{ height: '100%', justifyContent: 'center' }}
              spacing={2}
              align="center"
            >
              <Group mb={'xs'}>
                {((!isEmptyArray(joinRequestStatus) &&
                  ['APPROVED', 'PENDING', 'RECEIVED', 'INBOX'].includes(joinRequestStatus[0])) ||
                  ['A', 'P', 'R', 'I'].includes(tripRequest.type)) && (
                  <Button
                    variant={'outline'}
                    color={'red'}
                    compact
                    leftIcon={<X size={15} />}
                    onClick={() =>
                      mutateChangeRequestStatus({
                        tripRequestId: tripRequest.id,
                        status: 'CANCELED',
                      })
                    }
                  >
                    Cancel
                  </Button>
                )}

                {(joinRequestStatus[0] === 'CANCELED' || tripRequest.type == 'R') && (
                  <Button
                    compact
                    variant={'outline'}
                    leftIcon={<Check />}
                    color={'teal'}
                    onClick={() =>
                      mutateChangeRequestStatus({
                        tripRequestId: tripRequest.id,
                        status: 'APPROVED',
                      })
                    }
                  >
                    Approve
                  </Button>
                )}
              </Group>

              <Group position={'center'} style={{ width: '100%' }}>
                {tripRequest.status == 'RECEIVED' ? (
                  <>
                    <Box>
                      From:
                      <Button
                        compact
                        onClick={() =>
                          customNavigation(
                            user?.role,
                            navigate,
                            `/users/${tripRequest.trip?.user?.id}`
                          )
                        }
                        variant={'subtle'}
                      >
                        {tripRequest.trip?.user.firstName}
                      </Button>
                    </Box>
                    <Box>
                      To:
                      <Button
                        compact
                        onClick={() =>
                          customNavigation(user?.role, navigate, `/users/${tripRequest.user?.id}`)
                        }
                        variant={'subtle'}
                      >
                        {tripRequest.user.firstName}
                      </Button>
                    </Box>
                  </>
                ) : tripRequest.status == 'PENDING' ? (
                  <>
                    <Box>
                      From:{' '}
                      <Button compact variant={'subtle'}>
                        {tripRequest.user.firstName}
                      </Button>
                    </Box>
                    <Box>
                      To:{' '}
                      <Button compact variant={'subtle'}>
                        {tripRequest.trip?.user.firstName}
                      </Button>
                    </Box>
                  </>
                ) : (
                  ''
                )}
              </Group>
              <Group position={'center'} style={{ width: '100%' }}>
                {tripRequest.type == 'A' && (
                  <>
                    <Box>
                      {tripRequest.trip?.user.id == user.id ? (
                        <Group position={'center'}>
                          <Button compact variant={'subtle'}>
                            <Text color={'pink'} size={'lg'} weight={900}>
                              {tripRequest.user.firstName.toUpperCase()}
                            </Text>
                          </Button>
                          <Text size={'lg'} weight={500}>
                            join to your trip!
                          </Text>
                        </Group>
                      ) : (
                        <Text size={'xl'} color={'pink'} weight={900}>
                          You Join to Trip!
                        </Text>
                      )}
                    </Box>
                  </>
                )}
              </Group>

              <Badge
                my={'md'}
                style={{ width: '90%', fontSize: '15px', cursor: 'pointer' }}
                component={Link}
                to={
                  (user?.role == ROLE.ADMIN ? '/admin/trips/' : '/trips/') + tripRequest?.trip?.id
                }
              >
                {tripRequest?.trip?.title?.toUpperCase()}
              </Badge>

              <div ref={ref}>
                <Spoiler
                  onMouseUp={() => setImageHeight([imageHeight[1], ref.current?.offsetHeight])}
                  style={{ display: 'flex', flexDirection: 'column' }}
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
  );
}

export default CardTripRequest;
