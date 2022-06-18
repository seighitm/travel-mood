import { Grid, Group } from '@mantine/core';
import React, { useEffect } from 'react';
import useStore from '../../store/user.store';
import { useGetAllFavorites } from '../../api/users/queries';
import { CustomLoader } from '../common/CustomLoader';
import { ArticleCard } from '../articles/ArticleCard/ArticleCard';
import CardTrip from '../trip/CardTrip/CardTrip';
import { UserCard } from '../users/UserCart';
import { useParams } from 'react-router-dom';
import { useQueryClient } from 'react-query';
import { getFullUserName } from '../../utils/utils-func';
import TabItemComponent from './TabItemComponent';
import { isNullOrUndefined } from '../../utils/primitive-checks';
import { News, PlaneDeparture, User } from '../common/Icons';

const AllFavorites = () => {
  const { type } = useParams();
  const queryClient = useQueryClient();
  const { user, onlineUsers } = useStore((state: any) => state);

  const { data, refetch, isFetching } = useGetAllFavorites(type);

  useEffect(() => {
    refetch();
  }, [type]);

  return (
    <>
      <Group style={{ width: '100%' }} position={'center'}>
        <Group mb={15} position={'center'}>
          <TabItemComponent
            icon={<PlaneDeparture size={15} />}
            typeOfFavoriteItems={type}
            item={'trips'}
          />

          <TabItemComponent
            icon={<News size={15} />}
            typeOfFavoriteItems={type}
            item={'articles'}
          />

          <TabItemComponent icon={<User size={15} />} typeOfFavoriteItems={type} item={'users'} />
        </Group>
      </Group>
      {isFetching && !queryClient.getQueryData(['favorites', 'all', type]) ? (
        <CustomLoader />
      ) : (
        <>
          {!isNullOrUndefined(type) && type?.toLowerCase() == 'trips' ? (
            <>
              {data?.tripFavoritedBy?.map((trip: any) => (
                <CardTrip key={trip.id} trip={trip} />
              ))}
            </>
          ) : !isNullOrUndefined(type) && type?.toLowerCase() == 'articles' ? (
            <Grid>
              {data?.favoritedArticle?.map((item: any) => (
                <Grid.Col xs={12} sm={6} md={4} lg={3} key={item.id}>
                  <ArticleCard article={{ ...item, favorited: true }} />
                </Grid.Col>
              ))}
            </Grid>
          ) : (
            <Grid>
              {data?.following
                ?.filter((item: any) => item.id != user?.id)
                ?.map((us: any) => (
                  <Grid.Col xs={12} sm={6} md={4} lg={3} key={us.id}>
                    <UserCard
                      folloers={data?.followedBy}
                      role={us?.role.role}
                      picture={us.picture}
                      id={us.id}
                      name={getFullUserName(us)}
                      onlineUsers={onlineUsers}
                      isFollowedByUser={true}
                    />
                  </Grid.Col>
                ))}
            </Grid>
          )}
        </>
      )}
    </>
  );
};

export default AllFavorites;
