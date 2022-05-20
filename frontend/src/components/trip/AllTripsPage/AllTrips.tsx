import React, {useEffect, useState} from 'react';
import {useTripsQuery} from '../../../api/trips/queries';
import CardTrip from '../CardTrip/CardTrip';
import CardTripSkeleton from '../CardTrip/CardTripSkeleton';
import {SearchTripsComponent} from './SearchTripsComponent';
import {useQueryClient} from "react-query";
import PaginationComponent from "../../common/PaginationComponent";
import {useParams} from "react-router-dom";
import {isEmptyArray, isNullOrUndefined} from "../../../utils/primitive-checks";

function AllTrips() {
  const {page} = useParams()
  const queryClient = useQueryClient();
  const [activePage, setActivePage] = useState<any>(1);



  const {data: dbTrips, isFetching: isFetchingDbTrips, refetch: refetchDbTrips} =
    useTripsQuery({
      filterFields: {},
      page: activePage,
    });

  useEffect(() => {
    refetchDbTrips()
  }, [activePage, page])

  return <>
    <SearchTripsComponent
      activePage={activePage}
      setActivePage={setActivePage}
    />
    {isFetchingDbTrips && isNullOrUndefined(queryClient.getQueryData(['trips', 'all']))
      ? <CardTripSkeleton/>
      : <>
        {!isNullOrUndefined(dbTrips) && !isEmptyArray(dbTrips?.trips) &&
          <>
            {dbTrips?.trips.map((trip: any) =>
              <CardTrip key={trip.id} trip={trip}/>
            )}
            <PaginationComponent
              items={dbTrips?.totalTripsCount}
              setActivePage={setActivePage}
              activePage={activePage}
              to={'/trips/'}
            />
          </>
        }
      </>
    }
  </>
}

export default AllTrips;
