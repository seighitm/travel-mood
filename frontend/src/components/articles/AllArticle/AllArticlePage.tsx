import React, { useEffect, useState } from 'react';
import { Grid, Stack } from '@mantine/core';
import { useGetAllArticles } from '../../../api/articles/queries';
import ArticleCardSkeleton from '../ArticleCard/ArticleCardSkeleton';
import { ArticleCard } from '../ArticleCard/ArticleCard';
import { FilterBarComponent } from './FilterBarComponent';
import PaginationComponent from '../../common/PaginationComponent';
import { useParams } from 'react-router-dom';
import { isEmptyArray, isNullOrUndefined } from '../../../utils/primitive-checks';
import { useQueryParams } from '../../../utils/utils-func';

function AllArticlePage() {
  const { page } = useParams();
  let query = useQueryParams();
  const [activePage, setActivePage] = useState<any>(1);
  const { data: articles, isLoading: isLoadingArticles } = useGetAllArticles({
    page: activePage,
  });

  useEffect(() => {
    setActivePage(!isNullOrUndefined(Number(query.get('page'))) ? 1 : Number(query.get('page')));
  }, [page]);

  return (
    <>
      <FilterBarComponent activePage={activePage} />
      {isLoadingArticles ? <ArticleCardSkeleton /> : null}
      {!isNullOrUndefined(articles) && !isLoadingArticles ? (
        <Stack>
          <Grid style={{ minHeight: '550px' }} mb={'lg'}>
            {!isEmptyArray(articles.articles) &&
              articles.articles.map((item: any) => (
                <Grid.Col key={item.id} xs={12} sm={6} md={4} lg={4}>
                  <ArticleCard page={activePage} article={item} />
                </Grid.Col>
              ))}
          </Grid>
          <PaginationComponent
            items={articles?.totalCount}
            setActivePage={setActivePage}
            activePage={activePage}
            to={'/articles'}
          />
        </Stack>
      ) : (
        <ArticleCardSkeleton />
      )}
    </>
  );
}

export default AllArticlePage;
