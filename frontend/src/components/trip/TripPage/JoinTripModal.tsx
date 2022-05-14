import React, {useState} from 'react';
import {Button, Group, Modal, Textarea} from "@mantine/core";
import {PaperPlaneIcon} from "@modulz/radix-icons";
import {useMutateJoinToTrip} from "../../../api/trips/mutations";

function JoinTripModal({openedJoinModal, handlersJoinModal, tripId, userId}: any) {
  const [comment, setJoinComment] = useState<string>('');
  const {mutate: mutateJoinToTrip} = useMutateJoinToTrip();

  const handlerJoinTrip = () => {
    mutateJoinToTrip({userId, tripId, comment});
  };

  return <Modal
    opened={openedJoinModal}
    onClose={() => handlersJoinModal.close()}
    centered
    withCloseButton={false}
  >
    <Group position={'center'} direction={'column'}>
      <Textarea
        p={0}
        m={0}
        style={{width: '100%'}}
        value={comment}
        onChange={(e: any) => setJoinComment(e.target.value)}
        placeholder="Your comment"
        autosize
        minRows={5}
        maxRows={5}
      />
      <Button
        rightIcon={<PaperPlaneIcon/>}
        onClick={() => {
          handlerJoinTrip();
          handlersJoinModal.close()
        }}
      >
        Send request
      </Button>
    </Group>
  </Modal>
}

export default JoinTripModal;
