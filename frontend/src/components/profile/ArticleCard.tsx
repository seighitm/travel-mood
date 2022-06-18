import React from 'react';
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  createStyles,
  Divider,
  Grid,
  Group,
  Image,
  Paper,
  Spoiler,
  Text,
  TypographyStylesProvider,
  useMantineTheme,
} from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import useStore from '../../store/user.store';
import { Flag, Star } from '../common/Icons';
import {
  useMutationFavoriteArticle,
  useMutationUnFavoriteArticle,
} from '../../api/articles/mutations';
import { isEmptyArray, isNullOrUndefined } from '../../utils/primitive-checks';
import { IArticle } from '../../types/IArticle';
import { articleImage, customNavigation } from '../../utils/utils-func';
import PostFavoriteBy from '../common/PostFavoriteBy';

const useStyles = createStyles((theme) => ({
  body: {
    marginTop: theme.spacing.xl,
    [`@media (max-width: ${theme.breakpoints.md}px)`]: {
      paddingLeft: 0,
      marginTop: theme.spacing.xs,
    },
  },

  title: {
    fontSize: '25px',
    fontWeight: 700,
    cursor: 'pointer',
    color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    lineHeight: 1,
    marginBottom: theme.spacing.md,
  },
}));

interface ArticleCardComponentProps {
  article: IArticle;
}

const ArticleCard = React.memo(({ article }: ArticleCardComponentProps) => {
  const { user } = useStore((state: any) => state);
  const navigate = useNavigate();
  const { classes } = useStyles();
  const theme = useMantineTheme();
  const { mutate: mutateFavorite, isLoading: isLoadingFavorite } = useMutationFavoriteArticle({});
  const { mutate: mutateUnFavorite, isLoading: isLoadingUnFavorite } = useMutationUnFavoriteArticle(
    {}
  );

  const isFavoriteArticle =
    article.favoritedBy?.find((item: { id: string }) => item.id == user?.id) !== undefined;

  const handlerFavoriteArticle = (article: any) => {
    if (isFavoriteArticle) {
      mutateUnFavorite({ id: article.id });
    } else {
      mutateFavorite({ id: article.id });
    }
  };

  return (
    <Box key={article.id}>
      <Paper
        mb={'lg'}
        pl={'sm'}
        radius={10}
        sx={(theme) => ({
          boxShadow: theme.shadows.lg,
          position: 'relative',
          borderRadius: theme.radius.md,
          backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
          border: `1px solid ${
            theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[3]
          }`,
        })}
      >
        <Grid columns={24}>
          <Grid.Col lg={5} xl={5} md={7} sm={8} style={{ position: 'relative' }}>
            <Image
              withPlaceholder
              radius="md"
              mt={'sm'}
              mr={'sm'}
              height={article.countries?.length != 0 ? 160 : 115}
              src={articleImage(article)}
              caption={user?.name}
              style={{ cursor: 'pointer' }}
              onClick={() => customNavigation(user?.role, navigate, '/users/' + article.user.id)}
              styles={{
                caption: {
                  margin: 0,
                  '&:hover': {
                    color: 'blue',
                    weight: '900px',
                  },
                },
              }}
            />
          </Grid.Col>
          <Grid.Col lg={19} xl={19} md={17} sm={16} style={{ position: 'relative' }}>
            <Group spacing={3} position={'apart'} direction={'column'} mt={'xs'}>
              <Text
                variant="gradient"
                gradient={{ from: '#4c6be8', to: '#cd832e', deg: 45 }}
                onClick={() => customNavigation(user?.role, navigate, '/articles/' + article.id)}
                className={classes.title}
              >
                {article.title?.toUpperCase()}
              </Text>

              <Group>
                <Button
                  mr={'md'}
                  color="pink"
                  compact
                  radius={'xl'}
                  variant={'outline'}
                  leftIcon={
                    !isNullOrUndefined(user) ? (
                      <ActionIcon
                        loading={isLoadingFavorite || isLoadingUnFavorite}
                        size={20}
                        radius={'xl'}
                        onClick={() => handlerFavoriteArticle(article)}
                        color={theme.colors.red[7]}
                        variant={'transparent'}
                      >
                        <Star
                          size={17}
                          color={isNullOrUndefined(user) ? 'gray' : theme.colors.red[6]}
                          fill={isFavoriteArticle ? theme.colors.red[6] : 'none'}
                        />
                      </ActionIcon>
                    ) : undefined
                  }
                >
                  <TypographyStylesProvider>
                    <Group
                      position={'center'}
                      p={0}
                      align={'center'}
                      style={{
                        width: '18px',
                        height: '30px',
                        color: isFavoriteArticle ? theme.colors.pink[8] : theme.colors.pink[4],
                      }}
                    >
                      {article.favoritedBy.length != 0 ? article.favoritedBy.length : '0'}
                    </Group>
                  </TypographyStylesProvider>
                </Button>
                {!isNullOrUndefined(article) && !isEmptyArray(article.favoritedBy) && (
                  <PostFavoriteBy favoriteList={article?.favoritedBy} />
                )}
              </Group>
            </Group>
            <div className={classes.body}>
              {!isNullOrUndefined(article?.description) && (
                <>
                  <Divider
                    style={{ width: '100%' }}
                    my="xs"
                    label={
                      <>
                        <Flag size={12} />
                        <Box ml={5}>Description:</Box>
                      </>
                    }
                  />
                  <Text weight={500} size="lg" mb={5} lineClamp={3}>
                    {article.description}
                  </Text>
                </>
              )}

              {article.countries?.length != 0 && (
                <>
                  <Divider
                    style={{ width: '100%' }}
                    my="xs"
                    label={
                      <>
                        <Flag size={12} />
                        <Box ml={5}>Countries:</Box>
                      </>
                    }
                  />
                  <Group mt={5} position={'left'}>
                    <Spoiler
                      style={{ display: 'flex', flexDirection: 'column' }}
                      maxHeight={33}
                      showLabel="Show more"
                      hideLabel="Hide"
                    >
                      {article.countries &&
                        article.countries.map((i: any) => (
                          <Badge
                            mb={10}
                            color={theme.colorScheme === 'dark' ? 'dark' : 'gray'}
                            mr={'md'}
                            key={i.name}
                            leftSection={
                              <ActionIcon size="xs" color="blue" radius="xl" variant="transparent">
                                <Image
                                  mb={0}
                                  style={{ height: '12px' }}
                                  src={`${
                                    import.meta.env.VITE_API_URL
                                  }uploads/flags/${i.code.toLowerCase()}.svg`}
                                  withPlaceholder
                                />
                              </ActionIcon>
                            }
                          >
                            {i.name}
                          </Badge>
                        ))}
                    </Spoiler>
                  </Group>
                </>
              )}
            </div>
          </Grid.Col>
        </Grid>
      </Paper>
    </Box>
  );
});

export default ArticleCard;
