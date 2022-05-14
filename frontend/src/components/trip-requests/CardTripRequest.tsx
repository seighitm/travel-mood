import React from 'react';
import {Button, Divider, Grid, Group, Image, Spoiler, Text} from '@mantine/core';
import {Link, useNavigate} from 'react-router-dom';
import {useMutateChangeJoinRequestStatus} from '../../api/trips/mutations';
import useStore from '../../store/user.store';
import CustomPaper from "../common/CustomPaper";
import {userPicture} from "../common/Utils";
import {ArrowDownIcon, ArrowUpIcon, ChatBubbleIcon} from "@modulz/radix-icons";

function CardTripRequest({tripRequest, joinRequestStatus}: any) {
  const navigate = useNavigate();
  const {user} = useStore((state: any) => state);
  const {mutate: mutateChangeRequestStatus} = useMutateChangeJoinRequestStatus();

  console.log(tripRequest)
  console.log(joinRequestStatus)

  return <CustomPaper>
    <Grid columns={24}>
      <Grid.Col xl={6} lg={7} md={8} sm={9} xs={10}>
        <Image
          height={100}
          radius="md"
          src={userPicture(user)}
          style={{cursor: 'pointer'}}
          caption={`${user.firstName} ${user.lastName}`}
          onClick={() => navigate('/user/' + tripRequest.user.id)}
        />
      </Grid.Col>
      <Grid.Col xl={18} lg={17} md={16} sm={15} xs={14}>
        <Group position={'apart'} spacing={2}>
          <Button
            compact
            variant="subtle"
            component={Link}
            to={'/trip/' + tripRequest.trip.id}
          >
            <Text weight={'bold'}>
              {tripRequest.trip?.title?.toUpperCase()}
            </Text>
          </Button>

          <Group mr={10}>
            {(joinRequestStatus[0] === 'APPROVED' || joinRequestStatus[0] === 'PENDING' || joinRequestStatus[0] === 'RECEIVED') &&
              <Button
                color={'red'}
                compact
                onClick={() => mutateChangeRequestStatus({tripRequestId: tripRequest.id, status: 'CANCELED'})}
              >
                Decline
              </Button>
            }

            {(joinRequestStatus[0] === 'CANCELED' || joinRequestStatus[0] === 'PENDING' || joinRequestStatus[0] === 'RECEIVED') &&
              <Button
                color={'teal'}
                compact
                onClick={() => mutateChangeRequestStatus({tripRequestId: tripRequest.id, status: 'APPROVED'})}
              >
                Approve
              </Button>
            }
          </Group>
        </Group>

        <Divider
          style={{width: '100%'}}
          my={'xs'}
          label={
            <>
              <ChatBubbleIcon style={{width: '15px', height: '15px'}}/>
              <Text ml={5} size={'xs'}>Comment:</Text>
            </>
          }
        />
        <Spoiler
          style={{display: 'flex', flexDirection: 'column'}}
          maxHeight={32}
          showLabel={<ArrowDownIcon style={{width: '15px', height: '15px'}}/>}
          hideLabel={<ArrowUpIcon style={{width: '15px', height: '15px'}}/>}
        >
          <Text>{tripRequest.comment}</Text>
          {joinRequestStatus[0] == 'RECEIVED' && (
            <Text
              size={'xl'}
              weight={'bold'}
              variant="gradient"
              gradient={{from: 'indigo', to: 'orange'}}
            >
              Sender: {tripRequest.trip.user.firstName}
            </Text>
          )}
        </Spoiler>
      </Grid.Col>
    </Grid>
  </CustomPaper>
}

export default CardTripRequest;
