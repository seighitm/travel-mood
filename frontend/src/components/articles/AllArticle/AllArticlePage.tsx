import React, {useEffect, useMemo, useState} from 'react';
import {Grid, Stack} from '@mantine/core';
import {useTagsQuery} from '../../../api/tags/queries';
import {useGetAllArticles} from '../../../api/articles/queries';
import {useGetLocations} from '../../../api/countries/queries';
import ArticleCardSkeleton from '../ArticleCard/ArticleCardSkeleton';
import {ArticleCard} from '../ArticleCard/ArticleCard';
import {FilterBarComponent} from "./FilterBarComponent";
import {useQueryClient} from "react-query";
import PaginationComponent from "../../common/PaginationComponent";
import {useParams} from "react-router-dom";
import {isEmptyArray, isNullOrUndefined} from "../../../utils/primitive-checks";

function AllArticlePage() {
  const {page} = useParams()
  const queryClient = useQueryClient();
  const [activePage, setActivePage] = useState<any>(1);
  const [tags, setTags] = useState<any>([]);



console.log('misa')
  useEffect(() => {
    setActivePage(Number(page))
  }, [page])

  const {data: articles, refetch: refetchArticles, isLoading: isLoadingArticles} = useGetAllArticles({
    page: activePage
  });

  // useEffect(() => {
  //   refetchArticles();
  // }, [])


  // useEffect(() => {
  //   if (userName == '' && countries?.length == 0 && tags?.length == 0) {
  //     refetchArticles();
  //   }
  // }, [countries, tags, userName]);


  return (
    <>
          <FilterBarComponent
            activePage={activePage}
          />

      {/*{isLoadingArticles ? <ArticleCardSkeleton/> : null}*/}
      {!isNullOrUndefined(articles) && !isLoadingArticles
        ? <Stack>
          <Grid style={{minHeight: '550px'}} mb={'lg'}>
            {!isEmptyArray(articles.articles) && articles.articles.map((item: any) => (
              <Grid.Col key={item.id} xs={12} sm={6} md={4} lg={4}>
                <ArticleCard
                  page={activePage}
                  article={item}
                />
              </Grid.Col>
            ))}
          </Grid>
          <PaginationComponent items={articles?.totalCount}
                               setActivePage={setActivePage}
                               activePage={activePage}
                               to={'/articles/'}
          />
        </Stack>
        : <ArticleCardSkeleton/>
      }
    </>
  );
}

export default AllArticlePage;
