import React, {useEffect, useState} from 'react';
import {useMutateAddNewProfileVisit, useMutateUserProfileUpdateMap} from '../../api/users/mutations';
import {useGetUserById} from '../../api/users/queries';
import {useParams} from 'react-router-dom';
import {TypographyStylesProvider} from '@mantine/core';
import {CustomLoader} from '../common/CustomLoader';
import UserMap from '../maps/UserMap';
import useStore from '../../store/user.store';
import chatStore from '../../store/chat.store';
import UserInfo from './UserInfo';
import UserPosts from './UserPosts';
import UserImages from './UserImages';
import {isNullOrUndefined} from "../../utils/primitive-checks";

function UserProfile() {
  const {id} = useParams();
  const {user} = useStore((state: any) => state);
  const {socket} = chatStore((state: any) => state);

  const [visitedCountries, setVisitedCountries] = useState<any>(null);
  const [interestedCountries, setInterestedCountries] = useState<any>(null);
  const {data, isFetching} = useGetUserById({id: id, isEnabled: true});
  const {mutate: mutateUpdateUserCountries, isLoading} = useMutateUserProfileUpdateMap();
  const {mutate: mutateUpdateAddNewVisit} = useMutateAddNewProfileVisit();

  useEffect(() => {
    if (Number(id) != Number(user?.id)) {
      mutateUpdateAddNewVisit(id)
    }
  }, [id])

  useEffect(() => {
    if (!isNullOrUndefined(socket) && !isNullOrUndefined(user)) {
      socket.emit('send-views', {
          userId: Number(user.id),
          guestId: Number(id)
        }
      );
    }
  }, [user]);

  useEffect(() => {
    if (data) {
      setInterestedCountries(data.interestedInCountries.map((item: any) => item.code));
      setVisitedCountries(data.visitedCountries.map((item: any) => item.code));
    }
  }, [data]);

  if (isFetching) return <CustomLoader/>;

  return <>
    <TypographyStylesProvider>
      <UserInfo data={data} id={id}/>
      {(data && data?.images != 0) &&
        <UserImages images={data.images}/>
      }
      {(data?.trips.length != 0 || data?.articles.length != 0) &&
        <UserPosts articles={data?.articles} trips={data.trips}/>
      }
    </TypographyStylesProvider>
    {visitedCountries != null && interestedCountries != null && (
      <UserMap
        mutateSelectCountries={mutateUpdateUserCountries}
        isLoading={isLoading}
        visCountries={visitedCountries}
        intCountries={interestedCountries}
        setVisitedCountries={setVisitedCountries}
        setinterestedCountries={setInterestedCountries}
        userId={id}
        // geoDate={geoDate}
      />
    )}
  </>
}

export default UserProfile;
