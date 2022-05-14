import {Grid, Group, Tabs, TabsProps} from '@mantine/core';
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

function StyledTabs(props: TabsProps & { active: any, onTabChange: any } | any) {
  return (
    <Tabs
      active={props.activeTab}
      onTabChange={props.setActiveTab}
      variant="unstyled"
      styles={(theme) => ({
        body: {
          paddingTop: '27px',
        },
        tabControl: {
          // backgroundImage: "linear-gradient(60deg, #12b886 0%, #228be6 100%)",
          backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,
          color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[9],
          border: `1px solid ${
            theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[4]
          }`,
          fontSize: theme.fontSizes.md,
          padding: `${theme.spacing.lg}px ${theme.spacing.xl}px`,

          '&:not(:first-of-type)': {
            borderLeft: 0,
          },

          '&:first-of-type': {
            borderTopLeftRadius: theme.radius.md,
            borderBottomLeftRadius: theme.radius.md,
          },

          '&:last-of-type': {
            borderTopRightRadius: theme.radius.md,
            borderBottomRightRadius: theme.radius.md,
          },
        },
        tabsList: {
          justifyContent: 'center',
        },
        tabActive: {
          backgroundImage: 'linear-gradient(60deg, #92c1e6 0%, #0a5799 100%)',
          // backgroundColor: theme.colors.blue[7],
          borderColor: theme.colors.blue[7],
          color: theme.white,
        },
      })}
      {...props}
    />
  );
}

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

  // useEffect(() => {
  //   navigate(activeTab == 0
  //     ? '/favorites/trips'
  //     : activeTab == 1
  //       ? '/favorites/articles'
  //       : activeTab == 2
  //         ? '/favorites/users'
  //         : '')
  // }, [activeTab])


  useEffect(() => {
    navigate(`/favorites/${typeOfFavoriteItems.toLowerCase()}`)
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
      {(isFetching && !queryClient.getQueryData(['favorites', 'all']))
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
                      <UserCard picture={us.picture}
                                id={us.id}
                                name={getFullUserName(us)}
                                onlineUsers={onlineUsers}
                                isFollowedByUser={true}/>
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
