import React, { useEffect, useState } from 'react';
import {
  ActionIcon,
  Avatar,
  Button,
  Grid,
  Group,
  Image,
  Menu,
  Modal,
  Paper,
  Textarea,
} from '@mantine/core';
import { CustomLoader } from '../../common/CustomLoader';
import {
  useMutateAddImageCaption,
  useMutateUserProfileUpdateImages,
} from '../../../api/users/mutations';
import { useGetUserById } from '../../../api/users/queries';
import { useParams } from 'react-router-dom';
import ConfirmationModal from '../../common/ConfirmationModal';
import ViewImageModal from './modals/ViewImageModal';
import AddNewImagesModal from './modals/AddNewImagesModal';
import { Dots, Pencil, Pin, X } from '../../common/Icons';
import { creteAuthorShortName, userPicture } from '../../../utils/utils-func';

function UpdateProfile() {
  const { id } = useParams();

  const [file, setFile] = useState<any>(null);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [oldImages, setOldImages] = useState<{ image: string }[]>([]);
  const [selectedViewImage, setSelectedViewImage] = useState<any>(null);
  const [openedModal, setOpenedModal] = useState(false);
  const [openedModalViewImage, setOpenedModalViewImage] = useState(false);
  const [openedConfirmationModal, setOpenedConfirmationModal] = useState(false);
  const [openedCaptionModal, setOpenedCaptionModal] = useState(false);
  const [caption, setCaption] = useState('');

  const { data, isFetching } = useGetUserById({ id: id, isEnabled: true });
  const { mutate: mutateUpdateUserImages, isSuccess, isLoading } = useMutateUserProfileUpdateImages();

  const { mutate: mutateAddImageCaption } = useMutateAddImageCaption(() => {
    setCaption('');
    setOpenedCaptionModal(false);
  });

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
    if (allOldImages && allOldImages.length != 0)
      for (let i = 0; i < allOldImages.length; i++) {
        formData.append('oldImages[]', allOldImages[i].image);
      }

    formData.append('profileImage', file?.image ?? file);

    if (newImages && newImages.length != 0) {
      for (let i = 0; i < newImages.length; i++) formData.append('images[]', newImages[i]);
    }
    mutateUpdateUserImages(formData);
  };

  useEffect(() => {
    if (data) {
      handlerInitImages();
    }
  }, [data]);

  if (isFetching) return <CustomLoader />;

  return (
    <>
      <ConfirmationModal
        openedConfirmationModal={openedConfirmationModal}
        setOpenedConfirmationModal={setOpenedConfirmationModal}
        handlerSubmit={handlerSubmitProfileInfo}
      />
      <ViewImageModal
        openedModalViewImage={openedModalViewImage}
        setOpenedModalViewImage={setOpenedModalViewImage}
        selectedViewImage={selectedViewImage}
      />
      <AddNewImagesModal
        isLoading={isLoading}
        openedModal={openedModal}
        setOpenedModal={setOpenedModal}
        newImages={newImages}
        setNewImages={setNewImages}
        handlerInitImages={handlerInitImages}
        handlerSubmitProfileInfo={handlerSubmitProfileInfo}
      />
      <Modal
        opened={openedCaptionModal}
        onClose={() => setOpenedCaptionModal(false)}
        centered
        withCloseButton={false}
      >
        <Textarea
          mb={'sm'}
          value={caption}
          onChange={({ currentTarget }: any) => setCaption(currentTarget.value)}
          placeholder="Description"
        />
        <Button
          fullWidth
          onClick={() => {
            mutateAddImageCaption({ caption, imageId: selectedViewImage?.id });
          }}
        >
          Save
        </Button>
      </Modal>

      <Group position={'center'}>
        <Group align={'flex-end'} direction={'column'} style={{ position: 'relative' }}>
          {data && data?.picture != 'null' && data?.picture != null && (
            <ActionIcon
              style={{ position: 'absolute', zIndex: '1', left: '36%', bottom: '-10px' }}
              color="red"
              size="sm"
              radius="xl"
              variant="filled"
              onClick={() => {
                setFile(null);
                setOpenedConfirmationModal(true);
              }}
            >
              <X size={15} />
            </ActionIcon>
          )}
          <Avatar
            color={'blue'}
            size="xl"
            radius="xl"
            src={userPicture(data)}
          >
            {creteAuthorShortName(data.name)}
          </Avatar>
        </Group>
      </Group>

      <Group position={'center'} my={'xl'}>
        <Button
          variant={'outline'}
          onClick={() => {
            setOpenedModal(true);
          }}
        >
          Add new images
        </Button>
      </Group>

      {data && oldImages.length != 0 && (
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
              <Grid.Col
                key={image.image + '' + image.id}
                sm={6}
                md={4}
                lg={3}
                xl={3}
                style={{ position: 'relative' }}
              >
                <Image
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    setSelectedViewImage(image);
                    setOpenedModalViewImage(true);
                  }}
                  radius="md"
                  height={150}
                  src={`${import.meta.env.VITE_STORE_AWS}${image.image}`}
                />

                <Menu
                  size="sm"
                  placement="end"
                  control={
                    <ActionIcon color="blue" variant={'light'}>
                      <Dots size={20} />
                    </ActionIcon>
                  }
                  styles={() => ({
                    root: { position: 'absolute', top: '15px', right: '15px' },
                  })}
                >
                  <Menu.Item
                    color={'blue'}
                    icon={<Pin size={15} />}
                    onClick={() => {
                      setFile(image.image);
                      setOpenedConfirmationModal(true);
                    }}
                  >
                    Set as profile
                  </Menu.Item>
                  <Menu.Item
                    color={'green'}
                    icon={<Pencil size={15} />}
                    onClick={() => {
                      setCaption(image?.caption);
                      setSelectedViewImage(image);
                      setOpenedCaptionModal(true);
                    }}
                  >
                    Add comment
                  </Menu.Item>
                  <Menu.Item
                    color={'red'}
                    icon={<X size={15} />}
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
      )}
    </>
  );
}

export default UpdateProfile;
