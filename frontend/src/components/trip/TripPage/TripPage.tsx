import React, {useEffect} from 'react';
import {Accordion, Box, Divider, Space, TypographyStylesProvider} from '@mantine/core';
import {useParams} from 'react-router-dom';
import {useOneTripsQuery, useTripsQuery} from '../../../api/trips/queries';
import {CustomLoader} from '../../common/CustomLoader';
import useStore from '../../../store/user.store';
import TripMap from '../../maps/TripMap';
import {CommentBox} from '../../common/comment/CommentBox';
import {EditCommentBox} from '../../common/comment/EditCommentBox';
import TripPageHeader from './TripPageHeader';
import TripContentInfo from './TripContentInfo';
import {isEmptyArray, isNullOrUndefined} from '../../../utils/primitive-checks';
import {dateFormattedToIsoString} from '../../../utils/utils-func';
import CardTrip from '../CardTrip/CardTrip';

function TripPage() {
  const {id} = useParams();
  const {user} = useStore((state: any) => state);
  const {data: dbTrip, refetch, isFetching: isFetchingDbTrip} = useOneTripsQuery({id});

  useEffect(() => {
    refetch();
  }, [id]);

  const {data: dbTrips} = useTripsQuery({
    filterFields: {destinations: dbTrip?.destinations?.map((item: any) => item.code)},
    isEnabled: dbTrip != null,
    page: 1,
  });

  if (isFetchingDbTrip) return <CustomLoader/>;

  return (
    <>
      {/*<HeadTags></HeadTags>*/}
      {!isNullOrUndefined(dbTrip) && (
        <>
          <TypographyStylesProvider>
            <Box mb={'lg'}>
              <TripPageHeader trip={dbTrip}/>
              <TripContentInfo trip={dbTrip}/>
            </Box>
          </TypographyStylesProvider>
          <TripMap dbMarkers={dbTrip.places} dbCountries={dbTrip.destinations}/>
        </>
      )}

      {!isNullOrUndefined(dbTrips?.trips) &&
        !isEmptyArray(dbTrips?.trips) &&
        dbTrips?.trips?.filter((item: any) => item.id != id).length != 0 && (
          <Accordion
            mt={'xl'}
            styles={{
              content: {
                paddingLeft: 0,
              },
            }}
          >
            <Accordion.Item label="Offers to similar locations">
              {dbTrips?.trips
                ?.filter((item: any) => item.id != id)
                .map((trip: any) => (
                  <CardTrip key={trip.id} trip={trip}/>
                ))}
            </Accordion.Item>
          </Accordion>
        )}

      <Divider my={'md'} style={{width: '100%'}} label={'Comments:'}/>

      {!isNullOrUndefined(user) && !isNullOrUndefined(dbTrip) && (
        <EditCommentBox id={dbTrip?.id} postType={'trips'}/>
      )}

      {!isNullOrUndefined(dbTrip) && !isEmptyArray(dbTrip?.comments) && (
        <div>
          {dbTrip?.comments.map((item: any) => (
            <CommentBox
              postType={'trips'}
              body={item.comment}
              key={item.id}
              author={item?.user}
              commentId={item.id}
              postedAt={dateFormattedToIsoString(item?.createdAt)}
            />
          ))}
        </div>
      )}
      <Space h={'xl'}/>
    </>
  );
}

export default TripPage;
