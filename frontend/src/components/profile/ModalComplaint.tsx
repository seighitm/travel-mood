import React, {useMemo, useRef, useState} from 'react';
import {ActionIcon, Button, Group, Image, LoadingOverlay, Modal, Textarea} from '@mantine/core';
import {Check, Upload, X} from '../common/Icons';
import {useMutateSendComplaint} from '../../api/users/mutations';
import {isNullOrUndefined} from '../../utils/primitive-checks';

interface ModalComplaintComponentProps {
  profileId: string | number | undefined;
  isOpenedComplaintModal: boolean;
  setIsOpenedComplaintModal: any
}

function ModalComplaint({
                          profileId,
                          isOpenedComplaintModal,
                          setIsOpenedComplaintModal,
                        }: ModalComplaintComponentProps) {
  const openRef = useRef<any>();
  const [reason, setReason] = useState<string>('');
  const [image, setImage] = useState<string | Blob | any>(null);

  const {mutate: mutateSendComplaint, isLoading: isLoadingSendComplaint} = useMutateSendComplaint(
    {
      profileId: profileId,
      onSuccessEvent: () => {
        setIsOpenedComplaintModal(false);
        setReason('');
        setImage(null);
      },
    }
  );

  const handlerSubmit = () => {
    const formData = new FormData();
    formData.append('image', image);
    formData.append('reason', reason);
    mutateSendComplaint(formData);
  };

  const handlerRemoveImage = () => {
    setImage(null);
    openRef.current.value = '';
  };

  return (
    <Modal
      opened={isOpenedComplaintModal}
      onClose={() => {
        handlerRemoveImage();
        setReason('');
        setIsOpenedComplaintModal(false);
      }}
      centered
      withCloseButton={false}
      styles={{
        modal: {
          paddingTop: '10px!important',
          paddingBottom: '10px!important',
        },
      }}
    >
      <LoadingOverlay visible={isLoadingSendComplaint}/>
      <input
        style={{display: 'none'}}
        onChange={(e: any) => setImage(e.target.files[0])}
        ref={openRef}
        type={'file'}
      />
      <Textarea
        placeholder="Enter description..."
        label="Description"
        autosize
        minRows={2}
        maxRows={4}
        mb="md"
        value={reason}
        onChange={(event) => setReason(event.currentTarget.value)}
      />

      <Button
        mb={'sm'}
        color={'pink'}
        rightIcon={<Upload size={20}/>}
        fullWidth
        variant={'outline'}
        onClick={() => openRef.current.click()}
      >
        Upload image
      </Button>

      {useMemo(
        () => (
          <Group style={{position: 'relative'}}>
            {!isNullOrUndefined(image) && isOpenedComplaintModal && (
              <>
                <Image src={URL.createObjectURL(image)} withPlaceholder/>
                <ActionIcon
                  radius={'xl'}
                  variant={'filled'}
                  color={'red'}
                  style={{position: 'absolute', top: '15px', right: '15px'}}
                  onClick={handlerRemoveImage}
                >
                  <X size={20}/>
                </ActionIcon>
              </>
            )}
          </Group>
        ),
        [image]
      )}

      <Button mt={'xs'} rightIcon={<Check size={20}/>} fullWidth onClick={handlerSubmit}>
        Send
      </Button>
    </Modal>
  );
}

export default ModalComplaint;
