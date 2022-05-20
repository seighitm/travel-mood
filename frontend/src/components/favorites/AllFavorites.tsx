import {Grid, Group} from '@mantine/core';
import React, {useEffect, useState} from 'react';
import useStore from '../../store/user.store';
import {useGetAllFavorites} from '../../api/users/queries';
import {CustomLoader} from '../common/CustomLoader';
import {ArticleCard} from '../articles/ArticleCard/ArticleCard';
import CardTrip from '../trip/CardTrip/CardTrip';
import {UserCard} from '../users/UserCart';
import {useNavigate, useParams} from "react-router-dom";
import {useQueryClient} from "react-query";
import {getFullUserName} from "../../utils/utils-func";
import TabItemComponent from "./TabItemComponent";

const AllFavorites = () => {
  const {type} = useParams()
  const queryClient = useQueryClient();
  const {user, onlineUsers} = useStore((state: any) => state);
  const navigate = useNavigate()
  const [typeOfFavoriteItems, setTypeOfFavoriteItems] = useState<any>('trips')

  const {data, isFetching} = useGetAllFavorites(typeOfFavoriteItems);

  useEffect(() => {
    setTypeOfFavoriteItems(type)
  }, [])

  useEffect(() => {
    navigate(`${user.role == 'ADMIN' ? '/admin' : ''}/favorites/${typeOfFavoriteItems.toLowerCase()}`)
  }, [typeOfFavoriteItems])

  return (
    <>
      <Group style={{width: '100%'}} position={'center'}>
        <Group mb={15} position={'center'}>
          <TabItemComponent
            setTypeOfFavoriteItems={setTypeOfFavoriteItems}
            typeOfFavoriteItems={typeOfFavoriteItems}
            item={'Trips'}
          />

          <TabItemComponent
            setTypeOfFavoriteItems={setTypeOfFavoriteItems}
            typeOfFavoriteItems={typeOfFavoriteItems}
            item={'Articles'}
          />

          <TabItemComponent
            setTypeOfFavoriteItems={setTypeOfFavoriteItems}
            typeOfFavoriteItems={typeOfFavoriteItems}
            item={'Users'}
          />
        </Group>
      </Group>
      {(isFetching && !queryClient.getQueryData(['favorites', 'all', typeOfFavoriteItems]))
        ? <CustomLoader/>
        : <>
          {typeOfFavoriteItems.toLowerCase() == 'trips'
            ? <>
              {data?.tripFavoritedBy?.map((trip: any) =>
                <CardTrip key={trip.id} trip={trip}/>
              )}
            </>
            : typeOfFavoriteItems.toLowerCase() == 'articles'
              ? <Grid>
                {data?.favoritedArticle?.map((item: any, index: number) => (
                  <Grid.Col xs={12} sm={6} md={4} lg={3} key={item.id}>
                    <ArticleCard article={{...item, favorited: true}}/>
                  </Grid.Col>
                ))}
              </Grid>
              : <Grid>
                {data?.following
                  ?.filter((item: any) => item.id != user?.id)
                  ?.map((us: any) => (
                    <Grid.Col xs={12} sm={6} md={4} lg={3} key={us.id}>
                      <UserCard
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
          }
        </>
      }
    </>
  );
};

export default AllFavorites;
