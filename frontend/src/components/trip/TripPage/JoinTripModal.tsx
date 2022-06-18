import React, {useState} from 'react';
import {Button, Group, Modal, Textarea} from '@mantine/core';
import {Send} from '../../common/Icons';
import {useMutateJoinToTrip} from '../../../api/trips/join-requests/mutations';

interface MarkerSetModalComponentProps {
  isOpenedJoinModal: boolean;
  setIsOpenedJoinModal: any;
  tripId: number | string;
  userId: number | string;
  receiveUserId: number | string;
}

function JoinTripModal({
                         isOpenedJoinModal,
                         setIsOpenedJoinModal,
                         tripId,
                         userId,
                         receiveUserId,
                       }: MarkerSetModalComponentProps) {
  const [comment, setJoinComment] = useState<string>('');
  const {mutate: mutateJoinToTrip, isLoading} = useMutateJoinToTrip();

  const handlerJoinTrip = () => {
    mutateJoinToTrip({userId, tripId, comment, receiveUserId, typeOfRequest: 'JOIN'});
  };

  return (
    <Modal
      opened={isOpenedJoinModal}
      onClose={() => setIsOpenedJoinModal(false)}
      centered
      withCloseButton={false}
    >
      <Group spacing={'xs'} position={'center'} direction={'column'}>
        <Textarea
          p={0}
          m={0}
          style={{width: '100%'}}
          value={comment}
          onChange={(e: any) => setJoinComment(e.target.value)}
          placeholder="Enter comment"
          autosize
          minRows={3}
          maxRows={5}
        />
        <Button
          disabled={isLoading}
          loading={isLoading}
          fullWidth
          rightIcon={<Send size={15}/>}
          onClick={() => {
            handlerJoinTrip();
            setIsOpenedJoinModal(false);
          }}
        >
          Send request
        </Button>
      </Group>
    </Modal>
  );
}

export default JoinTripModal;
