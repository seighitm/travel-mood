import React, {useRef, useState} from 'react';
import {ActionIcon, Button, Group, Image, Modal, Textarea} from "@mantine/core";
import {Check, Upload, X} from "../../assets/Icons";
import {useMutateSendComplaint} from "../../api/users/mutations";
import useStore from "../../store/user.store";
import {isNullOrUndefined} from "../../utils/primitive-checks";

function ModalComplaint({profileId, openedComplaintModal, handlersComplaintModal}: any) {
  const [reason, setReason] = useState<string>('')
  const [image, setImage] = useState<any>(null)
  const {user} = useStore((state: any) => state);

  const {mutate: mutateSendComplaint} = useMutateSendComplaint({profileId: profileId})

  const openRef = useRef<any>();

    console.log(reason)
  const handlerSubmit = () => {
    const formData = new FormData()
    formData.append('image', image);
    formData.append('reason', reason);
    mutateSendComplaint(formData)
  }

  const handlerRemoveImage = () => {
    setImage(null)
    openRef.current.value = '';
  }

  return (
    <Modal
      opened={openedComplaintModal}
      onClose={() => {
        handlerRemoveImage()
        setReason('')
        handlersComplaintModal.close()
      }}
      centered
      withCloseButton={false}
      styles={{
        modal: {
          paddingTop: '10px!important',
          paddingBottom: '10px!important'
        }
      }}
    >
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

      <Button rightIcon={<Upload size={20}/>} fullWidth variant={'outline'} onClick={() => openRef.current.click()}>
        Upload image
      </Button>

      {!isNullOrUndefined(image) && openedComplaintModal &&
        <Group style={{position: 'relative'}}>
          <Image src={URL.createObjectURL(image)} withPlaceholder/>
          <ActionIcon radius={'xl'} variant={'filled'} color={'red'} style={{position: 'absolute', top: '30px', right: '30px'}}>
            <X size={20}/>
          </ActionIcon>
        </Group>
      }

      <Button rightIcon={<Check size={20}/>}
              fullWidth
              onClick={handlerSubmit}
      >
        Send
      </Button>
    </Modal>
  );
}

export default ModalComplaint;
