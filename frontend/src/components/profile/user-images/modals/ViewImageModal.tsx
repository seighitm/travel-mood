import React from 'react';
import { Image, Modal } from '@mantine/core';

function ViewImageModal({openedModalViewImage, setOpenedModalViewImage, selectedViewImage}: any) {
  return (
    <Modal
      opened={openedModalViewImage}
      onClose={() => setOpenedModalViewImage(false)}
      centered
      size={'xl'}
    >
      <Image
        radius='md'
        src={
          selectedViewImage != null
            ? `${import.meta.env.VITE_STORE_AWS}${selectedViewImage}`
            : undefined
        } />
    </Modal>
  );
}

export default ViewImageModal;
