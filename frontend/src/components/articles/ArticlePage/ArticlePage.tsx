import React, {useState} from 'react';
import {Link, useNavigate, useParams} from 'react-router-dom';
import {
  ActionIcon,
  Avatar,
  Badge,
  Box,
  Button,
  Collapse,
  Divider,
  Grid,
  Group,
  Image,
  Menu,
  Modal,
  Space,
  Spoiler,
  Text,
  Tooltip,
  TypographyStylesProvider,
  UnstyledButton,
  useMantineTheme,
} from '@mantine/core';

import {ArrowDownIcon, ArrowUpIcon} from '@modulz/radix-icons';
import useStore from '../../../store/user.store';
import {CustomLoader} from '../../common/CustomLoader';
import {CommentBox} from '../../common/comment/CommentBox';
import {EditCommentBox} from '../../common/comment/EditCommentBox';
import {articleImage, creteAuthorShortName, dateFormatedToIsoString, userPicture} from "../../common/Utils";
import CustomPaper from "../../common/CustomPaper";
import {useQueryClient} from "react-query";
import {useOneArticleQuery} from "../../../api/articles/queries";
import {
  useMutationAddCommentToArticle,
  useMutationDeleteArticle,
  useMutationFavoriteArticle,
  useMutationRemoveCommentFromArticle,
  useMutationUnFavoriteArticle
} from "../../../api/articles/mutations";
import {ArrowNarrowDown, ArrowNarrowUp, Pencil, Star, Trash} from "../../../assets/Icons";
import {isEmptyArray, isNullOrUndefined} from "../../../utils/primitive-checks";
import {getFullUserName} from "../../../utils/utils-func";
import {ROLE} from "../../../types/enums";

function ArticlePage() {
  const {id} = useParams();
  const {user} = useStore((state: any) => state);
  const queryClient = useQueryClient();

  const navigate = useNavigate();
  const theme = useMantineTheme();

  const [openedModal, setOpenedModal] = useState(false);
  const [selectModalImage, setSelectedModalImage] = useState('');
  const [openedImagesCollapse, setOpenedImagesCollapse] = useState<boolean>(false);

  const onErrorEvent = () => {
    if (user.role == ROLE.USER) {
      navigate('/articles')
    } else {
      navigate('/admin/articles')
    }
  }

  const {data: dbArticle, isFetching: isFetchingDbArticle} = useOneArticleQuery({id: id, onErrorEvent});

  const {mutate: mutateRemoveComment} = useMutationRemoveCommentFromArticle();
  const {mutate: mutateDeleteArticle} = useMutationDeleteArticle({});
  const {mutate: mutateAddComment, isLoading: isLoadingAddComment} = useMutationAddCommentToArticle();
  const {mutate: mutateFavorite} = useMutationFavoriteArticle({});
  const {mutate: mutateUnFavorite} = useMutationUnFavoriteArticle({});

  const handlerFavoriteArticle = () => {
    if (dbArticle?.favorited) {
      mutateUnFavorite({id: dbArticle?.id});
    } else {
      mutateFavorite({id: dbArticle?.id});
    }
  };

  const handlerDeleteArticle = () => {
    mutateDeleteArticle(id);
  };

  if (!queryClient.getQueryData(['articles', 'one']) && isFetchingDbArticle) {
    return <CustomLoader/>;
  }

  return <>
    <TypographyStylesProvider>
      <Box style={{position: 'relative'}}>
        <Text
          align={'center'}
          weight={'bold'}
          mb={'xs'}
          m={0}
          style={{fontSize: '40px'}}
          variant="gradient"
          gradient={{from: 'indigo', to: 'orange', deg: 15}}
        >
          {dbArticle?.title}
        </Text>
        <Spoiler
          maxHeight={25}
          style={{display: 'flex', flexDirection: 'column'}}
          showLabel={<ArrowNarrowDown size={17}/>}
          hideLabel={<ArrowNarrowUp size={17}/>}
        >
          <Group style={{width: '100%'}} position={'center'}>
            {!isNullOrUndefined(dbArticle) && !isEmptyArray(dbArticle?.countries) &&
              dbArticle.countries?.map((destination: any) => (
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
          </Group>
        </Spoiler>
        <Divider style={{width: '100%'}}/>
        <Group
          position={'apart'}
          mb={'sm'}
          mt={'sm'}
        >
          <Group noWrap>
            <UnstyledButton>
              <Avatar
                onClick={() => navigate(`/user/${dbArticle?.author.id}`)}
                size={30}
                src={userPicture(dbArticle?.author)}
                radius="xl"
              >
                {creteAuthorShortName(getFullUserName(dbArticle?.author))}
              </Avatar>
            </UnstyledButton>
            <div>
              <Text
                size="md"
                weight={700}
                sx={{textTransform: 'uppercase'}}
              >
                {getFullUserName(dbArticle?.author)}
              </Text>
              <Text size="xs" color="dimmed">
                {dateFormatedToIsoString(dbArticle?.updatedAt)}
              </Text>
            </div>
          </Group>
          <Group spacing="xs">
            <Text size="xs" color="dimmed">
              {dbArticle?.favoritesCount} people liked this post
            </Text>
            {!isNullOrUndefined(user) &&
              <ActionIcon onClick={handlerFavoriteArticle}>
                <Star
                  size={17}
                  color={theme.colors.red[6]}
                  fill={dbArticle?.favorited ? theme.colors.red[6] : 'none'}
                />
              </ActionIcon>
            }
            {(user?.id === dbArticle?.author.id || user?.role == 'ADMIN') &&
              <Menu>
                <Menu.Item
                  color={'green'}
                  component={Link}
                  to={user.role == 'ADMIN' ? `/admin/article/edit/${id}` : `/article/edit/${id}`}
                  icon={<Pencil size={17}/>}
                >
                  Edit
                </Menu.Item>
                <Menu.Item
                  color={'red'}
                  onClick={handlerDeleteArticle}
                  icon={<Trash size={17}/>}
                >
                  Delete
                </Menu.Item>
              </Menu>
            }
          </Group>
        </Group>
        <Divider mb={10} style={{width: '100%'}}/>
      </Box>
      <Image
        radius="md"
        src={articleImage(dbArticle)}
        height={250}
        width={'100%'}
        withPlaceholder
      />
      <Box mb={10}>
        {dbArticle?.tagList.map((tag: any) => (
          <Badge
            key={tag}
            color="pink"
            variant="light"
            mr={'md'}
            leftSection={'#'}
          >
            {tag}
          </Badge>
        ))}
      </Box>
      <CustomPaper>
        <div className={'editor'} dangerouslySetInnerHTML={{__html: dbArticle?.body}}/>
      </CustomPaper>
    </TypographyStylesProvider>
    <Box>
      {!isNullOrUndefined(dbArticle) && !isEmptyArray(dbArticle?.images) &&
        <Group mb={20} position={'center'}>
          <Button
            variant="subtle"
            radius="xl"
            compact
            color="gray"
            uppercase
            leftIcon={openedImagesCollapse ? <ArrowUpIcon/> : <ArrowDownIcon/>}
            onClick={() => setOpenedImagesCollapse((o) => !o)}
          >
            Show images [{dbArticle?.images?.length}]
          </Button>
        </Group>
      }
      <Collapse in={openedImagesCollapse} mt={'lg'}>
        <Grid mt={'xs'} mb={'lg'} gutter="xs">
          {!isNullOrUndefined(dbArticle) && !isEmptyArray(dbArticle?.images) &&
            dbArticle.images.map((file: any, index: any) => (
              <Grid.Col xl={3} lg={4} md={4} sm={4} xs={12} key={file.name + '' + index}>
                <Image
                  radius="md"
                  height={80}
                  sx={{cursor: 'pointer'}}
                  alt={`file preview ${index}`}
                  src={`${import.meta.env.VITE_STORE_AWS}` + file.name}
                  onClick={() => {
                    setSelectedModalImage(`${import.meta.env.VITE_STORE_AWS}` + file.name);
                    setOpenedModal(true);
                  }}
                />
              </Grid.Col>
            ))}
        </Grid>
      </Collapse>
      <Modal
        centered
        withCloseButton={false}
        opened={openedModal}
        size="md"
        onClose={() => setOpenedModal(false)}
      >
        <Image radius="md" src={selectModalImage}/>
      </Modal>
      <Space h={'lg'}/>
    </Box>
    {!isNullOrUndefined(user) &&
      <>
        <Divider mb={'xs'} style={{width: '100%'}} label={'Comments:'}/>
        <EditCommentBox
          id={dbArticle.id}
          mutateCreateComment={mutateAddComment}
          isLoading={isLoadingAddComment}
        />
      </>
    }
    {!isNullOrUndefined(dbArticle) && !isEmptyArray(dbArticle?.comments) &&
      dbArticle?.comments.map((item: any) => (
        <CommentBox
          key={item.id}
          body={item.body}
          author={item.author}
          commentId={item.id}
          mutateRemoveComment={mutateRemoveComment}
          postedAt={new Date(item.createdAt).toISOString().split('T')[0]}
        />
      ))
    }
  </>
}

export default ArticlePage;
