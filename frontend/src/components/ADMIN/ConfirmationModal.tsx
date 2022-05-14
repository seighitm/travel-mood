import React from 'react';
import {Button, Group, Modal, Title} from "@mantine/core";

function ConfirmationModal({handler, isOpenModal, modalHandler}: any) {
  return (
    <div>
      <Modal
        centered
        opened={isOpenModal}
        onClose={() => modalHandler.close()}
        withCloseButton={false}
      >
        <Title mb={'md'} align={'center'} order={3}>
          You are sure ?
        </Title>
        <Group position={'center'}>
          <Button onClick={handler} variant={'filled'} color={'red'}>
            Yes
          </Button>
          <Button onClick={() => modalHandler.close()} variant={'subtle'} color={'green'}>
            No
          </Button>
        </Group>
      </Modal>
    </div>
  );
}

export default ConfirmationModal;
