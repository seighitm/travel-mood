import React, {Dispatch} from 'react';
import DropzoneProfileSettings from '../../../settings/DropzoneProfileSettings';
import {ActionIcon, Button, Grid, Group, Image, Modal} from '@mantine/core';
import {X} from '../../../common/Icons';

interface AddNewImagesModalComponentProps {
  openedModal: boolean;
  setOpenedModal: Dispatch<React.SetStateAction<any>>;
  newImages: File[];
  setNewImages: Dispatch<React.SetStateAction<any>>;
  handlerInitImages: () => void;
  handlerSubmitProfileInfo: () => void;
  isLoading?: any
}

function AddNewImagesModal({
                             openedModal,
                             setOpenedModal,
                             newImages,
                             setNewImages,
                             handlerInitImages,
                             handlerSubmitProfileInfo,
                             isLoading
                           }: AddNewImagesModalComponentProps) {
  const handlerRemoveNewImage = (name: string) => {
    setNewImages(newImages.filter((item: any) => item.name != name));
  };

  const handlerClear = () => {
    handlerInitImages();
    setOpenedModal(false);
  };

  const handlerSubmit = () => {
    if (newImages.length != 0) handlerSubmitProfileInfo();
    else handlerClear();
  };

  return (
    <Modal
      opened={openedModal}
      onClose={() => setOpenedModal(false)}
      centered
      size={'xl'}
      withCloseButton={false}
    >
      <DropzoneProfileSettings files={newImages} setFiles={setNewImages}/>
      <Grid mb={'md'}>
        {newImages &&
          newImages.map((image: any, index: number) => (
            <Grid.Col
              key={image.filename + '' + index}
              sm={6}
              md={4}
              lg={3}
              xl={3}
              style={{position: 'relative'}}
            >
              <Image
                radius="md"
                height={150}
                alt={`file preview ${index}`}
                src={URL.createObjectURL(image)}
              />
              <ActionIcon
                color={'red'}
                radius={50}
                size={20}
                onClick={() => handlerRemoveNewImage(image.name)}
                style={{position: 'absolute', bottom: '15px', left: '45%'}}
                variant={'filled'}
              >
                <X size={15}/>
              </ActionIcon>
            </Grid.Col>
          ))}
      </Grid>
      <Group position={'right'}>
        <Button onClick={handlerSubmit} loading={isLoading}>Save</Button>
        <Button loading={isLoading} color={'red'} onClick={handlerClear}>
          Close
        </Button>
      </Group>
    </Modal>
  );
}

export default AddNewImagesModal;
