import React from 'react';
import DropzoneProfileSettings from '../../settings/DropzoneProfileSettings';
import { ActionIcon, Button, Grid, Group, Image, Modal } from '@mantine/core';
import { Cross2Icon } from '@modulz/radix-icons';

function AddNewImagesModal({
                             openedModal,
                             setOpenedModal,
                             newImages,
                             setNewImages,
                             handlerInitImages,
                             handlerSubmitProfileInfo,
                           }: any) {
  const handlerRemoveNewImage = (name: string) => {
    setNewImages(newImages.filter((item: any) => item.name != name));
  };

  const handlerClear = () => {
    handlerInitImages();
    setOpenedModal(false);
  };

  const handlerSubmit = () => {
    if (newImages.length != 0)
      handlerSubmitProfileInfo();
    else
      handlerClear();
  };

  return (
    <Modal
      opened={openedModal}
      onClose={() => setOpenedModal(false)}
      centered
      size={'xl'}
      withCloseButton={false}
    >
      <DropzoneProfileSettings files={newImages} setFiles={setNewImages} />
      <Grid mb={'md'}>
        {newImages && newImages.map((image: any, index: number) => (
          <Grid.Col key={image.filename + '' + index}
                    sm={6} md={4} lg={3} xl={3}
                    style={{ position: 'relative' }}
          >
            <Image
              radius='md'
              height={150}
              alt={`file preview ${index}`}
              src={URL.createObjectURL(image)}
            />
            <ActionIcon
              color={'red'}
              radius={50}
              size={20}
              onClick={() => handlerRemoveNewImage(image.name)}
              style={{ position: 'absolute', bottom: '15px', left: '45%' }}
              variant={'filled'}
            >
              <Cross2Icon style={{ width: '15px', height: '15px' }} />
            </ActionIcon>
          </Grid.Col>
        ))}
      </Grid>
      <Group position={'right'}>
        <Button onClick={handlerSubmit}>
          Save
        </Button>
        <Button color={'red'}
                onClick={handlerClear}
        >
          Close
        </Button>
      </Group>
    </Modal>
  );
}

export default AddNewImagesModal;
