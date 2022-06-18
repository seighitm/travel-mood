import React, { useEffect, useState } from 'react';
import { useMutateAddNewProfileVisit } from '../../api/users/mutations';
import { useGetUserById } from '../../api/users/queries';
import { useNavigate, useParams } from 'react-router-dom';
import { Badge, Group, TypographyStylesProvider } from '@mantine/core';
import { CustomLoader } from '../common/CustomLoader';
import UserMap from '../maps/UserMap';
import useStore from '../../store/user.store';
import chatStore from '../../store/chat.store';
import UserInfo from './UserInfo';
import UserPosts from './UserPosts';
import UserImages from './UserImages';
import { isEmptyArray, isNullOrUndefined } from '../../utils/primitive-checks';
import { ROLE } from '../../types/enums';

function UserProfile() {
  const { id } = useParams();
  const { user } = useStore((state: any) => state);
  const { socket } = chatStore((state: any) => state);
  const navigate = useNavigate();

  const onErrorEvent = () => {
    if (user.role == ROLE.ADMIN) {
      navigate('/admin/users');
    } else {
      navigate('/users');
    }
  };

  const [visitedCountries, setVisitedCountries] = useState<any>(null);
  const [interestedCountries, setInterestedCountries] = useState<any>(null);
  const { data, isFetching } = useGetUserById({ id: id, isEnabled: true, onErrorEvent });
  const { mutate: mutateUpdateAddNewVisit } = useMutateAddNewProfileVisit();

  useEffect(() => {
    if (!isNullOrUndefined(user) && Number(id) != Number(user?.id)) {
      mutateUpdateAddNewVisit(id);
    }
  }, [id]);

  useEffect(() => {
    if (!isNullOrUndefined(socket) && !isNullOrUndefined(user)) {
      socket.emit('send-views', {
        userId: Number(user.id),
        guestId: Number(id),
      });
    }
  }, [user]);

  useEffect(() => {
    if (data) {
      setInterestedCountries(
        data.interestedInCountries.map((item: any) => ({ code: item.code, name: item.name }))
      );
      setVisitedCountries(
        data.visitedCountries.map((item: any) => ({ code: item.code, name: item.name }))
      );
    }
  }, [data]);

  if (isFetching) return <CustomLoader />;

  return (
    <>
      <TypographyStylesProvider>
        <UserInfo data={data} id={id} />
        {!isNullOrUndefined(data) && !isEmptyArray(data.images) && (
          <UserImages images={data.images} />
        )}
        {!isNullOrUndefined(data) &&
          (!isEmptyArray(data.trips) || !isEmptyArray(data.articles)) && (
            <UserPosts articles={data?.articles} trips={data.trips} />
          )}
      </TypographyStylesProvider>
      {!isNullOrUndefined(visitedCountries) && !isNullOrUndefined(interestedCountries) && (
        <>
          <UserMap
            visCountries={visitedCountries}
            intCountries={interestedCountries}
            setVisitedCountries={setVisitedCountries}
            setInterestedCountries={setInterestedCountries}
            userId={id}
          />
          <Group spacing={'xs'} position={'center'}>
            <Badge color={'orange'} variant={'light'}>
              Visited
            </Badge>
            <Badge color={'green'} variant={'light'}>
              Interested in
            </Badge>
            <Badge color={'violet'} variant={'light'}>
              Visited & interested in
            </Badge>
          </Group>
        </>
      )}
    </>
  );
}

export default UserProfile;
