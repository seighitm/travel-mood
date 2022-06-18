import React, { Dispatch } from 'react';
import { Image, Modal } from '@mantine/core';

interface ViewImageModalComponentProps {
  openedModalViewImage: boolean;
  setOpenedModalViewImage: Dispatch<React.SetStateAction<any>>;
  selectedViewImage: any;
}

function ViewImageModal({
  openedModalViewImage,
  setOpenedModalViewImage,
  selectedViewImage,
}: ViewImageModalComponentProps) {
  return (
    <Modal
      opened={openedModalViewImage}
      onClose={() => setOpenedModalViewImage(false)}
      centered
      size={'xl'}
    >
      <Image
        radius="md"
        caption={selectedViewImage ? selectedViewImage?.caption : undefined}
        src={
          selectedViewImage != null
            ? `${import.meta.env.VITE_STORE_AWS}${selectedViewImage?.image}`
            : undefined
        }
      />
    </Modal>
  );
}

export default ViewImageModal;
