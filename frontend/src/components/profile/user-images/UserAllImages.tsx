import React, {useEffect, useRef, useState} from 'react';
import {ActionIcon, Avatar, Button, Grid, Group, Image, Menu, Paper} from '@mantine/core';
import useStore from '../../../store/user.store';
import {CustomLoader} from '../../common/CustomLoader';
import {useMutateUserProfileUpdateImages} from '../../../api/users/mutations';
import {useGetUserById} from '../../../api/users/queries';
import {Cross2Icon, DotsHorizontalIcon, DrawingPinIcon} from '@modulz/radix-icons';
import {useParams} from 'react-router-dom';
import ConfirmationModal from './modals/ConfirmationModal';
import ViewImageModal from './modals/ViewImageModal';
import AddNewImagesModal from './modals/AddNewImagesModal';
import {creteAuthorShortName, userPicture} from '../../common/Utils';

function UpdateProfile() {
  const openRef: any = useRef<HTMLDivElement | null>();
  const {id} = useParams();
  const {user} = useStore((state: any) => state);
  const {data, isFetching} = useGetUserById({id: id, isEnabled: true});
  // const { mutate: mutateUpdate, isSuccess } = useMutateUserProfileUpdate();
  const {mutate: mutateUpdateUserImages, isSuccess} = useMutateUserProfileUpdateImages();

  const [file, setFile] = useState<any>(null);
  const [newImages, setNewImages] = useState<any>([]);
  const [oldImages, setOldImages] = useState<any>([]);
  const [selectedViewImage, setSelectedViewImage] = useState<any>(null);

  const [openedModal, setOpenedModal] = useState(false);
  const [openedModalViewImage, setOpenedModalViewImage] = useState(false);
  const [openedConfirmationModal, setOpenedConfirmationModal] = useState(false);

  const handlerInitImages = () => {
    setOldImages(data?.images);
    setFile(data?.picture);
    setNewImages([]);
  };

  useEffect(() => {
    setOpenedModal(false);
    setNewImages([]);
  }, [isSuccess]);


  const handlerSubmitProfileInfo = () => {
    const formData = new FormData();

    const allOldImages = oldImages.filter((item: any) => item.image != selectedViewImage);
    // console.log(oldImages)
    // console.log(data.images)
    if (allOldImages && allOldImages.length != 0)
      for (let i = 0; i < allOldImages.length; i++) {
        formData.append('oldImages[]', allOldImages[i].image);
      }
    //
    // let imageStatus: string = '';
    //
    // if (file == null || file == selectedViewImage) {
    //   imageStatus += 'REMOVE';
    // } else if (typeof file == 'number' && (Number(file) >= 0 && Number(file) <= 100)) {
    //   imageStatus += 'UPDATE';
    // } else if (typeof file == 'string' && file.split('.').length >= 2) {
    //   imageStatus += 'STAYS';
    // }
    // if (typeof file == 'string')
    //   formData.append('profileImage', file);
    // else
    formData.append('profileImage', file?.image ?? file);
    // if (file == null || file == selectedViewImage) {
    // }
    //   formData.append('isUserUpdateImages', 'true');

    if (newImages && newImages.length != 0) {
      for (let i = 0; i < newImages.length; i++)
        formData.append('images[]', newImages[i]);
    }
    mutateUpdateUserImages(formData);
  };

  useEffect(() => {
    if (data)
      handlerInitImages();
  }, [data]);

  if (isFetching)
    return <CustomLoader/>;

  return (
    <>
      <ConfirmationModal openedConfirmationModal={openedConfirmationModal}
                         setOpenedConfirmationModal={setOpenedConfirmationModal}
                         handlerSubmit={handlerSubmitProfileInfo}
      />
      <ViewImageModal openedModalViewImage={openedModalViewImage}
                      setOpenedModalViewImage={setOpenedModalViewImage}
                      selectedViewImage={selectedViewImage}
      />
      <AddNewImagesModal openedModal={openedModal}
                         setOpenedModal={setOpenedModal}
                         newImages={newImages}
                         setNewImages={setNewImages}
                         handlerInitImages={handlerInitImages}
                         handlerSubmitProfileInfo={handlerSubmitProfileInfo}/>
      <Group position={'center'}>
        <Group align={'flex-end'}
               direction={'column'}
               style={{position: 'relative'}}
        >
          {data && (data?.picture != 'null' && data?.picture != null) &&
            <ActionIcon
              style={{position: 'absolute', zIndex: '1', left: '36%', bottom: '-10px'}}
              color='red'
              size='sm'
              radius='xl'
              variant='filled'
              onClick={() => {
                setFile(null);
                setOpenedConfirmationModal(true);
              }}
            >
              <Cross2Icon/>
            </ActionIcon>
          }
          <Avatar
            color={'blue'}
            size='xl'
            radius='xl'
            style={{borderRadius: '50%'}}
            src={userPicture(data)}
          >
            {creteAuthorShortName(data.name)}
          </Avatar>
        </Group>
      </Group>

      <Group position={'center'} my={'xl'}>
        <Button variant={'outline'} onClick={() => {
          setOpenedModal(true);
        }}
        >
          Add new images
        </Button>
      </Group>

      {data && oldImages.length != 0 &&
        <Paper
          radius={10}
          p={'lg'}
          mb={'xl'}
          shadow={'lg'}
          sx={(theme) => ({
            border: '2px solid ',
            borderColor: theme.colorScheme === 'dark' ? theme.colors.gray[8] : theme.colors.gray[2],
            position: 'relative',
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
          })}
        >
          <Grid>
            {oldImages.map((image: any, index: number) => (
              <Grid.Col key={image.image + '' + image.id}
                        sm={6} md={4} lg={3} xl={3}
                        style={{position: 'relative'}}
              >
                <Image
                  style={{cursor: 'pointer'}}
                  onClick={() => {
                    setSelectedViewImage(image.image);
                    setOpenedModalViewImage(true);
                  }}
                  radius='md'
                  height={150}
                  src={`${import.meta.env.VITE_STORE_AWS}${image.image}`}
                />

                <Menu size='sm'
                      placement='end'
                      control={
                        <ActionIcon color='blue' variant={'light'}>
                          <DotsHorizontalIcon style={{width: '20px', height: '20px'}}/>
                        </ActionIcon>
                      }
                      styles={() => ({
                        root: {position: 'absolute', top: '15px', right: '15px'},
                      })}
                >
                  <Menu.Item color={'blue'}
                             icon={<DrawingPinIcon/>}
                             onClick={() => {
                               setFile(image.image);
                               setOpenedConfirmationModal(true);
                             }}
                  >
                    Set as profile
                  </Menu.Item>
                  <Menu.Item color={'red'}
                             icon={<Cross2Icon/>}
                             onClick={() => {
                               setSelectedViewImage(image.image);
                               setOpenedConfirmationModal(true);
                             }}
                  >
                    Delete
                  </Menu.Item>
                </Menu>
              </Grid.Col>
            ))}
          </Grid>
        </Paper>
      }
    </>
  );
}

export default UpdateProfile;

