import React, {useMemo, useState} from 'react';
import {Button, Group, Modal, Textarea} from "@mantine/core";

function MarkerSetModal({openedMarkerModal, setOpenedMarkerModal, segmentControl, handlerCreateMarker}: any) {
  const [placeDescription, setPlaceDescription] = useState<any>('')

  return <Modal
    opened={openedMarkerModal && segmentControl == 'markers'}
    onClose={() => setOpenedMarkerModal(false)}
    withCloseButton={false}
    centered
  >
    {useMemo(() =>
      <Textarea
        value={placeDescription}
        onChange={(event) => setPlaceDescription(event.currentTarget.value)}
        placeholder="Description"
        autosize
        minRows={2}
        maxRows={4}
        mb={'md'}
      />, [placeDescription])}

    <Group grow position={'center'}>
      <Button
        color={'pink'}
        onClick={() => {
          setPlaceDescription('')
          handlerCreateMarker(placeDescription)
        }}
      >
        Set
      </Button>
      <Button
        variant={'outline'}
        color={'blue'}
        onClick={() => {
          setPlaceDescription('');
          setOpenedMarkerModal(false);
        }}
      >
        Close
      </Button>
    </Group>
  </Modal>
}

export default MarkerSetModal;
