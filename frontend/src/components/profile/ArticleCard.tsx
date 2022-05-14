import React from 'react';
import {
  ActionIcon,
  Badge,
  Box,
  createStyles,
  Divider,
  Grid,
  Group,
  Image,
  Paper,
  Spoiler,
  Text,
  Title,
  useMantineTheme,
} from '@mantine/core';
import {useNavigate} from 'react-router-dom';
import useStore from '../../store/user.store';
import {Flag, Language} from '../../assets/Icons';
import {useMutationFavoriteArticle, useMutationUnFavoriteArticle} from '../../api/articles/mutations';
import {articleImage} from "../common/Utils";

const useStyles = createStyles((theme) => ({
  wrapper: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing.xl,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
    border: `1px solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[3]
    }`,

    [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
      flexDirection: 'column',
      padding: theme.spacing.xl,
    },
  },

  // image: {
  //     maxWidth: '90%',
  //
  //     [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
  //         maxWidth: '100%',
  //     },
  // },

  body: {
    paddingLeft: theme.spacing.xl * 2,
    marginTop: theme.spacing.xl,
    [`@media (max-width: ${theme.breakpoints.md}px)`]: {
      paddingLeft: 0,
      marginTop: theme.spacing.xs,
    },
  },

  title: {
    cursor: 'pointer',
    color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    lineHeight: 1,
    marginBottom: theme.spacing.md,
  },

  controls: {
    display: 'flex',
    marginTop: theme.spacing.xl,
  },

  inputWrapper: {
    width: '100%',
    flex: '1',
  },

  input: {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    borderRight: 0,
  },

  control: {
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
}));

const ArticleCard = React.memo(({article}: any) => {
  const {user} = useStore((state: any) => state);
  const navigate = useNavigate();
  const {classes} = useStyles();
  const theme = useMantineTheme();
  const {mutate: mutateFavorite} = useMutationFavoriteArticle({});
  const {mutate: mutateUnFavorite} = useMutationUnFavoriteArticle({});

  const handlerFavoriteArticle = (article: any) => {
    if (article.favorited) mutateUnFavorite({id: article.id});
    else mutateFavorite({id: article.id});
  };

  return <Box key={article.id}>
    <Paper
      mb={'lg'}
      pl={'sm'}
      radius={10}
      sx={(theme) => ({
        border: '2px solid ',
        boxShadow: theme.shadows.lg,
        borderColor:
          theme.colorScheme === 'dark' ? theme.colors.gray[8] : theme.colors.gray[2],
        position: 'relative',
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,
      })}
    >
      <Grid columns={24}>
        <Grid.Col lg={5} xl={5} md={7} sm={8} style={{position: 'relative'}}>
          <Image
            radius="md"
            mt={'sm'}
            mr={'sm'}
            height={185}
            src={articleImage(article)}
            caption={user?.name}
            style={{cursor: 'pointer'}}
            onClick={() => navigate(`/user/${article.user.id}`)}
            styles={(theme) => ({
              caption: {
                margin: 0,
                '&:hover': {
                  color: 'blue',
                  weight: '900px',
                },
              },
            })}
          />
        </Grid.Col>
        <Grid.Col lg={19} xl={19} md={17} sm={16} style={{position: 'relative'}}>
          {/*<Group spacing={0} style={{position: 'absolute', top: '10px', right: '13px'}}>*/}
          {/*    <Badge onClick={() => handlerFavoriteArticle(item)}*/}
          {/*           style={{cursor: 'pointer'}}*/}
          {/*           variant="light"*/}
          {/*           color="gray"*/}
          {/*           pl={7}*/}
          {/*           pr={7}*/}
          {/*           size="xl"*/}
          {/*           leftSection={*/}
          {/*               <ActionIcon size={20}*/}
          {/*                           style={{color: theme.colors.red[7]}}*/}
          {/*                           variant={"transparent"}*/}
          {/*               >*/}
          {/*                   <Heart size={20}*/}
          {/*                          fill={item.favoritedBy.length != 0*/}
          {/*                              ? theme.colors.red[5]*/}
          {/*                              : "none"*/}
          {/*                          }/>*/}
          {/*               </ActionIcon>*/}
          {/*           }>*/}
          {/*        <Group position={'center'}*/}
          {/*               style={{*/}
          {/*                   color: item.favoritedBy.length != 0*/}
          {/*                       ? theme.colors.gray[5]*/}
          {/*                       : theme.colors.red[5],*/}
          {/*                   width: '18px',*/}
          {/*                   height: '30px',*/}
          {/*                   textAlign: 'center',*/}
          {/*                   padding: 0,*/}
          {/*               }}*/}
          {/*        >*/}
          {/*            {item.favoritedBy ? item.favoritedBy.length : '0'}*/}
          {/*        </Group>*/}
          {/*    </Badge>*/}
          {/*</Group>*/}
          <div className={classes.body}>
            <Title
              order={2}
              onClick={() => navigate('/articles/' + article.id)}
              className={classes.title}
            >
              {article.title?.toUpperCase()}
            </Title>
            <Divider
              style={{width: '100%'}}
              my="xs"
              label={
                <>
                  <Flag size={12}/>
                  <Box ml={5}>Description:</Box>
                </>
              }
            />
            <Text weight={500} size="lg" mb={5} lineClamp={3}>
              {article.description}
            </Text>
            <Group spacing={0}>
              {article?.languages &&
                article?.languages.map((item: any) => (
                  <Badge
                    mb={10}
                    color={theme.colorScheme === 'dark' ? 'dark' : 'gray'}
                    mr={'md'}
                    key={item.name}
                    leftSection={
                      <ActionIcon size="xs" color="blue" radius="xl" variant="transparent">
                        <Language/>
                      </ActionIcon>
                    }
                  >
                    {item.name}
                  </Badge>
                ))}
            </Group>
            {article.destinations?.length != 0 &&
              <>
                <Divider
                  style={{width: '100%'}}
                  my="xs"
                  label={
                    <>
                      <Flag size={12}/>
                      <Box ml={5}>Countries:</Box>
                    </>
                  }
                />
                <Group mt={5} position={'left'}>
                  <Spoiler
                    style={{display: 'flex', flexDirection: 'column'}}
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
                            <ActionIcon
                              size="xs"
                              color="blue"
                              radius="xl"
                              variant="transparent"
                            >
                              <Image
                                mb={0}
                                style={{height: '12px'}}
                                src={`${import.meta.env.VITE_API_URL}uploads/flags/${i.code.toLowerCase()}.svg`}
                                alt={''}
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
            }
          </div>
        </Grid.Col>
      </Grid>
    </Paper>
  </Box>
});

export default ArticleCard;
