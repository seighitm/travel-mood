import React, {useEffect, useState} from 'react';
import {useMutateAddNewProfileVisit, useMutateUserProfileUpdateMap} from '../../api/users/mutations';
import {useGetUserById} from '../../api/users/queries';
import {useNavigate, useParams} from 'react-router-dom';
import {TypographyStylesProvider} from '@mantine/core';
import {CustomLoader} from '../common/CustomLoader';
import UserMap from '../maps/UserMap';
import useStore from '../../store/user.store';
import chatStore from '../../store/chat.store';
import UserInfo from './UserInfo';
import UserPosts from './UserPosts';
import UserImages from './UserImages';
import {isEmptyArray, isNullOrUndefined} from "../../utils/primitive-checks";
import {ROLE} from "../../types/enums";

function UserProfile() {
  const {id} = useParams();
  const {user} = useStore((state: any) => state);
  const {socket} = chatStore((state: any) => state);
  const navigate = useNavigate()

  const onErrorEvent = () => {
    if (user.role == ROLE.USER) {
      navigate('/users')
    } else {
      navigate('/admin/users')
    }
  }

  const [visitedCountries, setVisitedCountries] = useState<any>(null);
  const [interestedCountries, setInterestedCountries] = useState<any>(null);
  const {data, isFetching} = useGetUserById({id: id, isEnabled: true, onErrorEvent});
  const {mutate: mutateUpdateUserCountries, isLoading} = useMutateUserProfileUpdateMap();
  const {mutate: mutateUpdateAddNewVisit} = useMutateAddNewProfileVisit();

  useEffect(() => {
    if (!isNullOrUndefined(user) && Number(id) != Number(user?.id)) {
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
      {!isNullOrUndefined(data) && !isEmptyArray(data.images) &&
        <UserImages images={data.images}/>
      }
      {!isNullOrUndefined(data) && !isNullOrUndefined(data?.trips) && !isEmptyArray(data?.articles) &&
        <UserPosts articles={data?.articles} trips={data.trips}/>
      }
    </TypographyStylesProvider>
    {!isNullOrUndefined(visitedCountries) && !isNullOrUndefined(interestedCountries) &&
      <UserMap
        mutateSelectCountries={mutateUpdateUserCountries}
        isLoading={isLoading}
        visCountries={visitedCountries}
        intCountries={interestedCountries}
        setVisitedCountries={setVisitedCountries}
        setinterestedCountries={setInterestedCountries}
        userId={id}
      />
    }
  </>
}

export default UserProfile;
