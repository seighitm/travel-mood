import React from 'react';
import {
  ActionIcon,
  Avatar,
  Badge,
  Card,
  createStyles,
  Grid,
  Group,
  Image,
  Spoiler,
  Text,
  Tooltip,
} from '@mantine/core';
import {Link, useNavigate} from 'react-router-dom';
import {useMutationFavoriteArticle, useMutationUnFavoriteArticle,} from '../../../api/articles/mutations';
import useStore from '../../../store/user.store';
import SocialSharButtons from '../../common/social-share/SocialSharButtons';
import {ArrowDown, ArrowNarrowDown, ArrowNarrowUp, ArrowUp, Star} from '../../common/Icons';
import {isEmptyArray, isNullOrUndefined} from '../../../utils/primitive-checks';
import {
  articleImage,
  customNavigation,
  dateFormattedToIsoString,
  getFullUserName,
  userPicture,
} from '../../../utils/utils-func';
import {IArticle} from '../../../types/IArticle';
import {MD_ICON_SIZE} from '../../../utils/constants';

const useStyles = createStyles((theme) => ({
  card: {
    boxShadow: theme.shadows.lg,
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
  },

  title: {
    fontSize: '20px',
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
  },

  footer: {
    padding: `${theme.spacing.xs / 2}px ${theme.spacing.lg}px`,
    marginTop: theme.spacing.sm,
    borderTop: `1px solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2]
    }`,
  },

  header: {
    minHeight: '25px',
    padding: `${theme.spacing.xs}px ${theme.spacing.lg}px`,
    borderBottom: `1px solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2]
    }`,
  },

  countriesBox: {
    minHeight: '25px',
    padding: `${theme.spacing.xs}px ${theme.spacing.lg}px`,
    borderBottom: `1px solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2]
    }`,
  },
}));

interface ArticleCardComponentProps {
  article: IArticle;
  page?: number | string;
}

export function ArticleCard({article, page}: ArticleCardComponentProps) {
  const {classes, theme} = useStyles();
  const navigate = useNavigate();
  const {user} = useStore((state: any) => state);
  const {mutate: mutateFavorite, isLoading: isLoadingFavoriteHandler} =
    useMutationFavoriteArticle({page});
  const {mutate: mutateUnFavorite, isLoading: isLoadingUnFavoriteHandler} =
    useMutationUnFavoriteArticle({page});

  const handlerFavoriteArticle = () => {
    if (article.favorited) {
      mutateUnFavorite({id: article.id});
    } else {
      mutateFavorite({id: article.id});
    }
  };

  return (
    <Card withBorder p="lg" radius="md" className={classes.card}>
      <Card.Section
        onClick={() => navigate(`/articles/${article.id}`)}
        style={{position: 'relative', cursor: 'pointer'}}
      >
        <Image
          src={articleImage(article)}
          withPlaceholder
          alt={'Article image'}
          height={180}
        />
        {article.isUpdatedByAdmin && (
          <Badge
            color={'pink'}
            variant={'outline'}
            style={{position: 'absolute', top: 10, right: 10}}
          >
            Edited by admin
          </Badge>
        )}
      </Card.Section>

      <Card.Section className={classes.header}>
        {!isNullOrUndefined(article) && !isEmptyArray(article?.tagList) && (
          <Spoiler
            maxHeight={25}
            style={{display: 'flex'}}
            showLabel={<ArrowNarrowDown size={17}/>}
            hideLabel={<ArrowNarrowUp size={17}/>}
          >
            {article.tagList.map((tag: any) => (
              <Badge
                sx={{textTransform: 'lowercase'}}
                key={tag?.name ? tag?.name : tag}
                mb={2}
                color="gray"
              >
                {tag?.name ? tag?.name : tag}
              </Badge>
            ))}
          </Spoiler>
        )}
      </Card.Section>

      <Text
        className={classes.title}
        mt="xs"
        lineClamp={1}
        component={Link}
        to={`/articles/${article.id}`}
        size={'xl'}
        weight={700}
        variant="gradient"
        gradient={{from: '#4c6be8', to: '#cd832e', deg: 45}}
      >
        {article.title}
      </Text>

      <Group mt="lg" position={'apart'}>
        <Grid>
          <Grid.Col span={2}>
            <Group position={'center'} style={{width: '100%', height: '100%'}}>
              <Avatar
                ml={'md'}
                radius={'xl'}
                src={userPicture(article?.author)}
                style={{cursor: 'pointer'}}
                onClick={() =>
                  customNavigation(user?.role, navigate, `/users/${article.author.id}`)
                }
              />
            </Group>
          </Grid.Col>
          <Grid.Col ml={'md'} span={9}>
            <Text
              size={'sm'}
              lineClamp={1}
              weight={500}
              style={{cursor: 'pointer'}}
              onClick={() => customNavigation(user?.role, navigate, `/users/${article.author.id}`)}
            >
              {getFullUserName(article?.author)}
            </Text>
            <Text size="xs" color="dimmed">
              posted {dateFormattedToIsoString(article.createdAt)}
            </Text>
          </Grid.Col>
        </Grid>

        <Group
          style={{width: '100%'}}
          position={'left'}
          spacing={2}
        >
          <Spoiler
            m={0}
            pr={'md'}
            className={classes.countriesBox}
            maxHeight={18}
            showLabel={<ArrowDown size={MD_ICON_SIZE}/>}
            hideLabel={<ArrowUp size={MD_ICON_SIZE}/>}
          >
            <Group mr={'xs'} spacing={theme.spacing.xs / 2}>
              {!isNullOrUndefined(article) &&
                !isEmptyArray(article?.countries) &&
                article.countries?.map((destination: any) => (
                  <Tooltip
                    key={destination.name}
                    position="bottom"
                    placement="center"
                    label={destination.name}
                    withArrow
                  >
                    <ActionIcon
                      size="xs"
                      color="blue"
                      radius="xl"
                      variant="transparent"
                    >
                      <Image
                        mb={0}
                        style={{height: '12px'}}
                        withPlaceholder
                        src={`${import.meta.env.VITE_API_URL}uploads/flags/${destination.code.toLowerCase()}.svg`}
                      />
                    </ActionIcon>
                  </Tooltip>
                ))}
            </Group>
          </Spoiler>
        </Group>
      </Group>

      <Card.Section className={classes.footer}>
        <Group position="right">
          {article?.favoritedBy?.length != 0 && (
            <Text size="xs" color="dimmed">
              {article?.favoritedBy?.length} people liked this post
            </Text>
          )}
          <Group spacing={0}>
            {!isNullOrUndefined(user) && (
              <ActionIcon
                loading={isLoadingFavoriteHandler || isLoadingUnFavoriteHandler}
                radius={'xl'}
                disabled={isLoadingFavoriteHandler || isLoadingUnFavoriteHandler}
                onClick={handlerFavoriteArticle}
              >
                <Star
                  size={17}
                  color={theme.colors.red[6]}
                  fill={article?.favorited ? theme.colors.red[6] : 'none'}
                />
              </ActionIcon>
            )}
            <SocialSharButtons url={`/articles/${article.id}`}/>
          </Group>
        </Group>
      </Card.Section>
    </Card>
  );
}
