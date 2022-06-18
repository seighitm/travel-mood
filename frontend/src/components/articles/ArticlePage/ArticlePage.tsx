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
} from '@mantine/core';
import useStore from '../../../store/user.store';
import {CustomLoader} from '../../common/CustomLoader';
import {CommentBox} from '../../common/comment/CommentBox';
import {EditCommentBox} from '../../common/comment/EditCommentBox';
import CustomPaper from '../../common/CustomPaper';
import {useQueryClient} from 'react-query';
import {useOneArticleQuery} from '../../../api/articles/queries';
import {
  useMutationDeleteArticle,
  useMutationFavoriteArticle,
  useMutationUnFavoriteArticle,
} from '../../../api/articles/mutations';
import {ArrowDown, ArrowUp, Dots, Pencil, Trash} from '../../common/Icons';
import {isEmptyArray, isNullOrUndefined} from '../../../utils/primitive-checks';
import {
  articleImage,
  customNavigation,
  dateFormattedToIsoString,
  getFullUserName,
  userPicture,
} from '../../../utils/utils-func';
import {ROLE} from '../../../types/enums';
import ConfirmationModal from '../../common/ConfirmationModal';
import PostFavoriteBy from '../../common/PostFavoriteBy';
import {MD_ICON_SIZE, XL_ICON_SIZE} from '../../../utils/constants';
import FavoriteStarButton from '../../common/FavoriteStarButton';

function ArticlePage() {
  const {id} = useParams();
  const {user} = useStore((state: any) => state);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [openedModal, setOpenedModal] = useState(false);
  const [selectModalImage, setSelectedModalImage] = useState('');
  const [openedImagesCollapse, setOpenedImagesCollapse] = useState<boolean>(false);

  const {data: dbArticle, isFetching: isFetchingDbArticle} = useOneArticleQuery({id: id});
  const {mutate: mutateDeleteArticle} = useMutationDeleteArticle({});
  const {mutate: mutateFavorite, isLoading: isLoadingFF} = useMutationFavoriteArticle({});
  const {mutate: mutateUnFavorite, isLoading: isLoadingUF} = useMutationUnFavoriteArticle({});
  const [isOpenedDeleteTripConfirmationModal, setOpenedDeleteTripConfirmationModal] = useState(false);

  const handlerFavoriteArticle = () => {
    if (dbArticle?.favorited) {
      mutateUnFavorite({id: dbArticle?.id});
    } else {
      mutateFavorite({id: dbArticle?.id});
    }
  };

  if (!queryClient.getQueryData(['articles', 'one']) && isFetchingDbArticle) {
    return <CustomLoader/>;
  }

  return (
    <>
      <ConfirmationModal
        openedConfirmationModal={isOpenedDeleteTripConfirmationModal}
        setOpenedConfirmationModal={setOpenedDeleteTripConfirmationModal}
        handlerSubmit={() => mutateDeleteArticle(id)}
      />
      <Modal
        centered
        withCloseButton={false}
        opened={openedModal}
        size="lg"
        onClose={() => setOpenedModal(false)}
      >
        <Image radius="md" src={selectModalImage}/>
      </Modal>
      <TypographyStylesProvider>
        <Box style={{position: 'relative'}}>
          <Text
            align={'center'}
            weight={'bold'}
            m={0}
            mb={'xs'}
            style={{fontSize: '35px'}}
            variant="gradient"
            gradient={{from: 'indigo', to: 'orange', deg: 15}}
          >
            {dbArticle?.title}
          </Text>
          <Spoiler
            maxHeight={25}
            style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}
            showLabel={
              <ActionIcon variant={'light'} radius={'xl'}>
                <ArrowDown size={MD_ICON_SIZE}/>
              </ActionIcon>
            }
            hideLabel={
              <ActionIcon variant={'light'} radius={'xl'}>
                <ArrowUp size={MD_ICON_SIZE}/>
              </ActionIcon>
            }
          >
            <Group style={{width: '100%'}} position={'center'}>
              {!isNullOrUndefined(dbArticle) &&
                !isEmptyArray(dbArticle?.countries) &&
                dbArticle.countries?.map((destination: any) => (
                  <Tooltip
                    key={destination.name}
                    position="bottom"
                    placement="center"
                    label={destination.name}
                    withArrow
                  >
                    <ActionIcon size="xs" color="blue" radius="xl" variant="transparent">
                      <Image
                        mb={0}
                        style={{height: '12px'}}
                        src={`${
                          import.meta.env.VITE_API_URL
                        }uploads/flags/${destination.code.toLowerCase()}.svg`}
                        alt={''}
                      />
                    </ActionIcon>
                  </Tooltip>
                ))}
            </Group>
          </Spoiler>
          <Divider style={{width: '100%'}}/>
          <Group position={'apart'} mb={'sm'} mt={'sm'}>
            <Group noWrap>
              <UnstyledButton>
                <Avatar
                  onClick={() =>
                    customNavigation(user?.role, navigate, `/users/${dbArticle?.author.id}`)
                  }
                  size={35}
                  src={userPicture(dbArticle?.author)}
                  radius="xl"
                />
              </UnstyledButton>
              <div>
                <Text
                  size="md"
                  weight={700}
                  onClick={() =>
                    customNavigation(user?.role, navigate, `/users/${dbArticle?.author.id}`)
                  }
                  sx={{textTransform: 'uppercase', cursor: 'pointer'}}
                >
                  {getFullUserName(dbArticle?.author)}
                </Text>
                <Text size="xs" color="dimmed">
                  {dateFormattedToIsoString(dbArticle?.updatedAt)}
                </Text>
              </div>
            </Group>
            <Group spacing="xs">
              {!isNullOrUndefined(dbArticle) && !isEmptyArray(dbArticle?.favoritedBy) && (
                <PostFavoriteBy favoriteList={dbArticle?.favoritedBy}/>
              )}

              <FavoriteStarButton
                isLoadingUF={isLoadingUF}
                isLoadingFF={isLoadingFF}
                isFavorite={dbArticle?.favorited}
                favoriteByList={dbArticle?.favoritedBy}
                handlerFavoriteArticle={handlerFavoriteArticle}
              />

              {(user?.id === dbArticle?.author.id ||
                [ROLE.ADMIN, ROLE.MODERATOR].includes(user?.role)) && (
                <Menu
                  size={'xs'}
                  control={
                    <ActionIcon
                      size={25}
                      variant={'light'}
                      radius={'xl'}
                      color={'blue'}
                    >
                      <Dots size={XL_ICON_SIZE}/>
                    </ActionIcon>
                  }
                >
                  <Menu.Item
                    color={'green'}
                    component={Link}
                    to={
                      user.role == ROLE.ADMIN
                        ? `/admin/articles/${id}/edit/`
                        : `/articles/${id}/edit`
                    }
                    icon={<Pencil size={17}/>}
                  >
                    Edit
                  </Menu.Item>
                  <Menu.Item
                    color={'red'}
                    onClick={() => setOpenedDeleteTripConfirmationModal(true)}
                    icon={<Trash size={17}/>}
                  >
                    Delete
                  </Menu.Item>
                </Menu>
              )}
            </Group>
          </Group>
          <Divider mb={10} style={{width: '100%'}}/>
        </Box>
        <Image
          radius="md"
          src={articleImage(dbArticle)}
          height={200}
          width={'100%'}
          withPlaceholder
        />
        <Box mb={10}>
          {dbArticle?.tagList.map((tag: any) => (
            <Badge key={tag} color="pink" variant="light" mr={'md'}>
              {tag}
            </Badge>
          ))}
        </Box>
        <CustomPaper>
          <Space h={'xs'}/>
          <div className={'editor'} dangerouslySetInnerHTML={{__html: dbArticle?.body}}/>
        </CustomPaper>
      </TypographyStylesProvider>
      <Box>
        {!isNullOrUndefined(dbArticle) && !isEmptyArray(dbArticle?.images) && (
          <Group mb={20} position={'center'}>
            <Button
              variant="subtle"
              radius="xl"
              compact
              color="gray"
              uppercase
              leftIcon={openedImagesCollapse ? <ArrowUp/> : <ArrowDown/>}
              onClick={() => setOpenedImagesCollapse((o) => !o)}
            >
              Show images ({dbArticle?.images?.length})
            </Button>
          </Group>
        )}
        <Collapse mb={'lg'} in={openedImagesCollapse} mt={'lg'}>
          <Grid mt={'xs'} mb={'lg'} gutter="xs">
            {!isNullOrUndefined(dbArticle) &&
              !isEmptyArray(dbArticle?.images) &&
              dbArticle.images.map((file: any, index: any) => (
                <Grid.Col xl={3} lg={4} md={4} sm={4} xs={12} key={file.name + '' + index}>
                  <Image
                    radius="md"
                    height={100}
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
      </Box>
      {!isNullOrUndefined(user) && (
        <>
          <Divider
            color={'blue'}
            mb={'xs'}
            style={{width: '100%'}}
            label={
              <Group>
                <Pencil size={15}/>
                <Text size={'sm'} weight={500} color={'blue'}>
                  Comments:
                </Text>
              </Group>
            }
          />
          <EditCommentBox id={dbArticle.id} postType={'articles'}/>
        </>
      )}

      {!isNullOrUndefined(dbArticle) &&
        !isEmptyArray(dbArticle?.comments) &&
        dbArticle?.comments.map((item: any) => (
          <CommentBox
            postType={'articles'}
            key={item.id}
            body={item.comment}
            author={item.user}
            commentId={item.id}
            updatedAt={item.updatedAt}
            postedAt={item.createdAt}
          />
        ))}
    </>
  );
}

export default ArticlePage;
