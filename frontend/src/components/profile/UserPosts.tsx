import React from 'react';
import {Accordion, Badge, Group, Paper} from '@mantine/core';
import useStore from '../../store/user.store';
import {useMutationDeleteArticle} from '../../api/articles/mutations';
import ArticleCard from './ArticleCard';
import UserTripCard from "./UserTripCard";

function UserPosts({articles, trips}: any) {
  const {user} = useStore((state: any) => state);
  const {mutate: mutateDeleteArticle} = useMutationDeleteArticle({});
  console.log(articles)
  return (
    <Paper
      radius={10}
      mt={'md'}
      sx={(theme) => ({
        border: '2px solid ',
        boxShadow: theme.shadows.lg,
        borderColor: theme.colorScheme === 'dark' ? theme.colors.gray[8] : theme.colors.gray[2],
        position: 'relative',
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,
      })}
    >
      <Accordion>
        {trips?.length != 0 &&
          <Accordion.Item
            label="Trips"
            styles={() => ({
              itemTitle: {margin: '0!important'},
              content: {paddingLeft: 0},
            })}
          >
            {trips?.length != 0
              ? trips.map((trip: any) =>
                <UserTripCard
                  key={trip.id}
                  trip={trip}
                />)
              : <Group style={{width: '100%'}} position={'center'}>
                <Badge color="red" size="xl">
                  Empty
                </Badge>
              </Group>
            }
          </Accordion.Item>
        }
        {articles?.length != 0 &&
          <Accordion.Item
            label="Articles"
            styles={() => ({
              itemTitle: {margin: '0!important'},
              content: {paddingLeft: 0},
            })}
          >
            {articles?.length != 0
              ? articles.map((article: any) =>
                <ArticleCard
                  key={article.id}
                  article={article}
                />)
              : <Group style={{width: '100%'}} position={'center'}>
                <Badge color="red" size="xl">
                  Empty
                </Badge>
              </Group>
            }
          </Accordion.Item>
        }
      </Accordion>
    </Paper>
  );
}

export default UserPosts;
