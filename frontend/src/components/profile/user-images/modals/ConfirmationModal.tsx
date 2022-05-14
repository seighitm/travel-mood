import React from 'react';
import {Button, Group, Modal, Text} from '@mantine/core';

function ConfirmationModal({openedConfirmationModal, setOpenedConfirmationModal, handlerSubmit}: any) {
  return (
    <Modal
      opened={openedConfirmationModal}
      onClose={() => setOpenedConfirmationModal(false)}
      centered
      withCloseButton={false}
    >
      <Text size={'xl'} weight={700} align={'center'}>
        Are you sure?
      </Text>
      <Group mt={'md'} position={'center'}>
        <Button onClick={() => setOpenedConfirmationModal(false)}
                variant={'subtle'} color={'red'}>
          No
        </Button>
        <Button variant={'light'} onClick={() => {
          setOpenedConfirmationModal(false);
          handlerSubmit();
        }}
        >
          Yes
        </Button>
      </Group>
    </Modal>
  );
}

export default ConfirmationModal;
