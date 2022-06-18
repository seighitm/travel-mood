import React, { Dispatch, useMemo, useState } from 'react';
import { Button, Group, Modal, Progress, Textarea } from '@mantine/core';
import { getHotkeyHandler } from '@mantine/hooks';
import { Check, X } from '../../common/Icons';

interface MarkerSetModalComponentProps {
  openedMarkerModal: boolean;
  setOpenedMarkerModal: Dispatch<React.SetStateAction<any>>;
  handlerCreateMarker: (desc: any) => void;
}

function MarkerSetModal({
  openedMarkerModal,
  setOpenedMarkerModal,
  handlerCreateMarker,
}: MarkerSetModalComponentProps) {
  const [placeDescription, setPlaceDescription] = useState<string>('');
  const MAX_CHARACTER_LENGTH: number = 150;

  return (
    <Modal
      opened={openedMarkerModal}
      onClose={() => setOpenedMarkerModal(false)}
      withCloseButton={false}
      centered
    >
      {useMemo(
        () => (
          <Textarea
            value={
              placeDescription?.length <= MAX_CHARACTER_LENGTH
                ? placeDescription
                : placeDescription.slice(0, MAX_CHARACTER_LENGTH)
            }
            onChange={(event) => setPlaceDescription(event.currentTarget.value)}
            placeholder="Description"
            autosize
            mb={'xs'}
            minRows={2}
            maxRows={4}
            onKeyDown={getHotkeyHandler([
              [
                'Enter',
                () => {
                  setPlaceDescription('');
                  handlerCreateMarker(placeDescription);
                },
              ],
            ])}
          />
        ),
        [placeDescription]
      )}
      <Progress
        size="lg"
        striped
        animate
        value={(placeDescription.length * 100) / MAX_CHARACTER_LENGTH}
        color={placeDescription.length <= MAX_CHARACTER_LENGTH ? 'teal' : 'red'}
      />
      <Group mt={'xs'} grow position={'center'}>
        <Button
          color={'blue'}
          leftIcon={<Check size={17} />}
          onClick={() => {
            setPlaceDescription('');
            handlerCreateMarker(placeDescription.slice(0, MAX_CHARACTER_LENGTH));
          }}
        >
          Set
        </Button>
        <Button
          leftIcon={<X size={17} />}
          variant={'outline'}
          color={'pink'}
          onClick={() => {
            setPlaceDescription('');
            setOpenedMarkerModal(false);
          }}
        >
          Close
        </Button>
      </Group>
    </Modal>
  );
}

export default MarkerSetModal;
