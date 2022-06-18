import React from 'react';
import { Accordion, Paper } from '@mantine/core';
import ArticleCard from './ArticleCard';
import { isEmptyArray, isNullOrUndefined } from '../../utils/primitive-checks';
import { ITrip } from '../../types/ITrip';
import { IArticle } from '../../types/IArticle';
import CardTrip from '../trip/CardTrip/CardTrip';

interface UserPostsComponentProps {
  trips: ITrip[];
  articles: IArticle[];
}

function UserPosts({ articles, trips }: UserPostsComponentProps) {
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
        {!isNullOrUndefined(trips) && !isEmptyArray(trips) && (
          <Accordion.Item
            label={`Trips (${trips?.length})`}
            styles={() => ({
              itemTitle: { margin: '0!important' },
              content: { paddingLeft: 0 },
            })}
          >
            {trips.map((trip: any) => (
              <CardTrip key={trip.id} trip={trip} />
            ))}
          </Accordion.Item>
        )}
        {!isNullOrUndefined(articles) && !isEmptyArray(articles) && (
          <Accordion.Item
            label={`Articles (${articles?.length})`}
            styles={() => ({
              itemTitle: { margin: '0!important' },
              content: { paddingLeft: 0 },
            })}
          >
            {articles.map((article: any) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </Accordion.Item>
        )}
      </Accordion>
    </Paper>
  );
}

export default UserPosts;
