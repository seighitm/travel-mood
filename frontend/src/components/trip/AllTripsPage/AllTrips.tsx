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

  const [languages, setLanguages] = useState<any>([]);
  const [destinations, setDestinations] = useState<any>([]);
  const [sex, setSex] = useState<any>('');
  const [date, setDate] = useState<any>([]);
  const [age, setAge] = useState<any>('');
  const [budget, setBudget] = useState<any>(0);
  const [activePage, setActivePage] = useState<any>(1);

  const {data: dbTrips, isFetching: isFetchingDbTrips, refetch: refetchDbTrips} =
    useTripsQuery({
      filterFields: {
        destinations: destinations,
        languages: languages,
        sex: sex,
        date: date,
        age: age,
        budget: budget
      },
      page: activePage,
    });

  useEffect(() => {
    refetchDbTrips()
  }, [activePage, page])

  React.useCallback(async () => {
    if (sex == '' && languages.length == 0 && destinations.length == 0) {
      await refetchDbTrips();
    }
  }, [destinations, languages, sex]);

  return <>
    <SearchTripsComponent
      setActivePage={setActivePage}
      refetchDbTrips={refetchDbTrips}
      sex={sex}
      date={date}
      setDate={setDate}
      age={age}
      setAge={setAge}
      budget={budget}
      setBudget={setBudget}
      languages={languages}
      destinations={destinations}
      setSex={setSex}
      setDestinations={setDestinations}
      setLanguages={setLanguages}
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
