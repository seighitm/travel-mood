import React, { useEffect, useState } from 'react';
import { useTripsQuery } from '../../../api/trips/queries';
import CardTrip from '../CardTrip/CardTrip';
import CardTripSkeleton from '../CardTrip/CardTripSkeleton';
import { FilterBarTrips } from './FilterBarTrips';
import { useQueryClient } from 'react-query';
import PaginationComponent from '../../common/PaginationComponent';
import { useParams } from 'react-router-dom';
import { isEmptyArray, isNullOrUndefined } from '../../../utils/primitive-checks';
import { useQueryParams } from '../../../utils/utils-func';
import { LoadingOverlay } from '@mantine/core';

function AllTrips() {
  const { page } = useParams();
  let query = useQueryParams();
  const queryClient = useQueryClient();
  const [activePage, setActivePage] = useState<any>(1);

  const {
    data: dbTrips,
    isFetching: isFetchingDbTrips,
    refetch: refetchDbTrips,
  } = useTripsQuery({ page: activePage });

  useEffect(() => {
    setActivePage(query.get('page'));
  }, [page]);

  useEffect(() => {
    refetchDbTrips();
  }, [activePage]);

  return (
    <>
      <FilterBarTrips activePage={activePage} setActivePage={setActivePage} />
      {isFetchingDbTrips && isNullOrUndefined(queryClient.getQueryData(['trips', 'all'])) ? (
        <CardTripSkeleton />
      ) : (
        <>
          {!isNullOrUndefined(dbTrips) && !isEmptyArray(dbTrips?.trips) && (
            <>
              {dbTrips?.trips.map((trip: any) => (
                <CardTrip key={trip.id} trip={trip} />
              ))}
              <PaginationComponent
                items={dbTrips?.totalTripsCount}
                setActivePage={setActivePage}
                activePage={activePage}
                to={'/trips'}
              />
            </>
          )}
        </>
      )}
    </>
  );
}

export default AllTrips;
