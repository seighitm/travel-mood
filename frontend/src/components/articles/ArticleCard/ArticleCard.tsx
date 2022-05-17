import React, {useRef} from 'react';
import {
  ActionIcon,
  Avatar,
  Badge,
  Card,
  createStyles,
  Group,
  Image,
  Menu,
  SimpleGrid,
  Spoiler,
  Text,
  Tooltip,
  UnstyledButton,
} from '@mantine/core';
import {Link, useNavigate} from 'react-router-dom';
import {useMutationFavoriteArticle, useMutationUnFavoriteArticle,} from '../../../api/articles/mutations';
import {articleImage, creteAuthorShortName, cutString, dateFormatedToIsoString, userPicture} from '../../common/Utils';
import {FacebookIcon, TwitterIcon} from "react-share";
import useStore from "../../../store/user.store";
import SocialSharButtons from "../../common/SocialShare/SocialSharButtons";
import {ArrowNarrowDown, ArrowNarrowUp, Share, Star} from "../../../assets/Icons";
import {isEmptyArray, isNullOrUndefined} from "../../../utils/primitive-checks";

const useStyles = createStyles((theme) => ({
  card: {
    boxShadow: theme.shadows.lg,
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
  },

  title: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
  },

  footer: {
    padding: `${theme.spacing.xs}px ${theme.spacing.lg}px`,
    marginTop: theme.spacing.md,
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
}));

export function ArticleCard({article, page}: any) {
  const {classes, theme} = useStyles();
  const navigate = useNavigate();
  const faceboocRef: any = useRef<any>();
  const twitterRef: any = useRef<any>();
  const {user} = useStore((state: any) => state);

  const {mutate: mutateFavorite, isLoading: isLoadingFavoriteHandler} = useMutationFavoriteArticle({page});
  const {mutate: mutateUnFavorite, isLoading: isLoadingUnFavoriteHandler} = useMutationUnFavoriteArticle({page});

  const handlerFavoriteArticle = () => {
    if (article.favorited) {
      mutateUnFavorite({id: article.id});
    } else {
      mutateFavorite({id: article.id});
    }
  };

  console.log(article)

  return (
    <Card
      withBorder
      p="lg"
      radius="md"
      className={classes.card}
    >
      <Card.Section style={{position: 'relative'}}>
        <Image
          src={articleImage(article)}
          withPlaceholder={!!article?.picture}
          alt={'Article image'}
          height={180}
        />
        {article.isUpdatedByAdmin &&
          <Badge color={'pink'} variant={'outline'} style={{position: 'absolute', top: 10, right: 10}}>
            Edited by admin
          </Badge>
        }
      </Card.Section>

      <Card.Section className={classes.header}>
        {!isNullOrUndefined(article) && !isEmptyArray(article?.tagList) &&
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
        }
      </Card.Section>

      <Text
        weight={700}
        className={classes.title}
        mt="xs"
        component={Link}
        to={`/article/${article.id}`}
      >
        {article.title}
      </Text>

      <Text
        size="sm"
        lineClamp={3}
        variant="gradient"
        weight={500}
        gradient={{from: 'indigo', to: 'teal', deg: 45}}
      >
        {article.description}
      </Text>

      <Group
        mt="lg"
        position={'apart'}
      >
        <Group>
          <UnstyledButton onClick={() => navigate(`/user/${article.author.id}`)}>
            <Avatar src={userPicture(article?.author)}>
              {creteAuthorShortName(`${article?.author?.lastName} ${article?.author?.firstName}`)}
            </Avatar>
          </UnstyledButton>
          <div>
            <UnstyledButton onClick={() => navigate(`/user/${article.author.id}`)}>
              <Text weight={500}>
                {cutString(`${article?.author?.lastName} ${article?.author?.firstName}`, 15)}
              </Text>
            </UnstyledButton>
            <Text size="xs" color="dimmed">
              posted {dateFormatedToIsoString(article.createdAt)}
            </Text>
          </div>
        </Group>

        <Group
          position={'left'}
          spacing={2}
        >
          <SimpleGrid
            spacing={2}
            cols={6}
          >
            {!isNullOrUndefined(article) && !isEmptyArray(article?.countries) &&
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
                      src={`${import.meta.env.VITE_API_URL}uploads/flags/${destination.code.toLowerCase()}.svg`}
                      alt={''}
                    />
                  </ActionIcon>
                </Tooltip>
              ))}
          </SimpleGrid>
        </Group>
      </Group>

      <Card.Section className={classes.footer}>
        <Group position="right">
          {article?.favoritedBy?.length != 0 &&
            <Text size="xs" color="dimmed">
              {article?.favoritedBy?.length} people liked this post
            </Text>
          }
          <Group spacing={0}>
            {!isNullOrUndefined(user) &&
              <ActionIcon
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
            }
            <Menu size={'sm'}
                  control={
                    <ActionIcon>
                      <Share size={17} color={theme.colors.blue[6]}/>
                    </ActionIcon>
                  }
            >
              <Menu.Item onClick={() => faceboocRef.current.click()}
                         icon={<FacebookIcon size={14}/>}
              >
                facebooc
              </Menu.Item>
              <Menu.Item onClick={() => twitterRef.current.click()}
                         icon={<TwitterIcon size={14}/>}
              >
                twitter
              </Menu.Item>
            </Menu>
          </Group>
          <SocialSharButtons
            faceboocRef={faceboocRef}
            twitterRef={twitterRef}
          />
        </Group>
      </Card.Section>
    </Card>
  );
}


/*
  const {mutate: mutateDeleteArticle} = useMutationDeleteArticle({
    articlesCount: articlesCountOnPage,
    setActivePage: setActivePage,
    page: page,
  });
 */
