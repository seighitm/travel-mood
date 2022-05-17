import React from 'react';
import {Accordion, Box, Divider, TypographyStylesProvider} from '@mantine/core';
import {useNavigate, useParams} from 'react-router-dom';
import {useOneTripsQuery, useTripsQuery,} from '../../../api/trips/queries';
import {useMutateAddCommentToTrip, useMutationRemoveCommentFromTrip,} from '../../../api/trips/mutations';
import {CustomLoader} from '../../common/CustomLoader';
import useStore from '../../../store/user.store';
import TripMap from '../../maps/TripMap';
import {CommentBox} from '../../common/comment/CommentBox';
import {EditCommentBox} from '../../common/comment/EditCommentBox';
import TripPageHeader from './TripPageHeader';
import TripContentInfo from './TripContentInfo';
import {isEmptyArray, isNullOrUndefined} from "../../../utils/primitive-checks";
import {dateFormatedToIsoString} from "../../common/Utils";
import UserTripCard from "../../profile/UserTripCard";

function TripPage() {
  const {id} = useParams();
  const {user} = useStore((state: any) => state);
  const {mutate: mutateCommentRemoveFromTrip} = useMutationRemoveCommentFromTrip();

  const onErrorEvent = () => {
    if (user.role == 'USER')
      navigate('/trips')
    else
      navigate('/admin/trips')
  }

  const {data: dbTrip, isFetching: isFetchingDbTrip, isError} = useOneTripsQuery({id, onErrorEvent});
  const {mutate: mutateCreateComment, isLoading: isLoadingCreateComment} = useMutateAddCommentToTrip();
  console.log(dbTrip)
  const navigate = useNavigate()

  const {data: dbTrips, isFetching: isFetchingDbTrips, refetch: refetchDbTrips} =
    useTripsQuery({
      filterFields: {
        destinations: dbTrip?.destinations?.map((item: any) => item.name),
      },
      page: 1,
      isEnabled: dbTrip != null,
    });

  console.log(dbTrips)

  if (isFetchingDbTrip)
    return <CustomLoader/>;

  return (
    <>
      {dbTrip &&
        <>
          <TypographyStylesProvider>
            <Box mb={'lg'}>
              <TripPageHeader trips={dbTrip}/>
              <TripContentInfo trips={dbTrip}/>
            </Box>
          </TypographyStylesProvider>
          <TripMap
            dbMarkers={dbTrip.places}
            dbCountries={dbTrip.destinations}
          />
        </>
      }

      <Divider my={'md'} style={{width: '100%'}} label={'Info:'}/>

      {dbTrips?.trips &&
        <Accordion>
          <Accordion.Item label="Offers to similar locations">
            {dbTrips?.trips.map((trip: any) =>
              <UserTripCard trip={trip}/>
            )}
          </Accordion.Item>
        </Accordion>
      }

      <Divider my={'md'} style={{width: '100%'}} label={'Comments:'}/>
      {!isNullOrUndefined(user) &&
        <EditCommentBox
          id={dbTrip.id}
          mutateCreateComment={mutateCreateComment}
          isLoading={isLoadingCreateComment}
        />
      }
      {!isNullOrUndefined(dbTrip) && !isEmptyArray(dbTrip?.tripComments) &&
        dbTrip?.tripComments.map((item: any) => (
          <CommentBox
            body={item.comment}
            key={item.id}
            mutateRemoveComment={mutateCommentRemoveFromTrip}
            author={item?.user}
            commentId={item.id}
            postedAt={dateFormatedToIsoString(item.createdAt)}
          />
        ))}
    </>
  );
}

export default TripPage;
